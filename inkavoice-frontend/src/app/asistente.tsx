import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  Platform,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext'; // <-- IMPORTAMOS EL CONTEXTO DE USUARIO

// Alias seguro para engañar a TypeScript con las versiones de Expo
const FS: any = FileSystem; 

const { width } = Dimensions.get('window');

type Message = { id: number; text: string; sender: 'ai' | 'user'; image?: string };

const INITIAL: Message[] = [
  {
    id: 1,
    sender: 'ai',
    text: '¡Hola! Soy tu guía InkaVoice.\nHoy estamos cerca de Sacsayhuamán. ¿Te gustaría conocer la historia de las piedras talladas o prefieres que te guíe a un mirador cercano?',
  },
];

const RECOMMENDATIONS = [
  { id: '1', title: 'Ruta de Piedra', subtitle: '45 min • Fácil', icon: 'map-outline', color: '#E8F5E9', iconColor: '#1E8A5F' },
  { id: '2', title: 'Comida Local', subtitle: 'A 200m de ti', icon: 'restaurant-outline', color: '#FFF8E1', iconColor: '#C9A84C' },
];

function WaveBar({ delay, color }: { delay: number; color: string }) {
  const anim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[styles.waveBar, { backgroundColor: color, transform: [{ scaleY: anim }] }]} />;
}

export default function AsistenteScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const micPulse = useRef(new Animated.Value(1)).current;
  const { language } = useLanguage();
  const { colors } = useTheme();
  
  // EXTRAEMOS EL TOKEN DE SESIÓN
  const { token } = useUser(); 

  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);

  const [recordingObject, setRecordingObject] = useState<Audio.Recording | undefined>();
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // 🧠 APUNTANDO AL BACKEND PYTHON (FastAPI - IA)
  const AI_BACKEND_URL = 'http://192.168.1.36:8000';

  const C = {
    bg: '#FAF8F5',
    greenDark: '#00332D',
    gold: '#C9A84C',
    white: '#FFFFFF',
    textDark: '#111827',
    muted: '#6B7280',
    border: '#E5E7EB',
  };

  const scrollToBottom = () => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

  // --- ENVÍO DE TEXTO AL BACKEND PYTHON ---
  const sendTextToBackend = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    setInputText('');
    setShowKeyboard(false);
    setIsTyping(true);
    scrollToBottom();

    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('language', language || 'es');

      const response = await fetch(`${AI_BACKEND_URL}/api/v1/voice/process_text/`, {
        method: 'POST',
        headers: { 
            // ENVIAMOS EL TOKEN DE SEGURIDAD
            'Authorization': `Bearer ${token}` 
        },
        body: formData, 
      });
      
      const textResponse = await response.text();

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${textResponse}`);

      const data = JSON.parse(textResponse);
      
      if (text.toLowerCase().includes('sacsayhuamán') || text.toLowerCase().includes('piedras')) {
         setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            sender: 'ai', 
            text: data.resultado_texto || 'La precisión es asombrosa...',
            image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600&q=80'
         }]);
      } else {
         setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: data.resultado_texto }]);
      }
      
      if (data.audio_base64) playAiAudio(data.audio_base64);

    } catch (error) {
      console.error("Error en texto:", error);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: 'Error de conexión. Revisa consola.' }]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  // --- GRABACIÓN Y ENVÍO DE VOZ AL BACKEND PYTHON ---
  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      micPulse.stopAnimation();
      micPulse.setValue(1);
      
      if (!recordingObject) return;
      await recordingObject.stopAndUnloadAsync();
      const uri = recordingObject.getURI();
      setRecordingObject(undefined);
      
      if (uri) await sendAudioToBackend(uri);
    } else {
      try {
        if (sound) await sound.unloadAsync();
        
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({ 
          allowsRecordingIOS: true, 
          playsInSilentModeIOS: true 
        });
        
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setRecordingObject(recording);
        setIsRecording(true);
        
        Animated.loop(Animated.sequence([
          Animated.timing(micPulse, { toValue: 1.15, duration: 500, useNativeDriver: true }),
          Animated.timing(micPulse, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])).start();
      } catch (err) {
        console.error('Error al iniciar grabación', err);
      }
    }
  };

  const sendAudioToBackend = async (uri: string) => {
    setIsTyping(true);
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: '🎤 [Nota de Voz Enviada]' }]);
    scrollToBottom();

    try {
      const formData = new FormData();
      formData.append('language', language || 'es');
      formData.append('audio', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        type: 'audio/wav',
        name: 'audio.wav',
      } as any);

      const response = await fetch(`${AI_BACKEND_URL}/api/v1/voice/process/`, { 
        method: 'POST', 
        headers: {
            // ENVIAMOS EL TOKEN DE SEGURIDAD
            'Authorization': `Bearer ${token}`
        },
        body: formData 
      });
      
      const textResponse = await response.text();

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${textResponse}`);

      const data = JSON.parse(textResponse);

      if (data.status === 'success') {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: data.resultado_texto }]);
        if (data.audio_base64) playAiAudio(data.audio_base64);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: 'No pude escuchar con claridad.' }]);
      }
    } catch (error) {
      console.error("Error en voz:", error);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: 'Fallo en la conexión de audio.' }]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  const playAiAudio = async (base64Audio: string) => {
    try {
      const cleanBase64 = base64Audio.replace(/^data:audio\/\w+;base64,/, '');
      const uri = FS.cacheDirectory + 'ai_response.wav';
      await FS.writeAsStringAsync(uri, cleanBase64, { 
        encoding: FS.EncodingType.Base64 
      });
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      
      setSound(newSound);
    } catch (error) {
      console.error('Error procesando el audio TTS', error);
    }
  };

  const WAVE_DELAYS = [0, 60, 120, 180, 240, 300, 240, 180, 120, 60, 0, 60];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* ── Top nav ── */}
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <Ionicons name="menu" size={28} color={C.greenDark} />
          </TouchableOpacity>
          <Text style={styles.brandName}>InkaVoice</Text>
          <View style={styles.topNavRight}>
            <TouchableOpacity style={styles.iconBtn}><Ionicons name="search-outline" size={24} color={C.greenDark} /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/settings')}><Ionicons name="settings-outline" size={24} color={C.greenDark} /></TouchableOpacity>
          </View>
        </View>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Tu Guía Personal de IA</Text>
          <Text style={styles.heroSubtitle}>Explora los secretos del Perú con asistencia inteligente por voz en tiempo real.</Text>
        </View>

        {/* ── Mensajes ── */}
        <ScrollView ref={scrollRef} style={styles.chat} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
          {messages.map(msg => (
            <View key={msg.id} style={[styles.bubbleRow, msg.sender === 'user' && styles.bubbleRowUser]}>
              {msg.sender === 'ai' && (
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={16} color={C.white} />
                </View>
              )}
              
              <View style={{ flexShrink: 1 }}>
                <View style={[styles.bubble, msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
                  {msg.image && (
                      <Image source={{ uri: msg.image }} style={styles.aiImageResponse} />
                  )}
                  <Text style={[styles.bubbleText, msg.sender === 'ai' && styles.bubbleTextAI]}>{msg.text}</Text>
                </View>
              </View>

              {msg.sender === 'user' && (
                <View style={styles.userAvatar}>
                  <Ionicons name="person-outline" size={16} color={C.greenDark} />
                </View>
              )}
            </View>
          ))}
          {isTyping && (
            <View style={styles.bubbleRow}>
              <View style={styles.aiAvatar}><Ionicons name="sparkles" size={16} color={C.white} /></View>
              <View style={[styles.bubble, styles.bubbleAI]}><Text style={styles.bubbleTextAI}>Escuchando a los Apus...</Text></View>
            </View>
          )}

          {/* Recomendaciones */}
          {messages.length > 2 && !isTyping && (
            <View style={styles.recommendationsSection}>
                <Text style={styles.recLabel}>RECOMENDACIONES PARA TI</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recScroll}>
                    {RECOMMENDATIONS.map(rec => (
                        <View key={rec.id} style={styles.recCard}>
                            <View style={[styles.recIconWrap, { backgroundColor: rec.color }]}>
                                <Ionicons name={rec.icon as any} size={20} color={rec.iconColor} />
                            </View>
                            <View>
                                <Text style={styles.recTitle}>{rec.title}</Text>
                                <Text style={styles.recSub}>{rec.subtitle}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
          )}
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* ── Barra Inferior (Voz / Teclado) ── */}
        <View style={styles.inputContainer}>
            {showKeyboard ? (
              <View style={styles.textInputRow}>
                <TextInput 
                  style={styles.textInput} 
                  placeholder="Pregunta algo al guía..." 
                  placeholderTextColor={C.muted}
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={() => sendTextToBackend(inputText)}
                  autoFocus
                />
                <TouchableOpacity style={styles.sendBtn} onPress={() => sendTextToBackend(inputText)}>
                  <Ionicons name="send" size={20} color={C.white} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.toggleInputBtn} onPress={() => setShowKeyboard(false)}>
                  <Ionicons name="mic-outline" size={24} color={C.muted} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.voiceBar}>
                <View style={styles.waveContainer}>
                  {WAVE_DELAYS.map((d, i) => <WaveBar key={i} delay={d} color={isRecording ? '#D64545' : C.greenDark} />)}
                </View>
                
                <Animated.View style={{ transform: [{ scale: micPulse }] }}>
                  <TouchableOpacity style={[styles.micBtn, isRecording && styles.micBtnActive]} onPress={toggleRecording}>
                    <Ionicons name={isRecording ? 'stop' : 'mic'} size={24} color={C.white} />
                  </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity style={styles.keyboardBtn} onPress={() => setShowKeyboard(true)}>
                  <Ionicons name="keypad-outline" size={24} color={C.greenDark} />
                </TouchableOpacity>
              </View>
            )}
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F5' },
  iconBtn: { padding: 4 },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  brandName: { color: '#00332D', fontSize: 18, fontWeight: '800' },
  topNavRight: { flexDirection: 'row', gap: 16 },
  
  hero: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20 },
  heroTitle: { color: '#00332D', fontSize: 32, fontWeight: '800', marginBottom: 8 },
  heroSubtitle: { color: '#6B7280', fontSize: 15, lineHeight: 22 },
  
  chat: { flex: 1 },
  chatContent: { paddingHorizontal: 20, paddingBottom: 20, gap: 24 },
  
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, maxWidth: width * 0.9 },
  bubbleRowUser: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  aiAvatar: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#00332D', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  userAvatar: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FCD34D', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  
  bubble: { borderRadius: 20, padding: 16, maxWidth: width * 0.75, flexShrink: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  bubbleAI: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 4 },
  bubbleUser: { backgroundColor: '#00332D', borderTopRightRadius: 4 },
  bubbleText: { color: '#FFFFFF', fontSize: 15, lineHeight: 24 },
  bubbleTextAI: { color: '#111827' },
  aiImageResponse: { width: '100%', height: 180, borderRadius: 12, marginBottom: 12 },

  recommendationsSection: { marginTop: 10 },
  recLabel: { fontSize: 11, fontWeight: '800', color: '#C9A84C', letterSpacing: 1.5, marginBottom: 12 },
  recScroll: { gap: 12, paddingRight: 20 },
  recCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 16, gap: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  recIconWrap: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  recTitle: { fontSize: 14, fontWeight: '700', color: '#00332D' },
  recSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  inputContainer: { paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 10 : 20, paddingTop: 10, backgroundColor: 'transparent' },
  
  voiceBar: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#FFFFFF', borderRadius: 40, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  waveContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 40, gap: 4, paddingLeft: 20 },
  waveBar: { flex: 1, height: 24, borderRadius: 2, maxWidth: 4 },
  micBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#00332D', justifyContent: 'center', alignItems: 'center' },
  micBtnActive: { backgroundColor: '#D64545' },
  keyboardBtn: { width: 56, height: 56, justifyContent: 'center', alignItems: 'center' },

  textInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 30, paddingLeft: 20, paddingRight: 6, paddingVertical: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  textInput: { flex: 1, height: 48, fontSize: 15, color: '#111827' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#00332D', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  toggleInputBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
});