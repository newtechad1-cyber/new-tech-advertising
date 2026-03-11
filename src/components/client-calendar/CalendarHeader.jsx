import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, BarChart3, HelpCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function CalendarHeader({ companyName, primaryColor = '#3B82F6' }) {
  const accentColor = primaryColor;

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Marketing Calendar</h1>
            <p className="text-slate-600 text-sm mt-1">
              See what content is planned, scheduled, awaiting approval, and recently published for your business.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={createPageUrl('ClientApprovals')}>
              <Button size="sm" className="gap-2" style={{ backgroundColor: accentColor }}>
                <CheckCircle className="w-4 h-4" />
                Review Pending
              </Button>
            </a>
            <Button size="sm" variant="outline" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Published
            </Button>
            <a href="mailto:support@newtechadvertising.com">
              <Button size="sm" variant="ghost" className="gap-2">
                <HelpCircle className="w-4 h-4" />
                Support
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}