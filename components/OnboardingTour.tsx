
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ShieldCheck, 
  Handshake, 
  Building2,
  MousePointer2,
  Zap,
  Info,
  LayoutDashboard
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  targetId?: string;
  view?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface OnboardingTourProps {
  onComplete: () => void;
  setActiveView: (view: string) => void;
  activeView: string;
}

const steps: TourStep[] = [
  {
    id: 'intro',
    title: 'Institutional Grade Commerce',
    desc: 'Welcome to B2B Nexus. You are now part of a secure network for high-velocity enterprise trade. Let\'s walk through your infrastructure.',
    icon: <MousePointer2 className="text-cyan-700" size={32} />,
    position: 'center'
  },
  {
    id: 'nav',
    title: 'Control Center',
    desc: 'The sidebar is your global navigation hub. Access the Marketplace, your active Deals, and platform Analytics from here.',
    icon: <LayoutDashboard className="text-cyan-700" size={32} />,
    targetId: 'sidebar-nav',
    position: 'right'
  },
  {
    id: 'marketplace',
    title: 'Strategic Sourcing',
    desc: 'Discover verified products from global partners. Every item includes a real-time Risk Index to protect your procurement chain.',
    icon: <Sparkles className="text-cyan-700" size={32} />,
    targetId: 'marketplace-hero',
    view: 'marketplace',
    position: 'bottom'
  },
  {
    id: 'registry',
    title: 'Entity Intelligence',
    desc: 'Browse the Registry to view audited balance sheets, GST filings, and reputation scores for every node in the network.',
    icon: <Building2 className="text-cyan-700" size={32} />,
    targetId: 'companies-view-header',
    view: 'companies',
    position: 'bottom'
  },
  {
    id: 'deals',
    title: 'Governance Workspace',
    desc: 'Manage milestones and legal agreements. Our AI-powered Deal Workspace ensures every multi-party contract is technically sound.',
    icon: <Handshake className="text-cyan-700" size={32} />,
    targetId: 'deal-workspace-view',
    view: 'deals',
    position: 'top'
  },
  {
    id: 'compliance',
    title: 'Immutable Vault',
    desc: 'Open the Compliance tab to access your audit reports and trust certificates in one place.',
    icon: <ShieldCheck className="text-cyan-700" size={32} />,
    targetId: 'settings-compliance-tab',
    view: 'settings',
    position: 'right'
  }
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete, setActiveView, activeView }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [tooltipStyles, setTooltipStyles] = useState<React.CSSProperties>({
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  });
  const tourRef = useRef<HTMLDivElement>(null);
  const retryTimerRef = useRef<number | null>(null);

  const updateHighlight = (attempt = 0) => {
    const targetId = steps[currentStep].targetId;
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        const rect = el.getBoundingClientRect();
        setCoords({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
        setIsReady(true);
      } else {
        if (attempt < 10) {
          retryTimerRef.current = window.setTimeout(() => updateHighlight(attempt + 1), 120);
          return;
        }
        setCoords(null);
        setIsReady(true); // fallback to center tooltip if target never appears
      }
    } else {
      setCoords(null);
      setIsReady(true);
    }
  };

  useEffect(() => {
    setIsReady(false);
    const step = steps[currentStep];
    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    
    if (step.view && activeView !== step.view) {
      setActiveView(step.view);
      // Wait for navigation and rendering
      const timer = setTimeout(updateHighlight, 300);
      return () => {
        clearTimeout(timer);
        if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current);
      };
    } else {
      updateHighlight();
    }

    const handleResize = () => updateHighlight();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current);
    };
  }, [currentStep, activeView]);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    if (!isReady) return;

    const positionTooltip = () => {
      const tooltip = tourRef.current;
      const step = steps[currentStep];
      if (!tooltip) return;

      if (!coords || step.position === 'center') {
        setTooltipStyles({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
        return;
      }

      const padding = 24;
      const margin = 16;
      const tw = tooltip.offsetWidth;
      const th = tooltip.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const { top, left, width, height } = coords;

      let x = left + width / 2 - tw / 2;
      let y = top + height / 2 - th / 2;

      if (step.position === 'right') {
        x = left + width + padding;
      } else if (step.position === 'left') {
        x = left - tw - padding;
      } else if (step.position === 'bottom') {
        y = top + height + padding;
      } else if (step.position === 'top') {
        y = top - th - padding;
      }

      x = Math.max(margin, Math.min(x, vw - tw - margin));
      y = Math.max(margin, Math.min(y, vh - th - margin));

      setTooltipStyles({ top: y, left: x, transform: 'none' });
    };

    const raf = requestAnimationFrame(positionTooltip);
    window.addEventListener('resize', positionTooltip);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', positionTooltip);
    };
  }, [isReady, currentStep, coords]);

  if (!isReady) return null;

  return (
    <div className="fixed inset-0 z-[1000] pointer-events-none">
      {/* Dimmed Overlay */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] pointer-events-auto"></div>

      {/* Highlight Cutout */}
      {coords && steps[currentStep].position !== 'center' && (
        <div 
          className="absolute z-[1010] border-4 border-cyan-500 rounded-3xl shadow-[0_0_0_9999px_rgba(17,24,39,0.75)] transition-all duration-500 pointer-events-none"
          style={{
            top: coords.top - 8,
            left: coords.left - 8,
            width: coords.width + 16,
            height: coords.height + 16
          }}
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-cyan-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap shadow-xl">
            Focus Node
          </div>
        </div>
      )}

      {/* Tooltip Modal */}
      <div 
        ref={tourRef}
        className="fixed z-[1020] w-[90vw] max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-[2.5rem] shadow-2xl p-10 pointer-events-auto transition-all duration-500 ease-out border border-gray-100"
        style={tooltipStyles}
      >
        <button 
          onClick={onComplete} 
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner animate-bounce">
            {steps[currentStep].icon}
          </div>
          
          <div className="inline-flex items-center gap-2 mb-4">
             <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
             <p className="text-[10px] font-black text-cyan-700 uppercase tracking-[0.2em]">Step {currentStep + 1} of {steps.length}</p>
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">
            {steps[currentStep].title}
          </h3>
          <p className="text-gray-500 font-medium leading-relaxed mb-10 text-sm md:text-base">
            {steps[currentStep].desc}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4">
          <button 
            onClick={prev}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-gray-900'}`}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${currentStep === i ? 'w-8 bg-cyan-600' : 'w-1.5 bg-gray-200'}`}></div>
            ))}
          </div>

          <button 
            onClick={next}
            className="flex items-center gap-2 px-8 py-4 bg-cyan-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-900 transition-all shadow-xl shadow-cyan-200 active:scale-95"
          >
            {currentStep === steps.length - 1 ? 'Go Live' : 'Continue'} <ChevronRight size={16} />
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-1 -right-1 p-8 opacity-5 pointer-events-none">
          <Zap size={100} />
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
