// Lead priority scoring engine
// Returns { score, label, reasons }

export function scoreLead(lead, deal) {
  let score = 0;
  const reasons = [];

  if (!lead) return { score: 0, label: 'Low', reasons: [] };

  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const stage = deal?.stage || '';

  if (stage === 'Proposal') { score += 35; reasons.push('Proposal stage'); }
  if (stage === 'Demo Sent') { score += 15; reasons.push('Demo sent'); }
  if (lead.next_follow_up && lead.next_follow_up < today) { score += 25; reasons.push('Overdue follow-up'); }
  if (lead.next_follow_up === today) { score += 10; reasons.push('Due today'); }
  if (deal?.value && Number(deal.value) >= 1000) { score += 20; reasons.push('High value deal'); }
  if (lead.created_date && lead.created_date.split('T')[0] >= weekAgo) { score += 10; reasons.push('New this week'); }

  if (!lead.phone && !lead.email) { score -= 10; reasons.push('No contact info'); }
  if (['Closed Won', 'Closed Lost'].includes(stage)) { score -= 10; }
  if (!lead.next_follow_up) { score -= 5; }

  const label = score >= 40 ? 'High' : score >= 15 ? 'Medium' : 'Low';

  return { score, label, reasons };
}

export const PRIORITY_STYLES = {
  High:   { badge: 'bg-red-900/60 text-red-300',    dot: 'bg-red-400' },
  Medium: { badge: 'bg-amber-900/60 text-amber-300', dot: 'bg-amber-400' },
  Low:    { badge: 'bg-slate-700 text-slate-400',    dot: 'bg-slate-500' },
};