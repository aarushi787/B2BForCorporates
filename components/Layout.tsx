
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Handshake, 
  MessageSquare, 
  Building2, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Menu,
  X,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-react';
import { User, Role } from '../types';
import { useAuth } from '../src/auth/AuthProvider';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, activeView, setActiveView }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // prefer user from props, fall back to context provider when available
  let authUser: User | null = null;
  let authLogout: (() => void) | undefined;
  try {
    const auth = useAuth();
    authUser = auth.user as User | null;
    authLogout = auth.logout;
  } catch (e) {
    // no provider available
  }

  const displayedUser = user ?? authUser;
  const handleLogout = () => {
    if (onLogout) return onLogout();
    if (authLogout) return authLogout();
  };

  // Auto-manage sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [Role.ADMIN, Role.SELLER, Role.BUYER] },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, roles: [Role.ADMIN, Role.SELLER, Role.BUYER] },
    { id: 'deals', label: 'My Deals', icon: Handshake, roles: [Role.SELLER, Role.BUYER] },
    { id: 'messages', label: 'Messaging', icon: MessageSquare, roles: [Role.SELLER, Role.BUYER] },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, roles: [Role.ADMIN, Role.SELLER] },
    { id: 'contracts', label: 'Contracts', icon: FileText, roles: [Role.SELLER, Role.BUYER] },
    { id: 'admin', label: 'Governance', icon: ShieldCheck, roles: [Role.ADMIN] },
    { id: 'companies', label: 'Companies', icon: Building2, roles: [Role.ADMIN, Role.SELLER, Role.BUYER] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: [Role.ADMIN, Role.SELLER, Role.BUYER] },
  ];

  const filteredNav = navItems.filter(item => displayedUser && item.roles.includes(displayedUser.role));

  const handleNavClick = (id: string) => {
    setActiveView(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-sm md:text-base">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside 
        id="sidebar-nav"
        className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col
        ${isSidebarOpen ? 'w-64' : 'w-0 lg:w-20'}
        ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 lg:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">N</div>
            {(isSidebarOpen || isMobileMenuOpen) && <span className="text-xl font-bold tracking-tight text-gray-900 truncate">B2B Nexus</span>}
          </div>
          <button className="lg:hidden text-gray-400 hover:text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto scrollbar-hide">
          {filteredNav.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                activeView === item.id 
                ? 'bg-cyan-50 text-cyan-700 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${activeView === item.id ? 'text-cyan-700' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {(isSidebarOpen || isMobileMenuOpen) && <span className="font-semibold text-sm truncate">{item.label}</span>}
              {!isSidebarOpen && !isMobileMenuOpen && (
                <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 hidden lg:block">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors group`}
          >
            <LogOut className="w-5 h-5 shrink-0 text-red-500" />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="font-semibold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className={`
        flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300
        ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
      `}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-30">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsMobileMenuOpen(true);
                } else {
                  setIsSidebarOpen(!isSidebarOpen);
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            >
              {isSidebarOpen ? <X size={20} className="hidden lg:block" /> : <Menu size={20} />}
            </button>
            <div className="relative hidden md:block lg:w-64 xl:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
              <span className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Score:</span>
              <span className="text-[10px] md:text-xs font-black text-green-600">742</span>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-8 w-px bg-gray-100 mx-1"></div>
              
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <p className="text-xs md:text-sm font-bold text-gray-900 leading-none truncate max-w-[100px]">{displayedUser?.name}</p>
                  <p className="text-[10px] text-cyan-700 mt-1 uppercase font-black tracking-widest">{displayedUser?.role}</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white font-black text-xs md:text-sm shadow-lg shadow-cyan-100 shrink-0">
                  {displayedUser?.name?.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-50/50">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Layout;
