import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import NTAPipelineStages from '@/components/sales/cmd/NTAPipelineStages';
import NTADailyWorkflow from '@/components/sales/cmd/NTADailyWorkflow';
import NTAPipelineMetrics from '@/components/sales/cmd/NTAPipelineMetrics';

export default function SalesCommandCenter() {
  const [activeTab, setActiveTab] = useState('pipeline');

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Sales Command Center</h1>
          <p className="text-slate-600">
            NTA Sales Pipeline: Controlled production line from awareness to activation.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-300">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'pipeline'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Pipeline Flow
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'workflow'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily Workflow
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'metrics'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Metrics & Performance
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <NTAPipelineStages />
            
            <div className="bg-white p-8 rounded-lg border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">7-Stage Pipeline Philosophy</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">🎯 Each Stage Has One Goal</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• <strong>New Opportunity</strong> → Decide if demo is appropriate</li>
                    <li>• <strong>Strategy Scheduled</strong> → Understand goals & urgency</li>
                    <li>• <strong>Demo Delivered</strong> → Confirm perceived value</li>
                    <li>• <strong>Deal Room Active</strong> → Move to commitment</li>
                    <li>• <strong>Commitment</strong> → Confirm plan & timing</li>
                    <li>• <strong>Trial Activated</strong> → Prevent post-sale drop-off</li>
                    <li>• <strong>Expansion Ready</strong> → Turn to lifetime revenue</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">⚠️ Common Mistakes to Avoid</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>❌ Jump from lead to proposal</li>
                    <li>❌ Give pricing before value</li>
                    <li>❌ Skip strategy conversation</li>
                    <li>❌ Allow demos without qualification</li>
                    <li>❌ Let deals linger without next step</li>
                    <li>✅ Move prospects intentionally</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="space-y-6">
            <NTADailyWorkflow />
            
            <div className="bg-white p-8 rounded-lg border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Why This Rhythm Works</h2>
              <p className="text-slate-700 mb-4">
                Sales feels scattered when reps juggle everything. This workflow creates structure:
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>✓ <strong>Mornings:</strong> Follow-ups & confirmations (highest ROI conversations)</li>
                <li>✓ <strong>Midday:</strong> High-energy demos & qualifying calls</li>
                <li>✓ <strong>Afternoons:</strong> Nurture & deal pushing (momentum building)</li>
                <li>✓ <strong>End of Day:</strong> Pipeline hygiene & next-day prep</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && <NTAPipelineMetrics />}

        {/* Bottom CTA */}
        <div className="mt-8 bg-blue-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Transform Your Sales Process</h2>
          <p className="mb-4">After implementing this 7-stage pipeline:</p>
          <div className="grid md:grid-cols-5 gap-4 text-sm">
            <div>✅ Sales cycles shorten</div>
            <div>✅ Rep performance stabilizes</div>
            <div>✅ Forecasting improves</div>
            <div>✅ Deal visibility increases</div>
            <div>✅ Expansion becomes systematic</div>
          </div>
        </div>
      </div>
    </div>
  );
}