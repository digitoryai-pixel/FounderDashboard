import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';
import { useDashboard } from '../hooks/useDashboard';
import { formatCurrency, formatNumber, formatPercentage, timeAgo } from '../utils/format';
import { Card } from '../components/Card';
import { MetricRow } from '../components/MetricRow';
import { AlertItem } from '../components/AlertItem';
import { MiniChart } from '../components/MiniChart';
import { CityRow } from '../components/CityRow';
import { InsightCard } from '../components/InsightCard';

export const DashboardScreen: React.FC = () => {
  const { data, loading, refreshing, error, lastUpdated, onRefresh } = useDashboard();

  if (loading && !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your command center...</Text>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!data) return null;

  const hasEscalationAlert = data.product.escalations > 2;
  const hasRunwayWarning = data.finance.runway_months < 6;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Last Updated */}
      {lastUpdated && (
        <Text style={styles.lastUpdated}>Updated {timeAgo(lastUpdated)}</Text>
      )}

      {/* Morning Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.greeting}>{data.summary.greeting}</Text>
        {data.summary.highlights.map((line, i) => (
          <Text key={i} style={styles.highlightLine}>{line}</Text>
        ))}
      </View>

      {/* Alerts */}
      <Card title="Alerts" titleIcon="">
        {data.alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </Card>

      {/* Platform Activity */}
      <Card
        title="Platform Activity"
        titleIcon=""
        badge={{ text: 'LIVE', color: colors.success }}
      >
        <MetricRow label="Orders Today" value={formatNumber(data.platform.orders_today)} />
        <MetricRow label="Restaurants Active" value={formatNumber(data.platform.restaurants_active)} />
        <MetricRow label="Revenue Processed" value={formatCurrency(data.platform.revenue_processed)} />
        <MetricRow label="QR Orders" value={formatNumber(data.platform.qr_orders)} />
      </Card>

      {/* Revenue Engine */}
      <Card title="Revenue" titleIcon="">
        <MetricRow label="ARR" value={formatCurrency(data.revenue.arr)} />
        <MetricRow label="MRR" value={formatCurrency(data.revenue.mrr)} />
        <MetricRow
          label="Revenue Added This Month"
          value={formatCurrency(data.revenue.new_revenue_month)}
        />
        <MetricRow
          label="MRR Growth"
          value={formatPercentage(data.revenue.mrr_growth)}
          valueColor={data.revenue.mrr_growth > 0 ? colors.success : colors.danger}
        />
        <MiniChart
          title="MRR Trend (12 months)"
          data={data.charts.mrr_history.map((d) => d.mrr)}
          labels={data.charts.mrr_history.map((d) => d.month)}
          color={colors.success}
        />
      </Card>

      {/* Sales Engine */}
      <Card title="Sales" titleIcon="">
        <MetricRow label="New Leads" value={formatNumber(data.sales.new_leads)} />
        <MetricRow label="Pipeline Value" value={formatCurrency(data.sales.pipeline_value)} />
        <MetricRow label="Deals Closed" value={formatNumber(data.sales.deals_closed_week)} />
        <MetricRow label="Average Deal Size" value={formatCurrency(data.sales.avg_deal_size)} />
      </Card>

      {/* Customer Growth */}
      <Card title="Growth" titleIcon="">
        <MetricRow
          label="Restaurants Onboarded"
          value={formatNumber(data.growth.restaurants_onboarded)}
          valueColor={colors.success}
        />
        <MetricRow label="Active Restaurants" value={formatNumber(data.growth.active_restaurants)} />
        <MetricRow
          label="Expansion Revenue"
          value={formatCurrency(data.growth.expansion_revenue)}
        />
        <MetricRow
          label="Churn"
          value={formatNumber(data.growth.churned)}
          valueColor={data.growth.churned > 0 ? colors.danger : colors.success}
        />
      </Card>

      {/* Product Health */}
      <Card
        title="Product"
        titleIcon=""
        badge={
          hasEscalationAlert
            ? { text: `${data.product.escalations} ESCALATIONS`, color: colors.danger }
            : undefined
        }
      >
        <MetricRow
          label="Escalations"
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

      {/* Financial Health */}
      <Card
        title="Finance"
        titleIcon=""
        badge={
          hasRunwayWarning
            ? { text: 'LOW RUNWAY', color: colors.warning }
            : undefined
        }
      >
        <MetricRow label="Cash Balance" value={formatCurrency(data.finance.cash_balance)} />
        <MetricRow
          label="Cash Runway"
          value={`${data.finance.runway_months} months`}
          valueColor={data.finance.runway_months < 6 ? colors.danger : colors.success}
        />
        <MetricRow label="Burn Rate" value={formatCurrency(data.finance.burn_rate) + '/mo'} />
        <MetricRow label="Collections Today" value={formatCurrency(data.finance.collections_today)} />
      </Card>

      {/* Orders Chart */}
      <Card title="Orders Trend" titleIcon="">
        <MiniChart
          title="Daily Orders (14 days)"
          data={data.charts.orders_history.map((d) => d.orders)}
          labels={data.charts.orders_history.map((d) =>
            new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
          )}
          color={colors.primary}
        />
      </Card>

      {/* City Performance */}
      <Card title="City Performance" titleIcon="">
        {data.cities.map((city) => (
          <CityRow
            key={city.city}
            city={city}
            maxRestaurants={data.cities[0]?.restaurants || 1}
          />
        ))}
      </Card>

      {/* AI Insights */}
      <Card title="AI Founder Insights" titleIcon="">
        {data.insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </Card>

      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.danger,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  lastUpdated: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  summaryCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.text,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
  },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.card,
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  highlightLine: {
    fontSize: fontSize.sm,
    color: '#D1D5DB',
    lineHeight: 24,
    fontWeight: '500',
  },
  footer: {
    height: spacing.xxxl,
  },
});
