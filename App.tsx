import React, { useState } from 'react';
import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from 'screens/LoginScreen';

import './global.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen onLogin={() => setIsLoggedIn(true)} />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <>
      <ScreenContent title="Home" path="App.tsx"></ScreenContent>
      <StatusBar style="auto" />
    </>
  );
}
