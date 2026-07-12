import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useAlert } from '../context/AlertContext';
import { useLanguage } from '../context/LanguageContext';

const STATS = [
  { id: 'sitios', icon: 'flag-outline', value: 24, labelKey: 'history_stat_sites' },
  { id: 'km', icon: 'walk-outline', value: '142', labelKey: 'history_stat_km' },
];

const ACTIVE_ROUTE = {
  title: 'Camino Inca Real',
  labelKey: 'history_active_route_label',
};

const FAVORITES = [
  { id: '1', title: 'Machu Picchu', regionKey: 'region_sierra_upper', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80' },
  { id: '2', title: 'Reserva Nacional', regionKey: 'region_selva_upper', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80' },
  { id: '3', title: 'Líneas de Nazca', regionKey: 'region_costa_upper', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80' },
];

type TimelineItem = {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  meta?: string;
  status?: { label: string; kind: 'finished' | 'scan' | 'favorite' };
};

const TIMELINE: TimelineItem[] = [
  {
    id: '1',
    date: '14 OCT, 2023 · 10:30 AM',
    title: 'Templo del Sol (Qorikancha)',
    description: 'Una inmersión profunda en la arquitectura sagrada de los Incas. Escuchaste el relato sobre la fusión de los muros Incas con la arquitectura colonial española.',
    image: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=700&q=80',
    meta: 'Audio: "El Oro del Cusco"',
  },
  {
    id: '2',
    date: '12 OCT, 2023 · 09:15 AM',
    title: 'Valle Sagrado: Ruta de Sal',
    description: 'Completaste la ruta senderista por las salineras de Maras. El mapa muestra tu recorrido desde el mirador hasta el fondo del valle.',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=700&q=80',
    status: { label: 'Ruta Finalizada · 4.2km · 1h 20min', kind: 'finished' },
  },
  {
    id: '3',
    date: '10 OCT, 2023 · 03:45 PM',
    title: 'Huaca Pucllana',
    description: 'Visita nocturna a la pirámide de adobe en el corazón de Lima. Escaneaste 3 puntos de realidad aumentada para reconstruir los templos originales.',
    image: 'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=700&q=80',
    status: { label: '3 Escaneos · Favorito', kind: 'scan' },
  },
];

export default function HistoryScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { alert } = useAlert();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
      <View style={styles.header}>
        <Ionicons name="search-outline" size={22} color={colors.green} />
        <Text style={styles.headerTitle}>InkaVoice</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}><Ionicons name="settings-outline" size={22} color={colors.green} /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.eyebrow}>{t('history_eyebrow')}</Text>
        <Text style={styles.title}>{t('history_title')}</Text>

        <View style={styles.statsRow}>
          {STATS.map(stat => (
            <View key={stat.id} style={styles.statCard}>
              <Ionicons name={stat.icon as any} size={18} color={colors.green} />
              <Text style={styles.statLabel}>{t(stat.labelKey)}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.activeRouteCard}
          onPress={() => navigation.navigate('Routes')}
        >
          <Text style={styles.activeRouteLabel}>{t(ACTIVE_ROUTE.labelKey)}</Text>
          <Text style={styles.activeRouteTitle}>{ACTIVE_ROUTE.title}</Text>
          <View style={styles.activeRouteLink}>
            <Ionicons name="map-outline" size={14} color={colors.white} />
            <Text style={styles.activeRouteLinkText}>{t('history_view_progress')}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('history_favorites_title')}</Text>
          <TouchableOpacity onPress={() => alert(t('alert_favorites_title'), t('alert_favorites_message').replace('{count}', String(FAVORITES.length)))}>
            <Text style={styles.sectionLink}>{t('history_view_all')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.favoritesRow}>
          {FAVORITES.map(fav => (
            <TouchableOpacity key={fav.id} style={styles.favoriteCard} onPress={() => navigation.navigate('Resultado')}>
              <Image source={{ uri: fav.image }} style={styles.favoriteImage} />
              <View style={styles.favoriteRegionBadge}>
                <Text style={styles.favoriteRegionText}>{t(fav.regionKey)}</Text>
              </View>
              <View style={styles.favoriteOverlay}>
                <Text style={styles.favoriteTitle}>{fav.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('history_recent_title')}</Text>
        </View>

        <View style={styles.timeline}>
          {TIMELINE.map((item, index) => (
            <View key={item.id} style={styles.timelineRow}>
              <View style={styles.timelineMarkerCol}>
                <View style={[styles.timelineDot, index === 0 && styles.timelineDotActive]} />
                {index < TIMELINE.length - 1 && <View style={styles.timelineLine} />}
              </View>

              <TouchableOpacity
                style={styles.timelineCard}
                onPress={() => navigation.navigate('Resultado', { nombre: item.title })}
              >
                <Text style={styles.timelineDate}>{item.date}</Text>
                <Text style={styles.timelineTitle}>{item.title}</Text>
                <Text style={styles.timelineDesc}>{item.description}</Text>

                {item.meta && (
                  <View style={styles.timelineMetaRow}>
                    <Ionicons name="musical-notes-outline" size={14} color={colors.gray500} />
                    <Text style={styles.timelineMetaText}>{item.meta}</Text>
                  </View>
                )}

                {item.status && item.status.kind === 'finished' && (
                  <View style={styles.timelineStatusRow}>
                    <View style={styles.timelineStatusBadge}>
                      <Ionicons name="checkmark-circle" size={16} color={colors.white} />
                      <Text style={styles.timelineStatusText}>{item.status.label}</Text>
                    </View>
                    <TouchableOpacity style={styles.timelineMapBtn} onPress={() => navigation.navigate('Discover')}>
                      <Text style={styles.timelineMapBtnText}>{t('history_view_map')}</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {item.status && item.status.kind === 'scan' && (
                  <View style={styles.timelineMetaRow}>
                    <Ionicons name="scan-outline" size={14} color={colors.gray500} />
                    <Text style={styles.timelineMetaText}>{item.status.label}</Text>
                  </View>
                )}

                <Image source={{ uri: item.image }} style={styles.timelineImage} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 16,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.green },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  eyebrow: { fontSize: 10, fontWeight: '700', color: colors.gold, letterSpacing: 1.5, marginBottom: 6 },
  title: { fontSize: 26, fontWeight: '800', color: colors.green, marginBottom: 20 },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: colors.gray100, borderRadius: 16, padding: 16, gap: 4 },
  statLabel: { fontSize: 9, fontWeight: '700', color: colors.gray500, letterSpacing: 0.5, marginTop: 4 },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.green },

  activeRouteCard: { backgroundColor: colors.greenDark, borderRadius: 18, padding: 18, marginBottom: 28 },
  activeRouteLabel: { fontSize: 9, fontWeight: '700', color: colors.goldLight, letterSpacing: 1, marginBottom: 6 },
  activeRouteTitle: { fontSize: 20, fontWeight: '800', color: colors.white, marginBottom: 12 },
  activeRouteLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  activeRouteLinkText: { color: colors.white, fontSize: 12, fontWeight: '600' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.green },
  sectionLink: { fontSize: 12, fontWeight: '600', color: colors.teal },

  favoritesRow: { gap: 12, paddingRight: 8, marginBottom: 28 },
  favoriteCard: { width: 160, height: 190, borderRadius: 16, overflow: 'hidden' },
  favoriteImage: { width: '100%', height: '100%' },
  favoriteRegionBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: colors.badgeYellow, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  favoriteRegionText: { fontSize: 9, fontWeight: '800', color: colors.green },
  favoriteOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.4)', padding: 10 },
  favoriteTitle: { color: colors.white, fontSize: 14, fontWeight: '700' },

  timeline: { marginTop: 4 },
  timelineRow: { flexDirection: 'row', gap: 12 },
  timelineMarkerCol: { alignItems: 'center', width: 16 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.gold, marginTop: 6 },
  timelineDotActive: { backgroundColor: colors.green },
  timelineLine: { width: 2, flex: 1, backgroundColor: colors.gray200, marginTop: 4, marginBottom: 4 },
  timelineCard: { flex: 1, marginBottom: 24 },
  timelineDate: { fontSize: 11, color: colors.gray500, fontWeight: '600', marginBottom: 4 },
  timelineTitle: { fontSize: 17, fontWeight: '800', color: colors.green, marginBottom: 6 },
  timelineDesc: { fontSize: 13, color: colors.gray600, lineHeight: 20, marginBottom: 10 },
  timelineMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  timelineMetaText: { fontSize: 12, color: colors.gray500, fontWeight: '600' },
  timelineStatusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  timelineStatusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.green, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  timelineStatusText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  timelineMapBtn: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  timelineMapBtnText: { fontSize: 11, fontWeight: '700', color: colors.green },
  timelineImage: { width: '100%', height: 160, borderRadius: 14, marginTop: 4 },
});
