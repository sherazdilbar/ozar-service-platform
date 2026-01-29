import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { jobsApi } from '@ozar/shared/apiClient';
import { CATEGORY_LABELS, CATEGORY_ICONS, ServiceCategory } from '@ozar/shared';

export default function JobSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const jobId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  const loadJob = async () => {
    try {
      const result = await jobsApi.getJobById(jobId as string);
      setJob(result);
    } catch (error) {
      console.error('Failed to load job:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00BCD4" style={{ marginTop: 100 }} />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Job not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Success Icon */}
      <View style={styles.successIcon}>
        <Text style={styles.checkmark}>✓</Text>
      </View>

      {/* Success Message */}
      <Text style={styles.title}>Job Posted Successfully!</Text>
      <Text style={styles.subtitle}>
        Your job has been posted and professionals will start bidding soon.
      </Text>

      {/* Job Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.categoryIcon}>{CATEGORY_ICONS[job.category as ServiceCategory]}</Text>
          <View style={styles.summaryHeaderText}>
            <Text style={styles.summaryTitle}>{job.title}</Text>
            <Text style={styles.summaryCategory}>{CATEGORY_LABELS[job.category as ServiceCategory]}</Text>
          </View>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📍 Location:</Text>
            <Text style={styles.detailValue}>{job.locationCity}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>⏰ Urgency:</Text>
            <Text style={styles.detailValue}>{job.urgency.replace('_', ' ')}</Text>
          </View>

          {job.budgetMin && job.budgetMax && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>💰 Budget:</Text>
              <Text style={styles.detailValue}>{job.budgetMin} - {job.budgetMax} Ft</Text>
            </View>
          )}

          <View style={styles.descriptionSection}>
            <Text style={styles.detailLabel}>📝 Description:</Text>
            <Text style={styles.descriptionText}>{job.description}</Text>
          </View>
        </View>
      </View>

      {/* What's Next Section */}
      <View style={styles.nextStepsCard}>
        <Text style={styles.nextStepsTitle}>What happens next?</Text>
        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>Professionals will review your job and submit bids</Text>
        </View>
        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>You'll receive notifications when bids come in</Text>
        </View>
        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>Review bids and choose the best professional</Text>
        </View>
        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>4</Text>
          <Text style={styles.stepText}>Accept a bid to create a booking</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push(`/job-details?id=${jobId}`)}
        >
          <Text style={styles.primaryButtonText}>View Job Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/my-jobs')}
        >
          <Text style={styles.secondaryButtonText}>View All My Jobs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.tertiaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 60,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  summaryHeaderText: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  summaryCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  summaryDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  descriptionSection: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
    marginTop: 8,
  },
  nextStepsCard: {
    backgroundColor: '#E0F7FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#00BCD4',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
    paddingTop: 4,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00BCD4',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00BCD4',
  },
  tertiaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 100,
  },
});
