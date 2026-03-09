import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileText, CheckCircle, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';

const TYPE_COLORS = {
  blog: 'bg-blue-900/30 text-blue-400 border-blue-800',
  landing_page: 'bg-purple-900/30 text-purple-400 border-purple-800',
  video_script: 'bg-orange-900/30 text-orange-400 border-orange-800',
  social_series: 'bg-pink-900/30 text-pink-400 border-pink-800',
  email_sequence: 'bg-cyan-900/30 text-cyan-400 border-cyan-800',
};
const STATUS_STYLES = {
  draft: 'bg-gray-800 text-gray-400',
  review: 'bg-yellow-900/40 text-yellow-400',
  approved: 'bg-green-900/40 text-green-400',
  published: 'bg-blue-900/40 text-blue-400',
  rejected: 'bg-red-900/40 text-red-400',
};

export default function GeneratedLibrary() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [preview, setPreview] = useState(null);
  const [updating, setUpdating] = useState(null);

  const { data: content = [], isLoading } = useQuery({
    queryKey: ['generated-content', filter],
    queryFn: () => filter === 'all'
      ? base44.entities.GeneratedContent.list('-created_date', 100)
      : base44.entities.GeneratedContent.filter({ content_type: filter }, '-created_date', 100),
  });

  const updateStatus = async (id, status) => {
    setUpdating(id);
    await base44.entities.GeneratedContent.update(id, { status });
    qc.invalidateQueries({ queryKey: ['generated-content'] });
    toast.success(`Status updated to ${status}`);
    setUpdating(null);
    if (preview?.id === id) setPreview(p => ({ ...p, status }));
  };

  const counts = {
    all: content.length, draft: content.filter(c => c.status === 'draft').length,
    review: content.filter(c => c.status === 'review').length,
    approved: content.filter(c => c.status === 'approved').length,
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {['all', 'draft', 'review', 'approved', 'published', 'blog', 'landing_page', 'video_script', 'social_series', 'email_sequence'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === f ? 'bg-violet-700 border-violet-600 text-white' : 'border-gray-700 text-gray-500 hover:text-gray-300'}`}>
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-600" /></div>
      ) : content.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-700 rounded-xl text-gray-600">
          <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p>No generated content yet. Add topics and run generation.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {content.map(c => (
            <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-gray-700 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLORS[c.content_type] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>{c.content_type?.replace('_', ' ')}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[c.status] || ''}`}>{c.status}</span>
                  {c.word_count > 0 && <span className="text-xs text-gray-600">{c.word_count} words</span>}
                </div>
                <p className="text-sm font-semibold text-white truncate">{c.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{[c.industry, c.target_city, c.keyword].filter(Boolean).join(' · ')}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white h-7 w-7 p-0" onClick={() => setPreview(c)}><Eye className="w-3.5 h-3.5" /></Button>
                {c.status === 'draft' && (
                  <Button size="sm" variant="ghost" className="text-yellow-500 hover:text-yellow-400 h-7 px-2 text-xs" onClick={() => updateStatus(c.id, 'review')} disabled={updating === c.id}>Review</Button>
                )}
                {c.status === 'review' && <>
                  <Button size="sm" variant="ghost" className="text-green-500 hover:text-green-400 h-7 w-7 p-0" onClick={() => updateStatus(c.id, 'approved')} disabled={updating === c.id}><ThumbsUp className="w-3.5 h-3.5" /></Button>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400 h-7 w-7 p-0" onClick={() => updateStatus(c.id, 'rejected')} disabled={updating === c.id}><ThumbsDown className="w-3.5 h-3.5" /></Button>
                </>}
                {c.status === 'approved' && (
                  <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 h-7 px-2 text-xs" onClick={() => updateStatus(c.id, 'published')} disabled={updating === c.id}><CheckCircle className="w-3 h-3 mr-1" />Publish</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview dialog */}
      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">{preview?.title}</DialogTitle>
            <div className="flex gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLORS[preview?.content_type] || ''}`}>{preview?.content_type?.replace('_', ' ')}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[preview?.status] || ''}`}>{preview?.status}</span>
            </div>
          </DialogHeader>
          <div className="mt-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">{preview?.content_text}</pre>
          </div>
          {preview && preview.status !== 'approved' && preview.status !== 'published' && (
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
              <Button className="bg-green-700 hover:bg-green-600" onClick={() => updateStatus(preview.id, 'approved')}>Approve</Button>
              <Button variant="outline" className="border-gray-700 text-gray-300" onClick={() => updateStatus(preview.id, 'rejected')}>Reject</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}