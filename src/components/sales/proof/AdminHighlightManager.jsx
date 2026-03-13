import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Eye, EyeOff, Trash2, Edit2 } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-900',
  pending_review: 'bg-yellow-100 text-yellow-900',
  approved: 'bg-green-100 text-green-900',
  rejected: 'bg-red-100 text-red-900'
};

const VISIBILITY_ICONS = {
  internal: <Eye className="w-4 h-4" />,
  deal_room: <Eye className="w-4 h-4 text-blue-600" />,
  upgrade_panels: <Eye className="w-4 h-4 text-purple-600" />,
  all: <Eye className="w-4 h-4 text-green-600" />
};

export default function AdminHighlightManager({ organizationId }) {
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchHighlights();
  }, [organizationId]);

  const fetchHighlights = async () => {
    try {
      const data = await base44.entities.SuccessHighlight.filter(
        { organizationId },
        '-createdAt'
      );
      setHighlights(data || []);
    } catch (error) {
      console.error('Error fetching highlights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await base44.entities.SuccessHighlight.update(id, {
        approvalStatus: 'approved'
      });
      fetchHighlights();
      base44.analytics.track({
        eventName: 'admin_highlight_approved',
        properties: {}
      });
    } catch (error) {
      console.error('Error approving highlight:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await base44.entities.SuccessHighlight.update(id, {
        approvalStatus: 'rejected'
      });
      fetchHighlights();
    } catch (error) {
      console.error('Error rejecting highlight:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this highlight?')) return;
    try {
      await base44.entities.SuccessHighlight.delete(id);
      fetchHighlights();
    } catch (error) {
      console.error('Error deleting highlight:', error);
    }
  };

  const handleToggleTagged = async (id, currentValue) => {
    try {
      await base44.entities.SuccessHighlight.update(id, {
        taggedForSales: !currentValue
      });
      fetchHighlights();
    } catch (error) {
      console.error('Error updating highlight:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-slate-500">Loading...</div>;
  }

  if (!highlights || highlights.length === 0) {
    return (
      <Card className="border border-slate-200">
        <CardContent className="py-8 text-center text-slate-500">
          No success highlights yet. Create your first one!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg">Success Highlights ({highlights.length})</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 font-semibold text-slate-700">
                  Summary
                </th>
                <th className="text-left py-2 px-3 font-semibold text-slate-700">
                  Type
                </th>
                <th className="text-left py-2 px-3 font-semibold text-slate-700">
                  Status
                </th>
                <th className="text-left py-2 px-3 font-semibold text-slate-700">
                  Visibility
                </th>
                <th className="text-left py-2 px-3 font-semibold text-slate-700">
                  Sales Tagged
                </th>
                <th className="text-left py-2 px-3 font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {highlights.map((highlight) => (
                <tr
                  key={highlight.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  {/* Summary */}
                  <td className="py-3 px-3 max-w-xs">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {highlight.summaryText}
                    </p>
                    {highlight.industry && (
                      <p className="text-xs text-slate-500 mt-1">
                        {highlight.industry}
                      </p>
                    )}
                  </td>

                  {/* Type */}
                  <td className="py-3 px-3">
                    <Badge
                      variant="outline"
                      className="text-xs"
                    >
                      {highlight.highlightType.replace(/_/g, ' ')}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <Badge className={STATUS_COLORS[highlight.approvalStatus]}>
                      {highlight.approvalStatus}
                    </Badge>
                  </td>

                  {/* Visibility */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 text-slate-600">
                      {VISIBILITY_ICONS[highlight.visibility]}
                      <span className="text-xs">
                        {highlight.visibility}
                      </span>
                    </div>
                  </td>

                  {/* Sales Tagged */}
                  <td className="py-3 px-3">
                    {highlight.taggedForSales ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-400" />
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      {/* Approve */}
                      {highlight.approvalStatus === 'draft' && (
                        <Button
                          onClick={() => handleApprove(highlight.id)}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                          Approve
                        </Button>
                      )}

                      {/* Reject */}
                      {highlight.approvalStatus === 'draft' && (
                        <Button
                          onClick={() => handleReject(highlight.id)}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          <XCircle className="w-3 h-3 mr-1 text-red-600" />
                          Reject
                        </Button>
                      )}

                      {/* Toggle Sales Tag */}
                      <Button
                        onClick={() =>
                          handleToggleTagged(highlight.id, highlight.taggedForSales)
                        }
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        {highlight.taggedForSales ? (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Untag
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Tag
                          </>
                        )}
                      </Button>

                      {/* Delete */}
                      <Button
                        onClick={() => handleDelete(highlight.id)}
                        size="sm"
                        variant="outline"
                        className="text-xs text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}