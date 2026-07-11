import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const C = { bg: colors.background, white: colors.white, green: colors.green, green2: colors.greenDark, gold: colors.gold, border: colors.border, text: colors.greenDark, muted: colors.muted };

// Vista inicial: todo el Perú
const PERU_REGION: Region = {
  latitude: -9.19,
  longitude: -75.0152,
  latitudeDelta: 12,
  longitudeDelta: 12,
};

type ZoneKey = 'costa' | 'sierra' | 'selva';
type Category = 'arqueologico' | 'natural' | 'colonial';

// Encuadres aproximados para centrar el mapa al elegir cada región
const ZONE_REGIONS: Record<ZoneKey, Region> = {
  costa: { latitude: -9.5, longitude: -78.3, latitudeDelta: 8, longitudeDelta: 6 },
  sierra: { latitude: -12.9, longitude: -73.5, latitudeDelta: 6, longitudeDelta: 6 },
  selva: { latitude: -6.5, longitude: -74.5, latitudeDelta: 8, longitudeDelta: 8 },
};

const ZONES: { key: ZoneKey; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { key: 'costa', label: 'Costa', icon: 'water', color: '#F4D03F' },
  { key: 'sierra', label: 'Sierra', icon: 'triangle', color: '#8D6E63' },
  { key: 'selva', label: 'Selva', icon: 'leaf', color: '#2E7D32' },
];

const CATEGORY_ICON: Record<Category, keyof typeof Ionicons.glyphMap> = {
  arqueologico: 'business',
  natural: 'earth',
  colonial: 'home',
};

type Site = {
  id: number;
  name: string;
  zone: ZoneKey;
  category: Category;
  latitude: number;
  longitude: number;
  shortDesc: string;
  image: string;
};

// Lista ampliada: principales zonas arqueológicas y turísticas del Perú por región
const SITES: Site[] = [
  // COSTA
  { id: 1, name: 'Chan Chan', zone: 'costa', category: 'arqueologico', latitude: -8.1116, longitude: -79.0744, shortDesc: 'La ciudad de barro más grande de América precolombina, capital del reino Chimú.', image: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4' },
  { id: 2, name: 'Líneas de Nazca', zone: 'costa', category: 'arqueologico', latitude: -14.7391, longitude: -75.13, shortDesc: 'Geoglifos milenarios visibles solo desde el aire, patrimonio de la humanidad.', image: 'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca' },
  { id: 3, name: 'Huacas del Sol y de la Luna', zone: 'costa', category: 'arqueologico', latitude: -8.1347, longitude: -78.9917, shortDesc: 'Templos ceremoniales moche con murales polícromos únicos.', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1' },
  { id: 4, name: 'Barranco - Lima', zone: 'costa', category: 'colonial', latitude: -12.149, longitude: -77.0206, shortDesc: 'Bohemio distrito costero con arquitectura republicana y arte urbano.', image: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129' },
  { id: 5, name: 'Islas Ballestas', zone: 'costa', category: 'natural', latitude: -13.809, longitude: -76.3958, shortDesc: 'Reserva marina con lobos marinos, pingüinos de Humboldt y aves guaneras.', image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2' },

  // SIERRA
  { id: 6, name: 'Machu Picchu', zone: 'sierra', category: 'arqueologico', latitude: -13.1631, longitude: -72.545, shortDesc: 'Ciudadela inca del siglo XV, una de las Siete Maravillas del Mundo Moderno.', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377' },
  { id: 7, name: 'Sacsayhuamán', zone: 'sierra', category: 'arqueologico', latitude: -13.5093, longitude: -71.9822, shortDesc: 'Fortaleza inca con muros ciclópeos de piedra perfectamente encajada.', image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee' },
  { id: 8, name: 'Cusco - Plaza de Armas', zone: 'sierra', category: 'colonial', latitude: -13.5164, longitude: -71.9785, shortDesc: 'Corazón colonial del antiguo imperio inca, catedral y arquerías del s. XVI.', image: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4' },
  { id: 9, name: 'Valle Sagrado', zone: 'sierra', category: 'natural', latitude: -13.3175, longitude: -72.1119, shortDesc: 'Andenes, ríos y pueblos andinos entre Pisac y Ollantaytambo.', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5' },
  { id: 10, name: 'Laguna Humantay', zone: 'sierra', category: 'natural', latitude: -13.4053, longitude: -72.2233, shortDesc: 'Laguna glaciar turquesa a los pies del nevado Salkantay.', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1' },
  { id: 11, name: 'Choquequirao', zone: 'sierra', category: 'arqueologico', latitude: -13.3939, longitude: -72.6497, shortDesc: '"La hermana sagrada de Machu Picchu", accesible solo a pie.', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377' },

  // SELVA
  { id: 12, name: 'Reserva de Pacaya-Samiria', zone: 'selva', category: 'natural', latitude: -5.3, longitude: -74.6, shortDesc: 'La reserva amazónica más grande del Perú, hogar de delfines rosados.', image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5' },
  { id: 13, name: 'Kuélap', zone: 'selva', category: 'arqueologico', latitude: -6.4211, longitude: -77.9256, shortDesc: 'Fortaleza de la cultura Chachapoyas, "la Machu Picchu del norte".', image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee' },
  { id: 14, name: 'Iquitos', zone: 'selva', category: 'colonial', latitude: -3.7437, longitude: -73.2516, shortDesc: 'Puerta de entrada a la Amazonía peruana, solo accesible por río o aire.', image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5' },
  { id: 15, name: 'Gocta', zone: 'selva', category: 'natural', latitude: -5.9758, longitude: -77.8828, shortDesc: 'Una de las cataratas más altas del mundo, escondida en la selva alta.', image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2' },
];

const ROUTES: Record<ZoneKey, { id: number; name: string; km: string; desc: string; img: string }[]> = {
  costa: [
    { id: 1, name: 'Ruta Moche', km: '540km', desc: '4 Sitios Arqueológicos', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da' },
  ],
  sierra: [
    { id: 2, name: 'Camino Inca', km: '43km', desc: 'Trekking', img: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1' },
  ],
  selva: [
    { id: 3, name: 'Ruta Amazónica', km: '210km', desc: 'Reservas naturales', img: 'https://images.unsplash.com/photo-1516214104703-d870798883c5' },
  ],
};

export default function MapaScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [activeZone, setActiveZone] = useState<ZoneKey | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      try {
        const position = await Location.getCurrentPositionAsync({});
        setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      } catch (e) {
        // Sin ubicación disponible, se mantiene la vista general del Perú
      }
    })();
  }, []);

  const goToZone = (zone: ZoneKey) => {
    setActiveZone(zone);
    setSelectedRoute(null);
    setSelectedSite(null);
    mapRef.current?.animateToRegion(ZONE_REGIONS[zone], 600);
  };

  const goToMyLocation = async () => {
    if (!userLocation) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso necesario', 'Necesitamos acceso a tu ubicación para mostrarla en el mapa.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      const loc = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      setUserLocation(loc);
      mapRef.current?.animateToRegion({ ...loc, latitudeDelta: 0.3, longitudeDelta: 0.3 }, 600);
      return;
    }
    mapRef.current?.animateToRegion({ ...userLocation, latitudeDelta: 0.3, longitudeDelta: 0.3 }, 600);
  };

  const handleSitePress = (site: Site) => {
    setSelectedSite(site);
    mapRef.current?.animateToRegion({ latitude: site.latitude, longitude: site.longitude, latitudeDelta: 1.5, longitudeDelta: 1.5 }, 500);
  };

  const visibleRoutes = activeZone ? ROUTES[activeZone] : [...ROUTES.costa, ...ROUTES.sierra, ...ROUTES.selva];
  const visibleSites = activeZone ? SITES.filter(s => s.zone === activeZone) : SITES;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="search-outline" size={22} color={C.green} />
        </TouchableOpacity>
        <Text style={styles.title}>InkaVoice</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={22} color={C.green} />
        </TouchableOpacity>
      </View>

      <View style={styles.zoneTabs}>
        {ZONES.map(zone => (
          <TouchableOpacity
            key={zone.key}
            style={[styles.zoneTab, activeZone === zone.key && { backgroundColor: zone.color }]}
            onPress={() => goToZone(zone.key)}
          >
            <Ionicons name={zone.icon} size={16} color={activeZone === zone.key ? '#FFF' : C.muted} />
            <Text style={[styles.zoneTabText, activeZone === zone.key && { color: '#FFF' }]}>{zone.label}</Text>
          </TouchableOpacity>
        ))}
        {activeZone && (
          <TouchableOpacity style={styles.zoneClear} onPress={() => { setActiveZone(null); setSelectedSite(null); mapRef.current?.animateToRegion(PERU_REGION, 600); }}>
            <Ionicons name="close" size={16} color={C.muted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.mapArea}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={PERU_REGION}
          showsUserLocation
          showsMyLocationButton={false}
          onPress={() => setSelectedSite(null)}
        >
          {visibleSites.map(site => {
            const zoneInfo = ZONES.find(z => z.key === site.zone)!;
            return (
              <Marker
                key={site.id}
                coordinate={{ latitude: site.latitude, longitude: site.longitude }}
                title={site.name}
                onPress={() => handleSitePress(site)}
              >
                <View style={[styles.pinCircle, { backgroundColor: zoneInfo.color }, selectedSite?.id === site.id && styles.pinCircleActive]}>
                  <Ionicons name={CATEGORY_ICON[site.category]} size={16} color="#FFF" />
                </View>
              </Marker>
            );
          })}
        </MapView>

        <View style={styles.rightButtons}>
          <TouchableOpacity style={styles.floatBtn} onPress={goToMyLocation}>
            <Ionicons name="locate" size={20} color={C.green} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.floatBtn} onPress={() => { setActiveZone(null); setSelectedSite(null); mapRef.current?.animateToRegion(PERU_REGION, 600); }}>
            <Ionicons name="layers-outline" size={20} color={C.green} />
          </TouchableOpacity>
        </View>
      </View>

      {selectedSite ? (
        <View style={styles.siteCard}>
          <TouchableOpacity style={styles.siteCardClose} onPress={() => setSelectedSite(null)}>
            <Ionicons name="close" size={16} color="#FFF" />
          </TouchableOpacity>
          <Image source={{ uri: selectedSite.image }} style={styles.siteCardImg} />
          <View style={styles.siteCardBody}>
            <View style={styles.siteCardBadge}>
              <Ionicons name={CATEGORY_ICON[selectedSite.category]} size={12} color={C.green} />
              <Text style={styles.siteCardBadgeText}>{selectedSite.category === 'arqueologico' ? 'Arqueológico' : selectedSite.category === 'natural' ? 'Natural' : 'Colonial'}</Text>
            </View>
            <Text style={styles.siteCardTitle}>{selectedSite.name}</Text>
            <Text style={styles.siteCardDesc} numberOfLines={2}>{selectedSite.shortDesc}</Text>
            <TouchableOpacity
              style={styles.siteCardBtn}
              onPress={() => navigation.navigate('Resultado', { siteName: selectedSite.name })}
            >
              <Text style={styles.siteCardBtnText}>Ver detalles</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.bottomCard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {visibleRoutes.map(route => (
              <TouchableOpacity key={route.id} onPress={() => setSelectedRoute(route.id)} style={[styles.card, selectedRoute === route.id && styles.cardSelected]}>
                <Image source={{ uri: route.img }} style={styles.cardImg} />
                <View style={styles.cardBody}>
                  <Text style={styles.routeTitle}>{route.name}</Text>
                  <Text style={styles.routeMeta}>{route.km} · {route.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => navigation.navigate('Routes', selectedRoute ? { routeId: selectedRoute } : undefined)}
          >
            <Ionicons name="add-circle" size={22} color="#FFF" />
            <Text style={styles.startText}>Iniciar Nuevo Recorrido</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.white, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: '800', color: C.green },
  zoneTabs: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 12, backgroundColor: C.white, gap: 8, alignItems: 'center' },
  zoneTab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0EE' },
  zoneTabText: { fontSize: 13, fontWeight: '700', color: C.muted },
  zoneClear: { padding: 6, borderRadius: 20, backgroundColor: '#F0F0EE' },
  mapArea: { flex: 1 },
  map: { flex: 1, marginHorizontal: 18, borderRadius: 30, overflow: 'hidden' },
  pinCircle: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  pinCircleActive: { borderColor: C.gold, borderWidth: 3, transform: [{ scale: 1.15 }] },
  rightButtons: { position: 'absolute', right: 32, top: 20, gap: 14 },
  floatBtn: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  bottomCard: { position: 'absolute', bottom: 25, left: 0, right: 0 },
  card: { width: 260, marginLeft: 18, backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden' },
  cardSelected: { borderWidth: 2, borderColor: C.green },
  cardImg: { width: '100%', height: 150 },
  cardBody: { padding: 14 },
  routeTitle: { fontWeight: '800', fontSize: 18 },
  routeMeta: { marginTop: 6, color: C.muted },
  startBtn: { alignSelf: 'center', marginTop: 18, height: 58, paddingHorizontal: 24, borderRadius: 30, backgroundColor: C.green, flexDirection: 'row', alignItems: 'center', gap: 10 },
  startText: { color: '#FFF', fontWeight: '700', fontSize: 16 },

  siteCard: { position: 'absolute', bottom: 25, left: 18, right: 18, backgroundColor: '#FFF', borderRadius: 20, flexDirection: 'row', overflow: 'hidden', elevation: 8 },
  siteCardClose: { position: 'absolute', top: 8, right: 8, zIndex: 2, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  siteCardImg: { width: 110, height: '100%' },
  siteCardBody: { flex: 1, padding: 14, gap: 4 },
  siteCardBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F0FAF4', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginBottom: 2 },
  siteCardBadgeText: { fontSize: 10, fontWeight: '800', color: C.green },
  siteCardTitle: { fontSize: 16, fontWeight: '800', color: C.text },
  siteCardDesc: { fontSize: 12, color: C.muted, lineHeight: 16 },
  siteCardBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.green, borderRadius: 10, paddingVertical: 8, marginTop: 6, alignSelf: 'flex-start', paddingHorizontal: 14 },
  siteCardBtnText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
});