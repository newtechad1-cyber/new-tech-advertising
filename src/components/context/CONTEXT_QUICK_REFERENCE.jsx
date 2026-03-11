# Global Context Engine — Quick Reference

## Files Created

| File | Purpose |
|------|---------|
| `entities/GlobalAppContext.json` | Context state entity |
| `components/context/useGlobalContext.js` | Main context hook |
| `components/context/GlobalContextSwitcher.jsx` | Switch UI component |
| `components/context/ContextGuard.jsx` | Route protection guard |
| `components/context/ContextDebugBadge.jsx` | Dev-only context display |
| `components/context/useContextualNav.js` | Context-aware navigation |
| `components/context/useContextDataScope.js` | Data scoping utilities |
| `components/context/GLOBAL_CONTEXT_GUIDE.md` | Full documentation |

---

## Quick Start

### 1. Add to Layout
```javascript
import GlobalContextSwitcher from '@/components/context/GlobalContextSwitcher.jsx';
import ContextDebugBadge from '@/components/context/ContextDebugBadge.jsx';

export default function Layout({ children }) {
  return (
    <>
      <header>
        <GlobalContextSwitcher />
      </header>
      {children}
      <ContextDebugBadge />
    </>
  );
}
```

### 2. Protect Pages
```javascript
import ContextGuard from '@/components/context/ContextGuard.jsx';

export default function ClientDashboard() {
  return (
    <ContextGuard requiredContext="client">
      <div>Client Dashboard</div>
    </ContextGuard>
  );
}
```

### 3. Use Context in Components
```javascript
import { useGlobalContext } from '@/components/context/useGlobalContext.js';

function MyComponent() {
  const { context, isContextType, switchContext } = useGlobalContext();

  if (isContextType('client')) {
    return <div>Showing for {context.active_company_name}</div>;
  }

  return <button onClick={() => switchContext({ 
    active_context_type: 'client',
    active_company_id: 'company_1'
  })}>Switch to Client</button>;
}
```

### 4. Scope Data Queries
```javascript
import { useContextDataScope } from '@/components/context/useContextDataScope.js';

function VideoList() {
  const { getEntityFilter } = useContextDataScope();
  const filter = getEntityFilter('VideoRequests');
  
  const videos = await base44.entities.VideoRequests.filter(filter);
  return <div>{videos.length} videos</div>;
}
```

### 5. Adapt Navigation
```javascript
import { useContextualNav } from '@/components/context/useContextualNav.js';

function NavMenu() {
  const { getGroupedNav } = useContextualNav();
  const nav = getGroupedNav();

  return (
    <>
      {nav.primary?.map(item => (
        <a href={item.route}>{item.label}</a>
      ))}
    </>
  );
}
```

---

## Context Types

| Type | Use Case | Nav | Data Scope |
|------|----------|-----|-----------|
| `agency` | Platform admin | Main Admin | All companies |
| `client` | Company user | Client Portal | Own company |
| `school` | School admin | School Admin | Own school |
| `vertical_system` | Vertical ops | Vertical Tools | Own vertical |

---

## Key Methods

### useGlobalContext()
```javascript
const {
  context,              // Current context record
  loading,              // Boolean
  switchContext,        // Change context
  isContextType,        // Check type
  getContextLabel,      // Get display text
  getContextMetadata    // Get JSON metadata
} = useGlobalContext();
```

### ContextGuard Props
```javascript
<ContextGuard 
  requiredContext="client"  // String or array
  requiredVertical="hvac"   // For vertical_system
  fallbackRoute="/admin"    // Redirect on mismatch
>
  {children}
</ContextGuard>
```

### useContextualNav()
```javascript
const {
  contextualNavItems,  // All filtered items
  getGroupedNav,       // Returns { primary, operations, settings }
  allItems             // All possible items
} = useContextualNav();
```

### useContextDataScope()
```javascript
const {
  getEntityFilter,     // Returns filter object
  scopedQuery,         // Helper for filtered queries
  getScopeInfo         // Returns { scope, scopeId, scopeName }
} = useContextDataScope();
```

---

## Common Tasks

### Switch to Client Mode
```javascript
const { switchContext } = useGlobalContext();
await switchContext({
  active_context_type: 'client',
  active_company_id: 'company_123',
  active_company_name: 'Johnson Heating',
  active_nav_family: 'client_portal',
});
```

### Switch to School Mode
```javascript
await switchContext({
  active_context_type: 'school',
  active_school_id: 'school_456',
  active_school_name: 'Lincoln High',
  active_nav_family: 'school_admin',
});
```

### Switch to Vertical System
```javascript
await switchContext({
  active_context_type: 'vertical_system',
  active_vertical_type: 'hvac',
  active_nav_family: 'main_admin',
});
```

### Query with Scope
```javascript
const { getEntityFilter } = useContextDataScope();
const filter = getEntityFilter('VideoRequests');
const videos = await base44.entities.VideoRequests.filter(filter);
```

### Check Context Type
```javascript
const { isContextType } = useGlobalContext();

if (isContextType('client')) {
  // Show client UI
}

if (['agency', 'client'].includes(context.active_context_type)) {
  // Show publishing UI
}
```

---

## GlobalAppContext Fields

**Always required**:
- `active_context_type`: agency | client | school | vertical_system

**Client mode**:
- `active_company_id`: Company ID
- `active_company_name`: Display name

**School mode**:
- `active_school_id`: School ID
- `active_school_name`: Display name

**Vertical mode**:
- `active_vertical_type`: hvac | restaurant | plumbing | roofing | medspa | dentist | nonprofit | professional | local

**All modes**:
- `active_user_role`: admin | manager | contributor | viewer
- `active_brand_profile_id`: Branding to use
- `active_publishing_profile_id`: Publishing defaults
- `active_connection_scope`: agency | company | school (which OAuth tokens)
- `active_nav_family`: main_admin | school_admin | client_portal | public
- `session_id`: Unique session identifier
- `context_metadata`: JSON string with extra data
- `last_context_switch_at`: Timestamp
- `last_context_switch_by`: User email

---

## Integration Checklist

- [ ] Add GlobalContextSwitcher to layout header
- [ ] Add ContextDebugBadge to layout (dev-only)
- [ ] Wrap protected pages with ContextGuard
- [ ] Update nav components to use useContextualNav()
- [ ] Update queries to use useContextDataScope()
- [ ] Update backend functions to read context
- [ ] Update AI agents to use context
- [ ] Test context switching
- [ ] Test data scoping (no cross-company bleed)
- [ ] Test nav adaptation
- [ ] Test layout/routing guards

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Wrong Context" page | Add ContextGuard with correct requiredContext |
| Data showing other companies | Use getEntityFilter() before querying |
| Nav not updating | Use useContextualNav() instead of static menu |
| Agent wrong brand | Fetch context in backend, use brand_profile_id |
| Debug badge not showing | Check NODE_ENV === 'development' |

---

**Created**: 2026-03-11  
**Status**: Ready to integrate  
**Docs**: See GLOBAL_CONTEXT_GUIDE.md for full reference