import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';
import { Alert } from '../services/api';

const alertConfig = {
  critical: { icon: '\uD83D\uDEA8', bg: colors.dangerBg, text: colors.danger },
  warning: { icon: '\u26A0\uFE0F', bg: colors.warningBg, text: colors.warning },
  healthy: { icon: '\u2705', bg: colors.successBg, text: colors.success },
};

export const AlertItem: React.FC<{ alert: Alert }> = ({ alert }) => {
  const config = alertConfig[alert.type];
  return (
    <View style={[styles.container, { backgroundColor: config.bg }]}>
      <Text style={styles.icon}>{config.icon}</Text>
      <Text style={[styles.message, { color: config.text }]} numberOfLines={2}>
        {alert.message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: fontSize.md,
    marginRight: spacing.sm,
  },
  message: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    flex: 1,
  },
});
