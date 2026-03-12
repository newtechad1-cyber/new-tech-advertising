import React from 'react';
import { AlertCircle, Target, Zap, TrendingUp } from 'lucide-react';

export default function StrategyBlock() {
  return (
    <div className="bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-12">Your Strategy</h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Current Gaps */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <h3 className="text-lg font-semibold text-slate-900">Current Marketing Gaps</h3>
            </div>
            <ul className="space-y-2 text-slate-700">
              <li>✓ Inconsistent posting across channels</li>
              <li>✓ Limited video content authority</li>
              <li>✓ No integrated system for visibility</li>
              <li>✓ Unclear ROI on marketing spend</li>
            </ul>
          </div>

          {/* Recommended Strategy */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <Target className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <h3 className="text-lg font-semibold text-slate-900">Recommended Strategy</h3>
            </div>
            <ul className="space-y-2 text-slate-700">
              <li>✓ Consistent daily content distribution</li>
              <li>✓ Strategic video authority building</li>
              <li>✓ Unified channel management</li>
              <li>✓ Real-time visibility & engagement tracking</li>
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <h3 className="text-lg font-semibold text-slate-900">Expected Growth Timeline</h3>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-xs text-blue-600 font-semibold mb-1">WEEK 1–2</p>
              <p className="text-slate-700">Setup & Onboarding</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-xs text-blue-600 font-semibold mb-1">WEEK 3</p>
              <p className="text-slate-700">Visibility Growth Begins</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-xs text-blue-600 font-semibold mb-1">MONTH 2</p>
              <p className="text-slate-700">Engagement Momentum</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-xs text-blue-600 font-semibold mb-1">MONTH 3</p>
              <p className="text-slate-700">Expansion Ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}