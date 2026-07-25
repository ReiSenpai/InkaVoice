import React from 'react';
import { Stack, usePathname, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Componentes Globales
import MiniAudioPlayer from '../components/MiniAudioPlayer';
import MiniTourBar from '../components/MiniTourBar';

// Contextos
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { UserProvider } from '../context/UserContext';
import { AudioGuideProvider } from '../context/AudioGuideContext';
import { TourProvider } from '../context/TourContext';
import { AlertProvider } from '../context/AlertContext';

// Un pequeño componente para manejar el color del StatusBar según el tema
function ThemeStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemeStatusBar />
        <LanguageProvider>
          <UserProvider>
            <AlertProvider>
              <AudioGuideProvider>
                <TourProvider>
                  
                  {/* Expo Router maneja todas tus pantallas automáticamente */}
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="welcome" />
                    <Stack.Screen name="login" />
                    <Stack.Screen name="register" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="resultado" />
                    <Stack.Screen name="audioguia" />
                    <Stack.Screen name="asistente" />
                    <Stack.Screen name="settings" />
                    <Stack.Screen name="emergencia" />
                    <Stack.Screen name="descargas" />
                    <Stack.Screen name="recorrido-en-curso" />
                  </Stack>

                  {/* Componentes Flotantes Globales */}
                  <MiniAudioPlayer 
                    currentRouteName={pathname} 
                    onExpand={(params) => router.push({ pathname: '/audioguia', params: params as any })}
                  />
                  
                  <MiniTourBar 
                    currentRouteName={pathname} 
                    onExpand={() => router.push('/recorrido-en-curso')}
                  />

                </TourProvider>
              </AudioGuideProvider>
            </AlertProvider>
          </UserProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}