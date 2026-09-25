import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { NTA_SOCIAL_LINKS } from '@/config/socialLinks';
import { Linkedin, Youtube, Instagram, Facebook, MapPin } from 'lucide-react';
import NewsletterFooterSection from '@/components/newsletter/NewsletterFooterSection';

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
          <p className="text-sm leading-relaxed">Built in Mason City, Iowa, NTA works with businesses wherever they are. We help owners and teams understand what they already have, capture what they are learning, and build a practical Digital Growth Roadmap™.</p>
        </div>

        {/* Service Areas */}
        <div>
          <p className="text-white font-semibold mb-3 text-sm">Start With a Question</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/ai-websites" className="hover:text-white transition-colors">I need a better website</Link></li>
            <li><Link to="/ai-seo" className="hover:text-white transition-colors">I need help being found</Link></li>
            <li><Link to="/ai-social-media" className="hover:text-white transition-colors">I need better communication</Link></li>
            <li><Link to="/ai-marketing-platform" className="hover:text-white transition-colors">I want to understand AI</Link></li>
            <li><Link to="/start" className="text-slate-300 hover:text-white transition-colors">Start a Growth Conversation</Link></li>
          </ul>
        </div>

        {/* How NTA Helps */}
        <div>
          <p className="text-white font-semibold mb-3 text-sm">How NTA Helps</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/operating-system" className="hover:text-white transition-colors">Digital Growth Office</Link></li>
            <li><Link to="/work-with-nta" className="hover:text-white transition-colors">Work With NTA</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Services Overview</Link></li>
            <li><Link to="/services/website-rebuilds" className="hover:text-white transition-colors">Websites</Link></li>
            <li><Link to="/services/social-media-management" className="hover:text-white transition-colors">Social Media</Link></li>
            <li><Link to="/ai-video-marketing" className="hover:text-white transition-colors">Video Services</Link></li>
            <li><Link to="/local-visibility" className="hover:text-white transition-colors">Local Visibility</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <p className="text-white font-semibold mb-3 text-sm">Resources</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/knowledge" className="hover:text-white transition-colors">Knowledge Library</Link></li>
            <li><Link to="/knowledge/ai-foundations" className="hover:text-white transition-colors">Free AI Education</Link></li>
            <li><Link to="/growth-show" className="hover:text-white transition-colors">NTA Growth Show</Link></li>
            <li><Link to="/learning-center/videos" className="hover:text-white transition-colors">Video Gallery</Link></li>
            <li><Link to="/journal" className="hover:text-white transition-colors">NTA Journal</Link></li>
            <li><Link to="/books" className="hover:text-white transition-colors">Free Business Books</Link></li>
            <li><Link to="/knowledge/questions" className="hover:text-white transition-colors">Questions &amp; Lessons</Link></li>
            <li><Link to="/case-studies" className="hover:text-white transition-colors">Case Studies</Link></li>
            <li><Link to="/free-audit" className="hover:text-white transition-colors">Free Business Gap Audit</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <p className="text-white font-semibold mb-3 text-sm">Support</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/why-nta" className="hover:text-white transition-colors">Why NTA</a></li>
            <li><Link to="/help-and-support" className="hover:text-white transition-colors">Help &amp; Support</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About NTA</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/accessibility" className="hover:text-white transition-colors">Accessibility &amp; Help</Link></li>
            <li><Link to="/start" className="hover:text-white transition-colors">Start a Free Growth Conversation</Link></li>
            <li><Link to="/join-nta" className="hover:text-white transition-colors">Join the Team</Link></li>
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
          <div className="flex flex-wrap gap-4 text-xs">
            <a href={createPageUrl('PrivacyPolicy')} className="hover:text-white transition-colors">Privacy Policy</a>
            <a href={createPageUrl('TermsOfService')} className="hover:text-white transition-colors">Terms of Service</a>
            <a href={createPageUrl('AIPolicy')} className="hover:text-white transition-colors">AI Policy</a>
          </div>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">Connect with NTA:</span>
          <a href={NTA_SOCIAL_LINKS.facebook.url} target="_blank" rel="noopener noreferrer" aria-label="NTA on Facebook" title="NTA on Facebook" className="text-slate-400 hover:text-blue-600 transition-colors">
            <Facebook className="w-4 h-4" />
          </a>
          <a href={NTA_SOCIAL_LINKS.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Rick Hesse on Instagram" title="Rick Hesse on Instagram" className="text-slate-400 hover:text-pink-500 transition-colors">
            <Instagram className="w-4 h-4" />
          </a>
          <a href={NTA_SOCIAL_LINKS.linkedin.url} target="_blank" rel="noopener noreferrer" aria-label="Rick Hesse on LinkedIn" title="Rick Hesse on LinkedIn" className="text-slate-400 hover:text-blue-400 transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href={NTA_SOCIAL_LINKS.googleBusiness.url} target="_blank" rel="noopener noreferrer" aria-label="New Tech Advertising on Google Business Profile" title="NTA on Google Business Profile" className="text-slate-400 hover:text-emerald-400 transition-colors">
            <MapPin className="w-4 h-4" />
          </a>
          <a href={NTA_SOCIAL_LINKS.youtube.url} target="_blank" rel="noopener noreferrer" aria-label="New Tech Advertising on YouTube" title="NTA on YouTube" className="text-slate-400 hover:text-red-500 transition-colors">
            <Youtube className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
    </>
  );
}

