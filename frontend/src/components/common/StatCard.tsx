import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: ReactNode;
  color?: 'green' | 'gold' | 'red' | 'blue';
}

const colorMap = {
  green: 'bg-green-50 text-[#009739]',
  gold: 'bg-yellow-50 text-[#d97706]',
  red: 'bg-red-50 text-[#D21034]',
  blue: 'bg-blue-50 text-blue-600',
};

export default function StatCard({ title, value, change, changeType = 'increase', icon, color = 'green' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-500'}`}>
              {changeType === 'increase' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
