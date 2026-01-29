import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { prosApi, chatApi } from '@ozar/shared/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { ServiceCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@ozar/shared';
import PortfolioGallery from '../../components/PortfolioGallery';
import ReviewsList from '../../components/ReviewsList';
import FavoriteButton from '../../components/FavoriteButton';

interface ProProfile {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  businessName?: string;
  bio: string;
  categories: string[];
  rating: number;
  reviewCount: number;
  jobsCompleted: number;
  yearsExperience: number;
  verificationStatus: string;
  availabilityStatus: string;
  startingPrice: number;
  currency: string;
  responseTime: number;
  locationCity: string;
  locationArea: string;
  services: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    pricingModel: string;
  }>;
  portfolio?: Array<{
    id: string;
    imageUrl: string;
    title: string;
    description?: string;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuingOrg: string;
    issueDate: string;
    expiryDate?: string;
    status: string;
  }>;
  badges?: Array<{
    id: string;
    badgeType: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
  }>;
}

export default function ProDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [pro, setPro] = useState<ProProfile | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingConversation, setCreatingConversation] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'portfolio' | 'reviews'>('about');

  // Calculate acceptance rate (mock for now - should come from backend)
  const acceptanceRate = pro ? Math.min(95, Math.round((pro.jobsCompleted / (pro.jobsCompleted + 5)) * 100)) : 0;
  const completionRate = pro ? Math.min(98, Math.round((pro.jobsCompleted / (pro.jobsCompleted + 2)) * 100)) : 0;

  // Working hours (mock - should come from availability API)
  const workingHours = [
    { day: 'Mon', hours: '9:00 AM - 6:00 PM', available: true },
    { day: 'Tue', hours: '9:00 AM - 6:00 PM', available: true },
    { day: 'Wed', hours: '9:00 AM - 6:00 PM', available: true },
    { day: 'Thu', hours: '9:00 AM - 6:00 PM', available: true },
    { day: 'Fri', hours: '9:00 AM - 5:00 PM', available: true },
    { day: 'Sat', hours: '10:00 AM - 2:00 PM', available: true },
    { day: 'Sun', hours: 'Closed', available: false },
  ];

  useEffect(() => {
    loadProDetails();
  }, [id]);

  const loadProDetails = async () => {
    try {
      const result = await prosApi.getProById(id as string);
      setPro(result);
      
      // Load reviews
      try {
        const reviewsResult = await prosApi.getProReviews(id as string);
        const reviewsData = reviewsResult.data || reviewsResult || [];
        
        // Transform reviews to match component expectations
        const transformedReviews = Array.isArray(reviewsData) ? reviewsData.map((review: any) => ({
          ...review,
          customerName: review.customer 
            ? `${review.customer.firstName} ${review.customer.lastName}`
            : 'Anonymous',
          customerAvatar: review.customer?.avatar,
        })) : [];
        
        setReviews(transformedReviews);
      } catch (err) {
        console.error('Failed to load reviews:', err);
        setReviews([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Failed to load pro details:', error);
      Alert.alert('Error', 'Failed to load professional details');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${displayName} on Ozar! ${pro?.bio || ''}`,
        title: `${displayName} - Professional Services`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCall = () => {
    if (pro?.user.phone) {
      Linking.openURL(`tel:${pro.user.phone}`);
    }
  };

  const handleMessage = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to send messages');
      return;
    }

    if (user.role === 'PRO') {
      Alert.alert('Not Allowed', 'Professionals cannot message other professionals');
      return;
    }

    setCreatingConversation(true);
    try {
      console.log('Creating conversation with:', {
        customerId: user.id,
        proId: pro!.id,
      });
      
      const conversation = await chatApi.getOrCreateConversation({
        customerId: user.id,
        proId: pro!.id,
      });
      
      console.log('Conversation response:', JSON.stringify(conversation, null, 2));
      
      if (!conversation || !conversation.id) {
        throw new Error('Invalid conversation response - no ID returned');
      }
      
      // Small delay to ensure database transaction is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to the chat screen with the conversation ID
      router.push(`/chat/${conversation.id}`);
    } catch (error: any) {
      console.error('Failed to get or create conversation:', error);
      Alert.alert('Error', error.message || 'Failed to start conversation. Please try again.');
    } finally {
      setCreatingConversation(false);
    }
  };

  const handleBookService = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to book services');
      return;
    }

    if (user.role === 'PRO') {
      Alert.alert('Not Allowed', 'Professionals cannot book services');
      return;
    }

    if (!selectedService) {
      Alert.alert('Select Service', 'Please select a service to book');
      return;
    }

    router.push(`/booking/new?proId=${pro!.id}&serviceId=${selectedService}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BCD4" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!pro) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>😕</Text>
        <Text style={styles.errorTitle}>Professional not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayName = pro.businessName || `${pro.user.firstName} ${pro.user.lastName}`;
  const isPro = user?.role === 'PRO';

  return (
    <View style={styles.container}>
      {/* Header Actions */}
      <View style={styles.headerActions}>
        <FavoriteButton proId={pro.id} size={28} />
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={handleShare}
        >
          <Text style={styles.iconButtonText}>📤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {pro.user.firstName[0]}{pro.user.lastName[0]}
            </Text>
            {pro.verificationStatus === 'APPROVED' && (
              <View style={styles.verifiedBadgeLarge}>
                <Text style={styles.verifiedTextLarge}>✓</Text>
              </View>
            )}
          </View>

          <Text style={styles.proNameLarge}>{displayName}</Text>
          
          <View style={styles.ratingRow}>
            <Text style={styles.ratingStarLarge}>★</Text>
            <Text style={styles.ratingValueLarge}>{pro.rating.toFixed(1)}</Text>
            <Text style={styles.ratingCountLarge}>({pro.reviewCount} reviews)</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pro.jobsCompleted}</Text>
              <Text style={styles.statLabel}>Jobs Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pro.yearsExperience}</Text>
              <Text style={styles.statLabel}>Years Exp</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pro.responseTime}m</Text>
              <Text style={styles.statLabel}>Response</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.tabActive]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'services' && styles.tabActive]}
            onPress={() => setActiveTab('services')}
          >
            <Text style={[styles.tabText, activeTab === 'services' && styles.tabTextActive]}>
              Services ({pro.services?.length || 0})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'portfolio' && styles.tabActive]}
            onPress={() => setActiveTab('portfolio')}
          >
            <Text style={[styles.tabText, activeTab === 'portfolio' && styles.tabTextActive]}>
              Portfolio ({pro.portfolio?.length || 0})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.tabActive]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.tabTextActive]}>
              Reviews ({pro.reviewCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <>
            {/* Performance Metrics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Performance</Text>
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{acceptanceRate}%</Text>
                  <Text style={styles.metricLabel}>Acceptance Rate</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{pro.responseTime}m</Text>
                  <Text style={styles.metricLabel}>Response Time</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{completionRate}%</Text>
                  <Text style={styles.metricLabel}>Completion Rate</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{pro.jobsCompleted}</Text>
                  <Text style={styles.metricLabel}>Jobs Completed</Text>
                </View>
              </View>
            </View>

            {/* Bio */}
            {pro.bio && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.bioText}>{pro.bio}</Text>
              </View>
            )}

            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Services Offered</Text>
              <View style={styles.categoriesRow}>
                {pro.categories.map((category, index) => (
                  <View key={index} style={styles.categoryChip}>
                    <Text style={styles.categoryChipText}>
                      {CATEGORY_ICONS[category as ServiceCategory]} {CATEGORY_LABELS[category as ServiceCategory]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Working Hours */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🗓️ Working Hours</Text>
              {workingHours.map((schedule, index) => (
                <View key={index} style={styles.scheduleRow}>
                  <Text style={[styles.scheduleDay, !schedule.available && styles.scheduleDayOff]}>
                    {schedule.day}
                  </Text>
                  <Text style={[styles.scheduleHours, !schedule.available && styles.scheduleHoursOff]}>
                    {schedule.hours}
                  </Text>
                </View>
              ))}
            </View>

            {/* Certifications */}
            {pro.certifications && pro.certifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🏆 Certifications</Text>
                {pro.certifications.map((cert) => (
                  <View key={cert.id} style={styles.certCard}>
                    <View style={styles.certHeader}>
                      <View style={styles.certIcon}>
                        <Text style={styles.certIconText}>📜</Text>
                      </View>
                      <View style={styles.certInfo}>
                        <Text style={styles.certName}>{cert.name}</Text>
                        <Text style={styles.certOrg}>{cert.issuingOrg}</Text>
                        <Text style={styles.certDate}>
                          Issued: {new Date(cert.issueDate).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={styles.verifiedBadgeSmall}>
                        <Text style={styles.verifiedBadgeText}>✓</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Badges */}
            {pro.badges && pro.badges.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎖️ Badges Earned</Text>
                <View style={styles.badgesGrid}>
                  {pro.badges.map((badge) => (
                    <View key={badge.id} style={styles.badgeCard}>
                      <Text style={styles.badgeIcon}>{badge.icon}</Text>
                      <Text style={styles.badgeName}>{badge.name}</Text>
                      <Text style={styles.badgeDescription}>{badge.description}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📍 Location</Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>
                  {pro.locationArea}, {pro.locationCity}
                </Text>
              </View>
            </View>
          </>
        )}

        {activeTab === 'services' && pro.services && pro.services.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Services</Text>
            {pro.services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceCard,
                  selectedService === service.id && styles.serviceCardSelected,
                ]}
                onPress={() => setSelectedService(service.id)}
              >
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.servicePrice}>
                    {service.price.toLocaleString()} {pro.currency}
                  </Text>
                </View>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <View style={styles.serviceFooter}>
                  <Text style={styles.serviceDuration}>⏱️ {service.duration} min</Text>
                  <Text style={styles.servicePricing}>
                    {service.pricingModel === 'HOURLY' ? 'Per Hour' : 'Fixed Price'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'portfolio' && (
          <View style={styles.section}>
            <PortfolioGallery 
              items={pro.portfolio || []} 
              apiUrl={process.env.EXPO_PUBLIC_API_URL}
            />
          </View>
        )}

        {activeTab === 'reviews' && pro && (
          <View style={styles.section}>
            <ReviewsList
              reviews={Array.isArray(reviews) ? reviews : []}
              averageRating={pro.rating || 0}
              totalReviews={pro.reviewCount || 0}
              canLeaveReview={false}
            />
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Actions */}
      {!isPro && (
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Text style={styles.callButtonText}>📞 Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookButton} onPress={handleBookService}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconButtonText: {
    fontSize: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#00BCD4',
  },
  tabText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#00BCD4',
    fontWeight: '600',
  },
  // Performance Metrics
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '47%',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00BCD4',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  // Working Hours
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  scheduleDay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    width: 50,
  },
  scheduleDayOff: {
    color: '#9ca3af',
  },
  scheduleHours: {
    fontSize: 14,
    color: '#374151',
  },
  scheduleHoursOff: {
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  // Certifications
  certCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  certHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  certIconText: {
    fontSize: 20,
  },
  certInfo: {
    flex: 1,
  },
  certName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  certOrg: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  certDate: {
    fontSize: 11,
    color: '#9ca3af',
  },
  verifiedBadgeSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Badges
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '47%',
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  badgeIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
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
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatarLargeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  verifiedBadgeLarge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00BCD4',
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedTextLarge: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  proNameLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingStarLarge: {
    fontSize: 20,
    color: '#FF6B35',
    marginRight: 4,
  },
  ratingValueLarge: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 4,
  },
  ratingCountLarge: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryChipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  bioText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  locationText: {
    fontSize: 15,
    color: '#374151',
  },
  serviceCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  serviceCardSelected: {
    borderColor: '#00BCD4',
    borderWidth: 2,
    backgroundColor: '#f0f9ff',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00BCD4',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceDuration: {
    fontSize: 12,
    color: '#6b7280',
  },
  servicePricing: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 8,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  messageButtonDisabled: {
    opacity: 0.6,
  },
  messageButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  bookButton: {
    flex: 2,
    backgroundColor: '#00BCD4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
