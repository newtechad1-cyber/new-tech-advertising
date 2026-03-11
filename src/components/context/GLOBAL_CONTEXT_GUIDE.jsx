# NTA Global Context Engine — Implementation Guide

**Centralized system managing active operating context across all platform modes**

---

## Overview

The Global Context Engine provides a unified way to manage:
- Active operating mode (Agency / Client / School / Vertical)
- Active company, school, or vertical system
- User role in current context
- Publishing defaults and branding
- Connection token scope
- Navigation display
- Data visibility and scoping

This ensures consistent, context-aware behavior across the entire platform.

---

## Core Components

### 1. GlobalAppContext Entity
**File**: `entities/GlobalAppContext.json`

Tracks current context state:
- `active_context_type`: agency | client | school | vertical_system
- `active_company_id`, `active_company_name`: For client mode
- `active_school_id`, `active_school_name`: For school mode
- `active_vertical_type`: hvac | restaurant | plumbing | roofing | medspa | dentist | nonprofit | professional | local
- `active_user_role`: admin | manager | contributor | viewer
- `active_brand_profile_id`: Brand assets to use
- `active_publishing_profile_id`: Publishing defaults
- `active_connection_scope`: Which OAuth tokens to use (agency/company/school)
- `active_nav_family`: Which nav menu to display (main_admin/school_admin/client_portal/public)
- `session_id`: Unique session identifier
- `context_metadata`: JSON object with vertical-specific data

### 2. useGlobalContext Hook
**File**: `components/context/useGlobalContext.js`

Main hook for accessing and managing context:

```javascript
const {
  context,           // Current GlobalAppContext record
  loading,           // Boolean
  user,              // Authenticated user
  switchContext,     // Function to change context
  isContextType,     // Function to check type
  getContextLabel,   // Function to get display label
  getContextMetadata // Function to get metadata
} = useGlobalContext();
```

Usage:
```javascript
import { useGlobalContext } from '@/components/context/useGlobalContext.js';

function MyComponent() {
  const { context, switchContext, isContextType } = useGlobalContext();

  if (isContextType('client')) {
    return <ClientView company={context.active_company_name} />;
  }

  return <AgencyView />;
}
```

### 3. GlobalContextSwitcher Component
**File**: `components/context/GlobalContextSwitcher.jsx`

UI for switching between contexts:

```javascript
import GlobalContextSwitcher from '@/components/context/GlobalContextSwitcher.jsx';

// Add to admin/client layout header
<GlobalContextSwitcher />
```

Features:
- Switch to Agency Admin
- Switch to Client Company (populates from ClientCompanies entity)
- Switch to School (populates from SchoolLeads entity)
- Switch to Vertical System (dropdown: HVAC, Restaurant, etc.)
- Shows current context with badge
- Shows last switch timestamp

### 4. ContextGuard Component
**File**: `components/context/ContextGuard.jsx`

Route guard based on context type:

```javascript
import ContextGuard from '@/components/context/ContextGuard.jsx';

// Require client context
<ContextGuard requiredContext="client">
  <ClientDashboard />
</ContextGuard>

// Require agency or client
<ContextGuard requiredContext={["agency", "client"]}>
  <PublishingPage />
</ContextGuard>

// Require specific vertical
<ContextGuard requiredContext="vertical_system" requiredVertical="hvac">
  <HVACSpecificPage />
</ContextGuard>
```

Behavior:
- Shows loading state while context initializes
- If context doesn't match, displays error with redirect button
- Auto-redirects to appropriate dashboard based on required context

### 5. ContextDebugBadge Component
**File**: `components/context/ContextDebugBadge.jsx`

Dev-only floating badge showing active context:

```javascript
import ContextDebugBadge from '@/components/context/ContextDebugBadge.jsx';

// Add to Layout.jsx (will only show in development)
<ContextDebugBadge />
```

Display:
```
📍 Context
─────────────
Type: AGENCY
Company: (none)
Role: ADMIN
Nav Family: MAIN_ADMIN
```

Click to expand/collapse. Only visible in `NODE_ENV === 'development'`.

### 6. useContextualNav Hook
**File**: `components/context/useContextualNav.js`

Adapt navigation by context:

```javascript
import { useContextualNav } from '@/components/context/useContextualNav.js';

function NavMenu() {
  const { contextualNavItems, getGroupedNav } = useContextualNav();
  const grouped = getGroupedNav();

  return (
    <>
      {/* Primary items */}
      {grouped.primary?.map(item => (
        <NavLink key={item.label} item={item} />
      ))}

      {/* Operations items */}
      {grouped.operations?.map(item => (
        <NavLink key={item.label} item={item} />
      ))}
    </>
  );
}
```

Context-specific nav:
- **Agency**: Clients, Sales Pipeline, Publishing, Connections
- **Client**: Campaigns, Approvals, Analytics, Publishing
- **School**: Submissions, Video Library, Render Queue, Students
- **Vertical**: Content, Social Media, Publishing

### 7. useContextDataScope Hook
**File**: `components/context/useContextDataScope.js`

Scope entity queries by context:

```javascript
import { useContextDataScope } from '@/components/context/useContextDataScope.js';

function ClientList() {
  const { getEntityFilter, scopedQuery } = useContextDataScope();

  // Get pre-filtered query
  const filter = getEntityFilter('ClientCompanies');
  const companies = await base44.entities.ClientCompanies.filter(filter);

  // Or use scopedQuery helper
  const videos = await scopedQuery(base44.entities.VideoRequests, 'list');
}
```

Auto-filters:
- Company-scoped entities when in client context
- School-scoped entities when in school context
- Vertical-scoped entities when in vertical context

---

## Integration Points

### Layout Integration
Add context switcher and debug badge to layouts:

```javascript
// Layout.js or AdminLayout.jsx
import GlobalContextSwitcher from '@/components/context/GlobalContextSwitcher.jsx';
import ContextDebugBadge from '@/components/context/ContextDebugBadge.jsx';

export default function Layout({ children, currentPageName }) {
  return (
    <>
      {/* Header with context switcher */}
      <div className="flex justify-between items-center p-4">
        <h1>Dashboard</h1>
        <GlobalContextSwitcher />
      </div>

      {/* Main content */}
      {children}

      {/* Dev-only debug badge */}
      <ContextDebugBadge />
    </>
  );
}
```

### Page Protection
Guard pages by context:

```javascript
// pages/ClientDashboard.jsx
import ContextGuard from '@/components/context/ContextGuard.jsx';

export default function ClientDashboard() {
  return (
    <ContextGuard requiredContext="client">
      <div>Client Dashboard Content</div>
    </ContextGuard>
  );
}

// pages/HVACSpecific.jsx
<ContextGuard 
  requiredContext="vertical_system" 
  requiredVertical="hvac"
>
  <HVACContent />
</ContextGuard>
```

### AI Agent Integration
Agents must read context before executing:

```javascript
// In backend function or agent
import { base44 } from '@/api/base44Client';

async function generateContent(prompt) {
  // Get user's current context
  const user = await base44.auth.me();
  const activeContext = await base44.entities.GlobalAppContext.filter(
    { created_by: user.email, active: true },
    '-updated_date',
    1
  );

  const context = activeContext[0];

  // Use context to select:
  const brandProfile = await base44.entities.BrandProfiles.list(
    context.active_brand_profile_id
  );
  
  const publishingProfile = await base44.entities.VideoPublishingProfile.list(
    context.active_publishing_profile_id
  );

  // Generate with context-aware parameters
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `${prompt}\n\nBrand: ${brandProfile.brand_name}\nVertical: ${context.active_vertical_type}`,
    // ... other params
  });

  return result;
}
```

### Backend Function Integration
Use context scope in backend functions:

```javascript
// functions/myFunction.js
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();

  // Load user's context
  const contexts = await base44.asServiceRole.entities.GlobalAppContext.filter(
    { created_by: user.email, active: true },
    '-updated_date',
    1
  );

  const context = contexts[0];

  // Use context to scope database queries
  let query = {};
  if (context.active_context_type === 'client') {
    query.company_id = context.active_company_id;
  } else if (context.active_context_type === 'school') {
    query.school_id = context.active_school_id;
  }

  const data = await base44.entities.VideoRequests.filter(query);
  
  return Response.json({ data });
});
```

---

## Context Types & Behaviors

### Agency Mode
- **When**: Admin managing the entire platform
- **Nav**: Main Admin (clients, sales, publishing, infrastructure)
- **Connections**: Uses agency-level OAuth tokens
- **Brand**: Multiple brands (client-specific)
- **Data**: All company data visible
- **Agents**: Can operate on all companies

### Client Mode
- **When**: Company user in client portal
- **Nav**: Client Portal (campaigns, approvals, analytics)
- **Connections**: Uses company-specific OAuth tokens
- **Brand**: Single brand (their company)
- **Data**: Only their company data visible
- **Agents**: Operate only on their company

### School Mode
- **When**: School admin managing video platform
- **Nav**: School Admin (submissions, videos, students)
- **Connections**: Uses school-specific OAuth tokens
- **Brand**: School branding (mascot, colors)
- **Data**: Only their school data visible
- **Agents**: Operate only on their school

### Vertical System Mode
- **When**: Vertical-specific operations (HVAC, Restaurant, etc.)
- **Nav**: Vertical tools (content, social, publishing)
- **Connections**: Uses vertical-level tokens
- **Brand**: Vertical branding & style guide
- **Data**: Only vertical data visible
- **Agents**: Use vertical-specific writing styles and prompts

---

## Data Scoping Rules

| Entity Type | Agency | Client | School | Vertical |
|-------------|--------|--------|--------|----------|
| ClientCompanies | All | Own only | N/A | N/A |
| SchoolLeads | All | N/A | Own only | N/A |
| VideoRequests | All | Own | Own | Own |
| VideoPublishJob | All | Own | Own | Own |
| BrandProfiles | All | Own | Own | Own |
| PublishingProfile | All | Own | Own | Own |
| MetaConnection | All | Own | Own | Own |

---

## Example: Complete Workflow

### 1. User Logs In → Initialize Context
```javascript
// useGlobalContext() auto-runs on load
// Creates default "agency" context if none exists
```

### 2. User Switches to Client
```javascript
const { switchContext } = useGlobalContext();

switchContext({
  active_context_type: 'client',
  active_company_id: 'company_123',
  active_company_name: 'Johnson Heating',
  active_nav_family: 'client_portal',
});
// Layout nav automatically updates
// Data queries re-scope to company
```

### 3. User Navigates to Client Dashboard
```javascript
// pages/ClientDashboard.jsx wraps with:
<ContextGuard requiredContext="client">
  {/* Renders with context = client */}
  {/* Nav shows: Campaigns, Approvals, Analytics */}
</ContextGuard>
```

### 4. Generate Video for Company
```javascript
// Agent reads context
const context = await getActiveContext();
const brandProfile = context.active_brand_profile_id;

// Generate using brand guidelines
const video = await generateVideo(prompt, { brandProfile });
```

### 5. Publish Video to Connections
```javascript
// Backend reads context
const connections = await getCompanyConnections(
  context.active_company_id,
  context.active_connection_scope // "company"
);

// Publish using company's Meta/YouTube tokens
await publishToMeta(video, connections.meta_token);
```

---

## Common Patterns

### Check Current Context
```javascript
const { isContextType } = useGlobalContext();

if (isContextType('client')) {
  // Show client-specific UI
}
```

### Get Scope for Logging
```javascript
const { getScopeInfo } = useContextDataScope();
const scope = getScopeInfo();
console.log(`Operating in ${scope.scope} scope: ${scope.scopeName}`);
```

### Conditional Rendering
```javascript
const { context } = useGlobalContext();

return (
  <>
    {context.active_context_type === 'school' && (
      <SchoolSpecificSection />
    )}
    {['agency', 'client'].includes(context.active_context_type) && (
      <PublishingSection />
    )}
  </>
);
```

### Query with Scope
```javascript
const { getEntityFilter } = useContextDataScope();
const filter = getEntityFilter('VideoRequests');
const videos = await base44.entities.VideoRequests.filter(filter);
```

---

## Troubleshooting

### "Wrong Context" Error on Page Load
**Cause**: Page requires context type that doesn't match  
**Fix**: Use `ContextGuard` wrapper and provide correct `requiredContext`

### Data Bleed Between Companies
**Cause**: Forgot to apply data scope filter  
**Fix**: Use `useContextDataScope()` hook to auto-filter queries

### Agent Using Wrong Brand
**Cause**: Agent didn't read active context  
**Fix**: Fetch context in backend, pass brand_profile_id to LLM

### Nav Not Updating After Switch
**Cause**: Nav component not using `useContextualNav()`  
**Fix**: Update nav to use contextual hook instead of static menu

---

## API Reference

### useGlobalContext()
```javascript
{
  context: GlobalAppContext,
  loading: boolean,
  user: User,
  switchContext: (update) => Promise<GlobalAppContext>,
  isContextType: (type: string) => boolean,
  getContextLabel: () => string,
  getContextMetadata: () => object,
}
```

### useContextualNav()
```javascript
{
  contextualNavItems: object,
  getGroupedNav: () => { primary, operations, settings },
  allItems: object,
}
```

### useContextDataScope()
```javascript
{
  getEntityFilter: (entityName: string) => object,
  scopedQuery: (entity, method, args) => Promise,
  getScopeInfo: () => { scope, scopeId, scopeName, contextType },
}
```

---

**Created**: 2026-03-11  
**Status**: Complete Implementation  
**Next Steps**: Integrate into layouts, add to page guards, test switching