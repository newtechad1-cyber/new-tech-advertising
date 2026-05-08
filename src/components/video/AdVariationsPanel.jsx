import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Layers, Loader2, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

const VARIATION_STRUCTURES = {
  "15s": "Fast hook (0–3s) + quick CTA (3–15s). Ultra concise. ~40 words max.",
  "30s": "Hook (0–5s) + problem (5–12s) + solution (12–22s) + CTA (22–30s). ~75 words max.",
  "60s": "Hook (0–5s) + education/value (5–30s) + trust/social proof (30–50s) + CTA (50–60s). ~150 words max.",
};

const DURATION_LABELS = { "15s": "15 sec", "30s": "30 sec", "60s": "60 sec" };

const invoke = (action, params) => base44.functions.invoke("aiVideoStudio", { action, ...params });

export default function AdVariationsPanel({ userInput, format, onVariationsSaved }) {
  const [open, setOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [platform, setPlatform] = useState("Facebook");
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [variations, setVariations] = useState(null);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!userInput?.trim()) { setError("Enter a topic or prompt above first."); return; }
    setGenerating(true);
    setError("");
    setSaved(false);
    setVariations(null);
    try {
      const res = await invoke("generate_ad_variations", {
        userInput,
        format,
        campaignName: campaignName || "Ad Campaign",
        platform,
      });
      setVariations(res.data?.variations || null);
    } catch (err) {
      setError("Generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const saveAll = async () => {
    if (!variations) return;
    setGenerating(true);
    try {
      await Promise.all(
        variations.map(v =>
          base44.entities.VideoAsset.create({
            title: `${campaignName || "Ad"} — ${DURATION_LABELS[v.duration]}`,
            topic: userInput,
            video_type: "Ad",
            script: v.script,
            hook: v.hook,
            cta: v.cta,
            duration_seconds: parseInt(v.duration),
            platform_tags: platform,
            status: "Draft",
            description: `Campaign: ${campaignName || "Ad Campaign"} | Platform: ${platform}`,
          })
        )
      );
      setSaved(true);
      if (onVariationsSaved) onVariationsSaved();
    } catch (err) {
      setError("Save failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-gray-700">Generate Ad Variations</span>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">15s · 30s · 60s</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="p-4 space-y-4">
          <p className="text-xs text-gray-500">
            Generates three script variations (15s, 30s, 60s) from the same core offer — each adapted for its duration and pacing.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Campaign Name</label>
              <input
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                placeholder="Summer AC Special"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Platform</label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-400 bg-white"
              >
                {["Facebook", "Instagram", "LinkedIn", "YouTube", "CTV", "TikTok"].map(p => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={generate}
            disabled={generating || !userInput?.trim()}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
          >
            {generating && !variations ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
            {generating && !variations ? "Generating variations..." : "Generate All 3 Variations"}
          </button>

          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

          {variations && (
            <div className="space-y-3">
              {variations.map(v => (
                <VariationCard key={v.duration} variation={v} />
              ))}

              {saved ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2.5">
                  <CheckCircle className="w-4 h-4" /> All 3 variations saved to Video Engine!
                </div>
              ) : (
                <button
                  onClick={saveAll}
                  disabled={generating}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Save All 3 Variations to Video Engine
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VariationCard({ variation }) {
  const [expanded, setExpanded] = useState(false);
  const colors = { "15s": "blue", "30s": "purple", "60s": "green" };
  const c = colors[variation.duration] || "gray";

  return (
    <div className={`border border-${c}-200 rounded-lg overflow-hidden`}>
      <button
        onClick={() => setExpanded(e => !e)}
        className={`w-full flex items-center justify-between px-3 py-2 bg-${c}-50 text-left`}
      >
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold text-${c}-700 bg-${c}-100 px-2 py-0.5 rounded-full`}>
            {DURATION_LABELS[variation.duration]}
          </span>
          <span className="text-xs text-gray-600 truncate max-w-xs italic">"{variation.hook}"</span>
        </div>
        {expanded ? <ChevronUp className="w-3 h-3 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />}
      </button>
      {expanded && (
        <div className="px-3 py-3 space-y-2 bg-white text-xs">
          <Field label="Hook" value={variation.hook} />
          <Field label="Script" value={variation.script} mono />
          <Field label="CTA" value={variation.cta} />
        </div>
      )}
    </div>
  );
}

function Field({ label, value, mono }) {
  return (
    <div>
      <p className="font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-gray-800 leading-relaxed ${mono ? "font-mono" : ""}`}>{value || "—"}</p>
    </div>
  );
}