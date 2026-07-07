import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Image, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';

const C = { green: colors.green, gold: colors.gold, goldL: colors.goldLight, white: colors.white, cream: colors.beige, muted: colors.muted, border: colors.border, dark: colors.greenDark };

type Lang = 'Español' | 'English' | 'Quechua';

const CONTENT: Record<Lang, { region: string; title: string; description: string; history1: string; history2: string; curator: string; sectionHistory: string; sectionCurator: string; btnListen: string; btnTranslate: string; }> = {
  Español: {
    region: 'REGIONAL: HIGHLANDS',
    title: 'Intihuatana · Reloj Solar Sagrado',
    description: 'Obra maestra de la arquitectura inca, diseñada para medir el tiempo y alinearse con eventos astronómicos clave.',
    history1: 'El Intihuatana, cuyo nombre en quechua significa "donde se amarra al sol", es una de las estructuras más enigmáticas y sagradas de Machu Picchu. Tallado directamente en el afloramiento rocoso de la montaña, funcionaba como un sofisticado observatorio astronómico y calendario ritual.',
    history2: 'Durante los solsticios, los sacerdotes incas realizaban ceremonias para "atar" simbólicamente al sol a la roca, asegurando su retorno y la continuidad de los ciclos agrícolas. Su alineación precisa con los puntos cardinales y las montañas sagradas (Apus) circundantes revela la avanzada comprensión astronómica de la civilización incaica.',
    curator: '"El Intihuatana no es solo piedra; es un diálogo eterno entre la tierra y el cosmos."',
    sectionHistory: 'Historia Cultural',
    sectionCurator: 'COMENTARIO DEL CURADOR',
    btnListen: 'Escuchar Guía',
    btnTranslate: 'Traducir',
  },
  English: {
    region: 'REGIONAL: HIGHLANDS',
    title: 'Intihuatana · Sacred Solar Clock',
    description: 'Masterpiece of Inca architecture, designed to measure time and align with key astronomical events.',
    history1: 'The Intihuatana, whose name in Quechua means "where the sun is tied", is one of the most enigmatic and sacred structures of Machu Picchu. Carved directly into the rocky outcrop of the mountain, it functioned as a sophisticated astronomical observatory and ritual calendar.',
    history2: 'During the solstices, Inca priests performed ceremonies to symbolically "tie" the sun to the rock, ensuring its return and the continuity of agricultural cycles. Its precise alignment with the cardinal points and surrounding sacred mountains (Apus) reveals the advanced astronomical understanding of the Inca civilization.',
    curator: '"The Intihuatana is not just a stone; it is an eternal dialogue between the earth and the cosmos."',
    sectionHistory: 'Cultural History',
    sectionCurator: "CURATOR'S NOTE",
    btnListen: 'Listen to Guide',
    btnTranslate: 'Translate',
  },
  Quechua: {
    region: 'REGIONAL: HIGHLANDS',
    title: 'Intihuatana · Inti Qhawaq Rumi',
    description: 'Inkakunap sumaq rurasqan, pacha yachayninku rikuchinan, intipas chiqap tiyananta.',
    history1: 'Intihuatana, sutiynin quechuapi nin "maypin intita watanku", Machu Picchupi ancha ch\'ullaq, ancha yupaychana rumi. Kay rumi urqup patanpi llank\'asqa, pacha yachana, inti qhawana wasiña karqan.',
    history2: 'Inti kutimunampaq, inti ch\'isipi chayamunampaq, intip rinantataq sut\'inta riqsinku karqan inkakunaqa. Tawantinsuyu tukuy suyukunaman chiqap chayasqanmanta, inkakunap yachayninku ancha hatun kasqanta rikuchikun.',
    curator: '"Intihuatana manas rumillas; pachamamawan, hanaq pachawanpis wiñay rimayña."',
    sectionHistory: 'Kawsay Yachay',
    sectionCurator: 'YACHAQPA RIMAYnin',
    btnListen: 'Uyariy',
    btnTranslate: 'Tikray',
  },
};

const LANGUAGES: Lang[] = ['Español', 'English', 'Quechua'];

export default function ResultadoScreen() {
  const navigation = useNavigation<any>();
  const [language, setLanguage] = useState<Lang>('Español');
  const [translating, setTranslating] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const content = CONTENT[language];

  const handleSelectLang = (lang: Lang) => {
    setShowLangModal(false);
    if (lang === language) return;
    setTranslating(true);
    setTimeout(() => {
      setLanguage(lang);
      setTranslating(false);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2000' }} style={styles.backgroundImage}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ARView')}>
            <Ionicons name="arrow-back" size={24} color={C.green} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>InkaVoice</Text>
          <Ionicons name="settings-outline" size={24} color={C.white} />
        </View>
        <View style={styles.recognitionBadge}>
          <Text style={styles.recognitionText}>● RECONOCIMIENTO 98%</Text>
        </View>
      </ImageBackground>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.badgeLabel}><Text style={styles.badgeText}>{content.region}</Text></View>
          <Text style={styles.title}>{content.title}</Text>

          {language !== 'Español' && (
            <View style={styles.activeLangBadge}>
              <Ionicons name="language-outline" size={13} color={C.green} />
              <Text style={styles.activeLangText}>Traducido · {language}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Audioguia', { nombre: content.title, region: content.region })}>
            <Ionicons name="volume-medium" size={20} color={C.white} />
            <Text style={styles.primaryButtonText}>{content.btnListen}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowLangModal(true)}>
            <Ionicons name="language-outline" size={20} color={C.green} />
            <Text style={styles.secondaryButtonText}>{content.btnTranslate}</Text>
            <View style={styles.langIndicator}><Text style={styles.langIndicatorText}>{language.toUpperCase()}</Text></View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {translating ? (
            <View style={styles.translatingBox}>
              <ActivityIndicator color={C.gold} size="large" />
              <Text style={styles.translatingText}>Traduciendo al {language}...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>{content.sectionHistory}</Text>
              <Text style={styles.bodyText}>{content.history1}</Text>
              <Text style={styles.bodyText}>{content.history2}</Text>
              <View style={styles.divider} />
              <View style={styles.curatorCard}>
                <View style={styles.curatorHeader}>
                  <Image source={{ uri: 'https://randomuser.me/api/portraits/men/45.jpg' }} style={styles.curatorAvatar} />
                  <Text style={styles.curatorLabel}>{content.sectionCurator}</Text>
                </View>
                <Text style={styles.curatorText}>{content.curator}</Text>
              </View>
            </>
          )}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.micButton} onPress={() => navigation.navigate('Asistente')}>
        <Ionicons name="mic" size={28} color={C.white} />
      </TouchableOpacity>

      <Modal visible={showLangModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowLangModal(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Selecciona el idioma</Text>
            <Text style={styles.modalSub}>El contenido se traducirá automáticamente</Text>
            {LANGUAGES.map(lang => (
              <TouchableOpacity key={lang} style={[styles.langOption, language === lang && styles.langOptionActive]} onPress={() => handleSelectLang(lang)}>
                <View style={styles.langOptionLeft}>
                  <Text style={styles.langFlag}>{lang === 'Español' ? '🇵🇪' : lang === 'English' ? '🇬🇧' : '🏔️'}</Text>
                  <View>
                    <Text style={[styles.langName, language === lang && styles.langNameActive]}>{lang}</Text>
                    <Text style={styles.langNative}>{lang === 'Español' ? 'Español' : lang === 'English' ? 'English' : 'Runasimi'}</Text>
                  </View>
                </View>
                {language === lang && <Ionicons name="checkmark-circle" size={22} color={C.green} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowLangModal(false)}>
              <Text style={styles.modalCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.white },
  backgroundImage: { height: 280, padding: 20, paddingTop: 50, justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: C.white, fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  backButton: { backgroundColor: C.white, padding: 8, borderRadius: 50, elevation: 5 },
  recognitionBadge: { backgroundColor: 'rgba(255,255,255,0.25)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  recognitionText: { color: C.white, fontWeight: 'bold', fontSize: 13 },
  scroll: { flex: 1, marginTop: -24 },
  card: { backgroundColor: C.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, elevation: 10 },
  badgeLabel: { backgroundColor: C.goldL, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 12 },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#333', letterSpacing: 0.5 },
  title: { fontSize: 22, fontWeight: '800', color: C.green, marginBottom: 10, lineHeight: 28 },
  activeLangBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#E8F5E9', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 12 },
  activeLangText: { color: C.green, fontSize: 11, fontWeight: '700' },
  primaryButton: { backgroundColor: C.green, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, borderRadius: 10, marginBottom: 10 },
  primaryButtonText: { color: C.white, fontWeight: '700', marginLeft: 8, fontSize: 15 },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 10, borderWidth: 1.5, borderColor: C.green, marginBottom: 4, gap: 8 },
  secondaryButtonText: { color: C.green, fontWeight: '700', fontSize: 15, flex: 1, textAlign: 'center' },
  langIndicator: { backgroundColor: C.green, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  langIndicatorText: { color: C.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: C.green, marginBottom: 12 },
  bodyText: { fontSize: 14, color: C.muted, lineHeight: 22, marginBottom: 14 },
  translatingBox: { alignItems: 'center', paddingVertical: 40, gap: 16 },
  translatingText: { color: C.muted, fontSize: 15, fontStyle: 'italic' },
  curatorCard: { backgroundColor: C.cream, borderRadius: 14, padding: 16, gap: 12 },
  curatorHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  curatorAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ccc' },
  curatorLabel: { color: C.gold, fontSize: 12, fontWeight: '800', letterSpacing: 0.8 },
  curatorText: { color: '#333', fontSize: 14, fontStyle: 'italic', lineHeight: 22 },
  micButton: { position: 'absolute', bottom: 28, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: C.goldL, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: C.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#DDD', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: C.green, marginBottom: 4 },
  modalSub: { fontSize: 13, color: C.muted, marginBottom: 24 },
  langOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, marginBottom: 10 },
  langOptionActive: { borderColor: C.green, backgroundColor: '#F0FAF4' },
  langOptionLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  langFlag: { fontSize: 28 },
  langName: { fontSize: 16, fontWeight: '700', color: '#333' },
  langNameActive: { color: C.green },
  langNative: { fontSize: 12, color: C.muted },
  modalClose: { marginTop: 8, padding: 14, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, alignItems: 'center' },
  modalCloseText: { color: C.muted, fontWeight: '600', fontSize: 15 },
});
