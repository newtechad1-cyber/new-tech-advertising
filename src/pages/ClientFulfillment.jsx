import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import ClientGuard from '@/components/auth/ClientGuard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle2, AlertCircle, Calendar, MessageSquare, FileText } from 'lucide-react';
import { useState as useStateCallback } from 'react';

export default function ClientFulfillment() {
  const [user, setUser] = useState(null);
  const [workroom, setWorkroom] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newRequest, setNewRequest] = useState({ type: 'support', title: '', message: '' });
  const [submittingRequest, setSubmittingRequest] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      if (currentUser?.company_id) {
        const [w, t, d, r, rep] = await Promise.all([
          base44.entities.FulfillmentWorkrooms.filter({
            company_id: currentUser.company_id,
            status: 'active',
          }),
          base44.entities.FulfillmentTasks.filter({
            company_id: currentUser.company_id,
            visible_to_client: true,
          }),
          base44.entities.Deliverables.filter({
            company_id: currentUser.company_id,
            visible_to_client: true,
          }),
          base44.entities.ClientRequests.filter({
            company_id: currentUser.company_id,
          }),
          base44.entities.ReportingSnapshots.filter({
            company_id: currentUser.company_id,
          }),
        ]);

        if (w.length > 0) {
          setWorkroom(w[0]);
          setTasks(t.filter(tk => tk.workroom_id === w[0].id));
          setDeliverables(d.filter(dv => dv.workroom_id === w[0].id));
          setRequests(r.filter(rq => rq.workroom_id === w[0].id));
          setReports(rep.filter(rp => rp.workroom_id === w[0].id).sort((a, b) => new Date(b.period_end) - new Date(a.period_end)));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeliverable = async (deliverableId) => {
    await base44.entities.Deliverables.update(deliverableId, {
      approval_status: 'approved',
    });
    loadData();
  };

  const handleRequestChanges = async (deliverableId) => {
    await base44.entities.Deliverables.update(deliverableId, {
      approval_status: 'needs_changes',
    });

    await base44.entities.ClientRequests.create({
      company_id: user.company_id,
      workroom_id: workroom.id,
      client_user_id: user.id,
      request_type: 'revision',
      title: `Changes requested for deliverable`,
      message: 'Client requested changes to deliverable',
      priority: 'high',
      status: 'new',
      related_deliverable_id: deliverableId,
    });

    loadData();
  };

  const handleSubmitRequest = async () => {
    if (!newRequest.title || !newRequest.message) return;

    setSubmittingRequest(true);
    try {
      await base44.entities.ClientRequests.create({
        company_id: user.company_id,
        workroom_id: workroom.id,
        client_user_id: user.id,
        request_type: newRequest.type,
        title: newRequest.title,
        message: newRequest.message,
        priority: 'medium',
        status: 'new',
      });

      setNewRequest({ type: 'support', title: '', message: '' });
      loadData();
    } finally {
      setSubmittingRequest(false);
    }
  };

  if (loading) {
    return (
      <ClientGuard>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      </ClientGuard>
    );
  }

  if (!workroom) {
    return (
      <ClientGuard>
        <div className="min-h-screen bg-slate-50 p-6">
          <Card className="max-w-md mx-auto p-12 text-center">
            <p className="text-slate-500">No active fulfillment workrooms</p>
          </Card>
        </div>
      </ClientGuard>
    );
  }

  const pendingApprovals = deliverables.filter(d => d.approval_status === 'pending_review');
  const recentDeliverables = deliverables.filter(d => d.visible_to_client).slice(0, 5);
  const latestReport = reports[0];

  return (
    <ClientGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Hero */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
            <p className="text-violet-100 text-lg">Here's what's happening with your {workroom.service_type.replace(/_/g, ' ')}</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white border-b border-slate-200 px-6 sticky top-0 z-10">
            <TabsList className="bg-transparent border-b-0 max-w-6xl mx-auto w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>
          </div>

          <div className="max-w-6xl mx-auto p-6">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Status Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <Card className="p-6 bg-white">
                  <p className="text-sm text-slate-600 mb-1">Service Status</p>
                  <p className="text-2xl font-bold text-violet-600 capitalize">{workroom.status.replace(/_/g, ' ')}</p>
                </Card>

                <Card className="p-6 bg-white">
                  <p className="text-sm text-slate-600 mb-1">Current Phase</p>
                  <p className="text-2xl font-bold text-indigo-600 capitalize">{workroom.phase.replace(/_/g, ' ')}</p>
                </Card>

                <Card className="p-6 bg-white">
                  <p className="text-sm text-slate-600 mb-1">Next Delivery</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <p className="font-semibold">{workroom.next_delivery_date}</p>
                  </div>
                </Card>

                <Card className="p-6 bg-white">
                  <p className="text-sm text-slate-600 mb-1">Progress</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-violet-600 h-2 rounded-full"
                        style={{ width: `${workroom.progress_percent}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{workroom.progress_percent}%</span>
                  </div>
                </Card>
              </div>

              {/* Pending Approvals */}
              {pendingApprovals.length > 0 && (
                <Card className="p-6 bg-amber-50 border-amber-200">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-900">Awaiting Your Approval</h3>
                      <p className="text-sm text-amber-800">{pendingApprovals.length} items need your review</p>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    {pendingApprovals.map(d => (
                      <div key={d.id} className="bg-white p-3 rounded flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{d.title}</p>
                          <p className="text-sm text-slate-600 mt-1">{d.deliverable_type}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveDeliverable(d.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRequestChanges(d.id)}
                          >
                            Changes
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Recent Deliverables */}
              {recentDeliverables.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Recent Deliverables</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {recentDeliverables.map(d => (
                      <Card key={d.id} className="p-4 border-l-4 border-l-violet-600">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{d.title}</p>
                            <p className="text-xs text-slate-500 mt-1 capitalize">{d.deliverable_type.replace(/_/g, ' ')}</p>
                            {d.published_date && (
                              <p className="text-xs text-green-600 mt-2">✓ Published {new Date(d.published_date).toLocaleDateString()}</p>
                            )}
                          </div>
                          {d.preview_url && (
                            <a href={d.preview_url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline">View</Button>
                            </a>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Latest Report */}
              {latestReport && (
                <Card className="p-6 bg-gradient-to-r from-indigo-50 to-violet-50">
                  <h3 className="font-semibold text-slate-900 mb-4">Latest Performance Report</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    {latestReport.traffic_total !== null && (
                      <div>
                        <p className="text-slate-600">Traffic</p>
                        <p className="text-2xl font-bold text-indigo-600">{latestReport.traffic_total?.toLocaleString()}</p>
                      </div>
                    )}
                    {latestReport.leads_total !== null && (
                      <div>
                        <p className="text-slate-600">Leads</p>
                        <p className="text-2xl font-bold text-indigo-600">{latestReport.leads_total?.toLocaleString()}</p>
                      </div>
                    )}
                    {latestReport.posts_published !== null && (
                      <div>
                        <p className="text-slate-600">Posts</p>
                        <p className="text-2xl font-bold text-indigo-600">{latestReport.posts_published}</p>
                      </div>
                    )}
                    {latestReport.videos_created !== null && (
                      <div>
                        <p className="text-slate-600">Videos</p>
                        <p className="text-2xl font-bold text-indigo-600">{latestReport.videos_created}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Deliverables Tab */}
            <TabsContent value="deliverables" className="space-y-3">
              {deliverables.length === 0 ? (
                <Card className="p-6 text-center text-slate-500">No deliverables yet</Card>
              ) : (
                deliverables.map(d => (
                  <Card key={d.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{d.title}</p>
                        <p className="text-sm text-slate-600 mt-1">{d.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 capitalize">
                            {d.deliverable_type.replace(/_/g, ' ')}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            d.approval_status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {d.approval_status}
                          </span>
                        </div>
                      </div>
                      {d.preview_url && (
                        <a href={d.preview_url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">View</Button>
                        </a>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-3">
              {reports.length === 0 ? (
                <Card className="p-6 text-center text-slate-500">No reports available yet</Card>
              ) : (
                reports.map(r => (
                  <Card key={r.id} className="p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{r.report_period_label}</p>
                        <p className="text-sm text-slate-600 mt-1">{r.period_start} to {r.period_end}</p>
                      </div>
                      {r.report_url && (
                        <a href={r.report_url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-2" /> Download
                          </Button>
                        </a>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support" className="space-y-6">
              {/* Submit Request */}
              <Card className="p-6 bg-white">
                <h3 className="font-semibold text-slate-900 mb-4">Submit a Request</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Request Type</label>
                    <select
                      value={newRequest.type}
                      onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-300"
                    >
                      <option value="support">Support Question</option>
                      <option value="revision">Revision Request</option>
                      <option value="strategy_question">Strategy Question</option>
                      <option value="content_request">Content Request</option>
                      <option value="call_request">Request a Call</option>
                      <option value="website_change">Website Change</option>
                      <option value="campaign_change">Campaign Change</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={newRequest.title}
                      onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                      placeholder="Brief subject line"
                      className="w-full px-3 py-2 rounded border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                    <Textarea
                      value={newRequest.message}
                      onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
                      placeholder="Tell us what you need..."
                      rows={5}
                    />
                  </div>

                  <Button
                    onClick={handleSubmitRequest}
                    disabled={submittingRequest || !newRequest.title || !newRequest.message}
                    className="w-full bg-violet-600 hover:bg-violet-700"
                  >
                    {submittingRequest ? 'Sending...' : 'Send Request'}
                  </Button>
                </div>
              </Card>

              {/* Recent Requests */}
              {requests.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Your Requests</h3>
                  <div className="space-y-3">
                    {requests.map(r => (
                      <Card key={r.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{r.title}</p>
                            <p className="text-sm text-slate-600 mt-1">{r.message}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="text-xs px-2 py-1 rounded bg-slate-100 capitalize">{r.request_type.replace(/_/g, ' ')}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                r.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {r.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </ClientGuard>
  );
}