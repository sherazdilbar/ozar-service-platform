import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';

// Only import Mapbox on native platforms
let MapboxGL: any = null;
if (Platform.OS !== 'web') {
  MapboxGL = require('@rnmapbox/maps').default;
  MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '');
}

const { width, height } = Dimensions.get('window');

interface Professional {
  id: string;
  businessName?: string;
  user: {
    firstName: string;
    lastName: string;
  };
  locationLat: number;
  locationLng: number;
  locationCity: string;
  locationArea: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  availabilityStatus: string;
  verificationStatus: string;
}

interface ProsMapViewProps {
  professionals: Professional[];
  onProSelect?: (proId: string) => void;
}

export default function ProsMapView({ professionals, onProSelect }: ProsMapViewProps) {
  const router = useRouter();

  // Return placeholder on web since Mapbox doesn't work there
  if (Platform.OS === 'web' || !MapboxGL) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>🗺️</Text>
          <Text style={styles.placeholderTitle}>Map View</Text>
          <Text style={styles.placeholderSubtitle}>
            Map view is available on mobile app only
          </Text>
        </View>
      </View>
    );
  }

  // Calculate center point from all professionals
  const centerCoordinate = professionals.length > 0
    ? [
        professionals.reduce((sum, pro) => sum + pro.locationLng, 0) / professionals.length,
        professionals.reduce((sum, pro) => sum + pro.locationLat, 0) / professionals.length,
      ]
    : [19.0402, 47.4979]; // Budapest default

  const handleMarkerPress = (pro: Professional) => {
    if (onProSelect) {
      onProSelect(pro.id);
    } else {
      router.push(`/pro/${pro.id}`);
    }
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={centerCoordinate as [number, number]}
          animationMode="flyTo"
          animationDuration={1000}
        />

        {/* Render markers for each professional */}
        {professionals.map((pro) => {
          if (!pro.locationLat || !pro.locationLng) return null;

          const displayName = pro.businessName || `${pro.user.firstName} ${pro.user.lastName}`;
          const isAvailable = pro.availabilityStatus === 'AVAILABLE';
          const isVerified = pro.verificationStatus === 'APPROVED';

          return (
            <MapboxGL.PointAnnotation
              key={pro.id}
              id={pro.id}
              coordinate={[pro.locationLng, pro.locationLat]}
              onSelected={() => handleMarkerPress(pro)}
            >
              <View style={styles.markerContainer}>
                {/* Custom marker */}
                <View style={[
                  styles.marker,
                  isAvailable && styles.markerAvailable,
                ]}>
                  <Text style={styles.markerIcon}>
                    {isVerified ? '✓' : '🔧'}
                  </Text>
                </View>
                
                {/* Marker label */}
                <View style={styles.markerLabel}>
                  <Text style={styles.markerLabelText} numberOfLines={1}>
                    {displayName}
                  </Text>
                  <View style={styles.markerInfo}>
                    <Text style={styles.markerRating}>⭐ {pro.rating.toFixed(1)}</Text>
                    <Text style={styles.markerPrice}>{pro.startingPrice} Ft/hr</Text>
                  </View>
                </View>
              </View>
            </MapboxGL.PointAnnotation>
          );
        })}
      </MapboxGL.MapView>

      {/* Map Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#6B7280' }]} />
          <Text style={styles.legendText}>Busy</Text>
        </View>
      </View>

      {/* Results count */}
      <View style={styles.countBadge}>
        <Text style={styles.countText}>
          {professionals.length} professional{professionals.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6B7280',
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerAvailable: {
    backgroundColor: '#10B981',
  },
  markerIcon: {
    fontSize: 18,
    color: 'white',
  },
  markerLabel: {
    marginTop: 4,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 120,
    maxWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  markerLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  markerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  markerRating: {
    fontSize: 10,
    color: '#6B7280',
  },
  markerPrice: {
    fontSize: 10,
    color: '#00BCD4',
    fontWeight: '600',
  },
  legend: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  countBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 12,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
