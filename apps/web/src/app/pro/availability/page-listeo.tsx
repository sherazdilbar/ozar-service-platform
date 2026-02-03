'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProLayout from '@/components/ProLayout';
import { prosApi } from '@ozar/shared/apiClient';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Save,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

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

export default function ProAvailabilityPageListeo() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
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
    if (!isAuthenticated || user?.role !== 'PRO') {
      router.push('/');
      return;
    }
    loadAvailability();
  }, [isAuthenticated, user]);

  const loadAvailability = async () => {
    try {
      const profile = await prosApi.getMyProfile();
      setAvailableNow(profile.availabilityStatus === 'AVAILABLE_NOW');
    } catch (error) {
      console.error('Failed to load availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: DayOfWeek) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        slots: !prev[day].enabled && prev[day].slots.length === 0
          ? [{ start: '09:00', end: '17:00' }]
          : prev[day].slots,
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

  const saveAvailability = async () => {
    setSaving(true);
    try {
      await prosApi.updateProfile({
        availabilityStatus: availableNow ? 'AVAILABLE_NOW' : 'SCHEDULED',
      });
      alert('Availability saved successfully!');
    } catch (error) {
      console.error('Failed to save availability:', error);
      alert('Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  const applyToAll = () => {
    const mondaySchedule = schedule.MONDAY;
    const newSchedule: WeekSchedule = {} as WeekSchedule;
    
    DAYS.forEach(day => {
      newSchedule[day.key] = {
        enabled: mondaySchedule.enabled,
        slots: mondaySchedule.slots.map(slot => ({ ...slot })),
      };
    });
    
    setSchedule(newSchedule);
  };

  if (loading) {
    return (
      <ProLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600" />
        </div>
      </ProLayout>
    );
  }

  return (
    <ProLayout>
      <div className="p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Availability Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set your working hours and availability status
          </p>
        </div>

        {/* Quick Status Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                availableNow 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {availableNow ? (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {availableNow ? 'Available Now' : 'Not Available'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {availableNow 
                    ? 'You are accepting new bookings' 
                    : 'You are not accepting new bookings'
                  }
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={availableNow}
                onChange={(e) => setAvailableNow(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
            </label>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Weekly Schedule
            </h2>
            <button
              onClick={applyToAll}
              className="px-4 py-2 text-sm text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg font-semibold transition"
            >
              Apply Monday to All Days
            </button>
          </div>

          <div className="space-y-4">
            {DAYS.map((day) => (
              <div
                key={day.key}
                className={`border rounded-lg p-4 transition-all ${
                  schedule[day.key].enabled
                    ? 'border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-900/10'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schedule[day.key].enabled}
                        onChange={() => toggleDay(day.key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                    </label>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{day.label}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {schedule[day.key].enabled ? 'Working day' : 'Day off'}
                      </p>
                    </div>
                  </div>
                  {schedule[day.key].enabled && (
                    <button
                      onClick={() => addTimeSlot(day.key)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/30 rounded-lg transition font-semibold"
                    >
                      <Plus className="w-4 h-4" />
                      Add Slot
                    </button>
                  )}
                </div>

                {schedule[day.key].enabled && (
                  <div className="space-y-2 ml-14">
                    {schedule[day.key].slots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => updateTimeSlot(day.key, index, 'start', e.target.value)}
                          className="px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        />
                        <span className="text-gray-500 dark:text-gray-400">to</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => updateTimeSlot(day.key, index, 'end', e.target.value)}
                          className="px-3 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        />
                        {schedule[day.key].slots.length > 1 && (
                          <button
                            onClick={() => removeTimeSlot(day.key, index)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveAvailability}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Availability
              </>
            )}
          </button>
        </div>
      </div>
    </ProLayout>
  );
}
