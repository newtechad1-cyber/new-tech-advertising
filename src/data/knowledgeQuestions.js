export const KNOWLEDGE_QUESTION_LAST_UPDATED = '2026-09-02';

export const knowledgeQuestionGroups = [
  {
    id: 'practical-ai',
    title: 'Using AI in a real small business',
    description: 'Start with the work, keep people responsible, and let AI become more useful as it learns the business.'
  },
  {
    id: 'marketing-decisions',
    title: 'Making better marketing decisions',
    description: 'Build a foundation that can keep working instead of chasing a different shiny object every month.'
  },
  {
    id: 'trust-and-visibility',
    title: 'Trust, visibility, and local growth',
    description: 'Help the right people find, understand, and feel confident choosing your business.'
  }
];

export const knowledgeQuestions = [
  {
    group: 'practical-ai',
    slug: 'how-can-a-small-business-use-ai',
    question: 'How can a small business use AI?',
    seoTitle: 'How Can a Small Business Use AI? | NTA',
    description: 'A plainspoken answer for small-business owners who want to use AI for real work while keeping human judgment in control.',
    answer: 'Start by giving AI one useful job that supports real work—organizing notes, drafting a first version, or preparing questions. Your people still provide the context, judgment, and final approval.',
    context: 'AI is most helpful when it is connected to a real piece of work instead of treated as a magic answer. Let it help the business prepare, organize, and think through work that a person remains responsible for.',
    nextStep: 'Choose one repeated task this week. Describe the outcome you want, give AI a little background, and review the result together before using it.',
    resources: [
      { title: 'Practical AI Foundations', path: '/knowledge/ai-foundations' },
      { title: 'Practical AI for Small Business', path: '/practical-ai-for-small-business' },
      { title: 'How to Build Your First AI Teammate', path: '/knowledge/ai-foundations/building-your-first-ai-teammate' }
    ],
    relatedQuestionSlugs: ['where-should-i-start-with-ai', 'what-can-chatgpt-do-for-a-small-business', 'how-can-employees-use-ai-at-work']
  },
  {
    group: 'practical-ai',
    slug: 'where-should-i-start-with-ai',
    question: 'Where should I start with AI?',
    seoTitle: 'Where Should I Start With AI? | NTA',
    description: 'Start using AI in a small business by beginning with a useful piece of work, not another product to buy.',
    answer: 'Start with a repeated or frustrating piece of work, not a product to buy. Define the outcome, give AI the right context, set boundaries, and keep a person responsible for the result.',
    context: 'A small business does not need to redesign itself around an AI tool. It needs one useful place to begin so the team can learn what works without creating more confusion.',
    nextStep: 'Write down one task that takes more time than it should. Start there, then decide whether the result is useful enough to repeat.',
    resources: [
      { title: 'Start With the Work, Not the Tool', path: '/knowledge/ai-foundations/start-with-the-work-not-the-tool' },
      { title: 'Why AI Needs Business Context to Be Useful', path: '/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful' },
      { title: 'How to Build Your First AI Teammate', path: '/knowledge/ai-foundations/building-your-first-ai-teammate' }
    ],
    relatedQuestionSlugs: ['how-can-a-small-business-use-ai', 'do-i-need-a-perfect-prompt', 'what-ai-tools-does-a-small-business-really-need']
  },
  {
    group: 'practical-ai',
    slug: 'what-can-chatgpt-do-for-a-small-business',
    question: 'What can ChatGPT do for a small business?',
    seoTitle: 'What Can ChatGPT Do for a Small Business? | NTA',
    description: 'Understand the practical ways ChatGPT can help a small business prepare, organize, explain, and communicate without replacing judgment.',
    answer: 'ChatGPT can help turn scattered information into useful drafts, summaries, questions, and first-pass communication. It cannot truly know your company, make promises, or replace your judgment unless you provide context and review its work.',
    context: 'Think of ChatGPT as a helpful first pass, not the final voice of the business. It can make the blank page less intimidating and help people organize what they already know.',
    nextStep: 'Give ChatGPT a real customer question or internal task. Include the facts it needs, then compare the draft with how your business would actually explain the answer.',
    resources: [
      { title: 'Start With the Work, Not the Tool', path: '/knowledge/ai-foundations/start-with-the-work-not-the-tool' },
      { title: 'Why AI Needs Business Context to Be Useful', path: '/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful' },
      { title: 'Practical AI for Small Business', path: '/practical-ai-for-small-business' }
    ],
    relatedQuestionSlugs: ['how-can-a-small-business-use-ai', 'why-does-ai-give-bad-answers', 'how-can-ai-use-knowledge-already-inside-my-company']
  },
  {
    group: 'practical-ai',
    slug: 'do-i-need-a-perfect-prompt',
    question: 'Do I need a perfect prompt to use AI?',
    seoTitle: 'Do I Need a Perfect Prompt to Use AI? | NTA',
    description: 'A practical answer for business owners: a prompt begins an AI conversation; it does not have to be perfect.',
    answer: 'No. A prompt is the beginning of a conversation, not a test you either pass or fail. Start clearly, add context, ask follow-up questions, and correct the result as you go.',
    context: 'The best prompt is usually not a clever formula. It is a useful description of the job, the people involved, and the result you are trying to create.',
    nextStep: 'Start with one plain sentence about the work. When the first answer misses something, tell AI what it missed instead of starting over.',
    resources: [
      { title: 'Why AI Gives Wrong Answers and How to Correct It', path: '/knowledge/ai-foundations/a-prompt-is-the-beginning-of-a-conversation' },
      { title: 'Why AI Needs Business Context to Be Useful', path: '/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful' },
      { title: 'Using AI for Business Decisions Without Giving Up Human Judgment', path: '/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it' }
    ],
    relatedQuestionSlugs: ['where-should-i-start-with-ai', 'why-does-ai-give-bad-answers', 'what-can-chatgpt-do-for-a-small-business']
  },
  {
    group: 'practical-ai',
    slug: 'why-does-ai-give-bad-answers',
    question: 'Why does AI give bad answers?',
    seoTitle: 'Why Does AI Give Bad Answers? | NTA',
    description: 'Learn why AI can sound confident while missing facts or context, and how a small business can correct it responsibly.',
    answer: 'AI can sound confident while missing context, making assumptions, or simply being wrong. Treat a polished answer as a starting point: question it, add the facts it lacks, and verify anything important.',
    context: 'AI predicts useful language; it does not own the business consequences of a bad answer. The person closest to the work still has to decide what is accurate, appropriate, and safe to use.',
    nextStep: 'When an answer feels off, name the missing fact, rule, or example. Then ask AI to revise and show what it is still uncertain about.',
    resources: [
      { title: 'Why AI Gives Wrong Answers and How to Correct It', path: '/knowledge/ai-foundations/a-prompt-is-the-beginning-of-a-conversation' },
      { title: 'Why AI Needs Business Context to Be Useful', path: '/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful' },
      { title: 'Using AI for Business Decisions Without Giving Up Human Judgment', path: '/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it' }
    ],
    relatedQuestionSlugs: ['do-i-need-a-perfect-prompt', 'what-can-chatgpt-do-for-a-small-business', 'how-can-employees-use-ai-at-work']
  },
  {
    group: 'practical-ai',
    slug: 'what-ai-tools-does-a-small-business-really-need',
    question: 'What AI tools does a small business really need?',
    seoTitle: 'What AI Tools Does a Small Business Really Need? | NTA',
    description: 'Most small businesses need a useful AI assistant, trusted company context, and one practical job before they need more tools.',
    answer: 'Most businesses do not need a long list of AI tools. Start with one dependable assistant, an approved way to handle company information, and one useful job; add tools only when the work truly requires them.',
    context: 'A crowded tool list can become another project to manage. The right tool is the one that helps a real person do a real job better without making the business more complicated.',
    nextStep: 'List the work you want help with before comparing tools. If one assistant can support the job well, there is no reason to add three more.',
    resources: [
      { title: 'How to Choose the Right AI Model for the Work', path: '/knowledge/ai-foundations/use-the-model-that-gets-the-job-done' },
      { title: 'Start With the Work, Not the Tool', path: '/knowledge/ai-foundations/start-with-the-work-not-the-tool' },
      { title: 'How to Build Your First AI Teammate', path: '/knowledge/ai-foundations/building-your-first-ai-teammate' }
    ],
    relatedQuestionSlugs: ['where-should-i-start-with-ai', 'how-can-employees-use-ai-at-work', 'how-can-ai-use-knowledge-already-inside-my-company']
  },
  {
    group: 'practical-ai',
    slug: 'how-can-employees-use-ai-at-work',
    question: 'How can employees use AI at work?',
    seoTitle: 'How Can Employees Use AI at Work? | NTA',
    description: 'Give employees practical approved uses, privacy boundaries, and human accountability when using AI at work.',
    answer: 'Let employees use AI to prepare, organize, and find information—not to make unreviewed promises or decisions. Give the team approved uses, examples, privacy boundaries, and a person accountable for the final answer.',
    context: 'Good use at work is not about turning people loose with a new tool and hoping for the best. It is about helping people use it in ways that support customers, protect information, and keep responsibility clear.',
    nextStep: 'Choose two or three approved uses your team can try. Pair each one with a simple rule about what must be checked before anything goes to a customer.',
    resources: [
      { title: 'How AI Can Support a Small Business Team Without Replacing People', path: '/knowledge/business-foundations/ai-is-my-team-not-my-replacement' },
      { title: 'Using AI for Business Decisions Without Giving Up Human Judgment', path: '/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it' },
      { title: 'How to Build Your First AI Teammate', path: '/knowledge/ai-foundations/building-your-first-ai-teammate' }
    ],
    relatedQuestionSlugs: ['how-can-a-small-business-use-ai', 'why-does-ai-give-bad-answers', 'what-ai-tools-does-a-small-business-really-need']
  },
  {
    group: 'marketing-decisions',
    slug: 'how-much-should-a-small-business-spend-on-marketing',
    question: 'How much should a small business spend on marketing?',
    seoTitle: 'How Much Should a Small Business Spend on Marketing? | NTA',
    description: 'There is no honest universal marketing budget. Start with an amount you can sustain and use it to build a stronger foundation.',
    answer: 'There is no honest universal number. Start with an amount you can sustain long enough to learn, then use it to strengthen the foundation, measurement, and follow-up before scattering money across disconnected activity.',
    context: 'The right amount depends on the business, its capacity, the customer it is trying to reach, and what already works. A smaller consistent investment that leaves something useful behind can matter more than a larger burst that disappears.',
    nextStep: 'Before choosing a dollar amount, decide what part of the customer path needs the most help: being found, being understood, being trusted, being contacted, or being followed up with.',
    resources: [
      { title: 'NTA Journal: Build With the Budget You Have', path: '/journal/issue-5-build-with-the-budget-you-have' },
      { title: 'Understanding Before Spending', path: '/knowledge/business-foundations/understanding-before-spending' },
      { title: 'Why Understanding Comes Before Small Business Advertising', path: '/knowledge/truth-about-business-growth/why-understanding-comes-before-advertising' }
    ],
    relatedQuestionSlugs: ['what-should-i-do-with-my-first-500-marketing-budget', 'why-does-marketing-require-ongoing-spending', 'how-do-i-know-whether-my-marketing-is-working']
  },
  {
    group: 'marketing-decisions',
    slug: 'what-should-i-do-with-my-first-500-marketing-budget',
    question: 'What should I do with my first $500 marketing budget?',
    seoTitle: 'What Should I Do With My First $500 Marketing Budget? | NTA',
    description: 'Use a first $500 marketing budget to improve a foundation you own instead of spreading it across a one-time campaign.',
    answer: 'Put the first dollars into something you own and can keep using: clearer customer information, local visibility, proof, a stronger website path, or follow-up. Do not spread it so thin that it disappears into a one-time campaign.',
    context: 'A first budget does not have to do every marketing job at once. It should make the next customer interaction clearer and make the next dollar more useful than the last one.',
    nextStep: 'Look for the first point where a customer gets confused or hesitates. Use the budget to improve that one part of the path before buying more attention.',
    resources: [
      { title: 'NTA Journal: Build With the Budget You Have', path: '/journal/issue-5-build-with-the-budget-you-have' },
      { title: 'Growth Systems vs. Marketing Campaigns', path: '/growth-systems-vs-campaigns' },
      { title: 'Why Understanding Comes Before Small Business Advertising', path: '/knowledge/truth-about-business-growth/why-understanding-comes-before-advertising' }
    ],
    relatedQuestionSlugs: ['how-much-should-a-small-business-spend-on-marketing', 'why-does-marketing-require-ongoing-spending', 'why-isnt-my-website-generating-leads']
  },
  {
    group: 'marketing-decisions',
    slug: 'why-does-marketing-require-ongoing-spending',
    question: 'Why does marketing require ongoing spending?',
    seoTitle: 'Why Does Marketing Require Ongoing Spending? | NTA',
    description: 'Marketing needs ongoing care to maintain visibility and trust, but the goal is to build assets that keep working over time.',
    answer: 'Marketing does not mean paying for ads forever, but visibility and trust require ongoing care. Some spending buys temporary attention; lasting progress comes from continually improving useful information, customer experience, follow-up, and proof.',
    context: 'Markets change, customers ask new questions, and a business has to keep its information accurate and useful. The purpose of ongoing work is not endless activity; it is to make the system stronger month after month.',
    nextStep: 'Separate what gives you a short burst of attention from what leaves an asset behind. Give the next investment a job in both the present and the future.',
    resources: [
      { title: 'Growth Systems vs. Marketing Campaigns', path: '/growth-systems-vs-campaigns' },
      { title: 'How Owned Digital Assets Support Small Business Growth', path: '/knowledge/what-is-digital-trust/digital-assets-keep-working' },
      { title: 'Why Traditional Marketing Is No Longer Enough for Small Business', path: '/knowledge/what-is-digital-trust/why-traditional-marketing-is-no-longer-enough' }
    ],
    relatedQuestionSlugs: ['how-much-should-a-small-business-spend-on-marketing', 'what-should-i-do-with-my-first-500-marketing-budget', 'how-do-i-know-whether-my-marketing-is-working']
  },
  {
    group: 'marketing-decisions',
    slug: 'how-do-i-know-whether-my-marketing-is-working',
    question: 'How do I know whether my marketing is working?',
    seoTitle: 'How Do I Know Whether My Marketing Is Working? | NTA',
    description: 'Measure marketing with qualified calls, booked work, new customers, repeat business, referrals, and what happens after people find you.',
    answer: 'Start with business outcomes: qualified calls, booked work, new customers, repeat business, referrals, and revenue—not likes alone. Track how people found you and what happened next, then improve the weak point in the path.',
    context: 'A campaign can create activity without creating progress. The point is to see whether the right people are moving from awareness to understanding, contact, purchase, and a relationship worth keeping.',
    nextStep: 'Pick two outcomes that matter most right now. Ask every new customer how they found you, then look for patterns in the path between attention and real business.',
    resources: [
      { title: 'Growth Systems vs. Marketing Campaigns', path: '/growth-systems-vs-campaigns' },
      { title: 'Small Business Activity vs. Progress: What Creates Growth?', path: '/knowledge/truth-about-business-growth/the-difference-between-activity-and-progress' },
      { title: 'Why Understanding Comes Before Small Business Advertising', path: '/knowledge/truth-about-business-growth/why-understanding-comes-before-advertising' }
    ],
    relatedQuestionSlugs: ['how-much-should-a-small-business-spend-on-marketing', 'why-does-marketing-require-ongoing-spending', 'what-should-i-do-with-my-first-500-marketing-budget']
  },
  {
    group: 'trust-and-visibility',
    slug: 'why-isnt-my-website-generating-leads',
    question: 'Why isn’t my website generating leads?',
    seoTitle: 'Why Isn’t My Website Generating Leads? | NTA',
    description: 'A website may need stronger visibility, clarity, proof, a clear next action, or better follow-up—not simply a new design.',
    answer: 'A website can get visits without helping people understand why they should choose you or what to do next. Check visibility, clarity, proof, an easy next action, and follow-up before assuming you simply need a new design.',
    context: 'A useful website acts like a front office. It should answer the questions a customer has before calling, show reasons to trust the business, and make the next step feel simple.',
    nextStep: 'Read the homepage as a new customer. In the first minute, can you tell who the business helps, why it is trustworthy, and what you should do next?',
    resources: [
      { title: 'Why a Small Business Website Is More Than a Brochure', path: '/knowledge/what-is-digital-trust/your-website-is-no-longer-just-a-website' },
      { title: 'Why Customers Trust What They Can Understand', path: '/knowledge/how-customers-decide-who-to-trust/people-trust-what-they-can-understand' },
      { title: 'AI Website Rebuilds for Small Business', path: '/services/website-rebuilds' }
    ],
    relatedQuestionSlugs: ['how-do-i-build-customer-trust', 'how-do-i-market-a-local-service-business', 'is-social-media-enough-for-a-small-business']
  },
  {
    group: 'trust-and-visibility',
    slug: 'how-do-i-build-customer-trust',
    question: 'How do I build customer trust?',
    seoTitle: 'How Do I Build Customer Trust? | NTA',
    description: 'Build customer trust by making the business understandable, showing real evidence, keeping promises, and communicating clearly.',
    answer: 'Make your business easy to understand, show real evidence, make promises you can keep, and communicate when something changes. Trust grows from consistent experiences—not a clever claim.',
    context: 'Customers begin deciding whether to trust a business before the first conversation. Your words, website, reviews, responsiveness, and follow-through all give them evidence about what it will be like to work with you.',
    nextStep: 'Choose one promise the business makes every day. Look for the place where a customer could be unsure that you will keep it, then make the proof easier to see.',
    resources: [
      { title: 'How Customers Decide Whether to Trust a Small Business', path: '/knowledge/how-customers-decide-who-to-trust' },
      { title: 'Why Customer Evidence Matters More Than Marketing Claims', path: '/knowledge/how-customers-decide-who-to-trust/customers-trust-evidence-more-than-claims' },
      { title: 'How Small Businesses Build Trust by Keeping Promises', path: '/knowledge/how-customers-decide-who-to-trust/trust-is-built-through-kept-promises' }
    ],
    relatedQuestionSlugs: ['why-isnt-my-website-generating-leads', 'how-do-i-market-a-local-service-business', 'is-social-media-enough-for-a-small-business']
  },
  {
    group: 'trust-and-visibility',
    slug: 'how-do-i-market-a-local-service-business',
    question: 'How do I market a local service business?',
    seoTitle: 'How Do I Market a Local Service Business? | NTA',
    description: 'Help local customers find, understand, trust, and contact your service business with accurate information, proof, and follow-up.',
    answer: 'Help people nearby find and understand you before they call: accurate local information, useful service explanations, proof, reviews, easy contact, and dependable follow-up. You do not need to outspend bigger companies; you need to make the local choice clearer and easier.',
    context: 'Local customers are often looking for a business they can understand and trust quickly. Clear service information, consistent local details, real proof, and a good response after the inquiry work together.',
    nextStep: 'Check the information a local customer sees first: Google, your website, and recent reviews. Make sure all three tell the same clear story about what you do and where you work.',
    resources: [
      { title: 'Local Business Marketing', path: '/local-business-marketing' },
      { title: 'What Is Digital Trust for a Small Business?', path: '/knowledge/what-is-digital-trust/what-is-digital-trust' },
      { title: 'Why Traditional Marketing Is No Longer Enough for Small Business', path: '/knowledge/what-is-digital-trust/why-traditional-marketing-is-no-longer-enough' }
    ],
    relatedQuestionSlugs: ['why-isnt-my-website-generating-leads', 'how-do-i-build-customer-trust', 'is-social-media-enough-for-a-small-business']
  },
  {
    group: 'trust-and-visibility',
    slug: 'is-social-media-enough-for-a-small-business',
    question: 'Is social media enough for a small business?',
    seoTitle: 'Is Social Media Enough for a Small Business? | NTA',
    description: 'Social media can help a business earn attention, but it should connect to a clear website, local visibility, proof, and follow-up.',
    answer: 'No. Social media can build familiarity and earn attention, but it cannot carry the whole customer path by itself. Connect it to a useful website, local search visibility, proof, a clear next step, and follow-up.',
    context: 'Social media is useful when it helps people keep seeing the business and gives them a reason to learn more. It should be a doorway into a clearer system, not the only place the business exists online.',
    nextStep: 'Look at the last few posts. If someone is interested, can they quickly find the service details, proof, and next step they need somewhere you control?',
    resources: [
      { title: 'Social Media Marketing in Iowa and Southern Minnesota', path: '/services/social-media-management' },
      { title: 'Why a Small Business Website Is More Than a Brochure', path: '/knowledge/what-is-digital-trust/your-website-is-no-longer-just-a-website' },
      { title: 'Local Business Marketing', path: '/local-business-marketing' }
    ],
    relatedQuestionSlugs: ['how-do-i-market-a-local-service-business', 'why-isnt-my-website-generating-leads', 'how-do-i-build-customer-trust']
  },
  {
    group: 'trust-and-visibility',
    slug: 'should-a-small-business-still-advertise-on-tv',
    question: 'Should a small business still advertise on TV?',
    seoTitle: 'Should a Small Business Still Advertise on TV? | NTA',
    description: 'TV or streaming can help a small business when it reaches the right audience, supports a clear next step, and can be measured.',
    answer: 'Sometimes—but not just to look bigger. TV or streaming can make sense when it reaches the right local audience, supports a clear next step, can be measured, and fits the business’s capacity to respond.',
    context: 'A television message still needs somewhere useful to lead. It works best as part of a connected path that helps interested people learn more, contact the business, and receive a good response.',
    nextStep: 'Before buying a schedule, decide who it should reach, what they should do next, and how you will know whether the message helped create qualified opportunities.',
    resources: [
      { title: 'Streaming TV Advertising for Small Business', path: '/streaming-tv-advertising' },
      { title: 'Growth Systems vs. Marketing Campaigns', path: '/growth-systems-vs-campaigns' },
      { title: 'Why Understanding Comes Before Small Business Advertising', path: '/knowledge/truth-about-business-growth/why-understanding-comes-before-advertising' }
    ],
    relatedQuestionSlugs: ['how-do-i-know-whether-my-marketing-is-working', 'how-much-should-a-small-business-spend-on-marketing', 'what-should-i-do-with-my-first-500-marketing-budget']
  },
  {
    group: 'practical-ai',
    slug: 'how-can-ai-use-knowledge-already-inside-my-company',
    question: 'How can AI use knowledge already inside my company?',
    seoTitle: 'How Can AI Use Knowledge Already Inside My Company? | NTA',
    description: 'Capture and approve business knowledge first, then give AI trusted context to help people find, organize, and use it.',
    answer: 'Begin by capturing and approving the useful knowledge people already carry—customer questions, procedures, explanations, and hard-won lessons. Then give AI that trusted context so it can help people find, organize, and use it without inventing the business’s judgment.',
    context: 'The most valuable knowledge in a small business often lives in the owner’s head or in the habits of experienced people. AI becomes more useful when that knowledge is made clear enough for a person to review and improve.',
    nextStep: 'Choose one recurring customer question or process. Write down the answer your best person would give, have the right people approve it, and use that as the first piece of trusted context.',
    resources: [
      { title: 'Why AI Works Better When It Learns From the Business', path: '/knowledge/turning-what-a-business-knows-into-an-asset/ai-becomes-more-valuable-when-it-learns-from-the-business' },
      { title: 'Why the Owner’s Knowledge Is a Small Business Asset', path: '/knowledge/turning-what-a-business-knows-into-an-asset/the-most-valuable-knowledge-usually-lives-in-the-owners-head' },
      { title: 'How to Document a Small Business Process So It Can Be Repeated', path: '/knowledge/turning-what-a-business-knows-into-an-asset/documenting-a-process-makes-knowledge-repeatable' }
    ],
    relatedQuestionSlugs: ['what-can-chatgpt-do-for-a-small-business', 'what-ai-tools-does-a-small-business-really-need', 'how-can-employees-use-ai-at-work']
  }
];

export function getKnowledgeQuestionBySlug(slug) {
  return knowledgeQuestions.find((question) => question.slug === String(slug || '').toLowerCase()) || null;
}

export function getKnowledgeQuestionPath(questionOrSlug) {
  const slug = typeof questionOrSlug === 'string' ? questionOrSlug : questionOrSlug?.slug;
  return '/knowledge/questions/' + slug;
}

export function getRelatedKnowledgeQuestions(question, limit = 3) {
  const requested = question?.relatedQuestionSlugs || [];
  const related = requested
    .map((slug) => getKnowledgeQuestionBySlug(slug))
    .filter(Boolean);

  if (related.length >= limit) return related.slice(0, limit);

  return [
    ...related,
    ...knowledgeQuestions.filter((candidate) =>
      candidate.slug !== question?.slug &&
      candidate.group === question?.group &&
      !related.some((item) => item.slug === candidate.slug)
    )
  ].slice(0, limit);
}
