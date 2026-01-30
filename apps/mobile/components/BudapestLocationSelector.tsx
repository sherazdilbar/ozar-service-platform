import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import {
  BUDAPEST_DISTRICTS,
  DISTRICT_ZONES,
  getDistrictDisplayName,
  BudapestDistrict,
  DistrictZone,
} from '@ozar/shared/budapestDistricts';
import {
  getDistrictCoordinates,
  findNearestDistrict,
  isWithinBudapest,
} from '@ozar/shared/budapestDistrictCoordinates';

interface BudapestLocationSelectorProps {
  selectedDistrict: string;
  onDistrictChange: (district: string, lat: number, lng: number) => void;
  language?: 'en' | 'hu';
  showCurrentLocation?: boolean;
}

export default function BudapestLocationSelector({
  selectedDistrict,
  onDistrictChange,
  language = 'en',
  showCurrentLocation = true,
}: BudapestLocationSelectorProps) {
  const [gettingLocation, setGettingLocation] = useState(false);
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  const handleDistrictSelect = (district: string) => {
    const coords = getDistrictCoordinates(district);
    if (coords) {
      onDistrictChange(district, coords.lat, coords.lng);
    }
  };

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          language === 'hu' ? 'Engedély megtagadva' : 'Permission Denied',
          language === 'hu'
            ? 'Kérlek engedélyezd a helymeghatározást'
            : 'Please enable location permissions'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      if (isWithinBudapest(latitude, longitude)) {
        const nearestDistrict = findNearestDistrict(latitude, longitude);
        if (nearestDistrict) {
          onDistrictChange(nearestDistrict, latitude, longitude);
          Alert.alert(
            language === 'hu' ? 'Helyzet meghatározva' : 'Location Detected',
            language === 'hu'
              ? `${nearestDistrict}. kerület`
              : `District ${nearestDistrict}`
          );
        }
      } else {
        const coords = getDistrictCoordinates('V');
        if (coords) {
          onDistrictChange('V', coords.lat, coords.lng);
          Alert.alert(
            language === 'hu' ? 'Figyelmeztetés' : 'Notice',
            language === 'hu'
              ? 'Nem vagy Budapesten. Alapértelmezett: V. kerület'
              : 'You are not in Budapest. Defaulting to District V'
          );
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        language === 'hu' ? 'Hiba' : 'Error',
        language === 'hu'
          ? 'Nem sikerült meghatározni a helyzetet'
          : 'Failed to get your location'
      );
    } finally {
      setGettingLocation(false);
    }
  };

  const getZoneIcon = (zoneKey: string) => {
    const icons: Record<string, string> = {
      'central': '🏛️',
      'buda-hills': '⛰️',
      'north-buda': '🏘️',
      'north-pest': '🏙️',
      'mid-pest': '🏢',
      'south-buda': '🌳',
      'south-pest': '🏭',
      'outer-pest': '🏘️',
    };
    return icons[zoneKey] || '🏘️';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Current Location Button */}
      {showCurrentLocation && (
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
          disabled={gettingLocation}
        >
          {gettingLocation ? (
            <ActivityIndicator size="small" color="#00BCD4" />
          ) : (
            <Text style={styles.currentLocationIcon}>📍</Text>
          )}
          <Text style={styles.currentLocationText}>
            {gettingLocation
              ? language === 'hu'
                ? 'Helyzet meghatározása...'
                : 'Detecting location...'
              : language === 'hu'
              ? 'Jelenlegi helyzetem használata'
              : 'Use My Current Location'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>
          {language === 'hu' ? 'vagy válassz kerületet' : 'or select district'}
        </Text>
        <View style={styles.dividerLine} />
      </View>

      {/* District Selection by Zone */}
      <View style={styles.zonesContainer}>
        {Object.entries(DISTRICT_ZONES).map(([zoneKey, zone]) => {
          const isExpanded = expandedZone === zoneKey;
          const isSelected = zone.districts.includes(selectedDistrict as any);

          return (
            <View key={zoneKey} style={styles.zoneCard}>
              {/* Zone Header */}
              <TouchableOpacity
                style={[styles.zoneHeader, isSelected && styles.zoneHeaderSelected]}
                onPress={() => setExpandedZone(isExpanded ? null : zoneKey)}
              >
                <View style={styles.zoneHeaderLeft}>
                  <Text style={styles.zoneIcon}>{getZoneIcon(zoneKey)}</Text>
                  <View>
                    <Text style={styles.zoneName}>
                      {language === 'hu' ? zone.nameHu : zone.name}
                    </Text>
                    <Text style={styles.zoneSubtext}>
                      {zone.districts.length} {language === 'hu' ? 'kerület' : 'districts'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.expandIcon, isExpanded && styles.expandIconRotated]}>
                  ▼
                </Text>
              </TouchableOpacity>

              {/* Districts Grid */}
              {isExpanded && (
                <View style={styles.districtsGrid}>
                  {zone.districts.map((district) => {
                    const isDistrictSelected = selectedDistrict === district;
                    const districtData = BUDAPEST_DISTRICTS[district as BudapestDistrict];

                    return (
                      <TouchableOpacity
                        key={district}
                        style={[
                          styles.districtButton,
                          isDistrictSelected && styles.districtButtonSelected,
                        ]}
                        onPress={() => handleDistrictSelect(district)}
                      >
                        <Text style={styles.districtNumber}>{district}.</Text>
                        <Text style={styles.districtName} numberOfLines={2}>
                          {language === 'hu' ? districtData.name : districtData.nameEn}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Selected District Display */}
      {selectedDistrict && (
        <View style={styles.selectedCard}>
          <Text style={styles.checkIcon}>✓</Text>
          <View style={styles.selectedTextContainer}>
            <Text style={styles.selectedLabel}>
              {language === 'hu' ? 'Kiválasztott kerület:' : 'Selected District:'}
            </Text>
            <Text style={styles.selectedDistrict}>
              {getDistrictDisplayName(selectedDistrict as BudapestDistrict, language)}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F2F1',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#00BCD4',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  currentLocationIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  currentLocationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#00BCD4',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 12,
  },
  zonesContainer: {
    gap: 12,
  },
  zoneCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 12,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  zoneHeaderSelected: {
    backgroundColor: '#E0F2F1',
  },
  zoneHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  zoneIcon: {
    fontSize: 24,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  zoneSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  expandIcon: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  expandIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  districtsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    paddingTop: 0,
    gap: 8,
  },
  districtButton: {
    width: '30%',
    aspectRatio: 1,
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  districtButtonSelected: {
    borderColor: '#00BCD4',
    backgroundColor: '#E0F2F1',
  },
  districtNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  districtName: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#00BCD4',
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  checkIcon: {
    fontSize: 24,
    color: '#00BCD4',
  },
  selectedTextContainer: {
    flex: 1,
  },
  selectedLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  selectedDistrict: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#047857',
    marginTop: 2,
  },
});
