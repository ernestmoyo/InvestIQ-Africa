interface ScoreBreakdown {
  sectorAlignment: number;
  sizeCompatibility: number;
  riskMatch: number;
  geographicFit: number;
  sezBonus: number;
  historicalPerformance: number;
  semanticSimilarity: number;
}

interface Props { totalScore: number; breakdown: ScoreBreakdown; size?: 'sm' | 'md' | 'lg' }

const DIMENSIONS = [
  { key: 'sectorAlignment', label: 'Sector Alignment', max: 25, color: '#009739' },
  { key: 'sizeCompatibility', label: 'Size Compatibility', max: 20, color: '#2563eb' },
  { key: 'riskMatch', label: 'Risk Match', max: 15, color: '#7c3aed' },
  { key: 'geographicFit', label: 'Geographic Fit', max: 10, color: '#d97706' },
  { key: 'sezBonus', label: 'SEZ Bonus', max: 10, color: '#059669' },
  { key: 'historicalPerformance', label: 'Historical', max: 10, color: '#dc2626' },
  { key: 'semanticSimilarity', label: 'Semantic Match', max: 10, color: '#6366f1' },
];

export default function MatchScoreDisplay({ totalScore, breakdown, size = 'md' }: Props) {
  const circleSize = size === 'sm' ? 80 : size === 'lg' ? 160 : 120;
  const radius = circleSize / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  const scoreColor = totalScore >= 80 ? '#009739' : totalScore >= 60 ? '#d97706' : '#dc2626';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: circleSize, height: circleSize }}>
        <svg width={circleSize} height={circleSize} className="-rotate-90">
          <circle cx={circleSize / 2} cy={circleSize / 2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={size === 'sm' ? 6 : 8} />
          <circle
            cx={circleSize / 2} cy={circleSize / 2} r={radius} fill="none"
            stroke={scoreColor} strokeWidth={size === 'sm' ? 6 : 8}
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-4xl' : 'text-2xl'}`} style={{ color: scoreColor }}>
            {totalScore}
          </span>
          {size !== 'sm' && <span className="text-xs text-gray-400">/ 100</span>}
        </div>
      </div>

      {size !== 'sm' && (
        <div className="w-full mt-4 space-y-2">
          {DIMENSIONS.map(dim => {
            const value = breakdown[dim.key as keyof ScoreBreakdown] ?? 0;
            const pct = (value / dim.max) * 100;
            return (
              <div key={dim.key}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-600">{dim.label}</span>
                  <span className="font-medium">{value}/{dim.max}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: dim.color }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
