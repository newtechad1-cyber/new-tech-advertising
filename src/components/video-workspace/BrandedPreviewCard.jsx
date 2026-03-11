import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Type, Image, Megaphone, Monitor, Square, Smartphone, CheckCircle2, XCircle } from "lucide-react";

const STYLE_LABELS = {
  clean_minimal: "Clean Minimal",
  bold_social: "Bold Social",
  news_broadcast: "News / Broadcast",
  promo_highlight: "Promo Highlight",
};

const STYLE_COLORS = {
  clean_minimal: "bg-slate-700/40 text-slate-300 border-slate-600",
  bold_social: "bg-amber-900/30 text-amber-300 border-amber-700/40",
  news_broadcast: "bg-blue-900/30 text-blue-300 border-blue-700/40",
  promo_highlight: "bg-violet-900/30 text-violet-300 border-violet-700/40",
};

const FORMAT_ICONS = {
  export_landscape: { Icon: Monitor, label: "16:9 Landscape" },
  export_square: { Icon: Square, label: "1:1 Square" },
  export_vertical: { Icon: Smartphone, label: "9:16 Vertical" },
};

function PreviewRow({ icon: IconComp, label, value, active, hint }) {
  const Icon = IconComp;
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? "bg-violet-900/30" : "bg-slate-800/60"}`}>
          <Icon className={`w-3.5 h-3.5 ${active ? "text-violet-400" : "text-slate-600"}`} />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-300">{label}</p>
          {hint && <p className="text-[10px] text-slate-600">{hint}</p>}
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        {value ? (
          <span className="text-xs text-slate-300 font-medium">{value}</span>
        ) : active !== undefined ? (
          active
            ? <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />
            : <XCircle className="w-4 h-4 text-slate-700 ml-auto" />
        ) : null}
      </div>
    </div>
  );
}

export default function BrandedPreviewCard({ video }) {
  const captionStyle = video.caption_style || "clean_minimal";
  const activeFormats = Object.entries(FORMAT_ICONS).filter(([key]) => video[key]).map(([, v]) => v.label);
  const hasBranding = !!(video.primary_logo_url || video.brand_name);
  const hasCaptions = video.captions_status === "completed";

  const readyScore = [
    hasCaptions,
    hasBranding,
    activeFormats.length > 0,
    video.transcript_status === "completed",
    !!(video.show_watermark !== undefined),
  ].filter(Boolean).length;

  const readyPct = Math.round((readyScore / 5) * 100);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
            <Eye className="w-4 h-4 text-violet-400" />
            Branded Video Summary
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${readyPct >= 80 ? "bg-green-500" : readyPct >= 50 ? "bg-amber-500" : "bg-slate-600"}`}
                style={{ width: `${readyPct}%` }}
              />
            </div>
            <span className={`text-xs font-bold ${readyPct >= 80 ? "text-green-400" : readyPct >= 50 ? "text-amber-400" : "text-slate-500"}`}>
              {readyPct}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-0">

        {/* Caption style chip */}
        <div className="mb-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Caption Style</p>
          {hasCaptions ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${STYLE_COLORS[captionStyle] || STYLE_COLORS.clean_minimal}`}>
                {STYLE_LABELS[captionStyle] || captionStyle}
              </span>
              <span className="text-xs text-slate-500">{video.caption_position || "bottom"} · {video.caption_size || "medium"} · {(video.caption_animation || "none").replace("_", " ")}</span>
            </div>
          ) : (
            <span className="text-xs text-slate-600 italic">No captions generated yet</span>
          )}
        </div>

        {/* Logo / brand preview */}
        <div className="mb-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="flex items-center gap-3">
            {video.primary_logo_url ? (
              <img src={video.primary_logo_url} alt="Logo" className="w-12 h-8 object-contain rounded flex-shrink-0 bg-slate-700 p-1" />
            ) : (
              <div className="w-12 h-8 rounded bg-slate-700 flex items-center justify-center flex-shrink-0">
                <Image className="w-4 h-4 text-slate-600" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{video.brand_name || <span className="text-slate-600 italic font-normal">No brand name set</span>}</p>
              {video.tagline && <p className="text-[10px] text-slate-500 truncate">{video.tagline}</p>}
            </div>
            {video.primary_color && (
              <div className="flex-shrink-0 flex items-center gap-1.5 ml-auto">
                <div className="w-4 h-4 rounded-full border border-slate-600" style={{ backgroundColor: video.primary_color }} />
                {video.secondary_color && <div className="w-4 h-4 rounded-full border border-slate-600" style={{ backgroundColor: video.secondary_color }} />}
              </div>
            )}
          </div>
          {(video.website_url || video.phone || video.cta_text) && (
            <div className="mt-2 flex flex-wrap gap-2 pt-2 border-t border-slate-700/50">
              {video.website_url && <span className="text-[10px] text-slate-500 bg-slate-700/40 px-2 py-0.5 rounded-full">{video.website_url.replace(/^https?:\/\//, "")}</span>}
              {video.phone && <span className="text-[10px] text-slate-500 bg-slate-700/40 px-2 py-0.5 rounded-full">{video.phone}</span>}
              {video.cta_text && <span className="text-[10px] text-amber-300 bg-amber-900/20 border border-amber-700/30 px-2 py-0.5 rounded-full">{video.cta_text}</span>}
            </div>
          )}
        </div>

        {/* Feature rows */}
        <PreviewRow icon={Image} label="Logo Watermark" active={!!video.show_watermark}
          hint={video.show_watermark ? `${video.logo_position?.replace("_", " ") || "top right"} · ${video.logo_opacity ?? 80}% opacity` : "Off"} />
        <PreviewRow icon={Megaphone} label="Closing CTA Card" active={!!video.show_closing_cta} />
        <PreviewRow icon={Type} label="Lower Third Intro" active={!!video.show_lower_third} />

        {/* Export formats */}
        <div className="pt-3 mt-1">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Export Formats</p>
          {activeFormats.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {activeFormats.map(f => (
                <span key={f} className="text-[10px] px-2.5 py-1 rounded-full bg-violet-900/20 border border-violet-700/30 text-violet-300 font-medium">
                  {f}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-600 italic">No export format selected</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}