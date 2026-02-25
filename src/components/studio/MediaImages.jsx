import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Trash2, Upload, Search, Copy, Sparkles, Pencil, Loader2 } from 'lucide-react';
import ImageEditor from './ImageEditor';

const USE_FOR = ['social', 'video', 'blog', 'email', 'website'];

export default function MediaImages() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', description: '', tags: '', used_for: [] });
  const [pendingFile, setPendingFile] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [copied, setCopied] = useState(null);
  const [editingImage, setEditingImage] = useState(null);

  // AI generation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [aiName, setAiName] = useState('');
  const [aiTags, setAiTags] = useState('');
  const [aiUsedFor, setAiUsedFor] = useState([]);
  const [savingAi, setSavingAi] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.MediaAsset.filter({ asset_type: 'image' }, '-created_date');
    setAssets(data);
    setLoading(false);
  };

  // --- Upload flow ---
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingFile(file);
    setForm(f => ({ ...f, name: file.name }));
    setShowUploadForm(true);
  };

  const saveUpload = async () => {
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file: pendingFile });
    await base44.entities.MediaAsset.create({
      name: form.name || pendingFile.name,
      url: file_url,
      asset_type: 'image',
      description: form.description,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      used_for: form.used_for
    });
    setForm({ name: '', description: '', tags: '', used_for: [] });
    setPendingFile(null);
    setShowUploadForm(false);
    setUploading(false);
    load();
  };

  // --- AI generation flow ---
  const generateImage = async () => {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    setGeneratedUrl(null);
    const result = await base44.integrations.Core.GenerateImage({ prompt: aiPrompt });
    setGeneratedUrl(result.url);
    setAiName('AI Image - ' + aiPrompt.slice(0, 30));
    setGenerating(false);
  };

  const saveAiImage = async (blobOrNull) => {
    setSavingAi(true);
    let url = generatedUrl;
    if (blobOrNull) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: blobOrNull });
      url = file_url;
    }
    await base44.entities.MediaAsset.create({
      name: aiName || 'AI Generated Image',
      url,
      asset_type: 'image',
      description: aiPrompt,
      tags: aiTags ? aiTags.split(',').map(t => t.trim()) : ['ai-generated'],
      used_for: aiUsedFor
    });
    setGeneratedUrl(null);
    setAiPrompt('');
    setAiName('');
    setAiTags('');
    setAiUsedFor([]);
    setSavingAi(false);
    setEditingImage(null);
    load();
  };

  // --- Shared ---
  const remove = async (id) => { await base44.entities.MediaAsset.delete(id); load(); };

  const copy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleUsedFor = (val, setter, current) => {
    setter(current.includes(val) ? current.filter(v => v !== val) : [...current, val]);
  };

  const filtered = assets.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="ai">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Image Library</h2>
            <p className="text-slate-400 text-sm">{assets.length} images</p>
          </div>
          <TabsList className="bg-slate-800">
            <TabsTrigger value="ai" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-slate-300">
              <Sparkles className="w-4 h-4 mr-1" />AI Generate
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-slate-300">
              <Upload className="w-4 h-4 mr-1" />Upload
            </TabsTrigger>
          </TabsList>
        </div>

        {/* AI Generation Tab */}
        <TabsContent value="ai" className="space-y-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">Describe the image you want</label>
              <Textarea
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g. A professional business owner smiling in front of a modern storefront, warm lighting, photorealistic"
                className="bg-slate-800 border-slate-700 text-white resize-none h-24"
              />
            </div>
            <Button onClick={generateImage} disabled={generating || !aiPrompt.trim()} className="bg-pink-600 hover:bg-pink-700">
              {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate Image</>}
            </Button>

            {generatedUrl && (
              <div className="space-y-4 border-t border-slate-700 pt-4">
                <div className="relative group inline-block">
                  <img src={generatedUrl} alt="Generated" className="rounded-xl max-h-80 object-contain border border-slate-700" />
                  <button
                    onClick={() => setEditingImage(generatedUrl)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2 text-white font-medium"
                  >
                    <Pencil className="w-5 h-5" />Edit / Add Text
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Image Name</label>
                    <Input value={aiName} onChange={e => setAiName(e.target.value)} className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Tags (comma separated)</label>
                    <Input value={aiTags} onChange={e => setAiTags(e.target.value)} placeholder="social, promo" className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-2 block">Use For</label>
                  <div className="flex gap-2 flex-wrap">
                    {USE_FOR.map(u => (
                      <button key={u} onClick={() => toggleUsedFor(u, setAiUsedFor, aiUsedFor)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${aiUsedFor.includes(u) ? 'bg-pink-600 border-pink-600 text-white' : 'border-slate-600 text-slate-400 hover:border-pink-500'}`}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => saveAiImage(null)} disabled={savingAi} className="bg-pink-600 hover:bg-pink-700">
                    {savingAi ? 'Saving...' : 'Save to Library'}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingImage(generatedUrl)} className="border-slate-600 text-slate-300">
                    <Pencil className="w-4 h-4 mr-2" />Edit & Add Text
                  </Button>
                  <Button variant="ghost" onClick={generateImage} disabled={generating} className="text-slate-400">
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <label className="cursor-pointer block">
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-10 text-center hover:border-pink-500 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <p className="text-white font-medium">Click to upload an image</p>
              <p className="text-slate-400 text-sm mt-1">PNG, JPG, GIF, WebP supported</p>
            </div>
          </label>

          {showUploadForm && pendingFile && (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
              <p className="text-slate-300 font-medium">Save: <span className="text-white">{pendingFile.name}</span></p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Display Name</label>
                  <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Tags (comma separated)</label>
                  <Input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="logo, summer" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Use For</label>
                <div className="flex gap-2 flex-wrap">
                  {USE_FOR.map(u => (
                    <button key={u} onClick={() => toggleUsedFor(u, v => setForm(f => ({...f, used_for: v})), form.used_for)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${form.used_for.includes(u) ? 'bg-pink-600 border-pink-600 text-white' : 'border-slate-600 text-slate-400 hover:border-pink-500'}`}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={saveUpload} disabled={uploading} className="bg-pink-600 hover:bg-pink-700">{uploading ? 'Uploading...' : 'Save Image'}</Button>
                <Button variant="ghost" onClick={() => { setShowUploadForm(false); setPendingFile(null); }} className="text-slate-400">Cancel</Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Library */}
      <div className="border-t border-slate-800 pt-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search images..." className="bg-slate-900 border-slate-700 text-white pl-10" />
        </div>

        {loading ? <p className="text-slate-400">Loading...</p> : (
          filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500">No images yet. Generate or upload your first one!</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(a => (
                <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group">
                  <div className="relative">
                    <img src={a.url} alt={a.name} className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="icon" variant="ghost" onClick={() => setEditingImage(a.url)} className="text-white h-8 w-8 bg-white/20" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => copy(a.url, a.id)} className="text-white h-8 w-8 bg-white/20">
                        {copied === a.id ? <span className="text-xs">✓</span> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(a.id)} className="text-red-400 h-8 w-8 bg-white/20"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-medium truncate">{a.name}</p>
                    {a.used_for?.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {a.used_for.map(u => <Badge key={u} className="bg-pink-900/50 text-pink-400 text-xs py-0">{u}</Badge>)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Image Editor Modal */}
      {editingImage && (
        <ImageEditor
          imageUrl={editingImage}
          onSave={(blob) => { saveAiImage(blob); }}
          onClose={() => setEditingImage(null)}
        />
      )}
    </div>
  );
}