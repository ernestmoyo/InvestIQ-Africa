export interface Investment {
  id: string; project_name: string; investor_name: string; investor_country: string;
  investment_amount_usd: number; jobs_created: number; jobs_projected: number;
  licence_type: string; status: string; province: string; district: string;
  local_content_percentage: number; technology_transfer: boolean; export_oriented: boolean;
  date_received?: string; date_approved?: string;
}
export interface Sector {
  id: string; name: string; code: string; description?: string;
  avg_return_rate: number; risk_score: number; growth_rate_5yr: number;
  contribution_to_gdp: number; employment_multiplier: number; priority_sector: boolean;
}
export interface SEZ {
  id: string; name: string; location_province: string; total_area_hectares: number;
  occupied_percentage: number; incentive_package: Record<string, unknown>;
  target_sectors: string[]; total_investment_attracted: number; total_jobs_created: number;
}
export interface MacroIndicator { id: string; indicator_name: string; value: number; period: string; source: string; unit: string; }
export interface ForecastPoint { date: string; value: number; lower_bound?: number; upper_bound?: number; is_forecast: boolean; }
export interface SectorRiskReturn { sector_name: string; sector_code: string; avg_return: number; volatility: number; sharpe_ratio: number; beta: number; total_investment: number; investment_count: number; }
export interface AllocationItem { sector: string; sector_code: string; amount: number; percentage: number; expected_return: number; }
export interface DashboardSummary { total_fdi_ytd: number; active_investments: number; total_jobs: number; pending_inquiries: number; sector_breakdown: Array<{name: string; value: number; count: number}>; monthly_trend: Array<{month: string; value: number}>; top_investors: Array<{name: string; country: string; amount: number; sector: string}>; province_distribution: Array<{province: string; value: number; count: number}>; }
export interface JobCreationResult { direct_jobs: number; indirect_jobs: number; induced_jobs: number; total_jobs: number; skills_distribution: Record<string, number>; gender_split: {male: number; female: number}; construction_phase: number; operational_phase: number; }
export interface GDPContribution { direct_gdp: number; multiplier_effect: number; total_gdp: number; tax_revenue: Record<string, number>; forex_generation: number; year_by_year: Array<{year: number; gdp: number; cumulative: number}>; }
export interface MonteCarloResult { mean: number; median: number; std: number; percentile_5: number; percentile_25: number; percentile_75: number; percentile_95: number; var_95: number; expected_shortfall: number; distribution: number[]; }
export interface ROITimeline { years: number[]; capex: number[]; revenue: number[]; opex: number[]; cash_flow: number[]; cumulative_cash_flow: number[]; npv: Record<string, number>; irr: number; breakeven_year: number; }
export interface MatchScoreBreakdown { sector_alignment: number; size_fit: number; risk_compatibility: number; geographic_match: number; sez_alignment: number; historical_similarity: number; semantic_match: number; }
export interface MatchResult { id: string; name: string; overall_score: number; score_breakdown: MatchScoreBreakdown; rank: number; explanation: string; }
export interface InquiryAnalysis { extracted_sectors: string[]; investment_size_indicator?: string; timeline?: string; concerns: string[]; inquiry_type: string; sentiment: string; recommended_department: string; suggested_response: string; }
export interface InvestorProfile { id: string; company_name: string; country_of_origin: string; investor_type: string; sectors_of_interest: string[]; investment_range_min: number; investment_range_max: number; risk_appetite: string; engagement_score: number; }
export interface InvestmentOpportunity { id: string; title: string; description?: string; province?: string; minimum_investment: number; maximum_investment: number; expected_return_rate: number; risk_level: string; status: string; tags: string[]; }
export interface PaginatedResponse<T> { items: T[]; total: number; page: number; per_page: number; }
