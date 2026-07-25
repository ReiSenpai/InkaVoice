import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const TABS: { key: string; labelKey: string; active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'Home', labelKey: 'tab_home', active: 'home', inactive: 'home-outline' },
  { key: 'Discover', labelKey: 'tab_discover', active: 'compass', inactive: 'compass-outline' },
  { key: 'Routes', labelKey: 'tab_routes', active: 'map', inactive: 'map-outline' },
  { key: 'ARView', labelKey: 'tab_arview', active: 'camera', inactive: 'camera-outline' },
  { key: 'History', labelKey: 'tab_history', active: 'time', inactive: 'time-outline' },
  { key: 'Profile', labelKey: 'tab_profile', active: 'person', inactive: 'person-outline' },
];

export default function BottomTabBar({ active }: { active?: string }) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);
  const { colors } = useTheme();
  const { t } = useLanguage();

  const C = {
    white: colors.white,
    green: '#00332D', // Verde exacto del mockup
    gold: '#C9A84C', // Color de iconos/texto inactivo
    badge: '#FCD34D', // Color de fondo activo unificado
    border: colors.gray100,
  };

  return (
    <View style={[styles.bar, { height: 60 + bottomPad, paddingBottom: bottomPad, backgroundColor: C.white, borderTopColor: C.border }]}>
      {TABS.map(tab => {
        const focused = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.item}
            onPress={() => navigation.navigate('Main', { screen: tab.key })}
          >
            {/* Fondo activo estilizado circular de la versión anterior */}
            <View style={[styles.activePill, focused && { backgroundColor: C.badge }]}>
              <Ionicons name={focused ? tab.active : tab.inactive} size={22} color={focused ? C.green : C.gold} />
              <Text style={[styles.label, { color: focused ? C.green : C.gold }]}>{t(tab.labelKey)}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', paddingTop: 6, borderTopWidth: 1 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  label: { fontSize: 9, fontWeight: '700', marginTop: 2, textAlign: 'center' },
});