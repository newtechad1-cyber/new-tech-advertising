# Global Context Engine — Implementation Checklist

✅ **All components built and ready for integration**

---

## Deliverables

### Core Entity
- ✅ `entities/GlobalAppContext.json` — Context state tracking (12 fields)

### Hooks & Utilities
- ✅ `components/context/useGlobalContext.js` — Main context hook (init, switch, check, label)
- ✅ `components/context/useContextualNav.js` — Context-aware navigation (filter by mode)
- ✅ `components/context/useContextDataScope.js` — Data scoping utilities (prevent cross-company bleed)

### UI Components
- ✅ `components/context/GlobalContextSwitcher.jsx` — Mode/company/school/vertical switcher
- ✅ `components/context/ContextGuard.jsx` — Route/page protection based on context
- ✅ `components/context/ContextDebugBadge.jsx` — Dev-only context display

### Documentation
- ✅ `components/context/GLOBAL_CONTEXT_GUIDE.md` — Full implementation guide (14K)
- ✅ `components/context/CONTEXT_QUICK_REFERENCE.md` — Quick start + API reference
- ✅ `components/context/IMPLEMENTATION_CHECKLIST.md` — This file

---

## Features Implemented

### 1. Context Management
- ✅ Initialize default "agency" context on login
- ✅ Load persistent context from database
- ✅ Switch between agency/client/school/vertical modes
- ✅ Track context switches with timestamp + user
- ✅ Generate unique session IDs per context

### 2. Context Switcher UI
- ✅ Popover menu showing current context
- ✅ Switch to Agency Admin (single click)
- ✅ Switch to Client Company (dropdown from ClientCompanies entity)
- ✅ Switch to School (dropdown from SchoolLeads entity)
- ✅ Switch to Vertical System (9 options: HVAC, Restaurant, Plumbing, etc.)
- ✅ Display user role in current context
- ✅ Show last switch timestamp

### 3. Route/Page Guards
- ✅ ContextGuard component for page protection
- ✅ Check single context type (e.g., "client")
- ✅ Check multiple context types (e.g., ["agency", "client"])
- ✅ Check specific vertical (e.g., "hvac")
- ✅ Redirect to appropriate dashboard on mismatch
- ✅ Show clear error message with reason

### 4. Navigation Adaptation
- ✅ Filter nav items by current context type
- ✅ Group nav by primary/operations/settings
- ✅ Agency nav: Clients, Sales, Publishing, Connections
- ✅ Client nav: Campaigns, Approvals, Analytics
- ✅ School nav: Submissions, Videos, Render Queue, Students
- ✅ Vertical nav: Content, Social, Publishing
- ✅ Dynamic dashboard route based on context

### 5. Data Scoping
- ✅ Helper to get filter for any entity
- ✅ Auto-filter company-scoped entities in client mode
- ✅ Auto-filter school-scoped entities in school mode
- ✅ Auto-filter vertical-scoped entities in vertical mode
- ✅ Prevent cross-company data bleed
- ✅ Helper to get scope info for logging

### 6. Debug Display
- ✅ Dev-only floating badge (bottom-right)
- ✅ Shows: Type, Company, School, Vertical, Role, Nav Family
- ✅ Click to expand/collapse
- ✅ Only visible in development mode
- ✅ Shows last context switch timestamp

### 7. Agent Integration
- ✅ Example code showing how agents read context
- ✅ Show how to select brand profile from context
- ✅ Show how to scope publishing profiles
- ✅ Show how to use vertical type for style guides

### 8. Backend Integration
- ✅ Example code for backend functions
- ✅ Show how to read context in Deno functions
- ✅ Show how to apply data filters server-side
- ✅ Show how to use connection scope for OAuth tokens

---

## Integration Steps

### Step 1: Add Context Switcher to Layout
**File to modify**: `Layout.js` or `AdminLayout.jsx` (or both)

```javascript
import GlobalContextSwitcher from '@/components/context/GlobalContextSwitcher.jsx';

// In header/topbar area:
<GlobalContextSwitcher />
```

### Step 2: Add Debug Badge to Layout
**File to modify**: `Layout.js`

```javascript
import ContextDebugBadge from '@/components/context/ContextDebugBadge.jsx';

// At end of component (before closing tag):
<ContextDebugBadge />
```

### Step 3: Protect Routes with ContextGuard
**Files to modify**: Any pages that need context protection

Examples:
- `pages/ClientDashboard.jsx` → wrap with `<ContextGuard requiredContext="client">`
- `pages/AdminSchoolDashboard.jsx` → wrap with `<ContextGuard requiredContext="school">`
- `pages/AdminVideoPublishing.jsx` → wrap with `<ContextGuard requiredContext={["agency", "client"]}`
- `pages/HVACSpecific.jsx` → wrap with `<ContextGuard requiredContext="vertical_system" requiredVertical="hvac">`

### Step 4: Update Navigation Components
**Files to modify**: Nav components (MainSidebar, SchoolAdminNav, ClientNav, etc.)

Replace static nav with contextual:

```javascript
import { useContextualNav } from '@/components/context/useContextualNav.js';

function NavMenu() {
  const { getGroupedNav } = useContextualNav();
  const nav = getGroupedNav();

  return (
    <>
      {nav.primary?.map(item => (
        <NavLink key={item.label} to={item.route}>
          {item.label}
        </NavLink>
      ))}
      {nav.operations?.map(item => (
        <NavLink key={item.label} to={item.route}>
          {item.label}
        </NavLink>
      ))}
    </>
  );
}
```

### Step 5: Scope Data Queries
**Files to modify**: Any data-fetching pages/hooks

```javascript
import { useContextDataScope } from '@/components/context/useContextDataScope.js';

function ClientList() {
  const { getEntityFilter } = useContextDataScope();
  const filter = getEntityFilter('ClientCompanies');
  
  const companies = await base44.entities.ClientCompanies.filter(filter);
}
```

### Step 6: Update Backend Functions
**Files to modify**: All backend functions that touch scoped data

```javascript
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();

  // Load context
  const contexts = await base44.asServiceRole.entities.GlobalAppContext.filter(
    { created_by: user.email, active: true },
    '-updated_date',
    1
  );
  const context = contexts[0];

  // Scope query
  let filter = {};
  if (context.active_context_type === 'client') {
    filter.company_id = context.active_company_id;
  }

  const data = await base44.entities.VideoRequests.filter(filter);
  return Response.json({ data });
});
```

### Step 7: Update AI Agents
**Files to modify**: Agent functions and prompts

```javascript
// In agent execution
const user = await base44.auth.me();
const contexts = await base44.entities.GlobalAppContext.filter(
  { created_by: user.email, active: true },
  '-updated_date',
  1
);
const context = contexts[0];

// Use context for brand, style, scope
const brandProfile = await base44.entities.BrandProfiles.get(
  context.active_brand_profile_id
);

const prompt = `
Generate content for ${context.active_company_name}.
Brand: ${brandProfile.brand_name}
Style: ${context.active_vertical_type}
${prompt}
`;
```

---

## Testing Checklist

### Context Switching
- [ ] Click GlobalContextSwitcher
- [ ] Switch to Agency (verify nav updates)
- [ ] Switch to Client Company (verify company selected)
- [ ] Switch to School (verify school selected)
- [ ] Switch to Vertical (verify vertical selected)
- [ ] Verify last_context_switch_at timestamp updates
- [ ] Verify context persists on page reload

### Data Scoping
- [ ] Load video list in agency mode (see all)
- [ ] Switch to client mode (see only that company's videos)
- [ ] Switch back to agency (see all again)
- [ ] Verify school queries only show school data
- [ ] Verify vertical queries only show vertical data

### Navigation Adaptation
- [ ] Agency mode: nav shows Clients, Sales, Publishing
- [ ] Client mode: nav shows Campaigns, Approvals, Analytics
- [ ] School mode: nav shows Submissions, Videos, Students
- [ ] Vertical mode: nav shows Content, Social, Publishing

### Route Guards
- [ ] Try accessing /clientdashboard in agency mode (should redirect)
- [ ] Switch to client, access /clientdashboard (should work)
- [ ] Try accessing /adminschooldashboard in client mode (should redirect)
- [ ] Switch to school, access /adminschooldashboard (should work)

### Debug Badge
- [ ] Badge shows in dev mode (NODE_ENV === 'development')
- [ ] Badge hidden in production
- [ ] Click to expand/collapse
- [ ] Shows all context fields correctly
- [ ] Shows last switch timestamp

---

## Files Structure

```
components/context/
├── useGlobalContext.js              (Main hook + session)
├── GlobalContextSwitcher.jsx        (UI component)
├── ContextGuard.jsx                 (Route guard)
├── ContextDebugBadge.jsx            (Dev display)
├── useContextualNav.js              (Nav filtering)
├── useContextDataScope.js           (Data scoping)
├── GLOBAL_CONTEXT_GUIDE.md          (Full docs)
├── CONTEXT_QUICK_REFERENCE.md       (Quick start)
└── IMPLEMENTATION_CHECKLIST.md      (This file)

entities/
└── GlobalAppContext.json            (Context entity schema)
```

---

## Code Examples

### Complete Example: Client Portal
```javascript
// pages/ClientDashboard.jsx
import ContextGuard from '@/components/context/ContextGuard.jsx';
import { useGlobalContext } from '@/components/context/useGlobalContext.js';
import { useContextDataScope } from '@/components/context/useContextDataScope.js';

export default function ClientDashboard() {
  const { context } = useGlobalContext();
  const { getEntityFilter } = useContextDataScope();

  return (
    <ContextGuard requiredContext="client">
      <div>
        <h1>Welcome, {context.active_company_name}</h1>
        
        {/* Load scoped data */}
        <VideoList filter={getEntityFilter('VideoRequests')} />
      </div>
    </ContextGuard>
  );
}
```

### Complete Example: Navigation Menu
```javascript
// components/nav/NavMenu.jsx
import { useContextualNav } from '@/components/context/useContextualNav.js';

export default function NavMenu() {
  const { getGroupedNav } = useContextualNav();
  const nav = getGroupedNav();

  return (
    <nav>
      <div className="space-y-4">
        {/* Primary */}
        {nav.primary?.map(item => (
          <NavLink key={item.label} item={item} />
        ))}

        {/* Operations */}
        {nav.operations && (
          <div className="border-t pt-4">
            {nav.operations.map(item => (
              <NavLink key={item.label} item={item} />
            ))}
          </div>
        )}

        {/* Settings */}
        {nav.settings && (
          <div className="border-t pt-4">
            {nav.settings.map(item => (
              <NavLink key={item.label} item={item} />
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
```

---

## Known Limitations

- Context switcher requires ClientCompanies and SchoolLeads entities to exist
- Vertical systems are pre-defined enum (can't add new verticals without schema change)
- Data scoping is manual in frontend queries (use hook to help)
- Backend functions must manually scope queries (SDK doesn't auto-scope)

---

## Performance Considerations

- Context loads once on app init
- No re-fetching on page changes
- Queries only when switching context
- Debug badge has zero perf impact (dev-only)
- Nav recalculates on context change (memoized)

---

## Security Notes

- Context stores company_id/school_id (not sensitive)
- Session IDs are random and tracked
- Backend must verify context on sensitive operations
- User role in context should not be trusted alone (verify on backend)
- OAuth token scope controlled by active_connection_scope field

---

## Future Enhancements

- [ ] Context history/audit log
- [ ] Favorite/recent contexts quick access
- [ ] Context-specific dashboard layouts
- [ ] Bulk operations in agency mode (affects multiple companies)
- [ ] Context-aware search (searches only in scope)
- [ ] Sync context across browser tabs
- [ ] Context inheritance (school users see sub-users)

---

## Support Resources

- **Quick Start**: See CONTEXT_QUICK_REFERENCE.md
- **Full Docs**: See GLOBAL_CONTEXT_GUIDE.md
- **Entity Schema**: See entities/GlobalAppContext.json
- **Examples**: See code examples in this checklist

---

**Built**: 2026-03-11  
**Status**: Ready for integration  
**Next**: Follow integration steps above