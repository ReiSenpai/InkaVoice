import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';

// Componente personalizado para lograr el diseño idéntico al Figma
function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const bottomPad = Math.max(insets.bottom, 10);

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: bottomPad }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };

        // Asignación de íconos según la ruta
        let iconName = 'compass-outline';
        if (route.name === 'index') iconName = isFocused ? 'compass' : 'compass-outline';
        if (route.name === 'rutas') iconName = 'git-network-outline';
        // Usamos el cubo para simular el ícono de RA (Realidad Aumentada) que se ve en la imagen
        if (route.name === 'camera') iconName = isFocused ? 'cube' : 'cube-outline'; 
        if (route.name === 'historial') iconName = isFocused ? 'time' : 'time-outline';
        if (route.name === 'perfil') iconName = isFocused ? 'person' : 'person-outline';

        // Obtenemos el nombre traducido
        let labelKey = 'tab_home';
        if (route.name === 'rutas') labelKey = 'tab_routes';
        if (route.name === 'camera') labelKey = 'tab_arview';
        if (route.name === 'historial') labelKey = 'tab_history';
        if (route.name === 'perfil') labelKey = 'tab_profile';

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem} activeOpacity={0.8}>
            {/* Si está activo, aplicamos el fondo amarillo redondeado como en "Cámara RA (Perú).jpg" */}
            <View style={[styles.tabContent, isFocused && styles.activeTabContent]}>
              <Ionicons 
                name={iconName as any} 
                size={24} 
                color={isFocused ? colors.greenDark : colors.gray500} 
              />
              <Text style={[styles.tabLabel, { color: isFocused ? colors.greenDark : colors.gray500 }]}>
                {t(labelKey) || route.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs 
      tabBar={(props) => <CustomTabBar {...props} />} 
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="rutas" />
      <Tabs.Screen name="camera" />
      <Tabs.Screen name="historial" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}

// Estilos extraídos exactamente de la imagen proporcionada
const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FAF8F5', // Fondo claro de la barra
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    minWidth: 64, 
  },
  activeTabContent: {
    backgroundColor: '#FCD34D', // El amarillo dorado exacto de "AR View"
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  }
});