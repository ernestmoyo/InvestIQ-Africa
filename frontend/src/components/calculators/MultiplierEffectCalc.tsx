import { useState } from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import ImpactSankey from '../charts/ImpactSankey';
import { SECTORS } from '../../utils/constants';

interface Props {
  onCalculate?: (sector: string, amount: number) => void;
  isLoading?: boolean;
}

const MULTIPLIERS: Record<string, { output: number; employment: number; income: number }> = {
  MIN: { output: 1.45, employment: 1.35, income: 1.30 },
  AGR: { output: 1.65, employment: 2.10, income: 1.55 },
  TOU: { output: 1.55, employment: 1.85, income: 1.50 },
  MAN: { output: 1.70, employment: 1.75, income: 1.60 },
  ICT: { output: 1.80, employment: 1.60, income: 1.70 },
  ENR: { output: 1.40, employment: 1.25, income: 1.20 },
  INF: { output: 1.75, employment: 2.00, income: 1.55 },
  FIN: { output: 1.50, employment: 1.40, income: 1.45 },
  HLT: { output: 1.60, employment: 1.70, income: 1.50 },
};

export default function MultiplierEffectCalc({ onCalculate, isLoading }: Props) {
  const [sector, setSector] = useState('MIN');
  const [amount, setAmount] = useState(100);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    if (onCalculate) { onCalculate(sector, amount); return; }
    const m = MULTIPLIERS[sector];
    const direct = amount * 0.85;
    const indirect = amount * (m.output - 1) * 0.6;
    const induced = amount * (m.output - 1) * 0.4;
    const totalJobs = Math.round(amount * m.employment * 5);
    const taxRevenue = (direct + indirect + induced) * 0.18;

    setResult({ investment: amount, direct, indirect, induced, totalJobs, taxRevenue });
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
        {isLoading ? 'Calculating...' : 'Analyze Multiplier Effect'}
      </button>

      {result && (
        <>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Output Multiplier', value: MULTIPLIERS[sector].output.toFixed(2), color: 'bg-green-50 text-green-800' },
              { label: 'Employment Multiplier', value: MULTIPLIERS[sector].employment.toFixed(2), color: 'bg-blue-50 text-blue-800' },
              { label: 'Income Multiplier', value: MULTIPLIERS[sector].income.toFixed(2), color: 'bg-yellow-50 text-yellow-800' },
            ].map((m, i) => (
              <div key={i} className={`rounded-lg p-3 ${m.color}`}>
                <Layers size={16} className="mx-auto mb-1" />
                <p className="text-xs font-medium opacity-70">{m.label}</p>
                <p className="text-xl font-bold">{m.value}x</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight size={16} className="text-gray-500" />
              <h4 className="text-sm font-semibold text-gray-700">Impact Flow</h4>
            </div>
            <ImpactSankey data={result} height={250} />
          </div>
        </>
      )}
    </div>
  );
}
