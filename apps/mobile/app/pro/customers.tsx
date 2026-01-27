import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { bookingsApi, prosApi } from '@ozar/shared/apiClient';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  notes?: string;
  isFavorite?: boolean;
}

export default function ProCustomersScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'recent'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchQuery, filterType, customers]);

  const loadCustomers = async () => {
    try {
      const bookingsData = await bookingsApi.getBookings();
      const allBookings = bookingsData.data || bookingsData || [];
      
      // Group bookings by customer
      const customerMap = new Map<string, Customer>();
      
      allBookings.forEach((booking: any) => {
        if (!booking.customer) return;
        
        const customerId = booking.customer.id;
        const existing = customerMap.get(customerId);
        
        if (existing) {
          existing.totalBookings++;
          existing.totalSpent += booking.total || 0;
          if (new Date(booking.createdAt) > new Date(existing.lastBooking)) {
            existing.lastBooking = booking.createdAt;
          }
        } else {
          customerMap.set(customerId, {
            id: customerId,
            firstName: booking.customer.firstName,
            lastName: booking.customer.lastName,
            email: booking.customer.email,
            phone: booking.customer.phone,
            totalBookings: 1,
            totalSpent: booking.total || 0,
            lastBooking: booking.createdAt,
            notes: booking.customerNotes || '',
            isFavorite: false,
          });
        }
      });
      
      const customersList = Array.from(customerMap.values()).sort((a, b) => 
        new Date(b.lastBooking).getTime() - new Date(a.lastBooking).getTime()
      );
      
      setCustomers(customersList);
    } catch (error) {
      console.error('Failed to load customers:', error);
      Alert.alert('Error', 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;
    
    // Apply filter type
    if (filterType === 'favorites') {
      filtered = filtered.filter(c => c.isFavorite);
    } else if (filterType === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(c => new Date(c.lastBooking) > thirtyDaysAgo);
    }
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.firstName.toLowerCase().includes(query) ||
        c.lastName.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.includes(query)
      );
    }
    
    setFilteredCustomers(filtered);
  };

  const toggleFavorite = (customerId: string) => {
    setCustomers(prev => prev.map(c => 
      c.id === customerId ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  };

  const openNotesModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setNotes(customer.notes || '');
    setShowNotesModal(true);
  };

  const saveNotes = async () => {
    if (!selectedCustomer) return;
    
    setSavingNotes(true);
    try {
      // Find a booking for this customer to update notes
      const bookingsData = await bookingsApi.getBookings();
      const allBookings = bookingsData.data || bookingsData || [];
      const customerBooking = allBookings.find((b: any) => b.customer?.id === selectedCustomer.id);
      
      if (customerBooking) {
        await bookingsApi.updateBookingNotes(customerBooking.id, notes);
        
        // Update local state
        setCustomers(prev => prev.map(c => 
          c.id === selectedCustomer.id ? { ...c, notes } : c
        ));
        
        Alert.alert('Success', 'Notes saved successfully');
        setShowNotesModal(false);
      }
    } catch (error: any) {
      console.error('Failed to save notes:', error);
      Alert.alert('Error', error.message || 'Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const contactCustomer = (customer: Customer) => {
    Alert.alert(
      'Contact Customer',
      `${customer.firstName} ${customer.lastName}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Alert.alert('Call', customer.phone) },
        { text: 'Email', onPress: () => Alert.alert('Email', customer.email) },
        { text: 'Message', onPress: () => router.push(`/chat/${customer.id}`) },
      ]
    );
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading customers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Customers</Text>
          <Text style={styles.subtitle}>{customers.length} total customers</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, filterType === 'all' && styles.filterTabActive]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[styles.filterTabText, filterType === 'all' && styles.filterTabTextActive]}>
            All ({customers.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filterType === 'favorites' && styles.filterTabActive]}
          onPress={() => setFilterType('favorites')}
        >
          <Text style={[styles.filterTabText, filterType === 'favorites' && styles.filterTabTextActive]}>
            ⭐ Favorites
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filterType === 'recent' && styles.filterTabActive]}
          onPress={() => setFilterType('recent')}
        >
          <Text style={[styles.filterTabText, filterType === 'recent' && styles.filterTabTextActive]}>
            Recent (30d)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Customers List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredCustomers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No customers found' : 'No customers yet'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'Try adjusting your search' 
                : 'Complete bookings to build your customer base'}
            </Text>
          </View>
        ) : (
          filteredCustomers.map((customer) => (
            <View key={customer.id} style={styles.customerCard}>
              <View style={styles.customerHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {customer.firstName[0]}{customer.lastName[0]}
                  </Text>
                </View>
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>
                    {customer.firstName} {customer.lastName}
                  </Text>
                  <Text style={styles.customerEmail}>{customer.email}</Text>
                  <Text style={styles.customerPhone}>{customer.phone}</Text>
                </View>
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(customer.id)}
                >
                  <Ionicons 
                    name={customer.isFavorite ? 'star' : 'star-outline'} 
                    size={24} 
                    color={customer.isFavorite ? '#F59E0B' : '#9CA3AF'} 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.customerStats}>
                <View style={styles.statItem}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{customer.totalBookings} bookings</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="cash-outline" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{customer.totalSpent.toLocaleString()} Ft</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{getTimeAgo(customer.lastBooking)}</Text>
                </View>
              </View>

              {customer.notes && (
                <View style={styles.notesPreview}>
                  <Ionicons name="document-text-outline" size={14} color="#6B7280" />
                  <Text style={styles.notesText} numberOfLines={2}>{customer.notes}</Text>
                </View>
              )}

              <View style={styles.customerActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => contactCustomer(customer)}
                >
                  <Ionicons name="call-outline" size={18} color="#3B82F6" />
                  <Text style={styles.actionButtonText}>Contact</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openNotesModal(customer)}
                >
                  <Ionicons name="create-outline" size={18} color="#3B82F6" />
                  <Text style={styles.actionButtonText}>Notes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Notes Modal */}
      <Modal
        visible={showNotesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Customer Notes</Text>
              <TouchableOpacity onPress={() => setShowNotesModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedCustomer && (
              <View style={styles.modalCustomerInfo}>
                <Text style={styles.modalCustomerName}>
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </Text>
                <Text style={styles.modalCustomerEmail}>{selectedCustomer.email}</Text>
              </View>
            )}

            <View style={styles.modalBody}>
              <Text style={styles.label}>Private Notes</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Add notes about this customer (preferences, special requests, etc.)"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={8}
                maxLength={1000}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{notes.length}/1000</Text>
              <Text style={styles.notesHint}>
                💡 These notes are private and only visible to you
              </Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowNotesModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, savingNotes && styles.saveButtonDisabled]}
                onPress={saveNotes}
                disabled={savingNotes}
              >
                {savingNotes ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Notes</Text>
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
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  filterTabActive: {
    backgroundColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  customerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  customerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3B82F6',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 13,
    color: '#6B7280',
  },
  favoriteButton: {
    padding: 4,
  },
  customerStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: '#6B7280',
  },
  notesPreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  customerActions: {
    flexDirection: 'row',
    gap: 12,
  },
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
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
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
    maxHeight: '80%',
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
  modalCustomerInfo: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCustomerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  modalCustomerEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalBody: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
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
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  notesHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
    fontStyle: 'italic',
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
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
});
