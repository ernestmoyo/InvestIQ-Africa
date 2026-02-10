import { DollarSign, Briefcase, Users, MessageSquare } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import StatCard from '../components/common/StatCard';

const fdiTrend = Array.from({ length: 18 }, (_, i) => ({
  month: new Date(2023, i, 1).toLocaleDateString('en', { month: 'short', year: '2-digit' }),
  value: Math.round(150 + Math.random() * 100 + i * 3),
}));

const sectorData = [
  { name: 'Mining', value: 9800 }, { name: 'Agriculture', value: 743 }, { name: 'Tourism', value: 195 },
  { name: 'Manufacturing', value: 113 }, { name: 'ICT', value: 315 }, { name: 'Energy', value: 1552 },
  { name: 'Infrastructure', value: 1000 }, { name: 'Financial', value: 85 }, { name: 'Health', value: 15 },
];
const COLORS = ['#009739', '#059669', '#FFD200', '#D21034', '#2563eb', '#7c3aed', '#d97706', '#dc2626', '#6366f1'];

const topInvestors = [
  { name: 'Karo Holdings', country: 'Cyprus', sector: 'Mining', amount: '$4.2B', status: 'active' },
  { name: 'Great Dyke Investments', country: 'Russia', sector: 'Mining', amount: '$3.0B', status: 'approved' },
  { name: 'Zimplats (Implats)', country: 'South Africa', sector: 'Mining', amount: '$1.8B', status: 'active' },
  { name: 'Sinohydro Corporation', country: 'China', sector: 'Energy', amount: '$1.5B', status: 'active' },
  { name: 'Dinson Iron & Steel', country: 'China', sector: 'Infrastructure', amount: '$1.0B', status: 'active' },
  { name: 'Green Fuel (Pvt) Ltd', country: 'Zimbabwe', sector: 'Agriculture', amount: '$600M', status: 'active' },
  { name: 'Zhejiang Huayou', country: 'China', sector: 'Mining', amount: '$300M', status: 'active' },
  { name: 'Econet Wireless', country: 'Zimbabwe', sector: 'ICT', amount: '$200M', status: 'active' },
];

const recentActivity = [
  { text: 'Nyamingura Solar Farm approved', status: 'approved', time: '2 hours ago' },
  { text: 'New inquiry from Vedanta Resources', status: 'inquiry', time: '5 hours ago' },
  { text: 'Arcadia Lithium reached 800 jobs milestone', status: 'active', time: '1 day ago' },
  { text: 'Cassava Smartech SEZ permit issued', status: 'approved', time: '2 days ago' },
  { text: 'Victoria Falls resort proposal received', status: 'inquiry', time: '3 days ago' },
  { text: 'National Foods expansion completed', status: 'completed', time: '1 week ago' },
];

const statusColors: Record<string, string> = { active: 'bg-green-100 text-green-800', approved: 'bg-blue-100 text-blue-800', inquiry: 'bg-yellow-100 text-yellow-800', completed: 'bg-gray-100 text-gray-700' };

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total FDI (YTD)" value="$2.4B" change={12.5} changeType="increase" icon={<DollarSign size={20} />} color="green" />
        <StatCard title="Active Investments" value="147" change={5.8} changeType="increase" icon={<Briefcase size={20} />} color="blue" />
        <StatCard title="Jobs Created" value="23,450" change={11.2} changeType="increase" icon={<Users size={20} />} color="gold" />
        <StatCard title="Pending Inquiries" value="38" change={5.3} changeType="decrease" icon={<MessageSquare size={20} />} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">FDI Inflows Trend (USD Millions)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={fdiTrend}>
              <defs><linearGradient id="fdiGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#009739" stopOpacity={0.15}/><stop offset="95%" stopColor="#009739" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#009739" fill="url(#fdiGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Investment by Sector ($M)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sectorData} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={70} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {sectorData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Investors</h3>
          <table className="w-full">
            <thead><tr className="text-xs text-gray-500 border-b">
              <th className="text-left pb-2">Investor</th><th className="text-left pb-2">Country</th>
              <th className="text-left pb-2">Sector</th><th className="text-right pb-2">Amount</th>
              <th className="text-center pb-2">Status</th>
            </tr></thead>
            <tbody>
              {topInvestors.map((inv, i) => (
                <tr key={i} className="border-b border-gray-50 text-sm">
                  <td className="py-2.5 font-medium text-gray-900">{inv.name}</td>
                  <td className="py-2.5 text-gray-600">{inv.country}</td>
                  <td className="py-2.5 text-gray-600">{inv.sector}</td>
                  <td className="py-2.5 text-right font-medium">{inv.amount}</td>
                  <td className="py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[inv.status]}`}>{inv.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${item.status === 'approved' ? 'bg-blue-500' : item.status === 'inquiry' ? 'bg-yellow-500' : item.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                <div>
                  <p className="text-sm text-gray-700">{item.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
