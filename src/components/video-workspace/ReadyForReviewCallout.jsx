import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Send, Eye, Type, Palette, Megaphone, Globe, Facebook, Instagram, Youtube, Smartphone, Building2 } from "lucide-react";

const STYLE_LABELS = {
  clean_minimal: "Clean Minimal",
  bold_social: "Bold Social",
  news_broadcast: "News / Broadcast",
  promo_highlight: "Promo Highlight",
};

const DEST_ICONS = {
  website_publish_enabled: Globe,
  facebook_publish_enabled: Facebook,
  instagram_publish_enabled: Instagram,
  youtube_publish_enabled: Youtube,
  tiktok_publish_enabled: Smartphone,
  gbp_publish_enabled: Building2,
};
const DEST_LABELS = {
  website_publish_enabled: "Website",
  facebook_publish_enabled: "Facebook",
  instagram_publish_enabled: "Instagram",
  youtube_publish_enabled: "YouTube",
  tiktok_publish_enabled: "TikTok",
  gbp_publish_enabled: "GBP",
};

function isFullyProcessed(video) {
  return (
    video.transcript_status === "completed" &&
    video.captions_status === "completed" &&
    (video.render_status === "completed" || video.render_output_url)
  );
}

export default function ReadyForReviewCallout({ video, onMarkForReview }) {
  const fullyProcessed = isFullyProcessed(video);
  const alreadyInReview = ["pending_review", "in_review", "approved", "published"].includes(video.review_status);

  if (!fullyProcessed || alreadyInReview) return null;

  const destinations = Object.keys(DEST_ICONS).filter(k => video[k]);

  return (
    <div className="rounded-2xl border-2 border-green-600/50 bg-gradient-to-br from-green-950/40 to-slate-900 p-6 shadow-xl shadow-green-900/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-600/20 border border-green-600/40 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-7 h-7 text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-extrabold text-white">This video is ready for review.</h3>
          <p className="text-slate-400 text-sm mt-0.5">All pipeline steps are complete. Submit for approval to move to publishing.</p>
        </div>
        <Button
          onClick={onMarkForReview}
          className="flex-shrink-0 bg-green-600 hover:bg-green-500 gap-2 font-bold text-sm px-5 py-2.5 shadow-lg shadow-green-600/30"
        >
          <Send className="w-4 h-4" /> Mark Ready for Review
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        {video.thumbnail_url && (
          <div className="col-span-2 sm:col-span-1 rounded-xl overflow-hidden aspect-video bg-slate-800 border border-slate-700">
            <img src={video.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wide font-semibold">
            <Type className="w-3 h-3" /> Captions
          </div>
          <p className="text-sm font-semibold text-white">{STYLE_LABELS[video.caption_style] || "Clean Minimal"}</p>
          <p className="text-[10px] text-slate-500 capitalize">{video.caption_position || "bottom"} · {video.caption_size || "medium"}</p>
        </div>
        <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wide font-semibold">
            <Palette className="w-3 h-3" /> Branding
          </div>
          <p className="text-sm font-semibold text-white">{video.brand_name || "Brand Set"}</p>
          <p className="text-[10px] text-slate-500">{video.show_watermark ? "Logo on" : "No watermark"}</p>
        </div>
        <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wide font-semibold">
            <Megaphone className="w-3 h-3" /> CTA
          </div>
          <p className="text-sm font-semibold text-white truncate">{video.cta_text || video.cta || "—"}</p>
          <p className="text-[10px] text-slate-500">{video.show_closing_cta ? "CTA card on" : "No CTA card"}</p>
        </div>
      </div>

      {/* Destinations */}
      {destinations.length > 0 && (
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Publishing to:</span>
          {destinations.map(k => {
            const Icon = DEST_ICONS[k];
            return (
              <span key={k} className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-violet-900/25 border border-violet-700/40 text-violet-300">
                <Icon className="w-3 h-3" /> {DEST_LABELS[k]}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}