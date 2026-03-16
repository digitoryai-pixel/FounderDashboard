import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';
import { CityData } from '../services/api';
import { formatNumber, formatCurrency } from '../utils/format';

interface CityRowProps {
  city: CityData;
  maxRestaurants: number;
  onPress?: () => void;
}

export const CityRow: React.FC<CityRowProps> = ({ city, maxRestaurants, onPress }) => {
  const barWidth = (city.restaurants / maxRestaurants) * 100;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.cityName}>{city.city}</Text>
        <Text style={styles.count}>{city.restaurants} restaurants</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.bar, { width: `${barWidth}%` }]} />
      </View>
      <View style={styles.stats}>
        <Text style={styles.stat}>{formatNumber(city.orders_today)} orders</Text>
        <Text style={styles.stat}>{formatCurrency(city.revenue_today)} revenue</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cityName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  count: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  barBg: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  bar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
});
