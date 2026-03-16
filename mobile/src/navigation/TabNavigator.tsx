import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/DashboardScreen';
import { SalesScreen } from '../screens/SalesScreen';
import { CustomersScreen } from '../screens/CustomersScreen';
import { ProductScreen } from '../screens/ProductScreen';
import { FinanceScreen } from '../screens/FinanceScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors, fontSize } from '../constants/theme';

const Tab = createBottomTabNavigator();

const tabIcons: Record<string, string> = {
  Dashboard: '\u25A0',
  Sales: '\u25B2',
  Customers: '\u25CF',
  Product: '\u2699',
  Finance: '\u25C6',
  Settings: '\u2630',
};

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => (
          <Text style={[styles.icon, { color }]}>{tabIcons[route.name] || '\u25CB'}</Text>
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Digitory' }}
      />
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="Customers" component={CustomersScreen} />
      <Tab.Screen name="Product" component={ProductScreen} />
      <Tab.Screen name="Finance" component={FinanceScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 4,
    height: 88,
  },
  tabLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginTop: 2,
  },
  icon: {
    fontSize: 18,
    fontWeight: '700',
  },
  header: {
    backgroundColor: colors.card,
    elevation: 0,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
});
