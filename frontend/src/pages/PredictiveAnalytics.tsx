import { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import FDITrendChart from '../components/charts/FDITrendChart';
import RiskReturnScatter from '../components/charts/RiskReturnScatter';
import SectorHeatmap from '../components/charts/SectorHeatmap';
import StatCard from '../components/common/StatCard';
import { SECTORS } from '../utils/constants';

// Mock FDI trend data with forecast
const fdiData = Array.from({ length: 24 }, (_, i) => {
  const isHistory = i < 18;
  const base = 150 + i * 4 + Math.sin(i * 0.5) * 20;
  return {
    month: new Date(2023, i, 1).toLocaleDateString('en', { month: 'short', year: '2-digit' }),
    actual: isHistory ? Math.round(base + Math.random() * 30) : 0,
    forecast: !isHistory ? Math.round(base + 10) : undefined,
    upper: !isHistory ? Math.round(base + 40) : undefined,
    lower: !isHistory ? Math.round(base - 20) : undefined,
  };
});

const riskReturnData = SECTORS.map((s, i) => ({
  name: s.name,
  risk: 2 + Math.random() * 8,
  return: 5 + Math.random() * 25,
  size: [9800, 743, 195, 113, 315, 1552, 1000, 85, 15][i],
}));

const sectorPerformance = SECTORS.map((s, i) => ({
  name: s.name,
  value: [9800, 743, 195, 113, 315, 1552, 1000, 85, 15][i],
  growth: [12, 8, -3, 5, 22, 15, 10, 2, 18][i],
}));

const portfolioAllocation = [
  { sector: 'Mining', weight: 35, expected: 14.2 },
  { sector: 'Energy', weight: 20, expected: 11.5 },
  { sector: 'Infrastructure', weight: 15, expected: 9.8 },
  { sector: 'Agriculture', weight: 12, expected: 12.1 },
  { sector: 'ICT', weight: 10, expected: 22.3 },
  { sector: 'Tourism', weight: 8, expected: 15.4 },
];

export default function PredictiveAnalytics() {
  const [forecastSector, setForecastSector] = useState<string>('all');
  const [forecastHorizon, setForecastHorizon] = useState(6);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Forecast FDI (6mo)" value="$1.8B" change={8.3} changeType="increase" icon={<TrendingUp size={20} />} color="green" />
        <StatCard title="Model Accuracy" value="87.3%" change={2.1} changeType="increase" icon={<Activity size={20} />} color="blue" />
        <StatCard title="Sectors Analyzed" value="9" change={0} changeType="increase" icon={<PieChart size={20} />} color="gold" />
        <StatCard title="Risk Score (Avg)" value="4.2/10" change={0.5} changeType="decrease" icon={<BarChart3 size={20} />} color="red" />
      </div>

      {/* FDI Forecast */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">FDI Inflow Forecast (SARIMA Model)</h3>
          <div className="flex items-center gap-3">
            <select
              value={forecastSector}
              onChange={e => setForecastSector(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1"
            >
              <option value="all">All Sectors</option>
              {SECTORS.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
            </select>
            <select
              value={forecastHorizon}
              onChange={e => setForecastHorizon(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1"
            >
              <option value={3}>3 months</option>
              <option value={6}>6 months</option>
              <option value={12}>12 months</option>
            </select>
          </div>
        </div>
        <FDITrendChart data={fdiData} showForecast height={350} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk-Return Scatter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Sector Risk-Return Profile</h3>
          <RiskReturnScatter data={riskReturnData} height={320} />
          <p className="text-xs text-gray-400 mt-2 text-center">Bubble size = total sector investment value</p>
        </div>

        {/* Sector Heatmap */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Sector Performance Heatmap</h3>
          <SectorHeatmap data={sectorPerformance} layout="horizontal" height={320} />
        </div>
      </div>

      {/* Portfolio Optimization */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Optimal Portfolio Allocation (Modern Portfolio Theory)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b">
                <th className="text-left pb-2">Sector</th>
                <th className="text-right pb-2">Weight</th>
                <th className="text-right pb-2">Expected Return</th>
                <th className="text-left pb-2 pl-4">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {portfolioAllocation.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 text-sm">
                  <td className="py-2.5 font-medium text-gray-900">{item.sector}</td>
                  <td className="py-2.5 text-right text-gray-700">{item.weight}%</td>
                  <td className="py-2.5 text-right text-green-600 font-medium">{item.expected}%</td>
                  <td className="py-2.5 pl-4">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-green-500 transition-all" style={{ width: `${item.weight}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-green-700">
            <span className="font-semibold">Portfolio Sharpe Ratio: 1.42</span> — This allocation maximizes risk-adjusted returns based on historical sector performance and correlation analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
