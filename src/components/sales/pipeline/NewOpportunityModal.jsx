import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const industries = [
  'hvac',
  'plumbing',
  'roofing',
  'landscaping',
  'electrical',
  'painting',
  'fitness',
  'restaurant',
  'real_estate',
  'dental',
  'law',
  'med_spa',
  'other',
];

const sources = [
  'authority_content_seo',
  'social_authority',
  'outbound_prospecting',
  'referral_expansion',
  'territory_campaigns',
  'demo_request',
  'paid_amplification',
  'partner',
  'event',
  'other',
];

export default function NewOpportunityModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    industry: 'other',
    city: '',
    source: 'other',
    initial_interest_level: 'medium',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg border border-slate-700 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">Create New Opportunity</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Company Name *
            </label>
            <Input
              type="text"
              placeholder="Business name"
              value={formData.company_name}
              onChange={(e) =>
                setFormData({ ...formData, company_name: e.target.value })
              }
              className="bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Contact Name
              </label>
              <Input
                type="text"
                placeholder="Name"
                value={formData.contact_name}
                onChange={(e) =>
                  setFormData({ ...formData, contact_name: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email *
              </label>
              <Input
                type="email"
                placeholder="Email"
                value={formData.contact_email}
                onChange={(e) =>
                  setFormData({ ...formData, contact_email: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Phone
              </label>
              <Input
                type="tel"
                placeholder="Phone"
                value={formData.contact_phone}
                onChange={(e) =>
                  setFormData({ ...formData, contact_phone: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                City
              </label>
              <Input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Industry
              </label>
              <select
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm"
              >
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm"
              >
                {sources.map((src) => (
                  <option key={src} value={src}>
                    {src.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Interest Level
            </label>
            <select
              value={formData.initial_interest_level}
              onChange={(e) =>
                setFormData({ ...formData, initial_interest_level: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="very_high">Very High</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Create Opportunity
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}