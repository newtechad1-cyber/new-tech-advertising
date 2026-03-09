import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, FileText, Layers, Palette, Play, CheckCircle, BarChart2, Plus } from 'lucide-react';
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

const QUICK_LINKS = [
  { label: 'Requests', icon: Video, page: 'AdminVideoEngineRequests', desc: 'All video requests' },
  { label: 'Templates', icon: FileText, page: 'AdminVideoEngineTemplates', desc: 'Reusable script templates' },
  { label: 'Assets', icon: Layers, page: 'AdminVideoEngineAssets', desc: 'Media & visual library' },
  { label: 'Brand Profiles', icon: Palette, page: 'AdminVideoEngineBrands', desc: 'Brand packages' },
  { label: 'Renders', icon: Play, page: 'AdminVideoEngineRenders', desc: 'Render jobs & output' },
  { label: 'Approvals', icon: CheckCircle, page: 'AdminVideoEngineApprovals', desc: 'Review queue' },
  { label: 'Analytics', icon: BarChart2, page: 'AdminVideoEngineAnalytics', desc: 'Performance tracking' },
];

export default function AdminVideoEngine() {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    base44.entities.VideoRequests.list('-created_date', 10).then(setRequests);
  }, []);

  const statusCounts = requests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Video Generation Engine</h1>
            <p className="text-slate-400 mt-1">End-to-end branded video production pipeline</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> New Video Request
          </Button>
        </div>

        {/* Pipeline Status */}
        <div className="grid grid-cols-5 gap-3 mb-8">
          {['draft', 'script_ready', 'rendering', 'review', 'published'].map(s => (
            <Card key={s} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">{statusCounts[s] || 0}</div>
                <Badge className={`mt-1 text-xs ${STATUS_COLORS[s]}`}>{s.replace('_', ' ')}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {QUICK_LINKS.map(({ label, icon: Icon, page, desc }) => (
            <Link key={page} to={createPageUrl(page)}>
              <Card className="bg-slate-900 border-slate-800 hover:border-blue-600 transition-colors cursor-pointer h-full">
                <CardContent className="p-4">
                  <Icon className="w-6 h-6 text-blue-400 mb-2" />
                  <div className="font-semibold text-white">{label}</div>
                  <div className="text-xs text-slate-400 mt-1">{desc}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Requests */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Requests</h2>
              <Link to={createPageUrl('AdminVideoEngineRequests')}>
                <Button variant="ghost" size="sm" className="text-blue-400">View All</Button>
              </Link>
            </div>
            {requests.length === 0 ? (
              <p className="text-slate-500 text-sm">No video requests yet.</p>
            ) : (
              <div className="space-y-3">
                {requests.map(r => (
                  <Link key={r.id} to={createPageUrl(`AdminVideoEngineRequest?id=${r.id}`)}>
                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                      <div>
                        <div className="font-medium text-white">{r.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{r.request_type?.replace('_', ' ')} · {r.industry || 'General'}</div>
                      </div>
                      <Badge className={`text-xs ${STATUS_COLORS[r.status]}`}>{r.status}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <NewRequestModal open={showModal} onClose={() => setShowModal(false)} onCreated={r => setRequests(prev => [r, ...prev])} />
    </div>
  );
}