import { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { getStatusColor } from '../utils/formatters';

interface Investment {
  id: string;
  projectName: string;
  investor: string;
  country: string;
  sector: string;
  province: string;
  amount: number;
  jobsCreated: number;
  status: string;
  startDate: string;
}

const mockInvestments: Investment[] = [
  { id: '1', projectName: 'Darwendale Platinum Mine', investor: 'Karo Holdings', country: 'Cyprus', sector: 'Mining', province: 'Mashonaland West', amount: 4200, jobsCreated: 15000, status: 'active', startDate: '2019-03-15' },
  { id: '2', projectName: 'Great Dyke Chromite Extraction', investor: 'Great Dyke Investments', country: 'Russia', sector: 'Mining', province: 'Midlands', amount: 3000, jobsCreated: 8000, status: 'approved', startDate: '2021-06-01' },
  { id: '3', projectName: 'Hartley Platinum Mine', investor: 'Zimplats (Implats)', country: 'South Africa', sector: 'Mining', province: 'Mashonaland West', amount: 1800, jobsCreated: 6500, status: 'active', startDate: '2015-01-10' },
  { id: '4', projectName: 'Kariba South Expansion', investor: 'Sinohydro Corporation', country: 'China', sector: 'Energy', province: 'Mashonaland West', amount: 1500, jobsCreated: 3000, status: 'active', startDate: '2017-09-20' },
  { id: '5', projectName: 'Dinson Steel Plant', investor: 'Dinson Iron & Steel', country: 'China', sector: 'Infrastructure', province: 'Midlands', amount: 1000, jobsCreated: 5000, status: 'active', startDate: '2020-02-14' },
  { id: '6', projectName: 'Chisumbanje Ethanol Plant', investor: 'Green Fuel Pvt Ltd', country: 'Zimbabwe', sector: 'Agriculture', province: 'Manicaland', amount: 600, jobsCreated: 4000, status: 'active', startDate: '2011-08-05' },
  { id: '7', projectName: 'Arcadia Lithium Mine', investor: 'Zhejiang Huayou', country: 'China', sector: 'Mining', province: 'Harare', amount: 300, jobsCreated: 2000, status: 'active', startDate: '2022-04-12' },
  { id: '8', projectName: 'Liquid Telecom Network', investor: 'Econet Wireless', country: 'Zimbabwe', sector: 'ICT', province: 'Harare', amount: 200, jobsCreated: 1500, status: 'active', startDate: '2018-11-30' },
  { id: '9', projectName: 'Nyamingura Solar Farm', investor: 'ACME Energy', country: 'UK', sector: 'Energy', province: 'Manicaland', amount: 150, jobsCreated: 800, status: 'approved', startDate: '2024-01-15' },
  { id: '10', projectName: 'Victoria Falls Hotel Upgrade', investor: 'African Sun Limited', country: 'Zimbabwe', sector: 'Tourism', province: 'Matabeleland North', amount: 45, jobsCreated: 350, status: 'completed', startDate: '2022-07-01' },
  { id: '11', projectName: 'National Foods Expansion', investor: 'National Foods Ltd', country: 'Zimbabwe', sector: 'Manufacturing', province: 'Harare', amount: 35, jobsCreated: 500, status: 'completed', startDate: '2023-03-20' },
  { id: '12', projectName: 'Beitbridge Trade Hub', investor: 'ZimTrade Consortium', country: 'Zimbabwe', sector: 'Infrastructure', province: 'Matabeleland South', amount: 180, jobsCreated: 1200, status: 'inquiry', startDate: '2024-06-01' },
];

export default function Investments() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Investment>('amount');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    return mockInvestments
      .filter(inv => {
        if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
        if (sectorFilter !== 'all' && inv.sector !== sectorFilter) return false;
        if (search && !inv.projectName.toLowerCase().includes(search.toLowerCase()) && !inv.investor.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const cmp = typeof aVal === 'number' ? (aVal as number) - (bVal as number) : String(aVal).localeCompare(String(bVal));
        return sortDir === 'desc' ? -cmp : cmp;
      });
  }, [search, statusFilter, sectorFilter, sortField, sortDir]);

  const toggleSort = (field: keyof Investment) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const sectors = [...new Set(mockInvestments.map(i => i.sector))];
  const statuses = [...new Set(mockInvestments.map(i => i.status))];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Investments', value: mockInvestments.length, color: 'bg-green-50 text-green-700' },
          { label: 'Total Value', value: `$${(mockInvestments.reduce((s, i) => s + i.amount, 0) / 1000).toFixed(1)}B`, color: 'bg-blue-50 text-blue-700' },
          { label: 'Total Jobs', value: mockInvestments.reduce((s, i) => s + i.jobsCreated, 0).toLocaleString(), color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Active', value: mockInvestments.filter(i => i.status === 'active').length, color: 'bg-purple-50 text-purple-700' },
        ].map((card, i) => (
          <div key={i} className={`rounded-xl p-4 ${card.color}`}>
            <p className="text-xs font-medium opacity-70">{card.label}</p>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="Search projects or investors..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5">
              <option value="all">All Status</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5">
              <option value="all">All Sectors</option>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5">
            <Download size={14} /> Export
          </button>
          <button className="btn-primary text-sm flex items-center gap-1">
            <Plus size={16} /> Add Investment
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500">
                {[
                  { key: 'projectName', label: 'Project' },
                  { key: 'investor', label: 'Investor' },
                  { key: 'country', label: 'Country' },
                  { key: 'sector', label: 'Sector' },
                  { key: 'province', label: 'Province' },
                  { key: 'amount', label: 'Amount ($M)' },
                  { key: 'jobsCreated', label: 'Jobs' },
                  { key: 'status', label: 'Status' },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key as keyof Investment)}
                    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    {col.label}
                    {sortField === col.key && <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors text-sm">
                  <td className="px-4 py-3 font-medium text-gray-900">{inv.projectName}</td>
                  <td className="px-4 py-3 text-gray-600">{inv.investor}</td>
                  <td className="px-4 py-3 text-gray-600">{inv.country}</td>
                  <td className="px-4 py-3 text-gray-600">{inv.sector}</td>
                  <td className="px-4 py-3 text-gray-600">{inv.province}</td>
                  <td className="px-4 py-3 text-right font-medium">${inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{inv.jobsCreated.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inv.status)}`}>{inv.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
          <span>Showing {filtered.length} of {mockInvestments.length} investments</span>
          <span>Total value: ${(filtered.reduce((s, i) => s + i.amount, 0)).toLocaleString()}M</span>
        </div>
      </div>
    </div>
  );
}
