import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './context/UserContext';
import { AlertProvider } from './context/AlertContext';
import { LanguageProvider } from './context/LanguageContext';
import { AudioGuideProvider } from './context/AudioGuideContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <LanguageProvider>
        <UserProvider>
          <AlertProvider>
            <AudioGuideProvider>
              <AppNavigator />
            </AudioGuideProvider>
          </AlertProvider>
        </UserProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
