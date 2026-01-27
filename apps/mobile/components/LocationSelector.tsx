import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';

interface LocationSelectorProps {
  city: string;
  area: string;
  onCityChange: (city: string) => void;
  onAreaChange: (area: string) => void;
  onLocationSelect: (lat: number, lng: number) => void;
  disabled?: boolean;
}

interface MapboxFeature {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  bbox?: [number, number, number, number];
}

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

export default function LocationSelector({
  city,
  area,
  onCityChange,
  onAreaChange,
  onLocationSelect,
  disabled = false,
}: LocationSelectorProps) {
  const [cityResults, setCityResults] = useState<MapboxFeature[]>([]);
  const [areaResults, setAreaResults] = useState<MapboxFeature[]>([]);
  const [showCityResults, setShowCityResults] = useState(false);
  const [showAreaResults, setShowAreaResults] = useState(false);
  const [searchingCity, setSearchingCity] = useState(false);
  const [searchingArea, setSearchingArea] = useState(false);
  const [selectedCityData, setSelectedCityData] = useState<MapboxFeature | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Get current location
  const getCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location permissions to use this feature');
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.coords.longitude},${location.coords.latitude}.json?access_token=${MAPBOX_TOKEN}&limit=1`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        
        // Extract city and area from the result
        const context = feature.context || [];
        const cityFeature = context.find((c: any) => c.id.startsWith('place.'));
        const neighborhoodFeature = context.find((c: any) => c.id.startsWith('neighborhood.') || c.id.startsWith('locality.'));
        
        const cityName = cityFeature?.text || feature.text;
        const areaName = neighborhoodFeature?.text || feature.text;

        // Set the location
        setSelectedCityData({
          id: feature.id,
          text: cityName,
          place_name: feature.place_name,
          center: feature.center,
          bbox: feature.bbox,
        });
        
        onCityChange(cityName);
        onAreaChange(areaName);
        onLocationSelect(location.coords.latitude, location.coords.longitude);
        
        Alert.alert('Success', 'Current location detected!');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location. Please try again.');
    } finally {
      setGettingLocation(false);
    }
  };

  // Search for cities
  const searchCity = async (query: string) => {
    if (query.length < 2) {
      setCityResults([]);
      return;
    }

    setSearchingCity(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?types=place&access_token=${MAPBOX_TOKEN}&limit=5`
      );
      const data = await response.json();

      if (data.features) {
        setCityResults(data.features);
        setShowCityResults(true);
      }
    } catch (err) {
      console.error('City search error:', err);
    } finally {
      setSearchingCity(false);
    }
  };

  // Search for areas within selected city
  const searchArea = async (query: string) => {
    if (query.length < 3 || !selectedCityData) {
      setAreaResults([]);
      return;
    }

    setSearchingArea(true);
    try {
      const bbox = selectedCityData.bbox?.join(',') || '';
      const proximity = selectedCityData.center
        ? `${selectedCityData.center[0]},${selectedCityData.center[1]}`
        : '';

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?` +
          `types=address,poi,neighborhood&` +
          `${bbox ? `bbox=${bbox}&` : ''}` +
          `${proximity ? `proximity=${proximity}&` : ''}` +
          `access_token=${MAPBOX_TOKEN}&limit=8`
      );
      const data = await response.json();

      if (data.features) {
        setAreaResults(data.features);
        setShowAreaResults(true);
      }
    } catch (err) {
      console.error('Area search error:', err);
    } finally {
      setSearchingArea(false);
    }
  };

  // Debounced search for city
  useEffect(() => {
    const timer = setTimeout(() => {
      if (city && !selectedCityData) {
        searchCity(city);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [city]);

  // Debounced search for area
  useEffect(() => {
    const timer = setTimeout(() => {
      if (area && selectedCityData) {
        searchArea(area);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [area, selectedCityData]);

  const handleCitySelect = (feature: MapboxFeature) => {
    setSelectedCityData(feature);
    onCityChange(feature.text);
    onAreaChange('');
    onLocationSelect(feature.center[1], feature.center[0]);
    setShowCityResults(false);
    setCityResults([]);
    setAreaResults([]);
  };

  const handleAreaSelect = (feature: MapboxFeature) => {
    const addressPart = feature.text || feature.place_name.split(',')[0];
    onAreaChange(addressPart);
    onLocationSelect(feature.center[1], feature.center[0]);
    setShowAreaResults(false);
    setAreaResults([]);
  };

  return (
    <View style={styles.container}>
      {/* Use Current Location Button */}
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={getCurrentLocation}
        disabled={gettingLocation || disabled}
      >
        {gettingLocation ? (
          <ActivityIndicator size="small" color="#00BCD4" />
        ) : (
          <>
            <Text style={styles.currentLocationIcon}>📍</Text>
            <Text style={styles.currentLocationText}>Use Current Location</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or enter manually</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* City Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>City</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>🏙️</Text>
          <TextInput
            style={styles.input}
            placeholder="Budapest, London, Paris..."
            placeholderTextColor="#9CA3AF"
            value={city}
            onChangeText={(text) => {
              onCityChange(text);
              setSelectedCityData(null);
            }}
            editable={!disabled}
          />
          {searchingCity && <ActivityIndicator size="small" color="#00BCD4" />}
        </View>

        {/* City Results Modal */}
        <Modal
          visible={showCityResults && cityResults.length > 0}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCityResults(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowCityResults(false)}
          >
            <View style={styles.resultsContainer}>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>Select City</Text>
                <TouchableOpacity onPress={() => setShowCityResults(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.resultsList}>
                {cityResults.map((result) => (
                  <TouchableOpacity
                    key={result.id}
                    style={styles.resultItem}
                    onPress={() => handleCitySelect(result)}
                  >
                    <Text style={styles.resultIcon}>📍</Text>
                    <View style={styles.resultTextContainer}>
                      <Text style={styles.resultText}>{result.text}</Text>
                      <Text style={styles.resultSubtext}>{result.place_name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {/* Area Input - Only show if city is selected */}
      {selectedCityData && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Area / Neighborhood</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>📍</Text>
            <TextInput
              style={styles.input}
              placeholder="District V, Ráday utca..."
              placeholderTextColor="#9CA3AF"
              value={area}
              onChangeText={onAreaChange}
              editable={!disabled}
            />
            {searchingArea && <ActivityIndicator size="small" color="#00BCD4" />}
          </View>

          {/* Area Results Modal */}
          <Modal
            visible={showAreaResults && areaResults.length > 0}
            transparent
            animationType="fade"
            onRequestClose={() => setShowAreaResults(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowAreaResults(false)}
            >
              <View style={styles.resultsContainer}>
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsTitle}>Select Area</Text>
                  <TouchableOpacity onPress={() => setShowAreaResults(false)}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.resultsList}>
                  {areaResults.map((result) => (
                    <TouchableOpacity
                      key={result.id}
                      style={styles.resultItem}
                      onPress={() => handleAreaSelect(result)}
                    >
                      <Text style={styles.resultIcon}>📌</Text>
                      <View style={styles.resultTextContainer}>
                        <Text style={styles.resultText}>{result.text}</Text>
                        <Text style={styles.resultSubtext}>{result.place_name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      )}

      {/* Info Box */}
      {selectedCityData && area && (
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>✓</Text>
          <Text style={styles.infoText}>
            Location selected: {city}, {area}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    fontSize: 24,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  resultsList: {
    maxHeight: 400,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  resultIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  resultSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 8,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 10,
    color: '#10B981',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#047857',
    lineHeight: 18,
  },
});
