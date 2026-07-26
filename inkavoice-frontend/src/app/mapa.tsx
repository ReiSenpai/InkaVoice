import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Platform, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLanguage } from '../context/LanguageContext';
import { useAlert } from '../context/AlertContext';
import { useTour } from '../context/TourContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const PERU_REGION: Region = { latitude: -9.19, longitude: -75.0152, latitudeDelta: 12, longitudeDelta: 12 };

export const SITES: any[] = [
  { id: 1, name: 'Chan Chan', category: 'arqueologico', latitude: -8.1116, longitude: -79.0744, icon: 'water', color: '#F4D03F' },
  { id: 2, name: 'Chachapoyas', category: 'arqueologico', latitude: -6.4211, longitude: -77.9256, icon: 'leaf', color: '#00332D' },
  { id: 3, name: 'Machu Picchu', category: 'arqueologico', latitude: -13.1631, longitude: -72.545, icon: 'diamond', color: '#00332D' },
];

const ROUTES = [
  { id: 1, name: 'Ruta Moche', km: '540km', desc: '4 Sitios Arqueológicos', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da' },
  { id: 2, name: 'Camino Inca', km: '43km', desc: 'Trekking', img: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1' },
];

const TAB_BAR_HEIGHT = 72;

export default function MapaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { alert } = useAlert();

  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<number>(1);

  const C = {
    bg: '#FAF8F5',
    white: colors.white,
    green: '#00332D',
    gold: colors.gold,
    muted: '#666',
    border: colors.border,
  };

  const fabBottom = TAB_BAR_HEIGHT + insets.bottom + 12;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const position = await Location.getCurrentPositionAsync({});
        setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      }
    })();
  }, []);

  const goToMyLocation = async () => {
    if (!userLocation) {
      alert(t('map_permission_title'), t('map_permission_message'));
      return;
    }
    mapRef.current?.animateToRegion({ ...userLocation, latitudeDelta: 0.3, longitudeDelta: 0.3 }, 600);
  };

  const handleStartZoneTour = () => {
    alert('Comenzar', 'Lógica para iniciar el recorrido unificado.');
  };

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: C.white }]}>
        <TouchableOpacity hitSlop={10}>
          <Ionicons name="search" size={20} color={C.green} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.green }]}>InkaVoice</Text>
        <TouchableOpacity onPress={() => router.push('/settings')} hitSlop={10}>
          <Ionicons name="settings-outline" size={20} color={C.green} />
        </TouchableOpacity>
      </View>

      {/* MAPA */}
      <View style={styles.mapArea}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={PERU_REGION}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {SITES.map(site => (
            <Marker
              key={site.id}
              coordinate={{ latitude: site.latitude, longitude: site.longitude }}
              title={site.name}
            >
              <View style={styles.pinWrapper}>
                <View style={[styles.pinCircle, { backgroundColor: site.color }]}>
                  <Ionicons name={site.icon} size={16} color="#FFF" />
                </View>
                <View style={styles.pinLabel}>
                    <Text style={styles.pinLabelText}>{site.name.toUpperCase()}</Text>
                    <View style={styles.pinLabelArrow} />
                </View>
              </View>
            </Marker>
          ))}
        </MapView>

        {/* BOTONES DERECHA */}
        <View style={styles.rightButtons}>
          <TouchableOpacity style={[styles.floatBtn, { elevation: 4 }]} onPress={goToMyLocation}>
            <Ionicons name="locate" size={20} color={C.green} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.floatBtn, { elevation: 4 }]}>
            <Ionicons name="layers-outline" size={20} color={C.green} />
          </TouchableOpacity>
        </View>
      </View>

      {/* TARJETAS HORIZONTALES */}
      <View style={[styles.bottomCard, { bottom: fabBottom - 20 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.routesScroll}>
          {ROUTES.map(route => (
            <TouchableOpacity 
              key={route.id} 
              onPress={() => setSelectedRoute(route.id)} 
              style={[styles.card, selectedRoute === route.id && styles.cardSelected, { elevation: 5 }]}
            >
              <View style={styles.regionBadge}>
                <Text style={styles.regionBadgeText}>COAST</Text>
              </View>
              <Image source={{ uri: route.img }} style={styles.cardImg} />
              <View style={styles.cardBody}>
                <Text style={styles.routeTitle}>{route.name}</Text>
                <Text style={styles.routeMeta}>{route.km} · {route.desc}</Text>
                <Text style={styles.explorarText}>Explorar ahora</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* BOTÓN FLOTANTE PRINCIPAL */}
        <TouchableOpacity style={[styles.startBtn, { elevation: 8 }]} onPress={handleStartZoneTour}>
          <Ionicons name="add-circle" size={22} color="#FFF" />
          <Text style={styles.startText}>{t('map_start_route') || 'Iniciar Nuevo Recorrido'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, zIndex: 10 },
  title: { fontSize: 24, fontWeight: '800' },
  mapArea: { flex: 1 },
  map: { flex: 1 },
  
  pinWrapper: { alignItems: 'center', width: 140, position: 'relative' },
  pinCircle: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF', zIndex: 2 },
  pinLabel: { backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginTop: -6, minWidth: 100, position: 'absolute', top: 38, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8 },
  pinLabelText: { fontSize: 9, fontWeight: '800', color: '#1A3A1E', textAlign: 'center', letterSpacing: 0.5 },
  pinLabelArrow: { position: 'absolute', top: -6, alignSelf: 'center', width: 0, height: 0, borderLeftWidth: 6, borderLeftColor: 'transparent', borderRightWidth: 6, borderRightColor: 'transparent', borderBottomWidth: 6, borderBottomColor: '#FFF' },

  rightButtons: { position: 'absolute', right: 32, top: 20, gap: 14, zIndex: 5 },
  floatBtn: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  
  bottomCard: { position: 'absolute', left: 0, right: 0, zIndex: 10 },
  routesScroll: { paddingHorizontal: 18 },
  card: { width: 280, marginLeft: 10, backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 20 },
  cardSelected: { borderWidth: 2, borderColor: '#00332D' },
  regionBadge: { position: 'absolute', top: 12, left: 12, zIndex: 2, backgroundColor: '#FCD34D', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  regionBadgeText: { fontSize: 10, fontWeight: '800', color: '#00332D' },
  cardImg: { width: '100%', height: 160 },
  cardBody: { padding: 16, gap: 4 },
  routeTitle: { fontWeight: '800', fontSize: 18, color: '#00332D' },
  routeMeta: { fontSize: 13, color: '#666' },
  explorarText: { color: '#C9A84C', fontSize: 13, fontWeight: '700', marginTop: 8 },

  startBtn: { position: 'absolute', alignSelf: 'center', bottom: -30, zIndex: 10, height: 58, paddingHorizontal: 24, borderRadius: 30, backgroundColor: '#00332D', flexDirection: 'row', alignItems: 'center', gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  startText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});