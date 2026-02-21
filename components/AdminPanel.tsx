
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  XCircle, 
  Search, 
  AlertTriangle, 
  X, 
  ShieldAlert, 
  Zap, 
  Lock, 
  BarChart3, 
  Fingerprint, 
  Building2, 
  Handshake, 
  Activity, 
  DollarSign, 
  ArrowUpRight, 
  CheckCircle2,
  Clock,
  History,
  Users,
  Briefcase,
  TicketCheck,
  Globe,
  Settings as SettingsIcon,
  ToggleRight,
  UserCheck,
  AlertCircle,
  TrendingUp,
  CreditCard,
  FileText,
  FileSearch,
  Plus,
  Upload,
  Sparkles,
  Loader2,
  FileCheck2,
  BadgeAlert
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell
} from 'recharts';
import SafeResponsiveContainer from './charts/SafeResponsiveContainer';
import { Company, RiskLevel, Deal, DealStatus, AuditLog, SupportTicket, FeatureFlag, AuditReport } from '../types';
import { MOCK_AUDIT_LOGS, MOCK_TICKETS, MOCK_FEATURE_FLAGS } from '../constants';
import { generateAuditReport } from '../services/geminiService';

interface AdminPanelProps {
  companies: Company[];
  deals: Deal[];
  onToggleVerification: (id: string) => void;
  onUpdateCompany?: (company: Company) => void;
}

const revenueData = [
  { name: 'Mon', revenue: 4200 },
  { name: 'Tue', revenue: 5100 },
  { name: 'Wed', revenue: 4800 },
  { name: 'Thu', revenue: 7200 },
  { name: 'Fri', revenue: 6100 },
  { name: 'Sat', revenue: 3800 },
  { name: 'Sun', revenue: 4500 },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ companies, deals, onToggleVerification, onUpdateCompany }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'registry' | 'financials' | 'ops' | 'system'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmingCompany, setConfirmingCompany] = useState<Company | null>(null);
  const [addingReportFor, setAddingReportFor] = useState<Company | null>(null);
  const [isActionEnabled, setIsActionEnabled] = useState(false);
  const [isGeneratingAudit, setIsGeneratingAudit] = useState(false);
  const [auditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [tickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [flags, setFlags] = useState<FeatureFlag[]>(MOCK_FEATURE_FLAGS);

  // New report form state
  const [reportTitle, setReportTitle] = useState('');
  const [reportScore, setReportScore] = useState(90);
  const [reportCategory, setReportCategory] = useState<'FINANCIAL' | 'OPERATIONAL' | 'COMPLIANCE'>('FINANCIAL');

  useEffect(() => {
    let timer: number;
    if (confirmingCompany) {
      setIsActionEnabled(false);
      // Security delay to prevent accidental double-clicks
      timer = window.setTimeout(() => setIsActionEnabled(true), 1200);
    }
    return () => clearTimeout(timer);
  }, [confirmingCompany]);

  const toggleFlag = (id: string) => {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const handleConfirmAction = () => {
    if (confirmingCompany) {
      onToggleVerification(confirmingCompany.id);
      setConfirmingCompany(null);
    }
  };

  const handleAddAuditReport = () => {
    if (!addingReportFor || !reportTitle) return;

    const newReport: AuditReport = {
      id: Math.random().toString(36).substr(2, 9),
      title: reportTitle,
      date: new Date().toISOString(),
      score: reportScore,
      category: reportCategory,
      summary: `Assessment conducted by Platform Governance. Category: ${reportCategory}.`,
      fileUrl: '#'
    };

    const updatedCompany: Company = {
      ...addingReportFor,
      auditReports: [...(addingReportFor.auditReports || []), newReport]
    };

    if (onUpdateCompany) onUpdateCompany(updatedCompany);
    setAddingReportFor(null);
    setReportTitle('');
  };

  const handleAIAudit = async () => {
    if (!addingReportFor) return;
    setIsGeneratingAudit(true);
    try {
      const result = await generateAuditReport(addingReportFor);
      const newReport: AuditReport = {
        id: Math.random().toString(36).substr(2, 9),
        title: result.title || "AI Verification Report",
        date: new Date().toISOString(),
        score: result.score || 95,
        category: 'COMPLIANCE',
        summary: result.summary + " | AI ANALYSIS COMPLETE.",
        fileUrl: '#'
      };
      
      const updatedCompany: Company = {
        ...addingReportFor,
        auditReports: [...(addingReportFor.auditReports || []), newReport]
      };
      
      if (onUpdateCompany) onUpdateCompany(updatedCompany);
      setAddingReportFor(null);
    } catch (e) {
      console.error("AI Audit failed", e);
    } finally {
      setIsGeneratingAudit(false);
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.gst.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = deals.reduce((sum, d) => sum + d.amount, 0);
  const allDealsSorted = [...deals].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const getCompanyName = (id: string) => companies.find(c => c.id === id)?.name || id;
  const getDealStatusClass = (status: string) => {
    const s = status?.toUpperCase?.() || '';
    if (['COMPLETED', 'CONFIRMED', 'APPROVED'].includes(s)) return 'bg-green-100 text-green-700';
    if (['DISPUTED', 'FROZEN', 'REJECTED', 'VOIDED', 'CANCELLED'].includes(s)) return 'bg-red-100 text-red-700';
    if (['NEGOTIATION', 'ENQUIRY', 'PENDING', 'IN_PRODUCTION', 'SHIPPED'].includes(s)) return 'bg-[#CDEEF5] text-[#057D97]';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Platform Header */}
      <div id="admin-header" className="bg-gray-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Globe size={400} className="animate-pulse" />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#0690AE] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0690AE]/20">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight">Governance OS</h1>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Master Platform Control v4.2</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-10">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Platform GMV</p>
              <h3 className="text-4xl font-black text-white">${(totalRevenue/1000).toFixed(1)}k</h3>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Global Compliance Rate</p>
              <h3 className="text-4xl font-black text-green-400">99.4%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Sub-Navigation */}
      <div className="flex bg-white p-2 rounded-[2.5rem] border border-gray-100 shadow-sm w-fit scroll-smooth overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'registry', label: 'Company Registry', icon: Building2 },
          { id: 'financials', label: 'Revenue Flow', icon: CreditCard },
          { id: 'ops', label: 'Mediation & Ops', icon: TicketCheck },
          { id: 'system', label: 'System Health', icon: Activity },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-3xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#0690AE] text-white shadow-xl shadow-[#CDEEF5]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-gray-900">Weekly Gross Trading Volume</h3>
                  <div className="flex items-center gap-2 text-green-600 text-xs font-black">
                    <TrendingUp size={14} /> +12.4% vs Last Week
                  </div>
                </div>
                <div className="h-72">
                  <SafeResponsiveContainer minHeight={240}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0690AE" stopOpacity={0.14}/>
                          <stop offset="95%" stopColor="#0690AE" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} />
                      <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="revenue" stroke="#0690AE" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </SafeResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Retention Analysis</h4>
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-sm font-bold">Churn Rate</span>
                   <span className="text-2xl font-black">1.2%</span>
                 </div>
                 <div className="h-1.5 w-full bg-[#E6F6FA] rounded-full overflow-hidden">
                   <div className="h-full bg-[#0690AE] w-[1.2%]"></div>
                 </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Handshake size={20} className="text-[#057D97]" /> All Merchant Deals
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                    Complete platform-level view across all merchants
                  </p>
                </div>
                <div className="px-4 py-2 bg-[#E6F6FA] text-[#057D97] rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#CDEEF5]">
                  {allDealsSorted.length} Total Deals
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Deal ID</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Buyer</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Merchant(s)</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allDealsSorted.map((deal) => (
                      <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-5">
                          <span className="font-black text-gray-900">DEAL-{deal.id.toUpperCase()}</span>
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-gray-700">{getCompanyName(deal.buyerId)}</td>
                        <td className="px-8 py-5 text-sm font-bold text-gray-700">
                          {deal.sellerIds.map(getCompanyName).join(', ') || '-'}
                        </td>
                        <td className="px-8 py-5 text-sm font-black text-gray-900">${deal.amount.toLocaleString()}</td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getDealStatusClass(String(deal.status))}`}>
                            {String(deal.status).replaceAll('_', ' ')}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-xs text-gray-500 font-medium">
                          {new Date(deal.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {allDealsSorted.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-8 py-16 text-center text-sm font-bold text-gray-400">
                          No deals available yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'registry' && (
          <div id="admin-registry" className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
               <h2 className="text-xl font-black text-gray-900">Platform Entity Registry</h2>
               <div className="relative w-full md:w-96">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Filter by Entity Name, GST, or ID..." 
                   className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#0690AE] transition-all font-medium"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Entity Metadata</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Regulatory (GST)</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trust Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Activity</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCompanies.map(company => (
                    <tr key={company.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-[#057D97] font-black text-lg">
                            {company.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{company.name}</p>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{company.domain}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-mono text-sm text-gray-600">{company.gst}</td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest w-fit ${
                            company.verified ? 'bg-[#CDEEF5] text-[#057D97]' : 'bg-[#CDEEF5] text-[#057D97]'
                          }`}>
                            {company.verified ? 'Verified Node' : 'Unvetted Entity'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col">
                           <span className="text-xs font-bold text-gray-900">Active</span>
                           <span className="text-[10px] text-gray-400 font-medium italic">v{new Date(company.lastActive).toLocaleDateString()}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                           <button onClick={() => setConfirmingCompany(company)} title="Verify/Grant Status" className={`p-3 border rounded-2xl transition-all shadow-sm ${company.verified ? 'bg-red-50 border-red-100 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-[#E6F6FA] border-[#CDEEF5] text-[#057D97] hover:bg-[#0690AE] hover:text-white'}`}>
                             <Fingerprint size={18} />
                           </button>
                           <button onClick={() => setAddingReportFor(company)} title="Manage Compliance" className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:bg-[#0690AE] hover:text-white transition-all shadow-sm">
                             <FileSearch size={18} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {[
                 { label: 'Escrow Holdings', value: '$840,000', icon: Lock, color: 'cyan' },
                 { label: 'Settled Payouts', value: '$210,000', icon: DollarSign, color: 'green' },
                 { label: 'Refund Volume', value: '$5,000', icon: AlertCircle, color: 'red' },
                 { label: 'Platform Fees', value: '$42,750', icon: TrendingUp, color: 'blue' },
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                   <div
                     className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${
                       stat.color === 'cyan'
                         ? 'bg-[#E6F6FA] text-[#057D97]'
                         : stat.color === 'green'
                           ? 'bg-green-50 text-green-600'
                           : stat.color === 'red'
                             ? 'bg-red-50 text-red-600'
                             : 'bg-[#E6F6FA] text-[#0690AE]'
                     }`}
                   >
                     <stat.icon size={20} />
                   </div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                   <h3 className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* Verification Confirmation Modal */}
      {confirmingCompany && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-12 relative animate-in zoom-in duration-300">
            <button onClick={() => setConfirmingCompany(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center text-center mb-8">
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl ${confirmingCompany.verified ? 'bg-red-50 text-red-600 shadow-red-100' : 'bg-[#E6F6FA] text-[#057D97] shadow-[#CDEEF5]'}`}>
                {confirmingCompany.verified ? <BadgeAlert size={40} /> : <ShieldCheck size={40} />}
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">{confirmingCompany.verified ? 'Revoke Status?' : 'Grant Verification?'}</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Target Entity: {confirmingCompany.name}</p>
            </div>

            <div className="space-y-6 mb-10">
              <div className={`p-6 rounded-2xl border ${confirmingCompany.verified ? 'bg-red-50 border-red-100' : 'bg-[#E6F6FA] border-[#CDEEF5]'}`}>
                <h4 className={`text-xs font-black uppercase tracking-widest mb-2 ${confirmingCompany.verified ? 'text-red-900' : 'text-[#034E5E]'}`}>Action Consequences</h4>
                <p className={`text-xs font-medium leading-relaxed ${confirmingCompany.verified ? 'text-red-700/80' : 'text-[#057D97]/80'}`}>
                  {confirmingCompany.verified 
                    ? "CRITICAL: Revoking verification will immediately alert all active counterparties. This may freeze pending settlements in the Deal Workspace and strip the entity of its 'Verified' badge and public trust rating."
                    : "This action will grant the entity 'Nexus Verified' status. They will gain immediate access to institutional-grade contracts, public reputation badges, and the secure escrow settlement layer."
                  }
                </p>
              </div>

              {/* Audit Summary Check */}
              <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compliance Audit Log</h4>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${confirmingCompany.auditReports?.length ? 'bg-green-50 text-green-600' : 'bg-[#E6F6FA] text-[#0690AE]'}`}>
                      {confirmingCompany.auditReports?.length || 0} Reports
                    </span>
                 </div>
                 
                 {confirmingCompany.auditReports?.length ? (
                   <div className="flex items-center gap-3">
                      <FileCheck2 size={16} className="text-green-500" />
                      <span className="text-[10px] font-bold text-gray-600">Entity has passed previous platform vetting.</span>
                   </div>
                 ) : (
                   <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle size={16} className="text-[#0690AE] shrink-0 mt-0.5" />
                        <span className="text-[10px] font-medium text-[#057D97] leading-tight">Entity lacks formal audit history. Revocation/Grant without data points is discouraged.</span>
                      </div>
                      <button 
                        onClick={() => {
                          setAddingReportFor(confirmingCompany);
                          setConfirmingCompany(null);
                        }}
                        className="text-[10px] font-black text-[#057D97] hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Add Preliminary Report
                      </button>
                   </div>
                 )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleConfirmAction}
                disabled={!isActionEnabled}
                className={`w-full py-5 text-white font-black rounded-2xl shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
                  confirmingCompany.verified ? 'bg-red-600 hover:bg-red-700 shadow-red-100' : 'bg-[#0690AE] hover:bg-[#057D97] shadow-[#CDEEF5]'
                }`}
              >
                {!isActionEnabled && <Loader2 size={18} className="animate-spin" />}
                {isActionEnabled ? (confirmingCompany.verified ? 'Commit Revocation' : 'Authorize Verification') : 'Securing Admin Session...'}
              </button>
              <button onClick={() => setConfirmingCompany(null)} className="w-full py-4 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-900 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Report Modal */}
      {addingReportFor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-12 relative animate-in zoom-in duration-300">
            <button onClick={() => setAddingReportFor(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-8">
               <div className="w-16 h-16 bg-[#E6F6FA] rounded-2xl flex items-center justify-center text-[#057D97] font-black text-2xl">
                 {addingReportFor.name.charAt(0)}
               </div>
               <div>
                 <h3 className="text-2xl font-black text-gray-900">Compliance Center</h3>
                 <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Audit Pipeline: {addingReportFor.name}</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manual Entry</h4>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Report Title</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0690AE]" 
                    placeholder="e.g., Annual Financial Audit 2024"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Score (%)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0690AE]" 
                      value={reportScore}
                      onChange={(e) => setReportScore(parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0690AE]"
                      value={reportCategory}
                      onChange={(e) => setReportCategory(e.target.value as any)}
                    >
                      <option value="FINANCIAL">FINANCIAL</option>
                      <option value="OPERATIONAL">OPERATIONAL</option>
                      <option value="COMPLIANCE">COMPLIANCE</option>
                    </select>
                  </div>
                </div>
                <button 
                  onClick={handleAddAuditReport}
                  className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                >
                  Publish Manual Report
                </button>
              </div>

              <div className="flex flex-col">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">AI-Driven Audit</h4>
                <div className="flex-1 bg-[#E6F6FA] rounded-3xl p-8 border border-[#CDEEF5] flex flex-col justify-between items-center text-center">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#057D97] shadow-sm mb-4">
                     {isGeneratingAudit ? <Loader2 className="animate-spin" size={32} /> : <Sparkles size={32} />}
                   </div>
                   <div>
                     <p className="text-sm font-black text-[#034E5E] mb-2">Platform Intelligence</p>
                     <p className="text-xs text-[#057D97]/70 font-medium leading-relaxed mb-6 italic">Automatically analyze entity metrics, GST filings, and performance history to generate a verified audit report.</p>
                   </div>
                   <button 
                    onClick={handleAIAudit}
                    disabled={isGeneratingAudit}
                    className="w-full py-4 bg-[#0690AE] text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-[#9EDDEA] hover:bg-[#057D97] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                   >
                     {isGeneratingAudit ? 'Analyzing Signals...' : <><Sparkles size={16} /> Run AI Vetting</>}
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
