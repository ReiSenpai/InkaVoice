import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import MapaScreen from '../screens/MapaScreen';
import CameraScreen from '../screens/CameraScreen';
import RecorridoScreen from '../screens/RecorridoScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_KEYS: Record<string, string> = {
  Home: 'tab_home',
  Discover: 'tab_discover',
  Routes: 'tab_routes',
  ARView: 'tab_arview',
  History: 'tab_history',
  Profile: 'tab_profile',
};

const ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Discover: { active: 'compass', inactive: 'compass-outline' },
  Routes: { active: 'map', inactive: 'map-outline' },
  ARView: { active: 'camera', inactive: 'camera-outline' },
  History: { active: 'time', inactive: 'time-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

export default function MainTabs() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.gray500,
        tabBarStyle: {
          height: 56 + bottomPad,
          paddingTop: 6,
          paddingBottom: bottomPad,
          borderTopColor: colors.gray100,
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarLabel: t(TAB_KEYS[route.name] ?? route.name),
        tabBarIcon: ({ focused, color, size }) => {
          const icon = ICONS[route.name];
          if (!icon) return null;
          return <Ionicons name={focused ? icon.active : icon.inactive} size={size ?? 22} color={color} />;
        },
        tabBarActiveBackgroundColor: colors.badgeYellow,
        tabBarItemStyle: {
          borderRadius: 14,
          marginHorizontal: 1,
          marginVertical: 5,
          paddingHorizontal: 0,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={MapaScreen} />
      <Tab.Screen name="Routes" component={RecorridoScreen} />
      <Tab.Screen name="ARView" component={CameraScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
