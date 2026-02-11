export const formatCurrency = (amount: number, _currency = 'USD'): string => {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
  return `$${amount.toFixed(0)}`;
};
export const formatNumber = (num: number): string => num.toLocaleString('en-US');
export const formatPercentage = (value: number, decimals = 1): string => `${value.toFixed(decimals)}%`;
export const formatDate = (date: string): string => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
export const formatCompactNumber = (num: number): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
};
export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = { active: 'bg-green-100 text-green-800', approved: 'bg-blue-100 text-blue-800', inquiry: 'bg-yellow-100 text-yellow-800', completed: 'bg-gray-100 text-gray-700', withdrawn: 'bg-red-100 text-red-800' };
  return map[status] || 'bg-gray-100 text-gray-700';
};
export const getRiskColor = (risk: string): string => {
  const map: Record<string, string> = { low: 'text-green-600', medium: 'text-yellow-600', high: 'text-red-600' };
  return map[risk] || 'text-gray-600';
};
export const getSectorIcon = (code: string): string => {
  const map: Record<string, string> = { MIN: 'Pickaxe', AGR: 'Wheat', TOU: 'MapPin', MAN: 'Factory', ICT: 'Cpu', ENR: 'Zap', INF: 'Building', FIN: 'Landmark', HLT: 'Heart' };
  return map[code] || 'Circle';
};
