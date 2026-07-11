import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudioGuide } from '../context/AudioGuideContext';
import { colors } from '../theme/colors';

const C = { green: colors.green, gold: colors.gold, white: colors.white, muted: colors.muted };

// Pantalla donde ya se ve el reproductor completo: ahí no lo duplicamos.
const HIDDEN_ON_ROUTES = ['Audioguia'];

// Pantallas con controles propios pegados abajo (cámara, mapa): en vez de
// ocultarlo, lo mostramos arriba (debajo de su header) para no taparlos.
const TOP_POSITION_ROUTES = ['ARView', 'Routes'];

type Props = {
  currentRouteName?: string;
  onExpand: (params: { nombre?: string; region: string; photoUri?: string }) => void;
};

export default function MiniAudioPlayer({ currentRouteName, onExpand }: Props) {
  const insets = useSafeAreaInsets();
  const { meta, isActive, isPlaying, currentTime, duration, togglePlay, stopAndClear } = useAudioGuide();

  if (!isActive || !meta) return null;
  if (currentRouteName && HIDDEN_ON_ROUTES.includes(currentRouteName)) return null;

  const usesTopPosition = !!currentRouteName && TOP_POSITION_ROUTES.includes(currentRouteName);

  // Misma fórmula de altura que usa BottomTabBar (56 + paddingBottom seguro) + margen
  const tabBarHeight = 56 + Math.max(insets.bottom, 8);
  const bottomOffset = tabBarHeight + 8;
  // Debajo del header propio de Cámara/Mapa (appName + tabs de región, etc.)
  const topOffset = insets.top + 108;

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <TouchableOpacity
      style={[styles.container, usesTopPosition ? { top: topOffset } : { bottom: bottomOffset }]}
      activeOpacity={0.9}
      onPress={() => onExpand({ nombre: meta.nombre, region: meta.region, photoUri: meta.photoUri })}
    >
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>
      <View style={styles.row}>
        {meta.photoUri ? (
          <Image source={{ uri: meta.photoUri }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]}>
            <Ionicons name="musical-notes" size={16} color={C.white} />
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{meta.title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{meta.region}</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={togglePlay} hitSlop={8}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color={C.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={stopAndClear} hitSlop={8}>
          <Ionicons name="close" size={20} color={C.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 12, right: 12, backgroundColor: C.green, borderRadius: 14, overflow: 'hidden', elevation: 10, zIndex: 50 },
  progressTrack: { height: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
  progressFill: { height: '100%', backgroundColor: C.gold },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10, gap: 10 },
  thumb: { width: 34, height: 34, borderRadius: 8 },
  thumbPlaceholder: { backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  title: { color: C.white, fontSize: 13, fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 11 },
  iconBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});