import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useDemoTrack } from '@/components/demo-machine/useDemoSession';
import { ArrowRight, Zap, TrendingUp, Users } from 'lucide-react';

const INDUSTRIES = [
  { value: 'hvac', label: '🔧 HVAC / Heating & Cooling' },
  { value: 'restaurant', label: '🍽️ Restaurant / Food Service' },
  { value: 'plumbing', label: '🚿 Plumbing' },
  { value: 'contractor', label: '🏗️ General Contractor' },
  { value: 'retail', label: '🛍️ Retail / E-commerce' },
  { value: 'medical', label: '🏥 Medical / Dental' },
  { value: 'general', label: '💼 Other Small Business' },
];

export default function DemoStart() {
  const { track } = useDemoTrack();
  const navigate = useNavigate();
  const [industry, setIndustry] = useState('');
  const [goal, setGoal] = useState('');

  const handleStart = async () => {
    if (industry) localStorage.setItem('nta_demo_industry', industry);
    if (goal) localStorage.setItem('nta_demo_goal', goal);
    await track('page_view', { page_path: 'DemoStart', metadata: { industry, goal } });
    navigate(createPageUrl('DemoProblem'));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/50 border border-blue-700 rounded-full text-blue-300 text-xs font-semibold mb-6">
          <Zap className="w-3 h-3" /> NTA Demo — 7 Steps to See the Full Platform
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
          See How NTA Grows<br />
          <span className="text-blue-400">Small Businesses on Autopilot</span>
        </h1>
        <p className="text-slate-400 text-lg mb-10">
          This guided demo takes about 8 minutes. Personalize it below to see examples from your industry.
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left mb-6">
          <div className="mb-5">
            <label className="text-sm font-semibold text-slate-300 mb-3 block">What type of business do you run?</label>
            <div className="grid grid-cols-2 gap-2">
              {INDUSTRIES.map(ind => (
                <button
                  key={ind.value}
                  onClick={() => setIndustry(ind.value)}
                  className={`text-left px-3 py-2.5 rounded-xl text-sm border transition-colors ${industry === ind.value ? 'border-blue-500 bg-blue-900/30 text-white' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
                >
                  {ind.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-3 block">What are you most trying to improve?</label>
            <div className="grid grid-cols-1 gap-2">
              {['Getting more leads online', 'Growing website traffic', 'Managing social media', 'Getting more reviews', 'Replacing my agency'].map(g => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`text-left px-3 py-2 rounded-xl text-sm border transition-colors ${goal === g ? 'border-blue-500 bg-blue-900/30 text-white' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors"
        >
          Start Demo <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-slate-500 text-xs mt-3">No signup required · 8 minutes · Skip anytime</p>

        <div className="flex items-center justify-center gap-8 mt-10 text-slate-500 text-sm">
          <div className="flex items-center gap-1"><TrendingUp className="w-4 h-4 text-blue-400" /> 500+ businesses</div>
          <div className="flex items-center gap-1"><Users className="w-4 h-4 text-green-400" /> Free trial available</div>
          <div className="flex items-center gap-1"><Zap className="w-4 h-4 text-yellow-400" /> AI-powered</div>
        </div>
      </div>
    </div>
  );
}