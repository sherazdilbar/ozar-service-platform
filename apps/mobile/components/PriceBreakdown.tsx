import { View, Text, StyleSheet } from 'react-native';

interface PriceBreakdownProps {
  servicePrice: number;
  platformFee: number;
  total: number;
  currency: string;
}

export default function PriceBreakdown({
  servicePrice,
  platformFee,
  total,
  currency,
}: PriceBreakdownProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Breakdown</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Service Price</Text>
        <Text style={styles.value}>
          {servicePrice.toLocaleString()} {currency}
        </Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Platform Fee</Text>
        <Text style={styles.value}>
          {platformFee.toLocaleString()} {currency}
        </Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>
          {total.toLocaleString()} {currency}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00BCD4',
  },
});
