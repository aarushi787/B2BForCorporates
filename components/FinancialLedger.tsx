
import React from 'react';
import { 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { LedgerEntry, LedgerType } from '../types';

interface FinancialLedgerProps {
  entries: LedgerEntry[];
}

const FinancialLedger: React.FC<FinancialLedgerProps> = ({ entries }) => {
  const handleExportCsv = () => {
    const header = 'dealId,counterparty,type,amount,status,timestamp';
    const rows = entries.map((entry) =>
      [entry.dealId, entry.counterparty, entry.type, entry.amount, entry.status, entry.timestamp].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'financial-ledger.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadStatements = () => {
    window.print();
  };

  const handleApplyFilter = () => {
    const onlyCompleted = entries.filter((entry) => entry.status === 'COMPLETED').length;
    alert(`Filter applied: ${onlyCompleted} completed transactions found.`);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Ledger</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Audit-ready transaction history for your corporate accounts.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportCsv} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-black rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
            <FileSpreadsheet size={18} /> Export CSV
          </button>
          <button onClick={handleDownloadStatements} className="flex items-center gap-2 px-6 py-3 bg-[#0690AE] text-white text-sm font-black rounded-2xl hover:bg-[#057D97] transition-all shadow-xl shadow-[#CDEEF5]">
            <Download size={18} /> PDF Statements
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Incoming (Escrow)</p>
          <h3 className="text-3xl font-black text-[#057D97]">$1,450,000</h3>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Settled Payouts</p>
          <h3 className="text-3xl font-black text-green-600">$890,000</h3>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Platform Commissions</p>
          <h3 className="text-3xl font-black text-[#0690AE]">$42,500</h3>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by deal ID or counterparty..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#0690AE]"
            />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleApplyFilter} className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100"><Filter size={18} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reference</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Counterparty</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <span className="font-black text-gray-900">DEAL-{entry.dealId.toUpperCase()}</span>
                    <p className="text-[10px] text-gray-400 font-bold">TX-{entry.id}</p>
                  </td>
                  <td className="px-8 py-6 font-bold text-gray-700">{entry.counterparty}</td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      entry.type === LedgerType.COMMISSION ? 'bg-[#CDEEF5] text-[#057D97]' :
                      entry.type === LedgerType.PAYOUT ? 'bg-green-100 text-green-700' : 'bg-[#CDEEF5] text-[#057D97]'
                    }`}>
                      {entry.type === LedgerType.PAYOUT ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                      {entry.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-gray-900 tracking-tight text-lg">
                    ${entry.amount.toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5 text-xs font-black text-green-600 uppercase tracking-widest">
                      <CheckCircle2 size={14} /> {entry.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-gray-500 italic">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialLedger;
