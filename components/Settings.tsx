
import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Building2, 
  Shield, 
  Bell, 
  Lock, 
  ChevronRight, 
  CreditCard, 
  CheckCircle, 
  Smartphone, 
  Key, 
  Mail, 
  Slack, 
  History, 
  Plus,
  ArrowRight,
  Users,
  Terminal,
  FileSearch,
  Cloud,
  Trash2,
  ShieldCheck,
  FileText,
  Download,
  Award,
  ToggleRight,
  ShieldAlert,
  SmartphoneNfc,
  X,
  BookOpen,
  Copy,
  Check,
  Wallet,
  Activity,
  Sparkles,
  Loader2,
  ExternalLink,
  Save,
  RefreshCcw,
  Zap,
  Globe,
  DollarSign,
  // Fix: Added missing TrendingUp import
  TrendingUp
} from 'lucide-react';
import { User, Company, TeamMember, AuditReport } from '../types';

interface SettingsProps {
  user: User;
  company: Company | undefined;
}

const Settings: React.FC<SettingsProps> = ({ user, company }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDownloadingCert, setIsDownloadingCert] = useState(false);

  // New states for interactive components
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(company?.team || [
    { id: '1', name: 'Aman Chauhan', role: 'Director', permissions: ['ADMIN'] },
    { id: '2', name: 'Sarah Lee', role: 'FinOps', permissions: ['FINANCE'] }
  ]);

  const [apiKeys, setApiKeys] = useState(company?.apiKeys || [
    { id: 'k1', name: 'Production ERP Sync', prefix: 'nx_live_...' }
  ]);

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInviteMember = () => {
    if (!inviteEmail) return;
    const newMember: TeamMember = {
      id: Math.random().toString(36).substr(2, 5),
      name: inviteEmail.split('@')[0],
      role: 'Contributor',
      permissions: ['VIEW']
    };
    setTeamMembers([...teamMembers, newMember]);
    setShowInviteModal(false);
    setInviteEmail('');
  };

  const handleGenerateKey = () => {
    const newKey = { id: `k${Date.now()}`, name: 'New Integration Key', prefix: 'nx_test_' + Math.random().toString(36).substr(2, 8) };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadCert = () => {
    setIsDownloadingCert(true);
    setTimeout(() => {
      setIsDownloadingCert(false);
      alert('Trust Certificate Nexus-v4.2 generated. Downloaded to your corporate vault.');
    }, 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Personal Identity', icon: UserIcon },
    { id: 'company', label: 'Entity Profile', icon: Building2 },
    { id: 'team', label: 'Team Governance', icon: Users },
    { id: 'compliance', label: 'Compliance Vault', icon: FileSearch },
    { id: 'security', label: 'Trust & Access', icon: Lock },
    { id: 'notifications', label: 'Network Alerts', icon: Bell },
    { id: 'developer', label: 'Developer API', icon: Terminal },
    { id: 'billing', label: 'Financial Wallet', icon: CreditCard },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Enterprise Infrastructure</h1>
        <p className="text-gray-500 mt-1 font-medium italic">Configure your corporate nexus, team permissions, and global integration settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              id={item.id === 'compliance' ? 'settings-compliance-tab' : undefined}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                activeTab === item.id 
                ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-100' 
                : 'text-gray-500 hover:bg-white border border-transparent hover:border-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                <span className="font-bold text-xs">{item.label}</span>
              </div>
              <ChevronRight size={14} />
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'profile' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <UserIcon size={24} className="text-cyan-700" /> Identity Attributes
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Legal Name</label>
                    <input type="text" defaultValue={user.name} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Corporate Primary Email</label>
                    <input type="email" defaultValue={user.email} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Building2 size={24} className="text-cyan-700" /> Corporate Entity Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Entity Legal Name</label>
                    <input type="text" defaultValue={company?.name} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" />
                   </div>
                   <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tax ID (GST/VAT)</label>
                    <input type="text" defaultValue={company?.gst} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" />
                   </div>
                   <div className="flex gap-4 pt-4">
                     <button className="flex-1 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all">Update Documents</button>
                     <button className="flex-1 py-3 bg-cyan-50 text-cyan-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-cyan-100 transition-all">Request Audit</button>
                   </div>
                </div>
                <div className="p-8 bg-cyan-50 rounded-[2rem] border border-cyan-100 flex flex-col justify-between relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5"><Globe size={120} /></div>
                   <div className="relative z-10">
                     <p className="text-[10px] font-black text-cyan-700 uppercase tracking-widest mb-1">Entity Domain</p>
                     <p className="text-xl font-black text-cyan-900">{company?.domain}</p>
                   </div>
                   <div className="flex gap-2 flex-wrap mt-4 relative z-10">
                     {company?.capabilities.map(c => (
                       <span key={c} className="px-3 py-1 bg-white border border-cyan-100 text-[9px] font-black text-cyan-700 uppercase rounded-lg shadow-sm">{c}</span>
                     ))}
                   </div>
                   <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-[10px] text-cyan-900 font-bold leading-relaxed">
                     Official platform profile for discovery by vetted global procurement agents.
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div id="settings-compliance-header" className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <ShieldCheck size={24} className="text-cyan-700" /> Compliance Vault
                </h3>
                {company?.verified ? (
                  <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
                    <ShieldCheck size={14} /> Trust Rating: A+
                  </div>
                ) : (
                  <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100">
                    Vetting Required
                  </div>
                )}
              </div>

              {company?.verified ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {company.auditReports?.map((report) => (
                      <div key={report.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-cyan-200 transition-all group">
                         <div className="flex items-center justify-between mb-4">
                           <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                             report.category === 'FINANCIAL' ? 'bg-cyan-100 text-cyan-700' : 'bg-purple-100 text-purple-700'
                           }`}>
                             {report.category}
                           </span>
                           <span className="text-[10px] font-black text-green-600">{report.score}% Score</span>
                         </div>
                         <h4 className="font-bold text-gray-900 mb-2">{report.title}</h4>
                         <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 italic">"{report.summary}"</p>
                         <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(report.date).toLocaleDateString()}</span>
                            <button className="flex items-center gap-2 text-xs font-black text-cyan-700 hover:text-cyan-800">
                               <Download size={14} /> Report
                            </button>
                         </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-8 bg-cyan-600 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-cyan-100">
                    <div className="max-w-md">
                      <h4 className="text-lg font-black mb-2 flex items-center gap-2">
                        <Award size={20} className="text-amber-400" /> Verified Trust Certificate
                      </h4>
                      <p className="text-xs font-medium text-cyan-100 leading-relaxed">Your company has successfully passed the 12-point Nexus Audit. This certification is valid until Dec 2024.</p>
                    </div>
                    <button 
                      onClick={handleDownloadCert}
                      disabled={isDownloadingCert}
                      className="px-6 py-3 bg-white text-cyan-700 font-black rounded-xl text-xs uppercase tracking-widest shadow-xl flex items-center gap-2"
                    >
                      {isDownloadingCert ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                      {isDownloadingCert ? 'Generating...' : 'Download Certificate'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                      <FileSearch size={32} />
                   </div>
                   <h4 className="text-lg font-black text-gray-900 mb-2">No Reports Found</h4>
                   <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8 font-medium">Verify your business to unlock the Compliance Vault and build trust with enterprise buyers.</p>
                   <button className="px-8 py-3 bg-cyan-600 text-white font-black rounded-xl text-xs uppercase tracking-widest">
                     Start Vetting Process
                   </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <Users size={24} className="text-cyan-700" /> Member Governance
                </h3>
                <button onClick={() => setShowInviteModal(true)} className="px-4 py-2 bg-cyan-50 text-cyan-700 text-xs font-black rounded-xl hover:bg-cyan-100 transition-all uppercase tracking-widest flex items-center gap-2">
                  <Plus size={14} /> Invite Member
                </button>
              </div>
              <div className="space-y-4">
                 {teamMembers.map(member => (
                   <div key={member.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-cyan-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center font-black text-cyan-700">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{member.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {member.permissions.map(p => (
                          <span key={p} className="px-2 py-1 bg-cyan-50 text-cyan-700 text-[10px] font-black rounded uppercase tracking-widest">{p}</span>
                        ))}
                      </div>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Lock size={24} className="text-cyan-700" /> Security Infrastructure
              </h3>
              <div className="space-y-6">
                 {[
                   { title: 'Multi-Factor Authentication', status: 'Enabled', icon: SmartphoneNfc, desc: 'Requires a mobile device for corporate logins.' },
                   { title: 'Immutable Audit Logging', status: 'Active', icon: Activity, desc: 'All platform actions are recorded on a tamper-proof ledger.' },
                   { title: 'AES-256 Workspace Encryption', status: 'Active', icon: Shield, desc: 'Your deal data is encrypted at rest and in transit.' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-cyan-700"><item.icon size={20} /></div>
                        <div>
                           <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                           <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded-lg border border-green-100">{item.status}</span>
                         <button className="text-[10px] font-black text-cyan-700 hover:underline">Configure</button>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Bell size={24} className="text-cyan-700" /> Network Alert System
              </h3>
              <div className="space-y-4">
                 {[
                   { label: 'Milestone Approvals', type: 'Email, Push', enabled: true },
                   { label: 'Contract Signatures', type: 'Email, SMS', enabled: true },
                   { label: 'Escrow Settlement Alerts', type: 'Email', enabled: false },
                   { label: 'New Marketplace Matches', type: 'Slack', enabled: true }
                 ].map((notif, i) => (
                   <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 group">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{notif.label}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{notif.type}</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full p-1 transition-all ${notif.enabled ? 'bg-cyan-600' : 'bg-gray-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${notif.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'developer' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <Terminal size={24} className="text-cyan-700" /> Nexus API Gateway
                </h3>
                <button onClick={handleGenerateKey} className="px-4 py-2 bg-gray-900 text-white text-xs font-black rounded-xl hover:bg-black transition-all uppercase tracking-widest flex items-center gap-2">
                  <Key size={14} /> Generate Key
                </button>
              </div>
              
              <div className="space-y-6">
                 {apiKeys.map(key => (
                   <div key={key.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                         <p className="font-bold text-gray-900">{key.name}</p>
                         <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1"><Cloud size={14} /> Active</span>
                      </div>
                      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 font-mono text-xs overflow-hidden">
                        <span className="text-gray-500 truncate mr-4">{key.prefix}</span>
                        <div className="flex gap-2">
                           <button onClick={() => handleCopy(key.prefix)} className="p-2 hover:bg-gray-100 rounded-lg text-cyan-700 transition-all">
                             {copiedKey === key.prefix ? <Check size={16} /> : <Copy size={16} />}
                           </button>
                           <button className="text-cyan-700 font-black uppercase tracking-widest text-[9px]">Revoke</button>
                        </div>
                      </div>
                   </div>
                 ))}
                 
                 <div className="mt-8 p-8 border-2 border-dashed border-gray-200 rounded-3xl text-center bg-gray-50/50">
                    <p className="text-sm font-bold text-gray-400 italic">"Integrating your ERP? Consult the <button onClick={() => setShowDocs(true)} className="text-cyan-700 underline hover:text-cyan-800 font-black">Nexus Dev Docs</button>."</p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <CreditCard size={24} className="text-cyan-700" /> Financial Infrastructure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                 <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 p-10 opacity-10"><Wallet size={120} /></div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Platform Escrow Balance</p>
                   <h4 className="text-4xl font-black mb-10">$124,500.00</h4>
                   <div className="flex justify-between items-end relative z-10">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-cyan-500 flex items-center justify-center text-[10px] font-black">N</div>)}
                      </div>
                      <button className="px-5 py-2.5 bg-white text-gray-900 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-xl hover:bg-gray-100 transition-all">Manage Wallet</button>
                   </div>
                 </div>
                 <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><TrendingUp size={18} className="text-green-500" /> Institutional Payouts</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">Auto-settlement active for confirmed deal nodes. 24-hour verification window enabled.</p>
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                       <CheckCircle className="text-green-500" size={16} />
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Regulatory KYC Cleared</span>
                    </div>
                 </div>
              </div>

              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Settlement Payment Nodes</h4>
              <div className="space-y-3">
                 {[
                   { name: 'HDFC Corporate Current', type: 'Bank Settlement', icon: Building2, status: 'Active' },
                   { name: 'Nexus Escrow Wallet', type: 'Native Node', icon: ShieldCheck, status: 'Active' }
                 ].map((node, i) => (
                   <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-cyan-100 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-cyan-700"><node.icon size={18} /></div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{node.name}</p>
                          <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">{node.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] font-black text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded-md border border-green-100">{node.status}</span>
                         <button className="text-[10px] font-black text-cyan-700 hover:underline uppercase tracking-widest">Config</button>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
            {showSuccess && (
              <div className="flex items-center gap-2 text-green-600 font-bold animate-in fade-in slide-in-from-left-4">
                <CheckCircle size={20} /> Infrastructure Synchronized
              </div>
            )}
            <div className="flex justify-end gap-4 ml-auto">
              <button 
                onClick={() => setActiveTab('profile')}
                className="px-8 py-4 text-sm font-black text-gray-500 uppercase tracking-widest hover:text-gray-900 transition-all"
              >
                Reset Changes
              </button>
              <button 
                onClick={handleSave}
                className="px-10 py-4 bg-cyan-600 text-white text-sm font-black rounded-2xl shadow-xl shadow-cyan-100 hover:bg-cyan-700 transition-all active:scale-95 flex items-center gap-2"
              >
                Commit Attributes <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-gray-900 mb-6">Invite Team Member</h3>
            <div className="space-y-6">
               <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Corporate Email</label>
                  <input 
                    type="email" 
                    placeholder="sarah@company.com" 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-cyan-500/10 text-sm font-bold"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Permissions</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest outline-none">
                    <option>ADMIN (FULL CONTROL)</option>
                    <option>OPERATIONS (DEALS ONLY)</option>
                    <option>FINANCE (ESCROW ONLY)</option>
                    <option>VIEW ONLY (AUDITOR)</option>
                  </select>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setShowInviteModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-black rounded-xl text-xs uppercase tracking-widest">Cancel</button>
                  <button onClick={handleInviteMember} className="flex-1 py-4 bg-cyan-600 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-cyan-100">Send Invite</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Developer Documentation Modal */}
      {showDocs && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500">
             <div className="p-10 border-b border-gray-100 bg-gray-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-cyan-600 rounded-2xl flex items-center justify-center text-white shadow-xl"><BookOpen size={24} /></div>
                   <div>
                     <h3 className="text-2xl font-black tracking-tight">Nexus Developer Ecosystem</h3>
                     <p className="text-[10px] text-cyan-300 font-black uppercase tracking-widest">API v4.2 Core Documentation</p>
                   </div>
                </div>
                <button onClick={() => setShowDocs(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X size={20} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-12 space-y-12">
                <section>
                   <h4 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3"><Terminal size={20} className="text-cyan-700" /> Authentication</h4>
                   <p className="text-sm text-gray-500 leading-relaxed mb-6 font-medium">All API requests must include your `nx_live_...` or `nx_test_...` key in the `X-Nexus-Key` header. Keys are scoped to your corporate entity.</p>
                   <div className="bg-gray-900 p-6 rounded-3xl font-mono text-xs text-cyan-300 shadow-inner">
                      <p className="text-white/60"># Sample GET Request</p>
                      <p>GET /v4/marketplace/listings</p>
                      <p>Host: api.b2bnexus.io</p>
                      <p>X-Nexus-Key: [YOUR_API_KEY]</p>
                   </div>
                </section>
                
                <section>
                   <h4 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3"><Cloud size={20} className="text-cyan-700" /> Webhook Events</h4>
                   <p className="text-sm text-gray-500 leading-relaxed mb-4 font-medium">Configure webhooks in your developer portal to receive real-time notifications for deal events.</p>
                   <div className="grid grid-cols-2 gap-4">
                      {['deal.milestone_paid', 'contract.signed', 'risk_score.alert', 'company.verified', 'escrow.funded', 'milestone.approved'].map(event => (
                        <div key={event} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-mono text-[10px] text-gray-600 flex items-center justify-between">
                          {event} <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                      ))}
                   </div>
                </section>

                <div className="p-10 bg-cyan-600 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl">
                   <div className="absolute top-0 right-0 p-12 opacity-10"><Zap size={140} /></div>
                   <div className="relative z-10">
                     <h4 className="text-xl font-black mb-2 flex items-center gap-2"><Sparkles size={20} /> AI Query Integration</h4>
                     <p className="text-sm font-medium text-cyan-100 mb-6 leading-relaxed">Directly query our Gemini-powered compliance layer via `/v4/intelligence/scan` to perform custom risk assessments on incoming deal nodes.</p>
                     <div className="flex gap-4">
                       <button className="px-8 py-3 bg-white text-cyan-700 font-black rounded-xl text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">
                         Go to Sandbox <ExternalLink size={14} />
                       </button>
                       <button className="px-8 py-3 bg-cyan-500 text-white font-black rounded-xl text-xs uppercase tracking-widest border border-cyan-400">View SDKs</button>
                     </div>
                   </div>
                </div>
             </div>
             <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">© 2024 Nexus Platform Development Group</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
