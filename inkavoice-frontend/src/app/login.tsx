import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
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
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext'; // <-- Importamos el contexto de usuario

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { setToken, setUserId, setName, setEmail: setUserEmail } = useUser(); // <-- Extraemos los setters

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const C = {
    greenDark: '#00332D',
    green: '#1E8A5F',
    gold: '#C9A84C',
    white: '#FFFFFF',
    border: '#E5E7EB',
    text: '#374151',
    muted: '#9CA3AF',
  };

  const goToMain = () => router.replace('/(tabs)');

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.36:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password }),
      });

      const data = await response.json();

      if (response.ok && data.appToken) {
        console.log('Login exitoso. Token:', data.appToken);
        
        // Guardamos los datos reales en el contexto global sin alterar el diseño
        setToken(data.appToken);
        if (data.id) setUserId(String(data.id));
        if (data.nombre) setName(data.nombre);
        setUserEmail(email.trim());

        router.replace('/(tabs)');
      } else {
        alert(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  const Container = Platform.OS === 'web' ? View : SafeAreaView;

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800' }}
      style={{ flex: 1 }}
      imageStyle={{ opacity: 0.15 }}
    >
      <Container style={styles.safe} {...(Platform.OS !== 'web' ? { edges: ['top', 'bottom'] as const } : {})}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            
            {/* Header de la Marca (Diseño Original Figma) */}
            <View style={styles.brandHeader}>
              <View style={styles.logoBox}>
                <Ionicons name="options" size={32} color={C.white} style={{ transform: [{ rotate: '90deg' }] }} />
                <View style={styles.logoDiamond} />
              </View>
              <Text style={styles.brandName}>InkaVoice</Text>
              <Text style={styles.tagline}>ECOS DE UNA CIVILIZACIÓN</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={20} color={C.muted} style={styles.inputIcon} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@ejemplo.com"
                  placeholderTextColor={C.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>

              <View style={styles.passwordRow}>
                <Text style={styles.label}>CONTRASEÑA</Text>
                <Pressable onPress={() => {}} hitSlop={8}>
                  <Text style={styles.forgotLink}>¿Olvidaste la clave?</Text>
                </Pressable>
              </View>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={20} color={C.muted} style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={C.muted}
                  secureTextEntry={!showPassword}
                  style={[styles.input, styles.inputWithToggle]}
                />
                <Pressable onPress={() => setShowPassword((prev) => !prev)} style={styles.eyeBtn} hitSlop={8}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={C.muted} />
                </Pressable>
              </View>

              <Pressable style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]} onPress={handleLogin}>
                <Text style={styles.primaryBtnText}>INICIAR SESIÓN</Text>
                <Ionicons name="arrow-forward" size={18} color={C.white} />
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>O CONTINUAR CON</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}>
                <Ionicons name="logo-google" size={18} color="#EA4335" />
                <Text style={styles.secondaryBtnText}>Google</Text>
              </Pressable>

              <Pressable style={({ pressed }) => [styles.guestBtn, pressed && styles.pressed]} onPress={goToMain}>
                <Ionicons name="person-outline" size={16} color={C.gold} />
                <Text style={styles.guestBtnText}>Continuar como invitado</Text>
              </Pressable>
            </View>

            <Text style={styles.registerText}>
              ¿No tienes una cuenta? <Text style={styles.registerLink} onPress={() => router.push('/register')}>Regístrate aquí</Text>
            </Text>

            <View style={styles.footerIcons}>
              <Ionicons name="globe-outline" size={20} color={C.muted} />
              <Ionicons name="shield-checkmark-outline" size={20} color={C.muted} />
              <Ionicons name="help-circle-outline" size={20} color={C.muted} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 24, justifyContent: 'center' },
  brandHeader: { alignItems: 'center', marginBottom: 32, marginTop: 20 },
  logoBox: { width: 64, height: 64, backgroundColor: '#00332D', borderRadius: 18, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  logoDiamond: { position: 'absolute', right: -6, bottom: -6, width: 14, height: 14, backgroundColor: '#C9A84C', transform: [{ rotate: '45deg' }], borderRadius: 2 },
  brandName: { fontSize: 24, fontWeight: '800', color: '#00332D', marginTop: 12 },
  tagline: { fontSize: 11, fontWeight: '600', letterSpacing: 2, color: '#4B5563', marginTop: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 24, paddingVertical: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: '#6B7280', marginBottom: 4 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 4 },
  forgotLink: { fontSize: 12, fontWeight: '600', color: '#C9A84C' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 8 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#111827', height: 40 },
  inputWithToggle: { paddingRight: 40 },
  eyeBtn: { position: 'absolute', right: 0, height: 40, justifyContent: 'center', paddingHorizontal: 4 },
  primaryBtn: { marginTop: 32, height: 50, borderRadius: 8, backgroundColor: '#00332D', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: '#9CA3AF' },
  secondaryBtn: { height: 50, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 },
  secondaryBtnText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  guestBtn: { height: 50, borderRadius: 8, borderWidth: 1, borderColor: '#C9A84C', backgroundColor: '#FAFAFA', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  guestBtnText: { fontSize: 14, fontWeight: '600', color: '#C9A84C' },
  registerText: { marginTop: 32, textAlign: 'center', fontSize: 13, color: '#4B5563' },
  registerLink: { fontWeight: '700', color: '#00332D' },
  footerIcons: { marginTop: 24, flexDirection: 'row', justifyContent: 'center', gap: 24 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});