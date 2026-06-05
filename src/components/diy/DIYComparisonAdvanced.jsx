import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const COMPARISON_DATA = [
  {
    feature: 'Monthly Cost',
    doNothing: '$0',
    freelancer: '$500–$1,500',
    agency: '$1,500–$4,000',
    diySocial: '$97',
    diySuite: '$197',
  },
  {
    feature: 'Structure',
    doNothing: '❌',
    freelancer: '⚠️',
    agency: '✅',
    diySocial: '✅',
    diySuite: '✅',
  },
  {
    feature: 'Real Growth System',
    doNothing: '❌',
    freelancer: '❌',
    agency: 'Limited Control',
    diySocial: '✅',
    diySuite: '✅',
  },
];

const renderCell = (value) => {
  return <span className="text-white font-semibold text-center">{value}</span>;
};

export default function DIYComparisonAdvanced() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">⚖️ Comparison</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-6 text-white font-semibold">Option</th>
                <th className="text-center py-4 px-6 text-white font-semibold">Doing Nothing</th>
                <th className="text-center py-4 px-6 text-white font-semibold">Freelancer</th>
                <th className="text-center py-4 px-6 text-white font-semibold">Agency</th>
                <th className="text-center py-4 px-6 text-violet-300 font-bold bg-violet-900/20">DIY Social</th>
                <th className="text-center py-4 px-6 text-violet-300 font-bold bg-violet-900/20 border-l border-violet-900/50">DIY Suite</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-800 hover:bg-slate-900/50">
                  <td className="py-4 px-6 text-white font-medium">{row.feature}</td>
                  <td className="py-4 px-6 text-center">{renderCell(row.doNothing)}</td>
                  <td className="py-4 px-6 text-center">{renderCell(row.freelancer)}</td>
                  <td className="py-4 px-6 text-center">{renderCell(row.agency)}</td>
                  <td className="py-4 px-6 text-center bg-violet-900/10">{renderCell(row.diySocial)}</td>
                  <td className="py-4 px-6 text-center bg-violet-900/10 border-l border-violet-900/20">{renderCell(row.diySuite)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-white font-semibold">
            👉 You stay in control while gaining the power of an AI-driven marketing system.
          </p>
        </div>
      </div>
    </section>
  );
}