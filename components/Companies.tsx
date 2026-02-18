
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Star, 
  Search,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Award,
  Info,
  CheckCircle,
  ShieldAlert,
  ArrowRight,
  Filter,
  X,
  Lock,
  Zap,
  ChevronLeft,
  Save,
  Bookmark,
  Presentation,
  Mail,
  Calendar,
  Sparkles,
  // Added missing Loader2 import
  Loader2
} from 'lucide-react';
import { Company, RiskLevel, SavedFilter } from '../types';
import { CATEGORIES } from '../constants';

interface CompaniesProps {
  companies: Company[];
}

const Companies: React.FC<CompaniesProps> = ({ companies }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [minReputation, setMinReputation] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showTrustTooltip, setShowTrustTooltip] = useState<string | null>(null);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showFilterSaveModal, setShowFilterSaveModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');

  // New Request Presentation state
  const [showRequestPresentation, setShowRequestPresentation] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nexus_registry_filters');
    if (saved) setSavedFilters(JSON.parse(saved));
  }, []);

  const saveFilter = () => {
    if (!newFilterName) return;
    const newFilter: SavedFilter = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFilterName,
      type: 'REGISTRY',
      filters: { selectedDomain, searchQuery, minReputation, verifiedOnly }
    };
    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem('nexus_registry_filters', JSON.stringify(updated));
    setShowFilterSaveModal(false);
    setNewFilterName('');
  };

  const applySavedFilter = (sf: SavedFilter) => {
    setSelectedDomain(sf.filters.selectedDomain || 'All');
    setSearchQuery(sf.filters.searchQuery);
    setMinReputation(sf.filters.minReputation);
    setVerifiedOnly(sf.filters.verifiedOnly);
  };

  const handleRequestPresentation = () => {
    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      setRequestSent(true);
      setTimeout(() => {
        setRequestSent(false);
        setShowRequestPresentation(false);
      }, 2000);
    }, 1500);
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           c.gst.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDomain = selectedDomain === 'All' || c.domain === selectedDomain;
      const matchesVerify = !verifiedOnly || c.verified;
      const matchesReputation = c.reputation >= minReputation;
      
      return matchesSearch && matchesVerify && matchesDomain && matchesReputation;
    });
  }, [companies, searchQuery, verifiedOnly, selectedDomain, minReputation]);

  const verifiedBenefits = [
    { 
      title: 'Enhanced Trust', 
      desc: 'Annual audits of balance sheets and P&L statements confirm operational stability.',
      icon: BarChart3,
      benefit: 'Verified companies have a 94% lower default risk.'
    },
    { 
      title: 'Financial Protection', 
      desc: 'Mandatory escrow use ensures funds are only released upon successful service delivery.',
      icon: Lock,
      benefit: '100% money-back guarantee on milestone discrepancies.'
    },
    { 
      title: 'Legal Governance', 
      desc: 'Full verification of GST, business licenses, and international trade compliance.',
      icon: ShieldCheck,
      benefit: 'Contracts are backed by Nexus legal infrastructure.'
    },
    { 
      title: 'Priority Support', 
      desc: 'Direct access to Nexus legal mediation for any contract discrepancies.',
      icon: ShieldAlert,
      benefit: '24-hour response time for dispute resolution.'
    }
  ];

  if (selectedCompany) {
    return (
      <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-right-4 duration-500">
        <button 
          onClick={() => setSelectedCompany(null)}
          className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-cyan-700 transition-colors"
        >
          <ChevronLeft size={20} /> Back to Directory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm">
              <div className="h-48 bg-gradient-to-r from-cyan-600 to-purple-700 p-12 flex items-end relative">
                <div className="absolute top-8 right-8">
                   {selectedCompany.verified && (
                     <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-2xl flex items-center gap-2">
                       <ShieldCheck size={20} />
                       <span className="text-xs font-black uppercase tracking-widest">Audited & Verified</span>
                     </div>
                   )}
                </div>
                <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center text-cyan-700 font-black text-5xl border-4 border-white translate-y-16">
                  {selectedCompany.name.charAt(0)}
                </div>
              </div>
              <div className="p-12 pt-24">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">{selectedCompany.name}</h1>
                    <p className="text-lg text-gray-500 font-medium flex items-center gap-2">
                      <Building2 size={20} /> {selectedCompany.domain} Provider
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-amber-500 font-black text-2xl mb-1">
                      <Star size={24} fill="currentColor" /> {selectedCompany.reputation}
                    </div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Global Ranking: #124</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-12">
                  <div className="p-6 bg-gray-50 rounded-3xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Revenue Flow</p>
                    <p className="text-xl font-black text-gray-900">${(selectedCompany.revenue / 1000000).toFixed(1)}M+</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-3xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">On-Time Rate</p>
                    <p className="text-xl font-black text-green-600">{selectedCompany.onTimeDelivery}%</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-3xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Completion</p>
                    <p className="text-xl font-black text-cyan-700">{selectedCompany.dealCompletionRate}%</p>
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-6">Core Capabilities</h3>
                <div className="flex flex-wrap gap-3 mb-12">
                  {selectedCompany.capabilities.map(cap => (
                    <div key={cap} className="px-5 py-3 bg-cyan-50 text-cyan-700 rounded-2xl text-xs font-black uppercase tracking-widest border border-cyan-100">
                      {cap}
                    </div>
                  ))}
                </div>

                <div className="p-10 bg-cyan-600 rounded-[2.5rem] text-white shadow-xl shadow-cyan-100">
                  <h3 className="text-2xl font-black mb-4">Partner with {selectedCompany.name}</h3>
                  <p className="text-cyan-100 mb-8 font-medium">Verified partners utilize the Nexus Escrow & Contract system to ensure 100% project success and financial safety.</p>
                  <button 
                    onClick={() => setShowRequestPresentation(true)}
                    className="w-full py-5 bg-white text-cyan-700 font-black rounded-2xl hover:bg-cyan-50 transition-all shadow-xl shadow-cyan-900/20 flex items-center justify-center gap-2"
                  >
                    <Presentation size={18} /> Request Capability Presentation
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-cyan-50 text-cyan-700 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Nexus Verified</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Trust Standards</p>
                </div>
              </div>

              <div className="space-y-6">
                {verifiedBenefits.map((benefit, i) => (
                  <div key={i} className="group">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <CheckCircle2 size={16} className="text-cyan-700" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{benefit.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mb-2">{benefit.desc}</p>
                        <div className="inline-block px-2 py-1 bg-green-50 text-green-700 text-[9px] font-black uppercase tracking-wider rounded-md">
                          {benefit.benefit}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Request Presentation Modal */}
        {showRequestPresentation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in duration-300">
              <button onClick={() => setShowRequestPresentation(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Request Briefing</h3>
              <p className="text-sm text-gray-500 mb-8 font-medium">Request a capability presentation from {selectedCompany.name}.</p>
              
              <div className="space-y-6">
                 <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Primary Interest</label>
                   <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold">
                     <option>Technical Architecture Review</option>
                     <option>Commercial Terms & Pricing</option>
                     <option>Operational Scalability Audit</option>
                   </select>
                 </div>
                 
                 {requestSent ? (
                   <div className="py-6 bg-green-50 text-green-700 rounded-3xl text-center border border-green-100 animate-in fade-in">
                      <CheckCircle2 className="mx-auto mb-2" />
                      <p className="text-xs font-black uppercase tracking-widest">Formal Request Logged</p>
                   </div>
                 ) : (
                   <button 
                    onClick={handleRequestPresentation}
                    disabled={isRequesting}
                    className="w-full py-5 bg-cyan-600 text-white font-black rounded-2xl shadow-xl shadow-cyan-100 hover:bg-cyan-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                   >
                     {isRequesting ? <Loader2 className="animate-spin" /> : <><Presentation size={18} /> Dispatch Request</>}
                   </button>
                 )}
                 
                 <div className="flex items-center gap-3 justify-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                   <Mail size={12} /> <Calendar size={12} /> <ShieldCheck size={12} />
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div id="companies-view-header" className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Enterprise Network</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Directory of verified corporate partners and audited entities.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Advanced Filters Sidebar */}
        <div className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Filter size={14} /> Registry Filters
              </h3>
              <button 
                onClick={() => setShowFilterSaveModal(true)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-cyan-700 transition-colors"
                title="Save this filter set"
              >
                <Save size={16} />
              </button>
            </div>

            {savedFilters.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Saved Views</p>
                <div className="flex flex-wrap gap-2">
                  {savedFilters.map(sf => (
                    <button 
                      key={sf.id} 
                      onClick={() => applySavedFilter(sf)}
                      className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-[10px] font-black border border-cyan-100 hover:bg-cyan-100"
                    >
                      {sf.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Industry Domain</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.slice(0, 8).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedDomain(cat)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                        selectedDomain === cat 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Minimum Reputation</label>
                  <span className="text-xs font-bold text-cyan-700">{minReputation}+</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="5" step="0.5" 
                  value={minReputation}
                  onChange={(e) => setMinReputation(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none accent-cyan-600"
                />
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <label className="text-[10px] font-black text-gray-400 uppercase">Verified Only</label>
                <button 
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`w-10 h-6 rounded-full p-1 transition-all ${verifiedOnly ? 'bg-cyan-600' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${verifiedOnly ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Search and Grid */}
        <div className="flex-1 min-w-0 space-y-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input 
              type="text" 
              placeholder="Search by company name, domain, or GST..." 
              className="w-full pl-16 pr-4 py-5 bg-white border border-gray-200 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
            {filteredCompanies.map(company => (
              <div key={company.id} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all group flex flex-col relative">
                {company.verified && (
                  <div 
                    className="absolute top-5 right-5 z-10 cursor-help"
                    onMouseEnter={() => setShowTrustTooltip(company.id)}
                    onMouseLeave={() => setShowTrustTooltip(null)}
                  >
                    <div className="bg-cyan-600 text-white px-3 py-1.5 rounded-2xl shadow-xl border border-white/20 flex items-center gap-1.5 backdrop-blur-md">
                      <ShieldCheck size={18} fill="currentColor" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                      <Info size={12} className="opacity-50" />
                    </div>
                  </div>
                )}

                <div className="h-32 bg-gradient-to-br from-cyan-600 via-cyan-700 to-purple-800 relative">
                  <div className="absolute -bottom-10 left-10 w-24 h-24 bg-white rounded-[2rem] shadow-2xl border-4 border-white flex items-center justify-center text-cyan-700 font-black text-4xl overflow-hidden">
                    {company.name.charAt(0)}
                  </div>
                </div>

                <div className="p-10 pt-16 flex-1 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-cyan-700 transition-colors flex items-center gap-2 mb-1">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-black uppercase tracking-[0.2em]">
                        <Building2 size={14} /> {company.domain}
                      </div>
                    </div>
                    <div className="flex items-center text-amber-500 gap-1.5 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-black">{company.reputation}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <div className="flex-1 p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Compliance</p>
                      <span className="text-xs font-black text-cyan-700">{company.complianceScore}% Score</span>
                    </div>
                    <div className="flex-1 p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Delivery</p>
                      <span className="text-xs font-black text-green-600">{company.onTimeDelivery}% OTD</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {company.capabilities.slice(0, 2).map(c => (
                        <span key={c} className="text-[9px] bg-gray-100 px-2 py-1 rounded-md text-gray-500 font-bold uppercase">{c}</span>
                      ))}
                    </div>
                    <button 
                      onClick={() => setSelectedCompany(company)}
                      className="flex items-center gap-2 text-cyan-700 font-black text-sm hover:translate-x-2 transition-all group/btn"
                    >
                      Profile <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-[3rem] flex items-center justify-center text-gray-300 mx-auto mb-8">
                <Building2 size={48} />
              </div>
              <h3 className="text-2xl font-black text-gray-900">No entities matched filters</h3>
              <p className="text-gray-500 mt-3 max-w-md mx-auto font-medium">Reset your filters or adjust criteria to discover more partners.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDomain('All');
                  setMinReputation(0);
                  setVerifiedOnly(false);
                }}
                className="mt-10 px-10 py-4 bg-cyan-600 text-white font-black rounded-2xl shadow-xl"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Save Filter Modal */}
      {showFilterSaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 animate-in zoom-in duration-300">
            <h3 className="text-lg font-black text-gray-900 mb-4">Save Registry View</h3>
            <p className="text-xs text-gray-500 mb-6">Create a dynamic view for these criteria.</p>
            <input 
              type="text" 
              placeholder="e.g., Trusted Manufacturers"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              value={newFilterName}
              onChange={(e) => setNewFilterName(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowFilterSaveModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-500 font-bold rounded-xl text-sm">Cancel</button>
              <button onClick={saveFilter} className="flex-1 py-3 bg-cyan-600 text-white font-bold rounded-xl text-sm shadow-lg">Save View</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
