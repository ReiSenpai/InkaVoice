import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudioGuide } from '../../context/AudioGuideContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

type Lang = 'Español' | 'English' | 'Quechua';

// Contenido simulado basado en el diseño
const CONTENT: Record<Lang, any> = {
  Español: {
    region: 'REGIONAL: HIGHLANDS',
    title: 'Intihuatana - Reloj\nSolar Sagrado',
    history1: 'El Intihuatana, cuyo nombre en quechua significa "donde se amarra al sol", es una de las estructuras más enigmáticas y sagradas de Machu Picchu. Tallado directamente en el afloramiento rocoso de la montaña, funcionaba como un sofisticado observatorio astronómico y calendario ritual.',
    history2: 'Durante los solsticios, los sacerdotes incas realizaban ceremonias para "atar" simbólicamente al sol a la roca, asegurando su retorno y la continuidad de los ciclos agrícolas. Su alineación precisa con los puntos cardinales y las montañas sagradas (Apus) circundantes revela la avanzada comprensión astronómica de la civilización incaica.',
    curator: '"El Intihuatana no es solo piedra; es un diálogo eterno entre la tierra y el cosmos."',
    sectionHistory: 'Historia Cultural',
    sectionCurator: 'COMENTARIO DEL\nCURADOR',
    btnListen: 'Escuchar Guía',
    btn3D: 'Ver Reconstrucción 3D',
    btnTranslate: 'Traducir',
  },
  English: {
    region: 'REGIONAL: HIGHLANDS',
    title: 'Intihuatana - Sacred\nSolar Clock',
    history1: 'The Intihuatana, whose name in Quechua means "where the sun is tied", is one of the most enigmatic and sacred structures of Machu Picchu...',
    history2: 'During the solstices, Inca priests performed ceremonies to symbolically "tie" the sun to the rock...',
    curator: '"The Intihuatana is not just a stone; it is an eternal dialogue between the earth and the cosmos."',
    sectionHistory: 'Cultural History',
    sectionCurator: "CURATOR'S\nNOTE",
    btnListen: 'Listen to Guide',
    btn3D: 'View 3D Reconstruction',
    btnTranslate: 'Translate',
  },
  Quechua: {
    region: 'REGIONAL: HIGHLANDS',
    title: 'Intihuatana - Inti\nQhawaq Rumi',
    history1: 'Intihuatana, sutiynin quechuapi nin "maypin intita watanku", Machu Picchupi ancha ch\'ullaq...',
    history2: 'Inti kutimunampaq, inti ch\'isipi chayamunampaq, intip rinantataq sut\'inta riqsinku...',
    curator: '"Intihuatana manas rumillas; pachamamawan, hanaq pachawanpis wiñay rimayña."',
    sectionHistory: 'Kawsay Yachay',
    sectionCurator: 'YACHAQPA\nRIMAYNIN',
    btnListen: 'Uyariy',
    btn3D: '3D Rikuy',
    btnTranslate: 'Tikray',
  },
};

const LANGUAGES: Lang[] = ['Español', 'English', 'Quechua'];
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2000';

export default function ResultadoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ photoUri?: string; aiDescription?: string }>();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { colors } = useTheme();

  const [language, setLanguage] = useState<Lang>('Español');
  const [translating, setTranslating] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const content = CONTENT[language];
  const photoUri = params.photoUri;
  const imageSource = photoUri ? { uri: photoUri } : { uri: FALLBACK_IMAGE };
  // Si la IA mandó texto dinámico, lo podríamos usar aquí, pero para el diseño usaremos el estático
  const aiText = params.aiDescription; 

  const handleSelectLang = (lang: Lang) => {
    setShowLangModal(false);
    if (lang === language) return;
    setTranslating(true);
    setTimeout(() => {
      setLanguage(lang);
      setTranslating(false);
    }, 800);
  };

  const C = {
    greenDark: '#00332D',
    green: '#1E8A5F',
    gold: '#C9A84C',
    goldLight: '#FCD34D',
    white: '#FFFFFF',
    cream: '#F9F8F6',
    muted: '#6B7280',
    border: '#E5E7EB'
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? insets.top : 0 }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Encabezado e Imagen Principal */}
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.mainImage} />
          
          <View style={[styles.headerOverlay, { top: insets.top + 10 }]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={C.greenDark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>InkaVoice</Text>
            <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
              <Ionicons name="settings-outline" size={24} color={C.greenDark} />
            </TouchableOpacity>
          </View>

          <View style={[styles.recognitionBadge, { top: insets.top + 70 }]}>
            <View style={styles.recogDot} />
            <Text style={styles.recognitionText}>RECONOCIMIENTO 98%</Text>
          </View>
        </View>

        {/* Tarjeta de Contenido superpuesta */}
        <View style={styles.contentCard}>
          <View style={styles.badgeRow}>
            <View style={styles.regionBadge}>
              <Text style={styles.regionText}>{content.region}</Text>
            </View>
            <Ionicons name="shield-checkmark-outline" size={16} color={C.muted} />
          </View>

          <Text style={styles.title}>{content.title}</Text>

          {/* Botones de Acción Apilados */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.primaryBtn} 
              onPress={() => router.push({ pathname: '/audioguia', params: { nombre: content.title.replace('\n', ' '), photoUri } })}
            >
              <Ionicons name="volume-medium" size={20} color={C.white} />
              <Text style={styles.primaryBtnText}>{content.btnListen}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn}>
              <Ionicons name="cube-outline" size={20} color={C.greenDark} />
              <Text style={styles.secondaryBtnText}>{content.btn3D}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setShowLangModal(true)}>
              <Ionicons name="language-outline" size={20} color={C.greenDark} />
              <Text style={styles.secondaryBtnText}>{content.btnTranslate}</Text>
            </TouchableOpacity>
          </View>

          {/* Área de Texto Traducible */}
          {translating ? (
            <View style={styles.translatingBox}>
              <ActivityIndicator color={C.gold} size="large" />
              <Text style={styles.translatingText}>Traduciendo al {language}...</Text>
            </View>
          ) : (
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>{content.sectionHistory}</Text>
              <View style={styles.divider} />
              
              <Text style={styles.bodyText}>{aiText || content.history1}</Text>
              <Text style={styles.bodyText}>{content.history2}</Text>

              <View style={styles.curatorCard}>
                <Image source={{ uri: 'https://randomuser.me/api/portraits/men/45.jpg' }} style={styles.curatorAvatar} />
                <View style={styles.curatorTextWrap}>
                  <Text style={styles.curatorLabel}>{content.sectionCurator}</Text>
                  <Text style={styles.curatorQuote}>{content.curator}</Text>
                </View>
              </View>
            </View>
          )}
          
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      {/* Modal de Idioma */}
      <Modal visible={showLangModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowLangModal(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Selecciona el idioma</Text>
            {LANGUAGES.map(lang => (
              <TouchableOpacity key={lang} style={styles.langOption} onPress={() => handleSelectLang(lang)}>
                <Text style={[styles.langName, language === lang && { color: C.greenDark, fontWeight: '700' }]}>{lang}</Text>
                {language === lang && <Ionicons name="checkmark" size={22} color={C.greenDark} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  imageContainer: { width: '100%', height: 400, position: 'relative' },
  mainImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  headerOverlay: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#00332D' },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  recognitionBadge: { position: 'absolute', left: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 51, 45, 0.7)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  recogDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C9A84C', marginRight: 8 },
  recognitionText: { color: '#FFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  
  contentCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -40, padding: 24, minHeight: 500 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  regionBadge: { backgroundColor: '#FCD34D', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  regionText: { fontSize: 10, fontWeight: '800', color: '#00332D', letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: '800', color: '#00332D', lineHeight: 38, marginBottom: 24 },
  
  actionButtons: { gap: 12, marginBottom: 32 },
  primaryBtn: { backgroundColor: '#00332D', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 54, borderRadius: 12, gap: 10 },
  primaryBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  secondaryBtn: { backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 54, borderRadius: 12, borderWidth: 1.5, borderColor: '#E5E7EB', gap: 10 },
  secondaryBtnText: { color: '#00332D', fontWeight: '700', fontSize: 15 },
  
  historySection: { marginTop: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#4B5563' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 16 },
  bodyText: { fontSize: 15, color: '#4B5563', lineHeight: 24, marginBottom: 16 },
  
  curatorCard: { backgroundColor: '#F9F8F6', borderRadius: 16, padding: 16, flexDirection: 'row', gap: 16, marginTop: 10, alignItems: 'center' },
  curatorAvatar: { width: 60, height: 60, borderRadius: 12 },
  curatorTextWrap: { flex: 1 },
  curatorLabel: { color: '#C9A84C', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  curatorQuote: { color: '#374151', fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
  
  translatingBox: { alignItems: 'center', paddingVertical: 40, gap: 16 },
  translatingText: { color: '#6B7280', fontSize: 15, fontStyle: 'italic' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalSheet: { backgroundColor: '#FFF', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#00332D', marginBottom: 16 },
  langOption: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  langName: { fontSize: 16, color: '#374151' }
});