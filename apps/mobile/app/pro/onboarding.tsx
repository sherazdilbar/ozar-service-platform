import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { prosApi } from '@ozar/shared/apiClient';
import { ServiceCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@ozar/shared';
import { CATEGORY_GROUPS } from '@ozar/shared/categoryStructure';
import LocationSelector from '../../components/LocationSelector';

type OnboardingStep = 'welcome' | 'basic' | 'services' | 'location' | 'documents' | 'review';

export default function ProOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [loading, setLoading] = useState(false);

  // Form data
  const [businessName, setBusinessName] = useState('');
  const [bio, setBio] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ServiceCategory[]>([]);
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [lat, setLat] = useState(47.4979);
  const [lng, setLng] = useState(19.0402);

  const handleCategoryToggle = (category: ServiceCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      if (selectedCategories.length < 5) {
        setSelectedCategories([...selectedCategories, category]);
      } else {
        Alert.alert('Limit Reached', 'You can select up to 5 service categories');
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log('Submitting onboarding data...');
      const result = await prosApi.updateProfile({
        businessName: businessName.trim() || undefined,
        bio: bio.trim(),
        yearsExperience: parseInt(yearsExperience) || 0,
        categories: selectedCategories,
        locationCity: city,
        locationArea: area,
        locationLat: lat,
        locationLng: lng,
        onboardingCompleted: true,
      });
      
      console.log('Onboarding submitted successfully:', result);

      // Redirect immediately after success
      setTimeout(() => {
        console.log('Redirecting to homepage...');
        router.replace('/(tabs)');
      }, 500);

      // Also show success message
      Alert.alert(
        'Success!',
        'Your professional profile has been created. Welcome to Ozar Pro!',
      );
    } catch (error: any) {
      console.error('Onboarding submission error:', error);
      Alert.alert('Error', error.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const renderWelcome = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.welcomeIcon}>👋</Text>
      <Text style={styles.welcomeTitle}>Welcome to Ozar Pro!</Text>
      <Text style={styles.welcomeText}>
        Let's set up your professional profile. This will help customers find and book your services.
      </Text>
      <Text style={styles.welcomeSubtext}>
        Your application will be reviewed by our team before you can start receiving bookings.
      </Text>
      
      <View style={styles.benefitsList}>
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>✓</Text>
          <Text style={styles.benefitText}>Get discovered by local customers</Text>
        </View>
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>✓</Text>
          <Text style={styles.benefitText}>Manage bookings easily</Text>
        </View>
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>✓</Text>
          <Text style={styles.benefitText}>Build your reputation with reviews</Text>
        </View>
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>✓</Text>
          <Text style={styles.benefitText}>Set your own prices and schedule</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setCurrentStep('basic')}
      >
        <Text style={styles.primaryButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about your business</Text>

      <Text style={styles.label}>Business Name (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., John's Plumbing Services"
        value={businessName}
        onChangeText={setBusinessName}
      />

      <Text style={styles.label}>About You *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe your experience and what makes you great..."
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Years of Experience *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 5"
        value={yearsExperience}
        onChangeText={setYearsExperience}
        keyboardType="numeric"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setCurrentStep('welcome')}
        >
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, styles.flexButton]}
          onPress={() => {
            if (!bio.trim() || !yearsExperience) {
              Alert.alert('Required Fields', 'Please fill in all required fields');
              return;
            }
            setCurrentStep('services');
          }}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderServices = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your Services</Text>
      <Text style={styles.stepSubtitle}>Select up to 5 service categories</Text>
      <Text style={styles.selectedCount}>{selectedCategories.length}/5 selected</Text>

      <ScrollView style={styles.categoriesScroll} showsVerticalScrollIndicator={false}>
        {CATEGORY_GROUPS.map((group) => (
          <View key={group.id} style={styles.categoryGroup}>
            <Text style={styles.categoryGroupTitle}>{group.label}</Text>
            <View style={styles.categoryGrid}>
              {group.subcategories.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryCard,
                      isSelected && styles.categoryCardSelected,
                    ]}
                    onPress={() => handleCategoryToggle(category)}
                  >
                    <Text style={styles.categoryCardIcon}>{CATEGORY_ICONS[category]}</Text>
                    <Text style={styles.categoryCardLabel}>{CATEGORY_LABELS[category]}</Text>
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <Text style={styles.selectedCheck}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setCurrentStep('basic')}
        >
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, styles.flexButton]}
          onPress={() => {
            if (selectedCategories.length === 0) {
              Alert.alert('Select Services', 'Please select at least one service category');
              return;
            }
            setCurrentStep('location');
          }}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLocation = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Service Location</Text>
      <Text style={styles.stepSubtitle}>Where do you provide services?</Text>

      <LocationSelector
        city={city}
        area={area}
        onCityChange={setCity}
        onAreaChange={setArea}
        onLocationSelect={(latitude, longitude) => {
          setLat(latitude);
          setLng(longitude);
        }}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setCurrentStep('services')}
        >
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, styles.flexButton]}
          onPress={() => {
            if (!city || !area) {
              Alert.alert('Location Required', 'Please select your service location');
              return;
            }
            setCurrentStep('review');
          }}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReview = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Review & Submit</Text>
      <Text style={styles.stepSubtitle}>Please review your information</Text>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Basic Information</Text>
        {businessName && <Text style={styles.reviewItem}>Business: {businessName}</Text>}
        <Text style={styles.reviewItem}>Experience: {yearsExperience} years</Text>
        <Text style={styles.reviewItem}>Bio: {bio}</Text>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Services ({selectedCategories.length})</Text>
        <View style={styles.reviewCategories}>
          {selectedCategories.map((cat) => (
            <View key={cat} style={styles.reviewCategoryTag}>
              <Text style={styles.reviewCategoryText}>{CATEGORY_LABELS[cat]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Location</Text>
        <Text style={styles.reviewItem}>{area}, {city}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          Your application will be reviewed by our team. You'll receive a notification once approved.
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setCurrentStep('location')}
        >
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, styles.flexButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  currentStep === 'welcome' ? 0 :
                  currentStep === 'basic' ? 25 :
                  currentStep === 'services' ? 50 :
                  currentStep === 'location' ? 75 :
                  100
                }%`,
              },
            ]}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 'welcome' && renderWelcome()}
        {currentStep === 'basic' && renderBasicInfo()}
        {currentStep === 'services' && renderServices()}
        {currentStep === 'location' && renderLocation()}
        {currentStep === 'review' && renderReview()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  welcomeIcon: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
  },
  benefitsList: {
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitIcon: {
    fontSize: 20,
    color: '#3B82F6',
    marginRight: 12,
    fontWeight: '700',
  },
  benefitText: {
    fontSize: 15,
    color: '#374151',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  selectedCount: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 16,
  },
  categoriesScroll: {
    maxHeight: 400,
    marginBottom: 20,
  },
  categoryGroup: {
    marginBottom: 24,
  },
  categoryGroupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  categoryCardSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  categoryCardIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryCardLabel: {
    fontSize: 10,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheck: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reviewSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  reviewItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  reviewCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reviewCategoryTag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reviewCategoryText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  flexButton: {
    flex: 1,
  },
});
