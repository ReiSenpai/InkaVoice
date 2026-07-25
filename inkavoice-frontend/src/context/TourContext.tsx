import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';

export type TourStop = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  visited?: boolean;
};

export type TourStatus = 'active' | 'paused' | 'finished';

export type ActiveTour = {
  id: string;
  routeName: string;
  region?: string;
  stops: TourStop[];
  currentStopIndex: number;
  startedAt: number;
  pausedAccumMs: number; // tiempo acumulado antes de la pausa actual
  status: TourStatus;
};

type StartTourParams = {
  routeName: string;
  region?: string;
  stops: TourStop[];
};

type TourContextType = {
  activeTour: ActiveTour | null;
  isActive: boolean;
  elapsedSeconds: number;
  startTour: (params: StartTourParams) => void;
  endTour: () => void;
  pauseTour: () => void;
  resumeTour: () => void;
};

const TourContext = createContext<TourContextType | undefined>(undefined);

// Distancia proxima para considerar que "llegaste" a una parada
const PROXIMITY_THRESHOLD_METERS = 100;

function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function TourProvider({ children }: { children: ReactNode }) {
  const [activeTour, setActiveTour] = useState<ActiveTour | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  // Cronómetro: se actualiza cada segundo mientras el recorrido está activo
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (activeTour && activeTour.status === 'active') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - activeTour.startedAt + activeTour.pausedAccumMs) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTour?.status, activeTour?.startedAt, activeTour?.id]);

  // GPS: mientras el recorrido esté activo, vigila la posición y avanza paradas
  useEffect(() => {
    let cancelled = false;

    async function startWatching() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' || cancelled) return;

      watchRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 5000, distanceInterval: 15 },
        (pos) => {
          setActiveTour((prev) => {
            if (!prev || prev.status !== 'active') return prev;
            const stop = prev.stops[prev.currentStopIndex];
            if (!stop) return prev;
            const dist = distanceMeters(
              pos.coords.latitude,
              pos.coords.longitude,
              stop.latitude,
              stop.longitude
            );
            if (dist <= PROXIMITY_THRESHOLD_METERS && !stop.visited) {
              const updatedStops = prev.stops.map((s, i) =>
                i === prev.currentStopIndex ? { ...s, visited: true } : s
              );
              const nextIndex = prev.currentStopIndex + 1;
              if (nextIndex >= updatedStops.length) {
                return { ...prev, stops: updatedStops, status: 'finished' };
              }
              return { ...prev, stops: updatedStops, currentStopIndex: nextIndex };
            }
            return prev;
          });
        }
      );
    }

    if (activeTour && activeTour.status === 'active') {
      startWatching();
    } else if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }

    return () => {
      cancelled = true;
      if (watchRef.current) {
        watchRef.current.remove();
        watchRef.current = null;
      }
    };
  }, [activeTour?.status, activeTour?.id]);

  const startTour = ({ routeName, region, stops }: StartTourParams) => {
    if (!stops.length) return;
    setActiveTour({
      id: String(Date.now()),
      routeName,
      region,
      stops: stops.map((s) => ({ ...s, visited: false })),
      currentStopIndex: 0,
      startedAt: Date.now(),
      pausedAccumMs: 0,
      status: 'active',
    });
    setElapsedSeconds(0);
  };

  const endTour = () => {
    setActiveTour(null);
    setElapsedSeconds(0);
  };

  const pauseTour = () => {
    setActiveTour((prev) => {
      if (!prev || prev.status !== 'active') return prev;
      const accum = prev.pausedAccumMs + (Date.now() - prev.startedAt);
      return { ...prev, status: 'paused', pausedAccumMs: accum };
    });
  };

  const resumeTour = () => {
    setActiveTour((prev) => {
      if (!prev || prev.status !== 'paused') return prev;
      return { ...prev, status: 'active', startedAt: Date.now() };
    });
  };

  return (
    <TourContext.Provider
      value={{
        activeTour,
        isActive: !!activeTour && activeTour.status !== 'finished',
        elapsedSeconds,
        startTour,
        endTour,
        pauseTour,
        resumeTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour debe usarse dentro de un TourProvider');
  return ctx;
}