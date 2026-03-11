# Governance Layer - Quick Reference

## GOVERNANCE ENTITIES AT A GLANCE

| Entity | Purpose | Key Fields | Use When |
|--------|---------|-----------|----------|
| **MasterEntityDefinition** | Registry of entities | entity_key, entity_category, canonical_owner_type, tenant_scoped | Defining new entity |
| **MasterFieldDefinition** | Registry of fields | entity_key, field_key, data_type, required, admin_only | Adding field to entity |
| **EntityRelationshipDefinition** | Parent-child links | parent_entity_key, child_entity_key, cardinality, cascade_rules | Linking entities |
| **EntityLifecycleDefinition** | Status machines | entity_key, allowed_statuses, allowed_transitions, terminal_statuses | Defining status flows |
| **EntityGovernanceAuditLog** | Change history | entity_key, change_type, old_value, changed_by, reason | Tracking changes |
| **EntityDependencyMap** | Dependency tracking | entity_key, dependency_type, dependency_name, dependency_target | Mapping impact |
| **SchemaHealthSnapshot** | Health monitoring | governance_health_score, required_field_coverage_score, issues_json | Monitoring quality |

---

## GOVERNANCE ROUTES

| Route | Purpose | View |
|-------|---------|------|
| `/admingovernance` | Command center | KPIs + Overview + Registry |
| `/admingovernance/fields` | Field governance | Field table + filters |
| `/admingovernance/relationships` | Relationships | Parent→Child visualization |
| `/admingovernance/lifecycles` | Status machines | Lifecycle definitions |
| `/admingovernance/dependencies` | Impact analysis | Entity → Pages/Agents/etc |
| `/admingovernance/audit` | Change log | Audit trail + filters |

---

## HEALTH SCORE BREAKDOWN

```
Overall Health Score (0-100)

├─ Required Field Coverage (0-25)
│  └─ % of fields with definitions
├─ Naming Consistency (0-25)
│  └─ camelCase, no underscores, semantically aligned
├─ Relationship Integrity (0-25)
│  └─ Valid, complete, no orphans
├─ Lifecycle Consistency (0-25)
│  └─ Status fields match lifecycle definition
└─ Orphan Risk (0-25)
   └─ Inverse: 25 - (orphan_records / total * 25)

Color Coding:
  ≥80 = 🟢 Excellent
  60-79 = 🟡 Fair
  <60 = 🔴 At Risk
```

---

## EDIT BOUNDARIES

```
                   Who Can Edit?

admin_only ─────────► Admin only
                      (system changes)

reseller_editable ──► Reseller + Admin
                      (partner portal)

client_editable ───► Client + Reseller + Admin
                      (client portal)

agent_writable ────► Agent + Admin
                      (automation changes)
```

---

## GOVERNANCE CHANGE TYPES

```
Field Changes:
  • field_added         ✅ New field defined
  • field_renamed       ✅ Field key changed
  • field_deprecated    ⚠️  Field marked obsolete
  • field_modified      ✅ Field definition updated

Lifecycle Changes:
  • lifecycle_updated   ✅ Status machine updated

Relationship Changes:
  • relationship_added      ✅ New parent-child link
  • relationship_modified   ✅ Relationship updated

Access Changes:
  • visibility_changed    ✅ Who can see it
  • edit_rules_changed    ✅ Who can edit it
```

---

## DEPENDENCY TYPES

| Type | Icon | Example | Usage |
|------|------|---------|-------|
| used_by_page | 📄 | AdminClients | Page that displays entity |
| used_by_dashboard | 📊 | ClientDashboard | Dashboard using entity |
| used_by_agent | 🤖 | taskOrchestrator | Agent operating on entity |
| used_by_workflow | ⚙️ | onboardingWorkflow | Workflow referencing entity |
| used_by_report | 📈 | PerformanceReport | Report using entity data |
| used_by_integration | 🔗 | salesforceSyncAgent | Integration reading/writing data |

---

## LIFECYCLE STATE MACHINE EXAMPLE

```
Client Lifecycle:

prospect ──────────────► active ──────────► churned
  ↓                        ↓                    ↓
  └── Allowed from        └── Terminal       └── Terminal
      prospect             state              state
      status             (no further       (no further
                         transitions)       transitions)

Allowed Transitions:
  prospect → active    ✅
  active → churned     ✅
  prospect → churned   ❌ (invalid)
  active → prospect    ❌ (invalid)
  churned → active     ❌ (terminal)
```

---

## SCHEMA HEALTH ALERT SEVERITY

### 🔴 CRITICAL (Fix Immediately)
- Relationship broken
- Orphan risk > 50%
- Required field missing

### 🟡 WARNING (Address in Sprint)
- Deprecated field still active
- Naming inconsistent
- Orphan risk > 10%
- Coverage < 80%

### 🔵 INFO (Monitor)
- Field coverage gaps
- Minor naming issues
- Unused fields

---

## KPI CARD MEANINGS

| KPI | What It Means | Good Range |
|-----|---------------|-----------|
| **Governed Entities** | # of entities with definitions | 90%+ of all entities |
| **Governed Fields** | # of fields with definitions | 90%+ of all fields |
| **Health Score** | Overall schema quality (0-100) | ≥80 |
| **Deprecated Fields** | # of fields marked obsolete | <5% of total |
| **Lifecycle Conflicts** | Status inconsistencies | 0 |
| **Relationship Risks** | Orphan/cascade issues | 0 |

---

## SEED DATA RECAP

Running `seedGovernanceData` creates:

```
✅ MasterEntityDefinition (3 records)
   • Client
   • AgentTask
   • VideoPublishJob

✅ MasterFieldDefinition (3 records)
   • Client.name
   • Client.status
   • AgentTask.task_status

✅ EntityRelationshipDefinition (1 record)
   • Client → VideoPublishJob (1:N)

✅ EntityLifecycleDefinition (2 records)
   • Client Lifecycle (prospect → active → churned)
   • Task Lifecycle (pending → running → completed/failed)

✅ EntityDependencyMap (2 records)
   • Client used by AdminClients page
   • AgentTask used by AdminAgents dashboard

✅ SchemaHealthSnapshot (1 record)
   • Health score: 89%
   • Coverage: 92%
   • Issues: 1 warning (naming)
```

**Result**: Governance system operational with sample data

---

## COMMON WORKFLOWS

### Register a New Entity
```
1. Create MasterEntityDefinition (entity_key, category, owner_type)
2. Create MasterFieldDefinition for each field
3. Create EntityLifecycleDefinition if has status
4. Create EntityRelationshipDefinition for parents
5. Create EntityDependencyMap for pages/agents/etc
6. Verify health score improved
```

### Add a New Field
```
1. Create MasterFieldDefinition (entity_key, field_key, data_type)
2. Set required, default_value if needed
3. Set editable roles (admin_only, client_editable, etc)
4. Set deprecated=false
5. Change logged to EntityGovernanceAuditLog
```

### Deprecate a Field
```
1. Set MasterFieldDefinition.deprecated = true
2. Change logged to EntityGovernanceAuditLog
3. Monitor for active usage
4. Health check flags as warning
5. Remove after grace period
```

### Check Impact Before Schema Change
```
1. Go to /admingovernance/dependencies
2. Find entity key
3. See all pages/agents/workflows using it
4. Identify impact scope
5. Plan migration carefully
```

---

## COMMAND CENTER TOUR

```
/admingovernance

┌─ KPI Cards (6 metrics) ──────────┐
│ Entities │ Fields │ Health │ ... │
└──────────────────────────────────┘

┌─ Tabs ────────────────────────────┐
│ Overview │ Entities │ Fields │ ... │
└──────────────────────────────────┘

┌─ OVERVIEW TAB ────────────────────┐
│                                  │
│ GovernanceHealthPanel            │
│ ├─ Overall Score                │
│ └─ 5 Metrics + Bars             │
│                                  │
│ SchemaHealthAlerts              │
│ ├─ Critical Issues              │
│ ├─ Warnings                     │
│ └─ Info Items                   │
│                                  │
│ RecentGovernanceChanges         │
│ └─ Last 10 Changes              │
│                                  │
└──────────────────────────────────┘
```

---

## INTEGRATION WITH ENTITIES

When creating/updating entity records:

```javascript
// 1. Check if governed
const definition = await MasterEntityDefinition.get(entity_key);
if (!definition) {
  throw new Error(`Entity ${entity_key} not governed`);
}

// 2. Validate required fields
definition.fields.forEach(f => {
  if (f.required && !record[f.field_key]) {
    throw new Error(`${f.field_key} required`);
  }
});

// 3. Check edit access
if (definition.admin_only && !user.isAdmin) {
  throw new Error('Admin only');
}

// 4. Validate status transition
if (record.status) {
  const lifecycle = await EntityLifecycleDefinition.get(entity_key);
  if (!isValidTransition(lifecycle, oldStatus, newStatus)) {
    throw new Error('Invalid transition');
  }
}

// 5. Log change
await EntityGovernanceAuditLog.create({
  entity_key,
  field_key,
  change_type: 'field_modified',
  old_value_json: oldValue,
  new_value_json: newValue,
  changed_by: user.email,
  reason: 'Updated client status'
});
```

---

## MONITORING CHECKLIST

### Daily
- [ ] Check for critical issues
- [ ] Review failed validations

### Weekly
- [ ] Check health score trend
- [ ] Review recent changes
- [ ] Verify audit trail

### Monthly
- [ ] Assess coverage %
- [ ] Identify deprecated fields in use
- [ ] Plan entity migrations

### Quarterly
- [ ] Full schema audit
- [ ] Standards review
- [ ] Update documentation

---

## CONTACT & SUPPORT

- **Questions**: Check GOVERNANCE_SYSTEM_GUIDE.md
- **Issues**: File issue with reproduction
- **Training**: Contact Platform Team
- **Escalations**: #platform-alerts

---

**Last Updated**: 2026-03-11  
**Version**: 1.0  
**Status**: PRODUCTION