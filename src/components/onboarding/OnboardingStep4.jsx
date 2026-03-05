import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { Upload, Loader2, CheckCircle } from 'lucide-react';

const VOICES = [
  { value: 'professional', label: '👔 Professional', desc: 'Polished, expert, authoritative' },
  { value: 'friendly',     label: '😊 Friendly',     desc: 'Warm, approachable, conversational' },
  { value: 'bold',         label: '🔥 Bold',          desc: 'Direct, energetic, confident' },
  { value: 'fun',          label: '🎉 Fun',           desc: 'Playful, casual, entertaining' },
];

export default function OnboardingStep4({ data, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange({ ...data, logo_url: file_url });
    setUploading(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <Label className="block mb-2">Brand Voice *</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VOICES.map(v => (
            <button
              key={v.value}
              type="button"
              onClick={() => onChange({ ...data, brand_voice: v.value })}
              className={`text-left px-4 py-3 rounded-xl border-2 transition-all ${data.brand_voice === v.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
            >
              <p className="font-medium text-slate-800">{v.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{v.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Brand Colors</Label>
        <Input
          placeholder="e.g. Blue #1E40AF, Orange #F97316"
          value={data.brand_colors || ''}
          onChange={(e) => onChange({ ...data, brand_colors: e.target.value })}
          className="mt-1"
        />
        <p className="text-xs text-slate-400 mt-1">Describe your colors — hex codes, names, or both</p>
      </div>

      <div>
        <Label>Logo Upload (optional)</Label>
        <label className={`mt-1 flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${data.logo_url ? 'border-green-300 bg-green-50' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'}`}>
          <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          ) : data.logo_url ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Upload className="w-5 h-5 text-slate-400" />
          )}
          <span className="text-sm text-slate-600">
            {uploading ? 'Uploading…' : data.logo_url ? 'Logo uploaded ✓' : 'Click to upload logo'}
          </span>
        </label>
      </div>
    </div>
  );
}