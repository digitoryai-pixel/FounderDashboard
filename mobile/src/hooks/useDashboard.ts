import { useState, useEffect, useCallback, useRef } from 'react';
import apiService, { DashboardData } from '../services/api';
import websocketService from '../services/websocket';
import { MOCK_DASHBOARD } from '../services/mockData';
import { REFRESH_INTERVAL } from '../constants/api';

const USE_MOCK = true; // Toggle to false when backend is running

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      if (USE_MOCK) {
        // Simulate network delay
        await new Promise((res) => setTimeout(res, 300));
        setData(MOCK_DASHBOARD);
        setLastUpdated(new Date().toISOString());
      } else {
        const result = await apiService.fetchDashboard();
        setData(result);
        setLastUpdated(result.last_updated);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
      // Try cached data
      const cached = await apiService.getCachedDashboard();
      if (cached) {
        setData(cached);
        setLastUpdated(cached.last_updated);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => fetchData(true), [fetchData]);

  useEffect(() => {
    fetchData();

    // Auto-refresh every 5 minutes
    intervalRef.current = setInterval(() => fetchData(), REFRESH_INTERVAL);

    // WebSocket for real-time updates
    if (!USE_MOCK) {
      websocketService.connect();
      const unsub = websocketService.subscribe((message) => {
        if (message.type === 'platform_update' && data) {
          setData((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              platform: {
                ...prev.platform,
                orders_today: prev.platform.orders_today + (message.data.orders_delta || 0),
              },
            };
          });
        }
      });

      return () => {
        unsub();
        websocketService.disconnect();
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  return { data, loading, refreshing, error, lastUpdated, onRefresh };
};
