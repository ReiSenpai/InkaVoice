import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import { colors } from '../theme/colors';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Discover: '🧭',
    Routes: '〰',
    ARView: '◎',
    History: '🕐',
    Profile: '👤',
  };
  return (
    <Text style={{ fontSize: focused ? 18 : 16, opacity: focused ? 1 : 0.6 }}>
      {icons[label]}
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
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarActiveBackgroundColor: colors.badgeYellow,
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 4,
          marginVertical: 6,
        },
      })}
    >
      <Tab.Screen
        name="Discover"
        component={HomeScreen}
        options={{ tabBarLabel: 'Discover' }}
      />
      <Tab.Screen
        name="Routes"
        options={{ tabBarLabel: 'Routes' }}
      >
        {() => <PlaceholderScreen title="Routes" subtitle="Rutas turísticas próximamente" />}
      </Tab.Screen>
      <Tab.Screen
        name="ARView"
        options={{ tabBarLabel: 'AR View' }}
      >
        {() => <PlaceholderScreen title="AR View" subtitle="Vista aumentada próximamente" />}
      </Tab.Screen>
      <Tab.Screen
        name="History"
        options={{ tabBarLabel: 'History' }}
      >
        {() => <PlaceholderScreen title="History" subtitle="Tu historial de viajes" />}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{ tabBarLabel: 'Profile' }}
      >
        {() => <PlaceholderScreen title="Profile" subtitle="Tu perfil de viajero" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
