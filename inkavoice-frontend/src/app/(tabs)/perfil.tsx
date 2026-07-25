import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Modal, ScrollView, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../../context/UserContext';
import { useAlert } from '../../context/AlertContext';

// ⚠️ URL DE TU BACKEND EN RED LOCAL
const CORE_BACKEND_URL = 'http://192.168.1.36:3000';

export default function ProfileScreen() {
  const router = useRouter();
  const { photoUri, setPhotoUri, name, userId } = useUser();
  const { alert } = useAlert();
  const insets = useSafeAreaInsets();

  // Estados del Perfil
  const [isLoading, setIsLoading] = useState(true);
  const [bio, setBio] = useState('Explorador incansable de las rutas del Qhapaq Ñan. Documentando memorias sonoras desde el Coricancha hasta Choquequirao.');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState('');
  
  // Estado para las Memorias
  const [memories, setMemories] = useState([
    { id: '1', title: 'Cantos de Madre de Dios', region: 'SELVA', image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800' }
  ]);

  // Colores de la paleta
  const C = { bg: '#FAF8F5', greenDark: '#00332D', gold: '#C9A84C', white: '#FFFFFF', muted: '#6B7280', border: '#E5E7EB' };

  // 📡 Cargar datos del usuario desde el backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${CORE_BACKEND_URL}/api/usuarios/${userId || 1}/perfil`);
        if (response.ok) {
          const data = await response.json();
          if (data.bio) setBio(data.bio);
          if (data.memorias) setMemories(data.memorias);
        }
      } catch (error) {
        console.log("Cargando datos locales (Fallback)");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // 💾 Guardar Biografía en el Backend
  const saveBio = async () => {
    setBio(tempBio);
    setIsEditingBio(false);
    try {
      await fetch(`${CORE_BACKEND_URL}/api/usuarios/${userId || 1}/bio`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: tempBio })
      });
    } catch (e) {
      console.error("Error guardando bio", e);
    }
  };

  // 📸 Agregar Nueva Memoria con Foto (Conectado a BD)
  const addNewMemory = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permiso denegado', 'Necesitamos acceso a tus fotos para crear una memoria.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const newUri = result.assets[0].uri;
      // Actualizamos UI inmediatamente
      const newMemory = { id: Date.now().toString(), title: 'Nueva Memoria', region: 'DESCUBRIMIENTO', image: newUri };
      setMemories([newMemory, ...memories]);

      // Subimos imagen al backend
      try {
        const formData = new FormData();
        formData.append('image', { uri: newUri, type: 'image/jpeg', name: 'memoria.jpg' } as any);
        formData.append('userId', userId);
        
        await fetch(`${CORE_BACKEND_URL}/api/memorias/crear`, {
          method: 'POST',
          body: formData
        });
      } catch (e) {
        console.error("Error subiendo memoria", e);
      }
    }
  };

  if (isLoading) return <View style={[styles.container, { justifyContent: 'center' }]}><ActivityIndicator size="large" color={C.gold} /></View>;

  return (
    <View style={[styles.container, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
      <View style={styles.header}>
        <TouchableOpacity hitSlop={10}><Ionicons name="search" size={24} color={C.greenDark} /></TouchableOpacity>
        <Text style={styles.headerTitle}>InkaVoice</Text>
        <TouchableOpacity onPress={() => router.push('/settings')} hitSlop={10}><Ionicons name="settings-outline" size={24} color={C.greenDark} /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* AVATAR Y NOMBRE */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: photoUri || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' }} style={styles.avatarImage} />
            <View style={styles.avatarBadge}><Ionicons name="mic" size={12} color="#FFF" /></View>
          </View>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.rolePill}>
            <Ionicons name="sparkles" size={12} color="#FFF" />
            <Text style={styles.roleText}>Guardián del Patrimonio</Text>
          </View>
          
          <TouchableOpacity style={styles.bioContainer} onPress={() => { setTempBio(bio); setIsEditingBio(true); }}>
            <Text style={styles.bioText}>{bio}</Text>
            <Ionicons name="pencil" size={14} color={C.muted} style={{ marginTop: 4 }} />
          </TouchableOpacity>
        </View>

        {/* ESTADÍSTICAS (Diseño Vertical) */}
        <View style={styles.statsContainer}>
          <View style={styles.statRowCard}>
            <View style={styles.statIconBox}><Ionicons name="location-outline" size={20} color={C.muted} /></View>
            <View><Text style={styles.statValue}>12</Text><Text style={styles.statLabel}>SITIOS VISITADOS</Text></View>
          </View>
          <View style={styles.statRowCard}>
            <View style={styles.statIconBox}><Ionicons name="mic-outline" size={20} color={C.gold} /></View>
            <View><Text style={styles.statValue}>156</Text><Text style={styles.statLabel}>MEMORIAS</Text></View>
          </View>
          <View style={styles.statRowCard}>
            <View style={styles.statIconBox}><Ionicons name="earth-outline" size={20} color={C.muted} /></View>
            <View><Text style={styles.statValue}>3</Text><Text style={styles.statLabel}>REGIONES</Text></View>
          </View>
        </View>

        {/* EXPLORACIÓN DEL PERÚ */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>Exploración del Perú</Text>
              <Text style={styles.progressSubtitle}>Camino a ser "Leyenda de los Andes"</Text>
            </View>
            <Text style={styles.progressPct}>64%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '64%' }]} />
          </View>
          <View style={styles.regionLegend}>
            <Text style={styles.regionLegendText}>Costa: 100%</Text>
            <Text style={styles.regionLegendText}>Sierra: 45%</Text>
            <Text style={styles.regionLegendText}>Selva: 12%</Text>
          </View>
        </View>

        {/* INSIGNIAS CULTURALES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Insignias Culturales</Text>
          <TouchableOpacity onPress={() => router.push('/logros')}>
            <Text style={styles.sectionLink}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.badgesGrid}>
          {/* Ejemplo de insignias fijas para la previsualización */}
          <View style={styles.badgeCard}><View style={styles.badgeIconWrap}><Ionicons name="triangle" size={28} color={C.gold} /></View><Text style={styles.badgeTitle}>Centinela de los Andes</Text></View>
          <View style={styles.badgeCard}><View style={styles.badgeIconWrap}><Ionicons name="water" size={28} color={C.gold} /></View><Text style={styles.badgeTitle}>Voz del Pacífico</Text></View>
          <View style={styles.badgeCard}><View style={styles.badgeIconWrap}><Ionicons name="document-text" size={28} color={C.gold} /></View><Text style={styles.badgeTitle}>Cronista Real</Text></View>
          <View style={styles.badgeCard}><View style={styles.badgeIconWrapLocked}><Ionicons name="leaf" size={28} color={C.muted} /></View><Text style={styles.badgeTitleLocked}>Alma Amazónica</Text></View>
        </View>

        {/* MEMORIAS DESTACADAS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Memorias Destacadas</Text>
        </View>
        
        <TouchableOpacity style={styles.audioPill}>
          <Ionicons name="play-circle-outline" size={20} color={C.gold} />
          <Text style={styles.audioPillText}>Escuchar memoria sonora</Text>
        </TouchableOpacity>
        <View style={styles.audioTitlePill}><Text style={styles.audioTitleText}>El rugir de Paracas</Text></View>

        {memories.map(mem => (
          <View key={mem.id} style={styles.memoryImageCard}>
            <Image source={{ uri: mem.image }} style={styles.memoryImg} />
            <View style={styles.memoryOverlay}>
              <Text style={styles.memoryRegion}>{mem.region}</Text>
              <Text style={styles.memoryImgTitle}>{mem.title}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.newMemoryBtn} onPress={addNewMemory}>
          <Ionicons name="add-circle-outline" size={24} color={C.white} />
          <Text style={styles.newMemoryText}>Nueva Memoria</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal para Editar Biografía */}
      <Modal visible={isEditingBio} transparent animationType="fade">
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Descripción</Text>
              <TextInput
                style={styles.bioInput}
                multiline
                numberOfLines={4}
                value={tempBio}
                onChangeText={setTempBio}
                autoFocus
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditingBio(false)}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={saveBio}><Text style={styles.saveText}>Guardar</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#00332D' },
  scrollContent: { paddingHorizontal: 20 },
  
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarWrapper: { width: 100, height: 100, borderRadius: 24, borderWidth: 3, borderColor: '#C9A84C', padding: 2, marginBottom: 12 },
  avatarImage: { width: '100%', height: '100%', borderRadius: 20 },
  avatarBadge: { position: 'absolute', bottom: -6, right: -6, width: 28, height: 28, borderRadius: 14, backgroundColor: '#A38A59', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FAF8F5' },
  name: { fontSize: 26, fontWeight: '800', color: '#00332D', marginBottom: 6 },
  rolePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FCD34D', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, gap: 6, marginBottom: 16 },
  roleText: { fontSize: 11, fontWeight: '800', color: '#00332D' },
  bioContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingHorizontal: 10 },
  bioText: { fontSize: 14, color: '#4B5563', textAlign: 'center', lineHeight: 20, flexShrink: 1 },

  statsContainer: { gap: 12, marginBottom: 32 },
  statRowCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  statIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#00332D' },
  statLabel: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 1 },

  progressSection: { marginBottom: 32 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  progressTitle: { fontSize: 18, fontWeight: '800', color: '#00332D' },
  progressSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  progressPct: { fontSize: 18, fontWeight: '800', color: '#A38A59' },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', backgroundColor: '#00332D', borderRadius: 4 },
  regionLegend: { flexDirection: 'row', justifyContent: 'space-between' },
  regionLegendText: { fontSize: 10, color: '#6B7280', fontWeight: '700' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#00332D' },
  sectionLink: { fontSize: 12, fontWeight: '700', color: '#A38A59' },

  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 32 },
  badgeCard: { width: '48%', alignItems: 'center', marginBottom: 20 },
  badgeIconWrap: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#FCD34D', alignItems: 'center', justifyContent: 'center', shadowColor: '#C9A84C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4, marginBottom: 8 },
  badgeIconWrapLocked: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  badgeTitle: { fontSize: 12, fontWeight: '700', color: '#00332D', textAlign: 'center' },
  badgeTitleLocked: { fontSize: 12, fontWeight: '600', color: '#9CA3AF', textAlign: 'center' },

  audioPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#00332D', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 8, marginBottom: -10, zIndex: 2, marginLeft: 16 },
  audioPillText: { color: '#C9A84C', fontSize: 12, fontWeight: '700' },
  audioTitlePill: { backgroundColor: '#4F7A85', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10, borderRadius: 16, marginBottom: 16 },
  audioTitleText: { color: '#FFF', fontSize: 14, fontWeight: '600' },

  memoryImageCard: { width: '100%', height: 280, borderRadius: 24, overflow: 'hidden', marginBottom: 16 },
  memoryImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  memoryOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'rgba(0,0,0,0.4)' },
  memoryRegion: { color: '#FFF', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  memoryImgTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },

  newMemoryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#85601E', paddingVertical: 18, borderRadius: 16, gap: 10, marginTop: 10 },
  newMemoryText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', padding: 24, borderRadius: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#00332D', marginBottom: 16 },
  bioInput: { backgroundColor: '#F9F8F6', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 14, color: '#374151', minHeight: 100, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  cancelText: { color: '#6B7280', fontWeight: '700' },
  saveBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#00332D', alignItems: 'center' },
  saveText: { color: '#FFF', fontWeight: '700' },
});