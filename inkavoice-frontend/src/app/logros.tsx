import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';

// ⚠️ URL DE TU BACKEND EN RED LOCAL
const CORE_BACKEND_URL = 'http://192.168.1.36:3000';

type RankingUser = { id: string; name: string; location: string; xp: number; avatar: string };

export default function LogrosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { name, userId, photoUri } = useUser();

  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 📡 Traer Ranking Global del Backend
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await fetch(`${CORE_BACKEND_URL}/api/logros/ranking`);
        if (response.ok) {
          const data = await response.json();
          setRanking(data);
        } else {
          loadFallbackRanking();
        }
      } catch (error) {
        loadFallbackRanking();
      } finally {
        setIsLoading(false);
      }
    };
    fetchRanking();
  }, []);

  const loadFallbackRanking = () => {
    setRanking([
      { id: '101', name: 'Túpac Yupanqui', location: 'Cusco, PE', xp: 45900, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '102', name: 'Elena Valdivia', location: 'Arequipa, PE', xp: 42100, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: '103', name: 'Marco Quispe', location: 'Lima, PE', xp: 39450, avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
    ]);
  };

  const myXp = 12450; // Esto debería venir de tu UserContext o Backend

  return (
    <View style={[styles.container, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
      <View style={styles.header}>
        <TouchableOpacity hitSlop={10} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#00332D" /></TouchableOpacity>
        <Text style={styles.headerTitle}>InkaVoice</Text>
        <TouchableOpacity onPress={() => router.push('/settings')} hitSlop={10}><Ionicons name="settings-outline" size={24} color="#00332D" /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* TARJETA DE NIVEL (Verde oscuro) */}
        <View style={styles.levelCard}>
          <Text style={styles.levelLabel}>NIVEL DE EXPLORADOR</Text>
          <Text style={styles.levelTitle}>Curaca Real</Text>
          
          <View style={styles.xpRow}>
            <View style={styles.xpBadge}><Text style={styles.xpText}>{myXp.toLocaleString()} XP</Text></View>
            <View style={styles.fireBadge}><Ionicons name="flame" size={12} color="#FFF" /><Text style={styles.fireText}>14 Días</Text></View>
          </View>

          <View style={styles.nextRankBox}>
            <Text style={styles.nextRankLabel}>Próximo Rango</Text>
            <Text style={styles.nextRankTitle}>Inca Supremo</Text>
            <View style={styles.rankTrack}><View style={[styles.rankFill, { width: '85%' }]} /></View>
            <Text style={styles.rankRemaining}>850 XP restantes</Text>
          </View>
        </View>

        {/* MEDALLAS CULTURALES */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Medallas Culturales</Text>
            <Text style={styles.sectionSub}>Tu legado a través de las regiones del Perú</Text>
          </View>
          <TouchableOpacity><Text style={styles.sectionLink}>Ver todas</Text></TouchableOpacity>
        </View>

        <View style={styles.medalsGrid}>
          <View style={styles.medalCard}><View style={styles.medalIconBorder}><Ionicons name="triangle" size={32} color="#85601E" /></View><Text style={styles.medalName}>Guardián Andino</Text><Text style={styles.medalRegion}>SIERRA</Text></View>
          <View style={styles.medalCard}><View style={styles.medalIconBorder}><Ionicons name="water" size={32} color="#1E8A5F" /></View><Text style={styles.medalName}>Eco de la Costa</Text><Text style={styles.medalRegion}>COSTA</Text></View>
          <View style={styles.medalCard}><View style={styles.medalIconBorderLocked}><Ionicons name="leaf" size={32} color="#D1D5DB" /><View style={styles.lockIcon}><Ionicons name="lock-closed" size={10} color="#FFF" /></View></View><Text style={styles.medalNameLocked}>Voz de la Selva</Text><Text style={styles.medalRegionLocked}>AMAZONÍA</Text></View>
          <View style={styles.medalCard}><View style={styles.medalIconBorder}><Ionicons name="document-text" size={32} color="#111827" /></View><Text style={styles.medalName}>Escriba Real</Text><Text style={styles.medalRegion}>GLOBAL</Text></View>
        </View>

        {/* RANKING GLOBAL */}
        <View style={styles.rankingSection}>
          <View style={styles.rankingHeader}>
            <Ionicons name="podium-outline" size={24} color="#00332D" />
            <Text style={styles.sectionTitle}>Ranking Global</Text>
          </View>

          <View style={styles.rankingBox}>
            {isLoading ? <ActivityIndicator color="#C9A84C" /> : ranking.map((user, index) => (
              <View key={user.id} style={styles.rankingRow}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
                <Image source={{ uri: user.avatar }} style={styles.rankAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rankName}>{user.name}</Text>
                  <Text style={styles.rankLoc}>{user.location}</Text>
                </View>
                <Text style={styles.rankXP}>{user.xp.toLocaleString()} XP</Text>
              </View>
            ))}

            {/* Fila del usuario actual (Fija al final) */}
            <View style={styles.myRankingRow}>
              <Text style={styles.myRankNumber}>84</Text>
              <Image source={{ uri: photoUri || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' }} style={styles.myRankAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.myRankName}>Tú</Text>
                <Text style={styles.myRankRole}>Rango Curaca</Text>
              </View>
              <Text style={styles.myRankXP}>{myXp.toLocaleString()} XP</Text>
            </View>
          </View>
        </View>

        {/* DESAFÍOS SEMANALES */}
        <View style={styles.rankingHeader}>
          <Ionicons name="calendar-outline" size={24} color="#00332D" />
          <Text style={styles.sectionTitle}>Desafíos Semanales</Text>
        </View>

        <View style={styles.challengeCard}>
          <View style={styles.chalTop}>
            <View>
              <Text style={styles.chalTitle}>El Camino del Cóndor</Text>
              <Text style={styles.chalDesc}>Escucha 3 historias de la sierra profunda.</Text>
            </View>
            <View style={styles.xpReward}><Text style={styles.xpRewardText}>+500 XP</Text></View>
          </View>
          <View style={styles.chalProgressRow}>
            <View style={styles.chalTrack}><View style={[styles.chalFill, { width: '66%' }]} /></View>
            <Text style={styles.chalCount}>2/3</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#00332D' },
  scrollContent: { paddingHorizontal: 20 },

  levelCard: { backgroundColor: '#004D40', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 32, shadowColor: '#004D40', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 8 },
  levelLabel: { color: '#FCD34D', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
  levelTitle: { color: '#FFFFFF', fontSize: 36, fontWeight: '800', marginBottom: 16 },
  xpRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  xpBadge: { backgroundColor: '#FCD34D', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  xpText: { color: '#00332D', fontSize: 13, fontWeight: '800' },
  fireBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  fireText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  
  nextRankBox: { width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  nextRankLabel: { color: '#A7F3D0', fontSize: 11, fontWeight: '700', marginBottom: 4, textAlign: 'center' },
  nextRankTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  rankTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginBottom: 8 },
  rankFill: { height: '100%', backgroundColor: '#FCD34D', borderRadius: 3 },
  rankRemaining: { color: '#A7F3D0', fontSize: 10, textAlign: 'center' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#00332D' },
  sectionSub: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  sectionLink: { fontSize: 12, fontWeight: '700', color: '#00332D', textDecorationLine: 'underline' },

  medalsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 32 },
  medalCard: { width: '48%', alignItems: 'center', marginBottom: 24 },
  medalIconBorder: { width: 80, height: 80, borderRadius: 16, borderWidth: 2, borderColor: '#D1D5DB', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 10, backgroundColor: '#FFFFFF' },
  medalIconBorderLocked: { width: 80, height: 80, borderRadius: 16, borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 10, backgroundColor: '#F9FAFB' },
  lockIcon: { position: 'absolute', bottom: -6, right: -6, width: 20, height: 20, borderRadius: 10, backgroundColor: '#9CA3AF', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  medalName: { fontSize: 13, fontWeight: '800', color: '#00332D', textAlign: 'center' },
  medalNameLocked: { fontSize: 13, fontWeight: '700', color: '#9CA3AF', textAlign: 'center' },
  medalRegion: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 1, marginTop: 4 },
  medalRegionLocked: { fontSize: 10, fontWeight: '800', color: '#D1D5DB', letterSpacing: 1, marginTop: 4 },

  rankingSection: { marginBottom: 32 },
  rankingHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  rankingBox: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  rankingRow: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#FFFBEB', borderRadius: 12, marginBottom: 8 },
  rankNumber: { width: 30, fontSize: 16, fontWeight: '800', color: '#85601E', textAlign: 'center' },
  rankAvatar: { width: 40, height: 40, borderRadius: 12, marginHorizontal: 12 },
  rankName: { fontSize: 14, fontWeight: '800', color: '#00332D' },
  rankLoc: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  rankXP: { fontSize: 14, fontWeight: '800', color: '#00332D' },
  
  myRankingRow: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#00332D', borderRadius: 12, marginTop: 4 },
  myRankNumber: { width: 30, fontSize: 16, fontWeight: '800', color: '#FCD34D', textAlign: 'center' },
  myRankAvatar: { width: 40, height: 40, borderRadius: 12, marginHorizontal: 12 },
  myRankName: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  myRankRole: { fontSize: 11, color: '#A7F3D0', marginTop: 2 },
  myRankXP: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },

  challengeCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderLeftWidth: 4, borderColor: '#E5E7EB', borderLeftColor: '#FCD34D', marginBottom: 16 },
  chalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  chalTitle: { fontSize: 14, fontWeight: '800', color: '#00332D', marginBottom: 4 },
  chalDesc: { fontSize: 12, color: '#6B7280', maxWidth: '80%' },
  xpReward: { backgroundColor: '#004D40', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  xpRewardText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  chalProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chalTrack: { flex: 1, height: 6, backgroundColor: '#F3F4F6', borderRadius: 3 },
  chalFill: { height: '100%', backgroundColor: '#85601E', borderRadius: 3 },
  chalCount: { fontSize: 11, fontWeight: '800', color: '#4B5563' },
});