import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, CACHE_KEY } from '../constants/api';

export interface DashboardData {
  last_updated: string;
  summary: {
    greeting: string;
    highlights: string[];
  };
  alerts: Alert[];
  revenue: RevenueMetrics;
  sales: SalesMetrics;
  growth: GrowthMetrics;
  product: ProductMetrics;
  platform: PlatformMetrics;
  finance: FinanceMetrics;
  cities: CityData[];
  charts: {
    mrr_history: { month: string; mrr: number }[];
    orders_history: { date: string; orders: number }[];
  };
  insights: Insight[];
}

export interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'healthy';
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface RevenueMetrics {
  arr: number;
  mrr: number;
  mrr_growth: number;
  new_revenue_month: number;
}

export interface SalesMetrics {
  new_leads: number;
  pipeline_value: number;
  deals_closed_week: number;
  avg_deal_size: number;
}

export interface GrowthMetrics {
  restaurants_onboarded: number;
  active_restaurants: number;
  expansion_revenue: number;
  churned: number;
}

export interface ProductMetrics {
  escalations: number;
  bugs_open: number;
  bugs_resolved: number;
  feature_releases: number;
}

export interface PlatformMetrics {
  orders_today: number;
  restaurants_active: number;
  revenue_processed: number;
  qr_orders: number;
}

export interface FinanceMetrics {
  cash_balance: number;
  runway_months: number;
  burn_rate: number;
  collections_today: number;
}

export interface CityData {
  city: string;
  restaurants: number;
  orders_today: number;
  revenue_today: number;
}

export interface Insight {
  id: number;
  insight: string;
  category: string;
  created_at: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async fetchDashboard(): Promise<DashboardData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dashboard`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      if (json.success && json.data) {
        // Cache for offline use
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(json.data));
        return json.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      // Fall back to cached data
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
      throw error;
    }
  }

  async getCachedDashboard(): Promise<DashboardData | null> {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  }
}

export default new ApiService();
