
import React, { useEffect, useMemo, useState } from 'react';
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

interface AlertPreference {
  id: string;
  label: string;
  type: string;
  enabled: boolean;
}

interface StoredUserProfile {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  companyId?: string;
  companyName?: string;
  gstNumber?: string;
  industry?: string;
  companyDomain?: string;
  website?: string;
  address?: string;
  description?: string;
}

interface SecurityControl {
  id: string;
  title: string;
  status: 'Enabled' | 'Active' | 'Disabled';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  desc: string;
}

interface PaymentNode {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Paused';
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const DEFAULT_ALERTS: AlertPreference[] = [
  { id: 'milestone_approvals', label: 'Milestone Approvals', type: 'Email, Push', enabled: true },
  { id: 'contract_signatures', label: 'Contract Signatures', type: 'Email, SMS', enabled: true },
  { id: 'escrow_settlements', label: 'Escrow Settlement Alerts', type: 'Email', enabled: false },
  { id: 'marketplace_matches', label: 'New Marketplace Matches', type: 'Slack', enabled: true },
];

const DEFAULT_SECURITY_CONTROLS: SecurityControl[] = [
  {
    id: 'mfa',
    title: 'Multi-Factor Authentication',
    status: 'Enabled',
    icon: SmartphoneNfc,
    desc: 'Requires a mobile device for corporate logins.',
  },
  {
    id: 'audit_logging',
    title: 'Immutable Audit Logging',
    status: 'Active',
    icon: Activity,
    desc: 'All platform actions are recorded on a tamper-proof ledger.',
  },
  {
    id: 'workspace_encryption',
    title: 'AES-256 Workspace Encryption',
    status: 'Active',
    icon: Shield,
    desc: 'Your deal data is encrypted at rest and in transit.',
  },
];

const DEFAULT_PAYMENT_NODES: PaymentNode[] = [
  { id: 'bank_settlement', name: 'HDFC Corporate Current', type: 'Bank Settlement', icon: Building2, status: 'Active' },
  { id: 'escrow_wallet', name: 'Nexus Escrow Wallet', type: 'Native Node', icon: ShieldCheck, status: 'Active' },
];

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

  const profileStorageKey = useMemo(() => `nexus_user_profile_${user.id}`, [user.id]);
  const alertsStorageKey = useMemo(() => `nexus_network_alerts_${user.id}`, [user.id]);
  const teamStorageKey = useMemo(() => `nexus_team_members_${company?.id || user.companyId || user.id}`, [company?.id, user.companyId, user.id]);
  const apiStorageKey = useMemo(() => `nexus_api_keys_${company?.id || user.companyId || user.id}`, [company?.id, user.companyId, user.id]);
  const securityStorageKey = useMemo(() => `nexus_security_controls_${company?.id || user.companyId || user.id}`, [company?.id, user.companyId, user.id]);
  const paymentStorageKey = useMemo(() => `nexus_payment_nodes_${company?.id || user.companyId || user.id}`, [company?.id, user.companyId, user.id]);
  const auditStorageKey = useMemo(() => `nexus_audit_reports_${company?.id || user.companyId || user.id}`, [company?.id, user.companyId, user.id]);

  const [profileDetails, setProfileDetails] = useState<StoredUserProfile>({
    fullName: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    role: String(user.role || ''),
    companyId: user.companyId || '',
    companyName: company?.name || user.companyName || '',
    gstNumber: company?.gst || user.gstNumber || '',
    industry: user.industry || '',
    companyDomain: user.companyDomain || company?.domain || '',
    website: user.website || '',
    address: user.address || '',
    description: user.description || '',
  });

  const [networkAlerts, setNetworkAlerts] = useState<AlertPreference[]>(DEFAULT_ALERTS);
  const [securityControls, setSecurityControls] = useState<SecurityControl[]>(DEFAULT_SECURITY_CONTROLS);
  const [paymentNodes, setPaymentNodes] = useState<PaymentNode[]>(DEFAULT_PAYMENT_NODES);
  const [auditReports, setAuditReports] = useState<AuditReport[]>(company?.auditReports || []);
  const [companyProfile, setCompanyProfile] = useState({
    name: company?.name || profileDetails.companyName || '',
    gst: company?.gst || profileDetails.gstNumber || '',
  });
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentType, setDocumentType] = useState('Trade License');
  const [documentReference, setDocumentReference] = useState('');

  useEffect(() => {
    try {
      const rawProfile = localStorage.getItem(profileStorageKey);
      const savedProfile = rawProfile ? (JSON.parse(rawProfile) as StoredUserProfile) : {};
      setProfileDetails({
        fullName: savedProfile.fullName || user.name || '',
        email: savedProfile.email || user.email || '',
        phone: savedProfile.phone || user.phone || '',
        role: savedProfile.role || String(user.role || ''),
        companyId: savedProfile.companyId || user.companyId || '',
        companyName: savedProfile.companyName || company?.name || user.companyName || '',
        gstNumber: savedProfile.gstNumber || company?.gst || user.gstNumber || '',
        industry: savedProfile.industry || user.industry || '',
        companyDomain: savedProfile.companyDomain || user.companyDomain || company?.domain || '',
        website: savedProfile.website || user.website || '',
        address: savedProfile.address || user.address || '',
        description: savedProfile.description || user.description || '',
      });
    } catch {
      // Ignore localStorage parse failures
    }
  }, [profileStorageKey, user, company]);

  useEffect(() => {
    try {
      const rawAlerts = localStorage.getItem(alertsStorageKey);
      if (!rawAlerts) return;
      const parsed = JSON.parse(rawAlerts) as AlertPreference[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setNetworkAlerts(parsed);
      }
    } catch {
      // Ignore localStorage parse failures
    }
  }, [alertsStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(alertsStorageKey, JSON.stringify(networkAlerts));
    } catch {
      // Ignore localStorage write failures
    }
  }, [alertsStorageKey, networkAlerts]);

  useEffect(() => {
    try {
      const rawTeam = localStorage.getItem(teamStorageKey);
      if (rawTeam) {
        const parsed = JSON.parse(rawTeam) as TeamMember[];
        if (Array.isArray(parsed)) setTeamMembers(parsed);
      }

      const rawApi = localStorage.getItem(apiStorageKey);
      if (rawApi) {
        const parsed = JSON.parse(rawApi) as { id: string; name: string; prefix: string }[];
        if (Array.isArray(parsed)) setApiKeys(parsed);
      }

      const rawSecurity = localStorage.getItem(securityStorageKey);
      if (rawSecurity) {
        const parsed = JSON.parse(rawSecurity) as SecurityControl[];
        if (Array.isArray(parsed)) setSecurityControls(parsed);
      }

      const rawPayment = localStorage.getItem(paymentStorageKey);
      if (rawPayment) {
        const parsed = JSON.parse(rawPayment) as PaymentNode[];
        if (Array.isArray(parsed)) setPaymentNodes(parsed);
      }

      const rawAudit = localStorage.getItem(auditStorageKey);
      if (rawAudit) {
        const parsed = JSON.parse(rawAudit) as AuditReport[];
        if (Array.isArray(parsed)) setAuditReports(parsed);
      } else if (company?.auditReports) {
        setAuditReports(company.auditReports);
      }
    } catch {
      // Ignore localStorage parse failures
    }
  }, [teamStorageKey, apiStorageKey, securityStorageKey, paymentStorageKey, auditStorageKey, company?.auditReports]);

  useEffect(() => {
    setCompanyProfile({
      name: company?.name || profileDetails.companyName || '',
      gst: company?.gst || profileDetails.gstNumber || '',
    });
  }, [company?.name, company?.gst, profileDetails.companyName, profileDetails.gstNumber]);

  useEffect(() => {
    try {
      localStorage.setItem(teamStorageKey, JSON.stringify(teamMembers));
    } catch {
      // Ignore localStorage write failures
    }
  }, [teamStorageKey, teamMembers]);

  useEffect(() => {
    try {
      localStorage.setItem(apiStorageKey, JSON.stringify(apiKeys));
    } catch {
      // Ignore localStorage write failures
    }
  }, [apiStorageKey, apiKeys]);

  useEffect(() => {
    try {
      localStorage.setItem(securityStorageKey, JSON.stringify(securityControls));
    } catch {
      // Ignore localStorage write failures
    }
  }, [securityStorageKey, securityControls]);

  useEffect(() => {
    try {
      localStorage.setItem(paymentStorageKey, JSON.stringify(paymentNodes));
    } catch {
      // Ignore localStorage write failures
    }
  }, [paymentStorageKey, paymentNodes]);

  useEffect(() => {
    try {
      localStorage.setItem(auditStorageKey, JSON.stringify(auditReports));
    } catch {
      // Ignore localStorage write failures
    }
  }, [auditStorageKey, auditReports]);

  useEffect(() => {
    if (!actionMessage) return;
    const timer = window.setTimeout(() => setActionMessage(null), 2400);
    return () => window.clearTimeout(timer);
  }, [actionMessage]);

  const showActionMessage = (text: string) => {
    setActionMessage(text);
  };

  const updateProfileField = (field: keyof StoredUserProfile, value: string) => {
    setProfileDetails((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAlert = (id: string) => {
    setNetworkAlerts((prev) => prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)));
    showActionMessage('Network alert preference updated.');
  };

  const updateCompanyProfileField = (field: keyof typeof companyProfile, value: string) => {
    setCompanyProfile((prev) => ({ ...prev, [field]: value }));
    if (field === 'name') {
      setProfileDetails((prev) => ({ ...prev, companyName: value }));
    }
    if (field === 'gst') {
      setProfileDetails((prev) => ({ ...prev, gstNumber: value }));
    }
  };

  const handleUpdateDocuments = () => {
    setShowDocumentModal(true);
  };

  const handleSubmitDocumentUpdate = () => {
    if (!documentReference.trim()) {
      showActionMessage('Add a document reference before submitting.');
      return;
    }
    setShowDocumentModal(false);
    setDocumentReference('');
    showActionMessage(`${documentType} update submitted successfully.`);
  };

  const handleRequestAudit = () => {
    const now = new Date();
    const report: AuditReport = {
      id: `ar_${now.getTime()}`,
      title: 'Requested Compliance Audit',
      date: now.toISOString(),
      score: 78,
      category: 'COMPLIANCE',
      summary: 'Audit request submitted by entity profile. Awaiting governance review.',
      fileUrl: '#',
    };
    setAuditReports((prev) => [report, ...prev]);
    setActiveTab('compliance');
    showActionMessage('Audit request sent. Check Compliance Vault for status.');
  };

  const handleRemoveTeamMember = (memberId: string) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== memberId));
    showActionMessage('Team member removed.');
  };

  const handleRevokeApiKey = (keyId: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== keyId));
    showActionMessage('API key revoked.');
  };

  const handleConfigureSecurity = (controlId: string) => {
    setSecurityControls((prev) =>
      prev.map((control) => {
        if (control.id !== controlId) return control;
        const nextStatus: SecurityControl['status'] =
          control.status === 'Disabled'
            ? (control.id === 'mfa' ? 'Enabled' : 'Active')
            : 'Disabled';
        return { ...control, status: nextStatus };
      })
    );
    showActionMessage('Security control updated.');
  };

  const handleTogglePaymentNode = (nodeId: string) => {
    setPaymentNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, status: node.status === 'Active' ? 'Paused' : 'Active' } : node))
    );
    showActionMessage('Payment node configuration updated.');
  };

  const handleManageWallet = () => {
    showActionMessage('Wallet management panel opened.');
  };

  const handleOpenDeveloperLink = (url: string, label: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
      showActionMessage(`${label} opened in a new tab.`);
      return;
    }
    showActionMessage(`${label} is ready to view.`);
  };

  const handleSave = () => {
    const mergedProfile: StoredUserProfile = {
      ...profileDetails,
      companyName: companyProfile.name,
      gstNumber: companyProfile.gst,
    };
    setProfileDetails(mergedProfile);
    try {
      localStorage.setItem(profileStorageKey, JSON.stringify(mergedProfile));
      localStorage.setItem(alertsStorageKey, JSON.stringify(networkAlerts));
      localStorage.setItem(teamStorageKey, JSON.stringify(teamMembers));
      localStorage.setItem(apiStorageKey, JSON.stringify(apiKeys));
      localStorage.setItem(securityStorageKey, JSON.stringify(securityControls));
      localStorage.setItem(paymentStorageKey, JSON.stringify(paymentNodes));
      localStorage.setItem(auditStorageKey, JSON.stringify(auditReports));
    } catch {
      // Ignore localStorage write failures
    }
    setShowSuccess(true);
    showActionMessage('Settings saved successfully.');
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
    showActionMessage('Team member invited.');
  };

  const handleGenerateKey = () => {
    const newKey = { id: `k${Date.now()}`, name: 'New Integration Key', prefix: 'nx_test_' + Math.random().toString(36).substr(2, 8) };
    setApiKeys([...apiKeys, newKey]);
    showActionMessage('New API key generated.');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
    showActionMessage('API key copied.');
  };

  const handleDownloadCert = () => {
    setIsDownloadingCert(true);
    setTimeout(() => {
      setIsDownloadingCert(false);
      showActionMessage('Trust Certificate generated and downloaded.');
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

      {actionMessage && (
        <div className="rounded-2xl border border-[#CDEEF5] bg-[#E6F6FA] px-5 py-3 text-sm font-bold text-[#057D97]">
          {actionMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              id={item.id === 'compliance' ? 'settings-compliance-tab' : undefined}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                activeTab === item.id 
                ? 'bg-[#0690AE] text-white shadow-xl shadow-[#CDEEF5]' 
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
                <UserIcon size={24} className="text-[#057D97]" /> Identity Attributes
              </h3>
              <p className="mb-6 text-xs font-bold uppercase tracking-[0.16em] text-[#057D97]">
                Auto-filled from your sign-in/sign-up details
              </p>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Legal Name</label>
                    <input
                      type="text"
                      value={profileDetails.fullName || ''}
                      onChange={(e) => updateProfileField('fullName', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Corporate Primary Email</label>
                    <input
                      type="email"
                      value={profileDetails.email || ''}
                      onChange={(e) => updateProfileField('email', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                    <input
                      type="text"
                      value={profileDetails.phone || ''}
                      onChange={(e) => updateProfileField('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Role</label>
                    <input
                      type="text"
                      value={profileDetails.role || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Company Name</label>
                    <input
                      type="text"
                      value={profileDetails.companyName || ''}
                      onChange={(e) => updateProfileField('companyName', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">GST / VAT</label>
                    <input
                      type="text"
                      value={profileDetails.gstNumber || ''}
                      onChange={(e) => updateProfileField('gstNumber', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Industry</label>
                    <input
                      type="text"
                      value={profileDetails.industry || ''}
                      onChange={(e) => updateProfileField('industry', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Company Domain</label>
                    <input
                      type="text"
                      value={profileDetails.companyDomain || ''}
                      onChange={(e) => updateProfileField('companyDomain', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Website</label>
                    <input
                      type="text"
                      value={profileDetails.website || ''}
                      onChange={(e) => updateProfileField('website', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Address</label>
                    <input
                      type="text"
                      value={profileDetails.address || ''}
                      onChange={(e) => updateProfileField('address', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Business Description</label>
                  <textarea
                    value={profileDetails.description || ''}
                    onChange={(e) => updateProfileField('description', e.target.value)}
                    className="w-full min-h-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Building2 size={24} className="text-[#057D97]" /> Corporate Entity Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Entity Legal Name</label>
                    <input
                      type="text"
                      value={companyProfile.name}
                      onChange={(e) => updateCompanyProfileField('name', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                    />
                   </div>
                   <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tax ID (GST/VAT)</label>
                    <input
                      type="text"
                      value={companyProfile.gst}
                      onChange={(e) => updateCompanyProfileField('gst', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                    />
                   </div>
                   <div className="flex gap-4 pt-4">
                     <button
                       onClick={handleUpdateDocuments}
                       className="flex-1 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all"
                     >
                       Update Documents
                     </button>
                     <button
                       onClick={handleRequestAudit}
                       className="flex-1 py-3 bg-[#E6F6FA] text-[#057D97] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#CDEEF5] transition-all"
                     >
                       Request Audit
                     </button>
                    </div>
                 </div>
                <div className="p-8 bg-[#E6F6FA] rounded-[2rem] border border-[#CDEEF5] flex flex-col justify-between relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5"><Globe size={120} /></div>
                   <div className="relative z-10">
                     <p className="text-[10px] font-black text-[#057D97] uppercase tracking-widest mb-1">Entity Domain</p>
                     <p className="text-xl font-black text-[#034E5E]">{company?.domain}</p>
                   </div>
                   <div className="flex gap-2 flex-wrap mt-4 relative z-10">
                     {company?.capabilities.map(c => (
                       <span key={c} className="px-3 py-1 bg-white border border-[#CDEEF5] text-[9px] font-black text-[#057D97] uppercase rounded-lg shadow-sm">{c}</span>
                     ))}
                   </div>
                   <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 text-[10px] text-[#034E5E] font-bold leading-relaxed">
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
                  <ShieldCheck size={24} className="text-[#057D97]" /> Compliance Vault
                </h3>
                {company?.verified ? (
                  <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
                    <ShieldCheck size={14} /> Trust Rating: A+
                  </div>
                ) : (
                  <div className="bg-[#E6F6FA] text-[#057D97] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#CDEEF5]">
                    Vetting Required
                  </div>
                )}
              </div>

                {company?.verified || auditReports.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {auditReports.map((report) => (
                      <div key={report.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#9EDDEA] transition-all group">
                         <div className="flex items-center justify-between mb-4">
                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                              report.category === 'FINANCIAL' ? 'bg-[#CDEEF5] text-[#057D97]' : 'bg-[#E6F6FA] text-[#046A80]'
                            }`}>
                              {report.category}
                            </span>
                           <span className="text-[10px] font-black text-green-600">{report.score}% Score</span>
                         </div>
                         <h4 className="font-bold text-gray-900 mb-2">{report.title}</h4>
                         <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 italic">"{report.summary}"</p>
                         <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(report.date).toLocaleDateString()}</span>
                            <button onClick={() => handleOpenDeveloperLink(report.fileUrl || 'https://developer.mozilla.org/', 'Audit report')} className="flex items-center gap-2 text-xs font-black text-[#057D97] hover:text-[#046A80]">
                               <Download size={14} /> Report
                            </button>
                         </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-8 bg-[#0690AE] rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-[#CDEEF5]">
                    <div className="max-w-md">
                      <h4 className="text-lg font-black mb-2 flex items-center gap-2">
                        <Award size={20} className="text-[#38B7D0]" /> Verified Trust Certificate
                      </h4>
                      <p className="text-xs font-medium text-[#CDEEF5] leading-relaxed">Your company has successfully passed the 12-point Nexus Audit. This certification is valid until Dec 2024.</p>
                    </div>
                    <button 
                      onClick={handleDownloadCert}
                      disabled={isDownloadingCert}
                      className="px-6 py-3 bg-white text-[#057D97] font-black rounded-xl text-xs uppercase tracking-widest shadow-xl flex items-center gap-2"
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
                   <button onClick={handleRequestAudit} className="px-8 py-3 bg-[#0690AE] text-white font-black rounded-xl text-xs uppercase tracking-widest">
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
                  <Users size={24} className="text-[#057D97]" /> Member Governance
                </h3>
                <button onClick={() => setShowInviteModal(true)} className="px-4 py-2 bg-[#E6F6FA] text-[#057D97] text-xs font-black rounded-xl hover:bg-[#CDEEF5] transition-all uppercase tracking-widest flex items-center gap-2">
                  <Plus size={14} /> Invite Member
                </button>
              </div>
              <div className="space-y-4">
                 {teamMembers.map(member => (
                   <div key={member.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#9EDDEA] transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center font-black text-[#057D97]">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{member.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {member.permissions.map(p => (
                          <span key={p} className="px-2 py-1 bg-[#E6F6FA] text-[#057D97] text-[10px] font-black rounded uppercase tracking-widest">{p}</span>
                        ))}
                      </div>
                      <button onClick={() => handleRemoveTeamMember(member.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Lock size={24} className="text-[#057D97]" /> Security Infrastructure
              </h3>
              <div className="space-y-6">
                 {securityControls.map((item) => (
                   <div key={item.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-[#057D97]"><item.icon size={20} /></div>
                        <div>
                           <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                           <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${
                           item.status === 'Disabled'
                             ? 'text-red-600 bg-red-50 border-red-100'
                             : 'text-green-600 bg-green-50 border-green-100'
                         }`}>{item.status}</span>
                         <button onClick={() => handleConfigureSecurity(item.id)} className="text-[10px] font-black text-[#057D97] hover:underline">Configure</button>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8 flex items-center justify-between gap-4">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <Bell size={24} className="text-[#057D97]" /> Network Alert System
                </h3>
                <div className="rounded-xl border border-[#CDEEF5] bg-[#E6F6FA] px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#057D97]">
                  {networkAlerts.filter((item) => item.enabled).length}/{networkAlerts.length} Active
                </div>
              </div>
              <div className="space-y-4">
                 {networkAlerts.map((notif) => (
                   <div key={notif.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 group">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{notif.label}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{notif.type}</p>
                      </div>
                      <button
                        onClick={() => toggleAlert(notif.id)}
                        aria-pressed={notif.enabled}
                        className={`w-12 h-6 rounded-full p-1 transition-all ${notif.enabled ? 'bg-[#0690AE]' : 'bg-gray-200'}`}
                      >
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
                  <Terminal size={24} className="text-[#057D97]" /> Nexus API Gateway
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
                           <button onClick={() => handleCopy(key.prefix)} className="p-2 hover:bg-gray-100 rounded-lg text-[#057D97] transition-all">
                             {copiedKey === key.prefix ? <Check size={16} /> : <Copy size={16} />}
                           </button>
                           <button onClick={() => handleRevokeApiKey(key.id)} className="text-[#057D97] font-black uppercase tracking-widest text-[9px]">Revoke</button>
                         </div>
                       </div>
                    </div>
                  ))}
                 
                 <div className="mt-8 p-8 border-2 border-dashed border-gray-200 rounded-3xl text-center bg-gray-50/50">
                    <p className="text-sm font-bold text-gray-400 italic">"Integrating your ERP? Consult the <button onClick={() => setShowDocs(true)} className="text-[#057D97] underline hover:text-[#046A80] font-black">Nexus Dev Docs</button>."</p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <CreditCard size={24} className="text-[#057D97]" /> Financial Infrastructure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                 <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 p-10 opacity-10"><Wallet size={120} /></div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Platform Escrow Balance</p>
                   <h4 className="text-4xl font-black mb-10">$124,500.00</h4>
                   <div className="flex justify-between items-end relative z-10">
                       <div className="flex -space-x-2">
                         {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-[#0690AE] flex items-center justify-center text-[10px] font-black">N</div>)}
                       </div>
                       <button onClick={handleManageWallet} className="px-5 py-2.5 bg-white text-gray-900 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-xl hover:bg-gray-100 transition-all">Manage Wallet</button>
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
                 {paymentNodes.map((node) => (
                   <div key={node.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#CDEEF5] transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-[#057D97]"><node.icon size={18} /></div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{node.name}</p>
                          <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">{node.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                           node.status === 'Active'
                             ? 'text-green-600 bg-green-50 border-green-100'
                             : 'text-amber-700 bg-amber-50 border-amber-100'
                         }`}>{node.status}</span>
                         <button onClick={() => handleTogglePaymentNode(node.id)} className="text-[10px] font-black text-[#057D97] hover:underline uppercase tracking-widest">Config</button>
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
                className="px-10 py-4 bg-[#0690AE] text-white text-sm font-black rounded-2xl shadow-xl shadow-[#CDEEF5] hover:bg-[#057D97] transition-all active:scale-95 flex items-center gap-2"
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
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#0690AE]/10 text-sm font-bold"
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
                  <button onClick={handleInviteMember} className="flex-1 py-4 bg-[#0690AE] text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-[#CDEEF5]">Send Invite</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Entity Document Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-gray-900 mb-6">Update Entity Documents</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Document Type</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none"
                >
                  <option>Trade License</option>
                  <option>GST Certificate</option>
                  <option>Financial Statement</option>
                  <option>Incorporation Proof</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Reference / File Name</label>
                <input
                  type="text"
                  placeholder="e.g. gst-certificate-2026.pdf"
                  value={documentReference}
                  onChange={(e) => setDocumentReference(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none"
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button onClick={() => setShowDocumentModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-500 font-black rounded-xl text-xs uppercase tracking-widest">
                  Cancel
                </button>
                <button onClick={handleSubmitDocumentUpdate} className="flex-1 py-3 bg-[#0690AE] text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-[#CDEEF5]">
                  Submit
                </button>
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
                   <div className="w-12 h-12 bg-[#0690AE] rounded-2xl flex items-center justify-center text-white shadow-xl"><BookOpen size={24} /></div>
                   <div>
                     <h3 className="text-2xl font-black tracking-tight">Nexus Developer Ecosystem</h3>
                     <p className="text-[10px] text-[#6DCDE0] font-black uppercase tracking-widest">API v4.2 Core Documentation</p>
                   </div>
                </div>
                <button onClick={() => setShowDocs(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X size={20} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-12 space-y-12">
                <section>
                   <h4 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3"><Terminal size={20} className="text-[#057D97]" /> Authentication</h4>
                   <p className="text-sm text-gray-500 leading-relaxed mb-6 font-medium">All API requests must include your `nx_live_...` or `nx_test_...` key in the `X-Nexus-Key` header. Keys are scoped to your corporate entity.</p>
                   <div className="bg-gray-900 p-6 rounded-3xl font-mono text-xs text-[#6DCDE0] shadow-inner">
                      <p className="text-white/60"># Sample GET Request</p>
                      <p>GET /v4/marketplace/listings</p>
                      <p>Host: api.b2bnexus.io</p>
                      <p>X-Nexus-Key: [YOUR_API_KEY]</p>
                   </div>
                </section>
                
                <section>
                   <h4 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3"><Cloud size={20} className="text-[#057D97]" /> Webhook Events</h4>
                   <p className="text-sm text-gray-500 leading-relaxed mb-4 font-medium">Configure webhooks in your developer portal to receive real-time notifications for deal events.</p>
                   <div className="grid grid-cols-2 gap-4">
                      {['deal.milestone_paid', 'contract.signed', 'risk_score.alert', 'company.verified', 'escrow.funded', 'milestone.approved'].map(event => (
                        <div key={event} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-mono text-[10px] text-gray-600 flex items-center justify-between">
                          {event} <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                      ))}
                   </div>
                </section>

                <div className="p-10 bg-[#0690AE] rounded-[2.5rem] text-white relative overflow-hidden shadow-xl">
                   <div className="absolute top-0 right-0 p-12 opacity-10"><Zap size={140} /></div>
                   <div className="relative z-10">
                      <h4 className="text-xl font-black mb-2 flex items-center gap-2"><Sparkles size={20} /> AI Query Integration</h4>
                      <p className="text-sm font-medium text-[#CDEEF5] mb-6 leading-relaxed">Directly query our Gemini-powered compliance layer via `/v4/intelligence/scan` to perform custom risk assessments on incoming deal nodes.</p>
                      <div className="flex gap-4">
                        <button onClick={() => handleOpenDeveloperLink('https://developer.mozilla.org/', 'Sandbox')} className="px-8 py-3 bg-white text-[#057D97] font-black rounded-xl text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">
                          Go to Sandbox <ExternalLink size={14} />
                        </button>
                        <button onClick={() => handleOpenDeveloperLink('https://docs.github.com/', 'SDK docs')} className="px-8 py-3 bg-[#0690AE] text-white font-black rounded-xl text-xs uppercase tracking-widest border border-[#38B7D0]">View SDKs</button>
                      </div>
                    </div>
                 </div>
             </div>
             <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">(c) 2024 Nexus Platform Development Group</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
