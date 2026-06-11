import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Linkedin, Youtube, Instagram } from 'lucide-react';
import NewsletterFooterSection from '@/components/newsletter/NewsletterFooterSection';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

export default function SiteFooter() {
  return (
    <>
      <NewsletterFooterSection />
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png"
            alt="New Tech Advertising"
            style={{ height: '40px', width: 'auto', objectFit: 'contain', display: 'block' }}
            className="mb-3"
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

        {/* Solutions */}
        <div>
          <p className="text-white font-semibold mb-3 text-sm">Solutions</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Main Site</Link></li>
            <li><Link to="/local-lead-systems" className="hover:text-white transition-colors">Marketing Solutions</Link></li>
            <li><Link to="/back-office-solutions" className="hover:text-white transition-colors">Back-Office Solutions</Link></li>
            <li><Link to="/restaurants" className="hover:text-white transition-colors">Restaurant Solutions</Link></li>
            <li><Link to="/Contact" className="hover:text-white transition-colors">Contact</Link></li>
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

      <div className="max-w-6xl mx-auto border-t border-slate-800 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
          <div className="flex-1">
            <p className="text-xs">© {new Date().getFullYear()} New Tech Advertising. All rights reserved.</p>
          </div>
          <div className="flex gap-4 text-xs">
            <a href={createPageUrl('PrivacyPolicy')} className="hover:text-white transition-colors">Privacy Policy</a>
            <a href={createPageUrl('TermsOfService')} className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-500">Follow Rick:</span>
          <a href="https://www.linkedin.com/in/rick-hesse-64755946/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="https://www.youtube.com/@RickHesse" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-500 transition-colors">
            <Youtube className="w-4 h-4" />
          </a>
          <a href="https://www.tiktok.com/@rick.hesse" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-200 transition-colors">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 0 1-2.4 2.4 2.4 2.4 0 0 1-2.4-2.4 2.4 2.4 0 0 1 2.4-2.4c.34 0 .67.05 1 .15V9.41a5.8 5.8 0 0 0-1-.08A5.8 5.8 0 0 0 5.5 19.35a5.8 5.8 0 0 0 5.8 5.8 5.8 5.8 0 0 0 5.81-5.8V11a7.7 7.7 0 0 0 4.58 1.53V9.86a4.77 4.77 0 0 1-1.3-.18Z"/></svg>
          </a>
          <a href="https://www.instagram.com/hesse2882/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors">
            <Instagram className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
    </>
  );
}