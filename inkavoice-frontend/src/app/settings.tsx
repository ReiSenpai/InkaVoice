import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useLanguage();
  const { isDark, toggleDarkMode, colors } = useTheme();
  
  const [langModalVisible, setLangModalVisible] = useState(false);

  const handleLogout = () => {
    // Aquí se limpia la sesión en el futuro con el backend
    router.replace('/'); 
  };

  const C = {
    bg: '#FAF8F5',
    white: '#FFFFFF',
    textDark: '#00332D',
    muted: '#6B7280',
    border: '#F3F4F6',
    gold: '#85601E',
    red: '#D64545',
    redBg: '#FDE8E8',
    green: '#1E8A5F',
    greenBg: '#D1FAE5',
    yellow: '#B45309',
    yellowBg: '#FEF3C7',
    gray: '#4B5563',
    grayBg: '#E5E7EB'
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color={C.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajustes</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.eyebrow}>CONFIGURACIÓN AVANZADA</Text>
        <Text style={styles.intro}>
          Personaliza tu experiencia de InkaVoice para explorar el legado del Perú a tu ritmo.
        </Text>

        {/* TARJETA DE AJUSTES */}
        <View style={styles.card}>
          
          {/* SOS - NAVEGA A LA PANTALLA DE EMERGENCIA */}
          <TouchableOpacity style={[styles.row, styles.rowBorder]} onPress={() => router.push('/emergencia')}>
            <View style={[styles.iconWrap, { backgroundColor: C.redBg }]}>
              <Text style={{ color: C.red, fontWeight: '800', fontSize: 12 }}>SOS</Text>
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={[styles.rowTitle, { color: C.red }]}>Emergencia SOS</Text>
              <Text style={[styles.rowSubtitle, { color: C.red }]}>Asistencia inmediata y contactos de emergencia</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={C.muted} />
          </TouchableOpacity>

          {/* IDIOMA */}
          <TouchableOpacity style={[styles.row, styles.rowBorder]} onPress={() => setLangModalVisible(true)}>
            <View style={[styles.iconWrap, { backgroundColor: C.greenBg }]}>
              <Ionicons name="language" size={22} color={C.green} />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>Idioma y Voz</Text>
              <Text style={styles.rowSubtitle}>
                {language === 'es' ? 'Español' : language === 'en' ? 'Inglés' : 'Quechua'}, Narración: Quechua-Accented
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={C.muted} />
          </TouchableOpacity>

          {/* ACCESIBILIDAD */}
          <TouchableOpacity style={[styles.row, styles.rowBorder]}>
            <View style={[styles.iconWrap, { backgroundColor: C.yellowBg }]}>
              <Ionicons name="accessibility" size={22} color={C.yellow} />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>Accesibilidad</Text>
              <Text style={styles.rowSubtitle}>Tamaño de texto, Alto contraste</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={C.muted} />
          </TouchableOpacity>

          {/* MODO OSCURO */}
          <View style={[styles.row, styles.rowBorder]}>
            <View style={[styles.iconWrap, { backgroundColor: C.grayBg }]}>
              <Ionicons name="moon-outline" size={22} color={C.gray} />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>Modo Oscuro</Text>
              <Text style={styles.rowSubtitle}>Optimizar para ambientes nocturnos</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#D1D5DB', true: '#00332D' }}
              thumbColor={Platform.OS === 'ios' ? '#FFF' : '#FFF'}
            />
          </View>

          {/* DESCARGAS */}
          <TouchableOpacity style={[styles.row, styles.rowBorder]} onPress={() => router.push('/descargas')}>
            <View style={[styles.iconWrap, { backgroundColor: C.grayBg }]}>
              <Ionicons name="download-outline" size={22} color={C.gray} />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={styles.rowTitle}>Gestión de Descargas</Text>
              <Text style={styles.rowSubtitle}>1.2 GB utilizados • Solo por Wi-Fi</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={C.muted} />
          </TouchableOpacity>

          {/* CERRAR SESIÓN */}
          <TouchableOpacity style={styles.row} onPress={handleLogout}>
            <View style={[styles.iconWrap, { backgroundColor: C.redBg }]}>
              <Ionicons name="log-out-outline" size={22} color={C.red} />
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={[styles.rowTitle, { color: C.red }]}>Cerrar Sesión</Text>
              <Text style={[styles.rowSubtitle, { color: C.red }]}>Conectado como Visitante Cusco</Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.stoneImagePlaceholder}>
            <Ionicons name="apps" size={40} color="#D1D5DB" />
          </View>
          <Text style={styles.footerVersion}>INKAVOICE V2.4.0</Text>
          <Text style={styles.footerTagline}>Hecho con respeto por el legado Peruano</Text>
        </View>

      </ScrollView>

      {/* MODAL DE IDIOMA */}
      <Modal visible={langModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setLangModalVisible(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Selecciona el Idioma</Text>
            {(['es', 'en', 'qu'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.langOption, language === lang && styles.langOptionActive]}
                onPress={() => { setLanguage(lang); setLangModalVisible(false); }}
              >
                <Text style={[styles.langOptionText, language === lang && { color: '#00332D', fontWeight: '800' }]}>
                  {lang === 'es' ? 'ESPAÑOL' : lang === 'en' ? 'ENGLISH' : 'QUECHUA'}
                </Text>
                {language === lang && <Ionicons name="checkmark-circle" size={24} color="#00332D" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 24 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#00332D' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  eyebrow: { fontSize: 12, fontWeight: '800', color: '#85601E', letterSpacing: 1.5, textAlign: 'center', marginBottom: 12 },
  intro: { fontSize: 15, color: '#4B5563', textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 10 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowTextWrap: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 4 },
  rowSubtitle: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  footer: { alignItems: 'center', marginTop: 40 },
  stoneImagePlaceholder: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  footerVersion: { fontSize: 12, fontWeight: '800', color: '#6B7280', letterSpacing: 2, marginBottom: 6 },
  footerTagline: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#00332D', marginBottom: 20, textAlign: 'center' },
  langOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  langOptionActive: { backgroundColor: '#F9F8F6', borderRadius: 12, paddingHorizontal: 12, borderBottomWidth: 0 },
  langOptionText: { fontSize: 16, color: '#4B5563', fontWeight: '600' },
});