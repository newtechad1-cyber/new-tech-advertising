import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const INDUSTRIES = [
  'Healthcare',
  'Real Estate',
  'Hospitality',
  'Retail',
  'Professional Services',
  'Fitness & Wellness',
  'Education',
  'Home Services',
  'Restaurant',
  'Other'
];

export default function TrialBusiness() {
  const [formData, setFormData] = useState({
    businessName: '',
    location: '',
    industry: '',
    services: '',
    website: ''
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('onboarding_business');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  // Validate form
  useEffect(() => {
    const hasErrors = !formData.businessName.trim() || !formData.location.trim() || !formData.industry || !formData.services.trim();
    setIsValid(!hasErrors);
  }, [formData]);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('onboarding_business', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col">
      {/* Progress Bar */}
      <div className="h-1 bg-slate-800 w-full">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all"
          style={{ width: '50%' }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Step Indicator */}
          <div className="mb-12">
            <p className="text-slate-400 text-sm font-semibold tracking-wide mb-3">STEP 2 OF 4</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    step <= 2 ? 'bg-violet-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Tell Us About Your Business
            </h1>
            <p className="text-lg text-slate-400">
              Just the basics — we'll use this to personalize your marketing system.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6 mb-10">
            {/* Business Name */}
            <div>
              <label className="block text-white font-semibold mb-3 text-lg">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g., Acme Dental"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none transition-colors text-base"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-white font-semibold mb-3 text-lg">Primary Location / City</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Chicago, IL"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none transition-colors text-base"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-white font-semibold mb-3 text-lg">Industry</label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none transition-colors text-base"
              >
                <option value="">Choose an industry...</option>
                {INDUSTRIES.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Main Services */}
            <div>
              <label className="block text-white font-semibold mb-3 text-lg">Main Services You Offer</label>
              <textarea
                name="services"
                value={formData.services}
                onChange={handleChange}
                placeholder="e.g., Dental cleanings, orthodontics, teeth whitening"
                rows="3"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none transition-colors resize-none text-base"
              />
            </div>

            {/* Website (Optional) */}
            <div>
              <label className="block text-white font-semibold mb-3 text-lg">Website <span className="text-slate-400 font-normal text-sm">(optional)</span></label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yoursite.com"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none transition-colors text-base"
              />
            </div>
          </form>

          {/* CTAs */}
          <div className="space-y-4">
            <Link
              to={isValid ? createPageUrl('TrialChannels') : '#'}
              onClick={(e) => !isValid && e.preventDefault()}
              className={`block w-full py-4 rounded-xl text-center font-bold text-lg transition-all flex items-center justify-center gap-2 group ${
                isValid
                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white cursor-pointer'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              Continue to Channels <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to={createPageUrl('TrialWelcome')}
              className="w-full text-slate-400 hover:text-slate-200 font-semibold transition-colors py-3 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}