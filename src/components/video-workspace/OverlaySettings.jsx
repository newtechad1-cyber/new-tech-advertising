import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Layers } from "lucide-react";

const OVERLAY_TOGGLES = [
  { key: "show_watermark", label: "Logo Watermark", desc: "Persistent brand logo overlay" },
  { key: "show_lower_third", label: "Lower Third Intro", desc: "Name/title bar at bottom" },
  { key: "show_closing_cta", label: "Closing CTA Card", desc: "Final screen with action prompt" },
  { key: "show_website", label: "Website URL", desc: "Show site address overlay" },
  { key: "show_phone", label: "Phone Number", desc: "Show phone number overlay" },
  { key: "show_cta_banner", label: "CTA Banner", desc: "Banner with call-to-action text" },
];

const LOGO_POSITIONS = [
  { value: "top_left", label: "Top Left" },
  { value: "top_right", label: "Top Right" },
  { value: "bottom_left", label: "Bottom Left" },
  { value: "bottom_right", label: "Bottom Right" },
];

export default function OverlaySettings({ video, onChange }) {
  const activeCount = OVERLAY_TOGGLES.filter(t => video[t.key]).length;

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-400" />
            Branded Overlays
          </CardTitle>
          {activeCount > 0 && (
            <span className="text-[10px] text-violet-400 font-medium">{activeCount} active</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* Toggle rows */}
        <div className="space-y-2">
          {OVERLAY_TOGGLES.map(({ key, label, desc }) => (
            <div key={key} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              video[key] ? "bg-violet-900/10 border-violet-700/30" : "bg-slate-800/40 border-slate-700/50"
            }`}>
              <div>
                <p className="text-sm text-slate-200 font-medium">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
              <Switch
                checked={!!video[key]}
                onCheckedChange={(checked) => onChange({ [key]: checked })}
              />
            </div>
          ))}
        </div>

        {/* Logo positioning — only shown when watermark is on */}
        {video.show_watermark && (
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Watermark Position</p>
              <div className="grid grid-cols-2 gap-2">
                {LOGO_POSITIONS.map(pos => (
                  <button
                    key={pos.value}
                    onClick={() => onChange({ logo_position: pos.value })}
                    className={`text-xs px-3 py-2.5 rounded-lg border font-medium transition-all ${
                      video.logo_position === pos.value
                        ? "bg-violet-600/20 border-violet-500/50 text-violet-300"
                        : "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Logo Opacity</p>
                <span className="text-sm font-bold text-slate-300">{video.logo_opacity ?? 80}%</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={video.logo_opacity ?? 80}
                  onChange={(e) => onChange({ logo_opacity: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-violet-500"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-slate-600">10%</span>
                  <span className="text-[10px] text-slate-600">100%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}