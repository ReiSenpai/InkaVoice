import { useEffect, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../navigation/types';

type Region = 'COSTA' | 'SIERRA' | 'SELVA';

const REGIONS: Region[] = ['COSTA', 'SIERRA', 'SELVA'];

const BAR_HEIGHTS = [14, 22, 30, 20, 12];

function WaveBar({ index }: { index: number }) {
  const height = useSharedValue(BAR_HEIGHTS[index]);

  useEffect(() => {
    height.value = withDelay(
      index * 120,
      withRepeat(
        withSequence(
          withTiming(BAR_HEIGHTS[index] + 10, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(BAR_HEIGHTS[index], { duration: 500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );
  }, [height, index]);

  const barStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return <Animated.View style={[styles.waveBar, barStyle]} />;
}

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedRegion, setSelectedRegion] = useState<Region>('SIERRA');

  const bgScale = useSharedValue(1.06);
  const topLine = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.7);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(24);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(16);
  const regionsOpacity = useSharedValue(0);
  const regionsY = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);
  const buttonY = useSharedValue(28);

  useEffect(() => {
    bgScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.06, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    topLine.value = withTiming(1, { duration: 600 });
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 700 }));
    logoScale.value = withDelay(200, withSpring(1, { damping: 14, stiffness: 120 }));
    titleOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    titleY.value = withDelay(500, withSpring(0, { damping: 16, stiffness: 140 }));
    taglineOpacity.value = withDelay(750, withTiming(1, { duration: 600 }));
    taglineY.value = withDelay(750, withSpring(0, { damping: 16, stiffness: 140 }));
    regionsOpacity.value = withDelay(1000, withTiming(1, { duration: 600 }));
    regionsY.value = withDelay(1000, withSpring(0, { damping: 16, stiffness: 130 }));
    buttonOpacity.value = withDelay(1250, withTiming(1, { duration: 600 }));
    buttonY.value = withDelay(1250, withSpring(0, { damping: 14, stiffness: 120 }));
  }, [
    bgScale,
    buttonOpacity,
    buttonY,
    logoOpacity,
    logoScale,
    regionsOpacity,
    regionsY,
    taglineOpacity,
    taglineY,
    titleOpacity,
    titleY,
    topLine,
  ]);

  const bgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bgScale.value }],
  }));

  const topLineStyle = useAnimatedStyle(() => ({
    opacity: topLine.value,
    transform: [{ scaleX: topLine.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));

  const regionsStyle = useAnimatedStyle(() => ({
    opacity: regionsOpacity.value,
    transform: [{ translateY: regionsY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonY.value }],
  }));

  const handleStart = () => {
    navigation.replace('Welcome');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Animated.View style={[styles.bgWrap, bgStyle]}>
        <ImageBackground
          source={require('../assets/images/machu-picchu.jpg')}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
        </ImageBackground>
      </Animated.View>

      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        <Animated.View style={[styles.topAccent, topLineStyle]} />

        <View style={styles.centerBlock}>
          <Animated.View style={[styles.logoCard, logoStyle]}>
            <View style={styles.waveRow}>
              {BAR_HEIGHTS.map((_, index) => (
                <WaveBar key={index} index={index} />
              ))}
            </View>
          </Animated.View>

          <Animated.View style={titleStyle}>
            <Text style={styles.brand}>
              <Text style={styles.brandInka}>Inka</Text>
              <Text style={styles.brandVoice}>Voice</Text>
            </Text>
          </Animated.View>

          <Animated.Text style={[styles.tagline, taglineStyle]}>
            Explora los tesoros del Perú
          </Animated.Text>
        </View>

        <View style={styles.bottomBlock}>
          <Animated.View style={[styles.regionsRow, regionsStyle]}>
            {REGIONS.map((region) => {
              const active = selectedRegion === region;
              return (
                <Pressable
                  key={region}
                  style={[styles.regionPill, active && styles.regionPillActive]}
                  onPress={() => setSelectedRegion(region)}
                >
                  <Text style={[styles.regionText, active && styles.regionTextActive]}>
                    {region}
                  </Text>
                </Pressable>
              );
            })}
          </Animated.View>

          <Animated.View style={buttonStyle}>
            <Pressable
              style={({ pressed }) => [styles.startBtn, pressed && styles.pressed]}
              onPress={handleStart}
            >
              <Text style={styles.startBtnText}>Comenzar</Text>
              <Text style={styles.startBtnArrow}>→</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.greenDark,
  },
  bgWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 53, 40, 0.45)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingBottom: 28,
  },
  topAccent: {
    alignSelf: 'center',
    width: 48,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.badgeYellow,
    marginTop: 8,
  },
  centerBlock: {
    alignItems: 'center',
    paddingTop: 40,
  },
  logoCard: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 36,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: colors.badgeYellow,
  },
  brand: {
    fontSize: 42,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  brandInka: {
    color: colors.white,
  },
  brandVoice: {
    color: colors.badgeYellow,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.badgeYellow,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  bottomBlock: {
    gap: 22,
    paddingBottom: 8,
  },
  regionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  regionPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  regionPillActive: {
    borderColor: colors.badgeYellow,
    backgroundColor: 'rgba(232, 197, 71, 0.15)',
  },
  regionText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.85)',
  },
  regionTextActive: {
    color: colors.badgeYellow,
  },
  startBtn: {
    minHeight: 54,
    borderRadius: 28,
    backgroundColor: colors.badgeYellow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.greenDark,
    letterSpacing: 0.5,
  },
  startBtnArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.greenDark,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
