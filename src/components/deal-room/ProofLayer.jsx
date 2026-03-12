import React from 'react';
import { TrendingUp, Users, Zap } from 'lucide-react';

export default function ProofLayer({ industry = 'HVAC' }) {
  const examples = {
    'HVAC': [
      { metric: '+12 calls/month', detail: 'In 45 days' },
      { metric: '+28% visibility', detail: 'Local search' },
      { metric: '4.8★ rating', detail: 'From reviews' }
    ],
    'Restaurant': [
      { metric: '+25% foot traffic', detail: 'In 60 days' },
      { metric: '+45 reservations', detail: 'Per month' },
      { metric: '+18% avg bill', detail: 'Customer frequency' }
    ],
    'Service': [
      { metric: '+8 qualified leads', detail: 'Per month' },
      { metric: '+34% visibility', detail: 'In 90 days' },
      { metric: '3.2x ROI', detail: 'First 6 months' }
    ]
  };

  const proofData = examples[industry] || examples['Service'];

  return (
    <div className="bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Businesses Like Yours Are Seeing…
        </h2>
        <p className="text-slate-600 mb-12 text-lg">
          Real results from {industry.toLowerCase()} companies running this system.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {proofData.map((item, idx) => (
            <div key={idx} className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-8 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <p className="text-3xl font-bold text-slate-900 mb-2">{item.metric}</p>
              <p className="text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>

        {/* Testimonial Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">★</span>
            ))}
          </div>
          <p className="text-slate-700 italic mb-4 text-lg">
            "We went from posting randomly to having a consistent system. Our phones don't stop ringing now. This platform paid for itself in the first 30 days."
          </p>
          <p className="font-semibold text-slate-900">
            — Owner, Local Service Company
          </p>
        </div>
      </div>
    </div>
  );
}