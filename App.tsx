
import React, { useState, useEffect } from 'react';
import { User, Company, Product, Deal, LedgerEntry, Role, Message, DealStatus } from './types';
import { MOCK_COMPANIES, MOCK_PRODUCTS, MOCK_DEALS, MOCK_LEDGER, MOCK_MESSAGES } from './constants';
import { companiesService, productsService, dealsService, messagesService, ledgerService } from './services';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import Companies from './components/Companies';
import * as LandingPageModule from './components/LandingPage';
const LandingPage: React.FC<any> = (LandingPageModule as any).default || (LandingPageModule as any);
import DealWorkspace from './components/DealWorkspace';
import FinancialLedger from './components/FinancialLedger';
import AdminPanel from './components/AdminPanel';
import Messaging from './components/Messaging';
import Contracts from './components/Contracts';
import Settings from './components/Settings';
import InvestorPortal from './components/InvestorPortal';
import OnboardingTour from './components/OnboardingTour';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [ledger, setLedger] = useState<LedgerEntry[]>(MOCK_LEDGER);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [showAuth, setShowAuth] = useState(false);
  const [showInvestorPortal, setShowInvestorPortal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user from localStorage
        const savedUser = localStorage.getItem('nexus_user');
        if (savedUser) {
          const u = JSON.parse(savedUser);
          setUser(u);
          if (!u.hasSeenOnboarding) {
            setShowOnboarding(true);
          }
        }

        // Attempt to load data from backend
        try {
          const [companiesData, productsData, dealsData, ledgerData, messagesData] = await Promise.all([
            companiesService.getAllCompanies(),
            productsService.getAllProducts(),
            dealsService.getAllDeals(),
            ledgerService.getAllEntries(),
            messagesService.getAllMessages(),
          ]);

          setCompanies(companiesData);
          setProducts(productsData);
          setDeals(dealsData);
          setLedger(ledgerData);
          setMessages(messagesData);
          setApiError(null);
        } catch (error) {
          // Backend not available, use mock data
          console.warn('Backend API not available, using mock data:', error);
          setApiError('Backend API unavailable. Using mock data.');
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('nexus_user', JSON.stringify(u));
    if (!u.hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
    setShowAuth(false);
    setActiveView('dashboard');
    setShowOnboarding(false);
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, hasSeenOnboarding: true };
      setUser(updatedUser);
      localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
    }
    setShowOnboarding(false);
    setActiveView('dashboard');
  };

  const handleToggleVerification = async (id: string) => {
    const company = companies.find(c => c.id === id);
    if (!company) return;

    try {
      // Try to update via backend
      const updated = await companiesService.verifyCompany(id);
      setCompanies(prev => prev.map(c => c.id === id ? updated : c));
    } catch (error) {
      // Fallback: update locally
      console.warn('Failed to verify company via backend, updating locally:', error);
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, verified: !c.verified } : c));
    }
  };

  const handleUpdateCompany = async (updated: Company) => {
    try {
      // Try to update via backend
      const result = await companiesService.updateCompany(updated.id, updated);
      setCompanies(prev => prev.map(c => c.id === updated.id ? result : c));
    } catch (error) {
      // Fallback: update locally
      console.warn('Failed to update company via backend, updating locally:', error);
      setCompanies(prev => prev.map(c => c.id === updated.id ? updated : c));
    }
  };

  const handleUpdateDeal = async (updatedDeal: Deal) => {
    try {
      // Try to update via backend
      const result = await dealsService.updateDeal(updatedDeal.id, updatedDeal);
      setDeals(prev => prev.map(d => d.id === updatedDeal.id ? result : d));
    } catch (error) {
      // Fallback: update locally
      console.warn('Failed to update deal via backend, updating locally:', error);
      setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
    }
  };

  const handleSendMessage = async (content: string, receiverId: string, dealId?: string) => {
    if (!user) return;
    
    try {
      // Try to send via backend
      const newMessage = await messagesService.sendMessage({
        senderId: user.companyId,
        receiverId,
        dealId,
        content,
      });
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      // Fallback: create message locally
      console.warn('Failed to send message via backend, creating locally:', error);
      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        senderId: user.companyId,
        receiverId,
        dealId,
        content,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const handleInitiateDeal = async (productId: string) => {
    if (!user) return;
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingDeal = deals.find(d => d.productId === productId && d.buyerId === user.companyId);
    if (existingDeal) {
      setActiveView('deals');
      return;
    }

    const newDeal: Deal = {
      id: `d${deals.length + 1}`,
      buyerId: user.companyId,
      sellerIds: [product.merchantId],
      productId: product.id,
      status: DealStatus.ENQUIRY,
      amount: product.price * product.moq,
      platformFee: (product.price * product.moq) * 0.05,
      revenueSplits: [
        { companyId: product.merchantId, percentage: 100 }
      ],
      milestones: [
        { id: 'm1', title: 'Initial Project Deposit', amount: (product.price * product.moq) * 0.3, dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], status: 'PENDING' }
      ],
      contracts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: `Enterprise collaboration for ${product.name}.`,
      escrowStatus: 'UNFUNDED',
      riskScore: 28,
      completionProbability: 0.85
    };

    try {
      // Try to create deal via backend
      const created = await dealsService.createDeal(
        {
          buyerId: newDeal.buyerId,
          sellerIds: newDeal.sellerIds,
          productId: newDeal.productId,
          status: newDeal.status,
          amount: newDeal.amount,
          platformFee: newDeal.platformFee,
          revenueSplits: newDeal.revenueSplits,
          milestones: newDeal.milestones,
          contracts: newDeal.contracts,
          notes: newDeal.notes,
          escrowStatus: newDeal.escrowStatus,
          riskScore: newDeal.riskScore,
          completionProbability: newDeal.completionProbability,
          updatedAt: ''
        });
      setDeals([created, ...deals]);
    } catch (error) {
      // Fallback: create deal locally
      console.warn('Failed to create deal via backend, creating locally:', error);
      setDeals([newDeal, ...deals]);
    }

    setActiveView('deals');
  };

  if (showInvestorPortal) {
    return <InvestorPortal onBack={() => setShowInvestorPortal(false)} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Loading marketplace data...</p>
          {apiError && <p className="text-xs text-amber-600 mt-2">{apiError}</p>}
        </div>
      </div>
    );
  }

  if (!user && !showAuth) {
    return <LandingPage 
      onGetStarted={() => setShowAuth(true)} 
      onOpenInvestorPortal={() => setShowInvestorPortal(true)} 
    />;
  }

  if (!user && showAuth) {
    return (
      <div className="relative">
        <button 
          onClick={() => setShowAuth(false)}
          className="absolute top-8 left-8 z-50 px-4 py-2 bg-white text-gray-500 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all border border-gray-100 shadow-sm"
        >
          ← Back
        </button>
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  const currentUserCompany = companies.find(c => c.id === user?.companyId);

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      activeView={activeView} 
      setActiveView={setActiveView}
    >
      {showOnboarding && (
        <OnboardingTour 
          onComplete={completeOnboarding} 
          setActiveView={setActiveView} 
          activeView={activeView}
        />
      )}
      
      {activeView === 'dashboard' && <Dashboard user={user} companies={companies} />}
      {activeView === 'marketplace' && (
        <Marketplace 
          products={products} 
          companies={companies} 
          onInitiateDeal={handleInitiateDeal} 
        />
      )}
      {activeView === 'companies' && <Companies companies={companies} />}
      {activeView === 'deals' && (
        deals.length > 0 ? (
          <DealWorkspace 
            deal={deals[0]} 
            companies={companies} 
            onUpdate={handleUpdateDeal}
          />
        ) : (
          <div id="deal-workspace-view" className="flex flex-col items-center justify-center h-full text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
            <Handshake className="text-gray-200 mb-6" size={64} />
            <h2 className="text-2xl font-black text-gray-900">No Active Deal Cycles</h2>
            <p className="text-gray-500 mt-2">Initialize your first multi-party collaboration via the Marketplace.</p>
            <button 
              onClick={() => setActiveView('marketplace')}
              className="mt-6 px-10 py-4 bg-cyan-600 text-white font-black rounded-2xl hover:bg-cyan-700 transition-all shadow-xl shadow-cyan-100"
            >
              Discover Capabilities
            </button>
          </div>
        )
      )}
      {activeView === 'messages' && user && (
        <Messaging 
          currentUser={user} 
          companies={companies} 
          deals={deals} 
          messages={messages} 
          onSendMessage={handleSendMessage}
        />
      )}
      {activeView === 'contracts' && (
        <Contracts deals={deals} />
      )}
      {activeView === 'analytics' && <FinancialLedger entries={ledger} />}
      {activeView === 'admin' && (
        <AdminPanel 
          companies={companies} 
          deals={deals}
          onToggleVerification={handleToggleVerification} 
          onUpdateCompany={handleUpdateCompany}
        />
      )}
      {activeView === 'settings' && user && (
        <Settings user={user} company={currentUserCompany} />
      )}
    </Layout>
  );
};

const Handshake = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m11 17 2 2 4-4" />
    <path d="m3 10 2.5 2.5L3 15" />
    <path d="M22 17V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z" />
  </svg>
);

export default App;
