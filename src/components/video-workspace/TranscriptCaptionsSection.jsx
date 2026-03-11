import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function TranscriptCaptionsSection({ video }) {
  const [transcript, setTranscript] = useState(video?.transcript || "");
  const [saving, setSaving] = useState(false);

  const saveTranscript = async () => {
    setSaving(true);
    try {
      // TODO: connect to entity update
      console.log("Saving transcript:", transcript);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardContent className="p-6 space-y-4">
        <div className="text-lg font-semibold text-white">
          AI Transcript & Captions
        </div>

        <Textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={10}
          className="bg-slate-950 text-white border-slate-700"
        />

        <div className="flex gap-2">
          <Button onClick={saveTranscript} disabled={saving}>
            {saving ? "Saving..." : "Save Captions"}
          </Button>

          <Button variant="secondary">
            Regenerate AI Transcript
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}