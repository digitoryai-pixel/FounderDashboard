import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    // Android emulator uses 10.0.2.2, iOS simulator uses localhost
    return Platform.OS === 'android'
      ? 'http://10.0.2.2:3001'
      : 'http://localhost:3001';
  }
  return 'https://api.digitory.in';
};

export const API_BASE_URL = getBaseUrl();
export const WS_URL = API_BASE_URL.replace('http', 'ws') + '/ws';
export const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
export const CACHE_KEY = 'digitory_dashboard_cache';
