import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type AuthTopBarProps = {
  actionLabel: string;
  onAction: () => void;
};

export default function AuthTopBar({ actionLabel, onAction }: AuthTopBarProps) {
  return (
    <View style={styles.row}>
      <View style={styles.brandRow}>
        <View style={styles.logoBox}>
          <View style={[styles.bar, styles.bar1]} />
          <View style={[styles.bar, styles.bar2]} />
          <View style={[styles.bar, styles.bar3]} />
        </View>
        <Text style={styles.brandName}>InkaVoice</Text>
      </View>
      <Text style={styles.action} onPress={onAction}>
        {actionLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  bar: {
    width: 2,
    borderRadius: 1,
    backgroundColor: colors.white,
  },
  bar1: { height: 8 },
  bar2: { height: 14 },
  bar3: { height: 10 },
  brandName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.green,
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.teal,
  },
});
