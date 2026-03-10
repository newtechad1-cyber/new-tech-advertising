import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import NewRequestModal from '@/components/video-engine/NewRequestModal';

const STATUS_COLORS = {
  draft: 'bg-slate-100 text-slate-600',
  queued: 'bg-yellow-100 text-yellow-700',
  script_ready: 'bg-blue-100 text-blue-700',
  assets_ready: 'bg-purple-100 text-purple-700',
  rendering: 'bg-orange-100 text-orange-700',
  review: 'bg-cyan-100 text-cyan-700',
  approved: 'bg-green-100 text-green-700',
  published: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
  archived: 'bg-slate-200 text-slate-500',
};

const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-700',
  normal: 'bg-slate-100 text-slate-600',
  low: 'bg-slate-100 text-slate-400',
};

export default function AdminVideoEngineRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    base44.entities.VideoRequests.list('-created_date', 100).then(setRequests);
  }, []);

  const filtered = requests.filter(r => {
    const matchSearch = !search || r.title?.toLowerCase().includes(search.toLowerCase()) || r.industry?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const content = (
    <div className="bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('AdminVideoEngine')}>
            <Button variant="ghost" size="sm" className="text-slate-400"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Video Requests</h1>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> New Request
          </Button>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search requests..." className="pl-9 bg-slate-800 border-slate-700 text-white" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44 bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.keys(STATUS_COLORS).map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filtered.map(r => (
            <Link key={r.id} to={createPageUrl(`AdminVideoEngineRequest?id=${r.id}`)}>
              <Card className="bg-slate-900 border-slate-800 hover:border-slate-600 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white">{r.title}</div>
                      <div className="text-sm text-slate-400 mt-1">{r.goal || 'No goal specified'}</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs text-slate-500">{r.request_type?.replace(/_/g, ' ')}</span>
                        {r.industry && <span className="text-xs text-slate-500">· {r.industry}</span>}
                        {r.video_format && <span className="text-xs text-slate-500">· {r.video_format}</span>}
                        {r.duration_target && <span className="text-xs text-slate-500">· {r.duration_target}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <Badge className={`text-xs ${STATUS_COLORS[r.status]}`}>{r.status}</Badge>
                      <Badge className={`text-xs ${PRIORITY_COLORS[r.priority]}`}>{r.priority}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">No requests found.</div>
          )}
        </div>
      </div>
      <NewRequestModal open={showModal} onClose={() => setShowModal(false)} onCreated={r => setRequests(prev => [r, ...prev])} />
    </div>
  );

  return <AdminLayout currentPageName="AdminVideoEngineRequests">{content}</AdminLayout>;
}