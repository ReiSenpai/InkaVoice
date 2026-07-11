import { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AuthTopBar from '../components/AuthTopBar';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import { useAlert } from '../context/AlertContext';
import { useLanguage } from '../context/LanguageContext';
import type { RootStackParamList } from '../navigation/types';

type Language = 'es' | 'en' | 'qu';

const COUNTRIES = [
  'Perú',
  'México',
  'España',
  'Argentina',
  'Colombia',
  'Chile',
  'Estados Unidos',
  'Ecuador',
  'Bolivia',
];

const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'English' },
  { id: 'qu', label: 'Quechua' },
];

const INTERESTS = [
  { id: 'arqueologia', labelKey: 'register_interest_archaeology' },
  { id: 'gastronomia', labelKey: 'register_interest_gastronomy' },
  { id: 'naturaleza', labelKey: 'register_interest_nature' },
  { id: 'artesania', labelKey: 'register_interest_crafts' },
  { id: 'aventura', labelKey: 'register_interest_adventure' },
];

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setName } = useUser();
  const { alert } = useAlert();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState('');
  const { language, setLanguage, t } = useLanguage();
  const [interests, setInterests] = useState<string[]>(['arqueologia']);
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  const Container = Platform.OS === 'web' ? View : SafeAreaView;

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleCreateAccount = () => {
    setName(fullName.trim() || 'Usuario');
    alert('Cuenta creada', 'Tu cuenta se creó correctamente. Ahora inicia sesión para continuar.', [
      { text: 'OK', onPress: () => navigation.replace('Login') },
    ]);
  };

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
          <AuthTopBar
            actionLabel="Iniciar Sesión"
            onAction={() => navigation.navigate('Login')}
          />

          <View style={styles.card}>
            <Text style={styles.title}>{t('register_title')}</Text>
            <Text style={styles.subtitle}>
              {t('register_subtitle')}
            </Text>

            <Text style={styles.label}>{t('register_fullname')}</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Ej. Juan Pérez"
              placeholderTextColor={colors.gray400}
              style={styles.underlineInput}
            />

            <Text style={[styles.label, styles.fieldGap]}>{t('register_email')}</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="nombre@ejemplo.com"
              placeholderTextColor={colors.gray400}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.underlineInput}
            />

            <Text style={[styles.label, styles.fieldGap]}>{t('register_password')}</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.gray400}
                secureTextEntry={!showPassword}
                style={[styles.underlineInput, styles.passwordInput]}
              />
              <Pressable onPress={() => setShowPassword((prev) => !prev)} hitSlop={8}>
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
              </Pressable>
            </View>

            <Text style={[styles.label, styles.fieldGap]}>{t('register_country')}</Text>
            <Pressable
              style={styles.selectField}
              onPress={() => setCountryModalVisible(true)}
            >
              <Text style={country ? styles.selectValue : styles.selectPlaceholder}>
                {country || t('register_country_placeholder')}
              </Text>
              <Text style={styles.selectArrow}>▾</Text>
            </Pressable>

            <Text style={[styles.label, styles.fieldGap]}>{t('register_language')}</Text>
            <View style={styles.languageRow}>
              {LANGUAGES.map((item) => {
                const selected = language === item.id;
                return (
                  <Pressable
                    key={item.id}
                    style={[styles.languageOption, selected && styles.languageOptionActive]}
                    onPress={() => setLanguage(item.id)}
                  >
                    <View style={[styles.radio, selected && styles.radioActive]}>
                      {selected ? <View style={styles.radioDot} /> : null}
                    </View>
                    <Text style={[styles.languageText, selected && styles.languageTextActive]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, styles.fieldGap]}>{t('register_interests')}</Text>
            <View style={styles.chipsRow}>
              {INTERESTS.map((item) => {
                const selected = interests.includes(item.id);
                return (
                  <Pressable
                    key={item.id}
                    style={[styles.chip, selected && styles.chipActive]}
                    onPress={() => toggleInterest(item.id)}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                      {t(item.labelKey)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
              onPress={handleCreateAccount}
            >
              <Text style={styles.primaryBtnText}>{t('register_submit')}</Text>
              <Text style={styles.primaryBtnArrow}>→</Text>
            </Pressable>

            <Text style={styles.loginText}>
              {t('register_have_account')} 
              <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                {t('register_login_link')}
              </Text>
            </Text>
          </View>

          <View style={styles.footerDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerDiamond}>◆</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.footer}>
            © 2024 InkaVoice • Un viaje a través de la herencia cultural del Perú
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={countryModalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setCountryModalVisible(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Selecciona tu país</Text>
            {COUNTRIES.map((item) => (
              <Pressable
                key={item}
                style={styles.modalOption}
                onPress={() => {
                  setCountry(item);
                  setCountryModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.green,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.gray500,
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.gray500,
    marginBottom: 8,
  },
  fieldGap: { marginTop: 18 },
  underlineInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1f2937',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passwordInput: { flex: 1 },
  eyeIcon: { fontSize: 16, color: colors.gray400 },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
  },
  selectPlaceholder: { fontSize: 16, color: colors.gray400 },
  selectValue: { fontSize: 16, color: '#1f2937' },
  selectArrow: { fontSize: 14, color: colors.gray400 },
  languageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: colors.gray100,
  },
  languageOptionActive: {
    backgroundColor: '#e8f0ed',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.gray400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.green },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  languageText: { fontSize: 14, color: colors.gray600 },
  languageTextActive: { color: colors.green, fontWeight: '600' },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  chipIcon: { fontSize: 14 },
  chipText: { fontSize: 13, fontWeight: '500', color: colors.gray600 },
  chipTextActive: { color: colors.white },
  primaryBtn: {
    marginTop: 28,
    minHeight: 52,
    borderRadius: 14,
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
  primaryBtnArrow: { color: colors.white, fontSize: 16, fontWeight: '700' },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 13,
    color: colors.gray600,
  },
  loginLink: { fontWeight: '600', color: colors.gold },
  footerDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 28,
    marginBottom: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerDiamond: { fontSize: 8, color: colors.gray400 },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 18,
    color: colors.gray400,
    paddingHorizontal: 12,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.green,
    marginBottom: 12,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  modalOptionText: { fontSize: 16, color: '#1f2937' },
});
