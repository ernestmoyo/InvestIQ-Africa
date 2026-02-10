import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Calculator, Target, Briefcase, PieChart, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analytics', label: 'Analytics', icon: TrendingUp },
  { path: '/impact-calculator', label: 'Impact Calculator', icon: Calculator },
  { path: '/matching', label: 'Matching', icon: Target },
  { path: '/investments', label: 'Investments', icon: Briefcase },
  { path: '/sector-analysis', label: 'Sectors', icon: PieChart },
  { path: '/reports', label: 'Reports', icon: FileText },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white flex flex-col transition-all duration-300`}>
      <div className="flex flex-col">
        <div className="h-1 flex">
          <div className="flex-1 bg-[#009739]" />
          <div className="flex-1 bg-[#FFD200]" />
          <div className="flex-1 bg-[#D21034]" />
          <div className="flex-1 bg-black" />
        </div>
        <div className="p-4 border-b border-gray-800">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold">
                Invest<span className="text-[#009739]">IQ</span>
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">ZIDA Platform</p>
            </div>
          )}
          {collapsed && <span className="text-lg font-bold text-[#009739]">IQ</span>}
        </div>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-[#009739]/10 text-[#009739] border-l-2 border-[#009739]'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={onToggle}
        className="p-4 border-t border-gray-800 text-gray-400 hover:text-white flex items-center justify-center"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
