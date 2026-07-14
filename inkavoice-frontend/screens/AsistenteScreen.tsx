import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  AudioModule,
} from 'expo-audio';
import BottomTabBar from '../components/BottomTabBar';
import { useAlert } from '../context/AlertContext';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

const C = {
  bg: '#F2F1EE', white: '#FFFFFF', dark: '#0D1A0E', greenD: '#1A3A1E', greenM: '#244D28', greenL: '#2E5C33',
  gold: '#C9A84C', user: '#1E4D24', textDark: '#1A1A1A', textMid: '#444444', muted: '#999999', border: '#E0DED8', voiceBg: '#F7F6F3',
};

type Message = { id: number; text: string; sender: 'ai' | 'user' };

const DEFAULT_INITIAL: Message = {
  id: 1,
  sender: 'ai',
  text: '¡Hola! Soy tu guía InkaVoice.\nHoy estamos cerca de Sacsayhuamán. ¿Te gustaría conocer la historia de las piedras talladas o prefieres que te guíe a un mirador cercano?',
};

const SUGGESTIONS = ['¿Cómo llego desde aquí?', 'Dónde comer cerca', 'Historia de los Incas', 'Ruta Inca Trail'];

const AI_REPLIES: Record<string, string> = {
  '¿Cómo llego desde aquí?': 'Desde tu ubicación actual puedes caminar unos 15 minutos hacia el acceso principal de Sacsayhuamán. 🗺️',
  'Dónde comer cerca': 'Cerca encontrarás restaurantes con comida andina tradicional y cafés locales. 🍽️',
  'Historia de los Incas': 'El Imperio Inca fue una civilización andina que alcanzó gran expansión entre 1438 y 1533. 📚',
  'Ruta Inca Trail': 'La Ruta Inca conecta varios sitios arqueológicos y termina en Machu Picchu. 🏔️',
};

function WaveBar({ delay, color, active }: { delay: number; color: string; active: boolean }) {
  const anim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    if (active) {
      const loop = Animated.loop(Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ]));
      loop.start();
      return () => loop.stop();
    } else {
      anim.setValue(0.3);
    }
  }, [active]);
  return <Animated.View style={[styles.waveBar, { backgroundColor: color, transform: [{ scaleY: anim }] }]} />;
}

export default function AsistenteScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // Rescatamos las alertas y traducciones de fusion
  const { alert } = useAlert();
  const { t } = useLanguage();

  const siteName: string | undefined = route.params?.siteName;
  const scrollRef = useRef<ScrollView>(null);
  const micPulse = useRef(new Animated.Value(1)).current;

  const initialMessage: Message = siteName
    ? {
        id: 1,
        sender: 'ai',
        text: `¡Hola! Soy tu guía InkaVoice.\nVeo que quieres saber más sobre ${siteName}. Dame un momento y te cuento. ✨`,
      }
    : DEFAULT_INITIAL;

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isTyping, setIsTyping] = useState(false);
  const hasAutoAskedRef = useRef(false);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const isRecording = recorderState.isRecording;

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
      }
    })();
  }, []);

  const scrollToBottom = () => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

  const getAiReply = (userText: string): string => {
    if (AI_REPLIES[userText]) return AI_REPLIES[userText];
    if (siteName && userText.toLowerCase().includes(siteName.toLowerCase())) {
      return `${siteName} es uno de los lugares más fascinantes del Perú. (Aquí se conectará la información real generada por la IA: historia, datos curiosos y recomendaciones para visitarlo) 🏛️`;
    }
    return 'Todavía no tengo información específica sobre eso.';
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    setIsTyping(true);
    scrollToBottom();
    setTimeout(() => {
      const reply = getAiReply(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: reply }]);
      setIsTyping(false);
      scrollToBottom();
    }, 1000);
  };


  useEffect(() => {
    if (siteName && !hasAutoAskedRef.current) {
      hasAutoAskedRef.current = true;
      setTimeout(() => sendMessage(`Cuéntame sobre ${siteName}`), 500);
    }
  }, [siteName]);

  const handleRecordedAudio = async (uri: string) => {
    const placeholderId = Date.now();
    setMessages(prev => [...prev, { id: placeholderId, sender: 'user', text: '🎤 Nota de voz enviada...' }]);
    setIsTyping(true);
    scrollToBottom();

    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'nota-de-voz.m4a',
        type: 'audio/m4a',
      } as any);
      formData.append('model', 'whisper-1');
      formData.append('language', 'es');

      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer TU_OPENAI_API_KEY',
        },
        body: formData,
      });

      if (!transcriptionResponse.ok) {
        throw new Error('Fallo la transcripción');
      }

      const transcriptionData = await transcriptionResponse.json();
      const userTranscription: string = transcriptionData.text?.trim() || '(no se entendió el audio)';

      await new Promise(resolve => setTimeout(resolve, 600));
      const aiReplyText = getAiReply(userTranscription);

      setMessages(prev => prev.map(m => (m.id === placeholderId ? { ...m, text: userTranscription } : m)));
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiReplyText }]);
    } catch (error) {
      setMessages(prev => prev.map(m => (m.id === placeholderId ? { ...m, text: '🎤 (no se pudo procesar el audio)' } : m)));
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      micPulse.stopAnimation();
      micPulse.setValue(1);
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      if (uri) {
        handleRecordedAudio(uri);
      }
      return;
    }

    const permission = await AudioModule.requestRecordingPermissionsAsync();
    if (!permission.granted) {
      alert(t('alert_mic_permission_title'), t('alert_mic_permission_message'));
      return;
    }

    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      Animated.loop(Animated.sequence([
        Animated.timing(micPulse, { toValue: 1.15, duration: 500, useNativeDriver: true }),
        Animated.timing(micPulse, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])).start();
    } catch (e) {
      alert(t('alert_recording_error_title'), t('alert_recording_error_message'));
    }
  };

  const WAVE_DELAYS = [0, 60, 120, 180, 240, 300, 240, 180, 120, 60, 0, 60];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={C.greenD} />
        </TouchableOpacity>
        <Text style={styles.brandName}>InkaVoice</Text>
        <View style={styles.topNavRight}>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="search-outline" size={22} color={C.dark} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Settings')}><Ionicons name="settings-outline" size={22} color={C.dark} /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.hero}><Text style={styles.heroTitle}>{t('assistant_hero_title')}</Text></View>

      <ScrollView ref={scrollRef} style={styles.chat} contentContainerStyle={styles.chatContent}>
        {messages.map(msg => (
          <View key={msg.id} style={[styles.bubbleRow, msg.sender === 'user' && styles.bubbleRowUser]}>
            {msg.sender === 'ai' && <View style={styles.aiAvatar}><Text style={{ color: C.white }}>✦</Text></View>}
            <View style={{ flexShrink: 1 }}>
              <View style={[styles.bubble, msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
                <Text style={[styles.bubbleText, msg.sender === 'ai' && styles.bubbleTextAI]}>{msg.text}</Text>
              </View>
            </View>
            {msg.sender === 'user' && <View style={styles.userAvatar}><Ionicons name="person" size={15} color={C.gold} /></View>}
          </View>
        ))}
        {isTyping && (
          <View style={styles.bubbleRow}>
            <View style={styles.aiAvatar}><Text style={{ color: C.white }}>✦</Text></View>
            <View style={[styles.bubble, styles.bubbleAI]}><Text>•••</Text></View>
          </View>
        )}
      </ScrollView>

      <View style={styles.suggestionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
          {SUGGESTIONS.map(s => (
            <TouchableOpacity key={s} style={styles.chip} onPress={() => sendMessage(s)}>
              <Text style={styles.chipText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.voiceBar}>
        <View style={styles.waveContainer}>
          {WAVE_DELAYS.map((d, i) => <WaveBar key={i} delay={d} color={C.greenM} active={isRecording} />)}
        </View>
        <Animated.View style={{ transform: [{ scale: micPulse }] }}>
          <TouchableOpacity style={[styles.micBtn, isRecording && styles.micBtnActive]} onPress={toggleRecording}>
            <Ionicons name={isRecording ? 'stop' : 'mic'} size={22} color={C.white} />
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity style={styles.keyboardBtn}><Ionicons name="keypad-outline" size={20} color={C.muted} /></TouchableOpacity>
      </View>
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  menuBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  brandName: { color: C.dark, fontSize: 16, fontWeight: '700' },
  topNavRight: { flexDirection: 'row', gap: 12 },
  hero: { paddingHorizontal: 20, paddingTop: 20 },
  heroTitle: { color: C.dark, fontSize: 24, fontWeight: '800' },
  chat: { flex: 1 },
  chatContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 14 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, maxWidth: width * 0.9 },
  bubbleRowUser: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  aiAvatar: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.greenD, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  userAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.white, borderWidth: 1, borderColor: C.border, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  bubble: { borderRadius: 18, padding: 13, maxWidth: width * 0.7, flexShrink: 1 },
  bubbleAI: { backgroundColor: C.white, borderBottomLeftRadius: 4, elevation: 1 },
  bubbleUser: { backgroundColor: C.user, borderBottomRightRadius: 4 },
  bubbleText: { color: C.white, fontSize: 14 },
  bubbleTextAI: { color: C.textDark },
  suggestionsContainer: { paddingVertical: 10, backgroundColor: C.bg },
  suggestionsScroll: { paddingHorizontal: 16, gap: 8 },
  chip: { borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.white },
  chipText: { color: C.greenD, fontSize: 12, fontWeight: '600' },
  voiceBar: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: C.voiceBg, borderTopWidth: 1, borderTopColor: C.border, gap: 12 },
  waveContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 44, gap: 3 },
  waveBar: { flex: 1, height: 32, borderRadius: 2, maxWidth: 4 },
  micBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: C.greenD, justifyContent: 'center', alignItems: 'center' },
  micBtnActive: { backgroundColor: '#c0392b' },
  keyboardBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.white, borderWidth: 1, borderColor: C.border, justifyContent: 'center', alignItems: 'center' },
});