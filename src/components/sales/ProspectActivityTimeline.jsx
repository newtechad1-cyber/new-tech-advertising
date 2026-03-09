import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2, Eye, MousePointer, Video, MessageSquare, FileText, Zap } from 'lucide-react';

const EVENT_CONFIG = {
  demo_start: { icon: Zap, color: 'text-violet-400', label: 'Started demo' },
  demo_overview: { icon: Eye, color: 'text-blue-400', label: 'Viewed: Overview' },
  demo_platform: { icon: Eye, color: 'text-blue-400', label: 'Viewed: Platform Walkthrough' },
  demo_examples: { icon: Eye, color: 'text-blue-400', label: 'Viewed: Industry Examples' },
  demo_pricing: { icon: Eye, color: 'text-yellow-400', label: 'Viewed: Demo Pricing' },
  deal_room_visit: { icon: Eye, color: 'text-orange-400', label: 'Entered Deal Room' },
  deal_room_pricing: { icon: Eye, color: 'text-yellow-400', label: 'Viewed: Pricing' },
  deal_room_proposal: { icon: FileText, color: 'text-violet-400', label: 'Viewed: Proposal' },
  deal_room_roi: { icon: Zap, color: 'text-green-400', label: 'Used ROI Calculator' },
  cta_start_trial: { icon: MousePointer, color: 'text-green-400', label: 'Clicked: Start Trial' },
  cta_book_call: { icon: MousePointer, color: 'text-cyan-400', label: 'Clicked: Book Call' },
  cta_request_setup: { icon: MousePointer, color: 'text-orange-400', label: 'Clicked: Request Setup' },
  ai_question: { icon: MessageSquare, color: 'text-pink-400', label: 'Asked AI a question' },
  video_50: { icon: Video, color: 'text-blue-400', label: 'Watched 50% of video' },
  video_85: { icon: Video, color: 'text-blue-400', label: 'Watched 85% of video' },
  video_complete: { icon: Video, color: 'text-green-400', label: 'Completed video' },
};

export default function ProspectActivityTimeline({ prospectId }) {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['prospect-events', prospectId],
    queryFn: () => base44.entities.SalesEvents.filter({ prospect_id: prospectId }, '-created_at', 50),
    enabled: !!prospectId,
  });

  if (isLoading) return <div className="py-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-slate-500" /></div>;
  if (!events.length) return <p className="text-slate-600 text-sm py-4">No activity recorded yet.</p>;

  return (
    <div className="space-y-2">
      {events.map(ev => {
        const cfg = EVENT_CONFIG[ev.event_type] || { icon: Eye, color: 'text-slate-400', label: ev.event_type };
        const Icon = cfg.icon;
        return (
          <div key={ev.id} className="flex items-start gap-3 py-2 border-b border-slate-800 last:border-0">
            <div className={`w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-300 font-medium">{cfg.label}</p>
              {ev.page_path && <p className="text-xs text-slate-600">{ev.page_path}</p>}
            </div>
            <span className="text-xs text-slate-600 flex-shrink-0">
              {new Date(ev.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      })}
    </div>
  );
}