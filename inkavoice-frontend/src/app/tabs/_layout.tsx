import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false, 
      tabBarActiveTintColor: '#8B6914',
      tabBarStyle: { backgroundColor: '#FFFFFF', height: 60 } 
    }}>
      <Tabs.Screen name="mapa" options={{ title: 'Mapa', tabBarIcon: ({color}) => <Ionicons name="compass" size={28} color={color}/> }} />
      <Tabs.Screen name="camera" options={{ title: 'AR View', tabBarIcon: ({color}) => <Ionicons name="camera" size={28} color={color}/> }} />
      
      {/* Estas pantallas NO aparecen en los Tabs, solo se navega a ellas */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="resultado" options={{ href: null }} />
      <Tabs.Screen name="audioguia" options={{ href: null }} />
      <Tabs.Screen name="asistente" options={{ href: null }} />
      <Tabs.Screen name="recorrido" options={{ href: null }} />
    </Tabs>
  );
}