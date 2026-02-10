import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: { page: number; perPage: number; total: number; onPageChange: (page: number) => void };
  onRowClick?: (item: T) => void;
}

export default function DataTable<T extends Record<string, unknown>>({ columns, data, loading, pagination, onRowClick }: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (<div key={i} className="h-10 bg-gray-100 rounded" />))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-gray-400">No data available</td></tr>
            ) : (
              data.map((item, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(item)}
                  className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''} ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-gray-700">
                      {col.render ? col.render(item) : String(item[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Showing {(pagination.page - 1) * pagination.perPage + 1}-{Math.min(pagination.page * pagination.perPage, pagination.total)} of {pagination.total}</span>
          <div className="flex gap-2">
            <button onClick={() => pagination.onPageChange(pagination.page - 1)} disabled={pagination.page <= 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={18} /></button>
            <button onClick={() => pagination.onPageChange(pagination.page + 1)} disabled={pagination.page * pagination.perPage >= pagination.total} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
