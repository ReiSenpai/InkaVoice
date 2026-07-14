import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTour } from '../context/TourContext';
import { colors } from '../theme/colors';

const C = {
  bg: colors.background,
  green: colors.green,
  greenDark: colors.greenDark,
  gold: colors.gold,
  muted: colors.muted,
  white: colors.white,
};

export default function RecorridoEnCursoScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { activeTour, elapsedSeconds, pauseTour, resumeTour, endTour } = useTour();

  if (!activeTour) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top + 20 }]}>
        <Ionicons name="map-outline" size={48} color={C.muted} />
        <Text style={styles.emptyText}>No hay ningún recorrido activo en este momento.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const visitedCount = activeTour.stops.filter((s) => s.visited).length;
  const total = activeTour.stops.length;
  const currentStop = activeTour.stops[activeTour.currentStopIndex];
  const isFinished = activeTour.status === 'finished';

  const region = currentStop
    ? { latitude: currentStop.latitude, longitude: currentStop.longitude, latitudeDelta: 0.5, longitudeDelta: 0.5 }
    : {
        latitude: activeTour.stops[0]?.latitude ?? -9.19,
        longitude: activeTour.stops[0]?.longitude ?? -75.0152,
        latitudeDelta: 5,
        longitudeDelta: 5,
      };

  const handleFinish = () => {
    endTour();
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-down" size={26} color={C.green} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recorrido en curso</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.mapWrap}>
        <MapView
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          region={region}
          showsUserLocation
        >
          {activeTour.stops.map((stop, i) => (
            <Marker key={stop.id} coordinate={{ latitude: stop.latitude, longitude: stop.longitude }} title={stop.name}>
              <View
                style={[
                  styles.pin,
                  stop.visited && styles.pinVisited,
                  i === activeTour.currentStopIndex && !stop.visited && styles.pinCurrent,
                ]}
              >
                <Ionicons name={stop.visited ? 'checkmark' : 'flag'} size={14} color="#FFF" />
              </View>
            </Marker>
          ))}
          {activeTour.stops.length > 1 && (
            <Polyline
              coordinates={activeTour.stops.map((s) => ({ latitude: s.latitude, longitude: s.longitude }))}
              strokeColor={C.green}
              strokeWidth={3}
            />
          )}
        </MapView>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {mins}:{secs.toString().padStart(2, '0')}
          </Text>
          <Text style={styles.statLabel}>Tiempo</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {visitedCount}/{total}
          </Text>
          <Text style={styles.statLabel}>Paradas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {isFinished ? 'Terminado' : activeTour.status === 'active' ? 'Activo' : 'Pausado'}
          </Text>
          <Text style={styles.statLabel}>Estado</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>{activeTour.routeName}</Text>
      <ScrollView style={styles.stopsList}>
        {activeTour.stops.map((stop, i) => (
          <View key={stop.id} style={styles.stopRow}>
            <View
              style={[
                styles.stopDot,
                stop.visited && styles.stopDotDone,
                i === activeTour.currentStopIndex && !stop.visited && styles.stopDotCurrent,
              ]}
            />
            <Text style={[styles.stopName, stop.visited && styles.stopNameDone]}>{stop.name}</Text>
            {stop.visited ? (
              <Ionicons name="checkmark-circle" size={18} color={C.green} />
            ) : i === activeTour.currentStopIndex ? (
              <Text style={styles.stopCurrentLabel}>Siguiente</Text>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <View style={[styles.actionsRow, { paddingBottom: insets.bottom + 14 }]}>
        {!isFinished &&
          (activeTour.status === 'active' ? (
            <TouchableOpacity style={styles.pauseBtn} onPress={pauseTour}>
              <Ionicons name="pause" size={18} color={C.green} />
              <Text style={styles.pauseBtnText}>Pausar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.pauseBtn} onPress={resumeTour}>
              <Ionicons name="play" size={18} color={C.green} />
              <Text style={styles.pauseBtnText}>Reanudar</Text>
            </TouchableOpacity>
          ))}
        <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
          <Ionicons name="flag" size={18} color="#FFF" />
          <Text style={styles.finishBtnText}>{isFinished ? 'Cerrar' : 'Finalizar Recorrido'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  center: { justifyContent: 'center', alignItems: 'center', gap: 14, paddingHorizontal: 30 },
  emptyText: { color: C.muted, fontSize: 15, textAlign: 'center' },
  backBtn: { marginTop: 10, backgroundColor: C.green, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  backBtnText: { color: '#FFF', fontWeight: '700' },

  header: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: C.greenDark },

  mapWrap: { height: 260, marginHorizontal: 18, borderRadius: 24, overflow: 'hidden' },
  map: { flex: 1 },
  pin: { width: 30, height: 30, borderRadius: 15, backgroundColor: C.muted, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  pinVisited: { backgroundColor: C.green },
  pinCurrent: { backgroundColor: C.gold, borderColor: C.gold, transform: [{ scale: 1.1 }] },

  statsRow: { flexDirection: 'row', marginHorizontal: 18, marginTop: 16, backgroundColor: '#FFF', borderRadius: 18, paddingVertical: 14 },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '800', color: C.greenDark },
  statLabel: { fontSize: 11, color: C.muted, marginTop: 2 },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: C.greenDark, marginHorizontal: 18, marginTop: 20, marginBottom: 8 },
  stopsList: { flex: 1, marginHorizontal: 18 },
  stopRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  stopDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#DDD' },
  stopDotDone: { backgroundColor: C.green },
  stopDotCurrent: { backgroundColor: C.gold },
  stopName: { flex: 1, fontSize: 14, color: C.greenDark, fontWeight: '600' },
  stopNameDone: { color: C.muted, textDecorationLine: 'line-through' },
  stopCurrentLabel: { fontSize: 11, fontWeight: '800', color: C.gold },

  actionsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 18, paddingTop: 10 },
  pauseBtn: { flex: 1, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: 26, borderWidth: 1.5, borderColor: C.green },
  pauseBtnText: { color: C.green, fontWeight: '800' },
  finishBtn: { flex: 1.4, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: 26, backgroundColor: C.greenDark },
  finishBtnText: { color: '#FFF', fontWeight: '800' },
});