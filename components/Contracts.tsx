
import React, { useState } from 'react';
import { FileText, ShieldCheck, Download, ExternalLink, Filter, Search, ChevronRight, Clock, Plus, X, ShieldAlert, Sparkles, Building2 } from 'lucide-react';
import { Deal, Contract } from '../types';

interface ContractsProps {
  deals: Deal[];
}

const Contracts: React.FC<ContractsProps> = ({ deals }) => {
  const [showNewDraft, setShowNewDraft] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [draftType, setDraftType] = useState<'NDA' | 'SOW' | 'MSA'>('NDA');

  const allContracts = deals.flatMap(d => d.contracts.map(c => ({ ...c, dealId: d.id })));

  const handleDownloadContract = (contract: Contract & { dealId: string }) => {
    const blob = new Blob([contract.content || 'No contract content available.'], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contract.type.toLowerCase()}-${contract.id}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleOpenContract = (contract: Contract & { dealId: string }) => {
    const nextWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!nextWindow) return;
    nextWindow.document.write(`<pre style="font-family:monospace;white-space:pre-wrap;padding:24px;">${contract.content || 'No contract content available.'}</pre>`);
    nextWindow.document.title = `${contract.type} Contract`;
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Contract Management</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Repository of active SOWs, NDAs, and Master Service Agreements.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowArchive(true)} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-black rounded-2xl hover:bg-gray-50 shadow-sm transition-all">
            <Filter size={18} /> Archive
          </button>
          <button onClick={() => setShowNewDraft(true)} className="flex items-center gap-2 px-6 py-3 bg-[#0690AE] text-white text-sm font-black rounded-2xl hover:bg-[#057D97] shadow-xl shadow-[#CDEEF5] transition-all">
            <Plus size={18} /> New Draft
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Active', value: allContracts.length, color: 'cyan' },
          { label: 'Pending Sign', value: allContracts.filter(c => c.signedBy.length < 2).length, color: 'amber' },
          { label: 'Fully Executed', value: allContracts.filter(c => c.signedBy.length === 2).length, color: 'green' },
          { label: 'Expiring Soon', value: '0', color: 'rose' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className={`text-2xl font-black text-${stat.color}-600`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search contracts..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#0690AE]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Document</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Deal Reference</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Version</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allContracts.length > 0 ? allContracts.map(contract => (
                <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#E6F6FA] text-[#057D97] rounded-xl">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{contract.type} Agreement</p>
                        <p className="text-[10px] text-gray-400 font-bold">CREATED {new Date(contract.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-gray-600">DEAL-{contract.dealId.toUpperCase()}</span>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-gray-500">v{contract.version}.0</td>
                  <td className="px-8 py-6">
                    {contract.signedBy.length === 2 ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest">
                        <ShieldCheck size={14} /> Executed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-[#0690AE] uppercase tracking-widest">
                        <Clock size={14} /> Pending Sign
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      <button onClick={() => handleDownloadContract(contract)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#E6F6FA] hover:text-[#057D97] transition-all"><Download size={18} /></button>
                      <button onClick={() => handleOpenContract(contract)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#E6F6FA] hover:text-[#057D97] transition-all"><ExternalLink size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <FileText size={48} className="text-gray-200 mb-4" />
                      <p className="text-gray-400 font-bold">No legal documents found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Draft Modal */}
      {showNewDraft && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in duration-300">
            <button onClick={() => setShowNewDraft(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Initiate Contract Draft</h3>
            <p className="text-sm text-gray-500 mb-8 font-medium">Select type and target entity for your legal node.</p>
            
            <div className="space-y-6">
               <div className="grid grid-cols-3 gap-3">
                  {['NDA', 'SOW', 'MSA'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setDraftType(t as any)}
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${draftType === t ? 'bg-[#0690AE] text-white shadow-xl shadow-[#CDEEF5]' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
                    >
                      {t}
                    </button>
                  ))}
               </div>

               <div>
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Target Deal Node</label>
                 <select className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-[#0690AE]/10 text-sm font-bold">
                    {deals.map(d => <option key={d.id} value={d.id}>DEAL-{d.id.toUpperCase()} - {d.notes.split('.')[0]}</option>)}
                 </select>
               </div>

               <div className="p-6 bg-[#E6F6FA] rounded-3xl border border-[#CDEEF5] flex items-start gap-3">
                  <ShieldAlert className="text-[#0690AE] shrink-0 mt-0.5" size={18} />
                  <p className="text-[10px] text-[#057D97] font-medium leading-relaxed italic">Drafts initiated here utilize our AI-powered standard legal library for maximum compliance.</p>
               </div>

               <button onClick={() => setShowNewDraft(false)} className="w-full py-5 bg-[#0690AE] text-white font-black rounded-2xl shadow-xl shadow-[#CDEEF5] hover:bg-[#057D97] transition-all flex items-center justify-center gap-2">
                 Generate Draft with AI <Sparkles size={18} />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {showArchive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in duration-300">
            <button onClick={() => setShowArchive(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Vault Archive</h3>
            <p className="text-sm text-gray-500 mb-8 font-medium">Viewing historical and expired contracts.</p>
            <div className="space-y-4">
               <div className="p-12 border-2 border-dashed border-gray-200 rounded-[2rem] text-center">
                  <Clock className="text-gray-300 mx-auto mb-4" size={32} />
                  <p className="text-xs text-gray-400 font-bold">No archived documents found in this cycle.</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;
