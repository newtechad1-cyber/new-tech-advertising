import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Copy, Check, Loader2, ExternalLink, CheckCircle2, Instagram, Facebook, Linkedin, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const PLATFORM_ICONS = { facebook: Facebook, instagram: Instagram, linkedin: Linkedin };
const PLATFORM_COLORS = {
  facebook: 'bg-blue-900 text-blue-300',
  instagram: 'bg-pink-900 text-pink-300',
  linkedin: 'bg-sky-900 text-sky-300',
};

function CopyBtn({ text, label }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={handle} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-md px-2.5 py-1 transition-colors hover:bg-slate-700">
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
      {label}
    </button>
  );
}

export default function PostNowDrawer({ scheduledPostId, onClose, onPosted }) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [stepsOpen, setStepsOpen] = useState(true);

  useEffect(() => {
    if (!scheduledPostId) return;
    setLoading(true);
    base44.functions.invoke('getPostNowPayload', { scheduledPostId }).then(res => {
      if (res.data?.success) setPayload(res.data);
      else toast.error(res.data?.error || 'Failed to load');
      setLoading(false);
    });
  }, [scheduledPostId]);

  const markPosted = async () => {
    setMarking(true);
    const res = await base44.functions.invoke('markScheduledPosted', { scheduledPostId });
    setMarking(false);
    if (res.data?.success) {
      toast.success('Marked as posted!');
      onPosted && onPosted();
      onClose();
    } else {
      toast.error(res.data?.error || 'Failed');
    }
  };

  const PlatIcon = payload ? (PLATFORM_ICONS[payload.draft.platform] || FileText) : FileText;

  return (
    <Dialog open={!!scheduledPostId} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlatIcon className="w-4 h-4" />
            Post Now Assistant
            {payload && (
              <Badge className={`${PLATFORM_COLORS[payload.draft.platform]} border-0 text-xs ml-1`}>
                {payload.draft.platform}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        )}

        {!loading && payload && (
          <div className="space-y-4 pt-1">
            {/* Hook */}
            <div className="bg-slate-800 rounded-lg p-3">
              <p className="text-slate-500 text-xs mb-1 uppercase tracking-wide">Hook</p>
              <p className="text-white text-sm font-medium">{payload.draft.hook}</p>
              {payload.draft.cta && (
                <p className="text-slate-400 text-xs mt-1">CTA: {payload.draft.cta}</p>
              )}
            </div>

            {/* Media */}
            {payload.draft.media_url && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400 text-xs uppercase tracking-wide">Media</label>
                  <div className="flex gap-2">
                    <CopyBtn text={payload.draft.media_url} label="Copy URL" />
                    <a href={payload.draft.media_url} target="_blank" rel="noopener noreferrer">
                      <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-md px-2.5 py-1 transition-colors hover:bg-slate-700">
                        <ExternalLink className="w-3 h-3" />Open
                      </button>
                    </a>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden border border-slate-700">
                  <img src={payload.draft.media_url} alt="Post media" className="w-full object-cover max-h-48"
                    onError={e => { e.target.style.display='none'; }} />
                </div>
              </div>
            )}

            {/* Full Post */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 text-xs uppercase tracking-wide">Full Post</label>
                <div className="flex gap-2">
                  <CopyBtn text={payload.draft.caption} label="Caption" />
                  <CopyBtn text={payload.draft.hashtag_string} label="Hashtags" />
                  <CopyBtn text={payload.draft.full_post_text} label="Full Post" />
                </div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white whitespace-pre-wrap max-h-48 overflow-y-auto">
                {payload.draft.full_post_text}
              </div>
            </div>

            {/* Posting Steps */}
            {payload.posting_steps?.length > 0 && (
              <div className="border border-slate-700 rounded-xl overflow-hidden">
                <button
                  className="w-full bg-slate-800/80 px-4 py-2.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-white"
                  onClick={() => setStepsOpen(s => !s)}
                >
                  <span>Posting Steps</span>
                  {stepsOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                {stepsOpen && (
                  <ol className="p-4 space-y-2">
                    {payload.posting_steps.map((step, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-slate-300">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-900 text-violet-300 text-xs flex items-center justify-center font-bold">{i+1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}

            {/* Mark as Posted */}
            <div className="pt-2 flex gap-3">
              <Button
                onClick={markPosted}
                disabled={marking}
                className="bg-green-700 hover:bg-green-600 flex-1"
              >
                {marking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                Mark as Posted
              </Button>
              <Button variant="ghost" onClick={onClose} className="text-slate-400">Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}