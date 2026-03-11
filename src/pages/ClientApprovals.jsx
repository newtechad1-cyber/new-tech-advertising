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

          // Load videos needing approval
          const pending = await base44.entities.VideoRequests.filter({
            client_id: authenticatedUser.company_id,
            approval_status: 'Pending'
          });
          setPendingVideos(pending);

          // Load scheduled videos
          const scheduled = await base44.entities.VideoRequests.filter({
            client_id: authenticatedUser.company_id,
            status: 'scheduled'
          });
          setScheduledVideos(scheduled);

          // Load recently published
          const published = await base44.entities.VideoRequests.filter({
            client_id: authenticatedUser.company_id,
            status: 'published'
          }, '-approved_at', 5);
          setPublishedVideos(published);
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
      await base44.entities.VideoRequests.update(video.id, {
        approval_status: 'Approved',
        approved_by: user?.email,
        approved_at: new Date().toISOString()
      });
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
      await base44.entities.VideoRequests.update(video.id, {
        approval_status: 'Changes Requested',
        review_notes: feedback,
        changes_requested_by: user?.email,
        changes_requested_at: new Date().toISOString()
      });
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <p className="text-slate-600">Loading your approvals...</p>
        </div>
      </ClientGuard>
    );
  }

  return (
    <ClientGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <ApprovalHeader company={company} user={user} />

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
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

          {/* Approval Feed */}
          <div className="mt-8">
            <ApprovalFeed
              videos={pendingVideos}
              onViewDetails={(video) => {
                setSelectedVideo(video);
                setShowDetailModal(true);
              }}
            />
          </div>

          {/* Scheduled & Published Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <ScheduledContentPanel videos={scheduledVideos} />
            <RecentlyPublishedPanel videos={publishedVideos} />
          </div>
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
      </div>
    </ClientGuard>
  );
}