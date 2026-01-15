import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar, Image, Video, FileText, CheckCircle, Clock, XCircle, Sparkles } from 'lucide-react';

export default function ContentSubmissionsView() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const user = await base44.auth.me();
      const data = await base44.entities.ContentSubmission.filter({ created_by: user.email });
      setSubmissions(data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeResponse = async (submissionId, approve) => {
    try {
      await base44.entities.ContentSubmission.update(submissionId, {
        upgrade_status: approve ? 'approved' : 'declined'
      });
      toast.success(approve ? 'Upgrade approved!' : 'Upgrade declined');
      loadSubmissions();
    } catch (error) {
      toast.error('Failed to update upgrade status');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
      posted: { label: 'Posted', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' }
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  const getTypeIcon = (type) => {
    const icons = {
      image_post: Image,
      video_post: Video,
      text_only: FileText
    };
    const Icon = icons[type] || FileText;
    return <Icon className="w-5 h-5 text-slate-500" />;
  };

  if (loading) {
    return <div className="text-center py-8">Loading submissions...</div>;
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Submissions Yet</h3>
        <p className="text-slate-600">Your submitted content will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Your Content Submissions</h2>
      {submissions.map((submission) => (
        <Card key={submission.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getTypeIcon(submission.submission_type)}
                <div>
                  <CardTitle className="text-base">
                    {submission.submission_type.replace('_', ' ').toUpperCase()}
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(submission.created_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {getStatusBadge(submission.status)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 mb-3 line-clamp-2">{submission.post_text}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {submission.social_channels?.map((channel) => (
                <Badge key={channel} variant="outline" className="text-xs">
                  {channel}
                </Badge>
              ))}
            </div>

            {/* ADMIN UPGRADE RECOMMENDATION */}
            {submission.upgrade_status === 'admin_recommended' && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-900 mb-1">Upgrade Recommended</h4>
                    <p className="text-sm text-purple-800 mb-3">{submission.admin_upgrade_reason}</p>
                    {submission.upgrade_price && (
                      <p className="text-sm font-semibold text-purple-900 mb-3">
                        One-time cost: ${submission.upgrade_price}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpgradeResponse(submission.id, true)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve Upgrade
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpgradeResponse(submission.id, false)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        No Thanks
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* UPGRADE STATUS INDICATORS */}
            {submission.upgrade_status === 'client_requested' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-blue-800">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Upgrade requested - awaiting team response
                </p>
              </div>
            )}
            {submission.upgrade_status === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-green-800">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Upgrade approved - in progress
                </p>
              </div>
            )}
            {submission.upgrade_status === 'completed' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-green-800">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Upgrade completed
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}