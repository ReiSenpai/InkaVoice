import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const TABS: { key: string; labelKey: string; active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'index', labelKey: 'tab_home', active: 'home', inactive: 'home-outline' },
  { key: 'discover', labelKey: 'tab_discover', active: 'compass', inactive: 'compass-outline' },
  { key: 'routes', labelKey: 'tab_routes', active: 'map', inactive: 'map-outline' },
  { key: 'arview', labelKey: 'tab_arview', active: 'camera', inactive: 'camera-outline' },
  { key: 'history', labelKey: 'tab_history', active: 'time', inactive: 'time-outline' },
  { key: 'profile', labelKey: 'tab_profile', active: 'person', inactive: 'person-outline' },
];

export default function BottomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);
  const { colors } = useTheme();
  const { t } = useLanguage();

  const C = {
    white: colors.white || '#FFFFFF',
    green: '#00332D', // Verde exacto del mockup
    gold: '#C9A84C', // Color de iconos/texto inactivo
    badge: '#FCD34D', // Color de fondo activo unificado
    border: colors.gray100 || '#E5E7EB',
  };

  return (
    <View style={[styles.bar, { height: 60 + bottomPad, paddingBottom: bottomPad, backgroundColor: C.white, borderTopColor: C.border }]}>
      {TABS.map((tab, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[index].key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(state.routes[index].name, state.routes[index].params);
          }
        };

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.item}
            onPress={onPress}
          >
            {/* Diseño intacto: Fondo activo estilizado circular de la versión anterior */}
            <View style={[styles.activePill, isFocused && { backgroundColor: C.badge }]}>
              <Ionicons name={isFocused ? tab.active : tab.inactive} size={22} color={isFocused ? C.green : C.gold} />
              {/* Diseño intacto: El texto siempre se muestra, solo cambia de color */}
              <Text style={[styles.label, { color: isFocused ? C.green : C.gold }]}>{t(tab.labelKey)}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Estilos 100% idénticos a los tuyos
const styles = StyleSheet.create({
  bar: { flexDirection: 'row', paddingTop: 6, borderTopWidth: 1 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  label: { fontSize: 9, fontWeight: '700', marginTop: 2, textAlign: 'center' },
});