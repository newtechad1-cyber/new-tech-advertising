import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const INDUSTRIES = [
  'Plumbing', 'HVAC', 'Electrician', 'Roofing', 'Landscaping',
  'Restaurant', 'Dental', 'Medical', 'Real Estate', 'Auto Repair',
  'Home Services', 'Consulting', 'E-commerce', 'SaaS', 'Other'
];

const SERVICES = [
  'Installation', 'Repair', 'Maintenance', 'Consultation',
  'Design', 'Sales', 'Training', 'Support'
];

export default function TrialBusinessSetup() {
  const [form, setForm] = useState({
    businessName: '',
    locations: [],
    industry: '',
    services: [],
    website: ''
  });

  const toggleService = (svc) => {
    setForm(f => ({
      ...f,
      services: f.services.includes(svc)
        ? f.services.filter(s => s !== svc)
        : [...f.services, svc]
    }));
  };

  const isComplete = form.businessName && form.locations.length > 0 && form.industry;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[25%] bg-violet-500 transition-all" />
          </div>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Tell Us About Your Business</h1>
          <p className="text-slate-400 text-sm">This gives us the context to build your marketing strategy.</p>
        </div>

        {/* Form */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-8">
          {/* Business Name */}
          <div>
            <label className="block text-white font-semibold text-sm mb-3">
              Business Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Smith's Plumbing"
              value={form.businessName}
              onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Locations */}
          <div>
            <label className="block text-white font-semibold text-sm mb-3">
              Service Location(s) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Chicago, IL"
              value={form.locations.join(', ')}
              onChange={e => setForm(f => ({
                ...f,
                locations: e.target.value.split(',').map(l => l.trim()).filter(Boolean)
              }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
            <p className="text-slate-500 text-xs mt-2">Separate multiple locations with commas</p>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-white font-semibold text-sm mb-3">
              Industry <span className="text-red-400">*</span>
            </label>
            <select
              value={form.industry}
              onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            >
              <option value="">Select your industry...</option>
              {INDUSTRIES.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* Services */}
          <div>
            <label className="block text-white font-semibold text-sm mb-3">Main Services</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SERVICES.map(svc => (
                <button
                  key={svc}
                  onClick={() => toggleService(svc)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    form.services.includes(svc)
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {svc}
                </button>
              ))}
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-white font-semibold text-sm mb-3">Website (optional)</label>
            <input
              type="text"
              placeholder="https://www.yoursite.com"
              value={form.website}
              onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between gap-4">
          <Link
            to={createPageUrl('TrialWelcome')}
            className="flex items-center gap-2 text-slate-400 hover:text-white font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <Link
            to={createPageUrl('TrialConnectChannels')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isComplete
                ? 'bg-violet-600 hover:bg-violet-500 text-white'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            onClick={e => !isComplete && e.preventDefault()}
          >
            Next Step <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}