import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function PortalApprovals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: approvals = [], isLoading } = useQuery({
    queryKey: ['client-approvals'],
    queryFn: async () => {
      const res = await base44.functions.invoke('getClientApprovals', {});
      return res.data.approvals || [];
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      await base44.entities.ApprovalRequest.update(id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['client-approvals']);
      toast({ title: 'Approval status updated' });
    }
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading approvals...</div>;

  const pending = approvals.filter(a => a.status.includes('Pending') || a.status === 'Draft');
  const completed = approvals.filter(a => !a.status.includes('Pending') && a.status !== 'Draft');

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Approvals</h1>
        <p className="text-muted-foreground">Review and approve content, campaigns, and creative assets.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" /> Action Required
        </h2>
        {pending.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No pending approvals right now. You're all caught up!</CardContent></Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pending.map(approval => (
              <Card key={approval.id} className="border-amber-200/50 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      {approval.request_type || 'Content Review'}
                    </Badge>
                    {approval.due_date && (
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(approval.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2">{approval.title}</CardTitle>
                  <CardDescription>{approval.message}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3 pt-2">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => updateStatus.mutate({ id: approval.id, status: 'Approved' })}
                    >
                      <Check className="w-4 h-4 mr-2" /> Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                      onClick={() => updateStatus.mutate({ id: approval.id, status: 'Rejected' })}
                    >
                      <X className="w-4 h-4 mr-2" /> Request Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-8">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-500" /> Past Approvals
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {completed.map(approval => (
            <Card key={approval.id} className="bg-slate-50/50">
              <CardHeader>
                <Badge variant={approval.status === 'Approved' ? 'default' : 'secondary'} className="w-fit mb-2">
                  {approval.status}
                </Badge>
                <CardTitle className="text-md">{approval.title}</CardTitle>
                <CardDescription className="text-xs mt-1">
                  Decided on: {new Date(approval.updated_date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
          {completed.length === 0 && <p className="text-muted-foreground text-sm col-span-full">No past approvals yet.</p>}
        </div>
      </div>
    </div>
  );
}