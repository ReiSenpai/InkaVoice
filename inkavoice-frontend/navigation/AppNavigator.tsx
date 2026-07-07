import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabs from './MainTabs';
import ResultadoScreen from '../screens/ResultadoScreen';
import AudioguiaScreen from '../screens/AudioguiaScreen';
import AsistenteScreen from '../screens/AsistenteScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Resultado" component={ResultadoScreen} />
        <Stack.Screen name="Audioguia" component={AudioguiaScreen} />
        <Stack.Screen name="Asistente" component={AsistenteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
