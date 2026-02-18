
import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Plus, 
  Sparkles, 
  ChevronRight, 
  DollarSign, 
  Lock,
  MessageSquare,
  ShieldCheck,
  Percent,
  TrendingUp,
  AlertTriangle,
  History,
  Activity,
  UserPlus,
  Loader2,
  X,
  Calendar,
  Search,
  ArrowRight,
  Fingerprint,
  Zap,
  LayoutDashboard
} from 'lucide-react';
import { Deal, Company, DealStatus, Contract, RevenueSplit, Milestone } from '../types';
import { generateContract, analyzeDealRisk } from '../services/geminiService';

interface DealWorkspaceProps {
  deal: Deal;
  companies: Company[];
  onUpdate: (deal: Deal) => void;
}

const DealWorkspace: React.FC<DealWorkspaceProps> = ({ deal, companies, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzingRisk, setIsAnalyzingRisk] = useState(false);
  const [aiRiskResult, setAiRiskResult] = useState<any>(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'scope' | 'revenue' | 'intelligence'>('scope');
  
  // Modals state
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [showLedgerTrace, setShowLedgerTrace] = useState(false);

  // New milestone form state
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    title: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0]
  });

  const buyer = companies.find(c => c.id === deal.buyerId);
  const sellers = companies.filter(c => deal.sellerIds.includes(c.id));

  const runRiskAnalysis = async () => {
    setIsAnalyzingRisk(true);
    try {
      const result = await analyzeDealRisk(deal, companies);
      setAiRiskResult(result);
      onUpdate({ ...deal, riskScore: result.score });
    } catch (e) {
      console.error("Risk analysis failed", e);
    } finally {
      setIsAnalyzingRisk(false);
    }
  };

  useEffect(() => {
    if (activeWorkspaceTab === 'intelligence' && !aiRiskResult) {
      runRiskAnalysis();
    }
  }, [activeWorkspaceTab]);

  const handleAddMilestoneSubmit = () => {
    if (!newMilestone.title || !newMilestone.amount) return;
    const ms: Milestone = {
      id: `ms-${Math.random().toString(36).substr(2, 5)}`,
      title: newMilestone.title,
      amount: Number(newMilestone.amount),
      dueDate: newMilestone.dueDate || '',
      status: 'PENDING'
    };
    onUpdate({ ...deal, milestones: [...deal.milestones, ms] });
    setShowAddMilestone(false);
    setNewMilestone({ title: '', amount: 0, dueDate: new Date().toISOString().split('T')[0] });
  };

  const handleAddPartner = (partnerId: string) => {
    if (deal.sellerIds.includes(partnerId)) return;
    const updatedSellers = [...deal.sellerIds, partnerId];
    // Add split entry for new partner with 0% initially
    const updatedSplits = [...deal.revenueSplits, { companyId: partnerId, percentage: 0 }];
    onUpdate({ 
      ...deal, 
      sellerIds: updatedSellers, 
      revenueSplits: updatedSplits,
      updatedAt: new Date().toISOString()
    });
    setShowAddPartner(false);
  };

  const handleUpdateSplit = (companyId: string, percentage: number) => {
    const updatedSplits = deal.revenueSplits.map(s => 
      s.companyId === companyId ? { ...s, percentage } : s
    );
    onUpdate({ ...deal, revenueSplits: updatedSplits });
  };

  const handleGenerateContract = async (type: 'NDA' | 'SOW') => {
    setIsGenerating(true);
    try {
      const sellerNames = sellers.map(s => s.name).join(', ');
      const content = await generateContract(type, buyer?.name || '', sellerNames, deal.notes);
      const newContract: Contract = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        content,
        version: 1,
        signedBy: [],
        createdAt: new Date().toISOString()
      };
      onUpdate({ ...deal, contracts: [...deal.contracts, newContract] });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSignContract = (contractId: string) => {
    const updatedContracts = deal.contracts.map(c => {
      if (c.id === contractId) {
        const isAlreadySigned = c.signedBy.includes(deal.buyerId);
        if (isAlreadySigned) return c;
        return { ...c, signedBy: [...c.signedBy, deal.buyerId] };
      }
      return c;
    });
    onUpdate({ ...deal, contracts: updatedContracts });
  };

  const riskAssessment = useMemo(() => {
    const score = deal.riskScore || 24;
    if (score < 30) return { label: 'Low Risk', color: 'text-green-600', bg: 'bg-green-50' };
    if (score < 70) return { label: 'Moderate Risk', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { label: 'High Risk', color: 'text-red-600', bg: 'bg-red-50' };
  }, [deal.riskScore]);

  return (
    <div id="deal-workspace-view" className="space-y-8 pb-12">
      {/* Header Info */}
      <div id="deal-header" className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-cyan-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-cyan-100">
            <HandshakeIcon />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-cyan-700 uppercase tracking-widest bg-cyan-50 px-2.5 py-1 rounded-lg">Operational Node</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-bold text-gray-500 tracking-wider">DEAL-{deal.id.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">{deal.notes.split('.')[0]}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Success Probability</p>
            <div className="flex items-center gap-3">
              <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${(deal.completionProbability || 0.88) * 100}%` }}></div>
              </div>
              <span className="text-sm font-black text-gray-900">{Math.round((deal.completionProbability || 0.88) * 100)}%</span>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-100 hidden lg:block"></div>
          <button onClick={() => setShowLedgerTrace(true)} className="px-6 py-3 bg-cyan-600 text-white font-black rounded-2xl hover:bg-gray-900 transition-all shadow-xl shadow-cyan-100 text-xs uppercase tracking-widest flex items-center gap-2">
            <Fingerprint size={16} /> View Ledger Trace
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          {[
            { id: 'scope', label: 'Milestones & Scope', icon: Activity },
            { id: 'revenue', label: 'Commercial & Splits', icon: Percent },
            { id: 'intelligence', label: 'AI Risk Heatmap', icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveWorkspaceTab(tab.id as any)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm ${
                activeWorkspaceTab === tab.id 
                ? 'bg-white shadow-lg text-cyan-700 border border-cyan-50' 
                : 'text-gray-500 hover:bg-white/50'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
          
          <div id="deal-network" className="mt-8 pt-8 border-t border-gray-100">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Involved Entities</h4>
             <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm group">
                   <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center text-cyan-700 font-black text-xs group-hover:bg-cyan-600 group-hover:text-white transition-colors">B</div>
                   <span className="text-xs font-bold text-gray-700 truncate">{buyer?.name}</span>
                </div>
                {sellers.map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm group">
                     <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-700 font-black text-xs group-hover:bg-purple-600 group-hover:text-white transition-colors">S</div>
                     <span className="text-xs font-bold text-gray-700 truncate">{s.name}</span>
                  </div>
                ))}
                <button onClick={() => setShowAddPartner(true)} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:border-cyan-300 hover:text-cyan-700 transition-all">
                   <UserPlus size={14} /> Add Partner
                </button>
             </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {activeWorkspaceTab === 'scope' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
              <div id="deal-milestones" className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <Activity className="text-cyan-700" /> Milestone Execution
                  </h2>
                  <button onClick={() => setShowAddMilestone(true)} className="flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-700 text-[10px] font-black rounded-xl hover:bg-cyan-100 transition-all uppercase tracking-widest">
                    <Plus size={14} /> Add Milestone
                  </button>
                </div>
                
                <div className="space-y-4">
                  {deal.milestones.map((ms) => (
                    <div key={ms.id} className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-cyan-200 transition-all cursor-pointer">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${ms.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {ms.status === 'PAID' ? <CheckCircle size={24} /> : <Clock size={24} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                           <h4 className="font-bold text-gray-900">{ms.title}</h4>
                           <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-400 font-black uppercase">Active</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium italic">Target release: {ms.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900 text-lg tracking-tight">${ms.amount.toLocaleString()}</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${ms.status === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>{ms.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div id="deal-contracts" className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-gray-900">Legal Governance</h2>
                  <div className="flex gap-2">
                    <button onClick={() => handleGenerateContract('NDA')} disabled={isGenerating} className="px-5 py-2.5 bg-cyan-600 text-white text-[10px] font-black rounded-xl shadow-xl shadow-cyan-100 flex items-center gap-2 uppercase tracking-widest group">
                      {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />} AI Contract
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {deal.contracts.map(contract => (
                    <div key={contract.id} className="p-6 border border-gray-100 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-2xl transition-all group/card">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 bg-cyan-100 text-cyan-700 text-[10px] font-black rounded-lg uppercase tracking-wider">{contract.type} v{contract.version}</span>
                        {contract.signedBy.length > 1 ? <ShieldCheck size={20} className="text-green-500" /> : <Clock size={20} className="text-amber-500" />}
                      </div>
                      <h4 className="font-black text-gray-900 truncate mb-1">Agreement #{contract.id.toUpperCase()}</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Signatures: {contract.signedBy.length}/2</p>
                      <button onClick={() => handleSignContract(contract.id)} className="mt-6 w-full py-3 bg-white text-[10px] font-black text-cyan-700 border border-cyan-100 rounded-xl hover:bg-cyan-600 hover:text-white transition-all uppercase tracking-widest">
                        Affix Signature
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeWorkspaceTab === 'revenue' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                 <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                   <Percent className="text-cyan-700" /> Revenue Split Optimization
                 </h2>
                 <div className="space-y-6">
                    {deal.revenueSplits.map((split) => {
                      const company = companies.find(c => c.id === split.companyId);
                      return (
                        <div key={split.companyId} className="flex items-center gap-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                           <div className="flex items-center gap-4 flex-1">
                             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center font-black text-cyan-700">
                               {company?.name.charAt(0)}
                             </div>
                             <div>
                               <p className="font-bold text-gray-900">{company?.name}</p>
                               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{company?.domain}</p>
                             </div>
                           </div>
                           <div className="w-48">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stake</span>
                                <span className="text-xs font-black text-cyan-700">{split.percentage}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={split.percentage} 
                                onChange={(e) => handleUpdateSplit(split.companyId, parseInt(e.target.value))}
                                className="w-full h-1.5 bg-cyan-100 rounded-full appearance-none cursor-pointer accent-cyan-600" 
                              />
                           </div>
                           <div className="text-right w-32">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expected ROI</p>
                              <p className="text-lg font-black text-gray-900">${(deal.amount * (split.percentage/100)).toLocaleString()}</p>
                           </div>
                        </div>
                      );
                    })}
                 </div>

                 <div className="mt-12 p-10 bg-gray-900 rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl">
                    <div>
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Governance Surcharge (5%)</p>
                       <p className="text-3xl font-black tracking-tight">${deal.platformFee.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Allocation Status</p>
                       <div className="flex items-center gap-3">
                         <div className={`w-3 h-3 rounded-full animate-pulse ${deal.revenueSplits.reduce((s, x) => s + x.percentage, 0) === 100 ? 'bg-green-400' : 'bg-amber-400'}`}></div>
                         <p className={`text-3xl font-black tracking-tight ${deal.revenueSplits.reduce((s, x) => s + x.percentage, 0) === 100 ? 'text-white' : 'text-amber-400'}`}>
                           {deal.revenueSplits.reduce((s, x) => s + x.percentage, 0)}%
                         </p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeWorkspaceTab === 'intelligence' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                      <Sparkles className="text-cyan-700" /> Platform Intelligence Analysis
                    </h2>
                    <button 
                      onClick={runRiskAnalysis}
                      disabled={isAnalyzingRisk}
                      className="px-4 py-2 bg-cyan-50 text-cyan-700 text-[10px] font-black rounded-xl hover:bg-cyan-100 transition-all uppercase tracking-widest flex items-center gap-2"
                    >
                      {isAnalyzingRisk ? <Loader2 size={14} className="animate-spin" /> : <RotateCwIcon size={14} />} Re-Scan
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className={`p-10 rounded-[2.5rem] ${riskAssessment.bg} border border-black/5`}>
                       <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${riskAssessment.color}`}>Risk Velocity Index</h4>
                       <div className="flex items-baseline gap-2">
                         <span className="text-6xl font-black text-gray-900">{aiRiskResult ? aiRiskResult.score : 100 - (deal.riskScore || 24)}</span>
                         <span className="text-sm font-black text-gray-400 uppercase tracking-widest">/ 100</span>
                       </div>
                       <div className="mt-8">
                         <p className="text-sm font-bold text-gray-900 mb-2 underline decoration-cyan-300">Executive Summary</p>
                         <p className="text-xs font-medium text-gray-600 leading-relaxed italic">
                           {aiRiskResult ? aiRiskResult.recommendation : "Preliminary analysis suggests high counterparty trust but potential supply chain volatility in Phase 3."}
                         </p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Risk Factor Breakdown</h4>
                       {(aiRiskResult?.factors || [
                         'Scope Defensibility Index', 
                         'Seller Liquidity Projection', 
                         'Timeline Realism Assessment', 
                         'Historical Node Integrity'
                       ]).map((factor: string, i: number) => (
                         <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-cyan-700 font-black text-[10px] border border-gray-200 shrink-0">
                             {i + 1}
                           </div>
                           <span className="text-xs font-bold text-gray-700 leading-tight">{factor}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-10 bg-cyan-600 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-md">
                       <h4 className="text-xl font-black mb-2 flex items-center gap-2">
                         <ShieldCheck size={24} className="text-cyan-300" /> Trust Sovereignty
                       </h4>
                       <p className="text-xs font-medium text-cyan-100 leading-relaxed">This deal is backed by our immutable ledger. Risk scores are updated in real-time as participants fulfill contractual obligations.</p>
                    </div>
                    <button onClick={() => setShowLedgerTrace(true)} className="px-8 py-4 bg-white text-cyan-700 font-black rounded-2xl text-xs uppercase tracking-widest shadow-2xl shadow-cyan-900/40 whitespace-nowrap">
                       View Ledger Trace
                    </button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Milestone Modal */}
      {showAddMilestone && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in duration-300">
            <button onClick={() => setShowAddMilestone(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            <h3 className="text-2xl font-black text-gray-900 mb-8">Define New Milestone</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Milestone Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Phase 2 Integration Completion"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-500/10 text-sm font-bold"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Settlement Amount ($)</label>
                  <input 
                    type="number" 
                    placeholder="5000"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-500/10 text-sm font-bold"
                    value={newMilestone.amount}
                    onChange={(e) => setNewMilestone({...newMilestone, amount: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Target Date</label>
                  <input 
                    type="date" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-500/10 text-sm font-bold"
                    value={newMilestone.dueDate}
                    onChange={(e) => setNewMilestone({...newMilestone, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <button onClick={handleAddMilestoneSubmit} className="w-full py-5 bg-cyan-600 text-white font-black rounded-2xl shadow-xl shadow-cyan-100 hover:bg-cyan-700 transition-all flex items-center justify-center gap-2">
                Deploy Milestone Node <Activity size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Partner Modal */}
      {showAddPartner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in duration-300">
            <button onClick={() => setShowAddPartner(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Invite Collaboration Partner</h3>
            <p className="text-sm text-gray-500 mb-8 font-medium">Add another verified entity to this deal node.</p>
            
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search registry for verified companies..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-500/10 text-sm font-bold"
              />
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
              {companies.filter(c => !deal.sellerIds.includes(c.id) && c.id !== deal.buyerId).map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-cyan-200 transition-all group">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-cyan-700 font-black border border-gray-100">{c.name.charAt(0)}</div>
                     <div>
                       <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                       <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{c.domain}</p>
                     </div>
                   </div>
                   <button 
                    onClick={() => handleAddPartner(c.id)}
                    className="px-4 py-2 bg-white text-cyan-700 text-[10px] font-black rounded-lg border border-cyan-100 hover:bg-cyan-600 hover:text-white transition-all uppercase tracking-widest"
                   >
                     INVITE
                   </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ledger Trace Modal */}
      {showLedgerTrace && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl p-12 relative animate-in slide-in-from-bottom-8 duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Fingerprint size={300} /></div>
            <button onClick={() => setShowLedgerTrace(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full z-10"><X size={20} /></button>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  <Fingerprint size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900">Immutable Ledger Trace</h3>
                  <p className="text-xs text-cyan-700 font-black uppercase tracking-widest mt-1">Hashed Integrity Protocol Active</p>
                </div>
              </div>

              <div className="space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                {[
                  { title: 'Deal Initialized', user: buyer?.name || 'Admin', action: 'Created deal node and defined base scope.', date: new Date(deal.createdAt).toLocaleString(), icon: Plus },
                  { title: 'NDA Executed', user: 'Governance Engine', action: 'Multi-party non-disclosure finalized and timestamped.', date: new Date(deal.createdAt).toLocaleString(), icon: ShieldCheck },
                  ...deal.milestones.map(m => ({ 
                    title: `Milestone: ${m.title}`, 
                    user: 'System Log', 
                    action: `Node status shifted to ${m.status}. Settlement set to $${m.amount.toLocaleString()}.`, 
                    date: m.dueDate, 
                    icon: m.status === 'PAID' ? CheckCircle : Activity 
                  }))
                ].map((log, i) => (
                  <div key={i} className="flex gap-8 relative">
                    <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center text-gray-400 shrink-0 z-10 group-hover:text-cyan-700 transition-colors">
                      <log.icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-black text-gray-900">{log.title}</h4>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{log.date}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed mb-1">{log.action}</p>
                      <p className="text-[10px] font-black text-cyan-700 uppercase tracking-widest">Actor: {log.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">SHA-256 Checksum: 8a7c...2e9f</p>
              <button className="flex items-center gap-2 text-cyan-700 font-black text-xs uppercase tracking-widest hover:underline">
                Download Signed Audit Log <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RotateCwIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

const HandshakeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v2.5" />
    <path d="M12 11c1.1 0 2 .9 2 2v2a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1z" />
    <path d="M18 13c1.1 0 2 .9 2 2v2a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1z" />
    <path d="M14 17h1" />
  </svg>
);

export default DealWorkspace;
