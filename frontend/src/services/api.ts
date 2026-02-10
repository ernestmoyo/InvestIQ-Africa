import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((r) => r, (error) => {
  if (error.response?.status === 401) localStorage.removeItem('token');
  return Promise.reject(error);
});

export const analytics = {
  getDashboardSummary: () => api.get('/analytics/dashboard-summary').then(r => r.data),
  getFDIForecast: (params?: { sector?: string; horizon?: number }) => api.get('/analytics/fdi-forecast', { params }).then(r => r.data),
  getSectorRiskReturn: () => api.get('/analytics/sector-risk-return').then(r => r.data),
  getPortfolioOptimisation: (data: { total_budget: number; risk_tolerance: string }) => api.post('/analytics/portfolio-optimisation', data).then(r => r.data),
  getInvestmentPatterns: () => api.get('/analytics/investment-patterns').then(r => r.data),
  getTrendDecomposition: (indicator: string) => api.get('/analytics/trend-decomposition', { params: { indicator } }).then(r => r.data),
  getSectors: () => api.get('/analytics/sectors').then(r => r.data),
  getSEZs: () => api.get('/analytics/sez').then(r => r.data),
  getMacroIndicators: (indicator?: string) => api.get('/analytics/macro-indicators', { params: { indicator } }).then(r => r.data),
};

export const impact = {
  calculateJobCreation: (data: { investment_amount: number; sector: string; province: string; is_sez: boolean }) => api.post('/impact/job-creation', data).then(r => r.data),
  calculateGDPContribution: (data: { investment_amount: number; sector: string; years?: number }) => api.post('/impact/gdp-contribution', data).then(r => r.data),
  runMonteCarlo: (data: { investment_amount: number; sector: string; num_simulations?: number; scenario?: string }) => api.post('/impact/monte-carlo', data).then(r => r.data),
  generateROITimeline: (data: { investment_amount: number; sector: string }) => api.post('/impact/roi-timeline', data).then(r => r.data),
  getComprehensiveReport: (data: { investment_amount: number; sector: string; province: string }) => api.post('/impact/comprehensive-report', data).then(r => r.data),
  getSectorBenchmarks: () => api.get('/impact/sector-benchmarks').then(r => r.data),
};

export const matching = {
  investorToOpportunities: (investorId: string, topN = 10) => api.post(`/matching/investor-to-opportunities/${investorId}?top_n=${topN}`).then(r => r.data),
  opportunityToInvestors: (oppId: string, topN = 10) => api.post(`/matching/opportunity-to-investors/${oppId}?top_n=${topN}`).then(r => r.data),
  analyseInquiry: (text: string) => api.post('/matching/analyse-inquiry', { inquiry_text: text }).then(r => r.data),
  getSimilarityNetwork: () => api.get('/matching/similarity-network').then(r => r.data),
  getMatchScore: (investorId: string, oppId: string) => api.get(`/matching/match-score/${investorId}/${oppId}`).then(r => r.data),
  getProactiveRecommendations: () => api.get('/matching/recommendations/proactive').then(r => r.data),
  getInvestors: () => api.get('/matching/investors').then(r => r.data),
  createInvestor: (data: Record<string, unknown>) => api.post('/matching/investors', data).then(r => r.data),
  getOpportunities: () => api.get('/matching/opportunities').then(r => r.data),
};

export const investments = {
  list: (params?: Record<string, unknown>) => api.get('/investments', { params }).then(r => r.data),
  getById: (id: string) => api.get(`/investments/${id}`).then(r => r.data),
  create: (data: Record<string, unknown>) => api.post('/investments', data).then(r => r.data),
  getStats: () => api.get('/investments/stats/summary').then(r => r.data),
  bySector: () => api.get('/investments/by-sector').then(r => r.data),
  byProvince: () => api.get('/investments/by-province').then(r => r.data),
};

export const auth = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }).then(r => r.data),
  register: (data: Record<string, unknown>) => api.post('/auth/register', data).then(r => r.data),
  getProfile: () => api.get('/auth/me').then(r => r.data),
};

export default api;
