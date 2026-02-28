import React, { useMemo, useState } from "react";
import UpgradeModal from "./UpgradeModal";
import { MODULES } from "./registry";

/**
 * Wrap any clickable tile/button/card. If not entitled:
 * - shows a 🔒 badge
 * - mutes the tile (opacity)
 * - intercepts clicks and opens UpgradeModal (does NOT navigate)
 *
 * If entitled: does nothing; your existing click/navigation works unchanged.
 */
export default function ModuleTile({ moduleId, isEnabled, account, children }) {
  const enabled = useMemo(() => (isEnabled ? isEnabled(moduleId) : true), [isEnabled, moduleId]);
  const [open, setOpen] = useState(false);

  const label = MODULES[moduleId]?.label || "Feature";

  return (
    <div className="relative">
      {!enabled && (
        <div className="absolute right-2 top-2 z-10 rounded-full px-2 py-1 text-xs border border-slate-700 bg-slate-950/80 text-slate-200">
          🔒 Upgrade
        </div>
      )}

      <div
        className={!enabled ? "opacity-55 hover:opacity-70" : undefined}
        onClickCapture={(e) => {
          if (enabled) return;
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        role="presentation"
      >
        {children}
      </div>

      <UpgradeModal open={open} onOpenChange={setOpen} moduleId={moduleId} account={account} />
    </div>
  );
}
