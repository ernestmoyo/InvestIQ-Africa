import { useState } from 'react';
import { Download, FileText, Table, FileSpreadsheet } from 'lucide-react';

interface ExportButtonProps {
  onExport: (format: 'pdf' | 'excel' | 'csv') => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function ExportButton({ onExport, loading, disabled }: ExportButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled || loading}
        className="btn-secondary text-sm gap-2"
      >
        <Download size={16} />
        {loading ? 'Exporting...' : 'Export'}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <button onClick={() => { onExport('pdf'); setOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg">
            <FileText size={14} /> PDF Report
          </button>
          <button onClick={() => { onExport('excel'); setOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <FileSpreadsheet size={14} /> Excel
          </button>
          <button onClick={() => { onExport('csv'); setOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg">
            <Table size={14} /> CSV
          </button>
        </div>
      )}
    </div>
  );
}
