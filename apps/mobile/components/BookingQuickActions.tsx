import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bookingsApi, templatesApi } from '@ozar/shared/apiClient';
import MultiImagePicker from './MultiImagePicker';

interface Props {
  bookingId: string;
  status: string;
  isPro: boolean;
  onActionComplete: () => void;
}

const QUICK_MESSAGES = [
  { id: 'on_way', icon: '🚗', label: 'On My Way', message: "I'm on my way! I'll be there in about 15 minutes." },
  { id: 'late', icon: '⏰', label: 'Running Late', message: "Running a bit late due to traffic. Will be there in 20 minutes." },
  { id: 'arrived', icon: '📍', label: 'Arrived', message: "I've arrived at your location. See you soon!" },
  { id: 'started', icon: '🔧', label: 'Started Work', message: "I've started working on your request." },
];

export default function BookingQuickActions({ bookingId, status, isPro, onActionComplete }: Props) {
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [completionPhotos, setCompletionPhotos] = useState<string[]>([]);
  const [completionNotes, setCompletionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const sendQuickMessage = async (message: string) => {
    try {
      // In production, this would send via chat API
      Alert.alert('Message Sent', message);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      await bookingsApi.updateBookingStatus(bookingId, 'COMPLETED');
      
      // Upload completion photos if any
      if (completionPhotos.length > 0) {
        // Upload photos logic
      }
      
      Alert.alert('Success', 'Booking marked as completed');
      setShowCompleteModal(false);
      onActionComplete();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete booking');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReschedule = () => {
    Alert.alert(
      'Reschedule Booking',
      'Contact the customer to arrange a new time',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Message', onPress: () => {
          // Open chat
        }},
      ]
    );
  };

  if (!isPro || !['ACCEPTED', 'SCHEDULED', 'IN_PROGRESS'].includes(status)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>

      {/* Quick Messages */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send Quick Message</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {QUICK_MESSAGES.map((msg) => (
            <TouchableOpacity
              key={msg.id}
              style={styles.quickMessageButton}
              onPress={() => sendQuickMessage(msg.message)}
            >
              <Text style={styles.quickMessageIcon}>{msg.icon}</Text>
              <Text style={styles.quickMessageLabel}>{msg.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {status === 'ACCEPTED' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.startButton]}
            onPress={async () => {
              try {
                await bookingsApi.updateBookingStatus(bookingId, 'IN_PROGRESS');
                Alert.alert('Success', 'Booking started');
                onActionComplete();
              } catch (error: any) {
                Alert.alert('Error', error.message || 'Failed to start booking');
              }
            }}
          >
            <Ionicons name="play-circle" size={20} color="white" />
            <Text style={styles.actionButtonText}>Start Work</Text>
          </TouchableOpacity>
        )}

        {(status === 'ACCEPTED' || status === 'SCHEDULED') && (
          <TouchableOpacity
            style={[styles.actionButton, styles.rescheduleButton]}
            onPress={handleReschedule}
          >
            <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
            <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Reschedule</Text>
          </TouchableOpacity>
        )}

        {status === 'IN_PROGRESS' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => setShowCompleteModal(true)}
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.actionButtonText}>Mark Complete</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Complete Modal */}
      <Modal
        visible={showCompleteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCompleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Complete Booking</Text>
              <TouchableOpacity onPress={() => setShowCompleteModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Completion Photos (Optional)</Text>
              <Text style={styles.hint}>Add before/after photos of your work</Text>
              <MultiImagePicker
                images={completionPhotos}
                onImagesChange={setCompletionPhotos}
                maxImages={5}
              />

              <Text style={styles.label}>Notes (Optional)</Text>
              <Text style={styles.hint}>Any additional notes about the completed work</Text>
              <View style={styles.textAreaContainer}>
                <Text style={styles.textArea}>
                  {completionNotes}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <Text style={styles.infoText}>
                  The customer will be notified and can leave a review
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCompleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleComplete}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Complete Booking</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  quickMessageButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    minWidth: 80,
  },
  quickMessageIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickMessageLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startButton: {
    backgroundColor: '#8B5CF6',
  },
  rescheduleButton: {
    backgroundColor: '#EFF6FF',
  },
  completeButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalBody: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
    marginTop: 16,
  },
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  textAreaContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
  },
  textArea: {
    fontSize: 15,
    color: '#111827',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
});
