import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';

const SettingRow: React.FC<{
  label: string;
  value?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
}> = ({ label, value, hasToggle, toggleValue = true }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    {hasToggle ? (
      <Switch value={toggleValue} trackColor={{ true: colors.primary }} />
    ) : (
      <Text style={styles.rowValue}>{value}</Text>
    )}
  </View>
);

export const SettingsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <SettingRow label="Name" value="Shiv" />
        <SettingRow label="Role" value="Founder & CEO" />
        <SettingRow label="Company" value="Digitory" />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingRow label="Morning Summary" hasToggle toggleValue={true} />
        <SettingRow label="Critical Alerts" hasToggle toggleValue={true} />
        <SettingRow label="Weekly Digest" hasToggle toggleValue={false} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Data</Text>
        <SettingRow label="Auto Refresh" value="Every 5 min" />
        <SettingRow label="Offline Cache" hasToggle toggleValue={true} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About</Text>
        <SettingRow label="App Version" value="1.0.0" />
        <SettingRow label="API Status" value="Connected" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { paddingTop: spacing.md, paddingBottom: spacing.xxxl },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '600',
  },
});
