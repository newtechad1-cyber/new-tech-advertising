import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, RefreshCw, CalendarClock, Instagram, Facebook, Linkedin, FileText, ChevronLeft, ChevronRight, ArrowLeft, Zap, ImagePlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PostNowDrawer from '@/components/content/PostNowDrawer';

const PAGE_SIZE = 25;

const PLATFORM_CONFIG = {
  facebook:  { label: 'Facebook',  color: 'bg-blue-900 text-blue-300',  icon: Facebook },
  instagram: { label: 'Instagram', color: 'bg-pink-900 text-pink-300',  icon: Instagram },
  linkedin:  { label: 'LinkedIn',  color: 'bg-sky-900 text-sky-300',    icon: Linkedin },
};

const STATUS_COLORS = {
  scheduled:       'bg-yellow-900 text-yellow-300',
  manual_required: 'bg-orange-900 text-orange-300',
  publishing:      'bg-blue-900 text-blue-300',
  published:       'bg-green-900 text-green-300',
  failed:          'bg-red-900 text-red-300',
  canceled:        'bg-zinc-800 text-zinc-400',
};

const STATUS_LABELS = {
  scheduled:       'Scheduled',
  manual_required: 'Needs Posting',
  publishing:      'Publishing…',
  published:       'Published',
  failed:          'Failed',
  canceled:        'Canceled',
};

function getTabFilter(tab) {
  const now = new Date();
  if (tab === 'today') {
    const start = new Date(now); start.setHours(0,0,0,0);
    const end   = new Date(now); end.setHours(23,59,59,999);
    return p => p.scheduled_for >= start.toISOString() && p.scheduled_for <= end.toISOString();
  }
  if (tab === 'week') {
    const start = new Date(now); start.setHours(0,0,0,0);
    const end   = new Date(now); end.setDate(end.getDate() + 7); end.setHours(23,59,59,999);
    return p => p.scheduled_for >= start.toISOString() && p.scheduled_for <= end.toISOString();
  }
  return () => true;
}

export default function ScheduledQueue() {
  const [posts, setPosts] = useState([]);
  const [draftsMap, setDraftsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('today');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [postNowId, setPostNowId] = useState(null);
  const [acting, setActing] = useState({});

  const accountId = new URLSearchParams(window.location.search).get('account_id');

  const load = async () => {
    setLoading(true);
    // Refresh due posts first
    await base44.functions.invoke('refreshDueScheduledPosts', { accountId: accountId || undefined });

    const query = accountId ? { account_id: accountId } : {};
    const data = await base44.entities.ScheduledPost.filter(query, '-scheduled_for', 500);
    setPosts(data);

    // Fetch drafts for hooks/info
    const draftIds = [...new Set(data.map(p => p.draft_id).filter(Boolean))];
    if (draftIds.length > 0) {
      const allDrafts = await base44.entities.ContentDraft.filter({});
      const map = {};
      allDrafts.forEach(d => { map[d.id] = d; });
      setDraftsMap(map);
    }

    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const tabFilter = getTabFilter(tab);

  const filtered = posts.filter(p => {
    if (!tabFilter(p)) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (platformFilter !== 'all' && p.platform !== platformFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleCancel = async (postId) => {
    setActing(a => ({...a, [postId]: true}));
    const res = await base44.functions.invoke('scheduleDraft', {
      draftId: posts.find(p => p.id === postId)?.draft_id,
      platform: posts.find(p => p.id === postId)?.platform,
      action: 'cancel',
    });
    setActing(a => ({...a, [postId]: false}));
    if (res.data?.success) { toast.success('Canceled'); load(); }
    else toast.error(res.data?.error || 'Failed');
  };

  const TAB_LABELS = { today: 'Today', week: 'This Week', all: 'All' };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link to={createPageUrl('ContentDrafts')}>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />Drafts
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-yellow-400" />
              Scheduled Queue
            </h1>
            <p className="text-slate-400 text-sm">
              {posts.length} total · {filtered.length} shown
              {accountId && <span className="ml-2 text-violet-400">Account: {accountId.slice(0,12)}…</span>}
            </p>
          </div>
          <div className="ml-auto">
            <Button size="sm" onClick={load} variant="outline" className="border-slate-700 text-slate-300 h-8 text-xs">
              <RefreshCw className="w-3 h-3 mr-1.5" />Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">
        {/* Tabs */}
        <div className="flex gap-1 bg-slate-800 rounded-lg p-1 w-fit">
          {['today','week','all'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setPage(0); }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="manual_required">Needs Posting</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={platformFilter} onValueChange={v => { setPlatformFilter(v); setPage(0); }}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs w-36">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading && <div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <CalendarClock className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg">No scheduled posts found</p>
            <p className="text-sm mt-1">Schedule a draft from the Content Drafts page.</p>
          </div>
        )}

        {/* Rows */}
        <div className="space-y-3">
          {paginated.map(post => {
            const pc = PLATFORM_CONFIG[post.platform] || {};
            const PlatIcon = pc.icon || FileText;
            const draft = draftsMap[post.draft_id];
            const isActing = acting[post.id];
            const canPost = post.status === 'manual_required' || post.status === 'scheduled';
            const canCancel = post.status === 'scheduled' || post.status === 'manual_required';

            return (
              <div key={post.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge className={`${pc.color || 'bg-slate-700 text-slate-300'} border-0 text-xs flex items-center gap-1`}>
                        <PlatIcon className="w-3 h-3" />{pc.label || post.platform}
                      </Badge>
                      <Badge className={`${STATUS_COLORS[post.status] || 'bg-slate-700 text-slate-300'} border-0 text-xs`}>
                        {STATUS_LABELS[post.status] || post.status}
                      </Badge>
                      <Badge className="bg-slate-700 text-slate-400 border-0 text-xs">
                        {post.publish_mode === 'auto' ? 'Auto' : 'Manual'}
                      </Badge>
                      {draft?.media_url && (
                        <Badge className="bg-emerald-900 text-emerald-300 border-0 text-xs flex items-center gap-1">
                          <ImagePlus className="w-2.5 h-2.5" />Media
                        </Badge>
                      )}
                    </div>
                    {draft && <p className="text-white text-sm font-medium">{draft.hook}</p>}
                    <p className="text-slate-500 text-xs mt-1">
                      {post.scheduled_for ? new Date(post.scheduled_for).toLocaleString() : '—'}
                      {post.posted_at && <span className="ml-3 text-green-500">Posted: {new Date(post.posted_at).toLocaleString()}</span>}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                    {canPost && (
                      <Button
                        size="sm"
                        onClick={() => setPostNowId(post.id)}
                        className="bg-orange-700 hover:bg-orange-600 h-8 text-xs"
                      >
                        <Zap className="w-3 h-3 mr-1.5" />Post Now
                      </Button>
                    )}
                    {canCancel && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isActing}
                        onClick={() => handleCancel(post.id)}
                        className="border-slate-600 text-slate-400 hover:text-red-400 hover:border-red-800 h-8 text-xs"
                      >
                        {isActing ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3 mr-1" />}
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(p => p-1)} className="border-slate-700 text-slate-300 h-7 text-xs">
              <ChevronLeft className="w-3 h-3" />Prev
            </Button>
            <span className="text-slate-500 text-xs">{page+1} / {totalPages}</span>
            <Button size="sm" variant="outline" disabled={page >= totalPages-1} onClick={() => setPage(p => p+1)} className="border-slate-700 text-slate-300 h-7 text-xs">
              Next<ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      <PostNowDrawer
        scheduledPostId={postNowId}
        onClose={() => setPostNowId(null)}
        onPosted={load}
      />
    </div>
  );
}