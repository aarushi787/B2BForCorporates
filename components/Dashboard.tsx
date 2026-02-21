
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import SafeResponsiveContainer from './charts/SafeResponsiveContainer';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck,
  Zap,
  MoreVertical,
  Download
} from 'lucide-react';
import { Company } from '../types';

const data = [
  { name: 'Jan', revenue: 4000, deals: 24 },
  { name: 'Feb', revenue: 3000, deals: 18 },
  { name: 'Mar', revenue: 2000, deals: 29 },
  { name: 'Apr', revenue: 2780, deals: 20 },
  { name: 'May', revenue: 1890, deals: 15 },
  { name: 'Jun', revenue: 2390, deals: 25 },
];

const Dashboard: React.FC<{ user: any; companies: Company[] }> = ({ user, companies }) => {
  const company = companies.find(c => c.id === user.companyId);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('ROI Report generated and downloaded to your secure vault.');
    }, 1500);
  };

  return (
    <div className="space-y-4 md:space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Intelligence Dashboard</h1>
          <p className="text-gray-500 mt-1 font-medium italic text-xs md:text-sm">Welcome back. Monitoring {company?.name || 'Nexus Platform'} metrics.</p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
           {company?.verified && (
             <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-[#E6F6FA] text-[#057D97] rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest border border-[#CDEEF5]">
               {/* Fixed: removed md:size prop which is not supported by Lucide icons */}
               <ShieldCheck size={14} /> Verified
             </div>
           )}
           <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 sm:flex-none px-4 py-2 md:px-6 md:py-2.5 bg-[#0690AE] text-white font-black rounded-xl hover:bg-gray-900 transition-all shadow-xl shadow-[#CDEEF5] flex items-center justify-center gap-2 disabled:opacity-50 text-xs md:text-sm"
           >
             {/* Fixed: removed md:size prop which is not supported by Lucide icons */}
             {isExporting ? 'Exporting...' : <><Download size={16} /> Export ROI</>}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Platform Revenue', value: `$${(company?.revenue || 0).toLocaleString()}`, icon: DollarSign, change: '+14.2%', trend: 'up', color: 'cyan' },
          { label: 'Active Milestones', value: '8', icon: Zap, change: '+3', trend: 'up', color: 'emerald' },
          { label: 'Deal Velocity', value: '12.4 Days', icon: TrendingUp, change: '-2.1%', trend: 'up', color: 'amber' },
          { label: 'Trust Score', value: '94.8', icon: ShieldCheck, change: '+0.4', trend: 'up', color: 'blue' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="flex items-start justify-between">
              {/* Fixed: removed md:size prop which is not supported by Lucide icons */}
              <div
                className={`p-3 md:p-4 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform ${
                  stat.color === 'cyan'
                    ? 'bg-[#E6F6FA] text-[#057D97]'
                    : stat.color === 'emerald'
                      ? 'bg-green-50 text-green-600'
                      : stat.color === 'amber'
                        ? 'bg-[#CDEEF5] text-[#057D97]'
                        : 'bg-[#E6F6FA] text-[#0690AE]'
                }`}
              >
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
                {/* Fixed: removed md:size props which are not supported by Lucide icons */}
                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              </div>
            </div>
            <div className="mt-4 md:mt-6">
              <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-1 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-lg md:text-xl font-black text-gray-900">Revenue Split Analysis</h3>
            <select className="w-full sm:w-auto bg-gray-50 border-none rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest px-4 py-2 focus:ring-2 focus:ring-[#0690AE] cursor-pointer">
              <option>Q1 2024</option>
              <option>Q4 2023</option>
              <option>Q3 2023</option>
            </select>
          </div>
          <div className="h-60 md:h-80 w-full overflow-hidden">
            <SafeResponsiveContainer minHeight={240}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0690AE" stopOpacity={0.14}/>
                    <stop offset="95%" stopColor="#0690AE" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0690AE" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </SafeResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-lg md:text-xl font-black text-gray-900 mb-8">Performance Moat</h3>
          <div className="space-y-6 md:space-y-8">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest">On-Time Delivery</span>
                <span className="text-[10px] md:text-xs font-black text-[#057D97]">{company?.onTimeDelivery || 0}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-[#0690AE] transition-all duration-1000 ease-out" style={{width: `${company?.onTimeDelivery || 0}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest">Completion Rate</span>
                <span className="text-[10px] md:text-xs font-black text-green-600">{company?.dealCompletionRate || 0}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-green-500 transition-all duration-1000 ease-out" style={{width: `${company?.dealCompletionRate || 0}%`}}></div>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100">
              <p className="text-[9px] md:text-[10px] text-gray-400 font-bold leading-relaxed italic uppercase tracking-wider">
                Nexus trust metrics are calculated using blockchain-verified milestone approvals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
