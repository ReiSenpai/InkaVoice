import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, ImageBackground, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import * as FileSystemRaw from 'expo-file-system';
const FileSystem = FileSystemRaw as any;

const CORE_BACKEND_URL = 'http://192.168.1.36:3000'; // Tu backend

const CHAPTER_TEXTS: Record<string, { title: string; desc: string }> = {
  ESPAÑOL: { title: 'La Casa de la Gloria del Sol', desc: 'Descubre cómo estas enormes piedras, algunas con más de 100 toneladas, fueron talladas con tal precisión que ni una hoja de papel puede deslizarse entre ellas.' },
  ENGLISH: { title: "The House of the Sun's Glory", desc: 'Discover how these massive stones, some weighing over 100 tons, were carved with such precision that not even a sheet of paper can slide between them.' },
  QUECHUA: { title: 'Inti Wasi Hatun Sumaq', desc: 'Kaypi rikusunki imaynatas kay hatun rumikuna, wakin pachaq tunilada nisqamanta astawan, chay chiqap llank\'asqa kasqanta.' },
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=500';

export default function AudioguiaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ nombre?: string; region?: string; photoUri?: string }>();
  const insets = useSafeAreaInsets();

  const [language, setLanguage] = useState<'ESPAÑOL' | 'ENGLISH' | 'QUECHUA'>('ESPAÑOL');
  const [translating, setTranslating] = useState(false);
  const [isFetchingAudio, setIsFetchingAudio] = useState(false);

  // Estados del reproductor nativo
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const chapter = CHAPTER_TEXTS[language];
  const photoUri = params.photoUri;
  const coverImageSource = photoUri ? { uri: photoUri } : { uri: FALLBACK_IMAGE };

  // Limpiar el audio al salir de la pantalla
  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleTranslate = async (lang: 'ESPAÑOL' | 'ENGLISH' | 'QUECHUA') => {
    if (lang === language) return;
    setTranslating(true);
    
    // Detenemos el audio actual si se cambia el idioma
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
    
    setTimeout(() => {
      setLanguage(lang);
      setCurrentTime(0);
      setDuration(0);
      setTranslating(false);
    }, 900);
  };

  // --- LÓGICA DE CONEXIÓN CON ELEVENLABS ---
  const fetchTTSAndPlay = async () => {
    setIsFetchingAudio(true);
    try {
      // Configuramos el idioma para la IA (es, en, qu)
      const langCode = language === 'ESPAÑOL' ? 'es' : language === 'ENGLISH' ? 'en' : 'qu';
      
      // Llamada a tu Spring Boot (Ajusta la ruta según tu Controller)
      const response = await fetch(`${CORE_BACKEND_URL}/api/asistente/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: chapter.desc, language: langCode }),
      });

      const data = await response.json();

      if (data.audio_base64) {
        const cleanBase64 = data.audio_base64.replace(/^data:audio\/\w+;base64,/, '');
        const uri = FileSystem.cacheDirectory + `guia_${langCode}.wav`;
        
        await FileSystem.writeAsStringAsync(uri, cleanBase64, { encoding: FileSystem.EncodingType.Base64 });
        
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        
        setSound(newSound);
        setIsPlaying(true);
      } else {
        Alert.alert('Error', 'No se pudo generar el audio.');
      }
    } catch (error) {
      console.error("Error obteniendo TTS:", error);
      Alert.alert('Error de red', 'No se pudo conectar con el servidor de voz.');
    } finally {
      setIsFetchingAudio(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    }
  };

  const handlePlayPress = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } else {
      await fetchTTSAndPlay();
    }
  };

  const skip = async (seconds: number) => {
    if (sound) {
      const newTime = (currentTime + seconds) * 1000;
      await sound.setPositionAsync(Math.max(0, newTime));
    }
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <ImageBackground source={coverImageSource} style={styles.container} blurRadius={30}>
      <View style={styles.darkOverlay} />
      
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 10, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#00332D" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>InkaVoice</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#00332D" />
          </TouchableOpacity>
        </View>

        <View style={styles.titleSection}>
          <View style={styles.regionBadge}>
            <Text style={styles.regionText}>HIGHLANDS REGION</Text>
          </View>
          <Text style={styles.mainTitle}>{params.nombre || 'Sacsayhuamán Fortress'}</Text>
          <Text style={styles.locationSub}>{params.region || 'Cusco, Imperial Capital'}</Text>
        </View>

        <View style={styles.artContainer}>
          <View style={styles.artRing}>
            <Image source={coverImageSource} style={styles.artImage} />
            <View style={styles.artSplitOverlay} /> 
          </View>
        </View>

        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>{formatTime(currentTime)} / {formatTime(duration)}</Text>
        </View>

        <View style={styles.langPillContainer}>
          {(['ESPAÑOL', 'ENGLISH', 'QUECHUA'] as const).map(lang => (
            <TouchableOpacity 
              key={lang} 
              style={[styles.langBtn, language === lang && styles.langBtnActive]} 
              onPress={() => handleTranslate(lang)}
            >
              <Text style={[styles.langText, language === lang && styles.langTextActive]}>{lang}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={() => skip(-10)}>
            <Ionicons name="play-skip-back" size={32} color="#85601E" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.playBtnSquare} onPress={handlePlayPress} disabled={isFetchingAudio}>
            {isFetchingAudio ? (
                <ActivityIndicator color="#FFF" />
            ) : (
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color="#FFF" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => skip(10)}>
            <Ionicons name="play-skip-forward" size={32} color="#85601E" />
          </TouchableOpacity>
        </View>

        <View style={styles.chapterCard}>
          <View style={styles.chapterHeader}>
            <Text style={styles.chapterLabel}>CURRENT CHAPTER</Text>
            <Ionicons name="headset-outline" size={20} color="#6B7280" />
          </View>
          
          {translating ? (
            <View style={{ padding: 20, alignItems: 'center' }}><ActivityIndicator color="#85601E" /></View>
          ) : (
            <Text style={styles.chapterDesc}>"{chapter.desc}"</Text>
          )}

          <View style={styles.progressSegmentsRow}>
            {/* Barra de progreso dinámica */}
            <View style={[styles.progressSegment, { backgroundColor: '#E5E7EB', overflow: 'hidden' }]}>
                <View style={{ width: `${progressPct}%`, height: '100%', backgroundColor: '#85601E' }} />
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.75)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#00332D' },
  
  titleSection: { alignItems: 'center', marginBottom: 30 },
  regionBadge: { backgroundColor: '#FCD34D', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  regionText: { fontSize: 10, fontWeight: '800', color: '#00332D', letterSpacing: 1 },
  mainTitle: { fontSize: 28, fontWeight: '400', color: '#00332D', textAlign: 'center', marginBottom: 6 },
  locationSub: { fontSize: 14, fontStyle: 'italic', color: '#4B5563' },
  
  artContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  artRing: { width: 220, height: 220, borderRadius: 20, borderWidth: 2, borderColor: '#85601E', padding: 8, justifyContent: 'center', alignItems: 'center' },
  artImage: { width: '100%', height: '100%', borderRadius: 16, zIndex: 2 },
  artSplitOverlay: { position: 'absolute', width: '100%', height: '100%', borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.1)', zIndex: 1 },
  
  timeBadge: { backgroundColor: '#2D3748', alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 30 },
  timeText: { color: '#FCD34D', fontWeight: '600', fontSize: 12, letterSpacing: 1 },
  
  langPillContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 30, alignSelf: 'center', padding: 4, marginBottom: 40 },
  langBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 26 },
  langBtnActive: { backgroundColor: '#85601E' },
  langText: { fontSize: 11, fontWeight: '800', color: '#6B7280', letterSpacing: 0.5 },
  langTextActive: { color: '#FFF' },
  
  controlsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40, marginBottom: 40 },
  playBtnSquare: { width: 72, height: 72, backgroundColor: '#85601E', borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  
  chapterCard: { backgroundColor: '#F9F8F6', borderRadius: 16, padding: 20 },
  chapterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  chapterLabel: { fontSize: 11, fontWeight: '800', color: '#00332D', letterSpacing: 1 },
  chapterDesc: { fontSize: 15, color: '#374151', lineHeight: 24, fontStyle: 'italic', marginBottom: 24 },
  
  progressSegmentsRow: { flexDirection: 'row', gap: 6 },
  progressSegment: { flex: 1, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2 },
});