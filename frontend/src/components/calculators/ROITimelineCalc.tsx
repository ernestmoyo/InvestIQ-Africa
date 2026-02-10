import { useState } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import InvestmentTimeline from '../charts/InvestmentTimeline';
import { SECTORS } from '../../utils/constants';

interface Props {
  onCalculate?: (sector: string, amount: number, years: number) => void;
  isLoading?: boolean;
}

const SECTOR_ROI: Record<string, number> = {
  MIN: 0.18, AGR: 0.12, TOU: 0.15, MAN: 0.14, ICT: 0.22, ENR: 0.10, INF: 0.08, FIN: 0.16, HLT: 0.11,
};

export default function ROITimelineCalc({ onCalculate, isLoading }: Props) {
  const [sector, setSector] = useState('MIN');
  const [amount, setAmount] = useState(100);
  const [years, setYears] = useState(10);
  const [data, setData] = useState<any[] | null>(null);
  const [metrics, setMetrics] = useState<{ irr: number; payback: number; npv: number } | null>(null);

  const calculate = () => {
    if (onCalculate) { onCalculate(sector, amount, years); return; }
    const roi = SECTOR_ROI[sector];
    const timeline: any[] = [];
    let cumReturn = 0;
    let paybackYear = years;

    for (let y = 1; y <= years; y++) {
      const annualReturn = amount * roi * (1 + (y - 1) * 0.03);
      cumReturn += annualReturn;
      timeline.push({
        year: y,
        cumulativeReturn: Number(cumReturn.toFixed(1)),
        cumulativeInvestment: amount,
        netCashFlow: Number((cumReturn - amount).toFixed(1)),
      });
      if (cumReturn >= amount && paybackYear === years) paybackYear = y;
    }

    setData(timeline);
    setMetrics({ irr: roi * 100, payback: paybackYear, npv: Number((cumReturn - amount).toFixed(1)) });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Sector</label>
          <select value={sector} onChange={e => setSector(e.target.value)} className="input-field text-sm">
            {SECTORS.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Investment ($M)</label>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="input-field text-sm" min={1} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Timeline (Years)</label>
          <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="input-field text-sm" min={1} max={30} />
        </div>
      </div>
      <button onClick={calculate} disabled={isLoading} className="btn-primary w-full text-sm">
        {isLoading ? 'Generating...' : 'Generate ROI Timeline'}
      </button>

      {metrics && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <TrendingUp className="mx-auto text-green-600 mb-1" size={18} />
            <p className="text-xs text-green-600">IRR</p>
            <p className="text-lg font-bold text-green-800">{metrics.irr.toFixed(1)}%</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <Calendar className="mx-auto text-blue-600 mb-1" size={18} />
            <p className="text-xs text-blue-600">Payback</p>
            <p className="text-lg font-bold text-blue-800">{metrics.payback} yrs</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <TrendingUp className="mx-auto text-yellow-600 mb-1" size={18} />
            <p className="text-xs text-yellow-600">NPV</p>
            <p className="text-lg font-bold text-yellow-800">${metrics.npv}M</p>
          </div>
        </div>
      )}

      {data && <InvestmentTimeline data={data} height={260} />}
    </div>
  );
}
