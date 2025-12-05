import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail, Phone, UserCircle } from 'lucide-react';
import { createPageUrl } from '../../utils';

export default function Header({ onCTAClick }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/bd570a4a6_NTAlogo2.png" 
                alt="New Tech Advertising" 
                className="h-12 w-auto"
              />
              <div>
                <div className="font-bold text-xl text-slate-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  New<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tech</span>
                </div>
                <div className="text-sm text-slate-600 -mt-1">Advertising</div>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link to={createPageUrl('About')} className="hover:text-blue-600 transition-colors">About</Link>
              <Link to={createPageUrl('AiWebsites')} className="hover:text-blue-600 transition-colors">AI Websites</Link>
              <Link to={createPageUrl('AiVideos')} className="hover:text-blue-600 transition-colors">AI Videos</Link>
              <Link to={createPageUrl('AiSeo')} className="hover:text-blue-600 transition-colors">AI SEO</Link>
              <Link to={createPageUrl('AiAdvertising')} className="hover:text-blue-600 transition-colors">AI Ads</Link>
              <Link to={createPageUrl('AiSocialMedia')} className="hover:text-blue-600 transition-colors">AI Social Media</Link>
              <Link to={createPageUrl('Blog')} className="hover:text-blue-600 transition-colors">Blog</Link>
              </nav>
              </div>

          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" className="text-slate-600 font-medium hidden sm:flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Login
              </Button>
            </Link>
            <Button
              onClick={onCTAClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}