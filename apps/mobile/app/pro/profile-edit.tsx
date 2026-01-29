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
} from 'react-native';
import { useRouter } from 'expo-router';
import { prosApi } from '@ozar/shared/apiClient';
import { ServiceCategory, CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_GROUPS } from '@ozar/shared';
import { ImagePicker } from '../../components/ImagePicker';
import { MultiImagePicker } from '../../components/MultiImagePicker';
import { useAuth } from '../../contexts/AuthContext';

export default function ProProfileEditScreen() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [locationCity, setLocationCity] = useState('Budapest');
  const [locationArea, setLocationArea] = useState('');
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await prosApi.getMyProfile();
      if (profile) {
        setBusinessName(profile.businessName || '');
        setBio(profile.bio || '');
        setPhone(profile.user?.phone || '');
        setSelectedCategories(profile.categories || []);
        setYearsExperience(profile.yearsExperience?.toString() || '');
        setAvatar(profile.user?.avatar || null);
        setPortfolioImages(profile.portfolioImages || []);
        setLocationCity(profile.locationCity || 'Budapest');
        setLocationArea(profile.locationArea || '');
      }
    } catch (error: any) {
      console.error('Failed to load profile:', error);
      // If profile doesn't exist yet, that's okay - user can create it
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        console.log('No profile found, user can create one');
      } else {
        Alert.alert('Error', 'Failed to load profile. You can still create a new one.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      if (selectedCategories.length >= 5) {
        Alert.alert('Limit Reached', 'You can select up to 5 categories');
        return;
      }
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = async () => {
    if (!businessName.trim()) {
      Alert.alert('Required', 'Please enter your business name');
      return;
    }
    if (!bio.trim()) {
      Alert.alert('Required', 'Please enter your bio');
      return;
    }
    if (selectedCategories.length === 0) {
      Alert.alert('Required', 'Please select at least one category');
      return;
    }
    if (!yearsExperience || parseInt(yearsExperience) < 0) {
      Alert.alert('Required', 'Please enter valid years of experience');
      return;
    }
    if (!locationArea.trim()) {
      Alert.alert('Required', 'Please enter your area/district');
      return;
    }

    setSubmitting(true);
    try {
      await prosApi.updateProfile({
        businessName: businessName.trim(),
        bio: bio.trim(),
        categories: selectedCategories,
        yearsExperience: parseInt(yearsExperience),
        avatar: avatar || undefined,
        locationCity,
        locationArea: locationArea.trim(),
      });

      // Refresh user data to update avatar in context
      await refreshUser();

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Picture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Picture</Text>
          <View style={styles.avatarContainer}>
            <ImagePicker
              currentImage={avatar || undefined}
              onImageSelected={setAvatar}
              circular={true}
            />
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <Text style={styles.label}>Business Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., John's Plumbing Services"
            value={businessName}
            onChangeText={setBusinessName}
            maxLength={100}
          />

          <Text style={styles.label}>Bio *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell customers about yourself and your services..."
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={6}
            maxLength={1000}
          />
          <Text style={styles.charCount}>{bio.length}/1000</Text>

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+36 XX XXX XXXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={false}
          />
          <Text style={styles.hint}>Contact support to change phone number</Text>

          <Text style={styles.label}>Years of Experience *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5"
            value={yearsExperience}
            onChangeText={setYearsExperience}
            keyboardType="numeric"
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Categories *</Text>
          <Text style={styles.sectionSubtitle}>
            Select up to 5 categories ({selectedCategories.length}/5)
          </Text>
          
          {/* Selected Categories Summary */}
          {selectedCategories.length > 0 && (
            <View style={styles.selectedSummary}>
              <Text style={styles.selectedSummaryTitle}>✓ Your Selected Services</Text>
              <View style={styles.selectedChipsContainer}>
                {selectedCategories.map((category) => (
                  <View key={category} style={styles.selectedChip}>
                    <Text style={styles.selectedChipText}>
                      {CATEGORY_ICONS[category as ServiceCategory]} {CATEGORY_LABELS[category as ServiceCategory]}
                    </Text>
                    <TouchableOpacity onPress={() => toggleCategory(category)}>
                      <Text style={styles.removeChipText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* Category Groups */}
          {CATEGORY_GROUPS.map((group) => {
            const selectedInGroup = group.subcategories.filter(cat => 
              selectedCategories.includes(cat)
            ).length;
            const isExpanded = expandedGroup === group.id;
            
            return (
              <View key={group.id} style={styles.categoryGroup}>
                <TouchableOpacity 
                  style={styles.categoryGroupHeader}
                  onPress={() => setExpandedGroup(isExpanded ? null : group.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryGroupHeaderLeft}>
                    <Text style={styles.categoryGroupIcon}>{group.icon}</Text>
                    <View style={styles.categoryGroupHeaderText}>
                      <Text style={styles.categoryGroupTitle}>{group.label}</Text>
                      <Text style={styles.categoryGroupDesc}>
                        {group.subcategories.length} services
                      </Text>
                    </View>
                  </View>
                  <View style={styles.categoryGroupHeaderRight}>
                    {selectedInGroup > 0 && (
                      <View style={styles.selectedBadge}>
                        <Text style={styles.selectedBadgeText}>{selectedInGroup}</Text>
                      </View>
                    )}
                    <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
                  </View>
                </TouchableOpacity>
                
                {isExpanded && (
                  <View style={styles.subcategoriesGrid}>
                    {group.subcategories.map((category) => {
                      const isSelected = selectedCategories.includes(category);
                      return (
                        <TouchableOpacity
                          key={category}
                          style={[styles.subcategoryCard, isSelected && styles.subcategoryCardSelected]}
                          onPress={() => toggleCategory(category)}
                        >
                          {isSelected && (
                            <View style={styles.checkmark}>
                              <Text style={styles.checkmarkText}>✓</Text>
                            </View>
                          )}
                          <Text style={styles.subcategoryIcon}>{CATEGORY_ICONS[category as ServiceCategory]}</Text>
                          <Text style={[styles.subcategoryLabel, isSelected && styles.subcategoryLabelSelected]}>
                            {CATEGORY_LABELS[category as ServiceCategory]}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Budapest"
            value={locationCity}
            onChangeText={setLocationCity}
          />

          <Text style={styles.label}>Area/District *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., District V, Belváros"
            value={locationArea}
            onChangeText={setLocationArea}
          />
        </View>

        {/* Portfolio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio Images</Text>
          <Text style={styles.sectionSubtitle}>
            Showcase your best work (up to 10 images)
          </Text>
          <MultiImagePicker
            images={portfolioImages}
            onImagesChange={setPortfolioImages}
            maxImages={10}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
  },
  backBtnText: {
    fontSize: 28,
    color: '#FF6B35',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    fontStyle: 'italic',
  },
  selectedSummary: {
    backgroundColor: '#E0F2F1',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00BCD4',
    marginBottom: 16,
  },
  selectedSummaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00695C',
    marginBottom: 12,
  },
  selectedChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: 12,
    paddingRight: 8,
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
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  categoryGroupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryGroupHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expandIcon: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  categoryGroupIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  categoryGroupHeaderText: {
    flex: 1,
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
  subcategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
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
    zIndex: 1,
  },
  checkmarkText: {
    color: 'white',
    fontSize: 11,
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
  bottomBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
