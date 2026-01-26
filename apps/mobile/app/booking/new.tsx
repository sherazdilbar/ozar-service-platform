import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { prosApi, bookingsApi } from '@ozar/shared/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { MultiImagePicker } from '../../components/MultiImagePicker';
import { useLanguage } from '../../contexts/LanguageContext';

export default function NewBookingScreen() {
  const { proId, serviceId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [pro, setPro] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [isASAP, setIsASAP] = useState(true);
  const [scheduledDate, setScheduledDate] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Budapest');

  useEffect(() => {
    loadProAndService();
  }, []);

  const loadProAndService = async () => {
    try {
      const proData = await prosApi.getProById(proId as string);
      setPro(proData);

      const selectedService = proData.services?.find((s: any) => s.id === serviceId);
      setService(selectedService);
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Required', 'Please describe what you need');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Required', 'Please enter your address');
      return;
    }

    if (!isASAP && !scheduledDate) {
      Alert.alert('Required', 'Please select a date or choose ASAP');
      return;
    }

    setSubmitting(true);
    try {
      await bookingsApi.createBooking({
        proId: proId as string,
        serviceId: serviceId as string,
        isASAP,
        scheduledFor: isASAP ? undefined : scheduledDate,
        description: description.trim(),
        images,
        location: {
          address: address.trim(),
          city,
          lat: 47.4979, // Budapest coordinates (you can add location picker later)
          lng: 19.0402,
        },
      });

      // Navigate immediately
      router.push('/(tabs)/bookings');
      
      // Reset state
      setSubmitting(false);
      
      // Show success toast after navigation
      setTimeout(() => {
        Alert.alert('Success', 'Your booking request has been sent!');
      }, 300);
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      setSubmitting(false);
      Alert.alert('Error', error.message || 'Failed to create booking');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BCD4" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!pro || !service) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Service not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayName = pro.businessName || `${pro.user.firstName} ${pro.user.lastName}`;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Booking</Text>
        </View>

        {/* Service Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.serviceCard}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.proName}>with {displayName}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                {service.price.toLocaleString()} {pro.currency}
              </Text>
              <Text style={styles.duration}>⏱️ {service.duration} min</Text>
            </View>
          </View>
        </View>

        {/* Timing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>When do you need this?</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>As soon as possible</Text>
            <Switch
              value={isASAP}
              onValueChange={setIsASAP}
              trackColor={{ false: '#d1d5db', true: '#00BCD4' }}
              thumbColor="white"
            />
          </View>

          {!isASAP && (
            <TextInput
              style={styles.input}
              placeholder="Preferred date (e.g., Tomorrow 2pm)"
              placeholderTextColor="#9ca3af"
              value={scheduledDate}
              onChangeText={setScheduledDate}
            />
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What do you need? *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the work needed..."
            placeholderTextColor="#9ca3af"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Add photos to help the professional understand your needs
          </Text>
          <MultiImagePicker
            images={images}
            onImagesChange={setImages}
            maxImages={5}
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="Street address"
            placeholderTextColor="#9ca3af"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={[styles.input, styles.inputSpaced]}
            placeholder="City"
            placeholderTextColor="#9ca3af"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>
            {service.price.toLocaleString()} {pro.currency}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Send Request</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
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
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  backBtnText: {
    fontSize: 28,
    color: '#00BCD4',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  serviceCard: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00BCD4',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  proName: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00BCD4',
  },
  duration: {
    fontSize: 14,
    color: '#6b7280',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 15,
    color: '#374151',
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
  inputSpaced: {
    marginTop: 12,
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
  bottomBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  submitButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
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
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
