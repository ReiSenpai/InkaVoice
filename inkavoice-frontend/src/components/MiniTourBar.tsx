import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTour } from '../context/TourContext';
import { colors } from '../theme/colors';

// Altura aproximada de la barra y separación recomendada, para que las pantallas
// reserven ese espacio arriba (mismo patrón que MINI_PLAYER_HEIGHT/MINI_PLAYER_GAP abajo)
export const MINI_TOUR_BAR_HEIGHT = 56;
export const MINI_TOUR_BAR_GAP = 10;

type Props = {
  // Nombre de la pantalla actual del stack (viene de AppNavigator, igual que en MiniAudioPlayer).
  // Se usa para ocultar la barra cuando ya estás DENTRO de la pantalla del recorrido.
  currentRouteName?: string;
  // Qué hacer al tocar la barra. En AppNavigator: () => navigationRef.navigate('RecorridoEnCurso')
  onExpand: () => void;
};

export default function MiniTourBar({ currentRouteName, onExpand }: Props) {
  const { activeTour, elapsedSeconds } = useTour();
  const insets = useSafeAreaInsets();

  // No mostrar nada si no hay recorrido, ya terminó, o ya estás en la pantalla del recorrido
  if (!activeTour || activeTour.status === 'finished') return null;
  if (currentRouteName === 'RecorridoEnCurso') return null;

  const currentStop = activeTour.stops[activeTour.currentStopIndex];
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const isPaused = activeTour.status === 'paused';

  return (
    <TouchableOpacity
      style={[styles.bar, { top: insets.top + 8 }]}
      onPress={onExpand}
      activeOpacity={0.9}
    >
      <View style={[styles.dot, isPaused && styles.dotPaused]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>
          {isPaused ? 'Recorrido en pausa' : 'Recorrido en curso'} · {activeTour.routeName}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {currentStop ? `Hacia: ${currentStop.name}` : 'Completado'} · {mins}:{secs.toString().padStart(2, '0')}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#FFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: colors.greenDark,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 8,
    zIndex: 100,
  },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4CD964' },
  dotPaused: { backgroundColor: colors.gold },
  title: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 2 },
});