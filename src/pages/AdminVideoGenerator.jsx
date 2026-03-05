import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Tv, Sparkles, Play, Copy, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const PLACEMENT_OPTIONS = [
  { value: 'homepage_hero', label: 'Homepage Hero' },
  { value: 'homepage_video_section', label: 'Homepage Video Section' },
  { value: 'streaming_tv_landing', label: 'Streaming TV Landing Page' },
  { value: 'social_media_landing', label: 'Social Media Landing Page' },
  { value: 'hvac_landing', label: 'HVAC Landing Page' },
  { value: 'restaurant_landing', label: 'Restaurant Landing Page' },
];

const BUSINESS_PRESETS = [
  { label: 'NTA Platform Demo', businessName: 'New Tech Advertising', businessType: 'AI marketing platform for small businesses', audience: 'local small business owners', tone: 'professional and approachable' },
  { label: 'HVAC Business', businessName: 'Your HVAC Company', businessType: 'heating and cooling service company', audience: 'homeowners needing HVAC service', tone: 'trustworthy and local' },
  { label: 'Restaurant', businessName: 'Your Restaurant', businessType: 'local restaurant', audience: 'local food lovers and families', tone: 'warm and inviting' },
  { label: 'Local Service Business', businessName: 'Your Business', businessType: 'local service business', audience: 'local homeowners and residents', tone: 'friendly and professional' },
];

export default function AdminVideoGenerator() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    preset: '',
    businessName: 'New Tech Advertising',
    businessType: 'AI marketing platform for small businesses',
    audience: 'local small business owners',
    tone: 'professional and approachable',
    offer: 'Start a free 7-day trial',
    duration: '30s',
    placement: 'homepage_hero',
    customNotes: '',
  });

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setLoading(false);
      if (u?.role !== 'admin') window.location.href = createPageUrl('Home');
    }).catch(() => setLoading(false));
  }, []);

  const applyPreset = (presetLabel) => {
    const p = BUSINESS_PRESETS.find(b => b.label === presetLabel);
    if (p) setForm(f => ({ ...f, preset: presetLabel, businessName: p.businessName, businessType: p.businessType, audience: p.audience, tone: p.tone }));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);
    setError('');
    try {
      const prompt = `Generate a streaming TV ad script for the following business:

Business Name: ${form.businessName}
Business Type: ${form.businessType}
Target Audience: ${form.audience}
Brand Tone: ${form.tone}
Duration: ${form.duration}
Primary Offer/CTA: ${form.offer}
Page Placement: ${form.placement}
${form.customNotes ? `Additional Notes: ${form.customNotes}` : ''}

This ad will be used on the NTA platform website at placement: ${form.placement} — to demonstrate what the platform can produce for clients like this business.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            duration: { type: 'string' },
            target_audience: { type: 'string' },
            hook: { type: 'string' },
            script: { type: 'string' },
            scene_directions: { type: 'array', items: { type: 'string' } },
            on_screen_text: { type: 'array', items: { type: 'string' } },
            cta: { type: 'string' },
            music_mood: { type: 'string' },
            image_prompts: { type: 'array', items: { type: 'string' } },
          },
        },
      });
      setResult(response);
    } catch (err) {
      setError('Generation failed: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const copyScript = () => {
    if (!result?.script) return;
    navigator.clipboard.writeText(result.script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openVideoStudio = () => {
    window.location.href = createPageUrl('AiVideoStudio');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center gap-4">
        <Link to={createPageUrl('AdminDashboard')}>
          <Button variant="ghost" size="sm" className="gap-1 text-slate-500"><ArrowLeft className="w-4 h-4" /> Admin Hub</Button>
        </Link>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-2">
          <Tv className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-slate-800">Streaming TV Video Generator</span>
        </div>
        <Badge className="bg-purple-100 text-purple-700 ml-2">Admin Only</Badge>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Generate Streaming TV Ad Scripts</h1>
          <p className="text-slate-500">Use AI to create professional video ad scripts for your homepage and landing pages — then take them to the AI Video Studio to produce the actual video.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Presets</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {BUSINESS_PRESETS.map(p => (
                  <Button
                    key={p.label}
                    variant={form.preset === p.label ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => applyPreset(p.label)}
                  >
                    {p.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Ad Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Business Name</label>
                  <Input value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Business Type</label>
                  <Input value={form.businessType} onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Target Audience</label>
                  <Input value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Brand Tone</label>
                  <Input value={form.tone} onChange={e => setForm(f => ({ ...f, tone: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Primary Offer / CTA</label>
                  <Input value={form.offer} onChange={e => setForm(f => ({ ...f, offer: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Duration</label>
                    <Select value={form.duration} onValueChange={v => setForm(f => ({ ...f, duration: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15s">15 seconds</SelectItem>
                        <SelectItem value="30s">30 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Page Placement</label>
                    <Select value={form.placement} onValueChange={v => setForm(f => ({ ...f, placement: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PLACEMENT_OPTIONS.map(o => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Additional Notes (optional)</label>
                  <Textarea value={form.customNotes} onChange={e => setForm(f => ({ ...f, customNotes: e.target.value }))} placeholder="Any specific messaging, offers, or requirements..." rows={2} />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleGenerate} disabled={generating} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 gap-2">
              {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Script...</> : <><Sparkles className="w-4 h-4" /> Generate TV Ad Script</>}
            </Button>

            {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
          </div>

          {/* Result */}
          <div>
            {!result && !generating && (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl h-full min-h-64 flex flex-col items-center justify-center text-slate-400 p-8">
                <Tv className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm text-center">Your AI-generated streaming TV ad script will appear here. Fill in the details and click Generate.</p>
              </div>
            )}

            {generating && (
              <div className="bg-white border border-slate-200 rounded-xl h-full min-h-64 flex flex-col items-center justify-center gap-4 p-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <p className="text-slate-500 text-sm">Writing your TV ad script...</p>
              </div>
            )}

            {result && !generating && (
              <div className="space-y-4">
                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-purple-900 text-lg">{result.title}</h3>
                      <Badge className="bg-purple-600 text-white">{result.duration}</Badge>
                    </div>
                    <p className="text-xs text-purple-700 mb-1"><span className="font-semibold">Audience:</span> {result.target_audience}</p>
                    <p className="text-xs text-purple-700"><span className="font-semibold">Music Mood:</span> {result.music_mood}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-slate-700">🎙️ Hook</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-800 font-medium italic">"{result.hook}"</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-slate-700">📜 Full Script</CardTitle>
                      <Button variant="ghost" size="sm" onClick={copyScript} className="gap-1 text-xs h-7">
                        {copied ? <><CheckCircle className="w-3 h-3 text-green-600" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{result.script}</p>
                  </CardContent>
                </Card>

                {result.scene_directions?.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-700">🎬 Scene Directions</CardTitle></CardHeader>
                    <CardContent>
                      <ol className="space-y-2">
                        {result.scene_directions.map((s, i) => (
                          <li key={i} className="text-sm text-slate-600 flex gap-2"><span className="font-bold text-slate-400 shrink-0">{i + 1}.</span>{s}</li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                )}

                {result.on_screen_text?.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-700">📺 On-Screen Text Overlays</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {result.on_screen_text.map((t, i) => (
                          <li key={i} className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded font-mono">{t}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-4">
                    <p className="text-xs font-bold text-blue-700 uppercase mb-1">Closing CTA</p>
                    <p className="text-blue-900 font-semibold">{result.cta}</p>
                  </CardContent>
                </Card>

                <Button onClick={openVideoStudio} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2">
                  <Play className="w-4 h-4" /> Take This Script to AI Video Studio →
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}