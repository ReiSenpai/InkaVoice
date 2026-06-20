import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function BrandHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <View style={styles.logoBox}>
          <View style={[styles.bar, styles.bar1]} />
          <View style={[styles.bar, styles.bar2]} />
          <View style={[styles.bar, styles.bar3]} />
          <View style={[styles.bar, styles.bar4]} />
          <View style={[styles.bar, styles.bar5]} />
        </View>
        <View style={styles.diamond} />
      </View>

      <Text style={styles.brandName}>InkaVoice</Text>
      <Text style={styles.tagline}>ECOS DE UNA CIVILIZACIÓN</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 24,
  },
  logoWrap: {
    position: 'relative',
    marginBottom: 16,
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  bar1: { height: 12 },
  bar2: { height: 18 },
  bar3: { height: 24 },
  bar4: { height: 16 },
  bar5: { height: 10 },
  diamond: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 12,
    height: 12,
    backgroundColor: colors.gold,
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.green,
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 3.5,
    color: colors.gray500,
    textTransform: 'uppercase',
  },
});
