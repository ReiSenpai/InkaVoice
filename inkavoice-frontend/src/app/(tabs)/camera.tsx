import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar, Dimensions, Platform, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const FRAME = width * 0.75;
const API_URL = 'http://192.168.1.36:3000/api/asistente/vision'; 

export default function CameraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useLanguage();
  const { colors } = useTheme();
  
  const C = {
    green: '#00332D',
    gold: '#C9A84C',
    goldL: '#FCD34D',
  };

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [scanning, setScanning] = useState(false);
  
  const progress = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanLineY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const startScan = async () => {
    if (scanning || !cameraRef.current) return;
    setScanning(true);

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineY, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(scanLineY, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ])
    ).start();

    progress.setValue(0);
    Animated.timing(progress, { toValue: 0.8, duration: 3000, useNativeDriver: false }).start();

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, base64: false });
      
      const formData = new FormData();
      formData.append('language', language || 'es');
      formData.append('image', {
        uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        type: 'image/jpeg',
        name: 'capture.jpg',
      } as any);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      const data = await response.json();

      Animated.timing(progress, { toValue: 1, duration: 500, useNativeDriver: false }).start(() => {
        setScanning(false);
        pulseAnim.stopAnimation();
        pulseAnim.setValue(1);
        scanLineY.stopAnimation();
        
        router.push({
          pathname: '/resultado',
          params: { 
            photoUri: photo.uri, 
            aiDescription: data.data?.description || data.description || data.ai_text || 'Monumento detectado por IA.' 
          }
        });
      });

    } catch (error) {
      console.error('Error procesando imagen:', error);
      Alert.alert('Error', 'Hubo un error al conectar con la IA.');
      setScanning(false);
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      scanLineY.stopAnimation();
      progress.setValue(0);
    }
  };

  const pickFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la galería');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
        console.log('Imagen de galería seleccionada para IA:', result.assets[0].uri);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) return <View style={styles.container}><ActivityIndicator color={C.gold} /></View>;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{color: 'white', textAlign: 'center', marginTop: '50%'}}>Necesitamos permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}><Text style={{color: 'white'}}>Otorgar Permiso</Text></TouchableOpacity>
      </View>
    );
  }

  const progressWidth = progress.interpolate({ inputRange: [0,1], outputRange: ['0%','100%'] });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <CameraView style={styles.cameraSimulation} facing={facing} ref={cameraRef}>
        
        <View style={styles.topGradient} />

        {/* HEADER */}
        <View style={[styles.header, { top: insets.top + 10 }]}>
            <TouchableOpacity hitSlop={10}>
                <Ionicons name="search" size={20} color="#FFF" />
            </TouchableOpacity>
          <Text style={styles.appName}>InkaVoice</Text>
          <TouchableOpacity style={styles.settingsBtn} hitSlop={10} onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* BORDE DE ENFOQUE */}
        <View style={styles.frameBorder}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
        </View>

        {/* TARJETA DE PROGRESO */}
        {scanning && (
          <View style={[styles.scanCard, { elevation: 10 }]}>
            <View style={styles.scanLabelRow}>
              <Ionicons name="color-wand-outline" size={18} color="#FFF" />
              <Text style={styles.scanCardLabel}>ESCANEANDO PATRIMONIO...</Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
          </View>
        )}

        {/* PIN DETECTADO */}
        {!scanning && permission.granted && (
            <View style={styles.pinDetector}>
                <Ionicons name="pin" size={12} color="#000" />
                <Text style={styles.pinText}>Templo del Sol</Text>
            </View>
        )}

        <View style={styles.bottomGradient} />
      </CameraView>

      {/* CONTROLES INFERIORES */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.controlBtnWrap} onPress={pickFromGallery}>
          <Ionicons name="images-outline" size={26} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureBtn} onPress={startScan} activeOpacity={0.8} disabled={scanning}>
          <View style={styles.captureRing}>
            <View style={[styles.captureInner, scanning && { backgroundColor: C.gold }]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.flipBtn} onPress={toggleCameraFacing} disabled={scanning}>
          <Ionicons name="camera-reverse-outline" size={26} color="#FFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.assistantBtn, { elevation: 5 }]} onPress={() => router.push('/asistente')} disabled={scanning}>
            <Ionicons name="mic-outline" size={26} color="#00332D" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraSimulation: { flex: 1 },
  permissionBtn: { alignSelf: 'center', marginTop: 20, padding: 10, backgroundColor: '#00332D', borderRadius: 10 },

  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 120, backgroundColor: 'rgba(0,0,0,0.4)' },
  bottomGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, backgroundColor: 'rgba(0,0,0,0.5)' },

  header: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  appName: { color: '#C9A84C', fontSize: 20, fontWeight: '800', letterSpacing: 1.5, textAlign: 'center', marginLeft: 15 },
  settingsBtn: { padding: 4 },

  frameBorder: { ...StyleSheet.absoluteFillObject, margin: 40, marginTop: 140, marginBottom: 180 },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: '#FFF', borderWidth: 2, opacity: 0.8 },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

  scanCard: { position: 'absolute', top: '35%', alignSelf: 'center', width: FRAME, backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: 20, borderRadius: 20, borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  scanLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scanCardLabel: { color: '#FFF', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  progressTrack: { width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FCD34D', borderRadius: 3 },

  pinDetector: { position: 'absolute', top: '30%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: '#FCD34D', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, gap: 5 },
  pinText: { fontSize: 12, fontWeight: '700', color: '#000' },

  controls: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', zIndex: 10, gap: 20 },
  controlBtnWrap: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 12 },
  flipBtn: { padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  assistantBtn: { padding: 12, backgroundColor: '#FCD34D', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  
  captureBtn: { padding: 4 },
  captureRing: { width: 76, height: 76, borderRadius: 38, borderWidth: 3, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF' },
});