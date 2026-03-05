import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Zap, CalendarClock, Loader2, Instagram, Facebook, Linkedin, ImagePlus } from 'lucide-react';
import PostNowDrawer from '@/components/content/PostNowDrawer';

const PLATFORM_CONFIG = {
  facebook:  { label: 'Facebook',  color: 'bg-blue-900 text-blue-300',  icon: Facebook },
  instagram: { label: 'Instagram', color: 'bg-pink-900 text-pink-300',  icon: Instagram },
  linkedin:  { label: 'LinkedIn',  color: 'bg-sky-900 text-sky-300',    icon: Linkedin },
};

export default function TodayPostsWidget({ accountId }) {
  const [posts, setPosts] = useState([]);
  const [draftsMap, setDraftsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [postNowId, setPostNowId] = useState(null);

  const load = async () => {
    setLoading(true);
    // Trigger due check first
    await base44.functions.invoke('refreshDueScheduledPosts', { accountId: accountId || undefined });

    const query = { status: 'manual_required' };
    if (accountId) query.account_id = accountId;

    const data = await base44.entities.ScheduledPost.filter(query, 'scheduled_for', 5);
    setPosts(data);

    if (data.length > 0) {
      const allDrafts = await base44.entities.ContentDraft.filter(accountId ? { account_id: accountId } : {});
      const map = {};
      allDrafts.forEach(d => { map[d.id] = d; });
      setDraftsMap(map);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [accountId]);

  if (loading) return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center gap-2 text-slate-500 text-sm">
      <Loader2 className="w-4 h-4 animate-spin" /> Checking scheduled posts…
    </div>
  );

  if (posts.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-orange-800 rounded-xl overflow-hidden">
      {/* Banner */}
      <div className="bg-orange-900/60 border-b border-orange-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-400" />
          <span className="text-orange-200 font-semibold text-sm">
            ⚡ You have {posts.length} post{posts.length !== 1 ? 's' : ''} ready to publish
          </span>
        </div>
        <Link to={createPageUrl('ScheduledQueue') + (accountId ? `?account_id=${accountId}` : '')}>
          <Button size="sm" variant="outline" className="border-orange-700 text-orange-300 hover:bg-orange-900 h-7 text-xs">
            <CalendarClock className="w-3 h-3 mr-1.5" />View Queue
          </Button>
        </Link>
      </div>

      {/* Post rows */}
      <div className="divide-y divide-slate-800">
        {posts.map(post => {
          const draft = draftsMap[post.draft_id];
          const pc = PLATFORM_CONFIG[post.platform] || {};
          const PlatIcon = pc.icon;
          return (
            <div key={post.id} className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <Badge className={`${pc.color} border-0 text-xs flex items-center gap-1 shrink-0`}>
                  {PlatIcon && <PlatIcon className="w-3 h-3" />}
                  {pc.label || post.platform}
                </Badge>
                <div className="min-w-0">
                  <p className="text-white text-sm truncate">{draft?.hook || 'Post ready'}</p>
                  <p className="text-slate-500 text-xs">
                    {post.scheduled_for ? new Date(post.scheduled_for).toLocaleString() : ''}
                    {draft?.media_url && (
                      <span className="ml-2 text-emerald-500 inline-flex items-center gap-0.5">
                        <ImagePlus className="w-2.5 h-2.5" /> media
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => setPostNowId(post.id)}
                className="bg-orange-700 hover:bg-orange-600 h-7 text-xs shrink-0"
              >
                <Zap className="w-3 h-3 mr-1" />Post Now
              </Button>
            </div>
          );
        })}
      </div>

      <PostNowDrawer
        scheduledPostId={postNowId}
        onClose={() => setPostNowId(null)}
        onPosted={load}
      />
    </div>
  );
}