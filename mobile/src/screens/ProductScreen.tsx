import React from 'react';
import { ScrollView, View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { useDashboard } from '../hooks/useDashboard';
import { formatNumber } from '../utils/format';
import { Card } from '../components/Card';
import { MetricRow } from '../components/MetricRow';
import { MiniChart } from '../components/MiniChart';

export const ProductScreen: React.FC = () => {
  const { data, loading } = useDashboard();

  if (loading || !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card title="Product Health" titleIcon="">
        <MetricRow
          label="Client Escalations"
          value={formatNumber(data.product.escalations)}
          valueColor={data.product.escalations > 0 ? colors.danger : colors.success}
        />
        <MetricRow label="Bugs Open" value={formatNumber(data.product.bugs_open)} />
        <MetricRow
          label="Bugs Resolved"
          value={formatNumber(data.product.bugs_resolved)}
          valueColor={colors.success}
        />
        <MetricRow label="Feature Releases" value={formatNumber(data.product.feature_releases)} />
      </Card>

      <Card title="Platform Activity" titleIcon="">
        <MetricRow label="Orders Today" value={formatNumber(data.platform.orders_today)} />
        <MetricRow label="Restaurants Active" value={formatNumber(data.platform.restaurants_active)} />
        <MetricRow label="QR Orders" value={formatNumber(data.platform.qr_orders)} />
        <MiniChart
          title="Daily Orders (14 days)"
          data={data.charts.orders_history.map((d) => d.orders)}
          color={colors.primary}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { paddingTop: spacing.md, paddingBottom: spacing.xxxl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface },
});
