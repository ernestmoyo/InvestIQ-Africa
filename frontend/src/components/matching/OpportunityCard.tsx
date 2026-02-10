import { MapPin, DollarSign, Briefcase, Clock, ArrowRight } from 'lucide-react';

interface Opportunity {
  id?: string;
  title: string;
  sector: string;
  province: string;
  investmentRequired: number;
  expectedReturn: number;
  riskLevel: string;
  status: string;
  description?: string;
  sezName?: string;
}

interface Props { opportunity: Opportunity; matchScore?: number; onClick?: () => void }

const statusColors: Record<string, string> = {
  open: 'bg-green-100 text-green-700', active: 'bg-blue-100 text-blue-700',
  closed: 'bg-gray-100 text-gray-600', pending: 'bg-yellow-100 text-yellow-700',
};

export default function OpportunityCard({ opportunity, matchScore, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-green-200 transition-all' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">{opportunity.title}</h4>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1">
              <Briefcase size={12} className="text-gray-400" />
              <span className="text-xs text-gray-500">{opportunity.sector}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-gray-400" />
              <span className="text-xs text-gray-500">{opportunity.province}</span>
            </div>
          </div>
        </div>
        {matchScore !== undefined && (
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${matchScore >= 80 ? 'bg-green-100 text-green-700' : matchScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
              {matchScore}%
            </div>
            <span className="text-[10px] text-gray-400 mt-0.5">match</span>
          </div>
        )}
      </div>

      {opportunity.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{opportunity.description}</p>
      )}

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <DollarSign size={14} className="mx-auto text-gray-400 mb-0.5" />
          <p className="text-xs text-gray-500">Required</p>
          <p className="text-sm font-semibold">${opportunity.investmentRequired}M</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <Clock size={14} className="mx-auto text-gray-400 mb-0.5" />
          <p className="text-xs text-gray-500">Return</p>
          <p className="text-sm font-semibold">{opportunity.expectedReturn}%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <span className={`text-xs font-medium ${opportunity.riskLevel === 'low' ? 'text-green-600' : opportunity.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
            {opportunity.riskLevel}
          </span>
          <p className="text-xs text-gray-500">Risk</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[opportunity.status] || 'bg-gray-100 text-gray-600'}`}>
          {opportunity.status}
        </span>
        {opportunity.sezName && (
          <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded">SEZ: {opportunity.sezName}</span>
        )}
        {onClick && <ArrowRight size={14} className="text-gray-400" />}
      </div>
    </div>
  );
}
