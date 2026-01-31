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
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LocationSelector from '../../components/LocationSelector';
import { serviceAreaApi } from '@ozar/shared/apiClient';

interface ServiceArea {
  id: string;
  city: string;
  area: string;
  radius: number;
  travelFee: number;
  isActive: boolean;
}

export default function ServiceAreaScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArea, setEditingArea] = useState<ServiceArea | null>(null);

  // Form state
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [radius, setRadius] = useState('10');
  const [travelFee, setTravelFee] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadServiceAreas();
  }, []);

  const loadServiceAreas = async () => {
    setLoading(true);
    try {
      const result = await serviceAreaApi.getServiceAreas();
      setAreas(result || []);
    } catch (error) {
      console.error('Failed to load service areas:', error);
      Alert.alert('Error', 'Failed to load service areas');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingArea(null);
    setCity('');
    setArea('');
    setRadius('10');
    setTravelFee('0');
    setIsActive(true);
    setShowAddModal(true);
  };

  const openEditModal = (serviceArea: ServiceArea) => {
    setEditingArea(serviceArea);
    setCity(serviceArea.city);
    setArea(serviceArea.area);
    setRadius(serviceArea.radius.toString());
    setTravelFee(serviceArea.travelFee.toString());
    setIsActive(serviceArea.isActive);
    setShowAddModal(true);
  };

  const handleSubmit = async () => {
    if (!city.trim()) {
      Alert.alert('Required', 'Please select a city');
      return;
    }
    if (!radius || parseInt(radius) <= 0) {
      Alert.alert('Required', 'Please enter a valid radius');
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        city: city.trim(),
        area: area.trim() || undefined,
        radius: parseInt(radius),
        travelFee: parseInt(travelFee) || 0,
        isActive,
      };

      if (editingArea) {
        await serviceAreaApi.updateServiceArea(editingArea.id, data);
        Alert.alert('Success', 'Service area updated successfully');
      } else {
        await serviceAreaApi.addServiceArea(data);
        Alert.alert('Success', 'Service area added successfully');
      }

      setShowAddModal(false);
      loadServiceAreas();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save service area');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (serviceArea: ServiceArea) => {
    Alert.alert(
      'Delete Service Area',
      `Remove ${serviceArea.city}${serviceArea.area ? ` - ${serviceArea.area}` : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await serviceAreaApi.deleteServiceArea(serviceArea.id);
              Alert.alert('Deleted', 'Service area removed successfully');
              loadServiceAreas();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete service area');
            }
          },
        },
      ]
    );
  };

  const calculateTravelFee = (distance: number) => {
    if (distance <= 5) return 0;
    const extraDistance = distance - 5;
    return Math.round(extraDistance * 50); // 50 HUF per km after 5km
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading service areas...</Text>
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
          <Text style={styles.title}>Service Areas</Text>
          <Text style={styles.subtitle}>Manage where you provide services</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#3B82F6" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How Service Areas Work</Text>
            <Text style={styles.infoText}>
              Define the cities and areas where you provide services. Set a radius and optional travel fees for each location.
            </Text>
          </View>
        </View>

        {/* Travel Fee Calculator */}
        <View style={styles.calculatorCard}>
          <Text style={styles.calculatorTitle}>💰 Travel Fee Calculator</Text>
          <Text style={styles.calculatorSubtitle}>
            Estimate travel fees based on distance
          </Text>
          <View style={styles.calculatorExamples}>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleDistance}>0-5 km</Text>
              <Text style={styles.exampleFee}>Free</Text>
            </View>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleDistance}>10 km</Text>
              <Text style={styles.exampleFee}>{calculateTravelFee(10)} HUF</Text>
            </View>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleDistance}>20 km</Text>
              <Text style={styles.exampleFee}>{calculateTravelFee(20)} HUF</Text>
            </View>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleDistance}>30 km</Text>
              <Text style={styles.exampleFee}>{calculateTravelFee(30)} HUF</Text>
            </View>
          </View>
        </View>

        {/* Service Areas List */}
        {areas.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📍</Text>
            <Text style={styles.emptyTitle}>No service areas yet</Text>
            <Text style={styles.emptyText}>
              Add your first service area to let customers know where you work
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={openAddModal}>
              <Text style={styles.emptyButtonText}>Add Service Area</Text>
            </TouchableOpacity>
          </View>
        ) : (
          areas.map((serviceArea) => (
            <View key={serviceArea.id} style={styles.areaCard}>
              <View style={styles.areaHeader}>
                <View style={styles.areaIcon}>
                  <Ionicons name="location" size={24} color="#3B82F6" />
                </View>
                <View style={styles.areaInfo}>
                  <Text style={styles.areaCity}>{serviceArea.city}</Text>
                  {serviceArea.area && (
                    <Text style={styles.areaName}>{serviceArea.area}</Text>
                  )}
                </View>
                <Switch
                  value={serviceArea.isActive}
                  onValueChange={(value) => {
                    // Update active status
                  }}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="white"
                />
              </View>

              <View style={styles.areaDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="radio-outline" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Radius: {serviceArea.radius} km</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="cash-outline" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    Travel Fee: {serviceArea.travelFee > 0 ? `${serviceArea.travelFee} HUF` : 'Free'}
                  </Text>
                </View>
              </View>

              <View style={styles.areaActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openEditModal(serviceArea)}
                >
                  <Ionicons name="create-outline" size={18} color="#3B82F6" />
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteActionButton]}
                  onPress={() => handleDelete(serviceArea)}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  <Text style={[styles.actionButtonText, styles.deleteActionText]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add/Edit Modal */}
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
                {editingArea ? 'Edit Service Area' : 'Add Service Area'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Location *</Text>
              <LocationSelector
                city={city}
                area={area}
                onCityChange={setCity}
                onAreaChange={setArea}
                onLocationSelect={(lat, lng) => {
                  // Store coordinates if needed
                }}
              />

              <Text style={styles.label}>Service Radius (km) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 10"
                value={radius}
                onChangeText={setRadius}
                keyboardType="numeric"
              />
              <Text style={styles.hint}>
                How far from this location will you travel?
              </Text>

              <Text style={styles.label}>Travel Fee (HUF)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 500"
                value={travelFee}
                onChangeText={setTravelFee}
                keyboardType="numeric"
              />
              <Text style={styles.hint}>
                Optional fee for traveling to this area (0 for free)
              </Text>

              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>Active</Text>
                  <Text style={styles.switchHint}>
                    Accept bookings from this area
                  </Text>
                </View>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="white"
                />
              </View>
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
                    {editingArea ? 'Update' : 'Add Area'}
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  calculatorCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  calculatorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  calculatorSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  calculatorExamples: {
    gap: 12,
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  exampleDistance: {
    fontSize: 14,
    color: '#374151',
  },
  exampleFee: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
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
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  areaCard: {
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
  areaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  areaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  areaInfo: {
    flex: 1,
  },
  areaCity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  areaName: {
    fontSize: 14,
    color: '#6B7280',
  },
  areaDetails: {
    gap: 8,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  areaActions: {
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
  deleteActionButton: {
    backgroundColor: '#FEE2E2',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  deleteActionText: {
    color: '#EF4444',
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
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  switchInfo: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  switchHint: {
    fontSize: 13,
    color: '#6B7280',
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
