import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const COMPARISON_DATA = [
  {
    feature: 'Monthly Cost',
    doNothing: '$0',
    freelancer: '$500–$1,500',
    agency: '$1,500–$4,000',
    nta: '$99',
  },
  {
    feature: 'Structure',
    doNothing: '❌',
    freelancer: '⚠️',
    agency: '✅',
    nta: '✅',
  },
  {
    feature: 'Real Growth System',
    doNothing: '❌',
    freelancer: '❌',
    agency: 'Limited Control',
    nta: '✅',
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
                <th className="text-center py-4 px-6 text-white font-semibold">Monthly Cost</th>
                <th className="text-center py-4 px-6 text-white font-semibold">Structure</th>
                <th className="text-center py-4 px-6 text-white font-semibold">Real Growth System</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-800 hover:bg-slate-900/50">
                  <td className="py-4 px-6 text-white font-medium">{row.feature}</td>
                  <td className="py-4 px-6 text-center">{renderCell(row.doNothing)}</td>
                  <td className="py-4 px-6 text-center">{renderCell(row.freelancer)}</td>
                  <td className="py-4 px-6 text-center">{renderCell(row.agency)}</td>
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