import { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { SECTORS, CHART_COLORS } from '../utils/constants';
import SectorHeatmap from '../components/charts/SectorHeatmap';
import RiskReturnScatter from '../components/charts/RiskReturnScatter';

const sectorDetails: Record<string, { fdi: number; jobs: number; growth: number; risk: number; return: number; projects: number; topInvestor: string; description: string }> = {
  MIN: { fdi: 9800, jobs: 45000, growth: 12, risk: 6.5, return: 18, projects: 32, topInvestor: 'Karo Holdings', description: 'Zimbabwe holds significant reserves of platinum, lithium, chrome, gold, and diamonds. The sector accounts for over 60% of export earnings.' },
  AGR: { fdi: 743, jobs: 25000, growth: 8, risk: 5.0, return: 12, projects: 18, topInvestor: 'Green Fuel', description: 'Key crops include tobacco, cotton, sugarcane, and maize. The sector employs over 60% of the population directly or indirectly.' },
  TOU: { fdi: 195, jobs: 8000, growth: -3, risk: 4.5, return: 15, projects: 12, topInvestor: 'African Sun', description: 'Victoria Falls is the crown jewel. Zimbabwe also offers great wildlife safaris, Eastern Highlands, and cultural tourism opportunities.' },
  MAN: { fdi: 113, jobs: 5000, growth: 5, risk: 5.5, return: 14, projects: 8, topInvestor: 'National Foods', description: 'Manufacturing includes food processing, textiles, chemicals, and light engineering. Import substitution drives growth.' },
  ICT: { fdi: 315, jobs: 3500, growth: 22, risk: 4.0, return: 22, projects: 15, topInvestor: 'Econet Wireless', description: 'Fastest growing sector with mobile money (EcoCash), broadband, fintech, and software development leading the charge.' },
  ENR: { fdi: 1552, jobs: 12000, growth: 15, risk: 3.5, return: 11, projects: 10, topInvestor: 'Sinohydro', description: 'Hydro, solar, and thermal power generation. Zimbabwe targets 5GW installed capacity by 2030 to address electricity shortages.' },
  INF: { fdi: 1000, jobs: 15000, growth: 10, risk: 4.0, return: 10, projects: 7, topInvestor: 'Dinson Steel', description: 'Road, rail, airport, and industrial infrastructure. Key corridor developments along the Beira-Harare and North-South routes.' },
  FIN: { fdi: 85, jobs: 2000, growth: 2, risk: 6.0, return: 16, projects: 5, topInvestor: 'CBZ Holdings', description: 'Banking, insurance, and microfinance. Financial inclusion efforts drive mobile banking and agent network expansion.' },
  HLT: { fdi: 15, jobs: 800, growth: 18, risk: 3.0, return: 11, projects: 3, topInvestor: 'Varun Beverages', description: 'Pharmaceutical manufacturing, hospital construction, and medical tourism. Massive unmet demand creates growth opportunities.' },
};

const overviewData = SECTORS.map(s => ({ name: s.name, value: sectorDetails[s.code].fdi }));
const radarData = SECTORS.map(s => ({
  name: s.name.split(' ')[0],
  growth: Math.max(0, sectorDetails[s.code].growth),
  return: sectorDetails[s.code].return,
  risk: 10 - sectorDetails[s.code].risk,
  jobs: sectorDetails[s.code].jobs / 5000,
}));

const riskReturnData = SECTORS.map(s => ({
  name: s.name,
  risk: sectorDetails[s.code].risk,
  return: sectorDetails[s.code].return,
  size: sectorDetails[s.code].fdi,
}));

export default function SectorAnalysis() {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const detail = selectedSector ? sectorDetails[selectedSector] : null;
  const sectorInfo = selectedSector ? SECTORS.find(s => s.code === selectedSector) : null;

  return (
    <div className="space-y-6">
      {/* Sector Grid */}
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
        {SECTORS.map(s => (
          <button
            key={s.code}
            onClick={() => setSelectedSector(selectedSector === s.code ? null : s.code)}
            className={`rounded-xl p-3 text-center transition-all border-2 ${
              selectedSector === s.code ? 'border-green-500 shadow-md' : 'border-transparent hover:border-gray-200'
            } bg-white shadow-sm`}
          >
            <div className="w-8 h-8 rounded-full mx-auto mb-1.5" style={{ backgroundColor: s.color, opacity: 0.2 }} />
            <p className="text-xs font-medium text-gray-700 truncate">{s.name.split(' ')[0]}</p>
            <p className="text-sm font-bold text-gray-900">${sectorDetails[s.code].fdi}M</p>
            <p className={`text-xs font-medium ${sectorDetails[s.code].growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {sectorDetails[s.code].growth > 0 ? '+' : ''}{sectorDetails[s.code].growth}%
            </p>
          </button>
        ))}
      </div>

      {/* Sector Detail */}
      {detail && sectorInfo && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: sectorInfo.color }} />
            <h3 className="text-lg font-bold text-gray-900">{sectorInfo.name}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">{detail.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'Total FDI', value: `$${detail.fdi}M` },
              { label: 'Jobs', value: detail.jobs.toLocaleString() },
              { label: 'Growth', value: `${detail.growth}%` },
              { label: 'Risk', value: `${detail.risk}/10` },
              { label: 'Return', value: `${detail.return}%` },
              { label: 'Projects', value: detail.projects.toString() },
              { label: 'Top Investor', value: detail.topInvestor },
            ].map((m, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">{m.label}</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FDI by Sector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">FDI by Sector ($M)</h3>
          <SectorHeatmap data={overviewData} height={300} />
        </div>

        {/* Risk-Return */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Risk-Return Analysis</h3>
          <RiskReturnScatter data={riskReturnData} height={300} />
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Multi-Dimensional Sector Comparison</h3>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis tick={{ fontSize: 9 }} />
            <Radar name="Growth" dataKey="growth" stroke={CHART_COLORS.green} fill={CHART_COLORS.green} fillOpacity={0.15} />
            <Radar name="Return" dataKey="return" stroke={CHART_COLORS.palette[3]} fill={CHART_COLORS.palette[3]} fillOpacity={0.1} />
            <Radar name="Safety (10-Risk)" dataKey="risk" stroke={CHART_COLORS.gold} fill={CHART_COLORS.gold} fillOpacity={0.1} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
