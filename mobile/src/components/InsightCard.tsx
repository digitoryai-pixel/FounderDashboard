import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';
import { Insight } from '../services/api';

const categoryIcon: Record<string, string> = {
  growth: '\uD83D\uDCC8',
  product: '\uD83D\uDEE0\uFE0F',
  sales: '\uD83D\uDCB0',
  finance: '\uD83C\uDFE6',
};

export const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => (
  <View style={styles.container}>
    <Text style={styles.icon}>{categoryIcon[insight.category] || '\uD83D\uDCA1'}</Text>
    <Text style={styles.text}>{insight.insight}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: fontSize.lg,
    marginRight: spacing.sm,
    marginTop: 1,
  },
  text: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
});
