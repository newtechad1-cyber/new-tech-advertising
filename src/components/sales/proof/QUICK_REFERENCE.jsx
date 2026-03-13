# Sales Proof Engine - Quick Reference

## Files & Components

| File | Purpose |
|------|---------|
| `entities/SuccessHighlight.json` | Data model for proof points |
| `functions/generateSalesProof.js` | Backend: analyzes metrics, generates highlights |
| `AdminSalesProofGenerator.jsx` | Admin UI: generate & approve highlights |
| `DealRoomProofSection.jsx` | Public UI: display approved highlights |

---

## Admin: Generate & Approve

```jsx
import AdminSalesProofGenerator from '@/components/sales/proof/AdminSalesProofGenerator';

<AdminSalesProofGenerator 
  organizationId={orgId}
  onGenerated={(highlights) => { /* handle */ }}
/>
```

**Generates from GrowthMetricsSnapshot:**
- Growth Score > 70 → Growth Milestone
- Deals Closed > 0 → Revenue Result
- Leads > 8 → Lead Breakthrough
- Content > 5 → Content Win
- Momentum > 70 → Efficiency Gain

**Output:** Draft highlights pending admin approval

---

## Deal Room: Display Proof

```jsx
import DealRoomProofSection from '@/components/sales/proof/DealRoomProofSection';

<DealRoomProofSection 
  organizationId={orgId}
  title="Our Success Stories"
/>
```

**Shows:** Approved public highlights in 2-column grid with metrics

---

## Data Structure

```javascript
{
  highlightId: string,
  organizationId: string,
  highlightType: 'growth_milestone' | 'revenue_result' | 'content_win' | 'lead_breakthrough' | 'efficiency_gain' | 'testimonial',
  summaryText: string,              // 1-2 sentences
  metrics: { growthScore: 78, ... }, // Parsed JSON
  highlightLabel: string,            // "78/100 Growth"
  approvalStatus: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived',
  dealRoomVisibility: 'draft' | 'private' | 'public',
  createdAt: ISO date,
  createdBy: user email
}
```

---

## Approval Flow

```
Generated (Draft)
    ↓
Admin Reviews → "Approve"
    ↓
Approved (Public)
    ↓
Visible in DealRoomProofSection
```

---

## Highlight Types & Colors

| Type | Color | Icon |
|------|-------|------|
| growth_milestone | Blue | TrendingUp |
| revenue_result | Green | Award |
| content_win | Purple | Zap |
| lead_breakthrough | Orange | Users |
| efficiency_gain | Teal | TrendingUp |
| testimonial | Pink | Users |

---

## Metrics Displayed Per Type

| Type | Shows |
|------|-------|
| growth_milestone | growthScore, period |
| revenue_result | dealsClosedCount, revenueAttributed |
| lead_breakthrough | leadsLoggedCount |
| content_win | contentPublishedCount, videosCreatedCount |
| efficiency_gain | momentumScore |

---

## Generation Triggers

```javascript
// Growth Milestone
if (snapshot.growthScore > 70) → "Achieved 78/100 growth score..."

// Revenue Result
if (snapshot.dealsClosedCount > 0) → "Closed 2 revenue deals..."

// Lead Breakthrough
if (snapshot.leadsLoggedCount > 8) → "Generated 12 qualified leads..."

// Content Win
if (snapshot.contentPublishedCount > 5) → "Published 8 pieces of content..."

// Efficiency Gain
if (snapshot.momentumScore > 70) → "Achieved 75/100 momentum..."
```

---

## Admin Workflow (3 Steps)

1. **Navigate to client → Sales Proof section**
2. **View latest metrics**
3. **Click "Generate Sales Highlights"**
   - Backend analyzes GrowthMetricsSnapshot
   - Creates 1-5 highlights based on metrics
4. **Review & "Approve" each highlight**
   - Approved highlights appear in deal room

---

## Deal Room Integration

```jsx
// In DealRoom component
<DealRoomProofSection organizationId={prospectOrgId} />
```

Automatically pulls approved public highlights for that organization.

---

## Testing

**Test Admin Generation:**
```javascript
// Org with high metrics should generate 5 highlights
growthScore: 78
momentumScore: 75
leadsLoggedCount: 12
dealsClosedCount: 2
contentPublishedCount: 8

// Expected: 5 highlights generated
```

**Test Deal Room Display:**
```javascript
// Approve some highlights
// Navigate to deal room
// Should see 4-5 highlight cards in grid
```

---

## Manual Testimonials

Create placeholder for manual quotes:
```javascript
await base44.entities.SuccessHighlight.create({
  highlightId: crypto.randomUUID(),
  organizationId: 'org_123',
  highlightType: 'testimonial',
  highlightLabel: 'Client Quote',
  summaryText: 'Success story',
  approvalStatus: 'approved',
  dealRoomVisibility: 'public',
  testimonialPlaceholder: true,
  testimonialText: '"We increased leads by 3x" — John Doe, Marketing Manager'
})
```

Deal room shows placeholder block until testimonialText is filled.

---

## Key Points

✅ Auto-generates from real metrics (no manual writing)
✅ Admin approval gate (only approved shows in deal room)
✅ Color-coded by type for visual variety
✅ Displays actual metrics (not generic claims)
✅ Supports manual testimonials
✅ Ready for A/B testing different summaries

---

## Troubleshooting

**No highlights showing?**
- Check if GrowthMetricsSnapshot exists for org
- Check if highlights approved (approvalStatus: 'approved')
- Check dealRoomVisibility: 'public'

**Generation failed?**
- Ensure user is admin
- Verify metricSnapshotId exists
- Check browser console for errors

**Testimonial block not showing?**
- Set testimonialPlaceholder: true
- Set approvalStatus: 'approved'
- Set dealRoomVisibility: 'public'