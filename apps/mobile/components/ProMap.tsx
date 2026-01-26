import { View, StyleSheet, Text } from 'react-native';

interface Pro {
  id: string;
  user: {
    firstName: string;
    lastName: string;
  };
  businessName?: string;
  locationLat: number;
  locationLng: number;
  rating: number;
  startingPrice: number;
  currency: string;
  verificationStatus: string;
}

interface ProMapProps {
  pros: Pro[];
  userLocation?: { lat: number; lng: number };
  onProPress?: (proId: string) => void;
}

export default function ProMap({ pros, userLocation, onProPress }: ProMapProps) {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.icon}>🗺️</Text>
        <Text style={styles.title}>Map View</Text>
        <Text style={styles.subtitle}>
          Showing {pros.length} professional{pros.length !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.note}>
          Map integration coming soon
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  note: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});
