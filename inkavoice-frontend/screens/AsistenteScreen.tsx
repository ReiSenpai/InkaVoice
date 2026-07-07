import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';

const { width } = Dimensions.get('window');

const C = {
  bg: '#F2F1EE', white: '#FFFFFF', dark: '#0D1A0E', greenD: '#1A3A1E', greenM: '#244D28', greenL: '#2E5C33',
  gold: '#C9A84C', user: '#1E4D24', textDark: '#1A1A1A', textMid: '#444444', muted: '#999999', border: '#E0DED8', voiceBg: '#F7F6F3',
};

type Message = { id: number; text: string; sender: 'ai' | 'user' };

const INITIAL: Message[] = [
  { id: 1, sender: 'ai', text: '¡Hola! Soy tu guía InkaVoice.\nHoy estamos cerca de Sacsayhuamán. ¿Te gustaría conocer la historia de las piedras talladas o prefieres que te guíe a un mirador cercano?' },
];

const SUGGESTIONS = ['¿Cómo llego desde aquí?', 'Dónde comer cerca', 'Historia de los Incas', 'Ruta Inca Trail'];

const AI_REPLIES: Record<string, string> = {
  '¿Cómo llego desde aquí?': 'Desde tu ubicación actual puedes caminar unos 15 minutos hacia el acceso principal de Sacsayhuamán. 🗺️',
  'Dónde comer cerca': 'Cerca encontrarás restaurantes con comida andina tradicional y cafés locales. 🍽️',
  'Historia de los Incas': 'El Imperio Inca fue una civilización andina que alcanzó gran expansión entre 1438 y 1533. 📚',
  'Ruta Inca Trail': 'La Ruta Inca conecta varios sitios arqueológicos y termina en Machu Picchu. 🏔️',
  '¿Qué puedo visitar cerca de Sacsayhuamán?': 'Puedes visitar Qenqo, Puka Pukara y Tambomachay. ✨',
};

function WaveBar({ delay, color }: { delay: number; color: string }) {
  const anim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
    ])).start();
  }, []);
  return <Animated.View style={[styles.waveBar, { backgroundColor: color, transform: [{ scaleY: anim }] }]} />;
}

export default function AsistenteScreen() {
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const micPulse = useRef(new Animated.Value(1)).current;
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    setIsTyping(true);
    scrollToBottom();
    setTimeout(() => {
      const reply = AI_REPLIES[text] ?? 'Todavía no tengo información específica sobre eso.';
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: reply }]);
      setIsTyping(false);
      scrollToBottom();
    }, 1000);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      micPulse.stopAnimation();
      micPulse.setValue(1);
      sendMessage('¿Qué puedo visitar cerca de Sacsayhuamán?');
    } else {
      setIsRecording(true);
      Animated.loop(Animated.sequence([
        Animated.timing(micPulse, { toValue: 1.15, duration: 500, useNativeDriver: true }),
        Animated.timing(micPulse, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])).start();
    }
  };

  const WAVE_DELAYS = [0, 60, 120, 180, 240, 300, 240, 180, 120, 60, 0, 60];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('Resultado')}>
          <Ionicons name="arrow-back" size={22} color={C.greenD} />
        </TouchableOpacity>
        <Text style={styles.brandName}>InkaVoice</Text>
        <View style={styles.topNavRight}>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="search-outline" size={22} color={C.dark} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="settings-outline" size={22} color={C.dark} /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.hero}><Text style={styles.heroTitle}>Tu Guía Personal de IA</Text></View>

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
        <View style={styles.waveContainer}>{WAVE_DELAYS.map((d, i) => <WaveBar key={i} delay={d} color={C.greenM} />)}</View>
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
