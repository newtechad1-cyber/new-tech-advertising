# Renewal Signal Engine - Field Reference

## Output Fields from `calculateRenewalSignals()`

### Core Fields
| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `daysUntilRenewal` | number | 0-∞ | Days until next billing cycle |
| `renewalConfidenceScore` | number | 0-100 | Likelihood to renew (higher = more confident) |
| `suggestedNextPlan` | string | 'diy'\|'guided_growth'\|'done_for_you'\|'premium' | Recommended upgrade plan |
| `riskLevel` | string | 'healthy'\|'moderate'\|'at_risk'\|'critical' | Overall renewal health |
| `renewalDate` | string | 'YYYY-MM-DD' | Next renewal date (ISO format) |

### Boolean Flags
| Field | Description |
|-------|-------------|
| `isAtRisk` | True if confidence < 40 (critical retention risk) |
| `isReadyForUpgrade` | True if confidence > 70 AND suggested plan differs from current |

---

## Confidence Score Components

### Input Data Required
From **DIYSubscription** (or equivalent billing entity):
- `next_renewal_date` (or calculated from `billing_cycle_end`)
- `onboarding_completed` (boolean)
- `current_plan` (string)

From **GrowthMetricsSnapshot** (latest):
- `growthScore` (0-100)
- `momentumScore` (0-100)
- `contentPublishedCount` (number)
- `leadsLoggedCount` (number)
- `dealsClosedCount` (number)

### Scoring Logic
```
Base Score: 50

Growth Trajectory:
  + growthScore > 70     → +20
  + growthScore > 50     → +10
  - growthScore < 30     → -20

Activity:
  + contentPublished > 0 → +10
  + leadsLogged > 2      → +15
  + dealsClosed > 0      → +20

Momentum:
  + momentumScore > 60   → +15
  - momentumScore < 20   → -10

Renewal Timing:
  + daysUntilRenewal > 60 → +5
  - daysUntilRenewal < 14 → -10

Onboarding:
  + onboardingCompleted  → +10

Final: Clamped to [0, 100]
```

### Score Interpretation
| Score | Risk Level | Action |
|-------|-----------|--------|
| 70-100 | Healthy | Show upgrade suggestion, normal renewal message |
| 50-69 | Moderate | Show renewal reminder, light upgrade messaging |
| 30-49 | At-Risk | Focus on retention, activity nudges, no upgrade |
| 0-29 | Critical | Urgent outreach, support intervention needed |

---

## Plan Upgrade Thresholds

### DIY → Guided Growth
- **Growth Score Required:** > 65
- **Upgrade Readiness Required:** > 70
- **Confidence Score Required:** > 70
- **Activity Signal:** Any growth + some leads

### Guided Growth → Done For You
- **Growth Score Required:** > 75
- **Upgrade Readiness Required:** > 70
- **Confidence Score Required:** > 70
- **Activity Signal:** Multiple leads + revenue proof

### Done For You → Premium
- **Growth Score Required:** > 80
- **Upgrade Readiness Required:** > 75
- **Confidence Score Required:** > 80
- **Activity Signal:** Consistent revenue + high momentum

---

## Display Rules

### When to Show ClientRenewalPanel
- ✅ Always (always visible on dashboard)

### When to Show ClientUpgradeSuggestionPanel
- ✅ `isReadyForUpgrade` = true
- ✅ `growthScore` > 50
- ✅ Current plan != suggested plan
- ✅ Not highest tier (premium/enterprise)

### When to Show Renewal Warning Banner
- ✅ `daysUntilRenewal` ≤ 30
- ✅ `renewalConfidenceScore` < 60

### When to Show Inactivity Nudge (implied)
- ✅ `renewalConfidenceScore` < 40
- ✅ `growthScore` < 30
- ✅ No content published this period

---

## Integration Checklist

- [ ] ClientRenewalPanel added to dashboard layout
- [ ] ClientUpgradeSuggestionPanel added to dashboard sidebar
- [ ] DIYSubscription has `next_renewal_date` field
- [ ] GrowthMetricsSnapshot has all required fields
- [ ] Dashboard loads subscription + latest snapshot
- [ ] Renewal message copy reviewed by product
- [ ] Upgrade message copy reviewed by sales
- [ ] Test renewal panel with at-risk account (low score)
- [ ] Test upgrade panel with high-growth account
- [ ] Verify timezone handling for renewal dates
- [ ] Set up analytics tracking for upgrade clicks

---

## Example Data

### High-Confidence Renewal + Upgrade Ready
```json
{
  "daysUntilRenewal": 45,
  "renewalConfidenceScore": 82,
  "riskLevel": "healthy",
  "isAtRisk": false,
  "isReadyForUpgrade": true,
  "suggestedNextPlan": "guided_growth",
  "renewalDate": "2026-04-28"
}
```

### At-Risk Renewal, Early Stage
```json
{
  "daysUntilRenewal": 20,
  "renewalConfidenceScore": 35,
  "riskLevel": "critical",
  "isAtRisk": true,
  "isReadyForUpgrade": false,
  "suggestedNextPlan": "diy",
  "renewalDate": "2026-04-03"
}
```

### Moderate Renewal, No Upgrade Yet
```json
{
  "daysUntilRenewal": 55,
  "renewalConfidenceScore": 58,
  "riskLevel": "moderate",
  "isAtRisk": false,
  "isReadyForUpgrade": false,
  "suggestedNextPlan": "diy",
  "renewalDate": "2026-05-07"
}
``