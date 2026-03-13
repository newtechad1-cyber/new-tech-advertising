# NTA Renewal + Expansion Revenue Engine
## Integration Guide for Client Dashboard

---

## Overview
Lightweight renewal signals and upgrade suggestions to reduce churn and encourage plan upgrades through growth reinforcement and contextual messaging.

---

## Components

### 1. ClientRenewalPanel
**File:** `components/renewal/ClientRenewalPanel.jsx`

**Purpose:** Shows current plan, renewal countdown, growth summary, and renewal message.

**Props:**
```jsx
<ClientRenewalPanel 
  subscription={subscription}  // DIYSubscription entity
  organizationId={organizationId}  // Organization ID
/>
```

**Displays:**
- Current plan badge
- Days until renewal
- Growth score & momentum
- Recent marketing wins (content, leads, deals)
- Renewal warning (if < 30 days + low confidence)
- Value reinforcement message
- Renewal confidence meter (0-100%)
- CTAs: "Review & Renew" + "View Billing"

**Styling:** Color-coded by risk level (healthy/moderate/at-risk/critical)

---

### 2. ClientUpgradeSuggestionPanel
**File:** `components/renewal/ClientUpgradeSuggestionPanel.jsx`

**Purpose:** Shows contextual upgrade suggestion when growth metrics qualify.

**Props:**
```jsx
<ClientUpgradeSuggestionPanel 
  subscription={subscription}  // DIYSubscription entity
  organizationId={organizationId}  // Organization ID
  onUpgradeClick={(nextPlan) => {
    // Handle upgrade click - navigate to billing, contact sales, etc.
  }}
/>
```

**Shows Only When:**
- Growth score > 50 (active, not struggling)
- Renewal confidence > 70 (likely to stay)
- Suggested next plan differs from current (not at highest tier)
- User hasn't seen upgrade recently (UX throttling)

**Displays:**
- "Why Now?" metrics (growth score, momentum, leads, revenue)
- Upgrade value proposition (tailored to current plan)
- What they'll get in next tier
- Plan pricing (optional)
- "Explore [Next Plan]" CTA
- "Upgrade at renewal or anytime" note

**Styling:** Emerald/green theme for positive growth messaging

---

## Renewal Signal Engine
**File:** `components/renewal/renewalSignalEngine.js`

### Key Functions

#### `calculateRenewalSignals(subscription, growthSnapshot)`
Computes lightweight renewal metrics.

**Returns Object:**
```javascript
{
  daysUntilRenewal: number,           // Days to next renewal
  renewalConfidenceScore: 0-100,      // Likelihood to renew
  suggestedNextPlan: string,          // Plan to suggest
  riskLevel: 'healthy|moderate|at_risk|critical',
  isAtRisk: boolean,                  // Score < 40
  isReadyForUpgrade: boolean,         // Confident + plan upgrade available
  renewalDate: 'YYYY-MM-DD'          // Next renewal date
}
```

**Confidence Score Formula:**
- Baseline: 50
- Growth score > 70: +20
- Growth score > 50: +10
- Growth score < 30: -20
- Content published: +10
- Leads > 2: +15
- Deals closed: +20
- Momentum > 60: +15
- Days to renewal > 60: +5
- Days to renewal < 14: -10
- Onboarding completed: +10
- Range: 0-100

**Risk Levels:**
- healthy: 70-100
- moderate: 50-69
- at_risk: 30-49
- critical: 0-29

---

#### `shouldShowRenewalWarning(signals)`
Returns true if renewal < 30 days AND confidence < 60.

**Use For:** Urgent renewal reminders in dashboard banner/panel.

---

#### `shouldShowUpgradeSuggestion(subscription, signals, growthSnapshot)`
Returns true if conditions met for showing upgrade panel.

**Conditions:**
1. Not at highest tier (not premium/enterprise)
2. Signals indicate ready for upgrade (confidence > 70 + plan differs)
3. Growth score > 50 (active, performing)

---

#### `getRenewalMessage(signals, subscription)`
Returns urgency-appropriate renewal message.

**Returns:**
```javascript
{
  title: string,      // "Your plan expires today", "Renewing in 5 days", etc.
  urgency: string,    // 'critical|high|medium|low'
  cta: string         // Button text: "Renew Now", "Review Plan", etc.
}
```

**Logic:**
- 0 days: Critical urgency
- 1-7 days: High urgency
- 8-30 days: Medium urgency
- 30+ days: Low urgency / keep momentum message

---

## Dashboard Integration Example

### In ClientDashboard Component:
```jsx
import ClientRenewalPanel from '@/components/renewal/ClientRenewalPanel';
import ClientUpgradeSuggestionPanel from '@/components/renewal/ClientUpgradeSuggestionPanel';

export default function ClientDashboard() {
  const [subscription, setSubscription] = useState(null);
  const [organization, setOrganization] = useState(null);

  // ... load subscription and organization data ...

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column: Main content */}
      <div className="lg:col-span-2">
        {/* Existing dashboard content */}
      </div>

      {/* Right sidebar: Renewal + Upgrade */}
      <div className="space-y-4">
        <ClientRenewalPanel 
          subscription={subscription}
          organizationId={organization?.id}
        />

        <ClientUpgradeSuggestionPanel 
          subscription={subscription}
          organizationId={organization?.id}
          onUpgradeClick={(plan) => {
            // Navigate to billing, contact sales form, etc.
            window.location.href = '/client/diy-billing';
          }}
        />
      </div>
    </div>
  );
}
```

---

## Data Model Extensions

### DIYSubscription Fields (if not present)
Add these fields to track renewal signals:
```json
{
  "next_renewal_date": "2026-04-13",  // Calculated or explicit
  "billing_cycle_end": "2026-04-13",  // End of current cycle
  "onboarding_completed": true,       // Track completion
  "current_plan": "diy"              // Current tier
}
```

### GrowthMetricsSnapshot Fields (ensure present)
```json
{
  "growthScore": 65,
  "momentumScore": 75,
  "contentPublishedCount": 5,
  "leadsLoggedCount": 8,
  "dealsClosedCount": 2,
  "upgradeReadinessScore": 78
}
```

---

## Language & Messaging Guidelines

### Renewal Messaging
✅ **DO:**
- Celebrate growth achieved
- Connect metrics to business value
- Make renewal feel like momentum continuation
- Use growth score as proof point

❌ **DON'T:**
- Threaten "your plan will expire"
- Focus on payment
- Use generic renewal language

### Upgrade Messaging
✅ **DO:**
- Lead with growth metrics proving readiness
- Explain "why now" with specific evidence
- Position as growth acceleration, not cost increase
- Make the next tier feel natural/inevitable

❌ **DON'T:**
- Push upgrade too early (growth < 50)
- Make it feel like sales pitch
- Downplay current plan success

### Example Language

**Renewal (Growth Trajectory):**
"Your growth is working. With consistent effort on content and lead capture, your ROI only improves. Renewing locks in your momentum."

**Upgrade (Readiness Evidence):**
"Your growth score (72) and consistent lead captures show you're ready for professional strategy guidance. Guided Growth takes execution off your plate."

---

## Behavioral Logic

### When NOT to Show Panels

1. **Renewal Panel Hidden If:**
   - No subscription data
   - No growth snapshot (too new)
   - User opted out of renewal messages

2. **Upgrade Panel Hidden If:**
   - Growth score < 50 (not active enough)
   - Already at premium/enterprise tier
   - Renewal confidence < 60 (at-risk, focus on retention)
   - User just upgraded in past 30 days

### Throttling/Frequency
- Show renewal panel: Always visible
- Show upgrade panel: Max 1x per 7 days (add UX flag if needed)
- Renewal warning banner: Show always if < 14 days + low confidence

---

## Testing Scenarios

### Test Case 1: Healthy Renewal
- Growth score: 75
- Momentum: 70
- Leads logged: 8
- Days to renewal: 45
- **Expected:** 
  - Renewal confidence: ~80 (healthy)
  - Show renewal panel with "Keep momentum going" message
  - Show upgrade suggestion (if not highest tier)

### Test Case 2: At-Risk Renewal
- Growth score: 25
- Momentum: 10
- No content published
- Days to renewal: 10
- **Expected:**
  - Renewal confidence: ~30 (critical)
  - Show renewal warning (urgent)
  - Hide upgrade suggestion
  - Suggest activity revival

### Test Case 3: Upgrade Qualified
- Growth score: 70
- Momentum: 75
- Leads: 12
- Deals: 3
- Current plan: DIY
- Days to renewal: 30
- **Expected:**
  - Renewal confidence: 85 (healthy)
  - Show upgrade panel suggesting Guided Growth
  - Highlight leads/deals/momentum as proof

---

## Future Enhancements

1. **Churn Prevention Automation**
   - Auto-email at 30 days to renewal if confidence < 60
   - Offer mini-discount to encourage renewal

2. **Personalized Upgrade Path**
   - Track which plan features user accessed most
   - Recommend plan based on usage patterns

3. **Cohort Messaging**
   - Different messaging for "stalled" vs "accelerating" cohorts
   - Test messaging variants via A/B experiment

4. **Expansion Revenue Tracking**
   - Measure upgrade rates from this engine
   - Track upgrade velocity post-implementation
   - Calculate LTV increase from upgrades