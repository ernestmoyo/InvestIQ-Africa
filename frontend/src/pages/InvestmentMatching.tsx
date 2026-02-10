import { useState } from 'react';
import { Search, Users, Building2, Network, MessageSquare } from 'lucide-react';
import InvestorProfileCard from '../components/matching/InvestorProfileCard';
import OpportunityCard from '../components/matching/OpportunityCard';
import MatchScoreDisplay from '../components/matching/MatchScoreDisplay';
import SimilarityNetwork from '../components/matching/SimilarityNetwork';

const sampleInvestors = [
  { id: '1', name: 'Karo Holdings Ltd', country: 'Cyprus', type: 'corporate', sectors: ['Mining'], budgetMin: 500, budgetMax: 5000, riskTolerance: 'high', description: 'Large-scale platinum group metals mining operations' },
  { id: '2', name: 'Green Fuel Pvt Ltd', country: 'Zimbabwe', type: 'corporate', sectors: ['Agriculture', 'Energy'], budgetMin: 100, budgetMax: 800, riskTolerance: 'medium', description: 'Ethanol production and sugarcane farming' },
  { id: '3', name: 'Cassava Smartech', country: 'Zimbabwe', type: 'corporate', sectors: ['ICT', 'Financial Services'], budgetMin: 50, budgetMax: 300, riskTolerance: 'medium', description: 'Fintech and digital services' },
  { id: '4', name: 'Zhejiang Huayou', country: 'China', type: 'corporate', sectors: ['Mining'], budgetMin: 200, budgetMax: 500, riskTolerance: 'medium', description: 'Lithium mining and battery materials' },
];

const sampleOpportunities = [
  { id: '1', title: 'Darwendale Platinum Mine', sector: 'Mining', province: 'Mashonaland West', investmentRequired: 4200, expectedReturn: 18, riskLevel: 'high', status: 'open', description: 'World-class PGM deposit' },
  { id: '2', title: 'Nyamingura Solar Farm', sector: 'Energy', province: 'Manicaland', investmentRequired: 150, expectedReturn: 12, riskLevel: 'low', status: 'open', sezName: 'Feruka-Mutare' },
  { id: '3', title: 'Arcadia Lithium Mine', sector: 'Mining', province: 'Harare', investmentRequired: 300, expectedReturn: 22, riskLevel: 'medium', status: 'active' },
  { id: '4', title: 'Victoria Falls Resort Expansion', sector: 'Tourism', province: 'Matabeleland North', investmentRequired: 80, expectedReturn: 15, riskLevel: 'low', status: 'open', sezName: 'Victoria Falls' },
  { id: '5', title: 'Beitbridge Logistics Hub', sector: 'Infrastructure', province: 'Matabeleland South', investmentRequired: 200, expectedReturn: 10, riskLevel: 'medium', status: 'open', sezName: 'Beitbridge' },
];

const sampleMatch = {
  totalScore: 82,
  breakdown: { sectorAlignment: 22, sizeCompatibility: 18, riskMatch: 12, geographicFit: 8, sezBonus: 8, historicalPerformance: 7, semanticSimilarity: 7 },
};

const networkNodes = [
  ...sampleInvestors.map(i => ({ id: `inv-${i.id}`, label: i.name.split(' ')[0], type: 'investor' as const, size: 20 })),
  ...sampleOpportunities.map(o => ({ id: `opp-${o.id}`, label: o.title.split(' ')[0], type: 'opportunity' as const, size: 15 })),
];
const networkEdges = [
  { source: 'inv-1', target: 'opp-1', weight: 0.92 }, { source: 'inv-1', target: 'opp-3', weight: 0.75 },
  { source: 'inv-2', target: 'opp-2', weight: 0.85 }, { source: 'inv-3', target: 'opp-5', weight: 0.60 },
  { source: 'inv-4', target: 'opp-3', weight: 0.88 }, { source: 'inv-4', target: 'opp-1', weight: 0.55 },
  { source: 'inv-2', target: 'opp-4', weight: 0.45 },
];

type TabKey = 'match' | 'investors' | 'opportunities' | 'network' | 'inquiry';

export default function InvestmentMatching() {
  const [activeTab, setActiveTab] = useState<TabKey>('match');
  const [selectedInvestor, setSelectedInvestor] = useState<string | null>('1');
  const [inquiryText, setInquiryText] = useState('');

  const tabItems = [
    { key: 'match' as TabKey, label: 'Match Engine', icon: Search },
    { key: 'investors' as TabKey, label: 'Investors', icon: Users },
    { key: 'opportunities' as TabKey, label: 'Opportunities', icon: Building2 },
    { key: 'network' as TabKey, label: 'Network', icon: Network },
    { key: 'inquiry' as TabKey, label: 'NLP Inquiry', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-3 mb-2">
          <Search className="text-green-600" size={24} />
          <div>
            <h2 className="text-lg font-bold text-gray-900">AI-Powered Investment Matching</h2>
            <p className="text-sm text-gray-500">Match investors with optimal opportunities using 7-dimension scoring</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {tabItems.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {activeTab === 'match' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Investor</h3>
              <div className="space-y-3">
                {sampleInvestors.map(inv => (
                  <div
                    key={inv.id}
                    onClick={() => setSelectedInvestor(inv.id)}
                    className={`cursor-pointer rounded-xl border-2 transition-all ${selectedInvestor === inv.id ? 'border-green-400' : 'border-transparent'}`}
                  >
                    <InvestorProfileCard investor={inv} compact />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Match Score</h3>
              <MatchScoreDisplay totalScore={sampleMatch.totalScore} breakdown={sampleMatch.breakdown} size="lg" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Matches</h3>
              <div className="space-y-3">
                {sampleOpportunities.slice(0, 3).map((opp, i) => (
                  <OpportunityCard key={opp.id} opportunity={opp} matchScore={[92, 78, 65][i]} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investors' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Investor Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleInvestors.map(inv => (
                <InvestorProfileCard key={inv.id} investor={inv} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Investment Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleOpportunities.map(opp => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Investor-Opportunity Similarity Network</h3>
            <SimilarityNetwork nodes={networkNodes} edges={networkEdges} height={450} />
          </div>
        )}

        {activeTab === 'inquiry' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">NLP Investment Inquiry Analysis</h3>
            <p className="text-xs text-gray-500 mb-4">
              Paste an investment inquiry email or description and our NLP engine will extract key parameters and match against opportunities.
            </p>
            <textarea
              value={inquiryText}
              onChange={e => setInquiryText(e.target.value)}
              placeholder="e.g. We are a South African mining company looking to invest $200-500M in lithium extraction in Zimbabwe, preferably within a Special Economic Zone..."
              className="input-field text-sm h-32 resize-none"
            />
            <button className="btn-primary w-full mt-3 text-sm">Analyze Inquiry</button>
            {inquiryText.length > 50 && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <h4 className="text-sm font-semibold text-green-800 mb-2">Extracted Parameters</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-500">Sector:</span> <span className="font-medium">Mining</span></div>
                  <div><span className="text-gray-500">Budget:</span> <span className="font-medium">$200-500M</span></div>
                  <div><span className="text-gray-500">Origin:</span> <span className="font-medium">South Africa</span></div>
                  <div><span className="text-gray-500">SEZ Preference:</span> <span className="font-medium">Yes</span></div>
                  <div><span className="text-gray-500">Sentiment:</span> <span className="font-medium text-green-600">Positive</span></div>
                  <div><span className="text-gray-500">Classification:</span> <span className="font-medium">Serious Inquiry</span></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
