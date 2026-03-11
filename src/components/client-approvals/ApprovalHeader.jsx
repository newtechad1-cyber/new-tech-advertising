import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, HelpCircle } from 'lucide-react';

export default function ApprovalHeader({ company, user }) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-4">
            {company?.logo_url && (
              <img 
                src={company.logo_url} 
                alt={company.name}
                className="h-12 w-auto object-contain"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Content Approvals</h1>
              <p className="text-slate-600 mt-1">
                Review and approve upcoming content prepared for {company?.name || 'your brand'}.
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Hi {company?.name || 'there'}, here is your latest content ready for review.
              </p>
            </div>
          </div>
          
          {/* Top Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              Calendar
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              Published
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <HelpCircle className="w-4 h-4" />
              Support
            </Button>
          </div>
        </div>

        {/* Brand Accent Bar */}
        <div 
          className="h-1 w-20 rounded-full"
          style={{
            backgroundColor: company?.primary_color || '#3b82f6'
          }}
        />
      </div>
    </div>
  );
}