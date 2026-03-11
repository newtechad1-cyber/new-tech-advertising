# NTA Master Data + Entity Governance Layer

## OVERVIEW

A complete working governance system that defines, monitors, and protects the canonical data model as the platform scales.

Prevents:
- Entity drift
- Field duplication
- Lifecycle inconsistency
- Ownership confusion
- Schema-related automation errors

---

## CORE GOVERNANCE ENTITIES

### 1. MasterEntityDefinition
**Purpose**: Registry of all canonical entities in the platform

**Key Fields**:
- `entity_key`: Unique ID (e.g., 'Client', 'AgentTask')
- `entity_category`: core, operational, ai_orchestration, publishing, onboarding, reporting, client_portal, reseller, school_media
- `canonical_owner_type`: Who owns the entity (agency, reseller, client, school, system)
- `tenant_scoped`: Data isolated by tenant
- `context_scoped`: Data isolated by context (agency/client/school)
- `status`: active, deprecated, experimental, archived
- `source_of_truth`: System responsible for creation
- `lifecycle_model_json`: Reference to EntityLifecycleDefinition
- `visibility_rules_json`: Role-based visibility (agency, reseller, client, admin, system)
- `edit_rules_json`: Who can edit (admin_only, reseller_editable, client_editable, agent_writable)
- `dependent_dashboards_json`: Pages/dashboards that use this entity
- `dependent_agents_json`: Agents that operate on this entity

**Use Cases**:
- Define canonical entities
- Track ownership and scope
- Document lifecycle model
- Map dependencies
- Control visibility and edit access

---

### 2. MasterFieldDefinition
**Purpose**: Registry of all canonical fields within entities

**Key Fields**:
- `entity_key`: Parent entity
- `field_key`: Canonical field name (camelCase)
- `field_label`: Display label
- `data_type`: string, number, boolean, date, datetime, json, array, reference, enum
- `required`: Is field mandatory
- `default_value`: Default if not provided
- `allowed_values_json`: Valid values for enums
- `validation_rules_json`: min, max, pattern, custom rules
- `display_group`: Section grouping (e.g., 'Basic Info', 'Status')
- `tenant_sensitive`: Should be filtered by tenant
- `client_editable`: Client can edit
- `reseller_editable`: Reseller can edit
- `admin_only`: Only admin can edit
- `indexed`: Should be indexed for queries
- `deprecated`: Field is being phased out

**Use Cases**:
- Prevent duplicate field definitions
- Enforce naming standards
- Define edit boundaries
- Specify validation rules
- Track deprecated fields

---

### 3. EntityRelationshipDefinition
**Purpose**: Define parent-child relationships and cardinality

**Key Fields**:
- `parent_entity_key`: Parent entity
- `child_entity_key`: Child entity
- `relationship_type`: one_to_many, many_to_many, one_to_one, self_referential
- `cardinality`: 1:1, 1:N, N:M
- `required`: Is relationship required
- `cascade_rules_json`: cascade_delete, cascade_update, restrict
- `active`: Is relationship enforced

**Use Cases**:
- Prevent orphan records
- Define cascade rules
- Detect relationship gaps
- Identify cross-context risks

---

### 4. EntityLifecycleDefinition
**Purpose**: Define valid statuses and allowed state transitions

**Key Fields**:
- `entity_key`: Entity with lifecycle
- `lifecycle_name`: Display name
- `allowed_statuses_json`: Valid status values
- `allowed_transitions_json`: State machine definition
- `terminal_statuses_json`: Final states (no further transitions)
- `blocked_transition_rules_json`: Rules that prevent transitions

**Use Cases**:
- Prevent invalid status combinations
- Define state machines
- Enforce workflow ordering
- Detect lifecycle conflicts

**Example**:
```json
{
  "allowed_statuses": ["draft", "approved", "published", "archived"],
  "allowed_transitions": [
    { "from": "draft", "to": ["approved"] },
    { "from": "approved", "to": ["published"] },
    { "from": "published", "to": ["archived"] }
  ],
  "terminal_statuses": ["archived"]
}
```

---

### 5. EntityGovernanceAuditLog
**Purpose**: Track all governance changes for compliance

**Key Fields**:
- `entity_key`: Entity affected
- `field_key`: Field affected (if applicable)
- `change_type`: field_added, field_renamed, field_deprecated, lifecycle_updated, relationship_changed, etc.
- `old_value_json`: Previous value
- `new_value_json`: New value
- `changed_by`: Email of changer
- `changed_by_role`: admin, system, audit
- `reason`: Why change was made

**Use Cases**:
- Compliance audit trail
- Track schema evolution
- Understand impact of changes
- Rollback decisions

---

### 6. EntityDependencyMap
**Purpose**: Track how entities connect to system components

**Key Fields**:
- `entity_key`: Source entity
- `dependency_type`: used_by_page, used_by_dashboard, used_by_agent, used_by_workflow, used_by_report, used_by_integration
- `dependency_name`: Name of dependent (e.g., 'AdminClients')
- `dependency_target`: Specific path/key
- `notes`: Additional context

**Use Cases**:
- See impact before schema changes
- Understand system architecture
- Identify orphaned entities
- Plan migrations

---

### 7. SchemaHealthSnapshot
**Purpose**: Monitor overall schema health and detect issues

**Key Fields**:
- `entity_key`: Entity being evaluated
- `required_field_coverage_score`: 0-100 - % of fields with definitions
- `naming_consistency_score`: 0-100 - adherence to naming standards
- `relationship_integrity_score`: 0-100 - relationship validity
- `lifecycle_consistency_score`: 0-100 - status field consistency
- `orphan_record_risk_score`: 0-100 - risk of orphaned records
- `governance_health_score`: 0-100 - overall health
- `issues_json`: Array of detected issues

**Issue Types**:
- Critical: Relationship broken, orphan risk high
- Warning: Deprecated fields active, naming inconsistent
- Info: Coverage gaps, minor standards

---

## GOVERNANCE COMMAND CENTER

### /admingovernance

**Purpose**: Executive view of platform data health

**Sections**:

1. **KPI Cards** (top)
   - Governed Entities
   - Governed Fields
   - Overall Health Score
   - Deprecated Fields Count
   - Lifecycle Conflicts
   - Relationship Risks

2. **Overview Tab**
   - GovernanceHealthPanel: Visual health score breakdown
   - SchemaHealthAlerts: Critical and warning issues
   - RecentGovernanceChanges: Audit trail

3. **Other Tabs**
   - Entities: Entity registry by category
   - Fields: Field explorer (go to /admingovernance/fields)
   - Relationships: Relationship explorer (go to /admingovernance/relationships)
   - Lifecycles: Lifecycle view (go to /admingovernance/lifecycles)
   - Dependencies: Dependency map (go to /admingovernance/dependencies)
   - Audit: Change log (go to /admingovernance/audit)

---

## EXPLORER PAGES

### /admingovernance/fields

**Purpose**: Field governance and validation rules

**Features**:
- Filter by entity, data type, editable role
- Highlight deprecated active fields
- Show validation rules
- Show tenant sensitivity
- Track indexed fields

**Stats**:
- Total Fields
- Deprecated
- Required
- Indexed
- Client Editable

---

### /admingovernance/relationships

**Purpose**: Entity relationships and cascade rules

**Features**:
- Parent → Child view
- Cardinality visualization
- Cascade rule display
- Required vs optional
- Active/inactive status

**Stats**:
- Total relationships
- Required
- Optional
- Inactive (risk)

---

### /admingovernance/lifecycles

**Purpose**: Status definitions and state machines

**Features**:
- Allowed statuses
- State transitions (with visualization)
- Terminal states
- Blocked transition rules

**Visual**:
- Status badges (normal/terminal)
- Transition arrows
- State machine diagram

---

### /admingovernance/dependencies

**Purpose**: Entity dependencies across system

**Shows**:
- Pages using entity
- Dashboards using entity
- Agents operating on entity
- Workflows referencing entity
- Reports using entity
- Integrations accessing entity

**Grouped By**: Entity for easy impact analysis

---

### /admingovernance/audit

**Purpose**: Complete governance change history

**Features**:
- Search by entity, field, user, reason
- Filter by change type
- Show before/after values
- Track who changed what and when
- Display change reason

**Stats**:
- Total changes
- Fields added
- Fields deprecated
- Relationships modified

---

## SUPPORTING COMPONENTS

### GovernanceHealthPanel
- Overall health score (0-100)
- 5 metric breakdown:
  - Field Coverage
  - Naming Consistency
  - Relationship Integrity
  - Lifecycle Consistency
  - Orphan Risk
- Color-coded progress bars
- Last check timestamp

### EntityRegistryOverview
- Entities grouped by category
- Status badges
- Tenant/global scope indicators
- Deprecated warnings
- Quick links to detail views

### SchemaHealthAlerts
- Critical issues (red)
- Warnings (amber)
- Info items (blue)
- Auto-hides if no issues

### RecentGovernanceChanges
- Latest 10 changes
- Change type icons
- Affected entity + field
- Change reason
- Timestamp + user

---

## HEALTH SCORING ALGORITHM

### Required Field Coverage (0-25 points)
```
Points = (defined_fields / total_fields) * 25
```

### Naming Consistency (0-25 points)
```
Points = (consistent_fields / total_fields) * 25
- Checks camelCase, no underscores
- Checks semantic consistency
```

### Relationship Integrity (0-25 points)
```
Points = (valid_relationships / total_relationships) * 25
- Required relationships exist
- Cardinality is correct
- No orphan risks
```

### Lifecycle Consistency (0-25 points)
```
Points = (consistent_status_usage / total_status_fields) * 25
- Status fields match lifecycle definition
- Transitions are valid
- No invalid status values
```

### Orphan Risk (inverse, 0-25 points)
```
Points = 25 - (orphan_records / total_records * 25)
```

### Overall Governance Health Score
```
Total = (Coverage + Naming + Relationships + Lifecycle + Orphan) / 5
Color:
  ≥ 80 = Emerald (Excellent)
  60-79 = Amber (Fair)
  < 60 = Red (At Risk)
```

---

## GOVERNANCE RULES

### Naming Standards
- Entity keys: PascalCase (e.g., 'ClientCompany')
- Field keys: camelCase (e.g., 'companyStatus')
- Semantic consistency within entity
- No abbreviations without definition

### Field Consistency
- Each field has canonical definition
- Type matches usage
- Validation rules defined
- Deprecated fields clearly marked

### Ownership & Scope
- Canonical owner type defined
- Tenant scope explicit
- Context scope explicit
- Edit boundaries clear

### Lifecycle Enforcement
- Status fields follow lifecycle definition
- Transitions are valid
- Terminal states defined
- No orphaned status values

### Edit Boundaries
- admin_only: Only admin can change
- reseller_editable: Reseller + admin
- client_editable: Client + reseller + admin
- agent_writable: Agent + admin (system changes)

### Automation Visibility
- Agents must declare write access
- Audit log tracks all automation changes
- Automation changes trigger governance alerts
- System writes vs user writes distinguished

---

## INITIAL SEED DATA

Run `seedGovernanceData` function to bootstrap governance with:

**Entities**:
- Client (core)
- AgentTask (ai_orchestration)
- VideoPublishJob (publishing)

**Fields** (per entity):
- Status fields with allowed values
- Name fields with required flag
- Indexed fields

**Relationships**:
- Client → VideoPublishJob (1:N with cascade delete)

**Lifecycles**:
- Client Lifecycle: prospect → active → churned
- Task Lifecycle: pending → running → completed/failed

**Dependencies**:
- Client → AdminClients page
- Client → AdminClients dashboard
- AgentTask → AdminAgents dashboard

**Health Snapshot**:
- Initial governance score (89%)
- Sample warning (naming consistency)

---

## ROUTES

```
/admingovernance
  └── Overview (health, alerts, recent changes)
  └── Entities (registry by category)
  └── Fields → /admingovernance/fields
  └── Relationships → /admingovernance/relationships
  └── Lifecycles → /admingovernance/lifecycles
  └── Dependencies → /admingovernance/dependencies
  └── Audit → /admingovernance/audit
```

---

## NEXT STEPS

1. **Govern Core Entities**: Add definitions for Client, AgentTask, VideoPublishJob, etc.
2. **Audit Current Schema**: Run health checks on existing entities
3. **Define Lifecycles**: Formalize status/transition rules
4. **Track Dependencies**: Map what uses what
5. **Set Standards**: Define naming/validation rules
6. **Monitor Health**: Run periodic snapshots
7. **Enforce Rules**: Add validation to entities on create/update
8. **Alert on Violations**: Integrate with ops alerts

---

## BENEFITS

✅ **Prevent Drift**: Canonical definitions prevent duplicate fields  
✅ **Lifecycle Control**: Enforce valid state transitions  
✅ **Edit Boundaries**: Clear who can modify what  
✅ **Dependency Awareness**: See impact before schema changes  
✅ **Audit Trail**: Complete change history for compliance  
✅ **Health Visibility**: Monitor schema quality over time  
✅ **Automation Safety**: Prevent automations from corrupting data  
✅ **Scale Confidence**: Governance rules enforce consistency as platform grows  

---

**Version**: 1.0  
**Status**: READY FOR DEPLOYMENT  
**Date**: 2026-03-11