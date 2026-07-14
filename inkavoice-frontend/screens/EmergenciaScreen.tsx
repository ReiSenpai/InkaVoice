import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert, ImageBackground, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { colors } from '../theme/colors';

const C = {
  green: colors.green,
  greenDark: colors.greenDark,
  gold: colors.gold,
  white: colors.white,
  bg: colors.background,
  muted: colors.muted,
  border: colors.border,
  red: '#D64545',
  redDark: '#B93838',
};

type Contact = {
  id: string;
  name: string;
  number: string;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  color: string;
};

const CONTACTS: Contact[] = [
  { id: 'policia', name: 'Policía de Turismo', number: '105', icon: 'call', bg: '#E3F6EC', color: '#1E8A5F' },
  { id: 'iperu', name: 'Iperú (Asistencia)', number: '(01) 574 8000', icon: 'help-buoy', bg: '#FEF6DC', color: '#C9A227' },
  { id: 'samu', name: 'Samu (Médico)', number: '106', icon: 'medkit', bg: '#FDE8E8', color: C.red },
];

const PHRASES = [
  { es: 'Necesito ayuda médica urgente.', en: 'I need urgent medical help.', qu: "Hampiqta mask'ashani usqhaylla." },
  { es: '¿Dónde está la comisaría más cercana?', en: 'Where is the nearest police station?', qu: 'Maypitaq kachun aswan qayllan comisaría?' },
  { es: 'Me perdí, necesito ayuda.', en: "I'm lost, I need help.", qu: "Chinkarurani, yanapayta munani." },
];

export default function EmergenciaScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [address, setAddress] = useState<string>('Buscando tu ubicación...');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setAddress('Ubicación no disponible (permiso denegado)');
          setLocating(false);
          return;
        }
        const position = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });

        const results = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (results.length > 0) {
          const r = results[0];
          const parts = [r.street, r.city || r.subregion, r.country].filter(Boolean);
          setAddress(parts.join(', ') || 'Ubicación encontrada');
        } else {
          setAddress('Ubicación encontrada');
        }
      } catch (e) {
        setAddress('No se pudo obtener tu ubicación');
      } finally {
        setLocating(false);
      }
    })();
  }, []);

  const handleCall = (contact: Contact) => {
    const telUrl = `tel:${contact.number.replace(/[^0-9+]/g, '')}`;
    Linking.canOpenURL(telUrl)
      .then(supported => {
        if (supported) {
          Linking.openURL(telUrl);
        } else {
          Alert.alert('No disponible', `Tu dispositivo no puede realizar llamadas a ${contact.number}.`);
        }
      })
      .catch(() => Alert.alert('Error', 'No se pudo iniciar la llamada.'));
  };

  const handleSOS = () => {
    Alert.alert(
      'Alertar a las autoridades',
      '¿Quieres llamar ahora a la Policía de Turismo (105)?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Llamar ahora', style: 'destructive', onPress: () => handleCall(CONTACTS[0]) },
      ],
    );
  };

  const handleShareLocation = () => {
    if (!coords) {
      Alert.alert('Ubicación no disponible', 'Todavía no tenemos tu ubicación exacta.');
      return;
    }
    const mapsUrl = Platform.select({
      ios: `http://maps.apple.com/?ll=${coords.latitude},${coords.longitude}`,
      android: `geo:${coords.latitude},${coords.longitude}?q=${coords.latitude},${coords.longitude}`,
      default: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
    });
    if (mapsUrl) Linking.openURL(mapsUrl);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={C.green} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>InkaVoice Emergency</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={22} color={C.green} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Tarjeta SOS */}
        <TouchableOpacity style={styles.sosCard} activeOpacity={0.9} onPress={handleSOS}>
          <View style={styles.sosIconWrap}>
            <Ionicons name="wifi" size={30} color={C.white} />
          </View>
          <Text style={styles.sosTitle}>SOS AYUDA INMEDIATA</Text>
          <View style={styles.sosBadge}>
            <Text style={styles.sosBadgeText}>Modo Sin/Con Internet</Text>
          </View>
          <Text style={styles.sosSubtitle}>Pulsa el botón para alertar a las autoridades locales.</Text>
        </TouchableOpacity>

        {/* Ubicación */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="location" size={16} color={C.gold} />
            <Text style={styles.cardLabel}>Tu ubicación actual</Text>
          </View>
          <View style={styles.locationRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.locationText}>{locating ? 'Buscando tu ubicación...' : address}</Text>
              {coords && (
                <Text style={styles.locationCoords}>
                  Coordenadas: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
                </Text>
              )}
            </View>
            <TouchableOpacity style={styles.shareLocationBtn} onPress={handleShareLocation}>
              <Ionicons name="navigate" size={18} color={C.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contactos directos */}
        <Text style={styles.sectionTitle}>Contactos Directos</Text>
        <View style={styles.contactsList}>
          {CONTACTS.map(contact => (
            <TouchableOpacity key={contact.id} style={[styles.contactRow, { backgroundColor: contact.bg }]} onPress={() => handleCall(contact)}>
              <View>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={[styles.contactNumber, { color: contact.color }]}>{contact.number}</Text>
              </View>
              <View style={[styles.contactCallBtn, { backgroundColor: contact.color }]}>
                <Ionicons name={contact.icon} size={18} color={C.white} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Frases de auxilio */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="chatbubble-ellipses" size={16} color={C.gold} />
            <Text style={styles.cardLabel}>Frases de Auxilio</Text>
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineBadgeText}>DISPONIBLE OFFLINE</Text>
            </View>
          </View>
          {PHRASES.map((phrase, idx) => (
            <View key={idx} style={[styles.phraseBlock, idx < PHRASES.length - 1 && styles.phraseBlockBorder]}>
              <View style={styles.phraseLine}>
                <Text style={styles.phraseLangLabel}>ESPAÑOL</Text>
                <Text style={styles.phraseText}>"{phrase.es}"</Text>
              </View>
              <View style={styles.phraseLine}>
                <Text style={styles.phraseLangLabel}>ENGLISH</Text>
                <Text style={styles.phraseText}>"{phrase.en}"</Text>
              </View>
              <View style={styles.phraseLine}>
                <Text style={styles.phraseLangLabel}>QUECHUA</Text>
                <Text style={styles.phraseText}>"{phrase.qu}"</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Banner inferior */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800' }}
          style={styles.banner}
          imageStyle={{ borderRadius: 18 }}
        >
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Estamos contigo</Text>
            <Text style={styles.bannerSubtitle}>La Red de Protección al Turista opera 24/7 en todas las regiones del Perú.</Text>
          </View>
        </ImageBackground>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: C.green },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },

  sosCard: { backgroundColor: C.red, borderRadius: 22, padding: 24, alignItems: 'center', marginBottom: 18 },
  sosIconWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  sosTitle: { color: C.white, fontSize: 18, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
  sosBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 10 },
  sosBadgeText: { color: C.white, fontSize: 11, fontWeight: '700' },
  sosSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, textAlign: 'center', lineHeight: 18 },

  card: { backgroundColor: C.white, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 18 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  cardLabel: { fontSize: 13, fontWeight: '800', color: C.greenDark, flex: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  locationText: { fontSize: 14, fontWeight: '700', color: '#222' },
  locationCoords: { fontSize: 11, color: C.muted, marginTop: 4 },
  shareLocationBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },

  sectionTitle: { fontSize: 15, fontWeight: '800', color: C.greenDark, marginBottom: 10 },
  contactsList: { gap: 10, marginBottom: 18 },
  contactRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, padding: 14 },
  contactName: { fontSize: 13, fontWeight: '700', color: '#333' },
  contactNumber: { fontSize: 16, fontWeight: '800', marginTop: 2 },
  contactCallBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  offlineBadge: { backgroundColor: '#E3F6EC', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  offlineBadgeText: { fontSize: 9, fontWeight: '800', color: '#1E8A5F' },
  phraseBlock: { paddingVertical: 10, gap: 6 },
  phraseBlockBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  phraseLine: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  phraseLangLabel: { fontSize: 10, fontWeight: '800', color: C.gold, letterSpacing: 0.5, width: 62 },
  phraseText: { fontSize: 13, color: '#333', lineHeight: 18, flex: 1 },

  banner: { height: 140, borderRadius: 18, overflow: 'hidden', justifyContent: 'flex-end' },
  bannerOverlay: { backgroundColor: 'rgba(0,0,0,0.45)', padding: 16 },
  bannerTitle: { color: C.white, fontSize: 18, fontWeight: '800', marginBottom: 4 },
  bannerSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, lineHeight: 16 },
});