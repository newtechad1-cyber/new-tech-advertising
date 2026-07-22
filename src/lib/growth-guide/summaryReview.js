export const SUMMARY_SECTIONS = [
  { key: 'why_owner_came', label: 'Why you came' },
  { key: 'owner_goal', label: 'What you want to accomplish' },
  { key: 'greatest_difficulty', label: 'What feels hardest right now' },
  { key: 'present_process', label: 'How things work today' },
  { key: 'what_is_working', label: 'What is already working' },
  { key: 'possibly_missing_or_disconnected', label: 'What may be missing or disconnected' },
  { key: 'desired_improvement', label: 'What a better approach could look like' },
  { key: 'readiness', label: 'A realistic first priority' },
  { key: 'information_still_needed', label: 'What we still need to understand' },
];

const SUMMARY_CATEGORY_MAP = {
  why_owner_came: ['reason_for_conversation'],
  owner_goal: ['owner_goals'],
  greatest_difficulty: ['stated_pain'],
  present_process: ['present_process', 'existing_tools_and_information'],
  what_is_working: ['what_works_and_must_be_protected'],
  possibly_missing_or_disconnected: ['missing_or_disconnected_pieces'],
  desired_improvement: ['desired_improvement'],
  readiness: ['growth_readiness', 'operational_capacity', 'potential_first_priority'],
  information_still_needed: ['information_still_needed'],
};

const uniqueStatements = items => [...new Set(items.map(item => item?.statement?.trim()).filter(Boolean))];

export function buildSummaryFromInterpretation(interpretations = []) {
  const categories = new Map(interpretations.map(item => [item.category_key, item]));
  const summary = {};

  for (const section of SUMMARY_SECTIONS) {
    const categoryKeys = SUMMARY_CATEGORY_MAP[section.key];
    const facts = uniqueStatements(categoryKeys.flatMap(key => categories.get(key)?.interpreted_facts || []));
    summary[section.key] = facts.join('\n');
  }

  const unresolved = uniqueStatements(interpretations.flatMap(item => [
    ...(item.uncertainties || []),
    ...(item.conflicts || []),
  ]));
  summary.information_still_needed = uniqueStatements([
    ...summary.information_still_needed.split('\n').filter(Boolean).map(statement => ({ statement })),
    ...unresolved.map(statement => ({ statement })),
  ]).join('\n');
  summary.owner_corrections = [];
  return summary;
}

const CATEGORY_SECTION_MAP = {
  reason_for_conversation: 'why_owner_came',
  owner_goals: 'owner_goal',
  stated_pain: 'greatest_difficulty',
  present_process: 'present_process',
  existing_tools_and_information: 'present_process',
  what_works_and_must_be_protected: 'what_is_working',
  missing_or_disconnected_pieces: 'possibly_missing_or_disconnected',
  desired_improvement: 'desired_improvement',
  operational_capacity: 'readiness',
  potential_first_priority: 'readiness',
};

const DEFAULT_ENTRY_CATEGORIES = Object.keys(CATEGORY_SECTION_MAP);

export function buildSummaryFromOwnerAnswers(entries = [], askedCategories = []) {
  const summary = Object.fromEntries(SUMMARY_SECTIONS.map(section => [section.key, '']));
  const ownerAnswers = entries
    .filter(entry => entry?.speaker === 'owner' && entry?.text?.trim())
    .slice(-DEFAULT_ENTRY_CATEGORIES.length);

  ownerAnswers.forEach((entry, index) => {
    const category = askedCategories[index] || DEFAULT_ENTRY_CATEGORIES[index];
    const sectionKey = CATEGORY_SECTION_MAP[category];
    if (!sectionKey) return;
    summary[sectionKey] = [summary[sectionKey], entry.text.trim()].filter(Boolean).join('\n');
  });
  summary.owner_corrections = [];
  return summary;
}

export function buildReviewSummary(interpretations = [], entries = [], askedCategories = []) {
  const interpreted = buildSummaryFromInterpretation(interpretations);
  const ownerAnswers = buildSummaryFromOwnerAnswers(entries, askedCategories);

  return {
    ...ownerAnswers,
    ...Object.fromEntries(SUMMARY_SECTIONS.map(section => [
      section.key,
      interpreted[section.key] || ownerAnswers[section.key] || '',
    ])),
    owner_corrections: [],
  };
}

export function describeOwnerCorrections(original = {}, edited = {}) {
  return SUMMARY_SECTIONS
    .filter(section => (original[section.key] || '').trim() !== (edited[section.key] || '').trim())
    .map(section => `${section.label} was corrected by the owner during review.`);
}

export function hasUsefulSummary(summary = {}) {
  return SUMMARY_SECTIONS.some(section => (summary[section.key] || '').trim());
}
