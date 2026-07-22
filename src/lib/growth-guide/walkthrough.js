export const DISCOVERY_NOTICE_VERSION = '2026-07-22';

export const DISCOVERY_INTRO = {
  title: 'A conversation, not a test',
  body: 'I’ll ask one question at a time about your business, what is working, and what you want to improve. Your answers are used to reflect your business back to you and prepare a useful summary. NTA does not sell this information, and nothing is added to the NTA Journal unless you choose that separately.',
};

export const DISCOVERY_QUESTIONS = [
  { category: 'reason_for_conversation', stage: 'your_goal', prompt: 'What brought you here today—what would you most like help understanding or improving in your business?' },
  { category: 'owner_goals', stage: 'your_goal', prompt: 'If this worked well, what would be different for you or your business?' },
  { category: 'stated_pain', stage: 'what_is_happening_now', prompt: 'What feels hardest, most frustrating, or most uncertain right now?' },
  { category: 'present_process', stage: 'what_is_happening_now', prompt: 'How are you handling that today? Just describe it in your own words.' },
  { category: 'existing_tools_and_information', stage: 'what_is_happening_now', prompt: 'What tools, information, or people are already part of that process?' },
  { category: 'what_works_and_must_be_protected', stage: 'what_is_happening_now', prompt: 'What is already working well that you would not want a new system to disrupt?' },
  { category: 'missing_or_disconnected_pieces', stage: 'what_needs_to_change', prompt: 'Where do things seem to get lost, repeated, delayed, or disconnected?' },
  { category: 'desired_improvement', stage: 'what_needs_to_change', prompt: 'What would a simpler or better way of handling this look like to you?' },
  { category: 'operational_capacity', stage: 'what_needs_to_change', prompt: 'How much change could you and your team realistically take on right now?' },
  { category: 'potential_first_priority', stage: 'what_needs_to_change', prompt: 'If we improved just one part first, which change would create the most relief or value?' },
];

const stateRank = { not_started: 0, in_progress: 1, not_yet_known: 2, complete: 3 };

export function selectNextQuestion({ interpretations = [], categories = [], askedCategories = [] } = {}) {
  const interpreted = new Map(interpretations.map(item => [item.category_key, item]));
  const canonical = new Map(categories.map(item => [item.category_key, item]));
  const asked = new Set(askedCategories);

  return DISCOVERY_QUESTIONS
    .filter(question => !asked.has(question.category))
    .map((question, index) => {
      const interpretationState = interpreted.get(question.category)?.completion_state;
      const canonicalState = canonical.get(question.category)?.completion_state;
      const completionState = interpretationState || canonicalState || 'not_started';
      return { question, index, rank: stateRank[completionState] ?? 0 };
    })
    .filter(candidate => candidate.rank < stateRank.complete)
    .sort((a, b) => a.rank - b.rank || a.index - b.index)[0]?.question || null;
}

export function getReassuringProgress({ interpretations = [], categories = [] } = {}) {
  const relevant = DISCOVERY_QUESTIONS.map(question => question.category);
  const states = new Map(categories.map(item => [item.category_key, item.completion_state]));
  interpretations.forEach(item => states.set(item.category_key, item.completion_state));
  const understood = relevant.filter(category => ['complete', 'not_yet_known'].includes(states.get(category))).length;

  if (understood === 0) return { label: 'Getting oriented', percent: 8 };
  if (understood < 3) return { label: 'Understanding your goals', percent: 25 };
  if (understood < 6) return { label: 'Understanding what is happening now', percent: 52 };
  if (understood < relevant.length) return { label: 'Finding the most useful next step', percent: 78 };
  return { label: 'Ready to review what we understood', percent: 100 };
}
