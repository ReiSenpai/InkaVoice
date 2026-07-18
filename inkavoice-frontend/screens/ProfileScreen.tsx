import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActionSheetIOS, Platform, Modal, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { useAlert } from '../context/AlertContext';
import { useLanguage } from '../context/LanguageContext';
import { getInitials } from '../utils/initials';
import { useTheme } from '../context/ThemeContext';

const STATS = [
  { id: 'sitios', icon: 'location-outline', value: 12, labelKey: 'profile_stat_sites' },
  { id: 'memorias', icon: 'mic-outline', value: 156, labelKey: 'profile_stat_memories' },
  { id: 'regiones', icon: 'earth-outline', value: 3, labelKey: 'profile_stat_regions' },
];

const REGION_PROGRESS = [
  { region: 'Costa', pct: 100, labelKey: 'category_coast' },
  { region: 'Sierra', pct: 45, labelKey: 'category_highlands' },
  { region: 'Selva', pct: 12, labelKey: 'category_jungle' },
];

const OVERALL_PROGRESS = 64;

type Badge = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  unlocked: boolean;
};

const BADGES: Badge[] = [
  { id: 'centinela', icon: 'triangle-outline', title: 'Centinela de los Andes', description: 'Visitaste 5 sitios en la región Sierra.', unlocked: true },
  { id: 'voz', icon: 'water-outline', title: 'Voz del Pacífico', description: 'Escuchaste 10 audioguías en la Costa.', unlocked: true },
  { id: 'cronista', icon: 'document-text-outline', title: 'Cronista Real', description: 'Guardaste 20 memorias sonoras.', unlocked: true },
  { id: 'alma', icon: 'leaf-outline', title: 'Alma Amazónica', description: 'Visita 3 sitios en la Selva para desbloquear.', unlocked: false },
  { id: 'primer-inca', icon: 'star-outline', title: 'Primer Inca', description: 'Completa tu primera ruta guiada.', unlocked: false },
  { id: 'arquitecto', icon: 'construct-outline', title: 'Gran Arquitecto', description: 'Explora 5 sitios arqueológicos distintos.', unlocked: false },
];

type Memory = { id: string; title: string; subtitle: string };

const INITIAL_MEMORIES: Memory[] = [
  { id: '1', title: 'El rugir de Paracas', subtitle: 'Costa · Memoria sonora' },
  { id: '2', title: 'Cantos de Madre de Dios', subtitle: 'Selva · Memoria sonora' },
];

export default function ProfileScreen() {
  const { photoUri, setPhotoUri, name } = useUser();
  const { alert } = useAlert();
  const { t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [memoryModalVisible, setMemoryModalVisible] = useState(false);
  const [newMemoryText, setNewMemoryText] = useState('');
  const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const removePhoto = () => {
    setModalVisible(false);
    alert(t('alert_remove_photo_title'), t('alert_remove_photo_message'), [
      { text: t('alert_cancel'), style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setPhotoUri(null) },
    ]);
  };

  const pickFromLibrary = async () => {
    setModalVisible(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert(t('alert_mic_permission_title'), t('alert_gallery_permission_message'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    setModalVisible(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert(t('alert_mic_permission_title'), t('alert_camera_photo_permission_message'));
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.5,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleChangePhoto = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: photoUri ? ['Cancelar', 'Tomar foto', 'Elegir de galería', 'Eliminar foto'] : ['Cancelar', 'Tomar foto', 'Elegir de galería'],
          cancelButtonIndex: 0,
          destructiveButtonIndex: photoUri ? 3 : undefined,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) takePhoto();
          if (buttonIndex === 2) pickFromLibrary();
          if (buttonIndex === 3 && photoUri) removePhoto();
        }
      );
    } else {
      setModalVisible(true);
    }
  };

  const handleBadgePress = (badge: Badge) => {
    alert(badge.unlocked ? `${t('alert_badge_unlocked_prefix')} ${badge.title}` : `${t('alert_badge_locked_prefix')} ${badge.title}`, badge.description);
  };

  const openNewMemoryModal = () => {
    setNewMemoryText('');
    setMemoryModalVisible(true);
  };

  const confirmNewMemory = () => {
    const text = newMemoryText.trim();
    if (!text) {
      setMemoryModalVisible(false);
      return;
    }
    setMemories(prev => [{ id: Date.now().toString(), title: text, subtitle: 'Nueva región · Memoria sonora' }, ...prev]);
    setMemoryModalVisible(false);
  };

  const { colors } = useTheme();

  const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 24 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.green },
  avatarSection: { alignItems: 'center', paddingHorizontal: 20, marginBottom: 24 },
  avatarWrapper: { width: 120, height: 120, borderRadius: 20, marginBottom: 16, position: 'relative' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 20, borderWidth: 3, borderColor: colors.gold },
  avatarInitials: { fontSize: 36, fontWeight: '800', color: colors.green },
  avatarPlaceholder: { width: '100%', height: '100%', borderRadius: 20, backgroundColor: colors.gray100, borderWidth: 3, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  editBadge: { position: 'absolute', bottom: -6, right: -6, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white },
  name: { fontSize: 22, fontWeight: '700', color: colors.green, marginBottom: 4 },
  changePhotoText: { fontSize: 13, color: colors.teal, fontWeight: '600' },

  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: colors.gray100, borderRadius: 16, paddingVertical: 16, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.green },
  statLabel: { fontSize: 9, fontWeight: '700', color: colors.gray500, textAlign: 'center', letterSpacing: 0.5 },

  progressSection: { paddingHorizontal: 20, marginBottom: 28 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  progressTitle: { fontSize: 18, fontWeight: '800', color: colors.green },
  progressSubtitle: { fontSize: 12, color: colors.gray500, marginTop: 2 },
  progressPct: { fontSize: 18, fontWeight: '800', color: colors.gold },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: colors.gray200, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', backgroundColor: colors.gold, borderRadius: 4 },
  regionLegend: { flexDirection: 'row', justifyContent: 'space-between' },
  regionLegendText: { fontSize: 11, color: colors.gray500, fontWeight: '600' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.green },
  sectionLink: { fontSize: 12, fontWeight: '600', color: colors.teal },

  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12, marginBottom: 28 },
  badgeCard: { width: '30%', alignItems: 'center', gap: 8 },
  badgeIconWrap: { width: 64, height: 64, borderRadius: 16, backgroundColor: colors.beige, alignItems: 'center', justifyContent: 'center' },
  badgeIconWrapLocked: { backgroundColor: colors.gray100 },
  badgeTitle: { fontSize: 11, fontWeight: '600', color: colors.green, textAlign: 'center' },
  badgeTitleLocked: { color: colors.gray400 },

  memoryCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 10, backgroundColor: colors.greenDark, borderRadius: 14, padding: 14, gap: 12 },
  memoryIconWrap: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  memoryTitle: { color: colors.textOnDark, fontSize: 14, fontWeight: '700' },
  memorySubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },

  newMemoryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 12, backgroundColor: colors.gold, borderRadius: 14, paddingVertical: 16 },
  newMemoryText: { color: colors.textOnDark, fontSize: 14, fontWeight: '700' },

  modalOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end', zIndex: 10 },
  modalContent: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingTop: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.green, textAlign: 'center', marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: colors.gray400, textAlign: 'center', marginBottom: 16 },
  modalOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalIcon: { marginRight: 14, width: 24, textAlign: 'center' },
  modalOptionText: { fontSize: 16, fontWeight: '500', color: '#333333' },

  memoryInput: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#1f2937', marginBottom: 16 },
  memoryModalActions: { flexDirection: 'row', gap: 12 },
  memoryModalCancel: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  memoryModalCancelText: { color: colors.gray500, fontWeight: '700' },
  memoryModalConfirm: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.green, alignItems: 'center' },
  memoryModalConfirmText: { color: colors.white, fontWeight: '700' },
});


  return (
    <View style={[styles.container, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>InkaVoice</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}><Ionicons name="settings-outline" size={22} color={colors.green} /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={handleChangePhoto}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={16} color={colors.textOnDark} />
            </View>
          </TouchableOpacity>

          <Text style={styles.name}>{name}</Text>
          <TouchableOpacity onPress={handleChangePhoto}>
            <Text style={styles.changePhotoText}>{t('profile_change_photo')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          {STATS.map(stat => (
            <View key={stat.id} style={styles.statCard}>
              <Ionicons name={stat.icon as any} size={20} color={colors.green} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{t(stat.labelKey)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>{t('profile_progress_title')}</Text>
              <Text style={styles.progressSubtitle}>{t("profile_progress_subtitle")}</Text>
            </View>
            <Text style={styles.progressPct}>{OVERALL_PROGRESS}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${OVERALL_PROGRESS}%` }]} />
          </View>
          <View style={styles.regionLegend}>
            {REGION_PROGRESS.map(r => (
              <Text key={r.region} style={styles.regionLegendText}>{t(r.labelKey)}: {r.pct}%</Text>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('profile_badges_title')}</Text>
          <TouchableOpacity onPress={() => alert(t('alert_all_badges_title'), t('alert_all_badges_message').replace('{unlocked}', String(BADGES.filter(b => b.unlocked).length)).replace('{total}', String(BADGES.length)))}>
            <Text style={styles.sectionLink}>{t('profile_view_all')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.badgesGrid}>
          {BADGES.map(badge => (
            <TouchableOpacity key={badge.id} style={styles.badgeCard} onPress={() => handleBadgePress(badge)}>
              <View style={[styles.badgeIconWrap, !badge.unlocked && styles.badgeIconWrapLocked]}>
                <Ionicons name={badge.icon} size={26} color={badge.unlocked ? colors.gold : colors.gray400} />
              </View>
              <Text style={[styles.badgeTitle, !badge.unlocked && styles.badgeTitleLocked]}>{badge.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('profile_memories_title')}</Text>
        </View>
        {memories.map(memory => (
          <TouchableOpacity
            key={memory.id}
            style={styles.memoryCard}
            onPress={() => alert(memory.title, t('alert_memory_playing_message'))}
          >
            <View style={styles.memoryIconWrap}>
              <Ionicons name="play-circle" size={28} color={colors.textOnDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.memoryTitle}>{memory.title}</Text>
              <Text style={styles.memorySubtitle}>{memory.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.newMemoryBtn} onPress={openNewMemoryModal}>
          <Ionicons name="add-circle-outline" size={20} color={colors.textOnDark} />
          <Text style={styles.newMemoryText}>{t('profile_new_memory')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal: cambiar foto */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContent, { paddingBottom: 35 }]}>
            <Text style={styles.modalTitle}>{t('profile_modal_photo_title')}</Text>
            <Text style={styles.modalSubtitle}>{t('profile_modal_photo_subtitle')}</Text>

            <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={22} color={colors.green} style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>{t('profile_modal_take_photo')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={pickFromLibrary}>
              <Ionicons name="image-outline" size={22} color={colors.green} style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>{t('profile_modal_choose_gallery')}</Text>
            </TouchableOpacity>

            {photoUri && (
              <TouchableOpacity style={styles.modalOption} onPress={removePhoto}>
                <Ionicons name="trash-outline" size={22} color="#D32F2F" style={styles.modalIcon} />
                <Text style={[styles.modalOptionText, { color: '#D32F2F', fontWeight: '700' }]}>{t('profile_modal_remove_photo')}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.modalOption, { borderBottomWidth: 0, marginTop: 12, justifyContent: 'center' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalOptionText, { color: colors.gray400, fontWeight: '700' }]}>{t('profile_modal_cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={memoryModalVisible} transparent animationType="fade" onRequestClose={() => setMemoryModalVisible(false)}>
        <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'flex-end' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMemoryModalVisible(false)}>
            <TouchableOpacity activeOpacity={1} style={[styles.modalContent, { paddingBottom: 24 }]}>
              <Text style={styles.modalTitle}>{t('profile_modal_new_memory_title')}</Text>
              <Text style={styles.modalSubtitle}>{t('profile_modal_new_memory_subtitle')}</Text>

              <TextInput
                value={newMemoryText}
                onChangeText={setNewMemoryText}
                placeholder="Ej. El eco de Choquequirao"
                placeholderTextColor={colors.gray400}
                style={styles.memoryInput}
                autoFocus
              />

              <View style={styles.memoryModalActions}>
                <TouchableOpacity style={styles.memoryModalCancel} onPress={() => setMemoryModalVisible(false)}>
                  <Text style={styles.memoryModalCancelText}>{t('profile_modal_cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.memoryModalConfirm} onPress={confirmNewMemory}>
                  <Text style={styles.memoryModalConfirmText}>{t('profile_modal_save')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}


