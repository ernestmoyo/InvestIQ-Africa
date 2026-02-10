import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

interface TimelinePoint { year: number; cumulativeReturn: number; cumulativeInvestment: number; netCashFlow: number }
interface Props { data: TimelinePoint[]; height?: number }

export default function InvestmentTimeline({ data, height = 320 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: 'Year', position: 'bottom', fontSize: 11, fill: '#6b7280' }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${v}M`} />
        <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: number, name: string) => [`$${v.toFixed(1)}M`, name]} />
        <Legend />
        <Line type="monotone" dataKey="cumulativeReturn" name="Cumulative Return" stroke={CHART_COLORS.green} strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="cumulativeInvestment" name="Investment" stroke={CHART_COLORS.palette[3]} strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="netCashFlow" name="Net Cash Flow" stroke={CHART_COLORS.gold} strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
