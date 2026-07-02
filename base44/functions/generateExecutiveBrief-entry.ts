// generateExecutiveBrief — Base44 server function
// M-001: Generates the daily Executive Brief for the CEO Cockpit
// Queries all entities, calculates metrics, generates AI morning brief
// Creates or updates today's ExecutiveBrief record

import { AI } from "@base44/sdk";
import {
  ExecutiveBrief,
  SalesLead,
  GapAudit,
  NtaProposal,
  SystemHealthCheck,
} from "@base44/entities";

export default async function generateExecutiveBrief() {
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = today.substring(0, 7);
  const now = new Date().toISOString();

  // ── 1. Gather data from all entities ──
  const [leads, audits, proposals, healthChecks] = await Promise.all([
    SalesLead.list().catch(() => []),
    GapAudit.list().catch(() => []),
    NtaProposal.list().catch(() => []),
    SystemHealthCheck.list().catch(() => []),
  ]);

  // Try optional entities
  let calls: any[] = [];
  let clients: any[] = [];
  try { calls = await (global as any).DiscoveryCall?.list() || []; } catch {}
  try { clients = await (global as any).AgencyClient?.list() || (global as any).Client?.list() || []; } catch {}

  // ── 2. Calculate Sales Engine Metrics ──
  const newLeadsToday = leads.filter((l: any) => l.created_date?.startsWith(today)).length;
  const openAudits = audits.filter((a: any) => a.status === 'pending' || a.status === 'in_progress').length;
  const scheduledCalls = calls.filter((c: any) => c.status === 'scheduled' || c.status === 'in_progress').length;
  const waitingProposals = proposals.filter((p: any) => p.status === 'sent' || p.status === 'pending');
  const proposalValue = waitingProposals.reduce((sum: number, p: any) => sum + (p.monthly_fee || 0) + (p.one_time_fee || 0), 0);
  const closedMonth = leads.filter((l: any) => l.status === 'closed_won' && l.updated_date?.startsWith(thisMonth)).length;
  const pipelineValue = proposals
    .filter((p: any) => !['closed_lost', 'rejected', 'expired'].includes(p.status))
    .reduce((sum: number, p: any) => sum + (p.monthly_fee || 0) * 12 + (p.one_time_fee || 0), 0);

  // ── 3. Calculate Operations Metrics ──
  const clientsOnboarding = clients.filter((c: any) => c.status === 'onboarding').length;
  const projectsInProgress = clients.filter((c: any) => c.status === 'active').length;

  // ── 4. System Health ──
  const latestHealth = healthChecks.length > 0 ? healthChecks[healthChecks.length - 1] : null;
  const systemHealthStatus = latestHealth?.overall_status || 'healthy';

  // ── 5. Follow-up Reminders ──
  const followUps = leads
    .filter((l: any) => ['contacted', 'audit_sent', 'interested', 'proposal_sent'].includes(l.status))
    .map((l: any) => ({
      lead: l.business_name || l.contact_name || 'Unknown',
      action: l.status === 'proposal_sent' ? 'Follow up on proposal' :
              l.status === 'audit_sent' ? 'Check audit response' :
              l.status === 'interested' ? 'Schedule discovery call' : 'Follow up',
      due: 'Today',
    }));

  // ── 6. Recent Activity ──
  const recentActivity = [];
  leads.slice(-5).reverse().forEach((l: any) => {
    recentActivity.push({
      type: 'lead',
      title: `Lead: ${l.business_name || l.contact_name || 'Unknown'}`,
      desc: `Status: ${(l.status || 'new').replace(/_/g, ' ')}`,
      time: l.created_date ? new Date(l.created_date).toLocaleDateString() : '—',
    });
  });

  // ── 7. OS Health ──
  const osHealth = {
    k_series: { completed: 0, in_build: 0, pending: 'TBD' },
    e_series: { completed: 2, in_build: 1, pending: 'TBD' },
    a_series: { completed: 1, in_build: 0, pending: 'TBD' },
    m_series: { completed: 0, in_build: 1, pending: 'TBD' },
  };

  // ── 8. Generate AI Morning Brief ──
  const briefContext = `
TODAY'S NTA OPERATING SYSTEM STATUS
Date: ${today}

SALES ENGINE:
- New leads today: ${newLeadsToday}
- Total leads in system: ${leads.length}
- Open audits: ${openAudits}
- Discovery calls scheduled: ${scheduledCalls}
- Proposals waiting for response: ${waitingProposals.length} (value: $${proposalValue})
- Closed this month: ${closedMonth}
- Total pipeline value: $${pipelineValue}

OPERATIONS:
- Clients onboarding: ${clientsOnboarding}
- Active projects: ${projectsInProgress}
- System health: ${systemHealthStatus}

FOLLOW-UPS NEEDED:
${followUps.map((f: any) => `- ${f.lead}: ${f.action}`).join('\n') || 'None'}

CURRENT CLIENTS:
- Johnson Heating and AC ($500/mo, due 1st)
- Monson Plumbing ($300/mo, due 15th)
- Total recurring: $800/mo

OS BUILD STATUS:
- E-002 AI Visibility Audit: Complete
- E-003 Discovery Call Workspace: Complete
- A-005 Social Publishing: Complete
- M-001 Executive Dashboard: In Build
`.trim();

  const aiResult = await AI.chat({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are the NTA AI Executive Advisor — Rick Hesse's morning intelligence assistant.

Generate a concise, actionable morning brief. Output a valid JSON object with exactly these fields:
- "morning_brief": 3-5 sentence conversational morning brief. Address Rick directly. Mention key numbers, what needs attention today, and one encouragement. No fluff.
- "ai_priorities": JSON array of 3-5 string priorities for today, ordered by urgency
- "ai_risks": JSON array of 0-3 string risks or things that need attention
- "ai_recommendations": JSON array of 2-4 string specific recommendations for today

Be specific. Use real numbers from the data. Be Rick's trusted advisor — direct, honest, helpful.`
      },
      { role: "user", content: briefContext }
    ],
    response_format: { type: "json_object" },
  });

  const aiParsed = JSON.parse(aiResult.choices[0].message.content);

  // ── 9. Create or update today's brief ──
  const briefData = {
    brief_date: today,
    generated_at: now,
    new_leads_today: newLeadsToday,
    open_audits: openAudits,
    discovery_calls_scheduled: scheduledCalls,
    proposals_waiting: waitingProposals.length,
    proposal_value: proposalValue,
    closed_this_month: closedMonth,
    pipeline_value: pipelineValue,
    clients_onboarding: clientsOnboarding,
    projects_in_progress: projectsInProgress,
    automation_jobs_running: 0,
    automation_errors: 0,
    slack_alerts: 0,
    social_posts_scheduled: 0,
    social_posts_completed: 0,
    recent_activity: JSON.stringify(recentActivity),
    revenue_goal: 5000,
    monthly_revenue: 800,
    weekly_revenue: 200,
    follow_up_reminders: JSON.stringify(followUps),
    os_health: JSON.stringify(osHealth),
    system_health_status: systemHealthStatus,
    morning_brief: aiParsed.morning_brief,
    ai_priorities: JSON.stringify(aiParsed.ai_priorities),
    ai_risks: JSON.stringify(aiParsed.ai_risks),
    ai_recommendations: JSON.stringify(aiParsed.ai_recommendations),
  };

  // Check if today's brief already exists
  let existingBriefs: any[] = [];
  try {
    existingBriefs = await ExecutiveBrief.filter({ brief_date: today });
  } catch {}

  let brief;
  if (existingBriefs.length > 0) {
    brief = await ExecutiveBrief.update(existingBriefs[0].id, briefData);
  } else {
    brief = await ExecutiveBrief.create(briefData);
  }

  return brief;
}
