import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

const TABS: { key: string; label: string; active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'Home', label: 'Inicio', active: 'home', inactive: 'home-outline' },
  { key: 'Discover', label: 'Explorar', active: 'compass', inactive: 'compass-outline' },
  { key: 'Routes', label: 'Rutas', active: 'map', inactive: 'map-outline' },
  { key: 'ARView', label: 'Cámara', active: 'camera', inactive: 'camera-outline' },
  { key: 'History', label: 'Historial', active: 'time', inactive: 'time-outline' },
  { key: 'Profile', label: 'Perfil', active: 'person', inactive: 'person-outline' },
];

export default function BottomTabBar({ active }: { active?: string }) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.bar}>
      {TABS.map(tab => {
        const focused = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.item, focused && styles.itemActive]}
            onPress={() => navigation.navigate('Main', { screen: tab.key })}
          >
            <Ionicons name={focused ? tab.active : tab.inactive} size={22} color={focused ? colors.green : colors.gray500} />
            <Text style={[styles.label, { color: focused ? colors.green : colors.gray500 }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    height: 68,
    paddingTop: 6,
    paddingBottom: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginHorizontal: 1,
    marginVertical: 5,
  },
  itemActive: {
    backgroundColor: colors.badgeYellow,
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
});
