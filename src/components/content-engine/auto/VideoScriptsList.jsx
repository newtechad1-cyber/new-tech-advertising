import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Video, ChevronDown, ChevronUp, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const TYPE_COLORS = {
  explainer: 'bg-blue-900/30 text-blue-400', sales: 'bg-orange-900/30 text-orange-400',
  case_study: 'bg-purple-900/30 text-purple-400', social_short: 'bg-pink-900/30 text-pink-400',
};
const STATUS_COLORS = {
  draft: 'text-gray-400', review: 'text-yellow-400', approved: 'text-green-400',
  recording: 'text-blue-400', complete: 'text-emerald-400',
};

export default function VideoScriptsList() {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  const { data: scripts = [], isLoading } = useQuery({
    queryKey: ['video-scripts'],
    queryFn: () => base44.entities.VideoScripts.list('-created_date', 100),
  });

  const updateStatus = async (id, status) => {
    setUpdating(id);
    await base44.entities.VideoScripts.update(id, { status });
    qc.invalidateQueries({ queryKey: ['video-scripts'] });
    toast.success(`Script ${status}`);
    setUpdating(null);
  };

  if (isLoading) return <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-600" /></div>;

  if (scripts.length === 0) return (
    <div className="text-center py-16 border border-dashed border-gray-700 rounded-xl text-gray-600">
      <Video className="w-8 h-8 mx-auto mb-3 opacity-30" />
      <p>No video scripts yet. Generate content from topics to create scripts.</p>
    </div>
  );

  return (
    <div className="space-y-2">
      {scripts.map(s => {
        const isOpen = expanded === s.id;
        return (
          <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all">
            <div className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-800/30" onClick={() => setExpanded(isOpen ? null : s.id)}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[s.video_type] || 'bg-gray-800 text-gray-400'}`}>{s.video_type}</span>
                  <span className={`text-xs font-medium ${STATUS_COLORS[s.status] || 'text-gray-400'}`}>{s.status}</span>
                  {s.estimated_duration_sec && <span className="text-xs text-gray-600">{s.estimated_duration_sec}s</span>}
                </div>
                <p className="text-sm font-semibold text-white truncate">{s.title}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {s.status === 'draft' && (
                  <Button size="sm" variant="outline" className="border-yellow-700 text-yellow-400 hover:bg-yellow-900/20 h-7 text-xs"
                    onClick={e => { e.stopPropagation(); updateStatus(s.id, 'review'); }} disabled={updating === s.id}>
                    Send for Review
                  </Button>
                )}
                {s.status === 'review' && (
                  <Button size="sm" className="bg-green-700 hover:bg-green-600 h-7 text-xs"
                    onClick={e => { e.stopPropagation(); updateStatus(s.id, 'approved'); }} disabled={updating === s.id}>
                    <CheckCircle className="w-3 h-3 mr-1" /> Approve
                  </Button>
                )}
                {s.status === 'approved' && (
                  <Button size="sm" className="bg-blue-700 hover:bg-blue-600 h-7 text-xs"
                    onClick={e => { e.stopPropagation(); updateStatus(s.id, 'recording'); }} disabled={updating === s.id}>
                    <Clock className="w-3 h-3 mr-1" /> Mark Recording
                  </Button>
                )}
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
              </div>
            </div>
            {isOpen && (
              <div className="px-4 pb-4 border-t border-gray-800 pt-3 space-y-3">
                {s.hook && (
                  <div className="bg-gray-800 rounded-lg p-3 border-l-2 border-yellow-600">
                    <p className="text-xs text-yellow-400 font-bold mb-1">HOOK</p>
                    <p className="text-sm text-gray-300">{s.hook}</p>
                  </div>
                )}
                {s.problem && (
                  <div className="bg-gray-800 rounded-lg p-3 border-l-2 border-red-600">
                    <p className="text-xs text-red-400 font-bold mb-1">PROBLEM</p>
                    <p className="text-sm text-gray-300">{s.problem}</p>
                  </div>
                )}
                {s.solution && (
                  <div className="bg-gray-800 rounded-lg p-3 border-l-2 border-green-600">
                    <p className="text-xs text-green-400 font-bold mb-1">SOLUTION</p>
                    <p className="text-sm text-gray-300">{s.solution}</p>
                  </div>
                )}
                {s.call_to_action && (
                  <div className="bg-gray-800 rounded-lg p-3 border-l-2 border-blue-600">
                    <p className="text-xs text-blue-400 font-bold mb-1">CALL TO ACTION</p>
                    <p className="text-sm text-gray-300">{s.call_to_action}</p>
                  </div>
                )}
                {s.script_text && !s.hook && (
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-bold mb-2">FULL SCRIPT</p>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">{s.script_text}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}