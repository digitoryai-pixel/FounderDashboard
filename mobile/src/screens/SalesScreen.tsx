import React from 'react';
import { ScrollView, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { colors, spacing, fontSize } from '../constants/theme';
import { useDashboard } from '../hooks/useDashboard';
import { formatCurrency, formatNumber } from '../utils/format';
import { Card } from '../components/Card';
import { MetricRow } from '../components/MetricRow';

export const SalesScreen: React.FC = () => {
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
      <Card title="Sales Pipeline" titleIcon="">
        <MetricRow label="New Leads Today" value={formatNumber(data.sales.new_leads)} />
        <MetricRow label="Pipeline Value" value={formatCurrency(data.sales.pipeline_value)} />
        <MetricRow label="Deals Closed This Week" value={formatNumber(data.sales.deals_closed_week)} />
        <MetricRow label="Average Deal Size" value={formatCurrency(data.sales.avg_deal_size)} />
      </Card>

      <Card title="Lead Sources" titleIcon="">
        <MetricRow label="Inbound" value="12" />
        <MetricRow label="Outbound" value="7" />
        <MetricRow label="Partner Referrals" value="3" />
      </Card>

      <Card title="Weekly Target" titleIcon="">
        <MetricRow label="Target" value="8 deals" />
        <MetricRow
          label="Closed"
          value={`${data.sales.deals_closed_week} deals`}
          valueColor={data.sales.deals_closed_week >= 8 ? colors.success : colors.warning}
        />
        <MetricRow
          label="Achievement"
          value={`${Math.round((data.sales.deals_closed_week / 8) * 100)}%`}
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
