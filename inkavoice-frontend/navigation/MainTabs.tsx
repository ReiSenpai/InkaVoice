import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MapaScreen from '../screens/MapaScreen';
import CameraScreen from '../screens/CameraScreen';
import RecorridoScreen from '../screens/RecorridoScreen';
import ResultadoScreen from '../screens/ResultadoScreen';
import AudioguiaScreen from '../screens/AudioguiaScreen';
import AsistenteScreen from '../screens/AsistenteScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import { colors } from '../theme/colors';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Home: '🏠',
    Discover: '🧭',
    Routes: '〰',
    ARView: '◎',
    History: '🕐',
    Profile: '👤',
  };
  return (
    <Text style={{ fontSize: focused ? 18 : 16, opacity: focused ? 1 : 0.6 }}>
      {icons[label] ?? ''}
    </Text>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.gray500,
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 12,
          borderTopColor: colors.gray100,
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarActiveBackgroundColor: colors.badgeYellow,
        tabBarItemStyle: { borderRadius: 16, marginHorizontal: 4, marginVertical: 6 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Discover" component={MapaScreen} options={{ tabBarLabel: 'Discover' }} />
      <Tab.Screen name="Routes" component={RecorridoScreen} options={{ tabBarLabel: 'Routes' }} />
      <Tab.Screen name="ARView" component={CameraScreen} options={{ tabBarLabel: 'AR View' }} />
      <Tab.Screen name="History" options={{ tabBarLabel: 'History' }}>
        {() => <PlaceholderScreen title="History" subtitle="Tu historial de viajes" />}
      </Tab.Screen>
      <Tab.Screen name="Profile" options={{ tabBarLabel: 'Profile' }}>
        {() => <PlaceholderScreen title="Profile" subtitle="Tu perfil de viajero" />}
      </Tab.Screen>

      {/* Pantallas alcanzables por navegación, ocultas de la barra de tabs */}
      <Tab.Screen name="Resultado" component={ResultadoScreen} options={{ tabBarButton: () => null }} />
      <Tab.Screen name="Audioguia" component={AudioguiaScreen} options={{ tabBarButton: () => null }} />
      <Tab.Screen name="Asistente" component={AsistenteScreen} options={{ tabBarButton: () => null }} />
    </Tab.Navigator>
  );
}
