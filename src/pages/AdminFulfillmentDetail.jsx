import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '@/components/auth/AdminGuard';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

const TASK_TYPE_LABELS = {
  content_brief: 'Brief',
  blog_article: 'Blog',
  social_post_batch: 'Social Posts',
  video_script: 'Video Script',
  video_production: 'Video Prod',
  client_approval: 'Client Approval',
  website_edit: 'Website',
  seo_page: 'SEO',
  campaign_setup: 'Campaign Setup',
  campaign_optimization: 'Optimization',
  report_review: 'Report',
  monthly_checkin: 'Check-in',
  revision: 'Revision',
  other: 'Other',
};

const DELIVERABLE_COLORS = {
  blog_article: 'bg-blue-50 border-blue-200',
  video: 'bg-purple-50 border-purple-200',
  social_post_set: 'bg-pink-50 border-pink-200',
  landing_page: 'bg-orange-50 border-orange-200',
  seo_page: 'bg-green-50 border-green-200',
  website_update: 'bg-cyan-50 border-cyan-200',
  ad_creative: 'bg-red-50 border-red-200',
  report: 'bg-slate-50 border-slate-200',
  monthly_plan: 'bg-indigo-50 border-indigo-200',
};

export default function AdminFulfillmentDetail() {
  const [searchParams] = useSearchParams();
  const workroomId = searchParams.get('id');

  const [workroom, setWorkroom] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, [workroomId]);

  const loadData = async () => {
    try {
      const [w, t, d, r, rep] = await Promise.all([
        base44.entities.FulfillmentWorkrooms.filter({ id: workroomId }),
        base44.entities.FulfillmentTasks.filter({ workroom_id: workroomId }),
        base44.entities.Deliverables.filter({ workroom_id: workroomId }),
        base44.entities.ClientRequests.filter({ workroom_id: workroomId }),
        base44.entities.ReportingSnapshots.filter({ workroom_id: workroomId }),
      ]);

      if (w.length > 0) setWorkroom(w[0]);
      setTasks(t);
      setDeliverables(d);
      setRequests(r);
      setReports(rep.sort((a, b) => new Date(b.period_end) - new Date(a.period_end)));
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    await base44.entities.FulfillmentTasks.update(taskId, {
      status: newStatus,
      completed_date: newStatus === 'completed' ? new Date().toISOString() : null,
    });
    loadData();
  };

  const handleDeliverableApprove = async (deliverableId) => {
    await base44.entities.Deliverables.update(deliverableId, {
      approval_status: 'approved',
    });
    loadData();
  };

  if (loading || !workroom) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      </AdminGuard>
    );
  }

  const internalTasks = tasks.filter(t => !t.visible_to_client);
  const clientTasks = tasks.filter(t => t.visible_to_client);
  const overdueTasks = tasks.filter(t => 
    t.due_date && new Date(t.due_date) < new Date() && 
    !['completed', 'approved'].includes(t.status)
  );
  const pendingApprovals = deliverables.filter(d => 
    d.approval_required && d.approval_status === 'pending_review'
  );

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900">{workroom.title}</h1>
          <div className="flex flex-wrap gap-4 mt-3">
            <span className="text-sm text-slate-600">Service: <strong>{workroom.service_type}</strong></span>
            <span className="text-sm text-slate-600">Status: <strong>{workroom.status.replace(/_/g, ' ')}</strong></span>
            <span className="text-sm text-slate-600">Progress: <strong>{workroom.progress_percent}%</strong></span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white border-b border-slate-200 px-6">
          <TabsList className="bg-transparent border-b-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Progress & Blockers */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <p className="text-sm text-slate-600 mb-2">Overall Progress</p>
                  <div className="flex items-end gap-3">
                    <div className="text-4xl font-bold text-violet-600">{workroom.progress_percent}%</div>
                    <div className="flex-1 bg-slate-200 rounded h-2">
                      <div
                        className="bg-violet-600 h-2 rounded transition-all"
                        style={{ width: `${workroom.progress_percent}%` }}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <p className="text-sm text-slate-600 mb-2">Task Status</p>
                  <div className="space-y-1 text-sm">
                    <div>✓ Completed: <strong>{tasks.filter(t => t.status === 'completed').length}</strong></div>
                    <div>⏳ In Progress: <strong>{tasks.filter(t => t.status === 'in_progress').length}</strong></div>
                    <div>⚠️ Pending: <strong>{tasks.filter(t => t.status === 'pending').length}</strong></div>
                  </div>
                </Card>

                <Card className="p-6">
                  <p className="text-sm text-slate-600 mb-2">Pending Approvals</p>
                  <div className="text-4xl font-bold text-orange-600">{pendingApprovals.length}</div>
                  {pendingApprovals.length > 0 && (
                    <p className="text-xs text-orange-600 mt-2">📋 Items waiting for review</p>
                  )}
                </Card>
              </div>

              {/* Alerts */}
              {(overdueTasks.length > 0 || pendingApprovals.length > 0) && (
                <Card className="p-4 bg-amber-50 border-amber-200">
                  {overdueTasks.length > 0 && (
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-900">{overdueTasks.length} Overdue Tasks</p>
                        <p className="text-sm text-amber-800">{overdueTasks.map(t => t.task_title).join(', ')}</p>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Dates */}
              <Card className="p-6 bg-slate-50">
                <h3 className="font-semibold text-slate-900 mb-4">Timeline</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Current Period</p>
                    <p className="font-semibold">{workroom.current_period_start} to {workroom.current_period_end}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Next Delivery</p>
                    <p className="font-semibold">{workroom.next_delivery_date}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Next Review</p>
                    <p className="font-semibold">{workroom.next_review_date}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Billing Cycle</p>
                    <p className="font-semibold">{workroom.billing_cycle}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {internalTasks.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Internal Production Tasks</h3>
                  <div className="space-y-2">
                    {internalTasks.map(task => (
                      <Card key={task.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{task.task_title}</p>
                            <p className="text-xs text-slate-500 mt-1">{TASK_TYPE_LABELS[task.task_type]}</p>
                          </div>
                          <select
                            value={task.status}
                            onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                            className="text-sm px-2 py-1 rounded border border-slate-200"
                          >
                            {['pending', 'in_progress', 'submitted', 'approved', 'completed', 'blocked'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {clientTasks.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Client Approval Tasks</h3>
                  <div className="space-y-2">
                    {clientTasks.map(task => (
                      <Card key={task.id} className="p-4 bg-blue-50 border-blue-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">👤 {task.task_title}</p>
                            <p className="text-xs text-slate-500 mt-1">Visible to client</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            task.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Deliverables Tab */}
          {activeTab === 'deliverables' && (
            <div className="space-y-3">
              {deliverables.length === 0 ? (
                <Card className="p-6 text-center text-slate-500">No deliverables yet</Card>
              ) : (
                deliverables.map(d => (
                  <Card key={d.id} className={`p-4 border-2 ${DELIVERABLE_COLORS[d.deliverable_type]}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{d.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{d.deliverable_type}</p>
                      </div>
                      <div className="flex gap-2">
                        {d.approval_required && d.approval_status === 'pending_review' && (
                          <Button
                            size="sm"
                            onClick={() => handleDeliverableApprove(d.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                        )}
                        <span className="text-xs px-2 py-1 rounded bg-white border">{d.approval_status}</span>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="space-y-3">
              {requests.length === 0 ? (
                <Card className="p-6 text-center text-slate-500">No requests yet</Card>
              ) : (
                requests.map(r => (
                  <Card key={r.id} className="p-4 border-l-4 border-l-violet-600">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{r.title}</p>
                        <p className="text-sm text-slate-600 mt-1">{r.message}</p>
                        <p className="text-xs text-slate-500 mt-2">{r.request_type} • {r.status}</p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Reporting Tab */}
          {activeTab === 'reporting' && (
            <div className="space-y-3">
              {reports.length === 0 ? (
                <Card className="p-6 text-center text-slate-500">No reports yet</Card>
              ) : (
                reports.map(r => (
                  <Card key={r.id} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100">
                    <p className="font-semibold text-slate-900">{r.report_period_label}</p>
                    <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                      {r.traffic_total !== null && <div>📊 {r.traffic_total} Visits</div>}
                      {r.leads_total !== null && <div>🎯 {r.leads_total} Leads</div>}
                      {r.posts_published !== null && <div>📱 {r.posts_published} Posts</div>}
                      {r.videos_created !== null && <div>🎬 {r.videos_created} Videos</div>}
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}