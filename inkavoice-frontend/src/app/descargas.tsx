import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DescargasScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Animación para el botón de descarga
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressDownload = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const C = {
    bg: '#FAF8F5',
    greenDark: '#00332D',
    gold: '#C9A84C',
    goldBg: '#FDE68A',
    white: '#FFFFFF',
    muted: '#6B7280',
    border: '#E5E7EB',
    red: '#D64545'
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity hitSlop={10} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={C.greenDark} /></TouchableOpacity>
        <Text style={styles.headerTitle}>InkaVoice</Text>
        <TouchableOpacity hitSlop={10}><Ionicons name="settings-outline" size={24} color={C.greenDark} /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* TITULO Y BADGE */}
        <View style={styles.titleRow}>
          <View style={styles.onlineBadge}>
            <Ionicons name="cloud-done-outline" size={14} color="#1E8A5F" />
            <Text style={styles.onlineBadgeText}>MODO ONLINE</Text>
          </View>
          <Text style={styles.syncText}>Sincronizado hace 2 min</Text>
        </View>

        <Text style={styles.mainTitle}>Gestión de Descargas</Text>
        <Text style={styles.subtitle}>
          Administra tu contenido para explorar el patrimonio cultural sin conexión en las zonas más remotas de los Andes y la Amazonía.
        </Text>

        {/* ALMACENAMIENTO */}
        <View style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <Text style={styles.storageTitle}>Almacenamiento</Text>
            <Text style={styles.storageFree}>12.4 GB Libres</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '30%' }]} />
          </View>
          <View style={styles.storageLegendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: C.greenDark }]} />
              <Text style={styles.legendText}>InkaVoice (2.1 GB)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#D1D5DB' }]} />
              <Text style={styles.legendText}>Otros (4.8 GB)</Text>
            </View>
          </View>
        </View>

        {/* BANNER DE DESCARGA (Animado) */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View style={styles.downloadBanner}>
            <Text style={styles.bannerTitle}>Circuito: Valle Sagrado</Text>
            <Text style={styles.bannerText}>Descarga el circuito completo (Audio, Mapas y Guías) para una experiencia fluida.</Text>
            <TouchableOpacity style={styles.downloadBtn} onPress={handlePressDownload} activeOpacity={0.9}>
              <Ionicons name="download-outline" size={18} color={C.white} />
              <Text style={styles.downloadBtnText}>Descargar todo el circuito</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* AUDIOGUÍAS */}
        <View style={styles.sectionHeader}>
          <Ionicons name="headset-outline" size={20} color={C.greenDark} />
          <Text style={styles.sectionTitle}>AUDIOGUÍAS</Text>
        </View>

        <View style={styles.itemCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>Machu Picchu: Intihuatana</Text>
            <Text style={styles.itemMeta}>Región: Highlands • 45 MB</Text>
            <TouchableOpacity style={styles.deleteRow}>
              <Ionicons name="trash-outline" size={14} color={C.red} />
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="checkmark-circle" size={28} color={C.greenDark} />
        </View>

        <View style={styles.itemCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>Chan Chan: Ciudadela Tschudi</Text>
            <Text style={styles.itemMeta}>Región: Coast • 28 MB</Text>
            <TouchableOpacity style={styles.deleteRow}>
              <Ionicons name="trash-outline" size={14} color={C.red} />
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="checkmark-circle" size={28} color={C.greenDark} />
        </View>

        {/* MAPAS */}
        <View style={styles.sectionHeader}>
          <Ionicons name="map-outline" size={20} color={C.greenDark} />
          <Text style={styles.sectionTitle}>MAPAS</Text>
        </View>

        <View style={styles.mapCard}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600' }} style={styles.mapImage} />
          <View style={styles.mapOverlay}>
            <View>
              <Text style={styles.mapTitle}>Parque Arqueológico de Cusco</Text>
              <Text style={styles.mapMeta}>Offline • 112 MB</Text>
            </View>
            <Ionicons name="checkmark" size={24} color={C.white} />
          </View>
        </View>

        <TouchableOpacity style={styles.newMapBtn}>
          {/* SOLUCIÓN AL ERROR DE TYPE: */}
          <Ionicons name="location-outline" size={20} color={C.greenDark} />
          <Text style={styles.newMapText}>Descargar nuevo mapa</Text>
          <Ionicons name="chevron-forward" size={18} color={C.muted} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        {/* PAQUETES DE IDIOMA */}
        <View style={styles.sectionHeader}>
          <Ionicons name="language" size={20} color={C.greenDark} />
          <Text style={styles.sectionTitle}>PAQUETES DE IDIOMA</Text>
        </View>

        <View style={styles.langContainer}>
          <View style={styles.langRow}>
            <View style={styles.langIconBox}><Text style={styles.langIconText}>A</Text></View>
            <Text style={styles.langTitle}>Español (Nativo)</Text>
            <Text style={styles.langSize}>42 MB</Text>
          </View>
          <View style={styles.langRow}>
            <View style={styles.langIconBox}><Text style={styles.langIconText}>A</Text></View>
            <Text style={styles.langTitle}>Inglés</Text>
            <Text style={styles.langSize}>38 MB</Text>
          </View>
          <View style={styles.langRowActive}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=100' }} style={styles.langImage} />
            <Text style={styles.langTitleActive}>Quechua (Cusco-Collao)</Text>
            <View style={styles.langProgressTrack}><View style={[styles.langProgressFill, { width: '70%' }]} /></View>
            <Text style={styles.langSize}>70%</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#00332D' },
  scrollContent: { paddingHorizontal: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  onlineBadgeText: { fontSize: 10, fontWeight: '800', color: '#1E8A5F' },
  syncText: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  mainTitle: { fontSize: 32, fontWeight: '800', color: '#00332D', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginBottom: 24 },
  storageCard: { backgroundColor: '#F9F8F6', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 16, marginBottom: 24 },
  storageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  storageTitle: { fontSize: 14, fontWeight: '800', color: '#111827' },
  storageFree: { fontSize: 12, fontWeight: '800', color: '#1E8A5F' },
  progressBarBg: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: 12 },
  progressBarFill: { height: '100%', backgroundColor: '#00332D', borderRadius: 4 },
  storageLegendRow: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, fontWeight: '600', color: '#4B5563' },
  downloadBanner: { backgroundColor: '#FCD34D', borderRadius: 16, padding: 20, marginBottom: 32 },
  bannerTitle: { fontSize: 18, fontWeight: '800', color: '#85601E', marginBottom: 8 },
  bannerText: { fontSize: 13, color: '#85601E', lineHeight: 20, marginBottom: 16 },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00332D', paddingVertical: 14, borderRadius: 12, gap: 8 },
  downloadBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, marginTop: 10 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#00332D', letterSpacing: 1 },
  itemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12 },
  itemTitle: { fontSize: 14, fontWeight: '800', color: '#111827', marginBottom: 4 },
  itemMeta: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  deleteRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deleteText: { fontSize: 12, fontWeight: '700', color: '#D64545' },
  mapCard: { height: 160, borderRadius: 16, overflow: 'hidden', marginBottom: 12 },
  mapImage: { width: '100%', height: '100%' },
  mapOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  mapTitle: { color: '#FFF', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  mapMeta: { color: '#E5E7EB', fontSize: 12 },
  newMapBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F8F6', padding: 16, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: '#D1D5DB', gap: 8, marginBottom: 32 },
  newMapText: { fontSize: 14, fontWeight: '700', color: '#00332D' },
  langContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  langRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  langIconBox: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  langIconText: { fontSize: 16, fontWeight: '800', color: '#00332D' },
  langTitle: { flex: 1, fontSize: 14, fontWeight: '800', color: '#111827' },
  langSize: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  langRowActive: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#ECFDF5' },
  langImage: { width: 36, height: 36, borderRadius: 8, marginRight: 12 },
  langTitleActive: { flex: 1, fontSize: 14, fontWeight: '800', color: '#00332D' },
  langProgressTrack: { width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, marginRight: 12 },
  langProgressFill: { height: '100%', backgroundColor: '#00332D', borderRadius: 2 },
});