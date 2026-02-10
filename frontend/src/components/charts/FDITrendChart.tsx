import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

interface DataPoint { month: string; actual: number; forecast?: number; lower?: number; upper?: number }
interface Props { data: DataPoint[]; showForecast?: boolean; height?: number }

export default function FDITrendChart({ data, showForecast = false, height = 320 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <defs>
          <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.green} stopOpacity={0.15} />
            <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.palette[3]} stopOpacity={0.1} />
            <stop offset="95%" stopColor={CHART_COLORS.palette[3]} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
          formatter={(value: number) => [`$${value}M`, '']}
        />
        <Legend />
        <Area type="monotone" dataKey="actual" name="Actual FDI" stroke={CHART_COLORS.green} fill="url(#actualGrad)" strokeWidth={2} />
        {showForecast && (
          <>
            <Area type="monotone" dataKey="forecast" name="Forecast" stroke={CHART_COLORS.palette[3]} fill="url(#forecastGrad)" strokeWidth={2} strokeDasharray="6 3" />
            <Area type="monotone" dataKey="upper" name="Upper CI" stroke="#94a3b8" fill="none" strokeWidth={1} strokeDasharray="3 3" />
            <Area type="monotone" dataKey="lower" name="Lower CI" stroke="#94a3b8" fill="none" strokeWidth={1} strokeDasharray="3 3" />
          </>
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
