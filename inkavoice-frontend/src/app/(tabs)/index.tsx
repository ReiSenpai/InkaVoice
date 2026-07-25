import { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const TAB_BAR_HEIGHT = 72;

const CATEGORIES = [
  { id: 'Todo', labelKey: 'Todo' },
  { id: 'Costa', labelKey: 'Costa' },
  { id: 'Sierra', labelKey: 'Sierra' },
  { id: 'Selva', labelKey: 'Selva' },
];

const RECOMMENDED = [
  {
    id: '1',
    title: 'Machu Picchu',
    region: 'SIERRA',
    image: 'https://images.unsplash.com/photo-1587599329214-4f39e0379430?w=600&q=80',
    audioLabel: 'Audio Guía • 12 min',
  },
  {
    id: '2',
    title: 'Líneas de Nazca',
    region: 'COSTA',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80',
    audioLabel: 'Audio Guía • 8 min',
  },
];

const AI_PICKS = [
  {
    id: '1',
    title: 'Sacsayhuamán',
    match: '98% Match',
    description: 'Explora la ingeniería lítica de los muros ciclópeos de Cusco.',
    bg: '#F5F2EC',
  },
  {
    id: '2',
    title: 'Pachacámac',
    match: '85% Match',
    description: 'El oráculo más importante de la costa central peruana.',
    bg: '#FFFFFF',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('Todo');
  const [search, setSearch] = useState('');
  const insets = useSafeAreaInsets();
  const fabBottom = TAB_BAR_HEIGHT + insets.bottom + 12;

  // Colores exactos del Figma
  const C = {
    bg: '#FAF8F5',
    greenDark: '#00332D',
    gold: '#C9A84C',
    goldLight: '#FCD34D',
    white: '#FFFFFF',
    text: '#111827',
    muted: '#6B7280',
    border: '#E5E7EB'
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    scroll: { paddingHorizontal: 20, paddingTop: 8 },
    topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    topTitle: { fontSize: 18, fontWeight: '800', color: C.greenDark },
    greeting: { fontSize: 32, fontWeight: '800', color: C.greenDark, marginBottom: 8 },
    greetingSub: { fontSize: 15, lineHeight: 24, color: C.muted, marginBottom: 24, paddingRight: 20 },
    
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 16, paddingHorizontal: 16, minHeight: 56, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
    searchInput: { flex: 1, fontSize: 15, color: C.text, paddingHorizontal: 10 },
    
    categoriesRow: { gap: 12, marginBottom: 32, paddingRight: 8 },
    categoryPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, backgroundColor: C.border },
    categoryPillActive: { backgroundColor: C.greenDark },
    categoryText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
    categoryTextActive: { color: C.white },
    
    sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 },
    sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, color: C.gold, marginBottom: 4 },
    sectionTitle: { fontSize: 26, fontWeight: '800', color: C.greenDark, lineHeight: 32 },
    sectionLink: { fontSize: 13, fontWeight: '600', color: C.muted },
    
    cardsRow: { gap: 16, paddingRight: 8, marginBottom: 36 },
    discoverCard: { width: 220, height: 320, borderRadius: 20, overflow: 'hidden' },
    discoverImage: { flex: 1, justifyContent: 'space-between' },
    discoverImageInner: { borderRadius: 20 },
    regionBadge: { alignSelf: 'flex-start', margin: 16, backgroundColor: C.goldLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    regionBadgeText: { fontSize: 10, fontWeight: '800', color: C.greenDark, letterSpacing: 0.5 },
    discoverOverlay: { padding: 16, paddingTop: 40, backgroundColor: 'rgba(0,0,0,0.45)' },
    discoverTitle: { fontSize: 22, fontWeight: '800', color: C.white, marginBottom: 6 },
    audioLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    audioLabelText: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' },
    
    aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    aiTitle: { fontSize: 26, fontWeight: '800', color: C.greenDark },
    
    featuredCard: { backgroundColor: C.white, borderRadius: 24, overflow: 'hidden', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 3 },
    featuredImage: { height: 140 },
    featuredImageInner: { resizeMode: 'cover' },
    featuredBody: { padding: 24 },
    featuredLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, color: C.gold, marginBottom: 8 },
    featuredTitle: { fontSize: 22, fontWeight: '800', color: C.greenDark, marginBottom: 8 },
    featuredDesc: { fontSize: 14, lineHeight: 22, color: C.muted, marginBottom: 20 },
    featuredBtn: { alignSelf: 'flex-start', backgroundColor: C.greenDark, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
    featuredBtnText: { color: C.white, fontWeight: '700', fontSize: 14 },
    
    pickCard: { borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
    pickTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    pickMatch: { fontSize: 11, fontWeight: '800', color: C.greenDark },
    pickTitle: { fontSize: 18, fontWeight: '800', color: C.greenDark, marginBottom: 6 },
    pickDesc: { fontSize: 14, lineHeight: 22, color: C.muted, paddingRight: 40 },
    playBtn: { position: 'absolute', right: 20, bottom: 20, width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', backgroundColor: C.white },
    
    fab: { position: 'absolute', right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: C.goldLight, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 10 },
    bottomSpacer: { height: 20 },
    pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 24 }]}>
        
        <View style={styles.topBar}>
          <Pressable hitSlop={10}>
            <Ionicons name="search" size={24} color={C.greenDark} />
          </Pressable>
          <Text style={styles.topTitle}>InkaVoice</Text>
          <Pressable onPress={() => router.push('/settings')} hitSlop={10}>
            <Ionicons name="settings-outline" size={24} color={C.greenDark} />
          </Pressable>
        </View>

        <Text style={styles.greeting}>{t('home_greeting') || 'Hola, Viajero'}</Text>
        <Text style={styles.greetingSub}>
          {t('home_greeting_sub') || 'Explora los susurros de la historia peruana a través de nuestra guía inteligente de voz.'}
        </Text>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={C.muted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t("home_search_placeholder") || "Busca monumentos, regiones o historias..."}
            placeholderTextColor={C.muted}
            style={styles.searchInput}
          />
          <Ionicons name="sparkles" size={20} color={C.gold} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
          {CATEGORIES.map((item) => {
            const active = activeCategory === item.id;
            return (
              <Pressable
                key={item.id}
                style={[styles.categoryPill, active && styles.categoryPillActive]}
                onPress={() => setActiveCategory(item.id)}
              >
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                  {t(item.labelKey) || item.labelKey}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionLabel}>{t('home_recommended_label') || 'RECOMENDADO'}</Text>
            <Text style={styles.sectionTitle}>{t('home_recommended_title') || 'Descubrir\nMaravillas'}</Text>
          </View>
          <Text style={styles.sectionLink}>{t('home_view_all') || 'Ver todas →'}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
          {RECOMMENDED.map((item) => (
            <View key={item.id} style={styles.discoverCard}>
              <ImageBackground source={{ uri: item.image }} style={styles.discoverImage} imageStyle={styles.discoverImageInner}>
                <View style={styles.regionBadge}>
                  <Text style={styles.regionBadgeText}>{item.region}</Text>
                </View>
                <View style={styles.discoverOverlay}>
                  <Text style={styles.discoverTitle}>{item.title}</Text>
                  <View style={styles.audioLabelRow}>
                    <Ionicons name="volume-medium" size={14} color="rgba(255,255,255,0.85)" />
                    <Text style={styles.audioLabelText}>{item.audioLabel}</Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>

        <View style={styles.aiHeader}>
          <Ionicons name="color-wand" size={22} color={C.gold} />
          <Text style={styles.aiTitle}>{t('home_ai_title') || 'Para ti, según la IA'}</Text>
        </View>

        <View style={styles.featuredCard}>
          <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80' }} style={styles.featuredImage} imageStyle={styles.featuredImageInner} />
          <View style={styles.featuredBody}>
            <Text style={styles.featuredLabel}>{t('home_featured_label') || 'DESCUBRIMIENTO SEMANAL'}</Text>
            <Text style={styles.featuredTitle}>{t('home_featured_title') || 'Secretos de la Amazonía'}</Text>
            <Text style={styles.featuredDesc}>
              {t('home_featured_desc') || 'Basado en tu interés por la naturaleza, hemos preparado una ruta sonora por el Parque Nacional del Manu.'}
            </Text>
            <Pressable style={({ pressed }) => [styles.featuredBtn, pressed && styles.pressed]} onPress={() => router.push('/rutas')}>
              <Text style={styles.featuredBtnText}>{t('home_featured_btn') || 'Iniciar Viaje'}</Text>
            </Pressable>
          </View>
        </View>

        {AI_PICKS.map((item) => (
          <View key={item.id} style={[styles.pickCard, { backgroundColor: item.bg }]}>
            <View style={styles.pickTop}>
              <View style={styles.audioLabelRow}>
                 <Ionicons name="scan-outline" size={18} color={C.gold} />
              </View>
              <Text style={styles.pickMatch}>{item.match}</Text>
            </View>
            <Text style={styles.pickTitle}>{item.title}</Text>
            <Text style={styles.pickDesc}>{item.description}</Text>
            <Pressable style={styles.playBtn} onPress={() => router.push('/resultado')}>
              <Ionicons name="play" size={16} color={C.greenDark} />
            </Pressable>
          </View>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Botón flotante dorado (Asistente IA) */}
      <Pressable style={({ pressed }) => [styles.fab, { bottom: fabBottom }, pressed && styles.pressed]} onPress={() => router.push('/asistente')}>
        <Ionicons name="mic-outline" size={28} color={C.greenDark} />
      </Pressable>
    </SafeAreaView>
  );
}