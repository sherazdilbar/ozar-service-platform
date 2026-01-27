import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { prosApi, availabilityApi } from '@ozar/shared/apiClient';

type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

type WeekSchedule = Record<DayOfWeek, DaySchedule>;

const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: 'MONDAY', label: 'Monday', short: 'Mon' },
  { key: 'TUESDAY', label: 'Tuesday', short: 'Tue' },
  { key: 'WEDNESDAY', label: 'Wednesday', short: 'Wed' },
  { key: 'THURSDAY', label: 'Thursday', short: 'Thu' },
  { key: 'FRIDAY', label: 'Friday', short: 'Fri' },
  { key: 'SATURDAY', label: 'Saturday', short: 'Sat' },
  { key: 'SUNDAY', label: 'Sunday', short: 'Sun' },
];

const TIME_SLOTS = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
];

export default function ProAvailabilityScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableNow, setAvailableNow] = useState(false);
  const [schedule, setSchedule] = useState<WeekSchedule>({
    MONDAY: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    TUESDAY: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    WEDNESDAY: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    THURSDAY: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    FRIDAY: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    SATURDAY: { enabled: false, slots: [] },
    SUNDAY: { enabled: false, slots: [] },
  });

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      const profile = await prosApi.getMyProfile();
      setAvailableNow(profile.availabilityStatus === 'AVAILABLE_NOW');
      
      // Load schedule from backend
      const scheduleData = await availabilityApi.getSchedule();
      
      if (scheduleData && scheduleData.length > 0) {
        // Convert backend schedule to UI format
        const newSchedule: WeekSchedule = {
          MONDAY: { enabled: false, slots: [] },
          TUESDAY: { enabled: false, slots: [] },
          WEDNESDAY: { enabled: false, slots: [] },
          THURSDAY: { enabled: false, slots: [] },
          FRIDAY: { enabled: false, slots: [] },
          SATURDAY: { enabled: false, slots: [] },
          SUNDAY: { enabled: false, slots: [] },
        };
        
        scheduleData.forEach((item: any) => {
          if (!newSchedule[item.dayOfWeek as DayOfWeek]) return;
          
          if (item.isActive) {
            newSchedule[item.dayOfWeek as DayOfWeek].enabled = true;
            newSchedule[item.dayOfWeek as DayOfWeek].slots.push({
              start: item.startTime,
              end: item.endTime,
            });
          }
        });
        
        setSchedule(newSchedule);
      }
    } catch (error) {
      console.error('Failed to load availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailableNow = async (value: boolean) => {
    try {
      await prosApi.updateProfile({
        availabilityStatus: value ? 'AVAILABLE_NOW' : 'OFFLINE',
      });
      setAvailableNow(value);
      Alert.alert(
        'Success',
        value ? 'You are now available for instant bookings' : 'Instant bookings disabled'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update availability');
    }
  };

  const toggleDay = (day: DayOfWeek) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const updateTimeSlot = (day: DayOfWeek, index: number, field: 'start' | 'end', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  const addTimeSlot = (day: DayOfWeek) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: '09:00', end: '17:00' }],
      },
    }));
  };

  const removeTimeSlot = (day: DayOfWeek, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index),
      },
    }));
  };

  const applyToAllDays = (day: DayOfWeek) => {
    Alert.alert(
      'Apply to All Days',
      `Apply ${DAYS.find(d => d.key === day)?.label}'s schedule to all days?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () => {
            const daySchedule = schedule[day];
            const newSchedule = { ...schedule };
            DAYS.forEach(d => {
              newSchedule[d.key] = {
                enabled: daySchedule.enabled,
                slots: [...daySchedule.slots],
              };
            });
            setSchedule(newSchedule);
          },
        },
      ]
    );
  };

  const saveSchedule = async () => {
    setSaving(true);
    try {
      // Convert UI schedule to backend format
      const schedules: any[] = [];
      
      DAYS.forEach(day => {
        const daySchedule = schedule[day.key];
        if (daySchedule.enabled && daySchedule.slots.length > 0) {
          daySchedule.slots.forEach(slot => {
            schedules.push({
              dayOfWeek: day.key,
              startTime: slot.start,
              endTime: slot.end,
              isActive: true,
            });
          });
        }
      });
      
      // Save to backend
      await availabilityApi.updateSchedule(schedules);
      
      Alert.alert('Success', 'Availability schedule saved successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading availability...</Text>
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
          <Text style={styles.title}>Availability</Text>
          <Text style={styles.subtitle}>Manage your working hours</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Available Now Toggle */}
        <View style={styles.section}>
          <View style={styles.availableNowCard}>
            <View style={styles.availableNowHeader}>
              <View style={styles.availableNowIcon}>
                <Ionicons 
                  name={availableNow ? 'flash' : 'flash-off'} 
                  size={24} 
                  color={availableNow ? '#10B981' : '#9CA3AF'} 
                />
              </View>
              <View style={styles.availableNowInfo}>
                <Text style={styles.availableNowTitle}>Available Now</Text>
                <Text style={styles.availableNowText}>
                  {availableNow 
                    ? 'You can receive instant bookings' 
                    : 'Instant bookings are disabled'}
                </Text>
              </View>
              <Switch
                value={availableNow}
                onValueChange={toggleAvailableNow}
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                thumbColor="white"
              />
            </View>
          </View>
        </View>

        {/* Weekly Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📅 Weekly Schedule</Text>
            <Text style={styles.sectionSubtitle}>Set your regular working hours</Text>
          </View>

          {DAYS.map((day) => (
            <View key={day.key} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <View style={styles.dayInfo}>
                  <Switch
                    value={schedule[day.key].enabled}
                    onValueChange={() => toggleDay(day.key)}
                    trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                    thumbColor="white"
                  />
                  <Text style={[styles.dayLabel, !schedule[day.key].enabled && styles.dayLabelDisabled]}>
                    {day.label}
                  </Text>
                </View>
                {schedule[day.key].enabled && (
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => applyToAllDays(day.key)}
                  >
                    <Ionicons name="copy-outline" size={16} color="#3B82F6" />
                    <Text style={styles.copyButtonText}>Copy to all</Text>
                  </TouchableOpacity>
                )}
              </View>

              {schedule[day.key].enabled && (
                <View style={styles.timeSlotsContainer}>
                  {schedule[day.key].slots.map((slot, index) => (
                    <View key={index} style={styles.timeSlotRow}>
                      <View style={styles.timeSlot}>
                        <Text style={styles.timeLabel}>From</Text>
                        <View style={styles.timePicker}>
                          <Text style={styles.timeValue}>{slot.start}</Text>
                        </View>
                      </View>

                      <Ionicons name="arrow-forward" size={20} color="#9CA3AF" />

                      <View style={styles.timeSlot}>
                        <Text style={styles.timeLabel}>To</Text>
                        <View style={styles.timePicker}>
                          <Text style={styles.timeValue}>{slot.end}</Text>
                        </View>
                      </View>

                      {schedule[day.key].slots.length > 1 && (
                        <TouchableOpacity
                          style={styles.removeSlotButton}
                          onPress={() => removeTimeSlot(day.key, index)}
                        >
                          <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}

                  <TouchableOpacity
                    style={styles.addSlotButton}
                    onPress={() => addTimeSlot(day.key)}
                  >
                    <Ionicons name="add-circle-outline" size={20} color="#3B82F6" />
                    <Text style={styles.addSlotButtonText}>Add time slot</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Quick Presets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Presets</Text>
          <View style={styles.presetsGrid}>
            <TouchableOpacity
              style={styles.presetButton}
              onPress={() => {
                const weekdaySchedule: DaySchedule = { enabled: true, slots: [{ start: '09:00', end: '17:00' }] };
                const weekendSchedule: DaySchedule = { enabled: false, slots: [] };
                setSchedule({
                  MONDAY: weekdaySchedule,
                  TUESDAY: weekdaySchedule,
                  WEDNESDAY: weekdaySchedule,
                  THURSDAY: weekdaySchedule,
                  FRIDAY: weekdaySchedule,
                  SATURDAY: weekendSchedule,
                  SUNDAY: weekendSchedule,
                });
              }}
            >
              <Text style={styles.presetIcon}>🏢</Text>
              <Text style={styles.presetLabel}>9-5 Weekdays</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetButton}
              onPress={() => {
                const allDaySchedule: DaySchedule = { enabled: true, slots: [{ start: '08:00', end: '20:00' }] };
                setSchedule({
                  MONDAY: allDaySchedule,
                  TUESDAY: allDaySchedule,
                  WEDNESDAY: allDaySchedule,
                  THURSDAY: allDaySchedule,
                  FRIDAY: allDaySchedule,
                  SATURDAY: allDaySchedule,
                  SUNDAY: { enabled: false, slots: [] },
                });
              }}
            >
              <Text style={styles.presetIcon}>📆</Text>
              <Text style={styles.presetLabel}>8-8 Mon-Sat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetButton}
              onPress={() => {
                const allDaySchedule: DaySchedule = { enabled: true, slots: [{ start: '00:00', end: '23:59' }] };
                DAYS.forEach(day => {
                  setSchedule(prev => ({ ...prev, [day.key]: allDaySchedule }));
                });
              }}
            >
              <Text style={styles.presetIcon}>🌍</Text>
              <Text style={styles.presetLabel}>24/7</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#3B82F6" />
          <Text style={styles.infoText}>
            Your availability helps customers know when they can book your services. You can always adjust this later.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={saveSchedule}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.saveButtonText}>Save Schedule</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  availableNowCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  availableNowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableNowIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  availableNowInfo: {
    flex: 1,
  },
  availableNowTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  availableNowText: {
    fontSize: 14,
    color: '#6B7280',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  dayCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dayLabelDisabled: {
    color: '#9CA3AF',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  timeSlotsContainer: {
    gap: 12,
  },
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeSlot: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
  },
  timePicker: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  timeValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  removeSlotButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSlotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addSlotButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  presetsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  presetButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  presetIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
