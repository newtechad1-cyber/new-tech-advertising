import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

export default function Header({ onCTAClick }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="tel:641-420-8816" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="font-semibold">641-420-8816</span>
              </a>
              <a href="mailto:rick@newtechadvertising.com" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                <Mail className="w-4 h-4" />
                <span>rick@newtechadvertising.com</span>
              </a>
            </div>
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