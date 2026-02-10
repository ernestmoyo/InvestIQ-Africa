import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

interface SectorData { name: string; value: number; growth?: number }
interface Props { data: SectorData[]; layout?: 'vertical' | 'horizontal'; height?: number; valueLabel?: string }

const getHeatColor = (value: number, max: number) => {
  const ratio = value / max;
  if (ratio > 0.7) return CHART_COLORS.green;
  if (ratio > 0.4) return CHART_COLORS.gold;
  return CHART_COLORS.red;
};

export default function SectorHeatmap({ data, layout = 'vertical', height = 300, valueLabel = 'Value ($M)' }: Props) {
  const max = Math.max(...data.map(d => d.value));

  if (layout === 'horizontal') {
    return (
      <div className="grid grid-cols-3 gap-2" style={{ minHeight: height }}>
        {data.map((sector, i) => (
          <div
            key={i}
            className="rounded-lg p-3 flex flex-col justify-between text-white"
            style={{ backgroundColor: getHeatColor(sector.value, max), opacity: 0.5 + (sector.value / max) * 0.5 }}
          >
            <span className="text-xs font-medium">{sector.name}</span>
            <span className="text-lg font-bold">${sector.value}M</span>
            {sector.growth !== undefined && (
              <span className="text-xs">{sector.growth > 0 ? '+' : ''}{sector.growth}%</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis type="number" tick={{ fontSize: 10 }} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={75} />
        <Tooltip formatter={(v: number) => [`$${v}M`, valueLabel]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={CHART_COLORS.palette[i % CHART_COLORS.palette.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
