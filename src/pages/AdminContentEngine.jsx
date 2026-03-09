import React, { useState } from 'react';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Zap, FileText, Video, Film, BarChart2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import TopicsQueue from '@/components/content-engine/auto/TopicsQueue.jsx';
import GeneratedLibrary from '@/components/content-engine/auto/GeneratedLibrary.jsx';
import VideoScriptsList from '@/components/content-engine/auto/VideoScriptsList.jsx';
import VideoAssetsList from '@/components/content-engine/auto/VideoAssetsList.jsx';

function KPICard({ label, value, color = 'text-white', border = 'border-gray-700' }) {
  return (
    <div className={`bg-gray-900 rounded-xl border ${border} p-4 text-center`}>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

export default function AdminContentEngine() {
  const [bulkRunning, setBulkRunning] = useState(false);

  const { data: topics = [] } = useQuery({ queryKey: ['topics-queue'], queryFn: () => base44.entities.ContentTopics.list('-created_date', 200) });
  const { data: generated = [] } = useQuery({ queryKey: ['generated-content', 'all'], queryFn: () => base44.entities.GeneratedContent.list('-created_date', 200) });
  const { data: scripts = [] } = useQuery({ queryKey: ['video-scripts'], queryFn: () => base44.entities.VideoScripts.list('-created_date', 100) });
  const { data: assets = [] } = useQuery({ queryKey: ['content-video-assets'], queryFn: () => base44.entities.ContentVideoAssets.list('-created_date', 100) });

  const pendingTopics = topics.filter(t => t.status === 'pending');
  const approvedContent = generated.filter(c => c.status === 'approved');
  const publishedContent = generated.filter(c => c.status === 'published');
  const pendingScripts = scripts.filter(s => s.status === 'draft' || s.status === 'review');
  const liveVideos = assets.filter(a => a.status === 'published');

  const runBulkGeneration = async () => {
    if (pendingTopics.length === 0) return toast.info('No pending topics to generate');
    setBulkRunning(true);
    let success = 0, failed = 0;
    for (const topic of pendingTopics.slice(0, 5)) {
      try {
        const res = await base44.functions.invoke('generateContentFromTopic', { topic_id: topic.id });
        if (res.data?.success) success++; else failed++;
      } catch { failed++; }
    }
    toast.success(`Bulk generation complete: ${success} succeeded, ${failed} failed`);
    setBulkRunning(false);
  };

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-gray-950 text-white">
          {/* Header */}
          <div className="border-b border-gray-800 bg-gray-900 sticky top-0 z-20">
            <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-900/50 border border-violet-800 rounded-lg">
                  <Zap className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Content & Video Automation Engine</h1>
                  <p className="text-xs text-gray-500">Blog · Landing Pages · Video Scripts · Social Series · Email Sequences</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-violet-700 hover:bg-violet-600 text-white"
                  onClick={runBulkGeneration}
                  disabled={bulkRunning || pendingTopics.length === 0}
                >
                  {bulkRunning
                    ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Generating...</>
                    : <><Zap className="w-3.5 h-3.5 mr-1.5" /> Generate All Pending ({pendingTopics.length})</>
                  }
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-screen-2xl mx-auto px-6 py-5">
            {/* KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              <KPICard label="Topics in Queue" value={topics.length} color="text-gray-300" />
              <KPICard label="Pending Generation" value={pendingTopics.length} color={pendingTopics.length > 0 ? 'text-yellow-400' : 'text-gray-500'} border={pendingTopics.length > 0 ? 'border-yellow-900' : 'border-gray-700'} />
              <KPICard label="Content Approved" value={approvedContent.length} color="text-green-400" border="border-green-900" />
              <KPICard label="Scripts Pending Review" value={pendingScripts.length} color={pendingScripts.length > 0 ? 'text-orange-400' : 'text-gray-500'} />
              <KPICard label="Videos Live" value={liveVideos.length} color="text-violet-400" border="border-violet-900" />
            </div>

            {/* Content stats row */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6 text-center">
              {[
                { label: 'Blog Posts', count: generated.filter(c => c.content_type === 'blog').length, color: 'text-blue-400' },
                { label: 'Landing Pages', count: generated.filter(c => c.content_type === 'landing_page').length, color: 'text-purple-400' },
                { label: 'Video Scripts', count: scripts.length, color: 'text-orange-400' },
                { label: 'Social Series', count: generated.filter(c => c.content_type === 'social_series').length, color: 'text-pink-400' },
                { label: 'Email Sequences', count: generated.filter(c => c.content_type === 'email_sequence').length, color: 'text-cyan-400' },
                { label: 'Published Total', count: publishedContent.length, color: 'text-green-400' },
              ].map(stat => (
                <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-lg py-2.5 px-3">
                  <div className={`text-lg font-bold ${stat.color}`}>{stat.count}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="topics">
              <TabsList className="bg-gray-900 border border-gray-800 mb-5 flex-wrap h-auto gap-1 p-1">
                <TabsTrigger value="topics" className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Topics Queue
                  {pendingTopics.length > 0 && <span className="bg-yellow-600 text-white text-xs rounded-full px-1.5 ml-0.5">{pendingTopics.length}</span>}
                </TabsTrigger>
                <TabsTrigger value="content" className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Generated Content
                  {approvedContent.length > 0 && <span className="bg-green-700 text-white text-xs rounded-full px-1.5 ml-0.5">{approvedContent.length}</span>}
                </TabsTrigger>
                <TabsTrigger value="scripts" className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white gap-1.5">
                  <Video className="w-3.5 h-3.5" /> Video Scripts
                  {pendingScripts.length > 0 && <span className="bg-orange-700 text-white text-xs rounded-full px-1.5 ml-0.5">{pendingScripts.length}</span>}
                </TabsTrigger>
                <TabsTrigger value="videos" className="data-[state=active]:bg-gray-700 text-gray-400 data-[state=active]:text-white gap-1.5">
                  <Film className="w-3.5 h-3.5" /> Video Assets
                </TabsTrigger>
              </TabsList>

              <TabsContent value="topics">
                <TopicsQueue />
              </TabsContent>
              <TabsContent value="content">
                <GeneratedLibrary />
              </TabsContent>
              <TabsContent value="scripts">
                <VideoScriptsList />
              </TabsContent>
              <TabsContent value="videos">
                <VideoAssetsList />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}