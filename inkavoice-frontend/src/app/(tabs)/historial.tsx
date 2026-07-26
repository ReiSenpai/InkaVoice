import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext'; 

const STATS = [
  { id: 'sitios', title: 'SITIOS\nVISITADOS', value: 24 },
  { id: 'km', title: 'KM RECORRIDOS', value: 142 },
];

const FAVORITES = [
  { id: '1', title: 'Machu Picchu', region: 'SIERRA', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80' },
  { id: '2', title: 'Reserva Nacional', region: 'SELVA', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80' },
];

export type TimelineItem = { 
  id: string; 
  date: string; 
  title: string; 
  description: string; 
  image?: string; 
  audioLabel?: string; 
  status?: { label: string; actionText: string; icon: any; action: string };
  type: 'visit' | 'route' | 'scan' | 'ai_chat'; 
};

const CORE_BACKEND_URL = 'http://192.168.1.36:3000';

export default function HistorialScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { userId } = useUser(); 

  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const C = {
    bg: '#FAF8F5',
    greenDark: '#00332D',
    gold: '#C9A84C',
    white: '#FFFFFF',
    muted: '#6B7280',
    border: '#E5E7EB'
  };

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await fetch(`${CORE_BACKEND_URL}/api/historial/usuario/${userId || 1}`);
        
        if (response.ok) {
          const data = await response.json();
          // --- MAPEO AJUSTADO A LOS CAMPOS DE LA BD (Spring Boot) ---
          const formattedData: TimelineItem[] = data.map((item: any) => ({
            id: item.id.toString(),
            date: 'Recientemente', // Se puede mapear a item.fechaCreacion si lo agregas luego
            title: item.lugarDetectado || 'Descubrimiento AR',
            description: item.descripcion,
            type: 'scan', 
            image: item.fotoUrl,
          }));
          
          setTimelineData(formattedData);
        } else {
          loadFallbackData();
        }
      } catch (error) {
        console.error("Error obteniendo el historial desde la BD:", error);
        loadFallbackData(); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  const loadFallbackData = () => {
    setTimelineData([
      {
        id: 'chat_1',
        date: '13 OCT, 2023 • 04:15 PM',
        title: 'Conversación con Asistente IA',
        description: 'Preguntaste sobre la ingeniería del sillar y el significado de los dientes del puma en la arquitectura de Sacsayhuamán.',
        type: 'ai_chat',
        status: { label: 'Chat Guardado', actionText: 'VER CHAT', icon: 'chatbubbles', action: '/asistente' }
      },
      {
        id: '2',
        date: '12 OCT, 2023 • 09:15 AM',
        title: 'Valle Sagrado: Ruta de Sal',
        description: 'Completaste la ruta senderista por las salineras de Maras.',
        image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=700&q=80',
        status: { label: 'Ruta Finalizada\n4.2 km • 1h 20min', actionText: 'VER MAPA', icon: 'analytics', action: '/rutas' },
        type: 'route'
      }
    ]);
  };

  const handleTimelineAction = (actionPath: string) => {
    router.push(actionPath as any);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, backgroundColor: C.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity hitSlop={10}><Ionicons name="search" size={24} color={C.greenDark} /></TouchableOpacity>
        <Text style={styles.headerTitle}>InkaVoice</Text>
        <TouchableOpacity onPress={() => router.push('/settings')} hitSlop={10}><Ionicons name="settings-outline" size={24} color={C.greenDark} /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.eyebrow}>TU LEGADO DIGITAL</Text>
        <Text style={styles.title}>Historial de Exploración</Text>

        <View style={styles.statsRow}>
          {STATS.map(stat => (
            <View key={stat.id} style={styles.statCard}>
              <View style={styles.statIconRow}>
                <Ionicons name={stat.id === 'sitios' ? 'location-outline' : 'map-outline'} size={18} color={C.gold} />
                <Text style={styles.statLabel}>{stat.title}</Text>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.activeRouteCard}>
          <Text style={styles.activeRouteLabel}>RUTA ACTIVA</Text>
          <Text style={styles.activeRouteTitle}>Camino Inca Real</Text>
          <TouchableOpacity style={styles.activeRouteLink} onPress={() => router.push('/recorrido-en-curso')}>
            <Ionicons name="map-outline" size={16} color={C.white} />
            <Text style={styles.activeRouteLinkText}>Ver progreso en mapa</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favoritos</Text>
          <TouchableOpacity><Text style={styles.sectionLink}>Ver todos</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.favoritesRow}>
          {FAVORITES.map(fav => (
            <TouchableOpacity key={fav.id} style={styles.favoriteCard} onPress={() => router.push('/resultado')}>
              <Image source={{ uri: fav.image }} style={styles.favoriteImage} />
              <View style={styles.favoriteRegionBadge}>
                <Text style={styles.favoriteRegionText}>{fav.region}</Text>
              </View>
              <View style={styles.favoriteOverlay}>
                <Text style={styles.favoriteTitle}>{fav.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Recientes</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={C.gold} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.timeline}>
            {timelineData.map((item, index) => (
              <View key={item.id} style={styles.timelineRow}>
                
                <View style={styles.timelineMarkerCol}>
                  <View style={styles.timelineDot} />
                  {index < timelineData.length - 1 && <View style={styles.timelineLine} />}
                </View>

                <View style={styles.timelineCard}>
                  <Text style={styles.timelineDate}>{item.date}</Text>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineDesc}>{item.description}</Text>

                  {item.audioLabel && (
                    <View style={styles.audioLabelRow}>
                      <Ionicons name="headset-outline" size={16} color={C.gold} />
                      <Text style={styles.audioLabelText}>{item.audioLabel}</Text>
                    </View>
                  )}

                  {item.status && (
                    <View style={styles.statusBox}>
                      <View style={styles.statusLeft}>
                        <View style={styles.statusIconWrap}>
                          <Ionicons name={item.status.icon as any} size={20} color={C.white} />
                        </View>
                        <Text style={styles.statusLabelText}>{item.status.label}</Text>
                      </View>
                      <TouchableOpacity style={styles.statusActionBtn} onPress={() => handleTimelineAction(item.status!.action)}>
                        <Text style={styles.statusActionText}>{item.status.actionText}</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {item.image && (
                     <Image source={{ uri: item.image }} style={styles.timelineImage} />
                  )}
                  
                  {item.type === 'scan' && (
                    <View style={styles.scanBadgesRow}>
                      <Text style={styles.scanBadgeText}>⛶ IA DETECTADO</Text>
                    </View>
                  )}

                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#00332D' },
  scrollContent: { paddingHorizontal: 20 },
  
  eyebrow: { fontSize: 11, fontWeight: '800', color: '#C9A84C', letterSpacing: 1.5, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: '800', color: '#00332D', marginBottom: 24, lineHeight: 36 },
  
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  statIconRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  statLabel: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 0.5 },
  statValue: { fontSize: 28, fontWeight: '800', color: '#00332D' },
  
  activeRouteCard: { backgroundColor: '#004D40', borderRadius: 16, padding: 20, marginBottom: 32 },
  activeRouteLabel: { fontSize: 10, fontWeight: '800', color: '#80CBC4', letterSpacing: 1, marginBottom: 8 },
  activeRouteTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 16 },
  activeRouteLink: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activeRouteLinkText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#00332D' },
  sectionLink: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  
  favoritesRow: { gap: 12, paddingRight: 8 },
  favoriteCard: { width: 180, height: 240, borderRadius: 16, overflow: 'hidden' },
  favoriteImage: { width: '100%', height: '100%' },
  favoriteRegionBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#FCD34D', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  favoriteRegionText: { fontSize: 10, fontWeight: '800', color: '#00332D', letterSpacing: 0.5 },
  favoriteOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: 16 },
  favoriteTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  
  timeline: { marginTop: 10 },
  timelineRow: { flexDirection: 'row', gap: 16 },
  timelineMarkerCol: { alignItems: 'center', width: 12 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#A38A59', marginTop: 4 },
  timelineLine: { width: 1.5, flex: 1, backgroundColor: '#D1D5DB', marginVertical: 4 },
  
  timelineCard: { flex: 1, paddingBottom: 32 },
  timelineDate: { fontSize: 11, color: '#4B5563', fontWeight: '800', letterSpacing: 0.5, marginBottom: 6 },
  timelineTitle: { fontSize: 18, fontWeight: '700', color: '#00332D', marginBottom: 8 },
  timelineDesc: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginBottom: 12 },
  
  audioLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  audioLabelText: { fontSize: 13, fontWeight: '800', color: '#A38A59' },
  
  statusBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F3F4F6', padding: 12, borderRadius: 12, marginBottom: 12 },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#00332D', justifyContent: 'center', alignItems: 'center' },
  statusLabelText: { fontSize: 12, fontWeight: '700', color: '#00332D' },
  statusActionBtn: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  statusActionText: { fontSize: 11, fontWeight: '700', color: '#4B5563' },
  
  scanBadgesRow: { flexDirection: 'row', gap: 16, marginTop: 12 },
  scanBadgeText: { fontSize: 11, fontWeight: '800', color: '#A38A59' },

  timelineImage: { width: '100%', height: 160, borderRadius: 12, marginTop: 4 },
});