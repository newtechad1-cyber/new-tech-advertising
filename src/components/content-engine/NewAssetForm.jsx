import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Zap, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const CONTENT_TYPES = [
  { value: 'authority_pack', label: 'Authority Pack' },
  { value: 'blog_article', label: 'Blog Article' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'service_page', label: 'Service Page' },
  { value: 'video_script', label: 'Video Script' },
];

export default function NewAssetForm({ onCancel, onCreated }) {
  const [form, setForm] = useState({ title: '', content_type: 'blog_article', source_content: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.source_content) {
      toast.error('Title and source content are required');
      return;
    }

    setLoading(true);
    try {
      const asset = await base44.entities.ContentAsset.create({ ...form, status: 'pending' });
      toast.info('Generating all content assets...');
      const res = await base44.functions.invoke('multiplyContent', { asset_id: asset.id });
      if (res.data?.success) {
        toast.success(`Generated ${res.data.assets_generated} assets!`);
        onCreated(asset.id);
      } else {
        toast.error('Generation failed: ' + (res.data?.error || 'Unknown error'));
      }
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">New Content Multiplication</h2>
          <p className="text-sm text-slate-500">Paste your source content and generate 9 marketing assets instantly</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-1">
            <Label>Title *</Label>
            <Input
              placeholder="e.g. HVAC Streaming TV Advertising Guide"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label>Content Type *</Label>
            <Select value={form.content_type} onValueChange={v => setForm(f => ({ ...f, content_type: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Source Content *</Label>
            <p className="text-xs text-slate-500">Paste a blog article, case study, authority pack section, or any content to multiply</p>
            <Textarea
              placeholder="Paste your source content here..."
              value={form.source_content}
              onChange={e => setForm(f => ({ ...f, source_content: e.target.value }))}
              rows={12}
              className="resize-y"
            />
            <p className="text-xs text-slate-400">{form.source_content.length} characters</p>
          </div>
        </CardContent>
      </Card>

      {/* What will be generated */}
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-600">What will be generated from this content:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600">
            {['📝 Blog Article (1,200–1,500 words)', '🎬 YouTube Script (90 sec)', '🎵 3 TikTok Scripts (15–30 sec)', '💼 LinkedIn Post', '📘 5 Facebook Posts + Image Prompts', '📧 Email Newsletter', '📖 Lead Magnet Guide', '🖼️ 6 Image Prompts', '🎥 4 Video Prompts'].map(item => (
              <div key={item} className="flex items-center gap-1.5 bg-white rounded-md px-2 py-1 border border-slate-200">
                {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={loading || !form.title || !form.source_content}
        className="w-full bg-violet-600 hover:bg-violet-700 h-12 text-base"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Generating All Assets... (30–60 sec)
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 mr-2" />
            Generate All 9 Assets
          </>
        )}
      </Button>
    </div>
  );
}