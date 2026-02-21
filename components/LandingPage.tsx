import React from 'react';
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  CircleHelp,
  Factory,
  Globe2,
  Handshake,
  Megaphone,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenInvestorPortal?: () => void;
}

const domains = [
  {
    name: 'Manufacturing',
    detail: 'Factories, fabrication, and industrial operations.',
    Icon: Factory,
    tint: 'from-[#0690AE] to-[#057D97]',
  },
  {
    name: 'UI/UX',
    detail: 'Product design, wireframes, and experience research.',
    Icon: Palette,
    tint: 'from-[#0690AE] to-slate-700',
  },
  {
    name: 'Development',
    detail: 'Web, mobile, APIs, and systems delivery teams.',
    Icon: Wrench,
    tint: 'from-[#0690AE] to-[#057D97]',
  },
  {
    name: 'Marketing',
    detail: 'Campaigns, content, and go-to-market planning.',
    Icon: Megaphone,
    tint: 'from-slate-700 to-[#057D97]',
  },
  {
    name: 'Data Security',
    detail: 'Security controls, audit trails, and risk defense.',
    Icon: ShieldCheck,
    tint: 'from-slate-800 to-[#057D97]',
  },
  {
    name: 'AI Insight',
    detail: 'AI recommendations for partner and deal matching.',
    Icon: Bot,
    tint: 'from-[#0690AE] to-[#057D97]',
  },
];

const engineeringCompanies = [
  {
    name: 'Northline Fabrication',
    desc: 'Precision fabrication and heavy-industry assembly partner.',
  },
  {
    name: 'Vertex Development Labs',
    desc: 'Product engineering and cloud platform execution.',
  },
  {
    name: 'Atlas Industrial Systems',
    desc: 'Automation integration for complex B2B programs.',
  },
];

const serviceCompanies = [
  {
    name: 'Signal Growth Group',
    desc: 'Performance marketing and outbound demand generation.',
  },
  {
    name: 'Trustline Legal Ops',
    desc: 'Commercial contracts, compliance support, and due diligence.',
  },
  {
    name: 'Bluecore Finance Advisory',
    desc: 'B2B pricing models, payout logic, and cash-flow strategy.',
  },
];

const workflowSteps = [
  {
    title: 'Register',
    desc: 'Create your verified company profile and list your core capabilities.',
  },
  {
    title: 'Send Proposal & Collaborate',
    desc: 'Find matching partners, share requirements, and align project scope.',
  },
  {
    title: 'Complete Deals & Work Team',
    desc: 'Track milestones, coordinate execution, and close outcomes with confidence.',
  },
];

const softButtonClass =
  'inline-flex items-center justify-center rounded-xl border border-slate-300/90 bg-white/95 px-3.5 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-600 transition duration-300 hover:-translate-y-0.5 hover:border-[#0690AE] hover:bg-[#F4FBFD] hover:text-[#057D97] hover:shadow-[0_12px_24px_-18px_rgba(6,144,174,0.7)] active:scale-[0.99]';
const sectionClass =
  'relative isolate overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/92 px-6 py-10 shadow-[0_22px_55px_-34px_rgba(2,32,58,0.42)] ring-1 ring-white before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#6DCDE0]/80 before:to-transparent md:px-10 md:py-12';
const cardClass =
  'group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_-24px_rgba(15,23,42,0.5)] transition duration-300 hover:-translate-y-1 hover:border-[#9EDDEA] hover:bg-[#fcfeff] hover:shadow-[0_20px_40px_-28px_rgba(6,144,174,0.42)]';
const heroSectionClass =
  'relative overflow-hidden rounded-[34px] border border-slate-200/80 bg-[linear-gradient(160deg,#ffffff_0%,#fbfeff_55%,#f3fbfd_100%)] px-6 py-8 shadow-[0_22px_60px_-34px_rgba(2,32,58,0.5)] ring-1 ring-white md:px-10 md:py-10';
const sectionTitleClass = "text-2xl font-black text-slate-900 [font-family:'Sora',sans-serif] md:text-3xl";

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenInvestorPortal }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(145deg,#eaf6fb_0%,#f8fdff_44%,#f1f7fb_100%)] text-slate-900 selection:bg-[#9EDDEA]/70 [font-family:'Manrope',sans-serif]">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#6DCDE0]/25 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#0690AE]/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(6,144,174,0.08),transparent_32%),radial-gradient(circle_at_0%_70%,rgba(109,205,224,0.12),transparent_28%)]" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl shadow-[0_10px_40px_-26px_rgba(6,144,174,0.6)]">
        <div className="mx-auto w-full max-w-[1700px] px-4 py-4 md:px-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/b2b logo.png"
                alt="B2B Nexus logo"
                className="h-11 w-11 rounded-xl border border-slate-200 object-cover shadow-lg shadow-slate-300/70"
              />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 [font-family:'Sora',sans-serif]">
                  B2B Nexus
                </p>
              </div>
            </div>

            <div className="hidden w-full max-w-xl items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-sm ring-1 ring-slate-100 md:flex">
              <input
                type="text"
                placeholder="Search companies, capabilities, and services"
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                onClick={onGetStarted}
                className="rounded-xl bg-slate-900 px-3 py-2.5 text-white transition duration-200 hover:scale-[1.03] hover:bg-slate-800"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>

            <nav className="hidden items-center gap-5 md:flex">
              <a href="#home" className="text-sm font-semibold text-slate-700 transition duration-200 hover:text-[#057D97]">
                Home
              </a>
              <a href="#domains" className="text-sm font-semibold text-slate-700 transition duration-200 hover:text-[#057D97]">
                Buyers &amp; Suppliers
              </a>
              <a href="#help" className="text-sm font-semibold text-slate-700 transition duration-200 hover:text-[#057D97]">
                Help
              </a>
              <button
                onClick={onGetStarted}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-[#0690AE] hover:text-[#057D97]"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="rounded-xl bg-gradient-to-r from-[#0690AE] to-[#057D97] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#9EDDEA] transition duration-200 hover:-translate-y-0.5 hover:from-[#057D97] hover:to-[#046A80] hover:shadow-[#6DCDE0]/70"
              >
                Register
              </button>
            </nav>
          </div>

          <div className="mt-3 grid gap-2 md:hidden">
            <div className="flex items-center gap-2">
              <button
                onClick={onGetStarted}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition duration-200 hover:border-[#0690AE] hover:text-[#057D97]"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="w-full rounded-xl bg-gradient-to-r from-[#0690AE] to-[#057D97] px-4 py-2 text-sm font-bold text-white shadow-md shadow-[#9EDDEA] transition duration-200 hover:from-[#057D97] hover:to-[#046A80]"
              >
                Register
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-sm ring-1 ring-slate-100">
              <input
                type="text"
                placeholder="Search companies, capabilities, and services"
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                onClick={onGetStarted}
                className="rounded-xl bg-slate-900 px-3 py-2.5 text-white transition duration-200 hover:bg-slate-800"
                aria-label="Search"
              >
                <Search size={17} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main id="home" className="relative mx-auto w-full px-4 pb-10 pt-28 md:px-8 md:pb-12 md:pt-32">
        <div className="mx-auto min-h-[calc(100dvh-140px)] w-full max-w-[1700px] space-y-6 rounded-[42px] border border-slate-200/80 bg-white/70 p-3 shadow-[0_34px_90px_-46px_rgba(15,23,42,0.55)] ring-1 ring-[#d7eff5]/60 backdrop-blur-sm md:p-5 lg:p-6">
          <section className={heroSectionClass}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(6,144,174,0.16),transparent_40%),radial-gradient(circle_at_10%_90%,rgba(148,163,184,0.12),transparent_35%)]" />
            <div className="relative grid items-stretch gap-6 xl:grid-cols-[1.52fr_1fr]">
              <div className="relative overflow-hidden rounded-[30px] border border-white/30 bg-gradient-to-br from-[#0690AE] via-[#057D97] to-slate-800 p-7 text-white shadow-xl shadow-[#034E5E]/20 md:p-10">
                <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full border border-white/20" />
                <div className="absolute -left-20 -bottom-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CDEEF5] [font-family:'Sora',sans-serif]">What We Do</p>
                <h1 className="mt-3 text-[clamp(2.05rem,4.6vw,4.4rem)] font-black leading-[0.98] [font-family:'Sora',sans-serif]">
                  Close complex business deals faster, together.
                </h1>
                <p className="mt-4 max-w-2xl text-sm font-medium text-[#CDEEF5] md:text-base">
                  Discover verified partners, combine capabilities, and deliver multi-company B2B projects with confidence
                  from first outreach to final milestone.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full border border-[#6DCDE0]/60 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] transition hover:bg-white/20">
                    Verified Network
                  </span>
                  <span className="rounded-full border border-[#6DCDE0]/60 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] transition hover:bg-white/20">
                    Live Deal Progress
                  </span>
                  <button
                    onClick={onGetStarted}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#057D97] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_25px_-16px_rgba(255,255,255,0.95)]"
                  >
                    Start Grow Today <ArrowRight size={14} />
                  </button>
                </div>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    ['350+', 'Active teams'],
                    ['92%', 'On-time delivery'],
                    ['24/7', 'Collaboration flow'],
                  ].map((item) => (
                    <div key={item[1]} className="rounded-2xl border border-white/25 bg-white/10 p-3 backdrop-blur-sm">
                      <p className="text-lg font-black leading-none">{item[0]}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#CDEEF5]">{item[1]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6">
                <article className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-[#f7fcfe] p-6 shadow-[0_8px_26px_-18px_rgba(15,23,42,0.45)] md:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#057D97] [font-family:'Sora',sans-serif]">Workflow</p>
                    <span className="rounded-full bg-[#E6F6FA] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#057D97]">
                      3 Steps
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {workflowSteps.map((step, index) => (
                      <div key={step.title} className="rounded-2xl border border-slate-200 bg-white/90 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Step 0{index + 1}</p>
                        <h3 className="mt-1 text-sm font-black text-slate-900 [font-family:'Sora',sans-serif]">{step.title}</h3>
                        <p className="mt-1 text-xs font-medium leading-relaxed text-slate-600">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_26px_-18px_rgba(15,23,42,0.45)]">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80"
                    alt="Corporate B2B collaboration meeting"
                    className="h-[230px] w-full object-cover md:h-[260px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#057D97] backdrop-blur-sm">
                    B2B For Corporates
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="domains" className={`${sectionClass} scroll-mt-32`}>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className={sectionTitleClass}>Company Domains</h2>
              <button onClick={onGetStarted} className={softButtonClass}>
                View All
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {domains.map((domain) => (
                <article key={domain.name} className={cardClass}>
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,144,174,0.08),transparent_45%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${domain.tint} text-white shadow-lg shadow-slate-200 transition duration-300 group-hover:scale-105`}
                  >
                    <domain.Icon size={20} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 [font-family:'Sora',sans-serif]">{domain.name}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{domain.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={sectionClass}>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className={sectionTitleClass}>How It Works</h2>
              <div className="flex w-fit items-center gap-2 rounded-full border border-[#9EDDEA] bg-[#E6F6FA] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#057D97] [font-family:'Sora',sans-serif]">
                <Sparkles size={14} /> Register • Collaborate
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {workflowSteps.map((item, idx) => (
                <article key={item.title} className={cardClass}>
                  <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 [font-family:'Sora',sans-serif]">
                    Step 0{idx + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-black text-slate-900 [font-family:'Sora',sans-serif]">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium text-slate-600">{item.desc}</p>
                </article>
              ))}
            </div>

            <button
              onClick={onGetStarted}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#0690AE] to-[#057D97] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-[#9EDDEA] transition duration-300 hover:-translate-y-0.5 hover:from-[#057D97] hover:to-[#046A80]"
            >
              Start Grow Today <ArrowRight size={16} />
            </button>
          </section>

          <section className={sectionClass}>
            <h2 className="text-3xl font-black text-slate-900 [font-family:'Sora',sans-serif] md:text-5xl">Tell Us What You Need?</h2>
            <p className="mt-3 text-sm font-medium text-slate-600 md:text-base">
              Describe your requirement and we will help match the right capability network.
            </p>
            <div className="mt-5 flex w-full flex-wrap items-center gap-3 rounded-2xl border border-slate-300 bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_25px_-20px_rgba(2,32,58,0.8)] ring-1 ring-slate-100 md:max-w-3xl md:flex-nowrap">
              <Bot className="text-slate-600" size={20} />
              <input
                type="text"
                placeholder="AI: Need UI/UX + frontend + QA for a B2B dashboard"
                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none"
              />
              <button
                onClick={onGetStarted}
                className="w-full rounded-xl bg-gradient-to-r from-[#0690AE] to-[#057D97] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition duration-300 hover:-translate-y-0.5 hover:from-[#057D97] hover:to-[#046A80] hover:shadow-[#6DCDE0]/70 md:w-auto"
              >
                Search
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['UI/UX + Dev', 'Manufacturing + Logistics', 'Legal + Finance'].map((q) => (
                <button
                  onClick={onGetStarted}
                  key={q}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition duration-200 hover:-translate-y-0.5 hover:border-[#0690AE] hover:text-[#057D97]"
                >
                  {q}
                </button>
              ))}
            </div>
          </section>

          <section className={sectionClass}>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className={sectionTitleClass}>
                Company Specific: Development
              </h2>
              <button onClick={onGetStarted} className={softButtonClass}>
                Show More
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {engineeringCompanies.map((company) => (
                <article key={company.name} className={cardClass}>
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-[#E6F6FA] to-[#CDEEF5] text-[#057D97]">
                    <Building2 size={28} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 [font-family:'Sora',sans-serif]">{company.name}</h3>
                  <p className="mt-2 text-sm font-medium text-slate-600">{company.desc}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={sectionClass}>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className={sectionTitleClass}>
                Company Specific: Services
              </h2>
              <button onClick={onGetStarted} className={softButtonClass}>
                Show More
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {serviceCompanies.map((company) => (
                <article key={company.name} className={cardClass}>
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-[#E6F6FA] to-[#CDEEF5] text-[#057D97]">
                    <Building2 size={28} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 [font-family:'Sora',sans-serif]">{company.name}</h3>
                  <p className="mt-2 text-sm font-medium text-slate-600">{company.desc}</p>
                </article>
              ))}
            </div>

            <button
              onClick={onGetStarted}
              className="mt-6 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white transition duration-300 hover:-translate-y-0.5 hover:from-slate-800 hover:to-slate-600"
            >
              More
            </button>
          </section>

          <section className={sectionClass}>
            <div className="overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl md:p-8">
              <h2 className="text-3xl font-black [font-family:'Sora',sans-serif] md:text-4xl">Why Us?</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {[
                  'Verified partner network with capability proof.',
                  'AI matching that reduces partner discovery time.',
                  'Deal workflows designed for multi-company execution.',
                  'Risk-aware collaboration with structured delivery.',
                ].map((point) => (
                  <div
                    key={point}
                    className="rounded-2xl border border-slate-700/80 bg-slate-800/80 p-4 text-sm font-medium text-slate-200 transition duration-300 hover:bg-slate-700/80"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="help" className={`${sectionClass} scroll-mt-32`}>
            <h2 className={sectionTitleClass}>We Support</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {[
                'Enterprise Sourcing',
                'Cross-Team Collaboration',
                'Compliance Reviews',
                'Deal Structuring',
                'Milestone Tracking',
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className={sectionClass}>
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className={sectionTitleClass}>About Us</h2>
                <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                  B2B Nexus is built for teams that need to form reliable partnerships quickly. We combine partner
                  discovery, collaboration flows, and transparent execution so companies can finish complex work without
                  losing momentum.
                </p>
                <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                  From sourcing to final delivery, every stage is structured to improve trust, reduce delay, and help
                  teams grow through better collaboration.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_-22px_rgba(2,32,58,0.35)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-[#6DCDE0] before:via-[#0690AE] before:to-[#057D97]">
                <h3 className="text-lg font-black text-slate-900 [font-family:'Sora',sans-serif]">Company Values</h3>
                <div className="mt-4 space-y-3">
                  {[
                    'Trust over noise',
                    'Collaboration over silos',
                    'Execution over promises',
                    'Measurable outcomes',
                  ].map((value) => (
                    <div key={value} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <CheckCircle2 size={16} className="text-emerald-600" /> {value}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2">
                  {['YT', 'IN', 'FB', 'X'].map((item) => (
                    <button
                      onClick={onGetStarted}
                      key={item}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-xs font-black text-slate-600 transition duration-200 hover:-translate-y-0.5 hover:border-[#0690AE] hover:text-[#057D97]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.8)_0%,rgba(241,250,253,0.9)_100%)] px-4 py-6 backdrop-blur md:px-6">
        <div className="mx-auto flex w-full max-w-[1700px] flex-col items-start justify-between gap-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500 [font-family:'Sora',sans-serif] md:flex-row md:items-center">
          <p>2026 B2B Nexus</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              <Handshake size={14} /> Collaboration First
            </div>
            <div className="flex items-center gap-1">
              <Globe2 size={14} /> Global Ready
            </div>
            <button
              onClick={onOpenInvestorPortal ?? onGetStarted}
              className="flex items-center gap-1 transition duration-200 hover:text-[#057D97]"
            >
              <CircleHelp size={14} /> Investor Portal
            </button>
            <button onClick={onGetStarted} className="flex items-center gap-1 transition duration-200 hover:text-[#057D97]">
              <Users size={14} /> Partner Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
