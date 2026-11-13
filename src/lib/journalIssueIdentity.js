export function isJournalFollowUp(issue) {
  return issue?.series === 'NTA Journal Follow-up';
}

export function journalIssueKey(issue) {
  return isJournalFollowUp(issue) ? `follow-up:${issue.slug}` : `issue:${issue.issue_number}`;
}

// Saved records are the editing authority; fallbacks never replace them.
// A follow-up shares its weekly number but retains its own delivery identity.
export function mergeJournalEditions(seeds, records) {
  const byKey = new Map(seeds.map(issue => [journalIssueKey(issue), issue]));
  const saved = new Map();
  for (const issue of records || []) {
    if (issue.status === 'Archived' || issue.series === 'Duplicate - Archived') continue;
    const key = journalIssueKey(issue);
    const existing = saved.get(key);
    if (!existing || (issue.status === 'Published' && existing.status !== 'Published')) {
      saved.set(key, issue);
    }
  }
  for (const [key, issue] of saved) byKey.set(key, issue);
  return Array.from(byKey.values()).sort((a, b) =>
    (b.issue_number || 0) - (a.issue_number || 0) || Number(isJournalFollowUp(a)) - Number(isJournalFollowUp(b))
  );
}

// Public readers do not receive editorial fields such as the email subject.
// Identify complete weekly editions using their published, reader-facing content.
export function getPublicJournalArchive(journals = []) {
  const canonical = (journals || [])
    .filter(issue =>
      issue.status === 'Published' &&
      !isJournalFollowUp(issue) &&
      Number.isInteger(issue.issue_number) &&
      issue.issue_number >= 1 &&
      issue.date >= '2026-07-28' &&
      Boolean(issue.from_ricks_desk?.trim())
    )
    .sort((a, b) => {
      const numberOrder = b.issue_number - a.issue_number;
      if (numberOrder) return numberOrder;
      const aCanonical = a.slug?.startsWith(`issue-${a.issue_number}-`) ? 1 : 0;
      const bCanonical = b.slug?.startsWith(`issue-${b.issue_number}-`) ? 1 : 0;
      return bCanonical - aCanonical || (b.date || '').localeCompare(a.date || '');
    });

  return canonical.filter((issue, index, all) =>
    all.findIndex(candidate => candidate.issue_number === issue.issue_number) === index
  );
}

export function mergePublicJournalIssues(entities, seeds) {
  const byIssue = new Map(seeds.map(issue => [journalIssueKey(issue), issue]));
  for (const issue of entities || []) {
    if (!(issue?.from_ricks_desk || issue?.what_we_built || issue?.what_we_learned || issue?.what_it_means_for_your_business || issue?.this_weeks_challenge)) continue;
    const key = journalIssueKey(issue);
    const existing = byIssue.get(key);
    const issueTime = Date.parse(issue.date || issue.created_date || '1970-01-01');
    const existingTime = Date.parse(existing?.date || existing?.created_date || '1970-01-01');
    if (!existing || (issue.status === 'Published' && issueTime >= existingTime)) {
      byIssue.set(key, issue);
    }
  }
  return Array.from(byIssue.values());
}
