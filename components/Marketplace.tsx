
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  Grid, 
  List, 
  Star, 
  CheckCircle, 
  Zap,
  ArrowRight,
  Sparkles,
  ChevronDown,
  TrendingUp,
  ShieldCheck,
  Info,
  ShieldAlert,
  ToggleLeft,
  ToggleRight,
  X,
  Bookmark,
  Save,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Product, Company, SavedFilter } from '../types';
import { CATEGORIES } from '../constants';
import { aiMatchCompanies, generateMarketTrends } from '../services/geminiService';

interface MarketplaceProps {
  products: Product[];
  companies: Company[];
  onInitiateDeal: (productId: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ products, companies, onInitiateDeal }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [minReputation, setMinReputation] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [trends, setTrends] = useState<string[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showFilterSaveModal, setShowFilterSaveModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('nexus_marketplace_filters');
    if (saved) setSavedFilters(JSON.parse(saved));
  }, []);

  const saveFilter = () => {
    if (!newFilterName) return;
    const newFilter: SavedFilter = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFilterName,
      type: 'MARKETPLACE',
      filters: { selectedCategory, searchQuery, minReputation, verifiedOnly }
    };
    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem('nexus_marketplace_filters', JSON.stringify(updated));
    setShowFilterSaveModal(false);
    setNewFilterName('');
  };

  const applySavedFilter = (sf: SavedFilter) => {
    setSelectedCategory(sf.filters.selectedCategory);
    setSearchQuery(sf.filters.searchQuery);
    setMinReputation(sf.filters.minReputation);
    setVerifiedOnly(sf.filters.verifiedOnly);
  };

  const removeSavedFilter = (id: string) => {
    const updated = savedFilters.filter(f => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem('nexus_marketplace_filters', JSON.stringify(updated));
  };

  const calculateRiskScore = (product: Product, company?: Company) => {
    if (!company) return 100;
    let score = 50; // Base
    if (company.verified) score -= 20;
    score -= (company.reputation - 2.5) * 10;
    score += (100 - company.dealCompletionRate) / 2;
    // Complexity factor: high price = more risk
    if (product.price > 1000) score += 10;
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const result = await generateMarketTrends(selectedCategory === 'All' ? 'Manufacturing' : selectedCategory);
        setTrends(result);
      } catch (e) {
        console.error("AI Trends error:", e);
      }
    };
    fetchTrends();
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const company = companies.find(c => c.id === p.merchantId);
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVerified = !verifiedOnly || (company?.verified === true);
      const matchesReputation = (company?.reputation || 0) >= minReputation;
      
      return matchesCategory && matchesSearch && matchesVerified && matchesReputation;
    });
  }, [products, companies, selectedCategory, searchQuery, verifiedOnly, minReputation]);

  const activeFiltersCount = (selectedCategory !== 'All' ? 1 : 0) + (verifiedOnly ? 1 : 0) + (minReputation > 0 ? 1 : 0);

  return (
    <div className="space-y-4 md:space-y-8 pb-12">
      <div id="marketplace-hero" className="bg-cyan-700 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl transition-all duration-500">
        <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 pointer-events-none">
          <Zap size={160} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">Enterprise Source Engine</h1>
          <p className="mt-2 md:mt-4 text-cyan-100 text-sm md:text-lg leading-relaxed max-w-lg">
            Direct access to the world's most reliable corporate partners. Multi-criteria vetting included.
          </p>
          
          <div className="mt-6 md:mt-8 flex flex-col gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 z-20" size={18} />
              <input 
                type="text"
                placeholder="Search products or descriptions..."
                className="w-full pl-12 pr-4 md:pr-12 py-4 md:py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:ring-2 focus:ring-white outline-none placeholder:text-cyan-200 text-sm md:text-base transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        <div className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Filter size={14} /> Global Filters {activeFiltersCount > 0 && <span className="w-4 h-4 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center text-[10px]">{activeFiltersCount}</span>}
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setMinReputation(0);
                    setVerifiedOnly(false);
                    setSearchQuery('');
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                  title="Reset Filters"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={() => setShowFilterSaveModal(true)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-cyan-700 transition-colors"
                  title="Save Filter View"
                >
                  <Save size={16} />
                </button>
              </div>
            </div>

            {savedFilters.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase">My Quick Views</p>
                <div className="flex flex-wrap gap-2">
                  {savedFilters.map(sf => (
                    <div key={sf.id} className="group relative">
                      <button 
                        onClick={() => applySavedFilter(sf)}
                        className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-lg text-[10px] font-black border border-cyan-100 hover:bg-cyan-100 pr-7"
                      >
                        {sf.name}
                      </button>
                      <button 
                        onClick={() => removeSavedFilter(sf.id)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-cyan-300 hover:text-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.slice(0, 8).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                        selectedCategory === cat 
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-100' 
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
                  <label className="text-[10px] font-black text-gray-400 uppercase">Min Reputation</label>
                  <span className="text-xs font-bold text-cyan-700">{minReputation}+ ★</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="5" step="0.5" 
                  value={minReputation}
                  onChange={(e) => setMinReputation(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none accent-cyan-600 cursor-pointer"
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
          
          <div className="bg-cyan-900 p-6 rounded-3xl text-white shadow-lg">
             <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
               <TrendingUp size={14} className="text-cyan-400" /> AI Insights
             </h4>
             <div className="space-y-4">
               {trends.length > 0 ? trends.map((t, i) => (
                 <div key={i} className="text-xs font-medium text-cyan-100 leading-relaxed italic bg-white/5 p-3 rounded-xl border border-white/10">
                   {t}
                 </div>
               )) : (
                 <div className="text-xs text-cyan-400 animate-pulse">Scanning market signals...</div>
               )}
             </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Vetted Resources</h2>
              <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{filteredProducts.length} compliant matches</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setIsGridView(true)} className={`p-2 rounded-lg ${isGridView ? 'bg-white shadow-sm text-cyan-700' : 'text-gray-500'}`}><Grid size={18} /></button>
                <button onClick={() => setIsGridView(false)} className={`p-2 rounded-lg ${!isGridView ? 'bg-white shadow-sm text-cyan-700' : 'text-gray-500'}`}><List size={18} /></button>
              </div>
            </div>
          </div>

          <div className={`grid gap-4 md:gap-8 ${isGridView ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredProducts.map(product => {
              const company = companies.find(c => c.id === product.merchantId);
              const riskScore = calculateRiskScore(product, company);
              const isHovered = hoveredProduct === product.id;
              
              return (
                <div 
                  key={product.id} 
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className={`bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all group relative flex flex-col`}
                >
                  {company?.verified && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-cyan-600 text-white px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 border border-white/20 backdrop-blur-md">
                        <ShieldCheck size={14} fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                      </div>
                    </div>
                  )}

                  <div className={`relative shrink-0 overflow-hidden ${isGridView ? 'h-44 md:h-52' : 'h-44 sm:h-full sm:w-64'}`}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    
                    {/* Detailed Risk UI */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                       <div className={`px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/30 text-white flex items-center gap-2 shadow-xl ${
                         riskScore < 30 ? 'bg-green-600/60' : riskScore < 60 ? 'bg-amber-600/60' : 'bg-red-600/60'
                       }`}>
                         <AlertTriangle size={14} />
                         <span className="text-[10px] font-black uppercase">Risk Index: {riskScore}</span>
                       </div>
                       
                       {isHovered && (
                         <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                           <div className="flex gap-1">
                             <div className={`w-1 h-3 rounded-full ${company?.verified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                             <div className={`w-1 h-3 rounded-full ${(company?.reputation || 0) > 4 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                             <div className={`w-1 h-3 rounded-full ${product.price < 5000 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-black text-cyan-700 uppercase tracking-widest bg-cyan-50 px-2.5 py-1 rounded-lg">{product.category}</span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-gray-500 truncate max-w-[100px]">{company?.name}</span>
                          <span className="text-[10px] text-amber-500 font-bold flex items-center bg-amber-50 px-2 py-0.5 rounded-lg"><Star size={10} fill="currentColor" className="mr-1" /> {company?.reputation}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-black text-gray-900 line-clamp-1 mb-2 group-hover:text-cyan-700 transition-colors">{product.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-6 italic">"{product.description}"</p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-[0.2em] mb-1">Standard Payout</p>
                        <p className="text-xl font-black text-gray-900 tracking-tight">${product.price.toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => onInitiateDeal(product.id)}
                        className="px-6 py-3 bg-cyan-600 text-white text-xs font-black rounded-2xl hover:bg-gray-900 transition-all shadow-xl shadow-cyan-100 flex items-center gap-2 group/btn"
                      >
                        Initiate <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-32 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm animate-in fade-in duration-500">
               <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mx-auto mb-6">
                 <Search size={40} />
               </div>
               <h3 className="text-2xl font-black text-gray-900">No resources found</h3>
               <p className="text-gray-500 mt-2 max-w-sm mx-auto font-medium">Try broadening your search criteria or resetting filters to find active partners.</p>
               <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setMinReputation(0);
                  setVerifiedOnly(false);
                  setSearchQuery('');
                }}
                className="mt-10 px-10 py-4 bg-cyan-600 text-white font-black rounded-2xl shadow-2xl"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Save Filter Modal */}
      {showFilterSaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 animate-in zoom-in duration-300 shadow-2xl">
            <h3 className="text-xl font-black text-gray-900 mb-2">Save Pipeline View</h3>
            <p className="text-sm text-gray-500 mb-8 font-medium">Create a shortcut for your frequent searches.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">View Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Tech Verified Low Risk"
                  autoFocus
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-500/10 text-sm font-bold transition-all"
                  value={newFilterName}
                  onChange={(e) => setNewFilterName(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowFilterSaveModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-black rounded-2xl text-xs uppercase tracking-widest">Cancel</button>
                <button onClick={saveFilter} className="flex-1 py-4 bg-cyan-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-cyan-100">Save View</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
