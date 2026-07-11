import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './context/UserContext';
import { AudioGuideProvider } from './context/AudioGuideContext';
 
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <UserProvider>
        <AudioGuideProvider>
          <AppNavigator />
        </AudioGuideProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
 