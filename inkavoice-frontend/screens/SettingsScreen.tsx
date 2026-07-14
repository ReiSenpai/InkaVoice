import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

type SettingItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
};

const ITEMS: SettingItem[] = [
  { id: 'sos', icon: 'warning', iconBg: '#FDE8E8', iconColor: '#D64545', title: 'Emergencia SOS', subtitle: 'Asistencia inmediata y contactos de emergencia' },
  { id: 'idioma', icon: 'language', iconBg: '#E3F6EC', iconColor: '#1E8A5F', title: 'Idioma y Voz', subtitle: 'Español, Narración: Quechua-Accented' },
  { id: 'accesibilidad', icon: 'accessibility', iconBg: '#FEF6DC', iconColor: '#C9A227', title: 'Accesibilidad', subtitle: 'Tamaño de texto, Alto contraste' },
  { id: 'descargas', icon: 'download-outline', iconBg: '#EDEDED', iconColor: '#555555', title: 'Gestión de Descargas', subtitle: '1.2 GB utilizados · Solo por Wi-Fi' },
];

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = useState(false);

  const handleItemPress = (item: SettingItem) => {
    if (item.id === 'sos') {
      navigation.navigate('Emergencia');
      return;
    }
    Alert.alert(item.title, item.subtitle);
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] }),
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.green} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajustes</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.eyebrow}>CONFIGURACIÓN AVANZADA</Text>
        <Text style={styles.intro}>
          Personaliza tu experiencia de InkaVoice para explorar el legado del Perú a tu ritmo.
        </Text>

        <View style={styles.card}>
          {ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.row, index < ITEMS.length - 1 && styles.rowBorder]}
              onPress={() => handleItemPress(item)}
            >
              <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={20} color={item.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
            </TouchableOpacity>
          ))}

          <View style={[styles.row, styles.rowBorder]}>
            <View style={[styles.iconWrap, { backgroundColor: '#EFEFEF' }]}>
              <Ionicons name="moon" size={20} color="#555" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Modo Oscuro</Text>
              <Text style={styles.rowSubtitle}>Optimizar para ambientes nocturnos</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={(value) => {
                setDarkMode(value);
                Alert.alert('Modo Oscuro', value ? 'Activado (vista previa, aún no aplicado a toda la app).' : 'Desactivado.');
              }}
              trackColor={{ false: colors.gray200, true: colors.green }}
              thumbColor={colors.white}
            />
          </View>

          <TouchableOpacity style={styles.row} onPress={handleLogout}>
            <View style={[styles.iconWrap, { backgroundColor: '#FDE8E8' }]}>
              <Ionicons name="log-out-outline" size={20} color="#D64545" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: '#D64545' }]}>Cerrar Sesión</Text>
              <Text style={styles.rowSubtitle}>Conectado como Visitante Cusco</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Ionicons name="leaf-outline" size={40} color={colors.gray400} />
          <Text style={styles.footerVersion}>INKAVOICE V2.4.0</Text>
          <Text style={styles.footerTagline}>Hecho con respeto por el legado Peruano</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 16,
  },
  headerTitle: { fontSize: 17, fontWeight: '800', color: colors.green },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, alignItems: 'center' },
  eyebrow: { fontSize: 11, fontWeight: '700', color: colors.gold, letterSpacing: 1.5, marginBottom: 8, textAlign: 'center' },
  intro: { fontSize: 14, color: colors.gray600, textAlign: 'center', lineHeight: 21, marginBottom: 24, paddingHorizontal: 8 },
  card: { width: '100%', backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.gray100, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  iconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 15, fontWeight: '700', color: '#222' },
  rowSubtitle: { fontSize: 12, color: colors.gray500, marginTop: 2 },
  footer: { alignItems: 'center', marginTop: 32, gap: 6 },
  footerVersion: { fontSize: 11, fontWeight: '700', color: colors.gray400, letterSpacing: 1, marginTop: 8 },
  footerTagline: { fontSize: 11, color: colors.gray400 },
});