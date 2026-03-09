import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DemoProgressBar from '@/components/demo-machine/DemoProgressBar';
import StickyCTA from '@/components/demo-machine/StickyCTA';
import DemoAIPanel from '@/components/demo-machine/DemoAIPanel';
import DemoConversionBlock from '@/components/demo-machine/DemoConversionBlock';
import { useDemoPageView, useDemoTrack } from '@/components/demo-machine/useDemoSession';
import { ArrowRight, Calculator } from 'lucide-react';

export default function DemoRoi() {
  useDemoPageView('DemoRoi');
  const { track } = useDemoTrack();
  const [avgCustomer, setAvgCustomer] = useState(500);
  const [newCustomers, setNewCustomers] = useState(5);
  const [plan, setPlan] = useState(897);
  const [calculated, setCalculated] = useState(false);

  const revenue = avgCustomer * newCustomers;
  const roi = revenue - plan;
  const roiPct = plan > 0 ? Math.round((roi / plan) * 100) : 0;

  const handleCalculate = () => {
    setCalculated(true);
    track('roi_use', { value: JSON.stringify({ avgCustomer, newCustomers, plan, roi }) });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-32">
      <DemoProgressBar currentPage="DemoRoi" />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-900/40 border border-green-700 rounded-full text-green-300 text-xs font-semibold mb-4">
            Step 6 of 7 — ROI Calculator
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            What's NTA Actually<br /><span className="text-green-400">Worth to Your Business?</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Use this calculator to see your projected return on investment in 90 days.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-5 h-5 text-green-400" />
            <h3 className="font-bold text-white">ROI Calculator</h3>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <label className="text-sm text-slate-300 font-semibold block mb-2">
                Average value of a new customer: <span className="text-green-400">${avgCustomer.toLocaleString()}</span>
              </label>
              <input type="range" min="100" max="5000" step="100" value={avgCustomer}
                onChange={e => setAvgCustomer(Number(e.target.value))}
                className="w-full accent-green-500 cursor-pointer" />
              <div className="flex justify-between text-xs text-slate-500 mt-1"><span>$100</span><span>$5,000</span></div>
            </div>

            <div>
              <label className="text-sm text-slate-300 font-semibold block mb-2">
                New customers per month from NTA: <span className="text-green-400">{newCustomers}</span>
              </label>
              <input type="range" min="1" max="30" step="1" value={newCustomers}
                onChange={e => setNewCustomers(Number(e.target.value))}
                className="w-full accent-green-500 cursor-pointer" />
              <div className="flex justify-between text-xs text-slate-500 mt-1"><span>1</span><span>30</span></div>
            </div>

            <div>
              <label className="text-sm text-slate-300 font-semibold block mb-2">NTA plan cost:</label>
              <div className="grid grid-cols-3 gap-2">
                {[['Starter', 497], ['Growth', 897], ['Pro', 1497]].map(([name, price]) => (
                  <button key={name} onClick={() => setPlan(price)}
                    className={`py-2 rounded-lg text-sm font-semibold border transition-colors ${plan === price ? 'border-green-500 bg-green-900/30 text-white' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                    {name}<br /><span className="text-xs font-normal">${price}/mo</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={handleCalculate}
            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors">
            Calculate My ROI
          </button>

          {calculated && (
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center bg-slate-800 rounded-xl p-4">
                <div className="text-2xl font-black text-white">${revenue.toLocaleString()}</div>
                <div className="text-xs text-slate-400 mt-1">Monthly Revenue</div>
              </div>
              <div className="text-center bg-slate-800 rounded-xl p-4">
                <div className={`text-2xl font-black ${roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>${roi.toLocaleString()}</div>
                <div className="text-xs text-slate-400 mt-1">Monthly Profit</div>
              </div>
              <div className="text-center bg-slate-800 rounded-xl p-4">
                <div className={`text-2xl font-black ${roiPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>{roiPct}%</div>
                <div className="text-xs text-slate-400 mt-1">ROI</div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link to={createPageUrl('DemoNext')}>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-colors">
              See Your Next Step <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

        <DemoConversionBlock title="The Math Makes Sense — Let's Get Started" nextPage="DemoNext" nextLabel="Next Steps →" />
      </div>

      <DemoAIPanel context="Prospect is using the ROI calculator to understand their potential return" />
      <StickyCTA currentStep="DemoRoi" />
    </div>
  );
}