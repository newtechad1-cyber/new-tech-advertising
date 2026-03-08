import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, TrendingDown } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';

export default function AdminOperationsCompany() {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('company_id');

  const { data: company } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => base44.asServiceRole.entities.Company.get(companyId),
    enabled: !!companyId
  });

  const { data: slaEvents = [] } = useQuery({
    queryKey: ['company-sla-events', companyId],
    queryFn: async () => {
      const events = await base44.asServiceRole.entities.SLAEvents.filter({
        company_id: companyId
      });
      return events.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    enabled: !!companyId
  });

  const { data: requests = [] } = useQuery({
    queryKey: ['company-requests', companyId],
    queryFn: () => base44.asServiceRole.entities.ClientRequests.filter({
      company_id: companyId,
      status: { $in: ['pending', 'in_progress'] }
    }),
    enabled: !!companyId
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['company-tasks', companyId],
    queryFn: () => base44.asServiceRole.entities.SalesTasks.filter({
      company_id: companyId,
      status: 'pending'
    }),
    enabled: !!companyId
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['company-messages', companyId],
    queryFn: () => base44.asServiceRole.entities.MessageThreads.filter({
      company_id: companyId,
      status: { $in: ['waiting_on_admin', 'waiting_on_client'] }
    }),
    enabled: !!companyId
  });

  const breachedCount = slaEvents.filter(e => e.status === 'breached').length;
  const criticalCount = slaEvents.filter(e => e.severity === 'critical' && e.status === 'breached').length;
  const staleRequests = requests.filter(r => {
    if (!r.created_date) return false;
    const ageMs = Date.now() - new Date(r.created_date);
    return ageMs > 7 * 24 * 60 * 60 * 1000; // > 7 days
  });

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav currentPage="operations" />
      
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" className="mb-4">← Back to Operations</Button>
            <h1 className="text-3xl font-bold text-gray-900">{company.name || 'Company'} - Operational Health</h1>
            <p className="text-gray-600 mt-2">Complete SLA and operational accountability status</p>
          </div>

          {/* Health Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Critical Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-red-600">{criticalCount}</div>
                <p className="text-xs text-gray-500 mt-2">Require immediate action</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total SLA Breaches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-orange-600">{breachedCount}</div>
                <p className="text-xs text-gray-500 mt-2">Active and resolved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Stale Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-yellow-600">{staleRequests.length}</div>
                <p className="text-xs text-gray-500 mt-2">Over 7 days pending</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">{messages.length}</div>
                <p className="text-xs text-gray-500 mt-2">Awaiting response</p>
              </CardContent>
            </Card>
          </div>

          {/* Current SLA Breaches */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current SLA Breaches</CardTitle>
            </CardHeader>
            <CardContent>
              {slaEvents.filter(e => e.status === 'breached').length === 0 ? (
                <p className="text-center py-8 text-gray-500">No active breaches</p>
              ) : (
                <div className="space-y-4">
                  {slaEvents.filter(e => e.status === 'breached').map(event => (
                    <div key={event.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="font-semibold text-gray-900">{event.event_type}</span>
                            <Badge className={
                              event.severity === 'critical' ? 'bg-red-600' :
                              event.severity === 'high' ? 'bg-orange-600' : 'bg-yellow-600'
                            }>
                              {event.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{event.notes}</p>
                          <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            <span>Started: {new Date(event.started_at).toLocaleDateString()}</span>
                            {event.breached_at && (
                              <span>Breached: {new Date(event.breached_at).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">View Item</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stalled Open Requests */}
          {staleRequests.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Stalled Requests (7+ days pending)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {staleRequests.map(req => (
                    <div key={req.id} className="flex justify-between items-center py-3 border-b">
                      <div>
                        <p className="font-medium text-gray-900">{req.title}</p>
                        <p className="text-xs text-gray-500">
                          Status: {req.status} · Created {new Date(req.created_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Follow Up</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending Communication */}
          {messages.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Pending Communication Threads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {messages.map(msg => (
                    <div key={msg.id} className="flex justify-between items-center py-3 border-b">
                      <div>
                        <p className="font-medium text-gray-900">{msg.title}</p>
                        <p className="text-xs text-gray-500">
                          {msg.status} · Last message: {new Date(msg.last_message_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Respond</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Operational Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations for Cleanup</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {criticalCount > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Address {criticalCount} critical SLA breach(es) immediately to prevent churn</span>
                  </li>
                )}
                {staleRequests.length > 2 && (
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Batch process {staleRequests.length} stale requests - set aside focused time this week</span>
                  </li>
                )}
                {messages.filter(m => m.status === 'waiting_on_admin').length > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span>Respond to {messages.filter(m => m.status === 'waiting_on_admin').length} waiting admin threads within 24 hours</span>
                  </li>
                )}
                {breachedCount === 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Account is meeting SLAs - continue current delivery pace</span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}