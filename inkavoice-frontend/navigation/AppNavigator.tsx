import { useState } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabs from './MainTabs';
import ResultadoScreen from '../screens/ResultadoScreen';
import AudioguiaScreen from '../screens/AudioguiaScreen';
import AsistenteScreen from '../screens/AsistenteScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MiniAudioPlayer from '../components/MiniAudioPlayer';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const [currentRouteName, setCurrentRouteName] = useState<string | undefined>();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => setCurrentRouteName(navigationRef.getCurrentRoute()?.name)}
      onStateChange={() => setCurrentRouteName(navigationRef.getCurrentRoute()?.name)}
    >
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }} initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Resultado" component={ResultadoScreen} />
        <Stack.Screen name="Audioguia" component={AudioguiaScreen} />
        <Stack.Screen name="Asistente" component={AsistenteScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>

      {/* Flota encima de cualquier pantalla del stack mientras haya
          una audioguía activa (sonando o en pausa). Usa navigationRef
          en vez de useNavigation() porque este componente vive fuera
          del Stack.Navigator. */}
      <MiniAudioPlayer
        currentRouteName={currentRouteName}
        onExpand={(params) => navigationRef.navigate('Audioguia', params)}
      />
    </NavigationContainer>
  );
}