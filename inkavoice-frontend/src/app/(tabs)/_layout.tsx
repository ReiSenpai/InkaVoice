import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { colors } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage(); // Importamos las traducciones
  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.gray500,
        tabBarStyle: {
          height: 65 + bottomPad,
          paddingTop: 8,
          paddingBottom: bottomPad + 4,
          borderTopColor: colors.gray100,
          backgroundColor: colors.white,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab_home') || 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'compass' : 'compass-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rutas"
        options={{
          title: t('tab_routes') || 'Rutas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'analytics' : 'analytics-outline'} size={24} color={color} />
          ),
        }}
      />
      
      {/* Tu excelente botón central flotante para AR View */}
      <Tabs.Screen
        name="camera" // O "camara" según como tengas nombrado el archivo físico
        options={{
          title: t('tab_arview') || 'Cámara',
          tabBarIcon: ({ focused }) => (
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: colors.gold,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10, // Eleva el botón ligeramente
            }}>
              <Ionicons name={focused ? 'scan' : 'scan-outline'} size={26} color={colors.greenDark} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="historial"
        options={{
          title: t('tab_history') || 'Historial',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'time' : 'time-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: t('tab_profile') || 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}