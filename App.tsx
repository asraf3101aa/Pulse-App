import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import LoginScreen from 'screens/LoginScreen';
import RegisterScreen from 'screens/RegisterScreen';
import WelcomeScreen from 'screens/WelcomeScreen';
import { AuthProvider, useAuth } from 'context/AuthContext';
import { authApi } from 'api/auth';
// NativeWind dark mode is configured in tailwind.config.js
import { useTheme } from 'hooks/useTheme';

import './global.css';

// Create a client
const queryClient = new QueryClient();

import { RegisterCredentials } from 'api/types';

function AppContent() {
  const { theme } = useTheme();
  const { isLoggedIn, login } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');

  const loginMutation = useMutation({
    mutationFn: (credentials: { identifier: string; password?: string }) =>
      authApi.login(credentials),
    onSuccess: (data) => {
      login(data.user, data.tokens);
    },
    onError: (error: any) => {
      console.error('Login Error:', error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authApi.register(credentials),
    onSuccess: (data) => {
      login(data.user, data.tokens);
    },
    onError: (error: any) => {
      console.error('Registration Error:', error);
    },
  });

  if (isLoggedIn) {
    return (
      <>
        <WelcomeScreen />
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </>
    );
  }

  return (
    <>
      {currentScreen === 'login' ? (
        <LoginScreen
          onLogin={(identifier, password) => loginMutation.mutate({ identifier, password })}
          onGoToRegister={() => {
            loginMutation.reset();
            setCurrentScreen('register');
          }}
          isLoading={loginMutation.isPending}
          error={(loginMutation.error as any)?.message}
          fieldErrors={(loginMutation.error as any)?.errors}
        />
      ) : (
        <RegisterScreen
          onRegister={(data) => registerMutation.mutate(data)}
          onGoToLogin={() => {
            registerMutation.reset();
            setCurrentScreen('login');
          }}
          isLoading={registerMutation.isPending}
          error={(registerMutation.error as any)?.message}
          fieldErrors={(registerMutation.error as any)?.errors}
        />
      )}
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}
