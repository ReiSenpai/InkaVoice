import { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'; // <-- 1. Importar Google Sign-In

import BrandHeader from '../components/BrandHeader';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();
  const { setName } = useUser();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // <-- Estado para el botón de Google

  const { colors } = useTheme();
  const Container = Platform.OS === 'web' ? View : SafeAreaView;

  // <-- 2. Configurar Google Sign-In al montar la pantalla
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'TU_WEB_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com', // Reemplaza con tu ID real
      offlineAccess: true,
    });
  }, []);

  // <-- 3. Lógica principal de Google Sign-In
  const signInWithGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      // ACTUALIZACIÓN: En las nuevas versiones, el token vive dentro de "data"
      const idToken = userInfo.data?.idToken;

      if (idToken) {
        await enviarTokenAlCoreBackend(idToken);
      } else {
        Alert.alert('Error', 'No se pudo obtener el token de Google.');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('El usuario canceló el inicio de sesión.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('El inicio de sesión ya está en progreso.');
      } else {
        Alert.alert('Error de Login', error.message);
        console.error(error);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // <-- 4. Conexión con tu Core Backend (Spring Boot)
  const enviarTokenAlCoreBackend = async (idToken: string) => {
    try {
      // Manejo dinámico de IP para el emulador de Android o Web/iOS
      const CORE_BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

      const response = await fetch(`${CORE_BACKEND_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await response.json();

      if (response.ok) {
        // Autenticación exitosa en Spring Boot
        console.log('Token JWT de InkaVoice:', data.appToken);
        
        // TODO: En el futuro puedes guardar el `data.appToken` en AsyncStorage o SecureStore
        
        setName('Usuario Google'); // Puedes extraer el nombre real si tu backend lo devuelve
        navigation.replace('Main');
      } else {
        Alert.alert('Error', data.message || 'Error de autenticación en el servidor');
      }
    } catch (error) {
      Alert.alert('Error de Conexión', 'No se pudo conectar con el servidor de InkaVoice.');
      console.error(error);
    }
  };

  const goToGuest = () => {
    setName('Invitado');
    navigation.replace('Main');
  };

  const goToMain = () => {
    setName(email.split('@')[0] || 'Usuario');
    navigation.replace('Main');
  };

  const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#f3f4f6',
      paddingHorizontal: 20,
      paddingVertical: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 24,
      elevation: 3,
    },
    label: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 1,
      color: colors.gray500,
      marginBottom: 8,
    },
    passwordRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 16,
      marginBottom: 8,
    },
    forgotLink: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.gold,
    },
    inputWrap: {
      position: 'relative',
      justifyContent: 'center',
    },
    inputIcon: {
      position: 'absolute',
      left: 14,
      zIndex: 1,
      fontSize: 14,
      color: colors.gray400,
    },
    input: {
      minHeight: 48,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingLeft: 40,
      paddingRight: 16,
      fontSize: 16,
      color: '#1f2937',
      backgroundColor: colors.white,
    },
    inputWithToggle: {
      paddingRight: 44,
    },
    eyeBtn: {
      position: 'absolute',
      right: 12,
      height: 48,
      justifyContent: 'center',
    },
    eyeIcon: {
      fontSize: 16,
    },
    primaryBtn: {
      marginTop: 20,
      minHeight: 48,
      borderRadius: 12,
      backgroundColor: colors.green,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    primaryBtnText: {
      color: colors.white,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 1,
    },
    primaryBtnArrow: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '700',
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginVertical: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#e5e7eb',
    },
    dividerText: {
      fontSize: 10,
      fontWeight: '600',
      letterSpacing: 1,
      color: colors.gray400,
    },
    secondaryBtn: {
      minHeight: 48,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.white,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginBottom: 10,
    },
    googleG: {
      fontSize: 18,
      fontWeight: '700',
      color: '#4285F4',
    },
    secondaryBtnText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#374151',
    },
    guestBtn: {
      minHeight: 48,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(154, 132, 71, 0.6)',
      backgroundColor: colors.white,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    guestIcon: {
      fontSize: 14,
      color: colors.gold,
    },
    guestBtnText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.gold,
    },
    registerText: {
      marginTop: 24,
      textAlign: 'center',
      fontSize: 13,
      color: colors.gray600,
    },
    registerLink: {
      fontWeight: '600',
      color: colors.teal,
    },
    footerIcons: {
      marginTop: 24,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 24,
    },
    footerIcon: {
      fontSize: 16,
      color: colors.gray400,
    },
    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
  });

  return (
    <Container style={styles.safe} {...(Platform.OS !== 'web' ? { edges: ['top', 'bottom'] as const } : {})}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BrandHeader />

          <View style={styles.card}>
            <Text style={styles.label}>{t('login_email')}</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={t("login_email_placeholder")}
                placeholderTextColor={colors.gray400}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>

            <View style={styles.passwordRow}>
              <Text style={styles.label}>{t('login_password')}</Text>
              <Pressable onPress={() => {}} hitSlop={8}>
                <Text style={styles.forgotLink}>{t('login_forgot')}</Text>
              </Pressable>
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.gray400}
                secureTextEntry={!showPassword}
                style={[styles.input, styles.inputWithToggle]}
              />
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeBtn}
                hitSlop={8}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
              onPress={goToMain}
            >
              <Text style={styles.primaryBtnText}>{t('login_submit')}</Text>
              <Text style={styles.primaryBtnArrow}>→</Text>
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('login_or_continue')}</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* <-- 5. Se actualizó el botón para disparar signInWithGoogle y manejar opacidad si está cargando */}
            <Pressable 
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed, isGoogleLoading && { opacity: 0.5 }]}
              onPress={signInWithGoogle}
              disabled={isGoogleLoading}
            >
              <Text style={styles.googleG}>G</Text>
              <Text style={styles.secondaryBtnText}>
                {isGoogleLoading ? 'Cargando...' : t('login_google')}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.guestBtn, pressed && styles.pressed]}
              onPress={goToGuest}
            >
              <Text style={styles.guestIcon}>👤</Text>
              <Text style={styles.guestBtnText}>{t('login_guest')}</Text>
            </Pressable>
          </View>

          <Text style={styles.registerText}>
            {t('login_no_account')} 
            <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
              {t('login_register_link')}
            </Text>
          </Text>

          <View style={styles.footerIcons}>
            <Text style={styles.footerIcon}>🌐</Text>
            <Text style={styles.footerIcon}>🛡</Text>
            <Text style={styles.footerIcon}>?</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}