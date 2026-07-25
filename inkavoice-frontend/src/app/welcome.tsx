import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; // <-- Actualizado a Expo Router
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

type Slide = {
  id: string;
  titleKey: string;
  subtitleKey: string;
  cardTitleKey: string;
  cardDescKey: string;
  visual: 'camera' | 'voice' | 'routes';
  imageFallback: string; // Para usar imágenes exactas al mockup
};

const SLIDES: Slide[] = [
  {
    id: '1',
    titleKey: 'Inteligencia Cultural en\ntus manos', // Reemplazar por clave de traducción si existe
    subtitleKey: 'Explora el legado del Perú con la tecnología más\navanzada de acompañamiento histórico.',
    cardTitleKey: 'Reconocimiento con\nCámara',
    cardDescKey: 'Apunta tu cámara a cualquier huaca o\nartefacto y nuestra IA identificará\ninstantáneamente su origen, época y\nsignificado cultural.',
    visual: 'camera',
    imageFallback: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=600',
  },
  {
    id: '2',
    titleKey: 'Voces del pasado',
    subtitleKey: 'Escucha los relatos ocultos en cada ruina y monumento.',
    cardTitleKey: 'Audioguías\nInteligentes',
    cardDescKey: 'Disfruta de narraciones generadas por IA que se adaptan a tu ritmo y ubicación en tiempo real.',
    visual: 'voice',
    imageFallback: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=600',
  },
  {
    id: '3',
    titleKey: 'Rutas personalizadas',
    subtitleKey: 'Descubre el Perú a tu propia manera.',
    cardTitleKey: 'Planificación de\nRecorridos',
    cardDescKey: 'Nuestra IA crea el itinerario perfecto basado en tus gustos, tiempo y ubicación actual.',
    visual: 'routes',
    imageFallback: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600',
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const isLast = activeIndex === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.replace('/login'); // <-- Navegación conectada
      return;
    }
    const next = activeIndex + 1;
    listRef.current?.scrollToIndex({ index: next, animated: true });
    setActiveIndex(next);
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const Container = Platform.OS === 'web' ? View : SafeAreaView;
  const safeAreaProps = Platform.OS !== 'web' ? { edges: ['top', 'bottom'] as const } : {};

  // Colores extraídos exactamente del Figma
  const C = {
    bg: '#FAF8F5',
    greenDark: '#00332D',
    muted: '#6B7280',
    circles: '#E5E0D8',
    diamond: '#EFEBE2',
    dotInactive: '#D1D5DB',
    dotActive: '#A3B1A9'
  };

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: C.bg, overflow: 'hidden' },
    bgCircle1: { position: 'absolute', top: '35%', left: '-20%', width: SCREEN_WIDTH * 1.4, height: SCREEN_WIDTH * 1.4, borderRadius: SCREEN_WIDTH * 0.7, borderWidth: 1, borderColor: C.circles },
    bgCircle2: { position: 'absolute', top: '45%', left: '-10%', width: SCREEN_WIDTH * 1.2, height: SCREEN_WIDTH * 1.2, borderRadius: SCREEN_WIDTH * 0.6, borderWidth: 1, borderColor: C.circles },
    bgCircle3: { position: 'absolute', top: '55%', left: '0%', width: SCREEN_WIDTH, height: SCREEN_WIDTH, borderRadius: SCREEN_WIDTH * 0.5, borderWidth: 1, borderColor: C.circles },
    bgDiamond: { position: 'absolute', top: -40, alignSelf: 'center', width: 220, height: 220, backgroundColor: C.diamond, transform: [{ rotate: '45deg' }], zIndex: -1 },
    list: { flex: 1 },
    slide: { width: SCREEN_WIDTH, paddingHorizontal: 24, paddingTop: 40, alignItems: 'center' },
    title: { fontSize: 28, fontWeight: '800', color: C.greenDark, textAlign: 'center', lineHeight: 36, marginBottom: 12 },
    subtitle: { fontSize: 13, lineHeight: 22, color: C.muted, textAlign: 'center', paddingHorizontal: 16, marginBottom: 32 },
    card: { width: '100%', backgroundColor: colors.white, borderRadius: 24, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 5 },
    visualWrap: { width: '100%', height: 240, borderRadius: 16, overflow: 'hidden', backgroundColor: '#000', marginBottom: 24, position: 'relative', justifyContent: 'center', alignItems: 'center' },
    visualImage: { ...StyleSheet.absoluteFillObject, opacity: 0.5 },
    visualIconOverlay: { width: 72, height: 72, borderRadius: 20, borderWidth: 2, borderColor: colors.white, justifyContent: 'center', alignItems: 'center' },
    cardTitle: { fontSize: 22, fontWeight: '700', color: C.greenDark, textAlign: 'center', marginBottom: 16, lineHeight: 28 },
    cardDesc: { fontSize: 13, lineHeight: 22, color: C.muted, textAlign: 'center', paddingHorizontal: 10 },
    footer: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40, alignItems: 'center' },
    dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.dotInactive },
    dotActive: { backgroundColor: C.dotActive },
    nextBtn: { minHeight: 56, width: 200, borderRadius: 14, backgroundColor: C.greenDark, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    nextBtnText: { color: colors.white, fontSize: 15, fontWeight: '600' },
    pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  });

  return (
    <Container style={styles.safe} {...safeAreaProps}>
      {/* Fondos geométricos estilo Figma */}
      <View style={styles.bgDiamond} />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <FlatList
        ref={listRef}
        style={styles.list}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.title}>{t(item.titleKey) || item.titleKey}</Text>
            <Text style={styles.subtitle}>{t(item.subtitleKey) || item.subtitleKey}</Text>

            <View style={styles.card}>
              {/* Imagen central con icono según visual */}
              <View style={styles.visualWrap}>
                <Image source={{ uri: item.imageFallback }} style={styles.visualImage} resizeMode="cover" />
                <View style={styles.visualIconOverlay}>
                  {item.visual === 'camera' && <Ionicons name="camera-outline" size={40} color="#FFF" />}
                  {item.visual === 'voice' && <Ionicons name="headset-outline" size={40} color="#FFF" />}
                  {item.visual === 'routes' && <Ionicons name="map-outline" size={40} color="#FFF" />}
                </View>
              </View>
              <Text style={styles.cardTitle}>{t(item.cardTitleKey) || item.cardTitleKey}</Text>
              <Text style={styles.cardDesc}>{t(item.cardDescKey) || item.cardDescKey}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, index) => (
            <View key={index} style={[styles.dot, index === activeIndex && styles.dotActive]} />
          ))}
        </View>

        <Pressable style={({ pressed }) => [styles.nextBtn, pressed && styles.pressed]} onPress={handleNext}>
          <Text style={styles.nextBtnText}>Siguiente</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </Pressable>
      </View>
    </Container>
  );
}