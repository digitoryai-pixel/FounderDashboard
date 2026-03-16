import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';

interface CardProps {
  title: string;
  titleIcon?: string;
  badge?: { text: string; color: string };
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ title, titleIcon, badge, children, style }) => (
  <View style={[styles.card, style]}>
    <View style={styles.header}>
      <Text style={styles.title}>
        {titleIcon ? `${titleIcon} ` : ''}{title}
      </Text>
      {badge && (
        <View style={[styles.badge, { backgroundColor: badge.color }]}>
          <Text style={styles.badgeText}>{badge.text}</Text>
        </View>
      )}
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.card,
  },
});
