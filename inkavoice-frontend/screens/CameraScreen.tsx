import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const C = { dark: '#0D1A0E', green: '#00332D', gold: '#C9A84C', goldL: '#F4D03F', white: '#F5F0E8', gray: '#718096' };

export default function CameraScreen() {
  const navigation = useNavigation<any>();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanLineY = useRef(new Animated.Value(0)).current;

  const startScan = () => {
    if (scanning) return;
    setScanning(true);
    setScanned(false);
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.03, duration: 600, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(scanLineY, { toValue: 1, duration: 1500, useNativeDriver: false }),
      Animated.timing(scanLineY, { toValue: 0, duration: 1500, useNativeDriver: false }),
    ])).start();
    Animated.timing(progress, { toValue: 1, duration: 3200, useNativeDriver: false }).start(() => {
      setScanning(false);
      setScanned(true);
      pulseAnim.stopAnimation();
      scanLineY.stopAnimation();
    });
  };

  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const scanTop = scanLineY.interpolate({ inputRange: [0, 1], outputRange: ['0%', '95%'] });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.cameraSimulation}>
        <View style={styles.topGradient} />
        <View style={styles.header}>
          <Text style={styles.appName}>InkaVoice</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={22} color={C.white} />
          </TouchableOpacity>
        </View>
        <Animated.View style={[styles.scanFrame, { transform: [{ scale: pulseAnim }] }]}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
          <Text style={styles.scanLabel}>{scanned ? '✓ SITIO IDENTIFICADO' : scanning ? 'ESCANEANDO...' : 'APUNTA AL SITIO'}</Text>
          {scanning && <Animated.View style={[styles.scanLine, { top: scanTop }]} />}
        </Animated.View>
        {scanning && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>🔍 Escaneando Patrimonio...</Text>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
          </View>
        )}
        {scanned && (
          <TouchableOpacity style={styles.resultPill} onPress={() => navigation.navigate('Resultado')}>
            <View style={styles.resultDot} />
            <Text style={styles.resultText}>Intihuatana · 98% — Ver detalles →</Text>
          </TouchableOpacity>
        )}
        <View style={styles.bottomGradient} />
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.sideBtn}>
          <Ionicons name="images-outline" size={26} color={C.white} />
          <Text style={styles.sideBtnLabel}>Galería</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureBtn} onPress={startScan} activeOpacity={0.8}>
          <View style={styles.captureRing}>
            <View style={[styles.captureInner, scanned && { backgroundColor: C.gold }]} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideBtn}>
          <Ionicons name="camera-reverse-outline" size={26} color={C.white} />
          <Text style={styles.sideBtnLabel}>Voltear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const FRAME = width * 0.75;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraSimulation: { flex: 1, backgroundColor: '#0A1A0C' },
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 120, backgroundColor: 'rgba(0,0,0,0.55)' },
  bottomGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, backgroundColor: 'rgba(0,0,0,0.6)' },
  header: { position: 'absolute', top: 52, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  appName: { color: C.gold, fontSize: 20, fontWeight: '800', letterSpacing: 1.5 },
  settingsBtn: { padding: 4 },
  scanFrame: { position: 'absolute', top: '28%', alignSelf: 'center', width: FRAME, height: FRAME * 0.7, justifyContent: 'center', alignItems: 'center' },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: C.gold, borderWidth: 3 },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanLabel: { color: C.gray, fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  scanLine: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: C.gold, opacity: 0.8 },
  progressContainer: { position: 'absolute', bottom: 180, left: 32, right: 32, alignItems: 'center', gap: 8 },
  progressLabel: { color: C.gold, fontSize: 13, fontWeight: '600' },
  progressTrack: { width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.gold, borderRadius: 2 },
  resultPill: { position: 'absolute', bottom: 175, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,51,45,0.9)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 30, gap: 8, borderWidth: 1, borderColor: C.gold },
  resultDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50' },
  resultText: { color: C.white, fontSize: 13, fontWeight: '600' },
  controls: { position: 'absolute', bottom: 60, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  sideBtn: { alignItems: 'center', gap: 4 },
  sideBtnLabel: { color: C.white, fontSize: 11, fontWeight: '600' },
  captureBtn: { padding: 4 },
  captureRing: { width: 76, height: 76, borderRadius: 38, borderWidth: 3, borderColor: C.white, justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.white },
});
