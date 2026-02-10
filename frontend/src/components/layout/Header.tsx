import { useLocation } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/': 'Executive Dashboard',
  '/analytics': 'Predictive Analytics',
  '/impact-calculator': 'Investment Impact Calculator',
  '/matching': 'Investment Matching Engine',
  '/investments': 'Investment Portfolio',
  '/sector-analysis': 'Sector Analysis',
  '/reports': 'Reports',
};

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'InvestIQ Africa';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-900 font-heading">{title}</h2>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009739] w-56"
          />
        </div>
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#D21034] rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#009739] rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-xs text-gray-400">Powered by ZIDA</span>
        </div>
      </div>
    </header>
  );
}
