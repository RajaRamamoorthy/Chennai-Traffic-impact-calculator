export const createAdminRequest = (endpoint: string, adminKey: string) => {
  return fetch(`/api/admin/${endpoint}`, {
    headers: {
      'x-admin-key': adminKey,
      'Content-Type': 'application/json',
    },
  });
};

export const formatNumber = (num: number): string => {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)}Cr`;
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(1)}L`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatCurrency = (amount: number): string => {
  return `₹${(amount / 100).toLocaleString('en-IN')}`;
};

export const getScoreColor = (score: number): string => {
  if (score < 20) return 'text-green-600 dark:text-green-400';
  if (score < 40) return 'text-lime-600 dark:text-lime-400';
  if (score < 60) return 'text-yellow-600 dark:text-yellow-400';
  if (score < 80) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
};

export const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
  if (score < 20) return 'default';
  if (score < 40) return 'secondary';
  if (score < 60) return 'outline';
  return 'destructive';
};