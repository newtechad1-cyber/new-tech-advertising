# Sales Proof Engine - Quick Reference

## Files Created

1. **Entity:** `entities/SuccessHighlight.json`
2. **Admin Create:** `components/sales/proof/AdminHighlightCreator.jsx`
3. **Admin Manage:** `components/sales/proof/AdminHighlightManager.jsx`
4. **Deal Room:** `components/sales/proof/DealRoomProofSection.jsx`
5. **Upgrade:** `components/pricing/UpgradeProofCard.jsx`
6. **Guides:** `SALES_PROOF_ENGINE_GUIDE.md`, `QUICK_REFERENCE.md`

---

## Copy-Paste Integration

### Deal Room
```jsx
import DealRoomProofSection from '@/components/sales/proof/DealRoomProofSection';

// In DealRoom component:
<DealRoomProofSection organizationId={prospectOrgId} />
```

### Upgrade Panel
```jsx
import UpgradeProofCard from '@/components/pricing/UpgradeProofCard';

// In upgrade component:
<UpgradeProofCard
  organizationId={userOrgId}
  filterByIndustry={userIndustry}
  maxCards={2}
/>
```

### Admin Dashboard
```jsx
import AdminHighlightCreator from '@/components/sales/proof/AdminHighlightCreator';
import AdminHighlightManager from '@/components/sales/proof/AdminHighlightManager';

// In admin page:
<AdminHighlightCreator organizationId={orgId} onSuccess={() => refresh()} />
<AdminHighlightManager organizationId={orgId} />
```

---

## Data Model

```javascript
{
  highlightId: string,              // unique id
  organizationId: string,           // org
  highlightType: enum,              // growth_milestone | revenue_result | ...
  industry: string,                 // optional: HVAC, SaaS, etc
  summaryText: string,              // required: short win (50-150 chars)
  metricReference: string,          // optional: "45% growth"
  testimonialQuote: string,         // optional: client quote
  approvalStatus: enum,             // draft | pending_review | approved | rejected
  visibility: enum,                 // internal | deal_room | upgrade_panels | all
  taggedForSales: boolean,          // admin flag for active use
  createdAt: date-time              // timestamp
}
```

---

## Highlight Types

| Type | Icon | Use Case |
|------|------|----------|
| growth_milestone | 📈 | Revenue/user/lead growth |
| revenue_result | 💰 | Direct revenue generated |
| content_win | 📝 | Content performance |
| lead_breakthrough | 🎯 | Lead volume/quality increase |
| efficiency_gain | ⚡ | Time/cost savings |
| testimonial | 💬 | Client quote |

---

## Approval Workflow

```
Create (draft)
    ↓
Admin clicks "Approve"
    ↓
approvalStatus → "approved"
    ↓
Admin clicks "Tag"
    ↓
taggedForSales → true
    ↓
Shows in deal room & upgrade panels
```

---

## Visibility Rules

**Highlights show IF:**
- `approvalStatus === "approved"` ✓
- `taggedForSales === true` ✓
- `visibility` matches context ✓

**DealRoomProofSection shows if:**
```
visibility: "deal_room" || "all"
```

**UpgradeProofCard shows if:**
```
visibility: "upgrade_panels" || "all"
```

---

## Component Props

### DealRoomProofSection
```jsx
<DealRoomProofSection organizationId="org_id" />
```
- Fetches 6 approved highlights
- Auto-filters for deal_room visibility
- Returns null if no results

### UpgradeProofCard
```jsx
<UpgradeProofCard
  organizationId="org_id"
  filterByIndustry="HVAC"      // optional
  filterByType="growth_milestone"  // optional
  maxCards={2}                 // default: 2
/>
```
- Compact card layout
- Returns null if no results

### AdminHighlightCreator
```jsx
<AdminHighlightCreator
  organizationId="org_id"
  onSuccess={() => { /* refresh */ }}
/>
```
- Opens form on click
- Creates in draft status
- Calls onSuccess after creation

### AdminHighlightManager
```jsx
<AdminHighlightManager organizationId="org_id" />
```
- Table of all highlights
- Approve/Reject buttons
- Tag/Untag buttons
- Delete option

---

## Common Tasks

### Show proof in deal room
```jsx
<DealRoomProofSection organizationId={prospectId} />
```

### Show 2 industry-relevant proofs in upgrade
```jsx
<UpgradeProofCard
  organizationId={userId}
  filterByIndustry={userIndustry}
  maxCards={2}
/>
```

### Create success highlight as admin
```jsx
<AdminHighlightCreator organizationId="org_main" />
```

### Manage all highlights
```jsx
<AdminHighlightManager organizationId="org_main" />
```

---

## Display Examples

**Deal Room Proof Card:**
```
┌────────────────────────┐
│ 📈 Growth Milestone    │
│ HVAC                   │
│ HVAC 3x qualified...   │
│                        │
│ 📈 120 new leads       │
│ "Best platform ever"   │
└────────────────────────┘
```

**Upgrade Proof Card:**
```
✨ Success Stories
┌──────────────────┐
│ Growth Milestone │
│ HVAC             │
│ 3x leads...      │
│ 📈 120 leads     │
└──────────────────┘
```

---

## Key Features

✅ Admin can create highlights manually
✅ Auto-filters by approval status
✅ Tagged for sales workflow
✅ Visibility controls (deal room vs upgrade)
✅ Industry filtering support
✅ Type-based color coding
✅ Testimonial support
✅ Metric display with icons
✅ Compact upgrade card variant
✅ Full deal room section variant

---

## Next Steps

1. Add AdminHighlightCreator + AdminHighlightManager to admin page
2. Add DealRoomProofSection to deal room page
3. Add UpgradeProofCard to upgrade/pricing panels
4. Create 3-5 initial highlights (mix of industries)
5. Test approval + visibility filtering
6. Track analytics events

---

## Troubleshooting

**Proofs not showing in deal room?**
- Check `approvalStatus` is "approved"
- Check `taggedForSales` is true
- Check `visibility` includes "deal_room"

**Can't find UpgradeProofCard?**
- Verify `organizationId` is correct
- Check if matching highlights exist
- Try removing `filterByIndustry` filter

**Admin manager shows old data?**
- Refresh page
- Check if highlights were actually created (check database)
- Verify organizationId matches