import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './context/UserContext';
import { AlertProvider } from './context/AlertContext';
import { LanguageProvider } from './context/LanguageContext';
import { AudioGuideProvider } from './context/AudioGuideContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <UserProvider>
            <AlertProvider>
              <AudioGuideProvider>
                <AppContent />
              </AudioGuideProvider>
            </AlertProvider>
          </UserProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
