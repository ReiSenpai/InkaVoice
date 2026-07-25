import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Language = 'es' | 'en' | 'qu';

const COUNTRIES = [
  'Perú', 'México', 'España', 'Argentina', 'Colombia',
  'Chile', 'Estados Unidos', 'Ecuador', 'Bolivia',
];

const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'English' },
  { id: 'qu', label: 'Quechua' },
];

const INTERESTS = [
  { id: 'arqueologia', label: 'Arqueología', icon: 'business-outline' },
  { id: 'gastronomia', label: 'Gastronomía', icon: 'restaurant-outline' },
  { id: 'naturaleza', label: 'Naturaleza', icon: 'leaf-outline' },
  { id: 'artesania', label: 'Artesanía', icon: 'color-palette-outline' },
  { id: 'aventura', label: 'Aventura', icon: 'walk-outline' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState<Language>('es');
  const [interests, setInterests] = useState<string[]>(['arqueologia']);
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  const C = {
    greenDark: '#00332D',
    green: '#1E8A5F',
    gold: '#C9A84C',
    white: '#F9F8F6', // Ligeramente crema
    border: '#D1D5DB',
    text: '#111827',
    muted: '#6B7280',
  };

  const Container = Platform.OS === 'web' ? View : SafeAreaView;

  const toggleInterest = (id: string) => {
    setInterests((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const handleCreateAccount = async () => {
    if (!fullName || !email || !password) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.36:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), nombre: fullName, password: password }),
      });

      const data = await response.json();

      if (response.ok && data.appToken) {
        console.log('Cuenta creada. Token:', data.appToken);
        router.replace('/(tabs)');
      } else {
        alert(data.message || 'No se pudo crear la cuenta. Intenta con otro correo.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800' }}
      style={{ flex: 1 }}
      imageStyle={{ opacity: 0.3 }}
    >
      <Container style={styles.safe} {...(Platform.OS !== 'web' ? { edges: ['top', 'bottom'] as const } : {})}>
        <View style={styles.topBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="options" size={24} color={C.greenDark} style={{ transform: [{ rotate: '90deg' }] }} />
            <Text style={styles.brandName}>InkaVoice</Text>
          </View>
          <Pressable onPress={() => router.push('/login')} hitSlop={10}>
            <Text style={styles.loginAction}>Iniciar Sesión</Text>
          </Pressable>
        </View>

        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <Text style={styles.title}>Comienza tu viaje</Text>
              <Text style={styles.subtitle}>Únete a la plataforma de voz que da vida a la historia del Perú.</Text>

              <Text style={styles.label}>NOMBRE COMPLETO</Text>
              <TextInput value={fullName} onChangeText={setFullName} placeholder="Ej. Juan Pérez" placeholderTextColor={C.muted} style={styles.underlineInput} />

              <Text style={[styles.label, styles.fieldGap]}>CORREO ELECTRÓNICO</Text>
              <TextInput value={email} onChangeText={setEmail} placeholder="nombre@ejemplo.com" placeholderTextColor={C.muted} keyboardType="email-address" autoCapitalize="none" style={styles.underlineInput} />

              <Text style={[styles.label, styles.fieldGap]}>CONTRASEÑA</Text>
              <View style={styles.passwordRow}>
                <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor={C.muted} secureTextEntry={!showPassword} style={[styles.underlineInput, styles.passwordInput]} />
                <Pressable onPress={() => setShowPassword((prev) => !prev)} hitSlop={8} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={C.muted} />
                </Pressable>
              </View>

              <Text style={[styles.label, styles.fieldGap]}>PAÍS DE ORIGEN</Text>
              <Pressable style={styles.selectField} onPress={() => setCountryModalVisible(true)}>
                <Text style={country ? styles.selectValue : styles.selectPlaceholder}>{country || 'Selecciona tu país'}</Text>
                <Ionicons name="chevron-down" size={16} color={C.muted} />
              </Pressable>

              <Text style={[styles.label, styles.fieldGap]}>IDIOMA PREFERIDO</Text>
              <View style={styles.languageRow}>
                {LANGUAGES.map((item) => {
                  const selected = language === item.id;
                  return (
                    <Pressable key={item.id} style={styles.languageOption} onPress={() => setLanguage(item.id)}>
                      <View style={[styles.radio, selected && styles.radioActive]}>
                        {selected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={styles.languageText}>{item.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={[styles.label, styles.fieldGap]}>INTERESES TURÍSTICOS</Text>
              <View style={styles.chipsRow}>
                {INTERESTS.map((item) => {
                  const selected = interests.includes(item.id);
                  return (
                    <Pressable key={item.id} style={[styles.chip, selected && styles.chipActive]} onPress={() => toggleInterest(item.id)}>
                      <Ionicons name={item.icon as any} size={14} color={selected ? C.white : C.text} />
                      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{item.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]} onPress={handleCreateAccount}>
                <Text style={styles.primaryBtnText}>CREAR CUENTA</Text>
                <Ionicons name="arrow-forward" size={18} color={C.white} />
              </Pressable>

              <Text style={styles.loginText}>
                ¿Ya tienes una cuenta? <Text style={styles.loginLink} onPress={() => router.push('/login')}>Inicia sesión aquí</Text>
              </Text>
            </View>

            <View style={styles.footerDivider}>
              <View style={styles.dividerLine} />
              <Ionicons name="diamond" size={8} color={C.muted} />
              <View style={styles.dividerLine} />
            </View>
            <Text style={styles.footer}>© 2024 InkaVoice • Un viaje a través de la herencia cultural del Perú</Text>
          </ScrollView>
        </KeyboardAvoidingView>

        <Modal visible={countryModalVisible} transparent animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setCountryModalVisible(false)}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Selecciona tu país</Text>
              <ScrollView style={{ maxHeight: 300 }}>
                {COUNTRIES.map((item) => (
                  <Pressable key={item} style={styles.modalOption} onPress={() => { setCountry(item); setCountryModalVisible(false); }}>
                    <Text style={styles.modalOptionText}>{item}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      </Container>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 10 },
  brandName: { fontSize: 18, fontWeight: '800', color: '#00332D' },
  loginAction: { fontSize: 13, fontWeight: '700', color: '#00332D' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 32 },
  card: { backgroundColor: 'rgba(250, 248, 245, 0.95)', borderRadius: 20, paddingHorizontal: 24, paddingVertical: 32, marginTop: 10 },
  title: { fontSize: 26, fontWeight: '800', color: '#00332D', marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 22, color: '#4B5563', marginBottom: 28 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: '#6B7280', marginBottom: 4 },
  fieldGap: { marginTop: 24 },
  underlineInput: { borderBottomWidth: 1, borderBottomColor: '#D1D5DB', paddingVertical: 8, fontSize: 16, color: '#111827' },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1 },
  eyeIcon: { position: 'absolute', right: 0, bottom: 10 },
  selectField: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#D1D5DB', paddingVertical: 10 },
  selectPlaceholder: { fontSize: 16, color: '#9CA3AF' },
  selectValue: { fontSize: 16, color: '#111827' },
  languageRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  languageOption: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#6B7280', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#00332D' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00332D' },
  languageText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: 'transparent' },
  chipActive: { backgroundColor: '#00332D', borderColor: '#00332D' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  chipTextActive: { color: '#FFFFFF' },
  primaryBtn: { marginTop: 32, height: 52, borderRadius: 8, backgroundColor: '#00332D', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  loginText: { marginTop: 24, textAlign: 'center', fontSize: 13, color: '#4B5563' },
  loginLink: { fontWeight: '700', color: '#C9A84C' },
  footerDivider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 32, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#D1D5DB' },
  footer: { textAlign: 'center', fontSize: 10, lineHeight: 16, color: '#4B5563', paddingHorizontal: 12 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#00332D', marginBottom: 12 },
  modalOption: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalOptionText: { fontSize: 16, color: '#111827' },
});