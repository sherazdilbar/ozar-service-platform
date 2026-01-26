import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import LocationSelector from '../../components/LocationSelector';

const { width } = Dimensions.get('window');

export default function SignupScreen() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'CUSTOMER' | 'PRO'>('CUSTOMER');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    area: '',
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const validateStep1 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      Alert.alert('Required', 'Please enter your full name');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }
    if (!formData.phone.match(/^\+?[\d\s-]{10,}$/)) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.city.trim()) {
      Alert.alert('Required', 'Please select your city');
      return false;
    }
    if (!formData.area.trim()) {
      Alert.alert('Required', 'Please select your area/neighborhood');
      return false;
    }
    if (!location || location.lat === 0 || location.lng === 0) {
      Alert.alert('Invalid Location', 'Please select a valid location from the dropdown');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (formData.password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSignup = async () => {
    if (!validateStep3()) return;

    setLoading(true);
    try {
      console.log('Starting registration with data:', {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role,
        location: {
          city: formData.city,
          area: formData.area,
          lat: 47.4979,
          lng: 19.0402,
        },
      });
      
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role,
        location: location ? {
          city: formData.city,
          area: formData.area,
          lat: location.lat,
          lng: location.lng,
        } : undefined,
      });
      
      console.log('Registration successful, redirecting...');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Signup Failed', error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    if (step === 1) return 'Personal Info';
    if (step === 2) return 'Your Location';
    return 'Set Password';
  };

  const getStepSubtitle = () => {
    if (step === 1) return 'Tell us about yourself';
    if (step === 2) return 'Where are you located?';
    return 'Secure your account';
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Gradient Background */}
      <LinearGradient
        colors={role === 'PRO' ? ['#FF6B35', '#FF8C42', '#FFA552'] : ['#00BCD4', '#0097A7', '#006064']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative Circles */}
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          bounces={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#FFFFFF', '#F0F9FF']}
              style={styles.logo}
            >
              <Text style={[styles.logoText, role === 'PRO' && styles.logoTextPro]}>O</Text>
            </LinearGradient>
            <Text style={styles.brandName}>Join Ozar</Text>
            <Text style={styles.subtitle}>Create your account 🚀</Text>
          </View>

          {/* Card Container */}
          <View style={styles.card}>
            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
              </View>
              <Text style={styles.progressText}>Step {step} of 3</Text>
            </View>

            {/* Role Selection */}
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleButton, role === 'CUSTOMER' && styles.roleButtonActive]}
                onPress={() => setRole('CUSTOMER')}
                activeOpacity={0.7}
              >
                <Text style={styles.roleIcon}>👤</Text>
                <Text style={[styles.roleText, role === 'CUSTOMER' && styles.roleTextActive]}>
                  Customer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, role === 'PRO' && styles.roleButtonActivePro]}
                onPress={() => setRole('PRO')}
                activeOpacity={0.7}
              >
                <Text style={styles.roleIcon}>🔧</Text>
                <Text style={[styles.roleText, role === 'PRO' && styles.roleTextActivePro]}>
                  Professional
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.cardTitle}>{getStepTitle()}</Text>
            <Text style={styles.cardSubtitle}>{getStepSubtitle()}</Text>

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <View style={styles.form}>
                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 6 }]}>
                    <Text style={styles.label}>First Name</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="John"
                        placeholderTextColor="#9CA3AF"
                        value={formData.firstName}
                        onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                        editable={!loading}
                      />
                    </View>
                  </View>
                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 6 }]}>
                    <Text style={styles.label}>Last Name</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Doe"
                        placeholderTextColor="#9CA3AF"
                        value={formData.lastName}
                        onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                        editable={!loading}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>📧</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="your@email.com"
                      placeholderTextColor="#9CA3AF"
                      value={formData.email}
                      onChangeText={(text) => setFormData({ ...formData, email: text })}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!loading}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>📱</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="+36 20 123 4567"
                      placeholderTextColor="#9CA3AF"
                      value={formData.phone}
                      onChangeText={(text) => setFormData({ ...formData, phone: text })}
                      keyboardType="phone-pad"
                      editable={!loading}
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <View style={styles.form}>
                <LocationSelector
                  city={formData.city}
                  area={formData.area}
                  onCityChange={(city) => setFormData({ ...formData, city })}
                  onAreaChange={(area) => setFormData({ ...formData, area })}
                  onLocationSelect={(lat, lng) => setLocation({ lat, lng })}
                  disabled={loading}
                />

                <View style={styles.infoBox}>
                  <Text style={styles.infoIcon}>💡</Text>
                  <Text style={styles.infoText}>
                    We'll use this to connect you with nearby {role === 'PRO' ? 'customers' : 'professionals'}
                  </Text>
                </View>
              </View>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="At least 6 characters"
                      placeholderTextColor="#9CA3AF"
                      value={formData.password}
                      onChangeText={(text) => setFormData({ ...formData, password: text })}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      editable={!loading}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Re-enter your password"
                      placeholderTextColor="#9CA3AF"
                      value={formData.confirmPassword}
                      onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      editable={!loading}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeButton}
                    >
                      <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              {step > 1 && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setStep(step - 1)}
                  disabled={loading}
                >
                  <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
              )}

              {step < 3 ? (
                <TouchableOpacity
                  style={[styles.nextButton, step === 1 && styles.nextButtonFull]}
                  onPress={handleNext}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={role === 'PRO' ? ['#FF6B35', '#FF8C42'] : ['#00BCD4', '#0097A7']}
                    style={styles.nextButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.nextButtonText}>Continue</Text>
                    <Text style={styles.nextButtonArrow}>→</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.nextButton, loading && styles.nextButtonDisabled]}
                  onPress={handleSignup}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={role === 'PRO' ? ['#FF6B35', '#FF8C42'] : ['#00BCD4', '#0097A7']}
                    style={styles.nextButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <>
                        <Text style={styles.nextButtonText}>Create Account</Text>
                        <Text style={styles.nextButtonArrow}>✓</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={[styles.loginLink, role === 'PRO' && styles.loginLinkPro]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    height: '45%',
    width: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    top: 80,
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    top: 180,
    right: 50,
  },
  keyboardView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 50,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
    width: '100%',
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
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00BCD4',
  },
  logoTextPro: {
    color: '#FF6B35',
  },
  brandName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00BCD4',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: '#00BCD4',
    backgroundColor: '#E0F7FA',
  },
  roleButtonActivePro: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF3E0',
  },
  roleIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  roleTextActive: {
    color: '#00BCD4',
  },
  roleTextActivePro: {
    color: '#FF6B35',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  form: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    width: '100%',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginTop: 8,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#0369A1',
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  backButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  nextButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonGradient: {
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
  nextButtonArrow: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: '700',
  },
  loginLinkPro: {
    color: '#FF6B35',
  },
});
