import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import VideoLibraryHeader from '@/components/video-library/VideoLibraryHeader';
import SummaryMetricsCards from '@/components/video-library/SummaryMetricsCards';
import ViewModeToggle from '@/components/video-library/ViewModeToggle';
import FilterBar from '@/components/video-library/FilterBar';
import VideoGridView from '@/components/video-library/VideoGridView';
import VideoTableView from '@/components/video-library/VideoTableView';
import BulkActionBar from '@/components/video-library/BulkActionBar';
import EmptyStateLibrary from '@/components/video-library/EmptyStateLibrary';
import HeroActionStrip from '@/components/video-library/HeroActionStrip';
import BulkActionFeedback from '@/components/video-library/BulkActionFeedback';
import { Loader2 } from 'lucide-react';

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [publishJobs, setPublishJobs] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedVideos, setSelectedVideos] = useState(new Set());
  const [actionFeedback, setActionFeedback] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    approval: 'all',
    company: 'all',
    destination: 'all',
    renderStatus: 'all',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [v, jobs, conns] = await Promise.all([
          base44.entities.VideoRequests?.list('-created_date', 100) || [],
          base44.entities.VideoPublishJob?.list('-created_date', 100) || [],
          base44.entities.VideoDistributionConnection?.list() || [],
        ]);
        setVideos(v);
        setPublishJobs(jobs);
        setConnections(conns);
      } catch (error) {
        console.error('Error loading video library:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Apply filters
  const filteredVideos = videos.filter(video => {
    if (filters.search) {
      const term = filters.search.toLowerCase();
      if (!video.title?.toLowerCase().includes(term)) return false;
    }
    if (filters.status !== 'all' && video.processing_status !== filters.status) return false;
    if (filters.approval !== 'all' && video.approval_status !== filters.approval) return false;
    if (filters.company !== 'all' && video.brand_name !== filters.company) return false;
    if (filters.renderStatus !== 'all' && video.render_status !== filters.renderStatus) return false;
    return true;
  });

  // Calculate metrics
  const metrics = {
    total: videos.length,
    awaitingReview: videos.filter(v => v.review_status === 'pending_review').length,
    readyToPublish: videos.filter(v => v.processing_status === 'ready_for_review' && v.review_status === 'approved').length,
    scheduled: videos.filter(v => v.scheduled_publish_at).length,
    publishing: publishJobs.filter(j => j.job_status === 'publishing').length,
    published: videos.filter(v => v.processing_status === 'published').length,
    failed: publishJobs.filter(j => j.job_status === 'failed').length,
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedVideos(new Set(filteredVideos.map(v => v.id)));
    } else {
      setSelectedVideos(new Set());
    }
  };

  const handleSelectVideo = (videoId, checked) => {
    const newSelected = new Set(selectedVideos);
    if (checked) {
      newSelected.add(videoId);
    } else {
      newSelected.delete(videoId);
    }
    setSelectedVideos(newSelected);
  };

  const handleBulkAction = async (action, payload) => {
    console.log(`Bulk ${action} on ${selectedVideos.size} videos:`, payload);
    
    // Simulate action processing
    const actionLabels = {
      approve: { title: 'Videos Approved', successLabel: 'videos approved' },
      schedule: { title: 'Videos Scheduled', successLabel: 'videos scheduled' },
      retry: { title: 'Retry Jobs Queued', successLabel: 'retry jobs queued' },
    };
    
    const feedback = actionLabels[action] || { title: 'Action Completed', successLabel: 'items processed' };
    setActionFeedback({ ...feedback, success: selectedVideos.size, failed: 0 });
    
    // Clear selection after brief delay
    setTimeout(() => setSelectedVideos(new Set()), 500);
  };

  if (loading) {
    return (
      <AdminLayout currentPageName="AdminVideos">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-slate-600">Loading video library...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const hasFiltersActive = filters.search || filters.status !== 'all' || filters.approval !== 'all' || filters.company !== 'all';

  return (
    <AdminLayout currentPageName="AdminVideos">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Hero Action Strip */}
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto">
            <HeroActionStrip 
              onUpload={() => console.log('Upload')}
              onReviewNext={() => console.log('Review next')}
              onFixBlocked={() => console.log('Fix blocked')}
              onRetryFailed={() => console.log('Retry failed')}
              blockedCount={metrics.failed}
              failedCount={metrics.failed}
            />
          </div>
        </div>

        {/* Header */}
        <VideoLibraryHeader metrics={metrics} />

        {/* Summary Metrics */}
        <div className="px-4 sm:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <SummaryMetricsCards metrics={metrics} filters={filters} onFilterChange={setFilters} />
          </div>
        </div>

        {/* View Mode & Filters */}
        <div className="px-4 sm:px-6 py-4 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">
                  {selectedVideos.size > 0 && `${selectedVideos.size} selected • `}
                  Showing {filteredVideos.length} of {videos.length} videos
                </p>
              </div>
              <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
            <FilterBar filters={filters} onFilterChange={setFilters} />
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedVideos.size > 0 && (
          <div className="px-4 sm:px-6 py-4 bg-blue-50 border-b border-blue-200">
            <div className="max-w-7xl mx-auto">
              <BulkActionBar
                selectedCount={selectedVideos.size}
                onAction={handleBulkAction}
                onClearSelection={() => setSelectedVideos(new Set())}
              />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="transition-all duration-300 ease-in-out">
              {filteredVideos.length === 0 ? (
                <EmptyStateLibrary
                  hasFilters={hasFiltersActive}
                  onClearFilters={() => setFilters({
                    search: '',
                    status: 'all',
                    approval: 'all',
                    company: 'all',
                    destination: 'all',
                    renderStatus: 'all',
                  })}
                />
              ) : viewMode === 'grid' ? (
                <div className="animate-in fade-in duration-300">
                  <VideoGridView
                    videos={filteredVideos}
                    publishJobs={publishJobs}
                    selectedVideos={selectedVideos}
                    onSelectVideo={handleSelectVideo}
                    onSelectAll={handleSelectAll}
                  />
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  <VideoTableView
                    videos={filteredVideos}
                    publishJobs={publishJobs}
                    selectedVideos={selectedVideos}
                    onSelectVideo={handleSelectVideo}
                    onSelectAll={handleSelectAll}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Action Feedback */}
      <BulkActionFeedback 
        actionResult={actionFeedback}
        onClose={() => setActionFeedback(null)}
      />
    </AdminLayout>
  );
}