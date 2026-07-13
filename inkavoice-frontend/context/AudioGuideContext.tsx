import React, { createContext, useContext, useState, useMemo } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

// ============================================================
// TODO (backend/IA de tu compañero): esta URL de prueba se reemplaza
// por la real que devuelva el backend según sitio/idioma.
// ============================================================
const PLACEHOLDER_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export type AudioGuideMeta = {
  title: string;
  region: string;
  photoUri?: string;
  nombre?: string;
};

type AudioGuideContextType = {
  meta: AudioGuideMeta | null;
  isActive: boolean; // hay una audioguía cargada (aunque esté en pausa)
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loadGuide: (meta: AudioGuideMeta) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  skip: (seconds: number) => void;
  stopAndClear: () => void;
};

const AudioGuideContext = createContext<AudioGuideContextType | null>(null);

export function AudioGuideProvider({ children }: { children: React.ReactNode }) {
  const [meta, setMeta] = useState<AudioGuideMeta | null>(null);

  // El player se crea una sola vez a nivel global y no se destruye
  // al navegar entre pantallas, por eso el audio sigue sonando.
  const player = useAudioPlayer(PLACEHOLDER_AUDIO_URL);
  const status = useAudioPlayerStatus(player);

  const loadGuide = (newMeta: AudioGuideMeta) => {
    setMeta(newMeta);
    // TODO: si cada sitio/idioma tiene su propio audio, aquí habría que
    // hacer player.replace(nuevaUrl) antes de reproducir.
    player.play();
  };

  const play = () => player.play();
  const pause = () => player.pause();
  const togglePlay = () => (status.playing ? player.pause() : player.play());
  const skip = (seconds: number) => {
    const target = Math.max(0, Math.min(status.duration || 0, (status.currentTime || 0) + seconds));
    player.seekTo(target);
  };
  const stopAndClear = () => {
    player.pause();
    player.seekTo(0);
    setMeta(null);
  };

  const value = useMemo<AudioGuideContextType>(() => ({
    meta,
    isActive: !!meta,
    isPlaying: status.playing,
    currentTime: status.currentTime || 0,
    duration: status.duration || 0,
    loadGuide,
    play,
    pause,
    togglePlay,
    skip,
    stopAndClear,
  }), [meta, status.playing, status.currentTime, status.duration]);

  return <AudioGuideContext.Provider value={value}>{children}</AudioGuideContext.Provider>;
}

export function useAudioGuide() {
  const ctx = useContext(AudioGuideContext);
  if (!ctx) throw new Error('useAudioGuide debe usarse dentro de <AudioGuideProvider>');
  return ctx;
}