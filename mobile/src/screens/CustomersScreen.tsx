import React from 'react';
import { ScrollView, View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { useDashboard } from '../hooks/useDashboard';
import { formatCurrency, formatNumber } from '../utils/format';
import { Card } from '../components/Card';
import { MetricRow } from '../components/MetricRow';
import { CityRow } from '../components/CityRow';

export const CustomersScreen: React.FC = () => {
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
      <Card title="Customer Growth" titleIcon="">
        <MetricRow
          label="Restaurants Onboarded"
          value={formatNumber(data.growth.restaurants_onboarded)}
          valueColor={colors.success}
        />
        <MetricRow label="Active Restaurants" value={formatNumber(data.growth.active_restaurants)} />
        <MetricRow label="Expansion Revenue" value={formatCurrency(data.growth.expansion_revenue)} />
        <MetricRow
          label="Churned"
          value={formatNumber(data.growth.churned)}
          valueColor={data.growth.churned > 0 ? colors.danger : colors.success}
        />
      </Card>

      <Card title="City Breakdown" titleIcon="">
        {data.cities.map((city) => (
          <CityRow
            key={city.city}
            city={city}
            maxRestaurants={data.cities[0]?.restaurants || 1}
          />
        ))}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { paddingTop: spacing.md, paddingBottom: spacing.xxxl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface },
});
