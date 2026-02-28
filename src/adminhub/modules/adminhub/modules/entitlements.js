import { MODULES } from "./registry";

/**
 * Base44-friendly entitlements:
 * - If an account object is available, uses account.plan + account.modules_enabled.
 * - If not, falls back to localStorage:
 *    - nta_plan: "starter"|"growth"|"pro"|"premium"
 *    - nta_modules_enabled: JSON object, e.g. {"video":true,"crm":false}
 * - If neither exists, defaults to enabling everything (so nothing breaks on first install).
 */
function readLocalConfig() {
  try {
    const plan = window.localStorage?.getItem("nta_plan") || null;
    const raw = window.localStorage?.getItem("nta_modules_enabled") || null;
    const modules_enabled = raw ? JSON.parse(raw) : null;
    return { plan, modules_enabled };
  } catch {
    return { plan: null, modules_enabled: null };
  }
}

export function buildEntitlements(account) {
  const local = (typeof window !== "undefined") ? readLocalConfig() : { plan: null, modules_enabled: null };

  const enabled = account?.modules_enabled ?? local.modules_enabled ?? null;
  const plan = account?.plan ?? local.plan ?? "all"; // "all" => everything enabled

  const defaultsByPlan = {
    starter: {},
    growth: { crm: true, social: true, content: true },
    pro: { crm: true, social: true, content: true, email: true, analytics: true, automations: true, mediaPro: true },
    premium: { crm: true, social: true, content: true, email: true, analytics: true, automations: true, mediaPro: true, video: true },
    all: "__ALL__",
  };

  const isEnabled = (moduleId) => {
    if (!moduleId) return true;
    if (MODULES[moduleId]?.alwaysOn) return true;

    // If we have explicit module flags, they win.
    if (enabled && typeof enabled === "object") {
      if (enabled[moduleId] === true) return true;
      if (enabled[moduleId] === false) return false;
      // fallthrough to plan defaults
    }

    if (defaultsByPlan[plan] === "__ALL__") return true;

    return !!defaultsByPlan[plan]?.[moduleId];
  };

  return { plan, isEnabled };
}
