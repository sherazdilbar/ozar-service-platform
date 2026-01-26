import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { servicesApi, prosApi } from '@ozar/shared/apiClient';
import { ServiceCategory, CATEGORY_ICONS, CATEGORY_LABELS } from '@ozar/shared';

export default function ProServicesScreen() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [profileCategories, setProfileCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const result = await servicesApi.getMyServices();
      setServices(result || []);
      
      // Load profile categories
      const proProfile = await prosApi.getMyProfile();
      console.log('📋 Profile categories loaded:', proProfile.categories);
      setProfileCategories(proProfile.categories || []);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    // TODO: Implement service status toggle API
    console.log('Toggle service:', serviceId, !currentStatus);
  };

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    const category = service.category || 'OTHER';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, any[]>);

  // Sort categories to show profile categories first
  const sortedCategories = Object.keys(groupedServices).sort((a, b) => {
    const aInProfile = profileCategories.includes(a as ServiceCategory);
    const bInProfile = profileCategories.includes(b as ServiceCategory);
    if (aInProfile && !bInProfile) return -1;
    if (!aInProfile && bInProfile) return 1;
    return 0;
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Services</Text>
            <Text style={styles.subtitle}>{services.length} services created</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/pro/services')}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Categories */}
        {profileCategories.length > 0 && (
          <View style={styles.categoriesSection}>
            <View style={styles.categoriesHeader}>
              <Text style={styles.categoriesIcon}>✓</Text>
              <Text style={styles.categoriesTitle}>Your Service Categories</Text>
            </View>
            <Text style={styles.categoriesSubtitle}>
              Categories you selected during signup
            </Text>
            <View style={styles.categoriesGrid}>
              {profileCategories.map((category) => (
                <View key={category} style={styles.categoryChip}>
                  <Text style={styles.categoryIcon}>{CATEGORY_ICONS[category]}</Text>
                  <Text style={styles.categoryLabel}>{CATEGORY_LABELS[category]}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity onPress={() => router.push('/pro/profile-edit')}>
              <Text style={styles.editCategoriesLink}>Edit categories in profile →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Services List - Grouped by Category */}
        <View style={styles.servicesList}>
          {services.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💼</Text>
              <Text style={styles.emptyTitle}>No Services Yet</Text>
              <Text style={styles.emptyText}>
                Create your first service to start receiving bookings
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => router.push('/pro/services')}
              >
                <Text style={styles.emptyButtonText}>Create Service</Text>
              </TouchableOpacity>
            </View>
          ) : (
            sortedCategories.map((category) => {
              const categoryServices = groupedServices[category];
              const isProfileCategory = profileCategories.includes(category as ServiceCategory);
              
              return (
                <View key={category} style={styles.categorySection}>
                  {/* Category Header */}
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryHeaderLeft}>
                      <Text style={styles.categoryHeaderIcon}>
                        {CATEGORY_ICONS[category as ServiceCategory] || '📦'}
                      </Text>
                      <View>
                        <Text style={styles.categoryHeaderTitle}>
                          {CATEGORY_LABELS[category as ServiceCategory] || category}
                        </Text>
                        <Text style={styles.categoryHeaderCount}>
                          {categoryServices.length} service{categoryServices.length !== 1 ? 's' : ''}
                        </Text>
                      </View>
                    </View>
                    {isProfileCategory && (
                      <View style={styles.profileCategoryBadge}>
                        <Text style={styles.profileCategoryText}>✓ Your Category</Text>
                      </View>
                    )}
                  </View>

                  {/* Services in this category */}
                  {categoryServices.map((service: any) => (
                    <View key={service.id} style={styles.serviceCard}>
                      <View style={styles.serviceHeader}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <TouchableOpacity onPress={() => router.push(`/pro/services`)}>
                          <Text style={styles.editIcon}>✏️</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.serviceDescription} numberOfLines={2}>
                        {service.description}
                      </Text>

                      <View style={styles.serviceStats}>
                        <View style={styles.statItem}>
                          <Text style={styles.statIcon}>⭐</Text>
                          <Text style={styles.statText}>New</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statText}>0 bookings</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statIcon}>⏱️</Text>
                          <Text style={styles.statText}>{service.duration} min</Text>
                        </View>
                      </View>

                      <View style={styles.serviceFooter}>
                        <View style={styles.priceContainer}>
                          <Text style={styles.priceSymbol}>$</Text>
                          <Text style={styles.priceAmount}>{service.price}</Text>
                          <Text style={styles.priceUnit}>
                            /{service.pricingModel === 'HOURLY' ? 'hr' : service.pricingModel === 'FIXED' ? 'fixed' : 'visit'}
                          </Text>
                        </View>
                        <View style={styles.statusContainer}>
                          <Text style={[styles.statusText, styles.statusTextActive]}>
                            Active
                          </Text>
                          <Switch
                            value={true}
                            onValueChange={(value) => toggleServiceStatus(service.id, true)}
                            trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                            thumbColor="white"
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })
          )}
        </View>

        {/* Add More Services CTA - Only show if they have services */}
        {services.length > 0 && (
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Add More Services</Text>
            <Text style={styles.ctaText}>
              Offer more services to attract more clients and increase your earnings.
            </Text>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => router.push('/pro/services')}
            >
              <Text style={styles.ctaButtonText}>Create New Service</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 28,
    color: 'white',
    fontWeight: '300',
  },
  categoriesSection: {
    backgroundColor: '#E0F2F1',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00BCD4',
  },
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  categoriesIcon: {
    fontSize: 20,
    color: '#00695C',
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00695C',
  },
  categoriesSubtitle: {
    fontSize: 12,
    color: '#00695C',
    marginBottom: 12,
    opacity: 0.8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00BCD4',
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00695C',
  },
  editCategoriesLink: {
    fontSize: 12,
    color: '#00BCD4',
    fontWeight: '600',
  },
  servicesList: {
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryHeaderIcon: {
    fontSize: 32,
  },
  categoryHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  categoryHeaderCount: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  profileCategoryBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  profileCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E40AF',
  },
  serviceCard: {
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
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  editIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  serviceStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    fontSize: 13,
    color: '#6B7280',
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceSymbol: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 2,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  priceUnit: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusTextActive: {
    color: '#10B981',
  },
  ctaCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#667eea',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
