import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Upload, X, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const LOGO_FIELDS = [
  { key: "primary_logo_url", label: "Primary Logo", hint: "Main brand logo" },
  { key: "secondary_logo_url", label: "Secondary Logo", hint: "Alt logo or icon" },
  { key: "watermark_logo_url", label: "Watermark Logo", hint: "Light/transparent version" },
  { key: "intro_image_url", label: "Brand Intro", hint: "Opening frame image" },
  { key: "outro_image_url", label: "Brand Outro", hint: "Closing frame image" },
];

function LogoUploadSlot({ label, hint, value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange(file_url);
    setUploading(false);
  };

  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0">
      {/* Preview */}
      <div className="w-11 h-11 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {value
          ? <img src={value} alt={label} className="w-full h-full object-contain p-1" />
          : <Palette className="w-4 h-4 text-slate-600" />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-slate-300">{label}</p>
          {value && <CheckCircle2 className="w-3 h-3 text-green-400" />}
        </div>
        <p className="text-[10px] text-slate-600">{hint}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <label className="cursor-pointer">
          <span className="inline-flex items-center gap-1 border border-slate-700 hover:border-violet-500/60 text-slate-500 hover:text-slate-300 text-[10px] px-2 py-1 rounded-md transition-all bg-slate-800/50 cursor-pointer">
            <Upload className="w-3 h-3" />
            {uploading ? "..." : value ? "Replace" : "Upload"}
          </span>
          <input type="file" accept="image/*,image/png,image/svg+xml" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
        {value && (
          <button onClick={() => onChange("")} className="p-1 text-slate-700 hover:text-slate-400 rounded transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function BrandingPanel({ video, onChange }) {
  const logoCount = [
    video.primary_logo_url, video.secondary_logo_url, video.watermark_logo_url,
    video.intro_image_url, video.outro_image_url
  ].filter(Boolean).length;

  const brandingComplete = !!(video.brand_name && video.primary_color);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
            <Palette className="w-4 h-4 text-violet-400" />
            Branding Assets
          </CardTitle>
          <div className="flex items-center gap-2">
            {logoCount > 0 && (
              <span className="text-[10px] text-violet-400 font-medium">{logoCount} asset{logoCount > 1 ? "s" : ""} set</span>
            )}
            {brandingComplete && <span className="text-[10px] text-green-400 font-medium">✓ Brand info set</span>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* Logo uploads */}
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-3">Logo & Visual Assets</p>
          <div>
            {LOGO_FIELDS.map(({ key, label, hint }) => (
              <LogoUploadSlot
                key={key}
                label={label}
                hint={hint}
                value={video[key] || ""}
                onChange={(url) => onChange({ [key]: url })}
              />
            ))}
          </div>
        </div>

        {/* Brand info fields */}
        <div className="space-y-3 pt-1 border-t border-slate-800">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Brand Identity</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs text-slate-500 mb-1 block">Brand Name</Label>
              <Input value={video.brand_name || ""} onChange={(e) => onChange({ brand_name: e.target.value })}
                placeholder="Your Company Name"
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 text-sm focus:border-violet-500" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs text-slate-500 mb-1 block">Tagline</Label>
              <Input value={video.tagline || ""} onChange={(e) => onChange({ tagline: e.target.value })}
                placeholder="Your brand tagline"
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 text-sm focus:border-violet-500" />
            </div>

            <div>
              <Label className="text-xs text-slate-500 mb-1 block">Primary Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={video.primary_color || "#7c3aed"}
                  onChange={(e) => onChange({ primary_color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent flex-shrink-0" />
                <Input value={video.primary_color || ""} onChange={(e) => onChange({ primary_color: e.target.value })}
                  placeholder="#7c3aed"
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 text-sm focus:border-violet-500" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-500 mb-1 block">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={video.secondary_color || "#0ea5e9"}
                  onChange={(e) => onChange({ secondary_color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent flex-shrink-0" />
                <Input value={video.secondary_color || ""} onChange={(e) => onChange({ secondary_color: e.target.value })}
                  placeholder="#0ea5e9"
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 text-sm focus:border-violet-500" />
              </div>
            </div>

            <div className="col-span-2">
              <Label className="text-xs text-slate-500 mb-1 block">Website URL</Label>
              <Input value={video.website_url || ""} onChange={(e) => onChange({ website_url: e.target.value })}
                placeholder="https://yoursite.com"
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 text-sm focus:border-violet-500" />
            </div>
            <div>
              <Label className="text-xs text-slate-500 mb-1 block">Phone Number</Label>
              <Input value={video.phone || ""} onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 text-sm focus:border-violet-500" />
            </div>
            <div>
              <Label className="text-xs text-slate-500 mb-1 block">CTA Text</Label>
              <Input value={video.cta_text || ""} onChange={(e) => onChange({ cta_text: e.target.value })}
                placeholder="Call Now · Free Estimate"
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-600 text-sm focus:border-violet-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}