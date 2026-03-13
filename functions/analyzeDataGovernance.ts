import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Data Governance Analysis Function
 * Analyzes entity health, detects orphans, duplicates, and violations
 * Creates a governance snapshot with findings
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Only admins can run governance analysis
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    console.log('[DataGovernance] Starting analysis...');

    // Initialize snapshot data
    const snapshot = {
      snapshotDate: new Date().toISOString(),
      entityCounts: {},
      orphanRecords: 0,
      duplicates: 0,
      violations: 0,
      statusDistribution: {},
      relationshipHealth: {},
      issues: [],
      healthScore: 100,
    };

    // 1. Count all entities
    const entities = ['Organization', 'DataGovernanceUser', 'Subscription', 'Campaign', 'ContentAsset', 'DataGovernanceLead', 'ActivityEvent'];
    const entityData = {};

    for (const entity of entities) {
      try {
        const records = await base44.asServiceRole.entities[entity].list();
        snapshot.entityCounts[entity] = records?.length || 0;
        entityData[entity] = records || [];
      } catch (error) {
        console.error(`Failed to fetch ${entity}:`, error.message);
        snapshot.entityCounts[entity] = 0;
        entityData[entity] = [];
      }
    }

    // 2. Detect orphaned records
    console.log('[DataGovernance] Checking for orphaned records...');
    const orphanIssues = await detectOrphanedRecords(base44, entityData);
    snapshot.orphanRecords = orphanIssues.count;
    if (orphanIssues.count > 0) {
      snapshot.issues.push({
        type: 'orphaned_records',
        message: `Found ${orphanIssues.count} records with missing parent entities`,
        count: orphanIssues.count,
        severity: 'warning',
      });
      snapshot.violations += orphanIssues.count;
    }

    // 3. Detect duplicates
    console.log('[DataGovernance] Checking for duplicates...');
    const duplicateIssues = await detectDuplicates(entityData);
    snapshot.duplicates = duplicateIssues.count;
    if (duplicateIssues.count > 0) {
      snapshot.issues.push({
        type: 'duplicate_records',
        message: `Found ${duplicateIssues.count} potential duplicate records`,
        count: duplicateIssues.count,
        severity: 'warning',
      });
      snapshot.violations += duplicateIssues.count;
    }

    // 4. Analyze status distributions
    console.log('[DataGovernance] Analyzing status distributions...');
    snapshot.statusDistribution = analyzeStatusDistribution(entityData);

    // 5. Check relationship integrity
    console.log('[DataGovernance] Checking relationship integrity...');
    snapshot.relationshipHealth = checkRelationshipIntegrity(entityData);

    // 6. Check governance rule violations
    console.log('[DataGovernance] Checking rule violations...');
    const ruleViolations = await checkRuleViolations(base44, entityData);
    snapshot.violations += ruleViolations.count;
    if (ruleViolations.issues?.length > 0) {
      snapshot.issues.push(...ruleViolations.issues);
    }

    // 7. Calculate health score
    snapshot.healthScore = calculateHealthScore(snapshot);

    // 8. Save snapshot
    console.log('[DataGovernance] Saving snapshot...');
    await base44.asServiceRole.entities.DataGovernanceSnapshot.create({
      snapshotId: `snapshot_${Date.now()}`,
      snapshotDate: snapshot.snapshotDate,
      entityCounts: JSON.stringify(snapshot.entityCounts),
      orphanRecords: snapshot.orphanRecords,
      duplicates: snapshot.duplicates,
      violations: snapshot.violations,
      statusDistribution: JSON.stringify(snapshot.statusDistribution),
      relationshipHealth: JSON.stringify(snapshot.relationshipHealth),
      issues: JSON.stringify(snapshot.issues),
      healthScore: snapshot.healthScore,
    });

    console.log('[DataGovernance] Analysis complete. Health score:', snapshot.healthScore);

    return Response.json({
      success: true,
      snapshot,
    });
  } catch (error) {
    console.error('[DataGovernance] Analysis failed:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Detect orphaned records (records with missing parent entities)
 */
async function detectOrphanedRecords(base44, entityData) {
  const orphans = [];

  // Check User records with missing Organization
  const users = entityData.DataGovernanceUser || [];
  const orgIds = new Set(entityData.Organization?.map(o => o.organizationId) || []);

  for (const user of users) {
    if (user.organizationId && !orgIds.has(user.organizationId)) {
      orphans.push({
        type: 'DataGovernanceUser',
        id: user.id,
        reason: `Organization ${user.organizationId} not found`,
      });
    }
  }

  // Check Subscription records with missing Organization
  const subscriptions = entityData.Subscription || [];
  for (const sub of subscriptions) {
    if (sub.organizationId && !orgIds.has(sub.organizationId)) {
      orphans.push({
        type: 'Subscription',
        id: sub.id,
        reason: `Organization ${sub.organizationId} not found`,
      });
    }
  }

  // Check Campaign records with missing Organization
  const campaigns = entityData.Campaign || [];
  for (const campaign of campaigns) {
    if (campaign.organizationId && !orgIds.has(campaign.organizationId)) {
      orphans.push({
        type: 'Campaign',
        id: campaign.id,
        reason: `Organization ${campaign.organizationId} not found`,
      });
    }
  }

  return {
    count: orphans.length,
    details: orphans,
  };
}

/**
 * Detect duplicate records
 */
function detectDuplicates(entityData) {
  const duplicates = [];

  // Check for duplicate emails in DataGovernanceUser
  const users = entityData.DataGovernanceUser || [];
  const emailMap = {};
  for (const user of users) {
    if (user.email) {
      emailMap[user.email] = (emailMap[user.email] || 0) + 1;
    }
  }

  const duplicateEmails = Object.entries(emailMap).filter(([_, count]) => count > 1);
  for (const [email, count] of duplicateEmails) {
    duplicates.push({
      type: 'DataGovernanceUser',
      field: 'email',
      value: email,
      count,
    });
  }

  // Check for duplicate campaign names within same organization
  const campaigns = entityData.Campaign || [];
  const campaignMap = {};
  for (const campaign of campaigns) {
    const key = `${campaign.organizationId}_${campaign.campaignName}`;
    campaignMap[key] = (campaignMap[key] || 0) + 1;
  }

  const duplicateCampaigns = Object.entries(campaignMap).filter(([_, count]) => count > 1);
  duplicates.push(...duplicateCampaigns.length);

  return {
    count: duplicates.length,
    details: duplicates,
  };
}

/**
 * Analyze status distributions across entities
 */
function analyzeStatusDistribution(entityData) {
  const distribution = {};

  const entities = ['Organization', 'DataGovernanceUser', 'Campaign', 'ContentAsset'];
  for (const entity of entities) {
    const records = entityData[entity] || [];
    distribution[entity] = {};

    for (const record of records) {
      if (record.status) {
        distribution[entity][record.status] = (distribution[entity][record.status] || 0) + 1;
      }
    }
  }

  return distribution;
}

/**
 * Check relationship integrity
 */
function checkRelationshipIntegrity(entityData) {
  const health = {};

  // Organization -> User relationship
  const orgs = entityData.Organization || [];
  const users = entityData.DataGovernanceUser || [];
  const usersByOrg = {};
  for (const user of users) {
    if (user.organizationId) {
      usersByOrg[user.organizationId] = (usersByOrg[user.organizationId] || 0) + 1;
    }
  }
  const orgsWithUsers = Object.keys(usersByOrg).length;
  health['Organization→User'] = orgs.length > 0 ? Math.round((orgsWithUsers / orgs.length) * 100) : 100;

  // Organization -> Subscription relationship
  const subs = entityData.Subscription || [];
  const subsByOrg = {};
  for (const sub of subs) {
    if (sub.organizationId) {
      subsByOrg[sub.organizationId] = (subsByOrg[sub.organizationId] || 0) + 1;
    }
  }
  const orgsWithSubs = Object.keys(subsByOrg).length;
  health['Organization→Subscription'] = orgs.length > 0 ? Math.round((orgsWithSubs / orgs.length) * 100) : 100;

  // Organization -> Campaign relationship
  const campaigns = entityData.Campaign || [];
  const campaignsByOrg = {};
  for (const campaign of campaigns) {
    if (campaign.organizationId) {
      campaignsByOrg[campaign.organizationId] = (campaignsByOrg[campaign.organizationId] || 0) + 1;
    }
  }
  const orgsWithCampaigns = Object.keys(campaignsByOrg).length;
  health['Organization→Campaign'] = orgs.length > 0 ? Math.round((orgsWithCampaigns / orgs.length) * 100) : 100;

  return health;
}

/**
 * Check governance rule violations
 */
async function checkRuleViolations(base44, entityData) {
  const violations = [];
  const issues = [];

  // Get active rules
  const rules = await base44.asServiceRole.entities.DataGovernanceRule.list();
  const activeRules = rules?.filter(r => r.isActive) || [];

  // Track violations per rule
  for (const rule of activeRules) {
    let ruleViolations = 0;

    if (rule.ruleType === 'required_field') {
      // Check required fields
      const records = entityData[rule.entityType] || [];
      const requiredFields = rule.condition ? JSON.parse(rule.condition).fields : [];
      for (const record of records) {
        for (const field of requiredFields) {
          if (!record[field]) {
            ruleViolations++;
          }
        }
      }
    }

    if (ruleViolations > 0) {
      violations.push({
        ruleId: rule.id,
        ruleName: rule.ruleName,
        violations: ruleViolations,
      });
      issues.push({
        type: `rule_violation_${rule.ruleType}`,
        message: `Rule "${rule.ruleName}" violated ${ruleViolations} times`,
        count: ruleViolations,
        severity: rule.severity,
      });
    }
  }

  return {
    count: violations.reduce((sum, v) => sum + v.violations, 0),
    issues,
  };
}

/**
 * Calculate overall health score
 * Deductions: orphans (-5 per), duplicates (-3 per), violations (-2 per)
 */
function calculateHealthScore(snapshot) {
  let score = 100;

  score -= Math.min(snapshot.orphanRecords * 5, 30);
  score -= Math.min(snapshot.duplicates * 3, 20);
  score -= Math.min(snapshot.violations * 2, 25);

  return Math.max(score, 0);
}