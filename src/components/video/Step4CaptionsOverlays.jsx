import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Subtitles, Upload, Image, Loader2, X, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Step4CaptionsOverlays({ state, setState, onBack, onNext }) {
  const enableCaptions = Object.values(state.captions || {}).some(c => c === true || c === "true" || c === "enabled");
  const [uploading, setUploading] = useState(false);
  const [outroUploading, setOutroUploading] = useState(false);

  const toggleCaptions = (val) => {
    setState(s => ({ ...s, captions: val ? { enabled: true } : {} }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setState(s => ({ ...s, overlays: { ...s.overlays, logo_url: file_url } }));
    } finally {
      setUploading(false);
    }
  };

  const handleOutroLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOutroUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setState(s => ({ ...s, overlays: { ...s.overlays, outro_logo_url: file_url } }));
    } finally {
      setOutroUploading(false);
    }
  };

  const removeLogo = () => setState(s => ({ ...s, overlays: { ...s.overlays, logo_url: null } }));
  const removeOutroLogo = () => setState(s => ({ ...s, overlays: { ...s.overlays, outro_logo_url: null } }));

  const logoUrl = state.overlays?.logo_url;
  const outroLogoUrl = state.overlays?.outro_logo_url;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Step 4: Captions & Overlays</h2>
        <p className="text-sm text-gray-500">
          Add auto-captions and upload a logo to overlay on your video or add a branded end card.
        </p>
      </div>

      {/* Captions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-4">
        <Subtitles className="w-6 h-6 text-blue-500 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-gray-800 mb-1">Auto-Captions</p>
          <p className="text-sm text-gray-500 mb-4">
            HeyGen will automatically generate synchronized captions based on the spoken audio.
          </p>
          <div className="flex items-center gap-3">
            <Switch
              id="captions-toggle"
              checked={enableCaptions}
              onCheckedChange={toggleCaptions}
            />
            <Label htmlFor="captions-toggle" className="text-sm font-medium cursor-pointer">
              {enableCaptions ? "Captions enabled" : "Captions disabled"}
            </Label>
          </div>
        </div>
      </div>

      {/* Logo Overlay */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
        <Image className="w-6 h-6 text-slate-500 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-gray-800 mb-1">Logo Overlay</p>
          <p className="text-sm text-gray-500 mb-4">
            Upload a PNG logo (transparent background recommended). It will appear in the bottom-right corner throughout the video.
          </p>
          {logoUrl ? (
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Logo preview" className="h-12 w-auto object-contain border rounded bg-white p-1" />
              <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Logo uploaded</span>
              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 h-7 px-2" onClick={removeLogo}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <Input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 transition-colors w-fit">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin text-slate-500" /> : <Upload className="w-4 h-4 text-slate-500" />}
                <span className="text-sm text-slate-600">{uploading ? "Uploading..." : "Upload Logo (PNG)"}</span>
              </div>
            </label>
          )}
        </div>
      </div>

      {/* Outro / End Card Logo */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
        <Image className="w-6 h-6 text-purple-500 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-gray-800 mb-1">Outro / End Card Logo</p>
          <p className="text-sm text-gray-500 mb-4">
            Upload a logo or image to display as a final branded end card slide appended to the end of your video.
          </p>
          {outroLogoUrl ? (
            <div className="flex items-center gap-3">
              <img src={outroLogoUrl} alt="Outro logo preview" className="h-12 w-auto object-contain border rounded bg-white p-1" />
              <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Outro logo uploaded</span>
              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 h-7 px-2" onClick={removeOutroLogo}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <Input type="file" accept="image/*" className="hidden" onChange={handleOutroLogoUpload} />
              <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg hover:border-purple-400 transition-colors w-fit">
                {outroUploading ? <Loader2 className="w-4 h-4 animate-spin text-slate-500" /> : <Upload className="w-4 h-4 text-slate-500" />}
                <span className="text-sm text-slate-600">{outroUploading ? "Uploading..." : "Upload Outro Logo (PNG)"}</span>
              </div>
            </label>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
          Next: Review & Create →
        </Button>
      </div>
    </div>
  );
}