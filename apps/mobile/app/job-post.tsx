import { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { jobsApi } from '@ozar/shared/apiClient';
import { CATEGORY_LABELS, CATEGORY_ICONS, ServiceCategory } from '@ozar/shared';
import { useAuth } from '../contexts/AuthContext';
import MultiImagePicker from '../components/MultiImagePicker';

const URGENCY_OPTIONS = [
  { value: 'ASAP', label: 'ASAP', icon: '🔥' },
  { value: 'THIS_WEEK', label: 'This Week', icon: '📅' },
  { value: 'FLEXIBLE', label: 'Flexible', icon: '⏰' },
];

export default function PostJobScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [urgency, setUrgency] = useState<'ASAP' | 'THIS_WEEK' | 'FLEXIBLE'>('FLEXIBLE');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!title || title.length < 10) {
      Alert.alert('Error', 'Title must be at least 10 characters');
      return;
    }

    if (!description || description.length < 50) {
      Alert.alert('Error', 'Description must be at least 50 characters');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    if (budgetMin && budgetMax && parseInt(budgetMin) >= parseInt(budgetMax)) {
      Alert.alert('Error', 'Minimum budget must be less than maximum budget');
      return;
    }

    setLoading(true);

    try {
      // Use user's location or default to Budapest
      const locationData = {
        locationAddr: user?.location?.city || 'Budapest',
        locationCity: user?.location?.city || 'Budapest',
        locationArea: user?.location?.area || undefined,
        locationLat: user?.location?.lat || 47.4979,
        locationLng: user?.location?.lng || 19.0402,
      };

      const result = await jobsApi.createJob({
        title,
        description,
        category,
        urgency,
        ...locationData,
        budgetMin: budgetMin ? parseInt(budgetMin) : undefined,
        budgetMax: budgetMax ? parseInt(budgetMax) : undefined,
        images,
      });

      // Navigate to success page with job ID
      router.replace(`/job-success?id=${result.id}`);
    } catch (error: any) {
      console.error('Failed to post job:', error);
      Alert.alert('Error', error.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const categories = Object.keys(CATEGORY_LABELS) as ServiceCategory[];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a Job</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Job Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Fix leaking kitchen faucet"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.hint}>{title.length}/100 characters (min 10)</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the job in detail. What needs to be done? Any specific requirements?"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            maxLength={2000}
          />
          <Text style={styles.hint}>{description.length}/2000 characters (min 50)</Text>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Text style={styles.categoryButtonText}>
              {category ? `${CATEGORY_ICONS[category]} ${CATEGORY_LABELS[category]}` : 'Select Category'}
            </Text>
            <Text style={styles.categoryButtonIcon}>{showCategoryPicker ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showCategoryPicker && (
            <View style={styles.categoryList}>
              <ScrollView style={styles.categoryScroll} nestedScrollEnabled>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryItem, category === cat && styles.categoryItemSelected]}
                    onPress={() => {
                      setCategory(cat);
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text style={styles.categoryIcon}>{CATEGORY_ICONS[cat]}</Text>
                    <Text style={styles.categoryLabel}>{CATEGORY_LABELS[cat]}</Text>
                    {category === cat && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Urgency */}
        <View style={styles.section}>
          <Text style={styles.label}>Urgency</Text>
          <View style={styles.urgencyRow}>
            {URGENCY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.urgencyButton, urgency === option.value && styles.urgencyButtonActive]}
                onPress={() => setUrgency(option.value as any)}
              >
                <Text style={styles.urgencyIcon}>{option.icon}</Text>
                <Text style={[styles.urgencyText, urgency === option.value && styles.urgencyTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Budget */}
        <View style={styles.section}>
          <Text style={styles.label}>Budget Range (Optional)</Text>
          <View style={styles.budgetRow}>
            <View style={styles.budgetInput}>
              <TextInput
                style={styles.input}
                placeholder="Min"
                value={budgetMin}
                onChangeText={setBudgetMin}
                keyboardType="numeric"
              />
              <Text style={styles.currency}>Ft</Text>
            </View>
            <Text style={styles.budgetSeparator}>-</Text>
            <View style={styles.budgetInput}>
              <TextInput
                style={styles.input}
                placeholder="Max"
                value={budgetMax}
                onChangeText={setBudgetMax}
                keyboardType="numeric"
              />
              <Text style={styles.currency}>Ft</Text>
            </View>
          </View>
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <Text style={styles.label}>Photos (Optional)</Text>
          <Text style={styles.hint}>Add up to 10 photos to help professionals understand the job</Text>
          <MultiImagePicker images={images} onImagesChange={setImages} maxImages={10} />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>{loading ? 'Posting...' : 'Post Job'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#00BCD4',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
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
    height: 120,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButtonText: {
    fontSize: 15,
    color: '#111827',
  },
  categoryButtonIcon: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  categoryList: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    maxHeight: 300,
  },
  categoryScroll: {
    maxHeight: 300,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryItemSelected: {
    backgroundColor: '#E0F7FA',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryLabel: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  checkmark: {
    fontSize: 16,
    color: '#00BCD4',
    fontWeight: 'bold',
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  urgencyButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  urgencyButtonActive: {
    backgroundColor: '#E0F7FA',
    borderColor: '#00BCD4',
  },
  urgencyIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  urgencyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  urgencyTextActive: {
    color: '#00BCD4',
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  budgetInput: {
    flex: 1,
    position: 'relative',
  },
  currency: {
    position: 'absolute',
    right: 16,
    top: 12,
    fontSize: 15,
    color: '#6B7280',
  },
  budgetSeparator: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#00BCD4',
    marginHorizontal: 20,
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
