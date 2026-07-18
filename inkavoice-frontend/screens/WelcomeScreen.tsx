import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLanguage } from '../context/LanguageContext';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';

type Slide = {
  id: string;
  titleKey: string;
  subtitleKey: string;
  cardTitleKey: string;
  cardDescKey: string;
  visual: 'camera' | 'voice' | 'routes';
};

const SLIDES: Slide[] = [
  {
    id: '1',
    titleKey: 'welcome_slide1_title',
      subtitleKey: 'welcome_slide1_subtitle',
    cardTitleKey: 'welcome_slide1_card_title',
      cardDescKey: 'welcome_slide1_card_desc',
    visual: 'camera',
  },
  {
    id: '2',
    titleKey: 'welcome_slide2_title',
      subtitleKey: 'welcome_slide2_subtitle',
    cardTitleKey: 'welcome_slide2_card_title',
      cardDescKey: 'welcome_slide2_card_desc',
    visual: 'voice',
  },
  {
    id: '3',
    titleKey: 'welcome_slide3_title',
      subtitleKey: 'welcome_slide3_subtitle',
    cardTitleKey: 'welcome_slide3_card_title',
      cardDescKey: 'welcome_slide3_card_desc',
    visual: 'routes',
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function SlideVisual({ type, styles }: { type: Slide['visual']; styles: any }) {
  if (type === 'camera') {

    return (
      <View style={styles.visualDark}>
        <View style={styles.phoneFrame}>
          <View style={styles.phoneScreen}>
            <Text style={styles.huacoIcon}>🏺</Text>
            <View style={styles.cameraOverlay}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </View>
        </View>
        <View style={styles.glowRing} />
      </View>
    );
  }

  if (type === 'voice') {
    return (
      <View style={styles.visualDark}>
        <View style={styles.voiceCircle}>
          <Text style={styles.voiceIcon}>🎧</Text>
        </View>
        <View style={styles.waveRow}>
          <View style={[styles.wave, styles.wave1]} />
          <View style={[styles.wave, styles.wave2]} />
          <View style={[styles.wave, styles.wave3]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.visualDark}>
      <View style={styles.routeMap}>
        <Text style={styles.routeIcon}>🗺</Text>
        <View style={styles.routeDot} />
        <View style={[styles.routeDot, styles.routeDot2]} />
        <View style={[styles.routeDot, styles.routeDot3]} />
      </View>
    </View>
  );
}

export default function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const isLast = activeIndex === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigation.replace('Login');
      return;
    }
    const next = activeIndex + 1;
    listRef.current?.scrollToIndex({ index: next, animated: true });
    setActiveIndex(next);
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const Container = Platform.OS === 'web' ? View : SafeAreaView;
  const safeAreaProps =
    Platform.OS !== 'web' ? { edges: ['top', 'bottom'] as const } : {};

    const { colors } = useTheme();
    const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: { flex: 1 },
  bgDiamond: {
    position: 'absolute',
    top: 48,
    alignSelf: 'center',
    width: 120,
    height: 120,
    backgroundColor: colors.beige,
    transform: [{ rotate: '45deg' }],
    opacity: 0.6,
  },
  bgCircleOuter: {
    position: 'absolute',
    bottom: -80,
    alignSelf: 'center',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: colors.gray200,
    opacity: 0.5,
  },
  bgCircleInner: {
    position: 'absolute',
    bottom: -40,
    alignSelf: 'center',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: colors.gray200,
    opacity: 0.35,
  },
  slide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.green,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.gray500,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.gray100,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
  },
  visualDark: {
    height: 180,
    borderRadius: 14,
    backgroundColor: '#1a2e28',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  phoneFrame: {
    width: 100,
    height: 140,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#2d4a42',
    backgroundColor: '#0d1f1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneScreen: {
    width: 84,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#152820',
    alignItems: 'center',
    justifyContent: 'center',
  },
  huacoIcon: { fontSize: 36 },
  cameraOverlay: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: { fontSize: 20 },
  glowRing: {
    position: 'absolute',
    bottom: 20,
    width: 120,
    height: 40,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  voiceCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  voiceIcon: { fontSize: 36 },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wave: {
    width: 4,
    borderRadius: 2,
    backgroundColor: colors.goldLight,
  },
  wave1: { height: 16 },
  wave2: { height: 28 },
  wave3: { height: 20 },
  routeMap: {
    width: 140,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeIcon: { fontSize: 48, opacity: 0.9 },
  routeDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.badgeYellow,
  },
  routeDot2: { top: 24, right: 20 },
  routeDot3: { bottom: 16, left: 24 },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.green,
    marginBottom: 10,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 21,
    color: colors.gray500,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray200,
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.gray500,
  },
  nextBtn: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: colors.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  nextBtnArrow: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
  return (
    <Container style={styles.safe} {...safeAreaProps}>
      <View style={styles.bgDiamond} />
      <View style={styles.bgCircleOuter} />
      <View style={styles.bgCircleInner} />

      <FlatList
        ref={listRef}
        style={styles.list}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.header}>
              <Text style={styles.title}>{t(item.titleKey)}</Text>
              <Text style={styles.subtitle}>{t(item.subtitleKey)}</Text>
            </View>

            <View style={styles.card}>
              <SlideVisual type={item.visual} styles={styles} />
              <Text style={styles.cardTitle}>{t(item.cardTitleKey)}</Text>
              <Text style={styles.cardDesc}>{t(item.cardDescKey)}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.nextBtn, pressed && styles.pressed]}
          onPress={handleNext}
        >
          <Text style={styles.nextBtnText}>{isLast ? t('welcome_start') : t('welcome_next')}</Text>
          <Text style={styles.nextBtnArrow}>→</Text>
        </Pressable>
      </View>
    </Container>
  );
}


