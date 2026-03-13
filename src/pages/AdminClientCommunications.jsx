import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Mail, Send, Clock, CheckCircle, MessageSquare } from 'lucide-react';

const COMM_TYPES = {
  weekly_summary: { label: 'Weekly Summary', color: 'bg-blue-100 text-blue-800' },
  monthly_report: { label: 'Monthly Report', color: 'bg-purple-100 text-purple-800' },
  milestone: { label: 'Milestone', color: 'bg-green-100 text-green-800' },
  inactivity_nudge: { label: 'Inactivity Nudge', color: 'bg-amber-100 text-amber-800' },
  billing_warning: { label: 'Billing Warning', color: 'bg-red-100 text-red-800' },
  upgrade_recommendation: { label: 'Upgrade Rec', color: 'bg-emerald-100 text-emerald-800' },
  account_review: { label: 'Account Review', color: 'bg-slate-100 text-slate-800' },
  success_highlight: { label: 'Win Highlight', color: 'bg-rose-100 text-rose-800' }
};

export default function AdminClientCommunications() {
  const [activeTab, setActiveTab] = useState('recent');
  const [selectedComm, setSelectedComm] = useState(null);

  // Fetch all communications
  const { data: communications, isLoading } = useQuery({
    queryKey: ['client-communications'],
    queryFn: async () => {
      return await base44.entities.ClientCommunicationLog.list('-createdAt', 200);
    }
  });

  // Fetch organizations for mapping
  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      return await base44.entities.Organization.list('-created_date', 500);
    }
  });

  if (isLoading) return <AdminLayout><div className="p-6 animate-pulse">Loading...</div></AdminLayout>;

  const orgMap = new Map(organizations?.map(o => [o.id, o]) || []);

  // Analytics
  const stats = {
    sent: communications?.filter(c => c.status === 'sent' || c.status === 'opened').length || 0,
    scheduled: communications?.filter(c => c.status === 'scheduled').length || 0,
    draft: communications?.filter(c => c.status === 'draft').length || 0,
    failed: communications?.filter(c => c.status === 'failed').length || 0
  };

  // Segment: Missing Updates (no communication in 30 days)
  const clientsMissingUpdates = [];
  const communicationsByOrg = new Map();
  communications?.forEach(c => {
    const last = communicationsByOrg.get(c.organizationId);
    if (!last || new Date(c.createdAt) > new Date(last.createdAt)) {
      communicationsByOrg.set(c.organizationId, c);
    }
  });

  organizations?.forEach(org => {
    const lastComm = communicationsByOrg.get(org.id);
    const daysSince = lastComm 
      ? Math.floor((Date.now() - new Date(lastComm.sentAt || lastComm.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    
    if (daysSince > 30) {
      clientsMissingUpdates.push({
        ...org,
        daysSinceLast: daysSince,
        lastCommType: lastComm?.communicationType || 'none'
      });
    }
  });

  // Segment: At-Risk Accounts (multiple failures, no opens)
  const atRiskAccounts = communications
    ?.filter(c => c.status === 'failed' || (c.status === 'sent' && !c.openedAt))
    .reduce((map, c) => {
      const count = (map.get(c.organizationId) || 0) + 1;
      map.set(c.organizationId, count);
      return map;
    }, new Map());

  const atRiskList = Array.from(atRiskAccounts?.entries() || [])
    .filter(([_, count]) => count >= 2)
    .map(([orgId, count]) => ({
      organization: orgMap.get(orgId),
      failureCount: count
    }));

  // Recent communications
  const recentComms = communications?.slice(0, 10) || [];

  const getOrgName = (orgId) => {
    return orgMap.get(orgId)?.organizationName || orgId.slice(0, 8);
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Client Communications</h1>
          <p className="text-slate-600 mt-2">
            Manage reports, summaries, and outreach messaging
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Sent This Week</p>
                <p className="text-2xl font-bold mt-1">{stats.sent}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Scheduled</p>
                <p className="text-2xl font-bold mt-1">{stats.scheduled}</p>
              </div>
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">In Draft</p>
                <p className="text-2xl font-bold mt-1">{stats.draft}</p>
              </div>
              <MessageSquare className="w-6 h-6 text-slate-500" />
            </div>
          </Card>

          <Card className="p-4 border-2 border-red-200 bg-red-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Failed</p>
                <p className="text-2xl font-bold mt-1">{stats.failed}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </Card>

          <Card className="p-4 border-2 border-amber-200 bg-amber-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Missing Updates</p>
                <p className="text-2xl font-bold mt-1">{clientsMissingUpdates.length}</p>
              </div>
              <Mail className="w-6 h-6 text-amber-600" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="recent">Recent Communications</TabsTrigger>
            <TabsTrigger value="missing">Missing Updates</TabsTrigger>
            <TabsTrigger value="atrisk">At-Risk</TabsTrigger>
            <TabsTrigger value="templates">Quick Send</TabsTrigger>
          </TabsList>

          {/* Recent Communications */}
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Latest Communications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentComms.length === 0 ? (
                    <p className="text-slate-600">No communications sent yet.</p>
                  ) : (
                    recentComms.map((comm) => {
                      const type = COMM_TYPES[comm.communicationType];
                      return (
                        <div
                          key={comm.id}
                          className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition"
                          onClick={() => setSelectedComm(comm)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{getOrgName(comm.organizationId)}</h4>
                                <Badge className={type.color}>{type.label}</Badge>
                              </div>
                              <p className="text-sm text-slate-700 mb-2">{comm.subject}</p>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span>
                                  {new Date(comm.createdAt).toLocaleDateString()} {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <Badge variant="outline" className="text-xs">{comm.status}</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Missing Updates */}
          <TabsContent value="missing">
            <Card>
              <CardHeader>
                <CardTitle>⚠️ Clients Missing Regular Updates ({clientsMissingUpdates.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clientsMissingUpdates.length === 0 ? (
                    <p className="text-slate-600">All clients are receiving regular communications!</p>
                  ) : (
                    clientsMissingUpdates.sort((a, b) => b.daysSinceLast - a.daysSinceLast).map((client) => (
                      <div key={client.id} className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900">{client.organizationName}</h4>
                            <p className="text-sm text-slate-600 mt-1">
                              {client.daysSinceLast} days since last communication
                              {client.lastCommType !== 'none' && ` (${client.lastCommType.replace('_', ' ')})`}
                            </p>
                          </div>
                          <Button className="bg-blue-600 text-white hover:bg-blue-700 text-sm">
                            Send Update
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* At-Risk */}
          <TabsContent value="atrisk">
            <Card>
              <CardHeader>
                <CardTitle>🚨 At-Risk Accounts ({atRiskList.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {atRiskList.length === 0 ? (
                    <p className="text-slate-600">No at-risk accounts detected.</p>
                  ) : (
                    atRiskList.map((item) => (
                      <div key={item.organization?.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900">{item.organization?.organizationName}</h4>
                            <p className="text-sm text-red-700 mt-1">
                              {item.failureCount} failed communication attempts
                            </p>
                            <p className="text-xs text-slate-600 mt-2">
                              Investigate delivery issues and consider reaching out via alternative channel.
                            </p>
                          </div>
                          <Button variant="outline" className="text-red-600 hover:bg-red-50 text-sm">
                            Investigate
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Send Templates */}
          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { type: 'inactivity_nudge', subject: 'Let\'s Get Back on Track', preview: 'Your content strategy is paused...' },
                { type: 'success_highlight', subject: 'You Just Hit a Milestone!', preview: 'Congratulations on your achievement...' },
                { type: 'upgrade_recommendation', subject: 'You\'re Ready for Your Next Phase', preview: 'Your metrics show strong growth...' },
                { type: 'account_review', subject: 'Let\'s Review Your Progress', preview: 'Schedule a strategy review call...' }
              ].map((template) => (
                <Card key={template.type} className="hover:shadow-lg transition cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{template.subject}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-4">{template.preview}</p>
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                      <Send className="w-4 h-4 mr-2" />
                      Send Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Detail Modal */}
        {selectedComm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-96 overflow-y-auto">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>{selectedComm.subject}</CardTitle>
                <button
                  onClick={() => setSelectedComm(null)}
                  className="text-slate-500 hover:text-slate-700 text-2xl"
                >
                  ×
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Organization</p>
                    <p className="font-semibold">{getOrgName(selectedComm.organizationId)}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Type</p>
                    <p className="font-semibold">{COMM_TYPES[selectedComm.communicationType]?.label}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Status</p>
                    <Badge>{selectedComm.status}</Badge>
                  </div>
                  <div>
                    <p className="text-slate-600">Sent</p>
                    <p className="font-semibold">
                      {selectedComm.sentAt ? new Date(selectedComm.sentAt).toLocaleDateString() : 'Not sent'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-600 text-sm mb-2">Content</p>
                  <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedComm.fullContent || selectedComm.summaryText || '(No content)'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}