import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700',
  changes_requested: 'bg-orange-100 text-orange-700', rejected: 'bg-red-100 text-red-700',
};

export default function AdminVideoEngineApprovals() {
  const [approvals, setApprovals] = useState([]);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    base44.entities.VideoApprovals.filter({ approval_status: 'pending' }, '-created_date').then(setApprovals);
  }, []);

  const update = async (id, status) => {
    await base44.entities.VideoApprovals.update(id, { approval_status: status, feedback: feedback[id] || '', reviewed_at: new Date().toISOString() });
    setApprovals(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('AdminVideoEngine')}><Button variant="ghost" size="sm" className="text-slate-400"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-2xl font-bold">Approvals Queue</h1>
            <p className="text-slate-400 text-sm mt-0.5">{approvals.length} pending review{approvals.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="space-y-4">
          {approvals.map(a => (
            <Card key={a.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium text-white">Video Request: {a.video_request_id}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Reviewer: {a.reviewer_type}</div>
                  </div>
                  <Badge className={`text-xs ${STATUS_COLORS[a.approval_status]}`}>{a.approval_status}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />
                  <Textarea
                    value={feedback[a.id] || ''}
                    onChange={e => setFeedback(f => ({ ...f, [a.id]: e.target.value }))}
                    placeholder="Add feedback or notes..."
                    rows={2}
                    className="bg-slate-800 border-slate-700 text-white text-sm"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => update(a.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" /> Approve
                  </Button>
                  <Button size="sm" onClick={() => update(a.id, 'changes_requested')} variant="outline" className="border-orange-400 text-orange-400">
                    Request Changes
                  </Button>
                  <Button size="sm" onClick={() => update(a.id, 'rejected')} variant="ghost" className="text-red-400">
                    <XCircle className="w-3 h-3 mr-1" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {approvals.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
              No pending approvals.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}