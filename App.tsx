import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from 'screens/LoginScreen';
import RegisterScreen from 'screens/RegisterScreen';
import FeedScreen from 'screens/FeedScreen';
import CreateThreadScreen from 'screens/CreateThreadScreen';
import SettingScreen from 'screens/SettingScreen';
import { AuthProvider } from 'context/AuthContext';
import { useAuth } from 'hooks/useAuth';

import { useTheme } from 'hooks/useTheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './global.css';

// Create a client
const queryClient = new QueryClient();

function AppContent() {
  const { theme } = useTheme();
  const {
    isLoggedIn,
    isLoading,
  } = useAuth();

  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (isLoading) {
    return null; // Or a splash screen component
  }

  if (isLoggedIn) {
    if (isCreatingThread) {
      return (
        <>
          <CreateThreadScreen onClose={() => setIsCreatingThread(false)} />
          <StatusBar style="auto" />
        </>
      );
    }

    if (showSettings) {
      return (
        <>
          <SettingScreen
            onBack={() => setShowSettings(false)}
            onGoToHome={() => setShowSettings(false)}
          />
          <StatusBar style="auto" />
        </>
      );
    }

    return (
      <>
        <FeedScreen
          onCreateThread={() => setIsCreatingThread(true)}
          onOpenSettings={() => setShowSettings(true)}
        />
        <StatusBar style="auto" />
      </>
    );
  }

  return (
    <>
      {currentScreen === 'login' ? (
        <LoginScreen
          onGoToRegister={() => {
            setCurrentScreen('register');
          }}
        />
      ) : (
        <RegisterScreen
          onGoToLogin={() => {
            setCurrentScreen('login');
          }}
        />
      )}
      <StatusBar style="auto" />
    </>
  );
}


export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
