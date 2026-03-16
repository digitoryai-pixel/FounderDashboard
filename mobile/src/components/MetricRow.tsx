import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../constants/theme';

interface MetricRowProps {
  label: string;
  value: string;
  valueColor?: string;
  subtitle?: string;
}

export const MetricRow: React.FC<MetricRowProps> = ({
  label,
  value,
  valueColor = colors.text,
  subtitle,
}) => (
  <View style={styles.row}>
    <View style={styles.labelContainer}>
      <Text style={styles.label}>{label}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
    <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  value: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});
