/**
 * Curated question networks around approved Knowledge Library lessons.
 * One lesson can have many useful entrances; each question retains its own answer.
 */
export const lessonDoorways = [
  {
    id: 'listen-before-you-build',
    title: 'Understand people before you build',
    description: 'Different questions lead to the same deeper teaching: listen to the people who use, buy, and deliver the work before deciding what to build or sell.',
    lessonTitle: 'I Learned Business by Watching People',
    lessonPath: '/knowledge/what-a-lifetime-in-business-taught-me/i-learned-business-by-watching-people',
    questionSlugs: [
      'why-should-a-business-listen-before-selling',
      'what-can-customer-questions-teach-my-business',
      'why-do-customers-say-one-thing-and-do-another',
      'how-do-i-know-what-my-customers-really-need',
      'how-do-i-build-customer-trust',
      'why-isnt-my-website-generating-leads',
      'how-do-i-market-a-local-service-business',
      'how-do-i-know-whether-my-marketing-is-working'
    ]
  },
  {
    id: 'start-with-the-work',
    title: 'Start with the work, then choose the AI',
    description: 'Begin with the job, the people, and the context. These questions explore what AI can actually do in a small business.',
    lessonTitle: 'Start With the Work, Not the Tool',
    lessonPath: '/knowledge/ai-foundations/start-with-the-work-not-the-tool',
    questionSlugs: [
      'where-should-i-start-with-ai',
      'what-ai-tools-does-a-small-business-really-need',
      'what-should-i-automate-in-my-small-business',
      'how-can-ai-save-me-time-in-my-business',
      'how-can-ai-use-knowledge-already-inside-my-company',
      'how-can-employees-use-ai-at-work',
      'is-ai-worth-it-for-a-small-business',
      'do-i-need-a-perfect-prompt',
      'how-can-a-small-business-use-ai'
    ]
  }
];

export function getDoorwayForQuestion(slug) {
  return lessonDoorways.find((doorway) => doorway.questionSlugs.includes(slug)) || null;
}
