import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  Globe,
  Lock,
  Play,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { MOCK_TESTIMONIALS, MOCK_PARTNERS, MOCK_FAQS, MOCK_CASE_STUDIES } from '../constants';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenInvestorPortal?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenInvestorPortal }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-cyan-200/70">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-lg font-black text-white shadow-lg shadow-cyan-200">N</div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-700">B2B Nexus</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Enterprise Commerce Grid</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#capabilities" className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 hover:text-cyan-700">Capabilities</a>
            <a href="#workflow" className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 hover:text-cyan-700">Workflow</a>
            <a href="#trust" className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 hover:text-cyan-700">Trust</a>
            <button
              onClick={onGetStarted}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-cyan-700"
            >
              Partner Portal
            </button>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-cyan-50/70 px-6 py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />
          <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-700">
              <Sparkles size={14} /> AI-Coordinated B2B Infrastructure
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-slate-900 md:text-7xl">
              Build verified enterprise supply networks.
            </h1>
            <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-slate-600 md:text-lg">
              Discover audited partners, structure multi-party deals, and settle milestones on a governance-first marketplace built for institutional procurement teams.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-8 py-4 text-xs font-black uppercase tracking-[0.16em] text-white shadow-xl shadow-cyan-200 transition hover:-translate-y-0.5 hover:bg-cyan-700"
              >
                Start Onboarding <ArrowRight size={16} />
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-700 transition hover:bg-slate-100">
                <Play size={16} /> Product Tour
              </button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {[
                { label: 'Verified Entities', value: '12,500+' },
                { label: 'Deal Throughput', value: '$4.8B' },
                { label: 'On-Time Settlement', value: '98.4%' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                  <p className="mt-1 text-lg font-black text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-200/60 md:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Deal Intelligence</p>
            <h3 className="mt-2 text-2xl font-black text-slate-900">Multi-Node Buildout Program</h3>

            <div className="mt-8 space-y-4">
              {[
                { label: 'Counterparty Risk', value: 'Low', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                { label: 'Settlement Stage', value: 'Milestone 2/3', color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
                { label: 'Escrow Coverage', value: '100% Funded', color: 'text-amber-700 bg-amber-50 border-amber-200' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-bold text-slate-600">{item.label}</p>
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-slate-900 p-5 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Risk Signal</p>
              <p className="mt-2 text-sm font-medium text-slate-200">Current structure is resilient; only logistics lead-time variance needs additional buffer clauses.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-6 py-14">
        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Trusted By Procurement Leaders</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {MOCK_PARTNERS.map((p, i) => (
              <span key={i} className="text-xl font-black tracking-tight text-slate-300 transition hover:text-cyan-700 md:text-2xl">{p}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="capabilities" className="bg-slate-50 px-6 py-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">Core Capabilities</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-slate-500 md:text-base">Built for large-value enterprise sourcing, governance, and settlement execution.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Sparkles, title: 'AI Match Engine', desc: 'Contextual partner discovery with capability and reputation scoring.' },
              { icon: ShieldCheck, title: 'Compliance Vault', desc: 'Audit trails, legal docs, and due diligence artifacts in one workspace.' },
              { icon: BarChart3, title: 'Risk Analytics', desc: 'Deal health signals with factor-level analysis and recommendations.' },
              { icon: Lock, title: 'Escrow Controls', desc: 'Milestone-triggered release logic for multi-party settlement.' },
              { icon: Users, title: 'Partner Graph', desc: 'Cross-functional participant governance and permission boundaries.' },
              { icon: Globe, title: 'Global Operations', desc: 'Support for distributed manufacturing and cross-border collaboration.' },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-slate-900 px-6 py-24 text-white">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">Execution Workflow</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-slate-300 md:text-base">From partner discovery to payout, each step is measurable and auditable.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { num: '01', icon: TrendingUp, title: 'Source', desc: 'Filter verified suppliers by capability, risk, and historical delivery data.' },
              { num: '02', icon: Zap, title: 'Structure', desc: 'Define milestones, legal frameworks, and split logic for all participants.' },
              { num: '03', icon: CheckCircle2, title: 'Settle', desc: 'Release escrow against approved milestones with immutable audit history.' },
            ].map((item) => (
              <div key={item.num} className="rounded-3xl border border-slate-700 bg-slate-800 p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">Step {item.num}</p>
                <div className="mt-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-700 text-cyan-300">
                  <item.icon size={22} />
                </div>
                <h3 className="mt-5 text-2xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="bg-white px-6 py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-700">Case Snapshot</p>
            <h3 className="mt-3 text-3xl font-black text-slate-900">{MOCK_CASE_STUDIES[0]?.title}</h3>
            <p className="mt-4 text-sm font-medium text-slate-600">{MOCK_CASE_STUDIES[0]?.outcome}</p>
            <div className="mt-8 rounded-2xl bg-cyan-600 p-5 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100">Outcome</p>
              <p className="mt-1 text-2xl font-black">{MOCK_CASE_STUDIES[0]?.result}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Operator Voices</p>
            <div className="mt-5 space-y-5">
              {MOCK_TESTIMONIALS.map((t) => (
                <div key={t.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <p className="text-sm font-medium italic leading-relaxed text-slate-700">"{t.quote}"</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-800">{t.author}</p>
                      <p className="text-xs font-bold text-slate-500">{t.role}</p>
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                      {t.metrics}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-6 py-24">
        <div className="mx-auto w-full max-w-4xl">
          <h2 className="text-center text-4xl font-black tracking-tight text-slate-900 md:text-5xl">Frequently Asked</h2>
          <div className="mt-10 space-y-4">
            {MOCK_FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={faq.q} className="rounded-2xl border border-slate-200 bg-white">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-sm font-black text-slate-900 md:text-base">{faq.q}</span>
                    <ChevronDown size={18} className={`text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && <p className="px-6 pb-6 text-sm font-medium leading-relaxed text-slate-600">{faq.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 rounded-[2rem] bg-slate-900 px-8 py-12 text-white md:flex-row md:px-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">Ready To Deploy</p>
            <h3 className="mt-2 text-3xl font-black tracking-tight">Launch your enterprise command center.</h3>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onGetStarted}
              className="rounded-xl bg-cyan-600 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-cyan-700"
            >
              Open Partner Portal
            </button>
            <button
              onClick={onOpenInvestorPortal}
              className="rounded-xl border border-slate-600 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Investor Briefing
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-6 py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">2026 B2B Nexus. Verified enterprise infrastructure.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <ShieldCheck size={18} />
            <Building2 size={18} />
            <TrendingUp size={18} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
