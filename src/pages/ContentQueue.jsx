import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Copy, ArrowLeft, Calendar, ChevronDown, ChevronRight, Pencil, CheckCircle } from 'lucide-react';

const STATUS_COLORS = {
  planned: 'bg-slate-100 text-slate-700',
  generated: 'bg-blue-100 text-blue-700',
  approved: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700'
};

const FORMAT_COLORS = {
  blog: 'bg-purple-100 text-purple-700',
  social: 'bg-pink-100 text-pink-700',
  video: 'bg-orange-100 text-orange-700',
  email: 'bg-teal-100 text-teal-700'
};

const META_FIELDS = [
  { key: 'meta_title', label: 'Meta Title' },
  { key: 'meta_description', label: 'Meta Description' },
  { key: 'linkedin_post', label: 'LinkedIn Post' },
  { key: 'facebook_post', label: 'Facebook Post' },
  { key: 'video_script', label: 'Video Script' },
  { key: 'faq_schema', label: 'FAQ Schema' },
  { key: 'internal_links', label: 'Internal Links' },
  { key: 'image_prompts', label: 'Image Prompts' }
];

function copyText(text) {
  navigator.clipboard.writeText(typeof text === 'object' ? JSON.stringify(text, null, 2) : text);
  toast.success('Copied!');
}

export default function ContentQueue() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'all', format: 'all' });
  const [selected, setSelected] = useState(null);
  const [expandedDates, setExpandedDates] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [metaExpanded, setMetaExpanded] = useState(false);

  useEffect(() => {
    loadItems();
    base44.auth.me().then(u => setIsAdmin(u?.role === 'admin')).catch(() => {});
  }, []);

  const loadItems = async () => {
    try {
      const data = await base44.entities.ContentQueue.list('-publish_date');
      setItems(data);
    } catch { toast.error('Failed to load content queue'); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await base44.entities.ContentQueue.update(id, { status });
      toast.success('Status updated');
      loadItems();
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = items.filter(item => {
    if (filters.status !== 'all' && item.status !== filters.status) return false;
    if (filters.format !== 'all' && item.format !== filters.format) return false;
    return true;
  });

  // Group by publish_date
  const grouped = filtered.reduce((acc, item) => {
    const date = item.publish_date || 'No Date';
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  if (selected) return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setSelected(null)}><ArrowLeft className="w-4 h-4" /></Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">{selected.topic}</h1>
          <p className="text-sm text-slate-500">{selected.publish_date} · {selected.pillar}</p>
        </div>
        <Select value={selected.status} onValueChange={v => handleStatusChange(selected.id, v)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['planned','generated','approved','published','failed'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge className={STATUS_COLORS[selected.status]}>{selected.status}</Badge>
        <Badge className={FORMAT_COLORS[selected.format]}>{selected.format}</Badge>
        {selected.keyword && <Badge variant="outline">🔑 {selected.keyword}</Badge>}
        {selected.publish_url && <a href={selected.publish_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">{selected.publish_url}</a>}
      </div>

      {selected.last_error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4 text-sm text-red-700 whitespace-pre-wrap">{selected.last_error}</CardContent>
        </Card>
      )}

      {selected.content && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Content</CardTitle>
            <Button size="sm" variant="outline" onClick={() => copyText(selected.content)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
          </CardHeader>
          <CardContent><p className="text-sm text-slate-700 whitespace-pre-wrap max-h-96 overflow-y-auto">{selected.content}</p></CardContent>
        </Card>
      )}

      {selected.meta && Object.keys(selected.meta).length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Meta & Assets</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {META_FIELDS.map(({ key, label }) => {
              const val = selected.meta[key];
              if (!val || (Array.isArray(val) && val.length === 0)) return null;
              const display = typeof val === 'object' ? JSON.stringify(val, null, 2) : val;
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => copyText(val)}><Copy className="w-3 h-3 mr-1" />Copy</Button>
                  </div>
                  <pre className="bg-slate-50 border rounded p-3 text-xs text-slate-700 whitespace-pre-wrap max-h-48 overflow-auto">{display}</pre>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6" /> Content Queue
        </h1>
        <div className="flex gap-2">
          <Select value={filters.status} onValueChange={v => setFilters({ ...filters, status: v })}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {['planned','generated','approved','published','failed'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.format} onValueChange={v => setFilters({ ...filters, format: v })}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Format" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              {['blog','social','video','email'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedDates.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-lg text-slate-500">No content items found.</div>
      )}

      <div className="space-y-4">
        {sortedDates.map(date => {
          const expanded = expandedDates[date] !== false;
          const dayItems = grouped[date];
          return (
            <div key={date} className="border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 text-left"
                onClick={() => setExpandedDates(prev => ({ ...prev, [date]: !expanded }))}
              >
                <span className="font-semibold text-slate-800">{date === 'No Date' ? 'No Date' : new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center gap-2 text-slate-400 text-sm">
                  {dayItems.length} item{dayItems.length !== 1 ? 's' : ''}
                  {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </span>
              </button>
              {expanded && (
                <div className="divide-y">
                  {dayItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 cursor-pointer" onClick={() => setSelected(item)}>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-900 truncate">{item.topic}</p>
                        {item.pillar && <p className="text-xs text-slate-400 truncate">{item.pillar}{item.keyword ? ` · ${item.keyword}` : ''}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className={`text-xs ${FORMAT_COLORS[item.format]}`}>{item.format}</Badge>
                        <Badge className={`text-xs ${STATUS_COLORS[item.status]}`}>{item.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}