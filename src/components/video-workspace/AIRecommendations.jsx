import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, ChevronDown, ChevronUp, CheckCircle2, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const TYPE_DEFAULTS = {
  sales_demo: { caption_style: "bold_social", format: "Landscape 16:9", logo: true, cta: true, reason: "Sales demos perform best with bold captions and a strong CTA overlay." },
  offer_ad: { caption_style: "promo_highlight", format: "Square 1:1", logo: true, cta: true, reason: "Promo ads need punchy highlighted captions and always include a CTA." },
  social_post_video: { caption_style: "bold_social", format: "Vertical 9:16", logo: true, cta: false, reason: "Social content performs best in vertical format with bold captions." },
  website_hero: { caption_style: "clean_minimal", format: "Landscape 16:9", logo: true, cta: true, reason: "Website heroes need clean, minimal captions that don't distract from the message." },
  case_study: { caption_style: "news_broadcast", format: "Landscape 16:9", logo: true, cta: false, reason: "Case studies benefit from formal broadcast-style captions for credibility." },
  feature_explainer: { caption_style: "clean_minimal", format: "Landscape 16:9", logo: false, cta: true, reason: "Explainer videos need clean captions that keep focus on the content." },
  industry_promo: { caption_style: "promo_highlight", format: "Landscape 16:9", logo: true, cta: true, reason: "Industry promos need promo-style captions and visible branding." },
  onboarding: { caption_style: "clean_minimal", format: "Landscape 16:9", logo: true, cta: false, reason: "Onboarding videos benefit from clean, readable captions with logo reinforcement." },
};

const STYLE_LABELS = {
  clean_minimal: "Clean Minimal",
  bold_social: "Bold Social",
  news_broadcast: "News / Broadcast",
  promo_highlight: "Promo Highlight",
};

export default function AIRecommendations({ video, onChange }) {
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [applied, setApplied] = useState(false);

  const defaults = TYPE_DEFAULTS[video.request_type] || TYPE_DEFAULTS.feature_explainer;

  const handleGetRecs = async () => {
    setLoading(true);
    setExpanded(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert video marketing strategist. Analyze this video and give specific production recommendations.

Video details:
- Title: "${video.title || "Marketing Video"}"
- Type: ${video.request_type || "promotional"}
- Goal: ${video.goal || "promote the business"}
- Industry: ${video.industry || "general business"}
- Target audience: ${video.audience || "local consumers"}
- Current caption style: ${video.caption_style || "not set"}
- Has logo: ${!!(video.primary_logo_url || video.watermark_logo_url)}
- CTA text: ${video.cta_text || "not set"}

Respond in JSON with exactly these fields:
{
  "caption_style": one of: clean_minimal | bold_social | news_broadcast | promo_highlight,
  "caption_style_reason": "1 short sentence why",
  "aspect_ratio": one of: "Landscape 16:9" | "Square 1:1" | "Vertical 9:16",
  "aspect_ratio_reason": "1 short sentence why",
  "include_logo": true or false,
  "logo_reason": "1 short sentence why",
  "include_cta": true or false,
  "cta_reason": "1 short sentence why",
  "overall_tip": "One actionable production tip for this specific video type and industry"
}`,
      response_json_schema: {
        type: "object",
        properties: {
          caption_style: { type: "string" },
          caption_style_reason: { type: "string" },
          aspect_ratio: { type: "string" },
          aspect_ratio_reason: { type: "string" },
          include_logo: { type: "boolean" },
          logo_reason: { type: "string" },
          include_cta: { type: "boolean" },
          cta_reason: { type: "string" },
          overall_tip: { type: "string" }
        }
      }
    });
    setRecs(result);
    setLoading(false);
  };

  const handleApplyRecs = () => {
    if (!recs) return;
    const updates = { caption_style: recs.caption_style };
    if (recs.aspect_ratio === "Landscape 16:9") updates.export_landscape = true;
    else if (recs.aspect_ratio === "Square 1:1") updates.export_square = true;
    else if (recs.aspect_ratio === "Vertical 9:16") updates.export_vertical = true;
    if (recs.include_logo !== undefined) updates.show_watermark = recs.include_logo;
    if (recs.include_cta !== undefined) updates.show_closing_cta = recs.include_cta;
    onChange(updates);
    setApplied(true);
  };

  // Derive quick static recs before AI runs
  const quickRec = defaults;

  return (
    <Card className="bg-gradient-to-br from-violet-950/40 to-slate-900 border-violet-800/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-violet-200 uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            AI Production Recommendations
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(e => !e)}
            className="text-violet-400 hover:text-violet-200 hover:bg-violet-900/30 p-1.5 h-auto"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          {/* Static quick recs always visible */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-violet-900/20 border border-violet-700/30 rounded-lg p-3">
              <p className="text-[10px] text-violet-400 uppercase tracking-widest font-semibold mb-1">Caption Style</p>
              <p className="text-sm font-bold text-white">{STYLE_LABELS[quickRec.caption_style] || "Clean Minimal"}</p>
            </div>
            <div className="bg-violet-900/20 border border-violet-700/30 rounded-lg p-3">
              <p className="text-[10px] text-violet-400 uppercase tracking-widest font-semibold mb-1">Aspect Ratio</p>
              <p className="text-sm font-bold text-white">{quickRec.format}</p>
            </div>
            <div className="bg-violet-900/20 border border-violet-700/30 rounded-lg p-3">
              <p className="text-[10px] text-violet-400 uppercase tracking-widest font-semibold mb-1">Logo Watermark</p>
              <p className="text-sm font-bold text-white">{quickRec.logo ? "Include ✓" : "Skip"}</p>
            </div>
            <div className="bg-violet-900/20 border border-violet-700/30 rounded-lg p-3">
              <p className="text-[10px] text-violet-400 uppercase tracking-widest font-semibold mb-1">CTA Card</p>
              <p className="text-sm font-bold text-white">{quickRec.cta ? "Include ✓" : "Skip"}</p>
            </div>
          </div>
          <p className="text-xs text-violet-300/70 italic">{quickRec.reason}</p>

          {/* AI-powered detailed recs */}
          {!recs && !loading && (
            <Button
              size="sm"
              onClick={handleGetRecs}
              className="w-full bg-violet-700 hover:bg-violet-600 gap-2 text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4" /> Get AI-Personalized Recommendations
            </Button>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 py-4 text-violet-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Analyzing your video...</span>
            </div>
          )}

          {recs && !loading && (
            <div className="space-y-3 pt-1 border-t border-violet-800/30">
              <p className="text-[10px] text-violet-400 uppercase tracking-widest font-semibold">AI Analysis Results</p>

              {[
                { label: "Caption Style", value: STYLE_LABELS[recs.caption_style] || recs.caption_style, reason: recs.caption_style_reason },
                { label: "Best Aspect Ratio", value: recs.aspect_ratio, reason: recs.aspect_ratio_reason },
                { label: "Logo Watermark", value: recs.include_logo ? "Include" : "Skip", reason: recs.logo_reason },
                { label: "Closing CTA", value: recs.include_cta ? "Include" : "Skip", reason: recs.cta_reason },
              ].map(({ label, value, reason }) => (
                <div key={label} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-slate-200">{label}: </span>
                    <span className="text-xs text-violet-300 font-medium">{value}</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">{reason}</p>
                  </div>
                </div>
              ))}

              {recs.overall_tip && (
                <div className="bg-violet-900/20 border border-violet-700/30 rounded-lg p-3">
                  <p className="text-[10px] text-violet-400 uppercase tracking-widest font-semibold mb-1">Production Tip</p>
                  <p className="text-xs text-violet-100 leading-relaxed">{recs.overall_tip}</p>
                </div>
              )}

              {!applied ? (
                <Button
                  size="sm"
                  onClick={handleApplyRecs}
                  className="w-full bg-violet-700 hover:bg-violet-600 gap-2 text-xs"
                >
                  <ArrowRight className="w-3.5 h-3.5" /> Apply All Recommendations
                </Button>
              ) : (
                <div className="flex items-center gap-2 justify-center py-1 text-green-400 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Recommendations applied
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}

      {!expanded && (
        <CardContent className="pb-4 pt-0">
          <p className="text-xs text-slate-500">
            Recommended: <span className="text-violet-300 font-medium">{STYLE_LABELS[quickRec.caption_style]}</span> captions · <span className="text-violet-300 font-medium">{quickRec.format}</span> · Logo {quickRec.logo ? "On" : "Off"}
          </p>
        </CardContent>
      )}
    </Card>
  );
}