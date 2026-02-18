
import React, { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon, Building2, Sparkles, Search, MoreHorizontal, FileText, LayoutDashboard, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Message, Company, Deal, User } from '../types';

interface MessagingProps {
  currentUser: User;
  companies: Company[];
  deals: Deal[];
  messages: Message[];
  onSendMessage: (content: string, receiverId: string, dealId?: string) => void;
}

const Messaging: React.FC<MessagingProps> = ({ currentUser, companies, deals, messages, onSendMessage }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [showAttachContract, setShowAttachContract] = useState(false);
  const [showSharedView, setShowSharedView] = useState(false);

  // Auto-select first contact if none selected
  useEffect(() => {
    if (!selectedCompanyId && companies.length > 0) {
      const otherCompany = companies.find(c => c.id !== currentUser.companyId);
      if (otherCompany) setSelectedCompanyId(otherCompany.id);
    }
  }, [companies, currentUser, selectedCompanyId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedCompanyId]);

  const activeMessages = messages.filter(m => 
    (m.senderId === currentUser.companyId && m.receiverId === selectedCompanyId) ||
    (m.senderId === selectedCompanyId && m.receiverId === currentUser.companyId)
  );

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);
  const activeDeal = deals.find(d => 
    selectedCompanyId ? (
      (d.buyerId === currentUser.companyId && d.sellerIds.includes(selectedCompanyId)) ||
      (d.sellerIds.includes(currentUser.companyId) && d.buyerId === selectedCompanyId)
    ) : false
  );

  const handleSend = () => {
    if (!inputText.trim() || !selectedCompanyId) return;
    onSendMessage(inputText, selectedCompanyId, activeDeal?.id);
    setInputText('');
  };

  const handleAttachContractAction = (contractType: string) => {
    onSendMessage(`Attached Documents: ${contractType} draft for review.`, selectedCompanyId!, activeDeal?.id);
    setShowAttachContract(false);
  };

  const handleShareViewAction = () => {
    onSendMessage(`Shared Deal Analytics for PROJECT-${activeDeal?.id.toUpperCase()}.`, selectedCompanyId!, activeDeal?.id);
    setShowSharedView(false);
  };

  return (
    <div className="flex h-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Contact List */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
        <div className="p-6">
          <h2 className="text-xl font-black text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          {companies.filter(c => c.id !== currentUser.companyId).map(company => (
            <button
              key={company.id}
              onClick={() => setSelectedCompanyId(company.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
                selectedCompanyId === company.id 
                ? 'bg-white shadow-md border border-gray-100' 
                : 'hover:bg-white/50'
              }`}
            >
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-700 font-black shrink-0">
                {company.name.charAt(0)}
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{company.name}</p>
                <p className="text-xs text-gray-400 truncate uppercase tracking-widest">{company.domain}</p>
              </div>
              {company.verified && <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {selectedCompany ? (
          <>
            {/* Header */}
            <div className="h-20 px-8 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-black">
                  {selectedCompany.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-none">{selectedCompany.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Now</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {activeDeal && (
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Deal</span>
                    <span className="text-xs font-bold text-cyan-700">DEAL-{activeDeal.id.toUpperCase()}</span>
                  </div>
                )}
                <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg"><MoreHorizontal size={20} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30"
            >
              <div className="flex justify-center mb-8">
                <span className="px-3 py-1 bg-white rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">Today</span>
              </div>
              {activeMessages.map(msg => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.senderId === currentUser.companyId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] group`}>
                    <div className={`p-4 rounded-2xl shadow-sm ${
                      msg.senderId === currentUser.companyId 
                      ? 'bg-cyan-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-900 border border-gray-100 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    <p className={`text-[10px] font-bold text-gray-400 mt-2 ${msg.senderId === currentUser.companyId ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-cyan-500 transition-all">
                <button className="p-3 text-gray-400 hover:text-cyan-700 transition-colors">
                  <Sparkles size={20} />
                </button>
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Draft your proposal..."
                  className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400 py-3"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="p-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all disabled:opacity-50 shadow-lg shadow-cyan-100"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-4 flex gap-4">
                <button onClick={() => setShowAttachContract(true)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-cyan-700 transition-colors">📎 Attach Contract</button>
                <button onClick={() => setShowSharedView(true)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-cyan-700 transition-colors">📊 Shared View</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mb-6">
              <MessageSquare size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-900">Select a Conversation</h3>
            <p className="text-gray-500 mt-2 max-w-sm">Connect with your verified partners to discuss milestones and project delivery.</p>
          </div>
        )}
      </div>

      {/* Attach Contract Modal */}
      {showAttachContract && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in duration-300">
            <button onClick={() => setShowAttachContract(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            <h3 className="text-xl font-black text-gray-900 mb-2">Select Contract to Attach</h3>
            <p className="text-xs text-gray-500 mb-8 font-medium">Link a document from PROJECT-{activeDeal?.id.toUpperCase()}</p>
            <div className="space-y-3">
              {['NDA_Draft_v1', 'Statement_of_Work_Final', 'Liability_Waiver'].map(doc => (
                <button 
                  key={doc}
                  onClick={() => handleAttachContractAction(doc)}
                  className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50 transition-all group"
                >
                  <FileText className="text-cyan-700" size={20} />
                  <span className="text-sm font-bold text-gray-700">{doc.replace(/_/g, ' ')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shared View Modal */}
      {showSharedView && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in duration-300">
            <button onClick={() => setShowSharedView(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            <h3 className="text-xl font-black text-gray-900 mb-2">Share Deal Analytics</h3>
            <p className="text-xs text-gray-500 mb-8 font-medium">This will post a summary of current deal health and revenue splits to the conversation.</p>
            
            <div className="p-6 bg-cyan-900 rounded-3xl text-white mb-8">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Deal Velocity Snapshot</span>
                  <ShieldCheck size={18} className="text-cyan-400" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <p className="text-2xl font-black">92%</p>
                   <p className="text-[10px] font-bold uppercase text-cyan-300">Success Rate</p>
                 </div>
                 <div>
                   <p className="text-2xl font-black">12.4d</p>
                   <p className="text-[10px] font-bold uppercase text-cyan-300">Settlement Avg</p>
                 </div>
               </div>
            </div>

            <button onClick={handleShareViewAction} className="w-full py-4 bg-cyan-600 text-white font-black rounded-2xl shadow-xl shadow-cyan-100 flex items-center justify-center gap-2">
              Share Intelligence View <LayoutDashboard size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MessageSquare = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export default Messaging;
