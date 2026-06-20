import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandHeader from '../components/BrandHeader';
import { colors } from '../theme/colors';

type LoginScreenProps = {
  onRegister?: () => void;
  onForgotPassword?: () => void;
  onSubmit?: (email: string, password: string) => void;
};

export default function LoginScreen({
  onRegister,
  onForgotPassword,
  onSubmit,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
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
            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="tu@ejemplo.com"
                placeholderTextColor={colors.gray400}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>

            <View style={styles.passwordRow}>
              <Text style={styles.label}>CONTRASEÑA</Text>
              <Pressable onPress={onForgotPassword} hitSlop={8}>
                <Text style={styles.forgotLink}>¿Olvidaste la clave?</Text>
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
              onPress={() => onSubmit?.(email, password)}
            >
              <Text style={styles.primaryBtnText}>INICIAR SESIÓN</Text>
              <Text style={styles.primaryBtnArrow}>→</Text>
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>O CONTINUAR CON</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}>
              <Text style={styles.googleG}>G</Text>
              <Text style={styles.secondaryBtnText}>Google</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.guestBtn, pressed && styles.pressed]}
            >
              <Text style={styles.guestIcon}>👤</Text>
              <Text style={styles.guestBtnText}>Continuar como invitado</Text>
            </Pressable>
          </View>

          <Text style={styles.registerText}>
            ¿No tienes una cuenta?{' '}
            <Text style={styles.registerLink} onPress={onRegister}>
              Regístrate aquí
            </Text>
          </Text>

          <View style={styles.footerIcons}>
            <Text style={styles.footerIcon}>🌐</Text>
            <Text style={styles.footerIcon}>🛡</Text>
            <Text style={styles.footerIcon}>?</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
