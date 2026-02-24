import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { Plus, Trash2, Wand2, Upload, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = ['general', 'pricing', 'services', 'faq', 'policies', 'contact', 'about'];

export default function KnowledgeBasePanel({ chatbot }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'general', source_type: 'manual' });
  const [aiForm, setAiForm] = useState({ topic: '', context: '' });
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('manual'); // manual | ai | upload

  const load = async () => {
    setLoading(true);
    const all = await base44.entities.ChatbotKnowledge.list();
    // Show global + client-specific for this chatbot
    setEntries(all.filter(k => !k.client_id || k.client_id === chatbot.client_id));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    await base44.entities.ChatbotKnowledge.delete(id);
    setEntries(e => e.filter(x => x.id !== id));
  };

  const handleManualSave = async () => {
    setSaving(true);
    const entry = await base44.entities.ChatbotKnowledge.create({
      ...form,
      source_type: 'manual',
      client_id: chatbot.client_id || null,
    });
    setEntries(e => [entry, ...e]);
    setForm({ title: '', content: '', category: 'general', source_type: 'manual' });
    setShowAdd(false);
    setSaving(false);
  };

  const handleAiGenerate = async () => {
    setAiLoading(true);
    const res = await base44.functions.invoke('chatbotGenerateKnowledge', {
      topic: aiForm.topic,
      context: aiForm.context,
      category: form.category,
      client_id: chatbot.client_id || null,
    });
    if (res.data?.entry) {
      setEntries(e => [res.data.entry, ...e]);
      setAiForm({ topic: '', context: '' });
      setShowAdd(false);
    }
    setAiLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
      file_url,
      json_schema: {
        type: 'object',
        properties: {
          entries: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                content: { type: 'string' },
                category: { type: 'string' }
              }
            }
          }
        }
      }
    });

    if (result.status === 'success' && result.output?.entries) {
      for (const item of result.output.entries) {
        const entry = await base44.entities.ChatbotKnowledge.create({
          title: item.title || 'Imported Entry',
          content: item.content,
          category: item.category || 'general',
          source_type: 'document',
          document_url: file_url,
          client_id: chatbot.client_id || null,
        });
        setEntries(e => [entry, ...e]);
      }
    } else {
      // Fallback: store the whole file as a single entry
      const entry = await base44.entities.ChatbotKnowledge.create({
        title: file.name,
        content: `Uploaded document: ${file_url}`,
        source_type: 'document',
        document_url: file_url,
        category: 'general',
        client_id: chatbot.client_id || null,
      });
      setEntries(e => [entry, ...e]);
    }
    setSaving(false);
    setShowAdd(false);
  };

  const sourceColors = {
    manual: 'bg-blue-100 text-blue-700',
    ai_generated: 'bg-purple-100 text-purple-700',
    document: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">{entries.length} knowledge entries</p>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Knowledge
        </Button>
      </div>

      {showAdd && (
        <div className="border rounded-xl p-4 bg-slate-50 space-y-3">
          <div className="flex gap-2">
            {[
              { id: 'manual', label: 'Manual', icon: FileText },
              { id: 'ai', label: 'AI Generate', icon: Wand2 },
              { id: 'upload', label: 'Upload File', icon: Upload },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${tab === t.id ? 'bg-white shadow text-slate-900 border' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <t.icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            ))}
          </div>

          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
              <SelectTrigger className="mt-1 w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {tab === 'manual' && (
            <>
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1" placeholder="e.g. Our Pricing Plans" />
              </div>
              <div>
                <Label>Content</Label>
                <Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="mt-1 h-28" placeholder="Write the FAQ answer, service description, policy, etc." />
              </div>
              <Button size="sm" onClick={handleManualSave} disabled={saving || !form.title || !form.content}>
                {saving ? 'Saving...' : 'Save Entry'}
              </Button>
            </>
          )}

          {tab === 'ai' && (
            <>
              <div>
                <Label>Topic to Generate</Label>
                <Input value={aiForm.topic} onChange={e => setAiForm(f => ({ ...f, topic: e.target.value }))} className="mt-1" placeholder="e.g. Our refund policy, Service pricing, How we work" />
              </div>
              <div>
                <Label>Additional Context <span className="text-slate-400 text-xs">(optional)</span></Label>
                <Textarea value={aiForm.context} onChange={e => setAiForm(f => ({ ...f, context: e.target.value }))} className="mt-1 h-20" placeholder="Any specific details to include..." />
              </div>
              <Button size="sm" onClick={handleAiGenerate} disabled={aiLoading || !aiForm.topic} className="gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />
                {aiLoading ? 'Generating...' : 'Generate with AI'}
              </Button>
            </>
          )}

          {tab === 'upload' && (
            <div>
              <Label>Upload PDF, DOCX, CSV, or TXT</Label>
              <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 mb-2">AI will extract FAQ & knowledge from your file</p>
                <label className="cursor-pointer">
                  <span className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-700">
                    {saving ? 'Processing...' : 'Choose File'}
                  </span>
                  <input type="file" className="hidden" accept=".pdf,.docx,.csv,.txt,.xlsx" onChange={handleFileUpload} disabled={saving} />
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">No knowledge entries yet. Add your first one above.</div>
      ) : (
        <div className="space-y-2">
          {entries.map(entry => (
            <div key={entry.id} className="border rounded-lg bg-white overflow-hidden">
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50"
                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Badge className={`text-xs shrink-0 ${sourceColors[entry.source_type] || 'bg-slate-100 text-slate-600'}`}>
                    {entry.source_type?.replace('_', ' ')}
                  </Badge>
                  {entry.category && (
                    <Badge variant="outline" className="text-xs shrink-0">{entry.category}</Badge>
                  )}
                  <span className="text-sm font-medium text-slate-900 truncate">{entry.title}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={e => { e.stopPropagation(); handleDelete(entry.id); }} className="p-1.5 hover:text-red-500 text-slate-400 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {expanded === entry.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>
              {expanded === entry.id && (
                <div className="px-3 pb-3 pt-1 border-t bg-slate-50">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{entry.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}