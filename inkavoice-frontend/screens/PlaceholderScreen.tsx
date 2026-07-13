import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type PlaceholderScreenProps = {
  title: string;
  subtitle?: string;
};

export default function PlaceholderScreen({ title, subtitle }: PlaceholderScreenProps) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.green,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
  },
});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}


