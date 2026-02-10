import { CHART_COLORS } from '../../utils/constants';

interface ImpactFlow {
  investment: number;
  direct: number;
  indirect: number;
  induced: number;
  totalJobs: number;
  taxRevenue: number;
}

interface Props { data: ImpactFlow; height?: number }

export default function ImpactSankey({ data, height = 300 }: Props) {
  const total = data.direct + data.indirect + data.induced;
  const directPct = (data.direct / total) * 100;
  const indirectPct = (data.indirect / total) * 100;
  const inducedPct = (data.induced / total) * 100;

  return (
    <div style={{ height }} className="flex flex-col justify-center">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-xs text-green-600 font-medium">Investment</p>
          <p className="text-2xl font-bold text-green-800">${data.investment}M</p>
        </div>
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-gray-300">
          <path d="M5 20 L30 20 M25 14 L31 20 L25 26" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <div className="flex-1 space-y-2">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex justify-between items-center">
            <span className="text-xs font-medium text-emerald-700">Direct Impact</span>
            <span className="text-sm font-bold text-emerald-800">${data.direct.toFixed(1)}M</span>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex justify-between items-center">
            <span className="text-xs font-medium text-yellow-700">Indirect Impact</span>
            <span className="text-sm font-bold text-yellow-800">${data.indirect.toFixed(1)}M</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 flex justify-between items-center">
            <span className="text-xs font-medium text-blue-700">Induced Impact</span>
            <span className="text-sm font-bold text-blue-800">${data.induced.toFixed(1)}M</span>
          </div>
        </div>
      </div>

      <div className="w-full h-6 rounded-full overflow-hidden flex bg-gray-100">
        <div style={{ width: `${directPct}%` }} className="h-full" title={`Direct: ${directPct.toFixed(1)}%`}>
          <div className="h-full w-full" style={{ backgroundColor: CHART_COLORS.green }} />
        </div>
        <div style={{ width: `${indirectPct}%` }} className="h-full" title={`Indirect: ${indirectPct.toFixed(1)}%`}>
          <div className="h-full w-full" style={{ backgroundColor: CHART_COLORS.gold }} />
        </div>
        <div style={{ width: `${inducedPct}%` }} className="h-full" title={`Induced: ${inducedPct.toFixed(1)}%`}>
          <div className="h-full w-full" style={{ backgroundColor: CHART_COLORS.palette[3] }} />
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{data.totalJobs.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Jobs Created</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">${data.taxRevenue.toFixed(1)}M</p>
          <p className="text-xs text-gray-500">Tax Revenue</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{((total / data.investment) ).toFixed(2)}x</p>
          <p className="text-xs text-gray-500">Multiplier</p>
        </div>
      </div>
    </div>
  );
}
