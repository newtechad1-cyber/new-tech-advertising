import React from 'react';
import { createPageUrl } from '@/utils';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

export default function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-10">
        <div>
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png"
            alt="New Tech Advertising"
            style={{ height: '40px', width: 'auto', objectFit: 'contain', display: 'block' }}
            className="mb-3 brightness-0 invert"
          />
          <p className="text-sm leading-relaxed">AI marketing tools built for small and mid-sized businesses. Create videos, images, and social posts in minutes.</p>
        </div>
        <div>
          <p className="text-white font-semibold mb-3 text-sm">Platform</p>
          <ul className="space-y-2 text-sm">
            <li><a href={TRIAL_URL} className="hover:text-white transition-colors">Start Free Trial</a></li>
            <li><a href={createPageUrl('AiSocialMediaSmallBusiness')} className="hover:text-white transition-colors">Social Media Tools</a></li>
            <li><a href={createPageUrl('LocalBusinessMarketing')} className="hover:text-white transition-colors">Local Business</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3 text-sm">Industries</p>
          <ul className="space-y-2 text-sm">
            <li><a href={createPageUrl('HvacMarketing')} className="hover:text-white transition-colors">HVAC Marketing</a></li>
            <li><a href={createPageUrl('RestaurantSocialMedia')} className="hover:text-white transition-colors">Restaurant Marketing</a></li>
            <li><a href={createPageUrl('AdaWebsiteLawsuitPrevention')} className="hover:text-white transition-colors">ADA Compliance</a></li>
            <li><a href={createPageUrl('AdaWebsiteRebuild')} className="hover:text-white transition-colors">ADA Website Rebuild</a></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3 text-sm">Contact</p>
          <ul className="space-y-2 text-sm">
            <li>Mason City, IA</li>
            <li><a href="tel:6414208816" className="hover:text-white transition-colors">641-420-8816</a></li>
            <li><a href="mailto:rick@newtechadvertising.com" className="hover:text-white transition-colors">rick@newtechadvertising.com</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between gap-3 text-xs">
        <p>© {new Date().getFullYear()} New Tech Advertising. All rights reserved.</p>
        <div className="flex gap-4">
          <a href={createPageUrl('PrivacyPolicy')} className="hover:text-white transition-colors">Privacy Policy</a>
          <a href={createPageUrl('TermsOfService')} className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}