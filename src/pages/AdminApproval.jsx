import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, X, Clock } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';

export default function AdminApproval() {
  const [searchParams] = useSearchParams();
  const [decision, setDecision] = useState(null);
  const [notes, setNotes] = useState('');
  const requestId = searchParams.get('id');
  const queryClient = useQueryClient();

  const { data: approval = null, isLoading } = useQuery({
    queryKey: ['approval_request', requestId],
    queryFn: () => base44.asServiceRole.entities.ApprovalRequests.filter({ id: requestId }).then(r => r[0]),
    enabled: !!requestId
  });

  const approveMutation = useMutation({
    mutationFn: () =>
      base44.asServiceRole.entities.ApprovalRequests.update(requestId, {
        status: 'approved',
        decision_notes: notes,
        approved_at: new Date().toISOString()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approval_request', requestId] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: () =>
      base44.asServiceRole.entities.ApprovalRequests.update(requestId, {
        status: 'rejected',
        decision_notes: notes,
        rejected_at: new Date().toISOString()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approval_request', requestId] });
    }
  });

  if (isLoading || !approval) return <AdminNav><div className="p-8">Loading...</div></AdminNav>;

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      urgent: 'bg-orange-100 text-orange-800',
      high: 'bg-yellow-100 text-yellow-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return colors[priority] || colors.medium;
  };

  const isDecided = approval.status !== 'pending';

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-slate-900">{approval.title}</h1>
              <Button variant="outline" onClick={() => window.history.back()}>
                Back
              </Button>
            </div>
            <div className="flex gap-2">
              <Badge className={getPriorityColor(approval.priority)}>
                {approval.priority}
              </Badge>
              <Badge className={approval.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                {approval.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Request Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Type</p>
                    <p className="text-slate-900 font-semibold">{approval.request_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Summary</p>
                    <p className="text-slate-900">{approval.summary}</p>
                  </div>
                  {approval.approval_reason && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Approval Reason</p>
                      <p className="text-slate-900">{approval.approval_reason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Decision Panel */}
              {!isDecided && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Decision Required</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Decision Notes (Optional)</p>
                      <Textarea
                        placeholder="Add notes about your decision..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="h-24"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => approveMutation.mutate()}
                        disabled={approveMutation.isPending}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => rejectMutation.mutate()}
                        disabled={rejectMutation.isPending}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isDecided && (
                <Card>
                  <CardHeader>
                    <CardTitle>Decision Result</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg" style={{
                      backgroundColor: approval.status === 'approved' ? '#dcfce7' : '#fee2e2'
                    }}>
                      <p className="font-semibold" style={{
                        color: approval.status === 'approved' ? '#166534' : '#991b1b'
                      }}>
                        {approval.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                      </p>
                    </div>
                    {approval.decision_notes && (
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Decision Notes</p>
                        <p className="text-slate-900">{approval.decision_notes}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-slate-600">
                        {approval.status === 'approved' ? 'Approved' : 'Rejected'} on{' '}
                        {approval.status === 'approved'
                          ? new Date(approval.approved_at).toLocaleString()
                          : new Date(approval.rejected_at).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-600">Entity Type</p>
                    <p className="font-semibold text-slate-900">{approval.related_entity_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Created</p>
                    <p className="text-slate-900">{approval.created_date ? new Date(approval.created_date).toLocaleString() : 'N/A'}</p>
                  </div>
                  {approval.expires_at && (
                    <div>
                      <p className="text-xs text-slate-600">Expires</p>
                      <p className="text-slate-900">{new Date(approval.expires_at).toLocaleString()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminNav>
  );
}