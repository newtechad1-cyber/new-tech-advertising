import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useDemoTrack } from './useDemoSession';

export default function StickyCTA({ currentStep }) {
  const { track } = useDemoTrack();
  const STEPS = ['DemoProblem','DemoPlatform','DemoFeatures','DemoExamples','DemoPricing','DemoRoi','DemoNext'];
  const idx = STEPS.indexOf(currentStep);
  const nextStep = STEPS[idx + 1] || 'StartTrial';

  const handleCTA = (type) => track('cta_click', { value: type });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur border-t border-slate-800 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <p className="text-slate-400 text-sm hidden md:block">
          <span className="text-white font-semibold">NTA Demo</span> — AI Marketing Built for Small Businesses
        </p>
        <div className="flex items-center gap-2 ml-auto">
          <Link to={createPageUrl('Book-Call')} onClick={() => handleCTA('book_call')}>
            <button className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 text-sm hover:border-slate-400 transition-colors">
              Book a Call
            </button>
          </Link>
          <Link to={createPageUrl('DemoPricing')} onClick={() => handleCTA('view_pricing')}>
            <button className="px-4 py-2 rounded-lg border border-blue-600 text-blue-400 text-sm hover:bg-blue-600/10 transition-colors">
              See Pricing
            </button>
          </Link>
          <Link to={createPageUrl(nextStep)} onClick={() => handleCTA('continue_demo')}>
            <button className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors">
              {idx >= STEPS.length - 2 ? 'Start Free Trial →' : 'Continue Demo →'}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}