import React, { useState } from 'react';
import { Building2, ChevronRight, Shield, UserPlus } from 'lucide-react';
import { MOCK_USERS } from '../constants';
import { User, Role } from '../types';
import { authService } from '../services/authService';
import { apiClient } from '../services/apiClient';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [signIn, setSignIn] = useState({
    email: '',
    password: '',
  });

  const [register, setRegister] = useState({
    fullName: '',
    companyName: '',
    gstNumber: '',
    email: '',
    phone: '',
    password: '',
    industry: '',
    companyDomain: '',
    website: '',
    address: '',
    description: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await authService.login(signIn);
      if (res?.token) apiClient.setToken(res.token);
      if (res?.user) return onLogin(res.user);
      setError('Login failed: unexpected response');
    } catch (err: any) {
      const fallback = MOCK_USERS.find(u => u.email === signIn.email);
      if (fallback) return onLogin(fallback);
      setError(err?.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await authService.register({
        name: register.fullName,
        companyName: register.companyName,
        gstNumber: register.gstNumber,
        email: register.email,
        phone: register.phone,
        password: register.password,
        industry: register.industry || undefined,
        companyDomain: register.companyDomain || undefined,
        website: register.website || undefined,
        address: register.address || undefined,
        description: register.description || undefined,
        role: Role.SELLER,
      });

      if (res?.token) apiClient.setToken(res.token);
      if (res?.user) return onLogin(res.user);
      setError('Registration failed: unexpected response');
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginDemo = async (type: 'admin' | 'merchant') => {
    setError('');
    setIsSubmitting(true);
    const email = type === 'admin' ? 'admin@example.com' : 'merchant@example.com';

    try {
      const res = await authService.login({ email, password: 'password123' });
      if (res?.token) apiClient.setToken(res.token);
      if (res?.user) return onLogin(res.user);
      setError('Demo login failed: unexpected response');
    } catch (err: any) {
      const fallback =
        MOCK_USERS.find(u => u.email === email) ||
        (type === 'merchant' ? MOCK_USERS.find(u => u.role === Role.SELLER) : MOCK_USERS.find(u => u.role === Role.ADMIN));
      if (fallback) return onLogin(fallback);
      setError(err?.message || 'Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-cyan-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-cyan-700 font-black text-xl">N</div>
              <span className="text-2xl font-bold tracking-tight">B2B Nexus</span>
            </div>
            <h1 className="text-4xl font-extrabold leading-tight">Enterprise Merchant Onboarding</h1>
            <p className="mt-6 text-cyan-100 text-lg leading-relaxed">
              Complete business verification details once and unlock trusted, high-value deal opportunities.
            </p>
          </div>

          <div className="mt-12 relative z-10 space-y-6">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <Shield className="text-cyan-200 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">12-Point Governance</h4>
                <p className="text-xs text-cyan-100">Merchant registration captures regulatory and operational data up-front.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <Building2 className="text-cyan-200 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Unified Partner Profile</h4>
                <p className="text-xs text-cyan-100">Company identity, GST, contact data, and business footprint in one profile.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 md:p-12">
          <div className="max-w-xl mx-auto">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-8">
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${mode === 'signin' ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${mode === 'register' ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500'}`}
              >
                Merchant Register
              </button>
            </div>

            {mode === 'signin' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-gray-500 text-sm">Sign in with your registered corporate account.</p>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Corporate Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                    placeholder="name@company.com"
                    value={signIn.email}
                    onChange={(e) => setSignIn({ ...signIn, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                    placeholder="********"
                    value={signIn.password}
                    onChange={(e) => setSignIn({ ...signIn, password: e.target.value })}
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Signing In...' : <>Sign In <ChevronRight size={18} /></>}
                </button>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Demo Accounts</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => loginDemo('merchant')}
                      className="p-3 rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700 text-xs font-black uppercase tracking-widest hover:bg-cyan-100 transition-all"
                    >
                      Demo Merchant
                    </button>
                    <button
                      type="button"
                      onClick={() => loginDemo('admin')}
                      className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                    >
                      Demo Admin
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                <h2 className="text-3xl font-bold text-gray-900">Merchant Registration</h2>
                <p className="text-gray-500 text-sm">Submit complete business details to create your verified merchant identity.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={register.fullName}
                      onChange={(e) => setRegister({ ...register, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Company Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={register.companyName}
                      onChange={(e) => setRegister({ ...register, companyName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">GST Number *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={register.gstNumber}
                      onChange={(e) => setRegister({ ...register, gstNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={register.phone}
                      onChange={(e) => setRegister({ ...register, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Business Email *</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={register.email}
                      onChange={(e) => setRegister({ ...register, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Password *</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={register.password}
                      onChange={(e) => setRegister({ ...register, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={register.industry}
                      onChange={(e) => setRegister({ ...register, industry: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Company Domain</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={register.companyDomain}
                      onChange={(e) => setRegister({ ...register, companyDomain: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={register.website}
                      onChange={(e) => setRegister({ ...register, website: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={register.address}
                      onChange={(e) => setRegister({ ...register, address: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Business Description</label>
                  <textarea
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none min-h-24"
                    value={register.description}
                    onChange={(e) => setRegister({ ...register, description: e.target.value })}
                  />
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : <>Create Merchant Account <UserPlus size={18} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
