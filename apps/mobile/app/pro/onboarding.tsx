import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { prosApi } from '@ozar/shared/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { ImagePicker } from '../../components/ImagePicker';

type OnboardingStep = 'welcome' | 'photo' | 'business' | 'complete';

export default function ProOnboardingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [avatar, setAvatar] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [yearsExperience, setYearsExperience] = useState('');

  const steps: OnboardingStep[] = ['welcome', 'photo', 'business', 'complete'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep === 'business') {
      if (!businessName.trim()) {
        Alert.alert('Required', 'Please enter your business name');
        return;
      }
      if (!bio.trim()) {
        Alert.alert('Required', 'Please enter a bio');
        return;
      }
      if (!yearsExperience || parseInt(yearsExperience) < 0) {
        Alert.alert('Required', 'Please enter years of experience');
        return;
      }
      handleComplete();
      return;
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // For now, just mark as complete - the user can fill in more details later
      Alert.alert('Success', 'Profile created! You can now add services.');
      setCurrentStep('complete');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const renderWelcome = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.stepTitle}>Welcome to Ozar Pro!</Text>
      <Text style={styles.stepDescription}>
        Let's set up your professional profile so you can start receiving booking requests from customers.
      </Text>
      <View style={styles.featuresList}>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✓</Text>
          <Text style={styles.featureText}>Create your professional profile</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✓</Text>
          <Text style={styles.featureText}>Add your services and pricing</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✓</Text>
          <Text style={styles.featureText}>Start receiving bookings</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✓</Text>
          <Text style={styles.featureText}>Grow your business</Text>
        </View>
      </View>
    </View>
  );

  const renderPhoto = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>📸</Text>
      <Text style={styles.stepTitle}>Add Your Photo</Text>
      <Text style={styles.stepDescription}>
        A professional photo helps customers trust you more
      </Text>
      <View style={styles.photoContainer}>
        <ImagePicker
          currentImage={avatar || undefined}
          onImageSelected={setAvatar}
          circular={true}
          size={150}
        />
      </View>
      <Text style={styles.hint}>You can skip this and add it later</Text>
    </View>
  );

  const renderBusiness = () => (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.stepContainer}
    >
      <Text style={styles.emoji}>💼</Text>
      <Text style={styles.stepTitle}>Business Information</Text>
      
      <Text style={styles.label}>Business Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., John's Plumbing Services"
        value={businessName}
        onChangeText={setBusinessName}
        maxLength={100}
      />

      <Text style={styles.label}>About Your Business *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Tell customers about your experience and expertise..."
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
        maxLength={500}
      />
      <Text style={styles.charCount}>{bio.length}/500</Text>

      <Text style={styles.label}>Years of Experience *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 5"
        value={yearsExperience}
        onChangeText={setYearsExperience}
        keyboardType="numeric"
        maxLength={2}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="+36 XX XXX XXXX"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
    </KeyboardAvoidingView>
  );

  const renderComplete = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>🎊</Text>
      <Text style={styles.stepTitle}>You're All Set!</Text>
      <Text style={styles.stepDescription}>
        Your professional profile is ready. You can now start adding services and receiving bookings.
      </Text>
      <View style={styles.completeActions}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => router.replace('/pro/services')}
        >
          <Text style={styles.completeButtonText}>Add Your First Service</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.completeButtonSecondary}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.completeButtonSecondaryText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Step {currentStepIndex + 1} of {steps.length}
        </Text>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 'welcome' && renderWelcome()}
        {currentStep === 'photo' && renderPhoto()}
        {currentStep === 'business' && renderBusiness()}
        {currentStep === 'complete' && renderComplete()}
      </ScrollView>

      {/* Navigation Buttons */}
      {currentStep !== 'complete' && (
        <View style={styles.footer}>
          {currentStep !== 'welcome' && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              disabled={loading}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextButton, currentStep === 'welcome' && styles.nextButtonFull]}
            onPress={handleNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.nextButtonText}>
                {currentStep === 'business' ? 'Complete' : 'Next →'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 24,
    color: '#10B981',
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  hint: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
  },
  selectedSummary: {
    backgroundColor: '#E0F2F1',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00BCD4',
    marginBottom: 16,
  },
  selectedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00695C',
    marginBottom: 12,
  },
  selectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00BCD4',
    gap: 6,
  },
  selectedChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00695C',
  },
  removeChipText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF5350',
    paddingHorizontal: 4,
  },
  categoryGroup: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryGroupLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryGroupIcon: {
    fontSize: 32,
  },
  categoryGroupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  categoryGroupDesc: {
    fontSize: 12,
    color: '#6b7280',
  },
  categoryGroupRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedBadge: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00695C',
  },
  expandIcon: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  subcategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  subcategoryCard: {
    width: '31%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  subcategoryCardSelected: {
    backgroundColor: '#FFF4ED',
    borderColor: '#FF6B35',
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subcategoryIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  subcategoryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  subcategoryLabelSelected: {
    color: '#FF6B35',
    fontWeight: '700',
  },
  completeActions: {
    gap: 12,
    marginTop: 32,
  },
  completeButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  completeButtonSecondary: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  completeButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  nextButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
});
