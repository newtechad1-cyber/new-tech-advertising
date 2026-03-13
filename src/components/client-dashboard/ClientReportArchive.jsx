import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, ChevronRight } from 'lucide-react';

const COMM_TYPE_CONFIG = {
  weekly_summary: { label: '📊 Weekly Summary', color: 'bg-blue-100 text-blue-800' },
  monthly_report: { label: '📈 Monthly Report', color: 'bg-purple-100 text-purple-800' },
  milestone: { label: '🏆 Milestone', color: 'bg-green-100 text-green-800' },
  inactivity_nudge: { label: '⚠️ Activity Nudge', color: 'bg-amber-100 text-amber-800' },
  success_highlight: { label: '✨ Win Highlight', color: 'bg-rose-100 text-rose-800' },
  upgrade_recommendation: { label: '🚀 Upgrade Rec', color: 'bg-emerald-100 text-emerald-800' },
  account_review: { label: '💬 Account Review', color: 'bg-indigo-100 text-indigo-800' },
  billing_warning: { label: '⚠️ Billing Alert', color: 'bg-red-100 text-red-800' }
};

export default function ClientReportArchive({ organizationId }) {
  const [communications, setCommunications] = useState([]);
  const [activeType, setActiveType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadComms = async () => {
      try {
        const comms = await base44.entities.ClientCommunicationLog.filter(
          { organizationId, status: 'sent' },
          '-sentAt',
          100
        );
        setCommunications(comms);
      } catch (error) {
        console.error('Error loading communications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (organizationId) {
      loadComms();
    }
  }, [organizationId]);

  const filteredComms = activeType === 'all'
    ? communications
    : communications.filter(c => c.communicationType === activeType);

  const commTypeGroups = {
    reports: communications.filter(c => ['weekly_summary', 'monthly_report'].includes(c.communicationType)),
    milestones: communications.filter(c => ['milestone', 'success_highlight'].includes(c.communicationType)),
    alerts: communications.filter(c => ['inactivity_nudge', 'billing_warning'].includes(c.communicationType)),
    recommendations: communications.filter(c => ['upgrade_recommendation', 'account_review'].includes(c.communicationType))
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading archive...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Reports & Communications Archive
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2 max-h-96 overflow-y-auto">
            {filteredComms.length === 0 ? (
              <p className="text-slate-600 text-sm">No communications archived yet.</p>
            ) : (
              filteredComms.map((comm) => {
                const config = COMM_TYPE_CONFIG[comm.communicationType];
                const sentDate = new Date(comm.sentAt || comm.createdAt);
                return (
                  <div
                    key={comm.id}
                    className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900 text-sm">{comm.subject}</h4>
                          {config && <Badge className={`text-xs ${config.color}`}>{config.label}</Badge>}
                        </div>
                        <p className="text-xs text-slate-600">
                          {sentDate.toLocaleDateString()} at {sentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-2 max-h-96 overflow-y-auto">
            {commTypeGroups.reports.length === 0 ? (
              <p className="text-slate-600 text-sm">No reports yet.</p>
            ) : (
              commTypeGroups.reports.map((comm) => {
                const config = COMM_TYPE_CONFIG[comm.communicationType];
                const sentDate = new Date(comm.sentAt || comm.createdAt);
                return (
                  <div
                    key={comm.id}
                    className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900 text-sm">{comm.subject}</h4>
                          {config && <Badge className={`text-xs ${config.color}`}>{config.label}</Badge>}
                        </div>
                        <p className="text-xs text-slate-600 mb-2">{comm.summaryText}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">
                            {sentDate.toLocaleDateString()}
                          </span>
                          <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="milestones" className="space-y-2 max-h-96 overflow-y-auto">
            {commTypeGroups.milestones.length === 0 ? (
              <p className="text-slate-600 text-sm">No milestones yet.</p>
            ) : (
              commTypeGroups.milestones.map((comm) => {
                const config = COMM_TYPE_CONFIG[comm.communicationType];
                const sentDate = new Date(comm.sentAt || comm.createdAt);
                return (
                  <div
                    key={comm.id}
                    className="p-3 border border-slate-200 rounded-lg bg-slate-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900 text-sm">{comm.subject}</h4>
                          {config && <Badge className={`text-xs ${config.color}`}>{config.label}</Badge>}
                        </div>
                        <p className="text-xs text-slate-600">
                          {sentDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>
        </Tabs>

        {communications.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              {communications.length} total communications
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}