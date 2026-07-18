import { useState } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabs from './MainTabs';
import ResultadoScreen from '../screens/ResultadoScreen';
import AudioguiaScreen from '../screens/AudioguiaScreen';
import AsistenteScreen from '../screens/AsistenteScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EmergenciaScreen from '../screens/EmergenciaScreen';
import RecorridoScreen from '../screens/RecorridoScreen';
import RecorridoEnCursoScreen from '../screens/RecorridoEnCursoScreen';
import MiniAudioPlayer from '../components/MiniAudioPlayer';
import MiniTourBar from '../components/MiniTourBar';
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
      {/* Iniciamos en Splash para que cargue la app correctamente */}
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Resultado" component={ResultadoScreen} />
        <Stack.Screen name="Audioguia" component={AudioguiaScreen} />
        <Stack.Screen name="Asistente" component={AsistenteScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Emergencia" component={EmergenciaScreen} />
        <Stack.Screen name="Recorrido" component={RecorridoScreen} />
        <Stack.Screen name="RecorridoEnCurso" component={RecorridoEnCursoScreen} />
      </Stack.Navigator>

      {/* Mini reproductor de audio flotante */}
      <MiniAudioPlayer
        currentRouteName={currentRouteName}
        onExpand={(params) => navigationRef.navigate('Audioguia', params)}
      />

      {/* Mini barra de recorrido activo */}
      <MiniTourBar
        currentRouteName={currentRouteName}
        onExpand={() => navigationRef.navigate('RecorridoEnCurso')}
      />
    </NavigationContainer>
  );
}