import { useState } from 'react';
import { Users, TrendingUp, Building2 } from 'lucide-react';
import { SECTORS } from '../../utils/constants';

interface JobResult { direct: number; indirect: number; induced: number; total: number; costPerJob: number }

interface Props {
  onCalculate?: (sector: string, amount: number) => void;
  result?: JobResult | null;
  isLoading?: boolean;
}

const MULTIPLIERS: Record<string, { direct: number; indirect: number; induced: number }> = {
  MIN: { direct: 2.1, indirect: 1.8, induced: 1.3 },
  AGR: { direct: 8.5, indirect: 4.2, induced: 3.1 },
  TOU: { direct: 6.2, indirect: 3.5, induced: 2.8 },
  MAN: { direct: 4.8, indirect: 2.9, induced: 2.1 },
  ICT: { direct: 3.5, indirect: 2.8, induced: 2.0 },
  ENR: { direct: 1.8, indirect: 1.5, induced: 1.1 },
  INF: { direct: 5.5, indirect: 3.8, induced: 2.5 },
  FIN: { direct: 2.5, indirect: 2.0, induced: 1.6 },
  HLT: { direct: 4.0, indirect: 2.5, induced: 1.8 },
};

export default function JobCreationCalc({ onCalculate, result: externalResult, isLoading }: Props) {
  const [sector, setSector] = useState('MIN');
  const [amount, setAmount] = useState(100);
  const [localResult, setLocalResult] = useState<JobResult | null>(null);

  const result = externalResult ?? localResult;

  const calculate = () => {
    if (onCalculate) {
      onCalculate(sector, amount);
      return;
    }
    const m = MULTIPLIERS[sector];
    const direct = Math.round(amount * m.direct);
    const indirect = Math.round(amount * m.indirect);
    const induced = Math.round(amount * m.induced);
    const total = direct + indirect + induced;
    setLocalResult({ direct, indirect, induced, total, costPerJob: Math.round((amount * 1e6) / total) });
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
        {isLoading ? 'Calculating...' : 'Calculate Job Impact'}
      </button>

      {result && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-green-50 rounded-lg p-3 flex items-center gap-3">
            <Users className="text-green-600" size={20} />
            <div>
              <p className="text-xs text-green-600">Direct Jobs</p>
              <p className="text-lg font-bold text-green-800">{result.direct.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 flex items-center gap-3">
            <TrendingUp className="text-yellow-600" size={20} />
            <div>
              <p className="text-xs text-yellow-600">Indirect Jobs</p>
              <p className="text-lg font-bold text-yellow-800">{result.indirect.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-3">
            <Building2 className="text-blue-600" size={20} />
            <div>
              <p className="text-xs text-blue-600">Induced Jobs</p>
              <p className="text-lg font-bold text-blue-800">{result.induced.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 flex items-center gap-3">
            <Users className="text-purple-600" size={20} />
            <div>
              <p className="text-xs text-purple-600">Total Jobs</p>
              <p className="text-lg font-bold text-purple-800">{result.total.toLocaleString()}</p>
            </div>
          </div>
          <div className="col-span-2 bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Cost per Job Created</p>
            <p className="text-xl font-bold text-gray-800">${result.costPerJob.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
