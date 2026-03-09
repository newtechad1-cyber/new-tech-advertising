import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { TrendingUp, ArrowRight, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ROIResultsCard({ onTrack }) {
  const [inputs, setInputs] = useState({
    currentSpend: '2500',
    leadsPerMonth: '10',
    valuePerLead: '500',
  });
  const [calculated, setCalculated] = useState(false);

  const set = (k, v) => setInputs(p => ({ ...p, [k]: v }));

  const currentSpend = parseFloat(inputs.currentSpend) || 0;
  const leads = parseFloat(inputs.leadsPerMonth) || 0;
  const leadValue = parseFloat(inputs.valuePerLead) || 0;

  // NTA typical plan cost (Growth as default)
  const ntaCost = 597;
  const monthlySavings = Math.max(0, currentSpend - ntaCost);
  const annualSavings = monthlySavings * 12;
  const monthlyLeadValue = leads * leadValue;
  const roi = ntaCost > 0 ? Math.round(((monthlyLeadValue - ntaCost) / ntaCost) * 100) : 0;

  const handleCalculate = () => {
    setCalculated(true);
    onTrack && onTrack('deal_room_roi');
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-violet-900/40 to-slate-900 border-b border-slate-700 px-5 py-4 flex items-center gap-3">
        <Calculator className="w-5 h-5 text-violet-400" />
        <div>
          <h3 className="text-white font-bold">ROI Calculator</h3>
          <p className="text-slate-400 text-xs">See how NTA stacks up against your current spend</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-slate-400 text-xs mb-1 block">Current monthly marketing spend ($)</Label>
            <Input value={inputs.currentSpend} onChange={e => set('currentSpend', e.target.value)}
              className="bg-slate-800 border-slate-700 text-white" type="number" />
          </div>
          <div>
            <Label className="text-slate-400 text-xs mb-1 block">Estimated leads/month</Label>
            <Input value={inputs.leadsPerMonth} onChange={e => set('leadsPerMonth', e.target.value)}
              className="bg-slate-800 border-slate-700 text-white" type="number" />
          </div>
          <div>
            <Label className="text-slate-400 text-xs mb-1 block">Avg value per new customer ($)</Label>
            <Input value={inputs.valuePerLead} onChange={e => set('valuePerLead', e.target.value)}
              className="bg-slate-800 border-slate-700 text-white" type="number" />
          </div>
        </div>

        <Button className="w-full bg-violet-600 hover:bg-violet-500 font-semibold" onClick={handleCalculate}>
          <Calculator className="w-4 h-4 mr-2" /> Calculate My ROI
        </Button>

        {calculated && (
          <div className="mt-2 space-y-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-800 rounded-xl p-3">
                <p className="text-2xl font-extrabold text-green-400">${monthlySavings.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-0.5">Monthly Savings</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-3">
                <p className="text-2xl font-extrabold text-violet-400">${annualSavings.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-0.5">Annual Savings</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-3">
                <p className="text-2xl font-extrabold text-yellow-400">{roi > 0 ? roi + '%' : 'N/A'}</p>
                <p className="text-xs text-slate-500 mt-0.5">Potential ROI</p>
              </div>
            </div>
            <div className="bg-green-900/20 border border-green-800 rounded-xl p-4 text-sm text-green-300">
              <TrendingUp className="w-4 h-4 inline mr-2" />
              At the Growth plan rate of <strong>${ntaCost}/mo</strong>, you'd save approximately{' '}
              <strong>${annualSavings.toLocaleString()}</strong> annually compared to your current spend,
              while getting a complete AI-powered marketing system.
            </div>
            <Link to={createPageUrl('StartTrial')}>
              <Button className="w-full bg-violet-600 hover:bg-violet-500 font-semibold">
                Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}