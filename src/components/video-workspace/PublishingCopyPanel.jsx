import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2, RefreshCw, Globe, Facebook, Instagram, Youtube, Smartphone, Building2, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DESTINATIONS = [
  { key: "website", enabledKey: "website_publish_enabled", label: "Website", Icon: Globe, fields: [
    { key: "website_title", label: "Page Title", type: "input", placeholder: "SEO-friendly video title..." },
    { key: "website_summary", label: "Summary", type: "textarea", placeholder: "Brief description shown on the page..." },
    { key: "website_body", label: "Body / Story Intro", type: "textarea", placeholder: "Longer introduction paragraph..." },
  ]},
  { key: "facebook", enabledKey: "facebook_publish_enabled", label: "Facebook", Icon: Facebook, fields: [
    { key: "facebook_caption", label: "Post Caption", type: "textarea", placeholder: "Engaging Facebook post copy..." },
  ]},
  { key: "instagram", enabledKey: "instagram_publish_enabled", label: "Instagram", Icon: Instagram, fields: [
    { key: "instagram_caption", label: "Caption + Hashtags", type: "textarea", placeholder: "Caption with hashtags..." },
  ]},
  { key: "youtube", enabledKey: "youtube_publish_enabled", label: "YouTube", Icon: Youtube, fields: [
    { key: "youtube_title", label: "Video Title", type: "input", placeholder: "YouTube SEO title..." },
    { key: "youtube_description", label: "Description", type: "textarea", placeholder: "Full YouTube description with timestamps and links..." },
  ]},
  { key: "tiktok", enabledKey: "tiktok_publish_enabled", label: "TikTok", Icon: Smartphone, fields: [
    { key: "tiktok_caption", label: "Caption + Hashtags", type: "textarea", placeholder: "Short punchy caption with trending hashtags..." },
  ]},
  { key: "gbp", enabledKey: "gbp_publish_enabled", label: "Google Business", Icon: Building2, fields: [
    { key: "gbp_post_text", label: "Post Text", type: "textarea", placeholder: "Google Business Profile post copy..." },
  ]},
];

export default function PublishingCopyPanel({ video, onChange, onImmediateSave }) {
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState({});

  const enabledDestinations = DESTINATIONS.filter(d => video[d.enabledKey]);

  const toggleExpand = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const handleGenerateAll = async () => {
    setGenerating(true);
    const context = `
Title: "${video.title || "Marketing Video"}"
Type: ${video.request_type || "promotional"}
Industry: ${video.industry || "general business"}
Goal: ${video.goal || "promote the business"}
Brand: ${video.brand_name || ""}
Tagline: ${video.tagline || ""}
CTA: ${video.cta_text || video.cta || "Contact us today"}
Website: ${video.website_url || ""}
Phone: ${video.phone || ""}
Transcript excerpt: ${video.transcript_text ? video.transcript_text.slice(0, 400) : ""}
`;

    const selectedKeys = enabledDestinations.map(d => d.key);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate publishing copy for a branded marketing video. Write platform-native copy that sounds human, not AI.

Video details:
${context}

Generate copy for these platforms: ${selectedKeys.join(", ")}

Rules:
- website_title: SEO-friendly, 55-60 chars max, no clickbait
- website_summary: 1-2 sentence meta description, 150 chars max
- website_body: 2-3 sentence intro paragraph for the page
- facebook_caption: 1-3 sentences, conversational, 1-2 emojis max, include soft CTA
- instagram_caption: punchy opener, 2-4 sentences, 5-8 relevant hashtags on separate lines
- youtube_title: SEO optimized, include main keyword, 60 chars max
- youtube_description: 3-4 paragraphs, include timestamps placeholder, relevant keywords naturally, include CTA with contact info
- tiktok_caption: 1-2 sentences max, very casual tone, 3-5 trending hashtags
- gbp_post_text: 2-3 sentences, local business tone, clear action

Return JSON only, no explanation.`,
      response_json_schema: {
        type: "object",
        properties: {
          website_title: { type: "string" },
          website_summary: { type: "string" },
          website_body: { type: "string" },
          facebook_caption: { type: "string" },
          instagram_caption: { type: "string" },
          youtube_title: { type: "string" },
          youtube_description: { type: "string" },
          tiktok_caption: { type: "string" },
          gbp_post_text: { type: "string" },
        }
      }
    });

    const updates = {};
    Object.keys(result).forEach(k => { if (result[k]) updates[k] = result[k]; });
    await onImmediateSave(updates);
    setGenerating(false);
    // Auto-expand all generated sections
    const newExpanded = {};
    enabledDestinations.forEach(d => { newExpanded[d.key] = true; });
    setExpanded(newExpanded);
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Publishing Copy
          </CardTitle>
          <Button
            size="sm"
            onClick={handleGenerateAll}
            disabled={generating || enabledDestinations.length === 0}
            className="bg-violet-600 hover:bg-violet-500 gap-1.5 text-xs disabled:opacity-40"
          >
            {generating
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
              : <><Sparkles className="w-3.5 h-3.5" /> Generate All Copy</>
            }
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">

        {enabledDestinations.length === 0 ? (
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-6 text-center">
            <Sparkles className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No destinations selected.</p>
            <p className="text-xs text-slate-600 mt-1">Select publish destinations in the Review panel to generate copy.</p>
          </div>
        ) : (
          DESTINATIONS.filter(d => video[d.enabledKey]).map(dest => {
            const Icon = dest.Icon;
            const isOpen = expanded[dest.key];
            const hasContent = dest.fields.some(f => video[f.key]);
            return (
              <div key={dest.key} className="rounded-xl border border-slate-700 bg-slate-800/30 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors"
                  onClick={() => toggleExpand(dest.key)}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-200">{dest.label}</span>
                    {hasContent && <span className="text-[10px] bg-green-900/30 text-green-400 border border-green-700/30 px-2 py-0.5 rounded-full font-medium">Copy ready</span>}
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3 border-t border-slate-700/50">
                    {dest.fields.map(field => (
                      <div key={field.key} className="pt-3">
                        <label className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1.5 block">{field.label}</label>
                        {field.type === "input" ? (
                          <Input
                            value={video[field.key] || ""}
                            onChange={(e) => onChange({ [field.key]: e.target.value })}
                            placeholder={field.placeholder}
                            className="bg-slate-900 border-slate-700 text-white placeholder-slate-600 text-sm focus:border-violet-500"
                          />
                        ) : (
                          <Textarea
                            value={video[field.key] || ""}
                            onChange={(e) => onChange({ [field.key]: e.target.value })}
                            placeholder={field.placeholder}
                            className="bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-600 text-sm min-h-[90px] resize-none focus:border-violet-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}