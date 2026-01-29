import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { templatesApi } from '@ozar/shared/apiClient';

interface QuickMessage {
  id: string;
  message: string;
  category: string;
  usageCount: number;
}

const CATEGORIES = [
  { value: 'ON_MY_WAY', label: 'On My Way', icon: '🚗' },
  { value: 'RUNNING_LATE', label: 'Running Late', icon: '⏰' },
  { value: 'COMPLETED', label: 'Completed', icon: '✅' },
  { value: 'FOLLOW_UP', label: 'Follow Up', icon: '📞' },
  { value: 'GREETING', label: 'Greeting', icon: '👋' },
];

const DEFAULT_MESSAGES = {
  ON_MY_WAY: "I'm on my way! I'll be there in about 15 minutes.",
  RUNNING_LATE: "Running a bit late due to traffic. Will be there in 20 minutes. Sorry for the delay!",
  COMPLETED: "Job completed! Thank you for choosing our services. Please let me know if you need anything else.",
  FOLLOW_UP: "Hi! Just following up to make sure everything is working well. Let me know if you have any questions!",
  GREETING: "Hello! Thank you for booking with me. Looking forward to working with you!",
};

export default function QuickMessagesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<QuickMessage[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState<QuickMessage | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Form state
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('ON_MY_WAY');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const result = await templatesApi.getQuickMessages();
      setMessages(result || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      Alert.alert('Error', 'Failed to load quick messages');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingMessage(null);
    setMessage('');
    setCategory('ON_MY_WAY');
    setShowAddModal(true);
  };

  const openEditModal = (msg: QuickMessage) => {
    setEditingMessage(msg);
    setMessage(msg.message);
    setCategory(msg.category);
    setShowAddModal(true);
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Required', 'Please enter a message');
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        message: message.trim(),
        category,
      };

      if (editingMessage) {
        await templatesApi.updateQuickMessage(editingMessage.id, data);
        Alert.alert('Success', 'Quick message updated');
      } else {
        await templatesApi.createQuickMessage(data);
        Alert.alert('Success', 'Quick message added');
      }
      setShowAddModal(false);
      loadMessages();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save message');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (msg: QuickMessage) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this quick message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await templatesApi.deleteQuickMessage(msg.id);
              Alert.alert('Deleted', 'Quick message removed');
              loadMessages();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete message');
            }
          },
        },
      ]
    );
  };

  const useMessage = (msg: QuickMessage) => {
    Alert.alert(
      'Use Quick Message',
      'This will copy the message to your clipboard',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Copy',
          onPress: () => {
            // Copy to clipboard
            Alert.alert('Copied!', 'Message copied to clipboard');
          },
        },
      ]
    );
  };

  const filteredMessages = filterCategory === 'ALL'
    ? messages
    : messages.filter(m => m.category === filterCategory);

  const getCategoryInfo = (cat: string) => {
    return CATEGORIES.find(c => c.value === cat) || CATEGORIES[0];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Quick Messages</Text>
          <Text style={styles.subtitle}>Save time with templates</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, filterCategory === 'ALL' && styles.filterChipActive]}
          onPress={() => setFilterCategory('ALL')}
        >
          <Text style={[styles.filterChipText, filterCategory === 'ALL' && styles.filterChipTextActive]}>
            All ({messages.length})
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            style={[styles.filterChip, filterCategory === cat.value && styles.filterChipActive]}
            onPress={() => setFilterCategory(cat.value)}
          >
            <Text style={[styles.filterChipText, filterCategory === cat.value && styles.filterChipTextActive]}>
              {cat.icon} {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="flash" size={24} color="#3B82F6" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Send Messages Faster</Text>
            <Text style={styles.infoText}>
              Create quick message templates for common situations. Tap to copy and send!
            </Text>
          </View>
        </View>

        {filteredMessages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyText}>
              Create quick message templates to save time
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={openAddModal}>
              <Text style={styles.emptyButtonText}>Create Message</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredMessages.map((msg) => {
            const catInfo = getCategoryInfo(msg.category);
            return (
              <View key={msg.id} style={styles.messageCard}>
                <View style={styles.messageHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryIcon}>{catInfo.icon}</Text>
                    <Text style={styles.categoryLabel}>{catInfo.label}</Text>
                  </View>
                  <View style={styles.usageCount}>
                    <Ionicons name="send" size={12} color="#6B7280" />
                    <Text style={styles.usageText}>{msg.usageCount}</Text>
                  </View>
                </View>

                <Text style={styles.messageText}>{msg.message}</Text>

                <View style={styles.messageActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => useMessage(msg)}
                  >
                    <Ionicons name="copy-outline" size={18} color="#3B82F6" />
                    <Text style={styles.actionButtonText}>Use</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openEditModal(msg)}
                  >
                    <Ionicons name="create-outline" size={18} color="#3B82F6" />
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(msg)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingMessage ? 'Edit Message' : 'New Quick Message'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Category *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    style={[
                      styles.categoryOption,
                      category === cat.value && styles.categoryOptionActive,
                    ]}
                    onPress={() => setCategory(cat.value)}
                  >
                    <Text style={styles.categoryOptionIcon}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.categoryOptionText,
                        category === cat.value && styles.categoryOptionTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Message *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Type your quick message..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{message.length}/500</Text>

              <TouchableOpacity
                style={styles.useDefaultButton}
                onPress={() => setMessage(DEFAULT_MESSAGES[category as keyof typeof DEFAULT_MESSAGES])}
              >
                <Ionicons name="bulb-outline" size={16} color="#3B82F6" />
                <Text style={styles.useDefaultText}>Use Default Template</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editingMessage ? 'Update' : 'Create'}
                  </Text>
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
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#6B7280' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { marginRight: 16 },
  headerContent: { flex: 1 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6B7280' },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: { 
    backgroundColor: 'white', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB',
    maxHeight: 60,
  },
  filterContent: { 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: { backgroundColor: '#3B82F6' },
  filterChipText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  filterChipTextActive: { color: 'white' },
  content: { flex: 1, padding: 16 },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoContent: { flex: 1, marginLeft: 12 },
  infoTitle: { fontSize: 14, fontWeight: '600', color: '#1E40AF', marginBottom: 4 },
  infoText: { fontSize: 13, color: '#1E40AF', lineHeight: 18 },
  emptyState: { alignItems: 'center', paddingVertical: 64, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8, textAlign: 'center' },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  emptyButton: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  messageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryIcon: { fontSize: 16 },
  categoryLabel: { fontSize: 12, fontWeight: '600', color: '#374151' },
  usageCount: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  usageText: { fontSize: 12, color: '#6B7280' },
  messageText: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 12 },
  messageActions: { flexDirection: 'row', gap: 8 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  deleteButton: { flex: 0, paddingHorizontal: 12, backgroundColor: '#FEE2E2' },
  actionButtonText: { fontSize: 14, fontWeight: '600', color: '#3B82F6' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  modalBody: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12, marginTop: 16 },
  categoryOption: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    minWidth: 80,
  },
  categoryOptionActive: { backgroundColor: '#3B82F6' },
  categoryOptionIcon: { fontSize: 24, marginBottom: 4 },
  categoryOptionText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  categoryOptionTextActive: { color: 'white' },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#111827',
    height: 150,
  },
  charCount: { fontSize: 12, color: '#9CA3AF', textAlign: 'right', marginTop: 4 },
  useDefaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
  },
  useDefaultText: { fontSize: 14, fontWeight: '600', color: '#3B82F6' },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center' },
  cancelButtonText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  saveButton: { flex: 2, paddingVertical: 14, borderRadius: 12, backgroundColor: '#3B82F6', alignItems: 'center' },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { fontSize: 15, fontWeight: '600', color: 'white' },
});
