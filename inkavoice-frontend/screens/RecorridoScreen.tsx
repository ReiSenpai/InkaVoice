import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { getInitials } from '../utils/initials';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const C = { bg: colors.background, green: colors.green, gold: colors.gold, text: colors.greenDark, muted: colors.muted, white: colors.white, border: colors.border };

const ROUTES = [
  { id: 1, title: 'Dunas de Ica y Oasis', subtitle: 'Huacachina y Paracas', region: 'Costa', duration: '2 Días', level: 'Fácil', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee' },
  { id: 2, title: 'Valle Sagrado', subtitle: 'Cusco', region: 'Sierra', duration: '4 Días', level: 'Media', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1' },
  { id: 3, title: 'Reserva Amazónica', subtitle: 'Madre de Dios', region: 'Selva', duration: '3 Días', level: 'Media', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e' },
];

export default function RecorridoScreen() {
  const navigation = useNavigation<any>();
  const { photoUri, name } = useUser();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('Todas');
  const [search, setSearch] = useState('');

  const routes = useMemo(() => ROUTES.filter(r => {
    const regionOk = filter === 'Todas' ? true : r.region === filter;
    const textOk = r.title.toLowerCase().includes(search.toLowerCase());
    return regionOk && textOk;
  }), [filter, search]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color={C.green} />
          </TouchableOpacity>
          <Text style={styles.logo}>InkaVoice</Text>
          {photoUri ? (<Image source={{ uri: photoUri }} style={styles.avatar} />) : (<View style={styles.avatarInitialsWrap}><Text style={styles.avatarInitialsText}>{getInitials(name)}</Text></View>)}
        </View>

        <Text style={styles.title}>{t('routes_title')}</Text>

        <View style={styles.search}>
          <Ionicons name="search" size={20} color="#777" />
          <TextInput value={search} onChangeText={setSearch} placeholder={t("routes_search_placeholder")} placeholderTextColor="#999" style={styles.input} />
        </View>

        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options" size={18} color="#FFF" />
          <Text style={styles.filterText}>{t('routes_filters')}</Text>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingTop: 18 }}>
          {[
            { id: 'Todas', labelKey: 'filter_all' },
            { id: 'Costa', labelKey: 'category_coast' },
            { id: 'Sierra', labelKey: 'category_highlands' },
            { id: 'Selva', labelKey: 'category_jungle' },
          ].map(v => (
            <TouchableOpacity key={v.id} style={[styles.tab, filter === v.id && styles.tabActive]} onPress={() => setFilter(v.id)}>
              <Text style={[styles.tabText, filter === v.id && { color: C.green }]}>{t(v.labelKey)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.section}>{t('routes_nearby')}</Text>
          <TouchableOpacity><Text style={styles.link}>{t('routes_view_all')}</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {routes.map(r => (
            <TouchableOpacity key={r.id} style={styles.card} onPress={() => navigation.navigate('Asistente')}>
              <Image source={{ uri: r.image }} style={styles.cardImage} />
              <View style={styles.badge}><Text>{r.region}</Text></View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{r.title}</Text>
                <Text style={styles.cardSub}>{r.subtitle}</Text>
                <Text style={styles.meta}>{r.duration} · {r.level}</Text>
                <TouchableOpacity style={styles.detailBtn}><Text>{t('routes_view_detail')}</Text></TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.section, { marginTop: 30 }]}>{t('routes_new_experiences')}</Text>
        <View style={styles.experience}>
          <Text style={styles.expTitle}>{t('routes_ai_explore')}</Text>
          <Text style={styles.expSub}>{t('routes_personalized')}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Asistente')}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: 28, fontWeight: '800', color: C.green },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarInitialsWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  avatarInitialsText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  title: { padding: 18, fontSize: 50, fontWeight: '800', color: C.text },
  search: { marginHorizontal: 18, height: 54, backgroundColor: '#FFF', borderRadius: 27, paddingHorizontal: 18, alignItems: 'center', flexDirection: 'row' },
  input: { flex: 1, marginLeft: 10 },
  filterBtn: { marginLeft: 18, marginTop: 18, width: 120, height: 48, borderRadius: 24, backgroundColor: C.green, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 },
  filterText: { color: '#FFF' },
  tab: { borderWidth: 1, borderColor: '#CCC', paddingHorizontal: 18, height: 42, borderRadius: 22, justifyContent: 'center' },
  tabActive: { borderColor: C.green },
  tabText: { color: '#666' },
  sectionHeader: { padding: 18, flexDirection: 'row', justifyContent: 'space-between' },
  section: { fontSize: 36, fontWeight: '800', color: C.text },
  link: { color: C.green },
  card: { width: 300, marginLeft: 18, backgroundColor: '#FFF', borderRadius: 30, overflow: 'hidden' },
  cardImage: { width: '100%', height: 260 },
  badge: { position: 'absolute', top: 18, left: 18, backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  cardBody: { padding: 18 },
  cardTitle: { fontSize: 26, fontWeight: '700' },
  cardSub: { color: C.muted },
  meta: { marginTop: 10 },
  detailBtn: { marginTop: 20, height: 48, borderRadius: 24, backgroundColor: '#F4F4F4', justifyContent: 'center', alignItems: 'center' },
  experience: { margin: 18, backgroundColor: '#FFF', padding: 24, borderRadius: 26, marginBottom: 120 },
  expTitle: { fontSize: 24, fontWeight: '700' },
  expSub: { marginTop: 8, color: C.muted },
  fab: { position: 'absolute', right: 22, bottom: 40, width: 72, height: 72, borderRadius: 36, backgroundColor: C.green, justifyContent: 'center', alignItems: 'center' },
});
