import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

export default function ApprovalReminder({ pendingCount = 0, primaryColor = '#3B82F6' }) {
  if (pendingCount === 0) return null;

  return (
    <div 
      className="rounded-xl p-6 text-white relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${adjustBrightness(primaryColor, -15)} 100%)` 
      }}
    >
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 -mr-20 -mt-20" style={{ backgroundColor: '#fff' }} />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-lg">You Have Content Ready for Review</p>
            <p className="text-sm opacity-90">{pendingCount} item{pendingCount !== 1 ? 's' : ''} waiting for your approval</p>
          </div>
        </div>
        <a href={createPageUrl('ClientApprovals')}>
          <Button 
            size="sm" 
            className="bg-white text-slate-900 hover:bg-slate-100 font-semibold gap-2 whitespace-nowrap"
          >
            Review Now <ArrowRight className="w-4 h-4" />
          </Button>
        </a>
      </div>
    </div>
  );
}

function adjustBrightness(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return "#" + (0x1000000 + (R < 16 ? 0 : "") * R * 0x10000 +
    (G < 16 ? 0 : "") * G * 0x100 + (B < 16 ? 0 : "") * B).toString(16).slice(1);
}