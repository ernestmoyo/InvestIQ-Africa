import { useState } from 'react';
import { TrendingUp, PieChart, DollarSign } from 'lucide-react';
import { SECTORS } from '../../utils/constants';

interface GDPResult { directContribution: number; indirectContribution: number; totalContribution: number; gdpPercentage: number; taxRevenue: number }

interface Props {
  onCalculate?: (sector: string, amount: number) => void;
  result?: GDPResult | null;
  isLoading?: boolean;
}

const GDP_MULTIPLIERS: Record<string, number> = {
  MIN: 1.45, AGR: 1.65, TOU: 1.55, MAN: 1.70, ICT: 1.80, ENR: 1.40, INF: 1.75, FIN: 1.50, HLT: 1.60,
};

const ZIMBABWE_GDP = 28400; // $M approximate

export default function GDPContributionCalc({ onCalculate, result: externalResult, isLoading }: Props) {
  const [sector, setSector] = useState('MIN');
  const [amount, setAmount] = useState(100);
  const [localResult, setLocalResult] = useState<GDPResult | null>(null);

  const result = externalResult ?? localResult;

  const calculate = () => {
    if (onCalculate) { onCalculate(sector, amount); return; }
    const multiplier = GDP_MULTIPLIERS[sector];
    const direct = amount * 0.85;
    const indirect = amount * (multiplier - 1);
    const total = direct + indirect;
    setLocalResult({
      directContribution: direct,
      indirectContribution: indirect,
      totalContribution: total,
      gdpPercentage: (total / ZIMBABWE_GDP) * 100,
      taxRevenue: total * 0.18,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
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
      </div>
      <button onClick={calculate} disabled={isLoading} className="btn-primary w-full text-sm">
        {isLoading ? 'Calculating...' : 'Calculate GDP Impact'}
      </button>

      {result && (
        <div className="space-y-3 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="text-green-600" size={16} />
                <span className="text-xs text-green-600 font-medium">Direct GDP</span>
              </div>
              <p className="text-lg font-bold text-green-800">${result.directContribution.toFixed(1)}M</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="text-yellow-600" size={16} />
                <span className="text-xs text-yellow-600 font-medium">Indirect GDP</span>
              </div>
              <p className="text-lg font-bold text-yellow-800">${result.indirectContribution.toFixed(1)}M</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <PieChart className="mx-auto text-blue-600 mb-1" size={24} />
            <p className="text-xs text-blue-600 font-medium">Total GDP Contribution</p>
            <p className="text-2xl font-bold text-blue-800">${result.totalContribution.toFixed(1)}M</p>
            <p className="text-xs text-blue-500 mt-1">{result.gdpPercentage.toFixed(3)}% of Zimbabwe GDP</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Estimated Tax Revenue</p>
            <p className="text-lg font-bold text-gray-800">${result.taxRevenue.toFixed(1)}M</p>
          </div>
        </div>
      )}
    </div>
  );
}
