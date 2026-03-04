import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function TrialHeader({ slug, ctaLabel = "Start My 7-Day Free Trial", onCTAClick }) {
  const ctaHref = slug ? `/start/${slug}/onboarding` : `/start`;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to={createPageUrl('Home')} className="flex-shrink-0">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png"
            alt="New Tech Advertising"
            style={{ height: '34px', width: 'auto', objectFit: 'contain', display: 'block' }}
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link to={createPageUrl('Dashboard')} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors">
            <UserCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Existing Client Sign In</span>
          </Link>
          {onCTAClick ? (
            <Button
              onClick={onCTAClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm px-5"
            >
              {ctaLabel}
            </Button>
          ) : (
            <Link to={ctaHref}>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm px-5">
                {ctaLabel}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}