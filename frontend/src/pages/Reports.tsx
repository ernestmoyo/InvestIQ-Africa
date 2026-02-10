import { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  status: 'ready' | 'generating' | 'scheduled';
  format: string;
  size: string;
}

const mockReports: Report[] = [
  { id: '1', title: 'Q4 2024 FDI Summary Report', type: 'Quarterly Summary', date: '2024-12-31', status: 'ready', format: 'PDF', size: '2.4 MB' },
  { id: '2', title: 'Mining Sector Deep Dive', type: 'Sector Analysis', date: '2024-12-15', status: 'ready', format: 'PDF', size: '5.1 MB' },
  { id: '3', title: 'Annual Impact Assessment 2024', type: 'Impact Report', date: '2024-12-31', status: 'ready', format: 'PDF', size: '8.7 MB' },
  { id: '4', title: 'Investment Pipeline Export', type: 'Data Export', date: '2024-12-28', status: 'ready', format: 'Excel', size: '1.2 MB' },
  { id: '5', title: 'Investor Match Report — Karo Holdings', type: 'Matching Report', date: '2024-12-20', status: 'ready', format: 'PDF', size: '1.8 MB' },
  { id: '6', title: 'Q1 2025 FDI Forecast', type: 'Forecast Report', date: '2025-01-05', status: 'ready', format: 'PDF', size: '3.2 MB' },
  { id: '7', title: 'SEZ Performance Review', type: 'Zone Analysis', date: '2024-11-30', status: 'ready', format: 'PDF', size: '4.5 MB' },
  { id: '8', title: 'Monthly Activity Digest — Jan 2025', type: 'Activity Report', date: '2025-01-31', status: 'scheduled', format: 'PDF', size: '—' },
];

const reportTemplates = [
  { name: 'Quarterly FDI Summary', icon: TrendingUp, description: 'Comprehensive overview of FDI flows, sector breakdown, and trends' },
  { name: 'Investment Impact Assessment', icon: Users, description: 'Job creation, GDP contribution, and multiplier effect analysis' },
  { name: 'Sector Deep Dive', icon: BarChart3, description: 'Detailed analysis of a specific sector with risk-return profiling' },
  { name: 'Investor Matching Report', icon: DollarSign, description: 'AI-generated match recommendations with scoring breakdown' },
];

export default function Reports() {
  const [filter, setFilter] = useState('all');
  const [generating, setGenerating] = useState(false);

  const filteredReports = filter === 'all' ? mockReports : mockReports.filter(r => r.type === filter);
  const reportTypes = [...new Set(mockReports.map(r => r.type))];

  const handleGenerate = (templateName: string) => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Report Templates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Generate New Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {reportTemplates.map((template, i) => {
            const Icon = template.icon;
            return (
              <button
                key={i}
                onClick={() => handleGenerate(template.name)}
                disabled={generating}
                className="text-left p-4 rounded-xl border border-gray-100 hover:border-green-300 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-3 group-hover:bg-green-100 transition-colors">
                  <Icon size={20} className="text-green-600" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800">{template.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{template.description}</p>
              </button>
            );
          })}
        </div>
        {generating && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-700">Generating report...</span>
          </div>
        )}
      </div>

      {/* Report Library */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">Report Library</h3>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5"
            >
              <option value="all">All Types</option>
              {reportTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {filteredReports.map(report => (
            <div key={report.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${report.format === 'PDF' ? 'bg-red-50' : 'bg-green-50'}`}>
                  <FileText size={18} className={report.format === 'PDF' ? 'text-red-500' : 'text-green-500'} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{report.title}</h4>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-400">{report.type}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-xs text-gray-400">{report.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {report.status === 'ready' ? (
                  <button className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg px-3 py-1.5 transition-colors">
                    <Download size={14} /> Download
                  </button>
                ) : report.status === 'scheduled' ? (
                  <span className="text-xs text-yellow-600 bg-yellow-50 rounded-lg px-3 py-1.5">Scheduled</span>
                ) : (
                  <span className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-1.5">Generating...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Scheduled Reports</h3>
        <div className="space-y-2">
          {[
            { name: 'Monthly Activity Digest', frequency: 'Monthly', nextRun: 'Feb 28, 2025' },
            { name: 'Quarterly FDI Summary', frequency: 'Quarterly', nextRun: 'Mar 31, 2025' },
            { name: 'Annual Impact Assessment', frequency: 'Annual', nextRun: 'Dec 31, 2025' },
          ].map((sched, i) => (
            <div key={i} className="flex items-center justify-between bg-white rounded-lg p-3">
              <div>
                <p className="text-sm font-medium text-gray-800">{sched.name}</p>
                <p className="text-xs text-gray-400">{sched.frequency}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Next: {sched.nextRun}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
