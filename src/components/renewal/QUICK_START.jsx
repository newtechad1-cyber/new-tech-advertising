# Renewal Engine - Quick Start

## 3-Minute Setup

### Step 1: Import Components
```jsx
import ClientRenewalPanel from '@/components/renewal/ClientRenewalPanel';
import ClientUpgradeSuggestionPanel from '@/components/renewal/ClientUpgradeSuggestionPanel';
```

### Step 2: Add to Dashboard
```jsx
// In your client dashboard component's right sidebar:
<div className="space-y-4">
  <ClientRenewalPanel 
    subscription={subscription}
    organizationId={organizationId}
  />
  
  <ClientUpgradeSuggestionPanel 
    subscription={subscription}
    organizationId={organizationId}
    onUpgradeClick={(plan) => {
      // Navigate to billing or contact sales
      window.location.href = '/client/diy-billing';
    }}
  />
</div>
```

### Step 3: Load Data
Ensure your dashboard loads:
1. **DIYSubscription** (or equivalent) with fields:
   - `current_plan`
   - `next_renewal_date` (or `billing_cycle_end`)
   - `onboarding_completed`

2. **Latest GrowthMetricsSnapshot** with fields:
   - `growthScore`
   - `momentumScore`
   - `contentPublishedCount`
   - `leadsLoggedCount`
   - `dealsClosedCount`

### Done! ✅

The panels will now:
- Show current plan + renewal countdown
- Display growth summary + recent wins
- Auto-calculate renewal confidence
- Suggest upgrades when growth qualifies
- Adapt messaging by urgency level

---

## Testing

### Test Renewal Warning (Low Confidence)
```javascript
const subscription = {
  current_plan: 'diy',
  next_renewal_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
  onboarding_completed: true
};

const snapshot = {
  growthScore: 25,
  momentumScore: 15,
  contentPublishedCount: 0,
  leadsLoggedCount: 0,
  dealsClosedCount: 0
};

// Result: renewalConfidenceScore ≈ 25 (critical) + warning shown
```

### Test Upgrade Suggestion (High Growth)
```javascript
const subscription = {
  current_plan: 'diy',
  next_renewal_date: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), // 40 days
  onboarding_completed: true
};

const snapshot = {
  growthScore: 75,
  momentumScore: 80,
  contentPublishedCount: 8,
  leadsLoggedCount: 12,
  dealsClosedCount: 3,
  upgradeReadinessScore: 85
};

// Result: renewalConfidenceScore ≈ 85 (healthy) + upgrade panel shown
```

---

## Key Files

| File | Purpose |
|------|---------|
| `renewalSignalEngine.js` | Scoring logic & decision functions |
| `ClientRenewalPanel.jsx` | Dashboard renewal status card |
| `ClientUpgradeSuggestionPanel.jsx` | Upgrade recommendation card |
| `RENEWAL_ENGINE_INTEGRATION.md` | Full integration guide |
| `SIGNAL_FIELDS_REFERENCE.md` | Field reference & examples |

---

## Common Customizations

### Change Renewal Message Tone
Edit `getRenewalMessage()` in `renewalSignalEngine.js`

### Adjust Confidence Thresholds
Edit `calculateConfidenceScore()` in `renewalSignalEngine.js`

### Customize Upgrade Criteria
Edit `shouldShowUpgradeSuggestion()` in `renewalSignalEngine.js`

### Change UI Colors/Text
Edit `PLAN_LABELS`, `RISK_COLORS` in `ClientRenewalPanel.jsx`

---

## Deployment Notes

✅ **No database changes needed** — works with existing DIYSubscription & GrowthMetricsSnapshot

✅ **Lightweight** — all calculations client-side, minimal API calls

✅ **Safe to deploy** — panels only render if data available, no errors if incomplete

✅ **Backwards compatible** — no changes to existing dashboard features