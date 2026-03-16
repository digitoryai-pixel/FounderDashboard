/**
 * Format a number as Indian currency (₹).
 * Supports Cr, L, K abbreviations.
 */
export const formatCurrency = (value: number, abbreviated = true): string => {
  if (!abbreviated) {
    return '₹' + value.toLocaleString('en-IN');
  }

  if (value >= 10000000) {
    return '₹' + (value / 10000000).toFixed(1) + ' Cr';
  }
  if (value >= 100000) {
    return '₹' + (value / 100000).toFixed(1) + 'L';
  }
  if (value >= 1000) {
    return '₹' + (value / 1000).toFixed(0) + 'K';
  }
  return '₹' + value.toString();
};

export const formatNumber = (value: number): string => {
  return value.toLocaleString('en-IN');
};

export const formatPercentage = (value: number): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}%`;
};

export const timeAgo = (date: string): string => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
};
