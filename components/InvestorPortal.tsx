
import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  Target, 
  Globe, 
  ChevronRight, 
  ArrowLeft,
  DollarSign,
  PieChart as PieIcon,
  Zap,
  ShieldCheck,
  Rocket
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

interface InvestorPortalProps {
  onBack: () => void;
}

const tractionData = [
  { month: 'Oct 23', gmv: 1.2, users: 4500 },
  { month: 'Nov 23', gmv: 1.8, users: 5200 },
  { month: 'Dec 23', gmv: 2.1, users: 6100 },
  { month: 'Jan 24', gmv: 3.4, users: 8400 },
  { month: 'Feb 24', gmv: 4.2, users: 10500 },
  { month: 'Mar 24', gmv: 4.8, users: 12500 },
];

const marketData = [
  { name: 'TAM (Global B2B)', value: 14000, color: '#6366f1' },
  { name: 'SAM (Digital B2B)', value: 4500, color: '#818cf8' },
  { name: 'SOM (Vetted Cluster)', value: 850, color: '#a5b4fc' },
];

const InvestorPortal: React.FC<InvestorPortalProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 animate-in fade-in duration-700">
      {/* Header */}
      <header className="bg-gray-900 py-16 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Target size={400} /></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <button onClick={onBack} className="flex items-center gap-2 text-cyan-400 font-black text-xs uppercase tracking-widest mb-10 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Public Web
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-600/30 text-cyan-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-cyan-500/20">
                <ShieldCheck size={14} /> Confidential Intelligence
              </div>
              <h1 className="text-5xl font-black tracking-tight">Venture Intelligence Portal</h1>
              <p className="mt-4 text-gray-400 text-lg font-medium max-w-xl">Deep-dive into B2B Nexus traction, unit economics, and our roadmap to dominating the global B2B settlement layer.</p>
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-white text-gray-900 font-black rounded-2xl hover:bg-cyan-50 transition-all text-xs uppercase tracking-widest">Download Pitch Deck</button>
              <button className="px-8 py-4 bg-cyan-600 text-white font-black rounded-2xl hover:bg-cyan-700 transition-all text-xs uppercase tracking-widest">Connect with Founders</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: 'Cumulative GMV', value: '$4.8B', icon: DollarSign, trend: '+42% MoM' },
            { label: 'Active Users', value: '12,500', icon: Users, trend: '+24% MoM' },
            { label: 'LTV/CAC Ratio', value: '11.4x', icon: TrendingUp, trend: 'Top Percentile' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 group hover:border-cyan-300 transition-all">
               <div className="w-12 h-12 bg-cyan-50 text-cyan-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <stat.icon size={24} />
               </div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <h3 className="text-3xl font-black text-gray-900 mb-2">{stat.value}</h3>
               <span className="text-xs font-black text-green-600 uppercase tracking-widest">{stat.trend}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <TrendingUp size={24} className="text-cyan-700" /> Monthly Growth Trajectory
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                <AreaChart data={tractionData}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} />
                  <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="gmv" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorGmv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-6 text-xs text-gray-400 font-medium italic text-center">"GMV growth is outpacing user acquisition, signaling deepening wallet share per corporate entity."</p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <PieIcon size={24} className="text-cyan-700" /> Market Opportunity (TAM)
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="h-60 w-60">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
                  <PieChart>
                    <Pie
                      data={marketData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {marketData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 flex-1">
                 {marketData.map((item, i) => (
                   <div key={i} className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                       <span className="text-xs font-bold text-gray-700">{item.name}</span>
                     </div>
                     <span className="text-xs font-black text-gray-900">${item.value}B</span>
                   </div>
                 ))}
              </div>
            </div>
            <div className="mt-12 p-6 bg-cyan-50 rounded-2xl border border-cyan-100">
               <h4 className="text-xs font-black text-cyan-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Zap size={14} /> Competitive Edge
               </h4>
               <p className="text-xs font-medium text-cyan-900 leading-relaxed italic">
                 "Our unique 12-point audit system creates a 'trust moat' that competitors like LinkedIn or traditional marketplaces cannot replicate without massive overhead."
               </p>
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div className="bg-gray-900 p-12 rounded-[3.5rem] text-white">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <Rocket className="text-cyan-400" /> Growth Roadmap 2024-25
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Series A Ready</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { q: 'Q3 2024', title: 'Global Settlement Layer', desc: 'Native multi-currency USDC/USDT escrow integration.' },
              { q: 'Q4 2024', title: 'Cluster Expansion', desc: 'Opening manufacturing nodes in SE Asia and LatAm.' },
              { q: 'Q1 2025', title: 'AI Sourcing Pro', desc: 'Autonomous agent-based supplier discovery and RFP drafting.' },
              { q: 'Q2 2025', title: 'Nexus Enterprise API', desc: 'Seamless integration with SAP, Oracle, and Microsoft ERP.' },
            ].map((step, i) => (
              <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-cyan-400 transition-colors">
                 <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-3">{step.q}</p>
                 <h4 className="font-bold mb-2">{step.title}</h4>
                 <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvestorPortal;
