import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import ClientGuard from '@/components/auth/ClientGuard';
import ApprovalHeader from '@/components/client-approvals/ApprovalHeader.jsx';
import ApprovalMetricsCards from '@/components/client-approvals/ApprovalMetricsCards.jsx';
import ApprovalFeed from '@/components/client-approvals/ApprovalFeed.jsx';
import ScheduledContentPanel from '@/components/client-approvals/ScheduledContentPanel.jsx';
import RecentlyPublishedPanel from '@/components/client-approvals/RecentlyPublishedPanel.jsx';
import ReviewDetailModal from '@/components/client-approvals/ReviewDetailModal.jsx';
import ApprovalConfirmation from '@/components/client-approvals/ApprovalConfirmation.jsx';
import ChangeRequestModal from '@/components/client-approvals/ChangeRequestModal.jsx';
import ClientNav from '@/components/nav/ClientNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ClientApprovals() {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [pendingVideos, setPendingVideos] = useState([]);
  const [scheduledVideos, setScheduledVideos] = useState([]);
  const [publishedVideos, setPublishedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const authenticatedUser = await base44.auth.me();
        setUser(authenticatedUser);

        // Load company data
        if (authenticatedUser?.company_id) {
          const companies = await base44.entities.ClientCompanies.filter({ 
            id: authenticatedUser.company_id 
          });
          setCompany(companies[0] || null);

          const normalizeItem = (item, type) => {
            if (type === 'VideoRequests') return { ...item, _type: type };
            if (type === 'SocialPostQueue') {
              return {
                ...item,
                _type: type,
                title: 'Social Media Post',
                goal: item.post_text || item.caption,
                approval_status: item.publish_status === 'pending' ? 'Pending' : item.publish_status === 'approved' ? 'Approved' : item.publish_status,
                thumbnail_url: item.media_url,
                scheduled_publish_at: item.scheduled_time || item.scheduled_for,
                facebook_publish_enabled: item.platform === 'facebook',
                instagram_publish_enabled: item.platform === 'instagram',
                youtube_publish_enabled: item.platform === 'youtube',
              };
            }
            if (type === 'NTAContentAsset') {
              return {
                ...item,
                _type: type,
                title: item.title || item.asset_name,
                goal: item.description || item.content_text,
                approval_status: item.approval_status || item.publish_status,
                thumbnail_url: item.file_url || item.thumbnail_url,
                website_publish_enabled: item.platform_target === 'website',
              };
            }
            return item;
          };

          // Load items needing approval
          const [pendingVids, pendingAssets, pendingPosts] = await Promise.all([
            base44.entities.VideoRequests.filter({ client_id: authenticatedUser.company_id, approval_status: 'Pending' }),
            base44.entities.NTAContentAsset.filter({ client_id: authenticatedUser.company_id, approval_status: 'Pending' }),
            base44.entities.SocialPostQueue.filter({ client_id: authenticatedUser.company_id, publish_status: 'pending' })
          ]);
          setPendingVideos([...pendingVids.map(v => normalizeItem(v, 'VideoRequests')), ...pendingAssets.map(a => normalizeItem(a, 'NTAContentAsset')), ...pendingPosts.map(p => normalizeItem(p, 'SocialPostQueue'))]);

          // Load scheduled items
          const [schedVids, schedAssets, schedPosts] = await Promise.all([
            base44.entities.VideoRequests.filter({ client_id: authenticatedUser.company_id, approval_status: 'Approved' }),
            base44.entities.NTAContentAsset.filter({ client_id: authenticatedUser.company_id, approval_status: 'Approved' }),
            base44.entities.SocialPostQueue.filter({ client_id: authenticatedUser.company_id, approval_status: 'Approved' })
          ]);
          setScheduledVideos([...schedVids.map(v => normalizeItem(v, 'VideoRequests')), ...schedAssets.map(a => normalizeItem(a, 'NTAContentAsset')), ...schedPosts.map(p => normalizeItem(p, 'SocialPostQueue'))]);

          // Load recently published
          const [pubVids, pubAssets, pubPosts] = await Promise.all([
            base44.entities.VideoRequests.filter({ client_id: authenticatedUser.company_id, status: 'published' }, '-approved_at', 5),
            base44.entities.NTAContentAsset.filter({ client_id: authenticatedUser.company_id, publish_status: 'published' }, '-updated_date', 5),
            base44.entities.SocialPostQueue.filter({ client_id: authenticatedUser.company_id, publish_status: 'published' }, '-updated_date', 5)
          ]);
          setPublishedVideos([...pubVids.map(v => normalizeItem(v, 'VideoRequests')), ...pubAssets.map(a => normalizeItem(a, 'NTAContentAsset')), ...pubPosts.map(p => normalizeItem(p, 'SocialPostQueue'))].slice(0, 10));
        }
      } catch (error) {
        console.error('Failed to load approval data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleApprove = async (video) => {
    try {
      const updateData = {
        approval_status: 'Approved',
        approved_by: user?.email,
        approved_at: new Date().toISOString()
      };

      if (video._type === 'SocialPostQueue') {
        await base44.entities.SocialPostQueue.update(video.id, updateData);
      } else if (video._type === 'NTAContentAsset') {
        await base44.entities.NTAContentAsset.update(video.id, updateData);
      } else {
        await base44.entities.VideoRequests.update(video.id, updateData);
      }
      setPendingVideos(pendingVideos.filter(v => v.id !== video.id));
      setShowDetailModal(false);
      setConfirmationMessage('approved');
      setTimeout(() => setConfirmationMessage(null), 4000);
    } catch (error) {
      console.error('Failed to approve video:', error);
    }
  };

  const handleApproveAll = async () => {
    try {
      for (const video of pendingVideos) {
        await base44.entities.VideoRequests.update(video.id, {
          approval_status: 'Approved',
          approved_by: user?.email,
          approved_at: new Date().toISOString()
        });
      }
      setPendingVideos([]);
      setConfirmationMessage('approved');
      setTimeout(() => setConfirmationMessage(null), 4000);
    } catch (error) {
      console.error('Failed to approve all videos:', error);
    }
  };

  const handleRequestChanges = async (video, feedback) => {
    try {
      const updateData = {
        approval_status: 'Changes Requested',
        human_review_notes: feedback
      };

      if (video._type === 'SocialPostQueue') {
        await base44.entities.SocialPostQueue.update(video.id, updateData);
      } else if (video._type === 'NTAContentAsset') {
        await base44.entities.NTAContentAsset.update(video.id, updateData);
      } else {
        await base44.entities.VideoRequests.update(video.id, updateData);
      }
      setPendingVideos(pendingVideos.filter(v => v.id !== video.id));
      setShowChangeModal(false);
      setShowDetailModal(false);
      setConfirmationMessage('changes_requested');
      setTimeout(() => setConfirmationMessage(null), 4000);
    } catch (error) {
      console.error('Failed to request changes:', error);
    }
  };

  if (loading) {
    return (
      <ClientGuard>
        <div className="flex h-screen items-center justify-center bg-slate-50">
          <p className="text-slate-600">Loading your approvals...</p>
        </div>
      </ClientGuard>
    );
  }

  return (
    <ClientGuard>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <ClientNav />
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100">
          {/* Header */}
          <ApprovalHeader company={company} user={user} />

          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-12">
            {/* Metrics */}
            <ApprovalMetricsCards
              awaitingCount={pendingVideos.length}
              scheduledCount={scheduledVideos.length}
              publishedCount={publishedVideos.length}
            />

            {/* Confirmation Messages */}
            {confirmationMessage && (
              <ApprovalConfirmation 
                type={confirmationMessage}
                onViewNext={() => {
                  const next = pendingVideos[0];
                  if (next) {
                    setSelectedVideo(next);
                    setShowDetailModal(true);
                  }
                }}
              />
            )}

            <Tabs defaultValue="pending" className="mt-8">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="pending">Pending Approval</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="published">Recently Published</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="mt-6">
                <ApprovalFeed
                  videos={pendingVideos}
                  onViewDetails={(video) => {
                    setSelectedVideo(video);
                    setShowDetailModal(true);
                  }}
                  onApprove={handleApprove}
                  onRejectSwipe={(video) => {
                    setSelectedVideo(video);
                    setShowChangeModal(true);
                  }}
                  onApproveAll={handleApproveAll}
                />
              </TabsContent>
              
              <TabsContent value="scheduled" className="mt-6">
                <ScheduledContentPanel videos={scheduledVideos} />
              </TabsContent>
              
              <TabsContent value="published" className="mt-6">
                <RecentlyPublishedPanel videos={publishedVideos} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Modals */}
        {selectedVideo && (
          <>
            <ReviewDetailModal
              isOpen={showDetailModal}
              video={selectedVideo}
              onApprove={() => handleApprove(selectedVideo)}
              onRequestChanges={() => setShowChangeModal(true)}
              onClose={() => {
                setShowDetailModal(false);
                setSelectedVideo(null);
              }}
            />

            <ChangeRequestModal
              isOpen={showChangeModal}
              video={selectedVideo}
              onSubmit={(feedback) => handleRequestChanges(selectedVideo, feedback)}
              onClose={() => setShowChangeModal(false)}
            />
          </>
          )}

          {/* Brand Footer */}
          <footer className="border-t bg-white mt-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-slate-600">
             <p>Your content is prepared and scheduled by <span className="font-semibold text-slate-900">New Tech Advertising</span>.</p>
            </div>
          </footer>
        </div>
      </div>
    </ClientGuard>
  );
}