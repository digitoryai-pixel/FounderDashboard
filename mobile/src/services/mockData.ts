import { DashboardData } from './api';

/**
 * Mock data for development and offline preview.
 * Mirrors the exact shape the backend returns.
 */
export const MOCK_DASHBOARD: DashboardData = {
  last_updated: new Date().toISOString(),
  summary: {
    greeting: 'Good Morning, Shiv',
    highlights: [
      '6 restaurants onboarded yesterday',
      '₹8.2L collected yesterday',
      '3 client escalations pending',
      'MRR grew by ₹9L this month',
    ],
  },
  alerts: [
    { id: 1, type: 'critical', message: 'Escalation from premium client — Barbeque Nation', is_read: false, created_at: new Date().toISOString() },
    { id: 2, type: 'warning', message: 'Cash runway approaching 6 month threshold', is_read: false, created_at: new Date().toISOString() },
    { id: 3, type: 'warning', message: 'Server response time degraded — P99 > 2s', is_read: false, created_at: new Date().toISOString() },
    { id: 4, type: 'healthy', message: '10 restaurants onboarded today', is_read: false, created_at: new Date().toISOString() },
    { id: 5, type: 'healthy', message: 'All payment systems operational', is_read: false, created_at: new Date().toISOString() },
    { id: 6, type: 'critical', message: 'POS downtime reported by 3 restaurants in Mumbai', is_read: false, created_at: new Date().toISOString() },
  ],
  revenue: {
    arr: 84000000,
    mrr: 7000000,
    mrr_growth: 6,
    new_revenue_month: 900000,
  },
  sales: {
    new_leads: 22,
    pipeline_value: 18000000,
    deals_closed_week: 6,
    avg_deal_size: 82000,
  },
  growth: {
    restaurants_onboarded: 6,
    active_restaurants: 412,
    expansion_revenue: 300000,
    churned: 1,
  },
  product: {
    escalations: 2,
    bugs_open: 11,
    bugs_resolved: 7,
    feature_releases: 2,
  },
  platform: {
    orders_today: 42381,
    restaurants_active: 312,
    revenue_processed: 32000000,
    qr_orders: 11402,
  },
  finance: {
    cash_balance: 28000000,
    runway_months: 14,
    burn_rate: 2200000,
    collections_today: 820000,
  },
  cities: [
    { city: 'Bangalore', restaurants: 210, orders_today: 14200, revenue_today: 10800000 },
    { city: 'Mumbai', restaurants: 74, orders_today: 9800, revenue_today: 7200000 },
    { city: 'Hyderabad', restaurants: 52, orders_today: 6400, revenue_today: 4800000 },
    { city: 'Pune', restaurants: 41, orders_today: 5200, revenue_today: 3900000 },
    { city: 'Delhi NCR', restaurants: 18, orders_today: 3600, revenue_today: 2700000 },
    { city: 'Chennai', restaurants: 12, orders_today: 2100, revenue_today: 1500000 },
    { city: 'Kolkata', restaurants: 5, orders_today: 1081, revenue_today: 800000 },
  ],
  charts: {
    mrr_history: [
      { month: 'Apr', mrr: 2800000 },
      { month: 'May', mrr: 3100000 },
      { month: 'Jun', mrr: 3500000 },
      { month: 'Jul', mrr: 3900000 },
      { month: 'Aug', mrr: 4200000 },
      { month: 'Sep', mrr: 4600000 },
      { month: 'Oct', mrr: 5000000 },
      { month: 'Nov', mrr: 5400000 },
      { month: 'Dec', mrr: 5800000 },
      { month: 'Jan', mrr: 6200000 },
      { month: 'Feb', mrr: 6600000 },
      { month: 'Mar', mrr: 7000000 },
    ],
    orders_history: Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 13 + i);
      return {
        date: d.toISOString().split('T')[0],
        orders: 38000 + Math.floor(Math.random() * 5000),
      };
    }),
  },
  insights: [
    { id: 1, insight: 'Partner leads increased 38% this week. Pune is the fastest growing city.', category: 'growth', created_at: new Date().toISOString() },
    { id: 2, insight: 'QR ordering adoption up 22% — consider expanding to dine-in focused restaurants.', category: 'product', created_at: new Date().toISOString() },
    { id: 3, insight: 'Average deal size increased to ₹82K from ₹68K last month. Enterprise push is working.', category: 'sales', created_at: new Date().toISOString() },
    { id: 4, insight: 'Collection efficiency improved to 94% this month, up from 87% last month.', category: 'finance', created_at: new Date().toISOString() },
  ],
};
