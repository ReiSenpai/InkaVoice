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
import { Ionicons } from '@expo/vector-icons'; // <-- LIBRERÍA DE ICONOS AGREGADA
import { colors } from '../../theme/colors';

const TAB_BAR_HEIGHT = 72;

const CATEGORIES = ['Todo', 'Costa', 'Sierra', 'Selva'];

const RECOMMENDED = [
  {
    id: '1',
    title: 'Machu Picchu',
    region: 'SIERRA',
    image: 'https://images.unsplash.com/photo-1587599329214-4f39e0379430?w=600&q=80',
    fallbackColor: '#4a6741',
  },
  {
    id: '2',
    title: 'Líneas de Nazca',
    region: 'COSTA',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80',
    fallbackColor: '#c4a35a',
  },
  {
    id: '3',
    title: 'Manu',
    region: 'SELVA',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80',
    fallbackColor: '#2d5a3d',
  },
];

const AI_PICKS = [
  {
    id: '1',
    title: 'Sacsayhuamán',
    match: '98% Match',
    description: 'Explora la ingeniería lítica de los muros ciclópeos de Cusco.',
    iconName: 'library-outline', // <-- Nombre del icono en lugar de emoji 🏛
    bg: colors.beige,
  },
  {
    id: '2',
    title: 'Pachacámac',
    match: '85% Match',
    description: 'El oráculo más importante de la costa central peruana.',
    iconName: 'compass-outline', // <-- Nombre del icono en lugar de emoji 🧭
    bg: colors.white,
  },
];

export default function HomeScreen() {
  const router = useRouter(); 
  const [activeCategory, setActiveCategory] = useState('Todo');
  const [search, setSearch] = useState('');
  const insets = useSafeAreaInsets();
  const fabBottom = TAB_BAR_HEIGHT + insets.bottom + 12;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 24 },
        ]}
      >
        {/* TOP BAR CON ICONOS */}
        <View style={styles.topBar}>
          <Pressable hitSlop={10}>
            <Ionicons name="search" size={24} color={colors.green} />
          </Pressable>
          <Text style={styles.topTitle}>InkaVoice</Text>
          <Pressable hitSlop={10}>
            <Ionicons name="settings-outline" size={24} color={colors.green} />
          </Pressable>
        </View>

        <Text style={styles.greeting}>Hola, Viajero</Text>
        <Text style={styles.greetingSub}>
          Explora los susurros de la historia peruana a través de nuestra guía inteligente de voz.
        </Text>

        {/* BARRA DE BÚSQUEDA CON ICONOS */}
        <View style={styles.searchBar}>
          <Ionicons name="globe-outline" size={20} color={colors.gray400} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Busca monumentos, regiones o histori..."
            placeholderTextColor={colors.gray400}
            style={styles.searchInput}
          />
          <Ionicons name="sparkles" size={20} color={colors.gold} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((item) => {
            const active = activeCategory === item;
            return (
              <Pressable
                key={item}
                style={[styles.categoryPill, active && styles.categoryPillActive]}
                onPress={() => setActiveCategory(item)}
              >
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionLabel}>RECOMENDADO</Text>
            <Text style={styles.sectionTitle}>Descubrir Maravillas</Text>
          </View>
          <Text style={styles.sectionLink}>Ver todas →</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}
        >
          {RECOMMENDED.map((item) => (
            <View key={item.id} style={styles.discoverCard}>
              <ImageBackground
                source={{ uri: item.image }}
                style={[styles.discoverImage, { backgroundColor: item.fallbackColor }]}
                imageStyle={styles.discoverImageInner}
              >
                <View style={styles.regionBadge}>
                  <Text style={styles.regionBadgeText}>{item.region}</Text>
                </View>
                <View style={styles.discoverOverlay}>
                  <Text style={styles.discoverTitle}>{item.title}</Text>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>

        {/* HEADER DE IA CON ICONO */}
        <View style={styles.aiHeader}>
          <Ionicons name="sparkles" size={20} color={colors.gold} />
          <Text style={styles.aiTitle}>Para ti, según la IA</Text>
        </View>

        <View style={styles.featuredCard}>
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
            }}
            style={styles.featuredImage}
            imageStyle={styles.featuredImageInner}
          >
            <View style={styles.featuredImageOverlay} />
          </ImageBackground>
          <View style={styles.featuredBody}>
            <Text style={styles.featuredLabel}>DESCUBRIMIENTO SEMANAL</Text>
            <Text style={styles.featuredTitle}>Secretos de la Amazonía</Text>
            <Text style={styles.featuredDesc}>
              Basado en tu interés por la naturaleza, hemos preparado una ruta sonora por el
              Parque Nacional del Manu.
            </Text>
            <Pressable style={({ pressed }) => [styles.featuredBtn, pressed && styles.pressed]}>
              <Text style={styles.featuredBtnText}>Iniciar Viaje</Text>
            </Pressable>
          </View>
        </View>

        {AI_PICKS.map((item) => (
          <View key={item.id} style={[styles.pickCard, { backgroundColor: item.bg }]}>
            <View style={styles.pickTop}>
              {/* ICONO DINÁMICO */}
              <Ionicons name={item.iconName as any} size={22} color={colors.green} />
              <Text style={styles.pickMatch}>{item.match}</Text>
            </View>
            <Text style={styles.pickTitle}>{item.title}</Text>
            <Text style={styles.pickDesc}>{item.description}</Text>
            <Pressable style={styles.playBtn}>
              <Ionicons name="play" size={16} color={colors.teal} />
            </Pressable>
          </View>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* BOTÓN FLOTANTE CON ICONO DE MICRÓFONO */}
      <Pressable
        onPress={() => router.push('/asistente')}
        style={({ pressed }) => [styles.fab, { bottom: fabBottom }, pressed && styles.pressed]}
      >
        <Ionicons name="mic" size={26} color={colors.green} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 4 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  topTitle: { fontSize: 22, fontWeight: '700', color: colors.green },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.green,
    marginBottom: 6,
  },
  greetingSub: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.gray500,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 48,
    marginBottom: 20,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1f2937' },
  categoriesRow: { gap: 10, marginBottom: 24, paddingRight: 8 },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: colors.gray100,
  },
  categoryPillActive: { backgroundColor: colors.green },
  categoryText: { fontSize: 14, fontWeight: '500', color: colors.gray600 },
  categoryTextActive: { color: colors.white },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.gold,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 24, fontWeight: '700', color: colors.green },
  sectionLink: { fontSize: 13, fontWeight: '600', color: colors.teal },
  cardsRow: { gap: 14, paddingRight: 8, marginBottom: 28 },
  discoverCard: {
    width: 200,
    height: 260,
    borderRadius: 18,
    overflow: 'hidden',
  },
  discoverImage: { flex: 1, justifyContent: 'space-between' },
  discoverImageInner: { borderRadius: 18 },
  regionBadge: {
    alignSelf: 'flex-start',
    margin: 12,
    backgroundColor: colors.badgeYellow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  regionBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.green,
    letterSpacing: 0.5,
  },
  discoverOverlay: {
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  discoverTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  aiTitle: { fontSize: 22, fontWeight: '700', color: colors.green },
  featuredCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  featuredImage: { height: 160, backgroundColor: '#2d5a3d' },
  featuredImageInner: { resizeMode: 'cover' },
  featuredImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  featuredBody: { padding: 20 },
  featuredLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.gold,
    marginBottom: 6,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.green,
    marginBottom: 8,
  },
  featuredDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.gray500,
    marginBottom: 16,
  },
  featuredBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.green,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  featuredBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  pickCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray100,
    position: 'relative',
  },
  pickTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickMatch: { fontSize: 11, fontWeight: '600', color: colors.gray400 },
  pickTitle: { fontSize: 20, fontWeight: '700', color: colors.green, marginBottom: 6 },
  pickDesc: { fontSize: 13, lineHeight: 20, color: colors.gray500, paddingRight: 48 },
  playBtn: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8f0ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.badgeYellow,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  bottomSpacer: { height: 8 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});