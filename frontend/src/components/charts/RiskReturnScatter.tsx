import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

interface SectorPoint { name: string; risk: number; return: number; size: number }
interface Props { data: SectorPoint[]; height?: number }

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-gray-900 mb-1">{d.name}</p>
      <p>Risk Score: <span className="font-medium">{d.risk.toFixed(1)}</span></p>
      <p>Expected Return: <span className="font-medium">{d.return.toFixed(1)}%</span></p>
      <p>Investment Size: <span className="font-medium">${d.size}M</span></p>
    </div>
  );
};

export default function RiskReturnScatter({ data, height = 320 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis type="number" dataKey="risk" name="Risk" tick={{ fontSize: 11 }} label={{ value: 'Risk Score', position: 'bottom', fontSize: 11, fill: '#6b7280' }} />
        <YAxis type="number" dataKey="return" name="Return" tick={{ fontSize: 11 }} label={{ value: 'Return %', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#6b7280' }} />
        <ZAxis type="number" dataKey="size" range={[80, 600]} />
        <Tooltip content={<CustomTooltip />} />
        <Scatter data={data} name="Sectors">
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS.palette[i % CHART_COLORS.palette.length]} fillOpacity={0.8} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
