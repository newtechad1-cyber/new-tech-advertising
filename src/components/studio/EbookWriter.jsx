import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, CheckCircle, Circle, Sparkles, Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill';

export default function EbookWriter() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ebook_title: '', chapter_number: 1, chapter_title: '', content: '', status: 'draft', notes: '' });
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.EbookChapter.list('-chapter_number');
    setChapters(data);
    setLoading(false);
  };

  const save = async () => {
    if (editing) {
      await base44.entities.EbookChapter.update(editing.id, form);
    } else {
      await base44.entities.EbookChapter.create(form);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ ebook_title: '', chapter_number: 1, chapter_title: '', content: '', status: 'draft', notes: '' });
    load();
  };

  const remove = async (id) => {
    await base44.entities.EbookChapter.delete(id);
    load();
  };

  const startEdit = (ch) => {
    setEditing(ch);
    setForm({ ebook_title: ch.ebook_title, chapter_number: ch.chapter_number, chapter_title: ch.chapter_title, content: ch.content, status: ch.status, notes: ch.notes || '' });
    setShowForm(true);
  };

  const generateWithAI = async () => {
    if (!form.chapter_title) return;
    setAiGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a detailed, well-structured chapter for an ebook.
Ebook title: "${form.ebook_title || 'Untitled Ebook'}"
Chapter number: ${form.chapter_number}
Chapter title: "${form.chapter_title}"
${form.notes ? `Additional notes/context: ${form.notes}` : ''}

Write a comprehensive chapter with an introduction, several sections with subheadings, practical tips or examples, and a conclusion. Format it in HTML using <h2>, <h3>, <p>, <ul>, <li> tags. Make it engaging and informative.`,
    });
    setForm(f => ({ ...f, content: result }));
    setAiGenerating(false);
  };

  const grouped = chapters.reduce((acc, ch) => {
    if (!acc[ch.ebook_title]) acc[ch.ebook_title] = [];
    acc[ch.ebook_title].push(ch);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Ebook Chapters</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ ebook_title: '', chapter_number: 1, chapter_title: '', content: '', status: 'draft', notes: '' }); }} className="bg-violet-600 hover:bg-violet-700">
          <Plus className="w-4 h-4 mr-2" /> New Chapter
        </Button>
      </div>

      {showForm && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Ebook Title</label>
              <Input value={form.ebook_title} onChange={e => setForm({...form, ebook_title: e.target.value})} placeholder="e.g. Marketing Mastery" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Chapter #</label>
              <Input type="number" value={form.chapter_number} onChange={e => setForm({...form, chapter_number: parseInt(e.target.value)})} className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Chapter Title</label>
            <Input value={form.chapter_title} onChange={e => setForm({...form, chapter_title: e.target.value})} placeholder="Chapter title..." className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Content</label>
            <div className="bg-white rounded-lg">
              <ReactQuill value={form.content} onChange={val => setForm({...form, content: val})} style={{ minHeight: '200px' }} />
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Internal Notes</label>
            <Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Notes for yourself..." className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div className="flex gap-3">
            <Button onClick={save} className="bg-violet-600 hover:bg-violet-700">{editing ? 'Update' : 'Save'} Chapter</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="text-slate-400">Cancel</Button>
            {editing && <Button variant="ghost" onClick={() => { setForm({...form, status: form.status === 'complete' ? 'draft' : 'complete'}); }}>{form.status === 'complete' ? 'Mark Draft' : 'Mark Complete'}</Button>}
          </div>
        </div>
      )}

      {loading ? <p className="text-slate-400">Loading...</p> : (
        Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 text-slate-500">No chapters yet. Create your first one!</div>
        ) : (
          Object.entries(grouped).map(([title, chs]) => (
            <div key={title} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-white text-lg">{title}</h3>
                <Badge className="bg-violet-600">{chs.length} chapters</Badge>
              </div>
              <div className="divide-y divide-slate-800">
                {chs.sort((a,b) => a.chapter_number - b.chapter_number).map(ch => (
                  <div key={ch.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {ch.status === 'complete' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-slate-600" />}
                        <span className="text-slate-400 text-sm">Ch. {ch.chapter_number}</span>
                        <span className="text-white font-medium">{ch.chapter_title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={ch.status === 'complete' ? 'border-green-500 text-green-500' : 'border-slate-600 text-slate-400'}>{ch.status}</Badge>
                        <Button size="icon" variant="ghost" onClick={() => setExpandedId(expandedId === ch.id ? null : ch.id)} className="text-slate-400 h-8 w-8">
                          {expandedId === ch.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => startEdit(ch)} className="text-slate-400 h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(ch.id)} className="text-red-500 h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                    {expandedId === ch.id && ch.content && (
                      <div className="mt-4 pl-8 text-slate-300 text-sm prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: ch.content }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
}