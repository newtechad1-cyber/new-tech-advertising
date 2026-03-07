import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Building2, MapPin, Target, ArrowRight } from 'lucide-react';

export default function DashboardBusinessProfile({ businessProfile }) {
  if (!businessProfile) return null;

  const fields = [
    { icon: Building2, label: 'Business', value: businessProfile.business_name },
    { icon: MapPin, label: 'Location', value: `${businessProfile.city}, ${businessProfile.state}` },
    { icon: Target, label: 'Industry', value: businessProfile.industry_slug },
  ];

  if (businessProfile.primary_goal) {
    fields.push({ icon: Target, label: 'Primary Goal', value: businessProfile.primary_goal });
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-6">Your Business Profile</h3>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.label} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{field.label}</p>
                <p className="text-white font-semibold">{field.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-700">
        <button className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-semibold text-sm transition-colors">
          Edit Profile <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}