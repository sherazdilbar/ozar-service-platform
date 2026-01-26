import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const ONBOARDING_KEY = '@ozar_onboarding_seen';

const onboardingData = [
  {
    id: 1,
    emoji: '🔍',
    title: 'Find Professionals',
    description: 'Discover skilled professionals near you for any service you need',
    color: ['#00BCD4', '#0097A7'],
  },
  {
    id: 2,
    emoji: '💬',
    title: 'Chat & Book',
    description: 'Connect directly with pros, discuss your needs, and book instantly',
    color: ['#FF6B35', '#FF8C42'],
  },
  {
    id: 3,
    emoji: '⭐',
    title: 'Get It Done',
    description: 'Enjoy quality service from verified professionals you can trust',
    color: ['#10B981', '#059669'],
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkOnboardingSeen();
  }, []);

  useEffect(() => {
    // Fade animation when slide changes
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentSlide]);

  const checkOnboardingSeen = async () => {
    try {
      const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (seen === 'true') {
        // User has seen onboarding, skip to login
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
    }
  };

  const markOnboardingSeen = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      console.error('Error saving onboarding:', error);
    }
  };

  const slide = onboardingData[currentSlide];

  const handleNext = () => {
    if (currentSlide < onboardingData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      markOnboardingSeen();
      router.push('/auth/signup');
    }
  };

  const handleSkip = () => {
    markOnboardingSeen();
    router.push('/auth/login');
  };

  const handleDotPress = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Gradient Background */}
      <LinearGradient
        colors={slide.color}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative Circles */}
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
        <View style={[styles.circle, styles.circle4]} />
      </LinearGradient>

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F0F9FF']}
            style={styles.logo}
          >
            <Text style={styles.logoText}>O</Text>
          </LinearGradient>
          <Text style={styles.brandName}>Ozar</Text>
        </View>

        {/* Emoji Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.emojiCircle}>
            <Text style={styles.emoji}>{slide.emoji}</Text>
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDotPress(index)}
              style={[
                styles.dot,
                index === currentSlide && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F0F9FF']}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {currentSlide === onboardingData.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              <Text style={styles.nextButtonArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          {currentSlide === onboardingData.length - 1 && (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleSkip}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Already have an account?</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Navigation Hint */}
      {currentSlide < onboardingData.length - 1 && (
        <View style={styles.swipeHint}>
          <Text style={styles.swipeHintText}>Tap "Next" to continue →</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00BCD4',
    width: '100%',
    height: '100%',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    top: 150,
    left: -50,
  },
  circle3: {
    width: 150,
    height: 150,
    bottom: 200,
    right: -30,
  },
  circle4: {
    width: 100,
    height: 100,
    bottom: 100,
    left: 50,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 50,
    justifyContent: 'space-between',
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00BCD4',
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  emojiCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  emoji: {
    fontSize: 80,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    width: 24,
    backgroundColor: 'white',
  },
  buttonContainer: {
    gap: 16,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonGradient: {
    height: 58,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: '#00BCD4',
    fontSize: 18,
    fontWeight: '700',
  },
  nextButtonArrow: {
    color: '#00BCD4',
    fontSize: 24,
    fontWeight: 'bold',
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  swipeHint: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  swipeHintText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
});
