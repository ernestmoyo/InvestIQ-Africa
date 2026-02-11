import { Building2, MapPin, DollarSign, Target } from 'lucide-react';

interface InvestorProfile {
  id?: string;
  name: string;
  country: string;
  type: string;
  sectors: string[];
  budgetMin: number;
  budgetMax: number;
  riskTolerance: string;
  description?: string;
}

interface Props { investor: InvestorProfile; compact?: boolean; onClick?: () => void }

const riskColors: Record<string, string> = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700' };

export default function InvestorProfileCard({ investor, compact = false, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-100 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md hover:border-green-200 transition-all' : ''} ${compact ? 'p-3' : 'p-5'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>{investor.name}</h4>
          <div className="flex items-center gap-1 mt-1">
            <MapPin size={12} className="text-gray-400" />
            <span className="text-xs text-gray-500">{investor.country}</span>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskColors[investor.riskTolerance] || 'bg-gray-100 text-gray-600'}`}>
          {investor.riskTolerance} risk
        </span>
      </div>

      {!compact && investor.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{investor.description}</p>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-gray-400" />
          <span className="text-xs text-gray-600 capitalize">{investor.type.replace('_', ' ')}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-gray-400" />
          <span className="text-xs text-gray-600">${investor.budgetMin}M - ${investor.budgetMax}M</span>
        </div>
        <div className="flex items-center gap-2">
          <Target size={14} className="text-gray-400" />
          <div className="flex flex-wrap gap-1">
            {investor.sectors.map((s, i) => (
              <span key={i} className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
