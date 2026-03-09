import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useDemoTrack } from './useDemoSession';
import { ArrowRight, Calendar, Zap } from 'lucide-react';

export default function DemoConversionBlock({ title = "Ready to Get Started?", nextPage, nextLabel }) {
  const { track } = useDemoTrack();

  return (
    <div className="bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-800 rounded-2xl p-8 text-center mt-12 mb-24">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-400 mb-8 max-w-lg mx-auto">
        Join hundreds of small businesses already using NTA to grow on autopilot.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to={createPageUrl('StartTrial')} onClick={() => track('cta_click', { value: 'start_trial' })}>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors">
            <Zap className="w-4 h-4" /> Start Free Trial
          </button>
        </Link>
        <Link to={createPageUrl('Book-Call')} onClick={() => track('cta_click', { value: 'book_call' })}>
          <button className="flex items-center gap-2 px-6 py-3 border border-slate-600 hover:border-slate-400 text-slate-300 rounded-xl font-semibold text-sm transition-colors">
            <Calendar className="w-4 h-4" /> Book a Strategy Call
          </button>
        </Link>
        {nextPage && (
          <Link to={createPageUrl(nextPage)} onClick={() => track('cta_click', { value: 'continue_demo' })}>
            <button className="flex items-center gap-2 px-6 py-3 border border-slate-700 hover:border-slate-500 text-slate-400 rounded-xl text-sm transition-colors">
              {nextLabel || 'Continue Demo'} <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}