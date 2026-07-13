import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlert } from '../context/AlertContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { LANGUAGE_LABELS, LanguageCode } from '../i18n/translations';
import { Modal } from 'react-native';

type SettingItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  titleKey: string;
  subtitleKey: string;
};

const ITEMS: SettingItem[] = [
  { id: 'sos', icon: 'warning', iconBg: '#FDE8E8', iconColor: '#D64545', titleKey: 'settings_sos_title', subtitleKey: 'settings_sos_subtitle' },
  { id: 'idioma', icon: 'language', iconBg: '#E3F6EC', iconColor: '#1E8A5F', titleKey: 'settings_lang_title', subtitleKey: 'settings_lang_subtitle' },
  { id: 'descargas', icon: 'download-outline', iconBg: '#EDEDED', iconColor: '#555555', titleKey: 'settings_downloads_title', subtitleKey: 'settings_downloads_subtitle' },
];

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { alert } = useAlert();
  const { language, setLanguage, t } = useLanguage();
  const [langModalVisible, setLangModalVisible] = useState(false);
  const { isDark, toggleDarkMode } = useTheme();

  const handleItemPress = (item: SettingItem) => {
    if (item.id === 'idioma') {
      setLangModalVisible(true);
      return;
    }
    alert(t(item.titleKey), t(item.subtitleKey));
  };

  const handleLogout = () => {
    alert(t('alert_logout_title'), t('alert_logout_message'), [
      { text: t('alert_cancel'), style: 'cancel' },
      {
        text: t('alert_logout_title'),
        style: 'destructive',
        // Corregido: Ahora redirecciona a 'Splash' que es la raíz de la navegación unificada
        onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Splash' }] }),
      },
    ]);
  };

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 20, marginBottom: 16,
    },
    headerTitle: { fontSize: 17, fontWeight: '800', color: colors.green },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40, alignItems: 'center' },
    eyebrow: { fontSize: 11, fontWeight: '700', color: colors.gold, letterSpacing: 1.5, marginBottom: 8, textAlign: 'center' },
    intro: { fontSize: 14, color: colors.gray600, textAlign: 'center', lineHeight: 21, marginBottom: 24, paddingHorizontal: 8 },
    card: { width: '100%', backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.gray100, overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
    iconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    rowTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
    rowSubtitle: { fontSize: 12, color: colors.gray500, marginTop: 2 },
    footer: { alignItems: 'center', marginTop: 32, gap: 6 },
    footerVersion: { fontSize: 11, fontWeight: '700', color: colors.gray400, letterSpacing: 1, marginTop: 8 },
    footerTagline: { fontSize: 11, color: colors.gray400 },
    langModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 32 },
    langModalCard: { width: '100%', backgroundColor: colors.white, borderRadius: 20, padding: 20 },
    langModalTitle: { fontSize: 17, fontWeight: '800', color: colors.green, textAlign: 'center', marginBottom: 16 },
    langOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 12, marginBottom: 8, backgroundColor: colors.gray100 },
    langOptionActive: { backgroundColor: '#E3F6EC' },
    langOptionText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
    langOptionTextActive: { color: colors.green },
    langModalClose: { marginTop: 8, paddingVertical: 12, alignItems: 'center' },
    langModalCloseText: { color: colors.gray500, fontWeight: '700' },
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.green} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings_title')}</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.eyebrow}>{t('settings_eyebrow')}</Text>
        <Text style={styles.intro}>
          {t('settings_intro')}
        </Text>

        <View style={styles.card}>
          {ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.row, index < ITEMS.length - 1 && styles.rowBorder]}
              onPress={() => handleItemPress(item)}
            >
              <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={20} color={item.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{t(item.titleKey)}</Text>
                <Text style={styles.rowSubtitle}>{t(item.subtitleKey)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
            </TouchableOpacity>
          ))}

          <View style={[styles.row, styles.rowBorder]}>
            <View style={[styles.iconWrap, { backgroundColor: '#EFEFEF' }]}>
              <Ionicons name="moon" size={20} color="#555" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{t('settings_dark_title')}</Text>
              <Text style={styles.rowSubtitle}>{t('settings_dark_subtitle')}</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={(value) => {
                toggleDarkMode(value);
              }}
              trackColor={{ false: colors.gray200, true: colors.green }}
              thumbColor={colors.white}
            />
          </View>

          <TouchableOpacity style={styles.row} onPress={handleLogout}>
            <View style={[styles.iconWrap, { backgroundColor: '#FDE8E8' }]}>
              <Ionicons name="log-out-outline" size={20} color="#D64545" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: '#D64545' }]}>{t('settings_logout_title')}</Text>
              <Text style={styles.rowSubtitle}>{t('settings_logout_subtitle')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Ionicons name="leaf-outline" size={40} color={colors.gray400} />
          <Text style={styles.footerVersion}>INKAVOICE V2.4.0</Text>
          <Text style={styles.footerTagline}>{t('settings_footer_tagline')}</Text>
        </View>
      </ScrollView>

      <Modal visible={langModalVisible} transparent animationType="fade" onRequestClose={() => setLangModalVisible(false)}>
        <View style={styles.langModalOverlay}>
          <View style={styles.langModalCard}>
            <Text style={styles.langModalTitle}>{t("settings_lang_title")}</Text>
            {(["es", "en", "qu"] as LanguageCode[]).map((code) => {
              const selected = language === code;
              return (
                <TouchableOpacity
                  key={code}
                  style={[styles.langOption, selected && styles.langOptionActive]}
                  onPress={() => {
                    setLanguage(code);
                    setLangModalVisible(false);
                  }}
                >
                  <Text style={[styles.langOptionText, selected && styles.langOptionTextActive]}>
                    {LANGUAGE_LABELS[code]}
                  </Text>
                  {selected && <Ionicons name="checkmark-circle" size={20} color={colors.green} />}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={styles.langModalClose} onPress={() => setLangModalVisible(false)}>
              <Text style={styles.langModalCloseText}>{t("alert_cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}