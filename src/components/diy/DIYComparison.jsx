import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

const COMPARISON = [
  { feature: 'AI Content Generation', diy: true, agency: true },
  { feature: 'Social Media Management', diy: true, agency: true },
  { feature: 'Video Creation', diy: true, agency: true },
  { feature: 'Lead Tracking & CRM', diy: true, agency: true },
  { feature: 'ROI Dashboard', diy: true, agency: true },
  { feature: 'Cost per month', diy: '$99', agency: '$3,000-$5,000' },
  { feature: 'Setup time', diy: '1 hour', agency: '4-6 weeks' },
  { feature: 'Dedicated account manager', diy: false, agency: true },
  { feature: 'Full control of data', diy: true, agency: false },
  { feature: 'Cancel anytime', diy: true, agency: false },
];

export default function DIYComparison() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">DIY vs. Full Service</h2>
          <p className="text-xl text-slate-400">Compare the options</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-6 text-white font-semibold">Feature</th>
                <th className="text-center py-4 px-6 text-white font-semibold">DIY Growth System</th>
                <th className="text-center py-4 px-6 text-white font-semibold">Full Service Agency</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-800 hover:bg-slate-900/50">
                  <td className="py-4 px-6 text-white">{row.feature}</td>
                  <td className="py-4 px-6 text-center">
                    {row.diy === true ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    ) : row.diy === false ? (
                      <X className="w-5 h-5 text-slate-500 mx-auto" />
                    ) : (
                      <span className="text-violet-400 font-semibold">{row.diy}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {row.agency === true ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-slate-400 font-semibold">{row.agency}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-violet-600/10 border border-violet-600/30 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-2">Choose DIY If:</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>✓ You want to start immediately with minimal cost</li>
              <li>✓ You prefer to maintain control of your data</li>
              <li>✓ You want flexibility to scale up or down</li>
              <li>✓ You're testing before committing to full service</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-2">Choose Agency If:</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>✓ You need hands-on strategy and optimization</li>
              <li>✓ You want to delegate all marketing execution</li>
              <li>✓ You have enterprise-level needs</li>
              <li>✓ You need dedicated support and reporting</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}