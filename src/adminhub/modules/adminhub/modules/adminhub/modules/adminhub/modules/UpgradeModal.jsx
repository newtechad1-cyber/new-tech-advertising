import React from "react";
import { MODULES } from "./registry";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function UpgradeModal({ open, onOpenChange, moduleId, account }) {
  if (!moduleId) return null;

  const m = MODULES[moduleId];
  const label = m?.label || "This feature";

  const subject = encodeURIComponent(`Upgrade Request: ${label}`);
  const body = encodeURIComponent(
    `Please enable "${label}" for account: ${account?.name || account?.id || "(unknown)"}\n\nModule: ${moduleId}\nSuggested plan: ${m?.planHint || "N/A"}\n`
  );

  const mailto = `mailto:support@newtechadvertising.com?subject=${subject}&body=${body}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unlock {label}</DialogTitle>
          <DialogDescription>
            This module is not included in your current plan.
            {m?.planHint ? ` Recommended plan: ${m.planHint}.` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Not now
          </Button>
          <Button onClick={() => { window.location.href = mailto; }}>
            Request upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
