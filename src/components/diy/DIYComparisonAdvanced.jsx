import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const COMPARISON_DATA = [
  {
    feature: 'Monthly cost',
    diy: '$99',
    freelancer: '$1,500-3,000',
    agency: '$3,000-10,000',
    nothing: '$0',
  },
  {
    feature: 'Setup time',
    diy: '1 hour',
    freelancer: '2-4 weeks',
    agency: '4-8 weeks',
    nothing: 'None',
  },
  {
    feature: 'Content creation',
    diy: true,
    freelancer: true,
    agency: true,
    nothing: false,
  },
  {
    feature: 'Video production',
    diy: true,
    freelancer: true,
    agency: true,
    nothing: false,
  },
  {
    feature: 'Social media mgmt',
    diy: true,
    freelancer: true,
    agency: true,
    nothing: false,
  },
  {
    feature: 'Lead tracking',
    diy: true,
    freelancer: false,
    agency: true,
    nothing: false,
  },
  {
    feature: 'Full control of strategy',
    diy: true,
    freelancer: false,
    agency: false,
    nothing: true,
  },
  {
    feature: 'No contracts / cancel anytime',
    diy: true,
    freelancer: false,
    agency: false,
    nothing: true,
  },
  {
    feature: 'Hands-on guidance',
    diy: false,
    freelancer: false,
    agency: true,
    nothing: false,
  },
  {
    feature: 'Dedicated account manager',
    diy: false,
    freelancer: false,
    agency: true,
    nothing: false,
  },
];

const renderCell = (value) => {
  if (typeof value === 'boolean') {
    return value ? (
      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
    ) : (
      <Circle className="w-5 h-5 text-slate-600 mx-auto" />
    );
  }
  return <span className="text-white font-semibold">{value}</span>;
};

export default function DIYComparisonAdvanced() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How DIY Compares</h2>
          <p className="text-xl text-slate-400">Real breakdown of options available to you</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-6 text-white font-semibold">Feature</th>
                <th className="text-center py-4 px-6">
                  <div className="text-white font-bold">DIY</div>
                  <div className="text-violet-400 text-sm font-semibold">$99/month</div>
                </th>
                <th className="text-center py-4 px-6">
                  <div className="text-white font-bold">Freelancer</div>
                  <div className="text-slate-400 text-sm">$1,500-3K/mo</div>
                </th>
                <th className="text-center py-4 px-6">
                  <div className="text-white font-bold">Agency</div>
                  <div className="text-slate-400 text-sm">$3K-10K/mo</div>
                </th>
                <th className="text-center py-4 px-6">
                  <div className="text-white font-bold">Do Nothing</div>
                  <div className="text-slate-400 text-sm">$0</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-800 hover:bg-slate-900/50">
                  <td className="py-4 px-6 text-white font-medium">{row.feature}</td>
                  <td className="py-4 px-6 text-center">{renderCell(row.diy)}</td>
                  <td className="py-4 px-6 text-center">{renderCell(row.freelancer)}</td>
                  <td className="py-4 px-6 text-center">{renderCell(row.agency)}</td>
                  <td className="py-4 px-6 text-center">{renderCell(row.nothing)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-violet-600/10 border border-violet-600/30 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-4">Why DIY is the Smart Start</h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Get results immediately without waiting weeks</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Maintain full control of your data and strategy</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Test marketing before committing to expensive services</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Easy to upgrade to guided or full-service later</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-4">The Cost of Waiting</h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex gap-2">
                <Circle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>Every month without marketing = lost customers</span>
              </li>
              <li className="flex gap-2">
                <Circle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>Competitors are already using AI to capture your market</span>
              </li>
              <li className="flex gap-2">
                <Circle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>Your website loses SEO ranking while you wait</span>
              </li>
              <li className="flex gap-2">
                <Circle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>Potential customers never hear about you</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}