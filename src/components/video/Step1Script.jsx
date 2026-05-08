import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, RefreshCw, Loader2 } from "lucide-react";
export default function Step1Script({ state, setState, onGenerate, generating, onNext }) {
  const { inputMode, userInput, format, duration, script } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Step 1: Script</h2>
        <p className="text-sm text-gray-500">Describe your video and let AI write the script, or write your own.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { id: "prompt", label: "Custom Prompt" },
          { id: "topic", label: "Topic / Offer" },
          { id: "content", label: "Paste Content" },
          { id: "manual", label: "Write My Own" }
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setState(s => ({ ...s, inputMode: m.id }))}
            className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${inputMode === m.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {inputMode !== "manual" && (
        <Textarea
          rows={4}
          placeholder={
            inputMode === "prompt" ? "e.g. Write a 30-second promo for a local HVAC company in Iowa offering 20% off AC tune-ups..." :
            inputMode === "topic"  ? "e.g. Summer AC tune-up special, 20% off through July..." :
            "Paste blog content, website copy, or any text to convert into a script..."
          }
          value={userInput}
          onChange={e => setState(s => ({ ...s, userInput: e.target.value }))}
        />
      )}

      <div className="flex gap-3 flex-wrap items-center">
        <Select value={format} onValueChange={v => setState(s => ({ ...s, format: v }))}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="16:9">16:9 Landscape</SelectItem>
            <SelectItem value="9:16">9:16 Vertical</SelectItem>
            <SelectItem value="1:1">1:1 Square</SelectItem>
          </SelectContent>
        </Select>
        <Select value={duration} onValueChange={v => setState(s => ({ ...s, duration: v }))}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="15s">15 seconds</SelectItem>
            <SelectItem value="30s">30 seconds</SelectItem>
            <SelectItem value="60s">60 seconds</SelectItem>
          </SelectContent>
        </Select>
        {inputMode !== "manual" && (
          <Button onClick={onGenerate} disabled={!userInput || generating} className="bg-purple-600 hover:bg-purple-700">
            {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
            {generating ? "Generating..." : "Generate Script with AI"}
          </Button>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">Script</label>
          {script && inputMode !== "manual" && (
            <button onClick={onGenerate} disabled={generating} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Regenerate
            </button>
          )}
        </div>
        <Textarea
          rows={6}
          value={script}
          onChange={e => setState(s => ({ ...s, script: e.target.value }))}
          placeholder="Script will appear here, or write your own..."
          className="font-mono text-sm"
        />
        {script && <p className="text-xs text-gray-400 mt-1">{script.split(" ").filter(Boolean).length} words</p>}
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!script} className="bg-blue-600 hover:bg-blue-700">
          Next: Choose Video Type →
        </Button>
      </div>
    </div>
  );
}