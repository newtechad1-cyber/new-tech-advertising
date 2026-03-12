import React from 'react';
import { TrendingUp, Target, Clock, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function NTAPipelineMetrics() {
  const conversionData = [
    { stage: 'Demo → Deal Room', rate: '78%', target: '75%', status: 'exceeding' },
    { stage: 'Deal Room → Commitment', rate: '62%', target: '60%', status: 'exceeding' },
    { stage: 'Commitment → Activated', rate: '88%', target: '85%', status: 'exceeding' },
    { stage: 'Lead → Activation', rate: '24%', target: '25%', status: 'tracking' }
  ];

  const timelineData = [
    { stage: 'Lead → Strategy Scheduled', days: 2.4 },
    { stage: 'Strategy → Demo', days: 3.1 },
    { stage: 'Demo → Deal Room', days: 1.8 },
    { stage: 'Deal Room → Commitment', days: 5.2 },
    { stage: 'Commitment → Activated', days: 7.6 },
    { stage: 'Lead → Full Activation', days: 20.1 }
  ];

  const planTierData = [
    { name: 'Visibility Plan', deals: 3, revenue: '$4,500' },
    { name: 'Growth Authority', deals: 8, revenue: '$20,000' },
    { name: 'Video Dominance', deals: 2, revenue: '$9,000' }
  ];

  return (
    <div className="space-y-6">
      {/* Conversion Rates */}
      <div className="bg-white p-8 rounded-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Conversion Metrics
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {conversionData.map((metric, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-2">{metric.stage}</p>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-slate-900">{metric.rate}</span>
                <span className="text-sm text-slate-500">(Target: {metric.target})</span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                metric.status === 'exceeding'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {metric.status === 'exceeding' ? '✓ Exceeding Target' : 'On Track'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Cycle Timeline */}
      <div className="bg-white p-8 rounded-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-purple-600" />
          Cycle Timeline
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" angle={-45} textAnchor="end" height={100} />
            <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="days" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Current Cycle:</strong> 20.1 days average from new lead to activated customer.
          </p>
        </div>
      </div>

      {/* Plan Tier Performance */}
      <div className="bg-white p-8 rounded-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-600" />
          Plan Tier Closed
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {planTierData.map((plan, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-3">{plan.name}</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-slate-600">Deals Closed</p>
                  <p className="text-2xl font-bold text-slate-900">{plan.deals}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Projected MRR</p>
                  <p className="text-lg font-semibold text-green-600">{plan.revenue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Health Summary */}
      <div className="bg-slate-900 text-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Pipeline Health Summary</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-slate-300 mb-1">Total Qualified Opportunities</p>
            <p className="text-3xl font-bold">24</p>
          </div>
          <div>
            <p className="text-sm text-slate-300 mb-1">Projected Monthly Revenue</p>
            <p className="text-3xl font-bold">$47,250</p>
          </div>
          <div>
            <p className="text-sm text-slate-300 mb-1">Average Deal Size</p>
            <p className="text-3xl font-bold">$1,968/mo</p>
          </div>
          <div>
            <p className="text-sm text-slate-300 mb-1">Win Probability (Weighted)</p>
            <p className="text-3xl font-bold">54%</p>
          </div>
        </div>
      </div>
    </div>
  );
}