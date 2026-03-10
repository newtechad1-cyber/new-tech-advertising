import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Eye, Trash2, Loader2 } from 'lucide-react';

/**
 * ADMIN COMPONENT: Student Upload Moderation Queue
 * 
 * Shows flagged uploads (explicit content detected)
 * Allows admin to approve, reject, or manually review
 * Maintains student accountability and audit trail
 */
export default function AdminStudentUploadModeration({ schoolSlug }) {
  const [flaggedUploads, setFlaggedUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [selectedUpload, setSelectedUpload] = useState(null);

  useEffect(() => {
    const loadFlaggedUploads = async () => {
      try {
        setLoading(true);
        // Fetch uploads flagged as explicit content
        const uploads = await base44.asServiceRole.entities.StudentUploads.filter({
          school_slug: schoolSlug,
          moderation_status: 'flagged',
        });
        setFlaggedUploads(uploads || []);
      } catch (err) {
        console.error('Failed to load flagged uploads:', err);
      } finally {
        setLoading(false);
      }
    };

    if (schoolSlug) {
      loadFlaggedUploads();
    }
  }, [schoolSlug]);

  const handleApproveUpload = async (uploadId) => {
    try {
      setProcessing(uploadId);
      // Admin manually approved — change status to allow potential publishing
      await base44.asServiceRole.entities.StudentUploads.update(uploadId, {
        moderation_status: 'safe',
        status: 'under_review', // Move to normal review queue
      });
      // Remove from flagged list
      setFlaggedUploads(prev => prev.filter(u => u.id !== uploadId));
    } catch (err) {
      console.error('Approval failed:', err);
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectUpload = async (uploadId, reason) => {
    try {
      setProcessing(uploadId);
      await base44.asServiceRole.entities.StudentUploads.update(uploadId, {
        status: 'rejected',
        moderation_status: 'flagged', // Keep flagged status
        admin_notes: reason || 'Rejected by admin moderation',
      });
      setFlaggedUploads(prev => prev.filter(u => u.id !== uploadId));
    } catch (err) {
      console.error('Rejection failed:', err);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Explicit Content Moderation Queue
          </CardTitle>
          <CardDescription>
            {flaggedUploads.length} uploads flagged for explicit/nudity content
          </CardDescription>
        </CardHeader>

        {flaggedUploads.length === 0 ? (
          <CardContent>
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-700 font-semibold">All uploads safe</p>
              <p className="text-sm text-gray-500">No explicit content detected</p>
            </div>
          </CardContent>
        ) : (
          <CardContent className="space-y-4">
            {flaggedUploads.map((upload) => (
              <div
                key={upload.id}
                className="border border-red-200 bg-red-50 rounded-lg p-4"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Student Info */}
                    <p className="text-xs text-red-700 font-semibold mb-1">
                      STUDENT: {upload.student_name}
                    </p>

                    {/* Upload Title */}
                    <h4 className="font-semibold text-gray-900 mb-1">{upload.title}</h4>

                    {/* Moderation Notes */}
                    <p className="text-sm text-red-800 mb-3 font-mono bg-white rounded px-2 py-1">
                      {upload.moderation_notes || 'Explicit content detected.'}
                    </p>

                    {/* Upload Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mb-3">
                      <div>
                        <span className="text-gray-500">Type:</span> {upload.upload_type}
                      </div>
                      <div>
                        <span className="text-gray-500">Category:</span> {upload.category}
                      </div>
                      <div>
                        <span className="text-gray-500">Size:</span> {upload.file_size_total_mb?.toFixed(1)}MB
                      </div>
                      <div>
                        <span className="text-gray-500">Date:</span>{' '}
                        {new Date(upload.created_date).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Description */}
                    {upload.description && (
                      <div className="bg-white rounded px-2 py-1 text-xs text-gray-700 mb-3">
                        <p className="text-gray-500 font-semibold mb-1">Description:</p>
                        <p>{upload.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUpload(upload)}
                      className="gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleApproveUpload(upload.id)}
                      disabled={processing === upload.id}
                      className="text-green-600 hover:bg-green-50"
                    >
                      {processing === upload.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRejectUpload(upload.id, 'Confirmed explicit content')}
                      disabled={processing === upload.id}
                      className="text-red-600 hover:bg-red-50"
                    >
                      {processing === upload.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* File Viewer Modal (Optional) */}
      {selectedUpload && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedUpload(null)}
        >
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
            <CardHeader>
              <button
                onClick={() => setSelectedUpload(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <CardTitle>{selectedUpload.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedUpload.file_urls && (
                <div className="space-y-4">
                  {JSON.parse(selectedUpload.file_urls).map((url, idx) => {
                    const isImage = url.match(/\.(jpg|jpeg|png|gif)$/i);
                    const isVideo = url.match(/\.(mp4|mov|webm)$/i);

                    return (
                      <div key={idx} className="border rounded-lg p-4">
                        {isImage && (
                          <img
                            src={url}
                            alt="Upload"
                            className="max-w-full h-auto rounded"
                          />
                        )}
                        {isVideo && (
                          <video
                            src={url}
                            controls
                            className="max-w-full rounded"
                          />
                        )}
                        {!isImage && !isVideo && (
                          <p className="text-gray-500 text-sm">
                            File: {url}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}