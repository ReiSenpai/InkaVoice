import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActionSheetIOS, Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Solo usaremos el inset TOP para la barra de notificaciones de arriba.
  // Dejamos que React Navigation controle el BOTTOM de los botones del celular.
  const insets = useSafeAreaInsets();

  const removePhoto = () => {
    setModalVisible(false);
    Alert.alert('Eliminar foto', '¿Seguro que quieres quitar tu foto de perfil?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setPhotoUri(null) },
    ]);
  };

  const pickFromLibrary = async () => {
    setModalVisible(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a tu galería para elegir una foto.');
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
      Alert.alert('Permiso necesario', 'Necesitamos acceso a tu cámara para tomar una foto.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
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

  return (
    // FIX PRINCIPAL: Solo le damos el padding de arriba para la barra de estado.
    // Quitamos cualquier padding inferior dinámico del contenedor para que no empuje tu barra de navegación.
    <View style={[styles.container, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>InkaVoice</Text>
        <Ionicons name="settings-outline" size={22} color={colors.green} />
      </View>

      <View style={styles.avatarSection}>
        <TouchableOpacity style={styles.avatarWrapper} onPress={handleChangePhoto}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={48} color={colors.gray400} />
            </View>
          )}
          <View style={styles.editBadge}>
            <Ionicons name="camera" size={16} color={colors.white} />
          </View>
        </TouchableOpacity>

        <Text style={styles.name}>Nombre de Usuario</Text>
        <TouchableOpacity onPress={handleChangePhoto}>
          <Text style={styles.changePhotoText}>Cambiar foto de perfil</Text>
        </TouchableOpacity>
      </View>

      {/* --- MENÚ INFERIOR CONTROLADO VISUALMENTE --- */}
      {modalVisible && (
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          {/* Al menú flotante le damos un padding fijo estándar para Android (35), sin chocar con tus tabs */}
          <View style={[styles.modalContent, { paddingBottom: 35 }]}>
            <Text style={styles.modalTitle}>Foto de perfil</Text>
            <Text style={styles.modalSubtitle}>¿Qué deseas hacer?</Text>
            
            <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={22} color={colors.green} style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>Tomar foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={pickFromLibrary}>
              <Ionicons name="image-outline" size={22} color={colors.green} style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>Elegir de galería</Text>
            </TouchableOpacity>

            {photoUri && (
              <TouchableOpacity style={styles.modalOption} onPress={removePhoto}>
                <Ionicons name="trash-outline" size={22} color="#D32F2F" style={styles.modalIcon} />
                <Text style={[styles.modalOptionText, { color: '#D32F2F', fontWeight: '700' }]}>
                  Eliminar foto actual
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.modalOption, { borderBottomWidth: 0, marginTop: 12, justifyContent: 'center' }]} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalOptionText, { color: colors.gray400, fontWeight: '700' }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.green },
  avatarSection: { alignItems: 'center', paddingHorizontal: 20 },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 16,
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.gold,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: colors.gray100,
    borderWidth: 3,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  name: { fontSize: 22, fontWeight: '700', color: colors.green, marginBottom: 4 },
  changePhotoText: { fontSize: 13, color: colors.teal, fontWeight: '600' },

  /* NUEVOS ESTILOS OPTIMIZADOS PARA BOTTOM-TABS */
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    // Aseguramos que se dibuje por encima de la pantalla del perfil,
    // pero sin reordenar ni alterar los contenedores del Bottom Tab Navigation de Android.
    zIndex: 10, 
  },
  modalContent: {
    backgroundColor: colors.white || '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.green,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.gray400 || '#888888',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalIcon: {
    marginRight: 14,
    width: 24,
    textAlign: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
});