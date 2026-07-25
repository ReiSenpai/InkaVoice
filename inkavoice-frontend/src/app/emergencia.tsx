import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert, ImageBackground, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

type Contact = {
  id: string;
  name: string;
  number: string;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  textColor: string;
  btnColor: string;
};

const CONTACTS: Contact[] = [
  { id: 'policia', name: 'Policía de Turismo', number: '105 / (01) 424 2053', icon: 'call', bg: '#D1E6E1', textColor: '#84BCA9', btnColor: '#00332D' },
  { id: 'iperu', name: 'Iperú (Asistencia)', number: '(01) 574 8000', icon: 'headset', bg: '#FDF3D9', textColor: '#C9A84C', btnColor: '#85601E' },
  { id: 'samu', name: 'Samu (Médico)', number: '106', icon: 'medical', bg: '#EEEEEE', textColor: '#6B7280', btnColor: '#111827' },
];

const PHRASES = [
  { es: 'Necesito ayuda médica urgente.', qu: "Hampiqta mask'ashani usqhaylla." },
  { es: '¿Dónde está la comisaría más cercana?', qu: 'Maypitaq kachun aswan qayllan comisaría?' },
  { es: 'Me perdí, necesito ayuda.', qu: "Chinkarurani, yanapayta munani." },
];

export default function EmergenciaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [address, setAddress] = useState<string>('Buscando tu ubicación...');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(true);

  // Animación del botón SOS
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const C = {
    greenDark: '#00332D',
    gold: '#C9A84C',
    white: '#FFFFFF',
    bg: '#FAF8F5',
    muted: '#6B7280',
    border: '#F3F4F6',
    red: '#D64545',
  };

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
          const parts = [r.name || r.street, r.city || r.subregion, r.country].filter(Boolean);
          setAddress(parts.join(', ') || 'Ubicación encontrada');
        } else {
          setAddress('Ubicación encontrada');
        }
      } catch (e) {
        setAddress('No se pudo obtener tu ubicación. Mostrando simulación.');
        // Fallback de diseño
        setAddress('Plaza de Armas de Cusco, Perú');
        setCoords({ latitude: -13.517, longitude: -71.978 });
      } finally {
        setLocating(false);
      }
    })();
  }, []);

  const handleCall = (contact: Contact) => {
    const telUrl = `tel:${contact.number.split('/')[0].replace(/[^0-9+]/g, '')}`; // Toma el primer número
    Linking.canOpenURL(telUrl)
      .then(supported => {
        if (supported) Linking.openURL(telUrl);
        else Alert.alert('No disponible', `Tu dispositivo no puede realizar llamadas a ${contact.number}.`);
      })
      .catch(() => Alert.alert('Error', 'No se pudo iniciar la llamada.'));
  };

  const handleSOS = () => {
    // Animación de "pulsación"
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start(() => {
      Alert.alert(
        'Alertar a las autoridades',
        '¿Quieres llamar ahora a la Policía de Turismo (105) y compartir tu ubicación?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Llamar ahora', style: 'destructive', onPress: () => handleCall(CONTACTS[0]) },
        ],
      );
    });
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
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity hitSlop={10} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={C.greenDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>InkaVoice Emergency</Text>
        <TouchableOpacity hitSlop={10} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={24} color={C.greenDark} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* BOTÓN SOS CENTRAL */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity style={styles.sosMainBtn} activeOpacity={1} onPress={handleSOS}>
            <Ionicons name="location-outline" size={40} color={C.white} style={{ marginBottom: 4 }} />
            <Text style={styles.sosMainTitle}>SOS</Text>
            <Text style={styles.sosMainSubtitle}>AYUDA INMEDIATA</Text>
            <View style={styles.sosBadge}>
              <Ionicons name="wifi" size={12} color={C.red} />
              <Text style={styles.sosBadgeText}>Modo Satelital/SMS listo</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.heroText}>Pulsa el botón para alertar a las autoridades locales.</Text>

        {/* TARJETA DE UBICACIÓN */}
        <View style={styles.locationCard}>
          <View style={{ flex: 1 }}>
            <View style={styles.locHeaderRow}>
              <Ionicons name="location-outline" size={16} color={C.gold} />
              <Text style={styles.locLabel}>Tu ubicación actual</Text>
            </View>
            <Text style={styles.locAddress}>{locating ? 'Buscando...' : address}</Text>
            {coords && (
              <Text style={styles.locCoords}>Coordenadas: {coords.latitude.toFixed(3)}, {coords.longitude.toFixed(3)}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShareLocation}>
            <Ionicons name="share-social" size={20} color={C.white} />
          </TouchableOpacity>
        </View>

        {/* CONTACTOS DIRECTOS */}
        <View style={styles.sectionHeader}>
          <Ionicons name="people-outline" size={20} color={C.greenDark} />
          <Text style={styles.sectionTitle}>Contactos Directos</Text>
        </View>

        <View style={styles.contactsList}>
          {CONTACTS.map(contact => (
            <View key={contact.id} style={[styles.contactCard, { backgroundColor: contact.bg }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={[styles.contactNumber, { color: contact.textColor }]}>{contact.number}</Text>
              </View>
              <TouchableOpacity style={[styles.contactCallBtn, { backgroundColor: contact.btnColor }]} onPress={() => handleCall(contact)}>
                <Ionicons name={contact.icon} size={20} color={C.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* FRASES DE AUXILIO */}
        <View style={styles.sectionHeader}>
          <Ionicons name="language" size={20} color={C.greenDark} />
          <Text style={styles.sectionTitle}>Frases de Auxilio</Text>
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineBadgeText}>DISPONIBLE OFFLINE</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.phrasesScroll}>
          {PHRASES.map((phrase, idx) => (
            <View key={idx} style={styles.phraseCard}>
              <Text style={styles.phraseLangTitle}>ESPAÑOL</Text>
              <Text style={styles.phraseMainText}>"{phrase.es}"</Text>
              <View style={styles.phraseDivider} />
              <Text style={styles.phraseLangTitle}>QUECHUA</Text>
              <Text style={styles.phraseSubText}>"{phrase.qu}"</Text>
            </View>
          ))}
        </ScrollView>

        {/* BANNER INFERIOR */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800' }}
          style={styles.banner}
          imageStyle={{ borderRadius: 16 }}
        >
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Estamos contigo</Text>
            <Text style={styles.bannerSubtitle}>La Red de Protección al Turista opera 24/7 en todas las regiones del Perú.</Text>
          </View>
        </ImageBackground>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* FOOTER TAB BAR FALSO (Solo visual para mantener coherencia del mockup) */}
      <View style={styles.fakeTabBar}>
        <View style={styles.tabItem}><Ionicons name="compass-outline" size={22} color={C.muted} /><Text style={styles.tabText}>Discover</Text></View>
        <View style={styles.tabItem}><Ionicons name="map-outline" size={22} color={C.muted} /><Text style={styles.tabText}>Routes</Text></View>
        <View style={styles.tabItem}><Ionicons name="camera-outline" size={22} color={C.muted} /><Text style={styles.tabText}>AR View</Text></View>
        <View style={styles.tabItem}><Ionicons name="time-outline" size={22} color={C.muted} /><Text style={styles.tabText}>History</Text></View>
        <View style={styles.tabActivePill}><Ionicons name="warning" size={20} color={C.greenDark} /><Text style={styles.tabActiveText}>SOS</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 24 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#00332D' },
  scrollContent: { paddingHorizontal: 20 },

  sosMainBtn: { width: 180, height: 180, backgroundColor: '#D64545', borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#D64545', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  sosMainTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: 1, marginBottom: 2 },
  sosMainSubtitle: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  sosBadge: { position: 'absolute', bottom: -12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FDE8E8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
  sosBadgeText: { color: '#D64545', fontSize: 9, fontWeight: '800' },
  heroText: { textAlign: 'center', fontSize: 18, color: '#4B5563', lineHeight: 26, marginBottom: 32, paddingHorizontal: 10 },

  locationCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 32 },
  locHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  locLabel: { fontSize: 12, fontWeight: '800', color: '#85601E' },
  locAddress: { fontSize: 16, fontWeight: '800', color: '#00332D', marginBottom: 4 },
  locCoords: { fontSize: 11, color: '#6B7280' },
  shareBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#00332D', justifyContent: 'center', alignItems: 'center' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#00332D', flex: 1 },
  
  contactsList: { gap: 12, marginBottom: 32 },
  contactCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16 },
  contactName: { fontSize: 13, color: '#4B5563', marginBottom: 4 },
  contactNumber: { fontSize: 18, fontWeight: '800' },
  contactCallBtn: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

  offlineBadge: { backgroundColor: '#00332D', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  offlineBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },

  phrasesScroll: { gap: 16, paddingRight: 20, paddingBottom: 10 },
  phraseCard: { width: 220, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginRight: 16 },
  phraseLangTitle: { fontSize: 10, fontWeight: '800', color: '#85601E', letterSpacing: 1, marginBottom: 8 },
  phraseMainText: { fontSize: 18, color: '#00332D', fontStyle: 'italic', marginBottom: 16, lineHeight: 24 },
  phraseDivider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 16 },
  phraseSubText: { fontSize: 14, color: '#4B5563', fontStyle: 'italic', lineHeight: 20 },

  banner: { height: 160, borderRadius: 16, overflow: 'hidden', justifyContent: 'flex-end', marginTop: 16 },
  bannerOverlay: { backgroundColor: 'rgba(0,51,45,0.6)', padding: 20 },
  bannerTitle: { color: '#FFF', fontSize: 20, fontWeight: '800', marginBottom: 6 },
  bannerSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 18 },

  fakeTabBar: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingVertical: 10, paddingHorizontal: 10, justifyContent: 'space-between', paddingBottom: 20 },
  tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  tabText: { fontSize: 9, fontWeight: '700', color: '#6B7280', marginTop: 4 },
  tabActivePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FCD34D', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  tabActiveText: { fontSize: 11, fontWeight: '800', color: '#00332D' },
});