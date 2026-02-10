import { useQuery } from '@tanstack/react-query';
import { analytics } from '../services/api';

export const useDashboardSummary = () => useQuery({ queryKey: ['dashboard-summary'], queryFn: analytics.getDashboardSummary });
export const useFDIForecast = (sector?: string, horizon?: number) => useQuery({ queryKey: ['fdi-forecast', sector, horizon], queryFn: () => analytics.getFDIForecast({ sector, horizon }) });
export const useSectorRiskReturn = () => useQuery({ queryKey: ['sector-risk-return'], queryFn: analytics.getSectorRiskReturn });
export const useInvestmentPatterns = () => useQuery({ queryKey: ['investment-patterns'], queryFn: analytics.getInvestmentPatterns });
export const useSectors = () => useQuery({ queryKey: ['sectors'], queryFn: analytics.getSectors });
export const useSEZs = () => useQuery({ queryKey: ['sez'], queryFn: analytics.getSEZs });
export const useMacroIndicators = (indicator?: string) => useQuery({ queryKey: ['macro-indicators', indicator], queryFn: () => analytics.getMacroIndicators(indicator) });
