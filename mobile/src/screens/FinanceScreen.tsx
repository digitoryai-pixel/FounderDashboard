import React from 'react';
import { ScrollView, View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { useDashboard } from '../hooks/useDashboard';
import { formatCurrency } from '../utils/format';
import { Card } from '../components/Card';
import { MetricRow } from '../components/MetricRow';

export const FinanceScreen: React.FC = () => {
  const { data, loading } = useDashboard();

  if (loading || !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const hasRunwayWarning = data.finance.runway_months < 6;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card
        title="Financial Health"
        titleIcon=""
        badge={hasRunwayWarning ? { text: 'LOW RUNWAY', color: colors.warning } : undefined}
      >
        <MetricRow label="Cash Balance" value={formatCurrency(data.finance.cash_balance)} />
        <MetricRow
          label="Cash Runway"
          value={`${data.finance.runway_months} months`}
          valueColor={data.finance.runway_months < 6 ? colors.danger : colors.success}
        />
        <MetricRow label="Monthly Burn" value={formatCurrency(data.finance.burn_rate) + '/mo'} />
        <MetricRow label="Collections Today" value={formatCurrency(data.finance.collections_today)} />
      </Card>

      <Card title="Revenue Breakdown" titleIcon="">
        <MetricRow label="ARR" value={formatCurrency(data.revenue.arr)} />
        <MetricRow label="MRR" value={formatCurrency(data.revenue.mrr)} />
        <MetricRow label="New Revenue This Month" value={formatCurrency(data.revenue.new_revenue_month)} />
        <MetricRow label="Expansion Revenue" value={formatCurrency(data.growth.expansion_revenue)} />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { paddingTop: spacing.md, paddingBottom: spacing.xxxl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface },
});
