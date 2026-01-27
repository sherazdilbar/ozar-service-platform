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
import ImagePicker from '../../components/ImagePicker';
import { certificationsApi } from '@ozar/shared/apiClient';

interface Certification {
  id: string;
  name: string;
  issuingOrg: string;
  issueDate: string;
  expiryDate?: string;
  certificateUrl?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
}

interface Badge {
  id: string;
  badgeType: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export default function CertificationsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'certifications' | 'badges'>('certifications');

  // Form state
  const [name, setName] = useState('');
  const [issuingOrg, setIssuingOrg] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [certificateImage, setCertificateImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [certsData, badgesData] = await Promise.all([
        certificationsApi.getCertifications(),
        certificationsApi.getBadges(),
      ]);
      
      setCertifications(certsData || []);
      setBadges(badgesData || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Error', 'Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !issuingOrg.trim() || !issueDate) {
      Alert.alert('Required', 'Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        name: name.trim(),
        issuingOrg: issuingOrg.trim(),
        issueDate: new Date(issueDate).toISOString(),
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
        certificateUrl: certificateImage || undefined,
      };
      
      await certificationsApi.addCertification(data);
      Alert.alert('Success', 'Certification submitted for verification');
      setShowAddModal(false);
      loadData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add certification');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return '#10B981';
      case 'PENDING': return '#F59E0B';
      case 'REJECTED': return '#EF4444';
      case 'EXPIRED': return '#9CA3AF';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'checkmark-circle';
      case 'PENDING': return 'time';
      case 'REJECTED': return 'close-circle';
      case 'EXPIRED': return 'alert-circle';
      default: return 'help-circle';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading...</Text>
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
          <Text style={styles.title}>Credentials</Text>
          <Text style={styles.subtitle}>Certifications & Badges</Text>
        </View>
        {activeTab === 'certifications' && (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'certifications' && styles.tabActive]}
          onPress={() => setActiveTab('certifications')}
        >
          <Text style={[styles.tabText, activeTab === 'certifications' && styles.tabTextActive]}>
            Certifications ({certifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'badges' && styles.tabActive]}
          onPress={() => setActiveTab('badges')}
        >
          <Text style={[styles.tabText, activeTab === 'badges' && styles.tabTextActive]}>
            Badges ({badges.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'certifications' ? (
          <>
            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons name="shield-checkmark" size={24} color="#3B82F6" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Build Trust with Certifications</Text>
                <Text style={styles.infoText}>
                  Upload your licenses and certifications to stand out and build customer trust.
                </Text>
              </View>
            </View>

            {certifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📜</Text>
                <Text style={styles.emptyTitle}>No certifications yet</Text>
                <Text style={styles.emptyText}>
                  Add your professional certifications to boost credibility
                </Text>
                <TouchableOpacity style={styles.emptyButton} onPress={() => setShowAddModal(true)}>
                  <Text style={styles.emptyButtonText}>Add Certification</Text>
                </TouchableOpacity>
              </View>
            ) : (
              certifications.map((cert) => (
                <View key={cert.id} style={styles.certCard}>
                  <View style={styles.certHeader}>
                    <View style={styles.certIcon}>
                      <Ionicons name="document-text" size={24} color="#3B82F6" />
                    </View>
                    <View style={styles.certInfo}>
                      <Text style={styles.certName}>{cert.name}</Text>
                      <Text style={styles.certOrg}>{cert.issuingOrg}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(cert.status)}20` }]}>
                      <Ionicons name={getStatusIcon(cert.status)} size={16} color={getStatusColor(cert.status)} />
                      <Text style={[styles.statusText, { color: getStatusColor(cert.status) }]}>
                        {cert.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.certDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                      <Text style={styles.detailText}>
                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                      </Text>
                    </View>
                    {cert.expiryDate && (
                      <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={14} color="#6B7280" />
                        <Text style={styles.detailText}>
                          Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            )}
          </>
        ) : (
          <>
            {/* Badges Info */}
            <View style={styles.infoCard}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Earn Badges</Text>
                <Text style={styles.infoText}>
                  Complete milestones and maintain high standards to earn badges
                </Text>
              </View>
            </View>

            {badges.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🏆</Text>
                <Text style={styles.emptyTitle}>No badges yet</Text>
                <Text style={styles.emptyText}>
                  Complete jobs and maintain quality to earn badges
                </Text>
              </View>
            ) : (
              <View style={styles.badgesGrid}>
                {badges.map((badge) => (
                  <View key={badge.id} style={styles.badgeCard}>
                    <Text style={styles.badgeIcon}>{badge.icon}</Text>
                    <Text style={styles.badgeName}>{badge.name}</Text>
                    <Text style={styles.badgeDescription}>{badge.description}</Text>
                    <Text style={styles.badgeDate}>
                      Earned {new Date(badge.earnedAt).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Modal - Continued in next part */}
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#3B82F6' },
  tabText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#3B82F6' },
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
  certCard: {
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
  certHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  certIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  certInfo: { flex: 1 },
  certName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 2 },
  certOrg: { fontSize: 14, color: '#6B7280' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 11, fontWeight: '600' },
  certDetails: { gap: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 13, color: '#6B7280' },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeCard: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeIcon: { fontSize: 48, marginBottom: 12 },
  badgeName: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4, textAlign: 'center' },
  badgeDescription: { fontSize: 12, color: '#6B7280', textAlign: 'center', marginBottom: 8 },
  badgeDate: { fontSize: 11, color: '#9CA3AF', textAlign: 'center' },
});
