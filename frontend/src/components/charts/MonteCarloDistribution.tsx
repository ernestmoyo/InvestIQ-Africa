import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

interface DistBin { range: string; count: number; midpoint: number }
interface Stats { mean: number; median: number; p5: number; p95: number; var95: number }
interface Props { bins: DistBin[]; stats: Stats; height?: number }

export default function MonteCarloDistribution({ bins, stats, height = 320 }: Props) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={bins} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="range" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 11 }} label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#6b7280' }} />
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
          <ReferenceLine x={bins.findIndex(b => b.midpoint >= stats.mean)} stroke={CHART_COLORS.green} strokeWidth={2} strokeDasharray="6 3" label={{ value: 'Mean', position: 'top', fontSize: 10 }} />
          <ReferenceLine x={bins.findIndex(b => b.midpoint >= stats.var95)} stroke={CHART_COLORS.red} strokeWidth={2} strokeDasharray="6 3" label={{ value: 'VaR 95%', position: 'top', fontSize: 10 }} />
          <Bar dataKey="count" fill={CHART_COLORS.palette[3]} radius={[2, 2, 0, 0]} opacity={0.8} />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-5 gap-2 mt-3">
        {[
          { label: 'Mean', value: `$${stats.mean.toFixed(1)}M`, color: 'text-green-700' },
          { label: 'Median', value: `$${stats.median.toFixed(1)}M`, color: 'text-blue-700' },
          { label: '5th Pctl', value: `$${stats.p5.toFixed(1)}M`, color: 'text-yellow-700' },
          { label: '95th Pctl', value: `$${stats.p95.toFixed(1)}M`, color: 'text-purple-700' },
          { label: 'VaR 95%', value: `$${stats.var95.toFixed(1)}M`, color: 'text-red-700' },
        ].map((s, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
