import React from 'react';
import { Phone, MapPin, FileText, Globe } from 'lucide-react';

const signals = [
  {
    icon: Phone,
    label: 'Calls Received',
    value: '+12',
    description: 'Customers calling to inquire about services.',
  },
  {
    icon: MapPin,
    label: 'Direction Requests',
    value: '+8',
    description: 'People getting directions to your location.',
  },
  {
    icon: FileText,
    label: 'Form Submissions',
    value: '+5',
    description: 'Website contact form inquiries increasing.',
  },
  {
    icon: Globe,
    label: 'Website Visits',
    value: '+34',
    description: 'More traffic from marketing channels.',
  }
];

export default function BusinessImpactSignals() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-8 mb-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Customer Interest Is Increasing</h2>
      <p className="text-slate-700 mb-8">
        Real-world signals showing your marketing is driving actual customer action.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {signals.map((signal, idx) => {
          const Icon = signal.icon;
          return (
            <div key={idx} className="bg-white rounded-lg p-5 border border-green-100">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-lg p-3">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{signal.label}</h3>
                  <div className="text-2xl font-bold text-green-600 mb-1">{signal.value}</div>
                  <p className="text-sm text-slate-700">{signal.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}