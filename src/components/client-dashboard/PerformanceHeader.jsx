import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, HelpCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function PerformanceHeader({ companyName, companyLogo, primaryColor }) {
  const accentColor = primaryColor || '#3B82F6';

  return (
    <div 
      className="rounded-2xl p-8 text-white relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${accentColor} 0%, ${adjustBrightness(accentColor, -20)} 100%)` 
      }}
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 -mr-32 -mt-32" style={{ backgroundColor: '#fff' }} />
      
      <div className="relative z-10">
        {/* Title and Subtitle */}
        <h1 className="text-4xl font-bold mb-2">Your Marketing Is Working</h1>
        <p className="text-lg opacity-90 mb-6 max-w-2xl">Here's what's happening for your business right now.</p>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <a href={createPageUrl('ClientApprovals')}>
            <Button 
              size="sm" 
              className="bg-white text-slate-900 hover:bg-slate-100 font-semibold gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Review Pending Content
            </Button>
          </a>
          <a href={createPageUrl('ScheduledQueue')}>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 font-semibold gap-2"
            >
              <Calendar className="w-4 h-4" />
              View Content Calendar
            </Button>
          </a>
          <a href="mailto:support@newtechadvertising.com">
            <Button 
              size="sm" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 font-semibold gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              Contact Support
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

// Helper to adjust color brightness
function adjustBrightness(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return "#" + (0x1000000 + (R < 16 ? 0 : "") * R * 0x10000 +
    (G < 16 ? 0 : "") * G * 0x100 + (B < 16 ? 0 : "") * B).toString(16).slice(1);
}