import React from 'react';
import { createPageUrl } from '@/utils';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

export default function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png"
            alt="New Tech Advertising"
            style={{ height: '40px', width: 'auto', objectFit: 'contain', display: 'block' }}
            className="mb-3 brightness-0 invert"
          />
          <p className="text-sm leading-relaxed">AI marketing tools built for small and mid-sized businesses. Create videos, images, and social posts in minutes.</p>
        </div>

        {/* Service Areas */}
        <div>
          <p className="text-white font-semibold mb-3 text-sm">Service Areas</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/website-rebuilds/mason-city-ia" className="hover:text-white transition-colors">Mason City, IA</a></li>
            <li><a href="/website-rebuilds/rochester-mn" className="hover:text-white transition-colors">Rochester, MN</a></li>
            <li><a href="/website-rebuilds/austin-mn" className="hover:text-white transition-colors">Austin, MN</a></li>
            <li><a href="/website-rebuilds/albert-lea-mn" className="hover:text-white transition-colors">Albert Lea, MN</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <p className="text-white font-semibold mb-3 text-sm">Services</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/services/website-rebuilds" className="hover:text-white transition-colors">Website Rebuilds</a></li>
            <li><a href="/AdaWebsiteCompliance" className="hover:text-white transition-colors">ADA Compliance</a></li>
            <li><a href="/StreamingTvAdvertising" className="hover:text-white transition-colors">Streaming TV Ads</a></li>
            <li><a href="/AiSeo" className="hover:text-white transition-colors">AI SEO &amp; Marketing</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <p className="text-white font-semibold mb-3 text-sm">Resources</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/Blog" className="hover:text-white transition-colors">All Articles</a></li>
            <li><a href="/our-work" className="hover:text-white transition-colors">Our Work</a></li>
            <li><a href="/rebuild-intake" className="hover:text-white transition-colors">Free Website Audit</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <p className="text-white font-semibold mb-3 text-sm">Support</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/HelpAndSupport" className="hover:text-white transition-colors">Help &amp; Support</a></li>
            <li><a href="/About" className="hover:text-white transition-colors">About NTA</a></li>
            <li><a href="/Contact" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="tel:6414208816" className="hover:text-white transition-colors">641-420-8816</a></li>
            <li><a href="mailto:info@newtechadvertising.com" className="hover:text-white transition-colors">info@newtechadvertising.com</a></li>
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