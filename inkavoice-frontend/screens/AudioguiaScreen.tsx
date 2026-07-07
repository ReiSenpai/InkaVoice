import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';

const C = { bg: colors.background, dark: colors.greenDark, green: colors.green, gold: colors.gold, goldL: colors.goldLight, white: colors.white, muted: colors.muted, card: colors.beige };

const CHAPTER_TEXTS: Record<string, { title: string; desc: string }> = {
  ESPAÑOL: { title: 'La Casa de la Gloria del Sol', desc: 'Descubre cómo estas enormes piedras, algunas con más de 100 toneladas, fueron talladas con tal precisión que ni una hoja de papel puede deslizarse entre ellas. Su diseño refleja los cuatro suyos del Tahuantinsuyo.' },
  ENGLISH: { title: "The House of the Sun's Glory", desc: 'Discover how these massive stones, some weighing over 100 tons, were carved with such precision that not even a sheet of paper can slide between them. Their design reflects the four suyos of the Tawantinsuyu.' },
  QUECHUA: { title: 'Inti Wasi Hatun Sumaq', desc: 'Kaypi rikusunki imaynatas kay hatun rumikuna, wakin pachaq tunilada nisqamanta astawan, chay chiqap llank\'asqa kasqanta. Mana huk qullqi qullqi chawpipi yaykupuwaqchu.' },
};

export default function AudioguiaScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params || {};

  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState<'ESPAÑOL' | 'ENGLISH' | 'QUECHUA'>('ESPAÑOL');
  const [progress, setProgress] = useState(30);
  const [translating, setTranslating] = useState(false);
  const [showTranslated, setShowTranslated] = useState(false);

  const chapter = CHAPTER_TEXTS[language];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => setProgress(prev => (prev < 100 ? prev + 1 : 0)), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTranslate = (lang: 'ESPAÑOL' | 'ENGLISH' | 'QUECHUA') => {
    if (lang === language) return;
    setTranslating(true);
    setShowTranslated(false);
    setTimeout(() => {
      setLanguage(lang);
      setTranslating(false);
      setShowTranslated(true);
    }, 900);
  };

  const formatTime = (pct: number) => {
    const total = 765;
    const current = Math.floor((pct / 100) * total);
    const m = Math.floor(current / 60).toString().padStart(2, '0');
    const s = (current % 60).toString().padStart(2, '0');
    return `${m}:${s} / 12:45`;
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Resultado')}>
          <Ionicons name="arrow-back" size={22} color={C.green} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>InkaVoice</Text>
        <TouchableOpacity><Ionicons name="ellipsis-vertical" size={22} color={C.green} /></TouchableOpacity>
      </View>

      <Text style={styles.location}>{params.region || 'Cusco, Capital Imperial'} · HIGHLANDS REGION</Text>

      <View style={styles.circleContainer}>
        <View style={styles.circleOuter}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=500' }} style={styles.coverImage} />
          </View>
        </View>
        <View style={[styles.arcDecor, { borderTopColor: C.goldL, borderRightColor: C.goldL }]} />
      </View>

      <View style={styles.timeBadge}><Text style={styles.timeText}>{formatTime(progress)}</Text></View>

      <View style={styles.languageContainer}>
        {(['ESPAÑOL', 'ENGLISH', 'QUECHUA'] as const).map(lang => (
          <TouchableOpacity key={lang} style={[styles.langBtn, language === lang && styles.langBtnActive]} onPress={() => handleTranslate(lang)}>
            <Text style={[styles.langText, language === lang && styles.langTextActive]}>{lang}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => setProgress(p => Math.max(0, p - 10))}>
          <Ionicons name="play-skip-back" size={28} color={C.gold} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={() => setIsPlaying(!isPlaying)}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color={C.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setProgress(p => Math.min(100, p + 10))}>
          <Ionicons name="play-skip-forward" size={28} color={C.gold} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>

      <View style={styles.chapterCard}>
        <View style={styles.chapterHeader}>
          <Text style={styles.chapterLabel}>CAPÍTULO ACTUAL</Text>
          <Ionicons name="headset-outline" size={20} color={C.gold} />
        </View>
        {translating ? (
          <View style={styles.translatingRow}>
            <ActivityIndicator color={C.gold} />
            <Text style={styles.translatingText}>Traduciendo al {language}...</Text>
          </View>
        ) : (
          <>
            {showTranslated && (
              <View style={styles.translatedBadge}>
                <Ionicons name="language-outline" size={13} color={C.green} />
                <Text style={styles.translatedBadgeText}>Traducido · {language}</Text>
              </View>
            )}
            <Text style={styles.chapterTitle}>{chapter.title}</Text>
            <Text style={styles.chapterDesc}>{chapter.desc}</Text>
          </>
        )}
        <View style={styles.chapterProgressTrack}>
          <View style={[styles.chapterProgressFill, { width: `${progress}%` }]} />
          <View style={[styles.chapterProgressDot, { left: `${progress}%` }]} />
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
      <BottomTabBar active="Discover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: C.green },
  location: { textAlign: 'center', fontStyle: 'italic', color: C.muted, marginBottom: 24, fontSize: 13 },
  circleContainer: { alignItems: 'center', marginBottom: 12, position: 'relative' },
  circleOuter: { width: 210, height: 210, borderRadius: 105, borderWidth: 6, borderColor: '#DDD', overflow: 'hidden', backgroundColor: '#EEE' },
  imageWrapper: { width: '100%', height: '100%' },
  coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  arcDecor: { position: 'absolute', width: 230, height: 230, borderRadius: 115, borderWidth: 4, borderColor: 'transparent', top: -10, transform: [{ rotate: '30deg' }] },
  timeBadge: { backgroundColor: '#2A2A2A', alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 20 },
  timeText: { color: '#FFD700', fontWeight: '700', fontSize: 13, letterSpacing: 1 },
  languageContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 28 },
  langBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: '#CCC' },
  langBtnActive: { backgroundColor: C.gold, borderColor: C.gold },
  langText: { fontSize: 12, fontWeight: '700', color: C.muted, letterSpacing: 0.5 },
  langTextActive: { color: C.white },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 32, marginBottom: 20 },
  playButton: { backgroundColor: C.gold, width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  progressTrack: { height: 4, backgroundColor: '#DDD', borderRadius: 2, marginBottom: 28, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.goldL, borderRadius: 2 },
  chapterCard: { backgroundColor: C.card, padding: 20, borderRadius: 20, gap: 10 },
  chapterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chapterLabel: { color: C.green, fontWeight: '800', fontSize: 13, letterSpacing: 1 },
  chapterTitle: { fontSize: 16, fontWeight: '700', color: C.dark },
  chapterDesc: { fontSize: 14, color: '#555', lineHeight: 22 },
  translatingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  translatingText: { color: C.muted, fontSize: 14, fontStyle: 'italic' },
  translatedBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#E8F5E9', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  translatedBadgeText: { color: C.green, fontSize: 11, fontWeight: '700' },
  chapterProgressTrack: { height: 4, backgroundColor: '#DDD', borderRadius: 2, marginTop: 6, position: 'relative' },
  chapterProgressFill: { height: '100%', backgroundColor: C.goldL, borderRadius: 2 },
  chapterProgressDot: { position: 'absolute', top: -4, width: 12, height: 12, borderRadius: 6, backgroundColor: C.gold, marginLeft: -6 },
});
