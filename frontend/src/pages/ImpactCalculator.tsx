import { useState } from 'react';
import { Calculator, Users, TrendingUp, Layers, BarChart3 } from 'lucide-react';
import JobCreationCalc from '../components/calculators/JobCreationCalc';
import GDPContributionCalc from '../components/calculators/GDPContributionCalc';
import ROITimelineCalc from '../components/calculators/ROITimelineCalc';
import MultiplierEffectCalc from '../components/calculators/MultiplierEffectCalc';
import MonteCarloDistribution from '../components/charts/MonteCarloDistribution';

const tabs = [
  { key: 'jobs', label: 'Job Creation', icon: Users },
  { key: 'gdp', label: 'GDP Contribution', icon: TrendingUp },
  { key: 'roi', label: 'ROI Timeline', icon: BarChart3 },
  { key: 'multiplier', label: 'Multiplier Effect', icon: Layers },
  { key: 'montecarlo', label: 'Monte Carlo', icon: Calculator },
] as const;

// Mock Monte Carlo data
const mcBins = Array.from({ length: 20 }, (_, i) => ({
  range: `${(50 + i * 10).toFixed(0)}-${(60 + i * 10).toFixed(0)}`,
  count: Math.round(Math.exp(-((i - 10) ** 2) / 20) * 500 + Math.random() * 30),
  midpoint: 55 + i * 10,
}));
const mcStats = { mean: 152.3, median: 148.7, p5: 85.2, p95: 225.8, var95: 90.1 };

export default function ImpactCalculator() {
  const [activeTab, setActiveTab] = useState<string>('jobs');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="text-green-600" size={24} />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Investment Impact Calculator</h2>
            <p className="text-sm text-gray-500">Quantify the economic impact of foreign direct investments in Zimbabwe</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {tabs.map(tab => {
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

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {activeTab === 'jobs' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Job Creation Estimator</h3>
            <p className="text-xs text-gray-500 mb-4">
              Estimate direct, indirect, and induced employment based on sector-specific multipliers derived from Zimbabwe economic data.
            </p>
            <JobCreationCalc />
          </div>
        )}
        {activeTab === 'gdp' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">GDP Contribution Analysis</h3>
            <p className="text-xs text-gray-500 mb-4">
              Calculate the direct and multiplied GDP impact using Leontief input-output modeling calibrated for the Zimbabwe economy.
            </p>
            <GDPContributionCalc />
          </div>
        )}
        {activeTab === 'roi' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">ROI Timeline Generator</h3>
            <p className="text-xs text-gray-500 mb-4">
              Project return on investment over time with IRR, NPV, and payback period calculations.
            </p>
            <ROITimelineCalc />
          </div>
        )}
        {activeTab === 'multiplier' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Economic Multiplier Effect</h3>
            <p className="text-xs text-gray-500 mb-4">
              Visualize how investment dollars flow through the Zimbabwe economy — from direct impact to indirect and induced effects.
            </p>
            <MultiplierEffectCalc />
          </div>
        )}
        {activeTab === 'montecarlo' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Monte Carlo Risk Simulation</h3>
            <p className="text-xs text-gray-500 mb-4">
              Run 10,000 simulations to understand the probability distribution of investment outcomes under different scenarios.
            </p>
            <div className="mb-4 grid grid-cols-3 gap-3">
              {['Base Case', 'Optimistic', 'Pessimistic'].map((scenario, i) => (
                <button
                  key={i}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                    i === 0 ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {scenario}
                </button>
              ))}
            </div>
            <MonteCarloDistribution bins={mcBins} stats={mcStats} height={300} />
          </div>
        )}
      </div>

      {/* Methodology Note */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <h4 className="text-xs font-semibold text-gray-600 mb-2">Methodology</h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          Impact calculations use sector-specific economic multipliers from ZIMSTAT and World Bank Zimbabwe economic surveys.
          Job creation estimates apply Type II input-output multipliers accounting for direct, indirect (supply chain), and induced (household spending) effects.
          Monte Carlo simulations sample from calibrated probability distributions to generate outcome ranges at specified confidence intervals.
        </p>
      </div>
    </div>
  );
}
