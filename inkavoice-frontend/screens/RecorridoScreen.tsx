import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { getInitials } from '../utils/initials';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTour } from '../context/TourContext';
import { MINI_TOUR_BAR_HEIGHT, MINI_TOUR_BAR_GAP } from '../components/MiniTourBar';
import { SITES } from './MapaScreen';

const { width } = Dimensions.get('window');
const C = { bg: colors.background, green: colors.green, gold: colors.gold, text: colors.greenDark, muted: colors.muted, white: colors.white, border: colors.border };

// Cada ruta ahora referencia ids reales de SITES (definidos en MapaScreen) para poder
// armar un recorrido con coordenadas de verdad al presionar "Iniciar Recorrido".
const ROUTES = [
  { id: 1, title: 'Dunas de Ica y Oasis', subtitle: 'Huacachina y Paracas', region: 'Costa', duration: '2 Días', level: 'Fácil', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', stopIds: [5, 4] },
  { id: 2, title: 'Valle Sagrado', subtitle: 'Cusco', region: 'Sierra', duration: '4 Días', level: 'Media', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1', stopIds: [9, 6, 10] },
  { id: 3, title: 'Reserva Amazónica', subtitle: 'Madre de Dios', region: 'Selva', duration: '3 Días', level: 'Media', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', stopIds: [12, 15] },
];

export default function RecorridoScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { photoUri, name } = useUser();
  const insets = useSafeAreaInsets();
  const { startTour, isActive: isTourActive } = useTour();
  // Espacio extra arriba mientras la mini barra "Recorrido en curso" está visible
  const extraTopSpace = isTourActive ? MINI_TOUR_BAR_HEIGHT + MINI_TOUR_BAR_GAP : 0;

  // Si venimos del mapa con una región/sitio específico, arrancamos ya filtrados.
  const incomingRegion: string | undefined = route.params?.region;
  const incomingSiteName: string | undefined = route.params?.siteName;

  const [filter, setFilter] = useState(incomingRegion ?? 'Todas');
  const [search, setSearch] = useState('');

  // Si la pantalla ya estaba montada y llega un nuevo parámetro (navegas
  // de nuevo desde otro sitio del mapa), actualizamos el filtro.
  useEffect(() => {
    if (incomingRegion) setFilter(incomingRegion);
  }, [incomingRegion]);

  const routes = useMemo(() => ROUTES.filter(r => {
    const regionOk = filter === 'Todas' ? true : r.region === filter;
    const textOk = r.title.toLowerCase().includes(search.toLowerCase());
    return regionOk && textOk;
  }), [filter, search]);

  // Arranca un recorrido real (GPS + progreso) para la ruta elegida
  const handleStartRecorrido = (r: (typeof ROUTES)[number]) => {
    const stops = SITES.filter(s => r.stopIds.includes(s.id));
    if (!stops.length) {
      Alert.alert('Ruta sin paradas', 'Esta ruta todavía no tiene paradas configuradas.');
      return;
    }
    const begin = () => {
      startTour({ routeName: r.title, region: r.region, stops });
      navigation.navigate('RecorridoEnCurso');
    };
    if (isTourActive) {
      Alert.alert('Ya tienes un recorrido en curso', '¿Quieres terminarlo y empezar este?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Empezar nuevo', style: 'destructive', onPress: begin },
      ]);
      return;
    }
    begin();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 + extraTopSpace }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color={C.green} />
          </TouchableOpacity>
          <Text style={styles.logo}>InkaVoice</Text>
          {photoUri ? (<Image source={{ uri: photoUri }} style={styles.avatar} />) : (<View style={styles.avatarInitialsWrap}><Text style={styles.avatarInitialsText}>{getInitials(name)}</Text></View>)}
        </View>

        <Text style={styles.title}>Planifica tu Expedición</Text>

        {incomingSiteName && (
          <View style={styles.incomingBanner}>
            <Ionicons name="location" size={16} color={C.green} />
            <Text style={styles.incomingBannerText}>
              Buscando rutas relacionadas con <Text style={{ fontWeight: '800' }}>{incomingSiteName}</Text>
            </Text>
          </View>
        )}

        <View style={styles.search}>
          <Ionicons name="search" size={20} color="#777" />
          <TextInput value={search} onChangeText={setSearch} placeholder="Busca tu próxima ruta..." placeholderTextColor="#999" style={styles.input} />
        </View>

        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options" size={18} color="#FFF" />
          <Text style={styles.filterText}>Filtros</Text>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingTop: 18, paddingHorizontal: 18 }}>
          {['Todas', 'Costa', 'Sierra', 'Selva'].map(v => (
            <TouchableOpacity key={v} style={[styles.tab, filter === v && styles.tabActive]} onPress={() => setFilter(v)}>
              <Text style={[styles.tabText, filter === v && { color: C.green }]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.section}>Rutas Cercanas</Text>
          <TouchableOpacity><Text style={styles.link}>Ver todas</Text></TouchableOpacity>
        </View>

        {routes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="map-outline" size={40} color={C.muted} />
            <Text style={styles.emptyStateText}>No hay rutas para este filtro todavía.</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {routes.map(r => (
              <View key={r.id} style={styles.card}>
                <Image source={{ uri: r.image }} style={styles.cardImage} />
                <View style={styles.badge}><Text>{r.region}</Text></View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{r.title}</Text>
                  <Text style={styles.cardSub}>{r.subtitle}</Text>
                  <Text style={styles.meta}>{r.duration} · {r.level} · {r.stopIds.length} paradas</Text>
                  <TouchableOpacity style={styles.startRecorridoBtn} onPress={() => handleStartRecorrido(r)}>
                    <Ionicons name="navigate" size={16} color="#FFF" />
                    <Text style={styles.startRecorridoBtnText}>Iniciar Recorrido</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.detailBtn} onPress={() => navigation.navigate('Asistente', { siteName: r.title })}>
                    <Text>Ver Detalle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        <Text style={[styles.section, { marginTop: 30 }]}>Nuevas Experiencias</Text>
        <View style={styles.experience}>
          <Text style={styles.expTitle}>Explora rutas con IA</Text>
          <Text style={styles.expSub}>Recorridos personalizados</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Asistente', incomingSiteName ? { siteName: incomingSiteName } : undefined)}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: 28, fontWeight: '800', color: C.green },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarInitialsWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  avatarInitialsText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  title: { padding: 18, fontSize: 50, fontWeight: '800', color: C.text },
  incomingBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 18, marginBottom: 14, backgroundColor: '#E8F5E9', padding: 12, borderRadius: 14 },
  incomingBannerText: { color: C.text, fontSize: 13, flex: 1 },
  search: { marginHorizontal: 18, height: 54, backgroundColor: '#FFF', borderRadius: 27, paddingHorizontal: 18, alignItems: 'center', flexDirection: 'row' },
  input: { flex: 1, marginLeft: 10 },
  filterBtn: { marginLeft: 18, marginTop: 18, width: 120, height: 48, borderRadius: 24, backgroundColor: C.green, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 },
  filterText: { color: '#FFF' },
  tab: { borderWidth: 1, borderColor: '#CCC', paddingHorizontal: 18, height: 42, borderRadius: 22, justifyContent: 'center' },
  tabActive: { borderColor: C.green },
  tabText: { color: '#666' },
  sectionHeader: { padding: 18, flexDirection: 'row', justifyContent: 'space-between' },
  section: { fontSize: 36, fontWeight: '800', color: C.text },
  link: { color: C.green },
  emptyState: { alignItems: 'center', paddingVertical: 30, gap: 10, marginHorizontal: 18 },
  emptyStateText: { color: C.muted, fontSize: 14, textAlign: 'center' },
  card: { width: 300, marginLeft: 18, backgroundColor: '#FFF', borderRadius: 30, overflow: 'hidden' },
  cardImage: { width: '100%', height: 260 },
  badge: { position: 'absolute', top: 18, left: 18, backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  cardBody: { padding: 18 },
  cardTitle: { fontSize: 26, fontWeight: '700' },
  cardSub: { color: C.muted },
  meta: { marginTop: 10 },
  startRecorridoBtn: { marginTop: 16, height: 50, borderRadius: 25, backgroundColor: C.green, flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' },
  startRecorridoBtnText: { color: '#FFF', fontWeight: '800' },
  detailBtn: { marginTop: 10, height: 48, borderRadius: 24, backgroundColor: '#F4F4F4', justifyContent: 'center', alignItems: 'center' },
  experience: { margin: 18, backgroundColor: '#FFF', padding: 24, borderRadius: 26, marginBottom: 120 },
  expTitle: { fontSize: 24, fontWeight: '700' },
  expSub: { marginTop: 8, color: C.muted },
  fab: { position: 'absolute', right: 22, bottom: 40, width: 72, height: 72, borderRadius: 36, backgroundColor: C.green, justifyContent: 'center', alignItems: 'center' },
});