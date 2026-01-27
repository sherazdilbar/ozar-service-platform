import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BookingTimelineProps {
  status: string;
  isASAP: boolean;
  createdAt: string;
  scheduledFor?: string;
  completedAt?: string;
}

interface TimelineStep {
  label: string;
  icon: string;
  completed: boolean;
  active: boolean;
  date?: string;
}

export default function BookingTimeline({
  status,
  isASAP,
  createdAt,
  scheduledFor,
  completedAt,
}: BookingTimelineProps) {
  const getSteps = (): TimelineStep[] => {
    const steps: TimelineStep[] = [];

    // Cancelled states
    if (status === 'CANCELLED_BY_CUSTOMER' || status === 'CANCELLED_BY_PRO') {
      return [
        {
          label: 'Request Sent',
          icon: 'checkmark-circle',
          completed: true,
          active: false,
          date: new Date(createdAt).toLocaleDateString(),
        },
        {
          label: status === 'CANCELLED_BY_CUSTOMER' ? 'Cancelled by You' : 'Cancelled by Pro',
          icon: 'close-circle',
          completed: true,
          active: true,
          date: 'Cancelled',
        },
      ];
    }

    // Normal flow
    steps.push({
      label: 'Request Sent',
      icon: 'checkmark-circle',
      completed: true,
      active: status === 'REQUESTED',
      date: new Date(createdAt).toLocaleDateString(),
    });

    steps.push({
      label: 'Pro Accepted',
      icon: 'checkmark-circle',
      completed: ['ACCEPTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'].includes(status),
      active: status === 'ACCEPTED',
      date: ['ACCEPTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'].includes(status) ? 'Accepted' : undefined,
    });

    if (!isASAP && scheduledFor) {
      steps.push({
        label: 'Scheduled',
        icon: 'calendar',
        completed: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED'].includes(status),
        active: status === 'SCHEDULED',
        date: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED'].includes(status)
          ? new Date(scheduledFor).toLocaleDateString()
          : undefined,
      });
    }

    steps.push({
      label: 'In Progress',
      icon: 'time',
      completed: ['IN_PROGRESS', 'COMPLETED'].includes(status),
      active: status === 'IN_PROGRESS',
      date: status === 'IN_PROGRESS' ? 'Started' : undefined,
    });

    steps.push({
      label: 'Completed',
      icon: 'checkmark-done-circle',
      completed: status === 'COMPLETED',
      active: status === 'COMPLETED',
      date: completedAt ? new Date(completedAt).toLocaleDateString() : undefined,
    });

    return steps;
  };

  const steps = getSteps();
  const isCancelled = status === 'CANCELLED_BY_CUSTOMER' || status === 'CANCELLED_BY_PRO';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Progress</Text>
      
      <View style={styles.timeline}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            {/* Step */}
            <View style={styles.step}>
              {/* Icon */}
              <View
                style={[
                  styles.iconCircle,
                  step.completed && styles.iconCircleCompleted,
                  step.active && styles.iconCircleActive,
                  isCancelled && step.active && styles.iconCircleCancelled,
                ]}
              >
                <Ionicons
                  name={step.icon as any}
                  size={20}
                  color={
                    step.completed
                      ? isCancelled && step.active
                        ? '#EF4444'
                        : '#10B981'
                      : '#D1D5DB'
                  }
                />
              </View>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    step.completed && styles.connectorCompleted,
                  ]}
                />
              )}
            </View>

            {/* Label */}
            <View style={styles.labelContainer}>
              <Text
                style={[
                  styles.label,
                  step.completed && styles.labelCompleted,
                  step.active && styles.labelActive,
                ]}
              >
                {step.label}
              </Text>
              {step.date && (
                <Text style={styles.date}>{step.date}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 60,
  },
  step: {
    alignItems: 'center',
    marginRight: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  iconCircleCompleted: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  iconCircleActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircleCancelled: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
  connectorCompleted: {
    backgroundColor: '#10B981',
  },
  labelContainer: {
    flex: 1,
    paddingTop: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  labelCompleted: {
    color: '#374151',
  },
  labelActive: {
    color: '#111827',
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
});
