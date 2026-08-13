import { businessFoundationsLessons } from './businessFoundations';
import { truthAboutBusinessGrowthLessons } from './truthAboutBusinessGrowth';
import { howCustomersDecideWhoToTrustLessons } from './howCustomersDecideWhoToTrust';
import { howBusinessesTurnTrustIntoLastingRelationshipsLessons } from './howBusinessesTurnTrustIntoLastingRelationships';
import { turningWhatABusinessKnowsIntoAnAssetLessons } from './turningWhatABusinessKnowsIntoAnAsset';
import { aiFoundationsLessons } from './aiFoundations';
import { lesson11 as aiFoundationsLesson11 } from './aiFoundationsLesson11';
import { lesson12 as aiFoundationsLesson12 } from './aiFoundationsLesson12';
import { lesson13 as aiFoundationsLesson13 } from './aiFoundationsLesson13';
import { lesson14 as aiFoundationsLesson14 } from './aiFoundationsLesson14';
import { whatIsDigitalTrustLessons } from './whatIsDigitalTrust';

const withDerivedLessonNavigation = (lessons) => lessons.map((lesson, index) => ({
  ...lesson,
  displayNumber: index + 1,
  previousLessonSlug: index > 0 ? lessons[index - 1].slug : null,
  nextLessonSlug: index < lessons.length - 1 ? lessons[index + 1].slug : null
}));

const completeAiFoundationsLessons = [
  ...aiFoundationsLessons,
  aiFoundationsLesson11,
  aiFoundationsLesson12,
  aiFoundationsLesson13,
  aiFoundationsLesson14
];


const lessonKey = (collectionSlug, lessonSlug) => `${collectionSlug}/${lessonSlug}`;

// These are editorial connections, not keyword matches. Each connection should
// help a reader take the present idea one useful step further.
const contextualLessonLinks = Object.freeze({
  [lessonKey('business-foundations', 'why-nta-exists')]: [
    lessonKey('truth-about-business-growth', 'why-understanding-comes-before-advertising'),
    lessonKey('ai-foundations', 'start-with-the-work-not-the-tool')
  ],
  [lessonKey('business-foundations', 'how-businesses-really-grow')]: [
    lessonKey('truth-about-business-growth', 'why-growth-is-a-system'),
    lessonKey('how-customers-decide-who-to-trust', 'trust-begins-before-the-first-conversation')
  ],
  [lessonKey('business-foundations', 'marketing-isnt-magic')]: [
    lessonKey('truth-about-business-growth', 'marketing-doesnt-create-great-businesses'),
    lessonKey('what-is-digital-trust', 'your-website-is-no-longer-just-a-website')
  ],
  [lessonKey('business-foundations', 'every-system-produces-exactly-what-it-was-designed-to-produce')]: [
    lessonKey('truth-about-business-growth', 'every-business-is-already-perfectly-designed'),
    lessonKey('turning-what-a-business-knows-into-an-asset', 'documenting-a-process-makes-knowledge-repeatable')
  ],
  [lessonKey('business-foundations', 'understanding-before-spending')]: [
    lessonKey('truth-about-business-growth', 'why-understanding-comes-before-advertising'),
    lessonKey('ai-foundations', 'start-with-the-work-not-the-tool')
  ],
  [lessonKey('business-foundations', 'ai-is-my-team-not-my-replacement')]: [
    lessonKey('ai-foundations', 'ai-isnt-magic-either'),
    lessonKey('ai-foundations', 'ai-can-assist-judgment-it-cannot-own-it')
  ],
  [lessonKey('business-foundations', 'why-trust-comes-before-marketing')]: [
    lessonKey('how-customers-decide-who-to-trust', 'trust-begins-before-the-first-conversation'),
    lessonKey('how-customers-decide-who-to-trust', 'customers-trust-evidence-more-than-claims')
  ],
  [lessonKey('business-foundations', 'what-building-my-own-digital-growth-office-taught-me')]: [
    lessonKey('ai-foundations', 'ai-makes-complicated-work-easier'),
    lessonKey('turning-what-a-business-knows-into-an-asset', 'your-business-knows-more-than-it-has-documented')
  ],

  [lessonKey('truth-about-business-growth', 'businesses-dont-need-more-marketing-they-need-a-better-growth-system')]: [
    lessonKey('business-foundations', 'how-businesses-really-grow'),
    lessonKey('what-is-digital-trust', 'the-connected-business-is-the-future')
  ],
  [lessonKey('truth-about-business-growth', 'marketing-doesnt-create-great-businesses')]: [
    lessonKey('business-foundations', 'marketing-isnt-magic'),
    lessonKey('how-customers-decide-who-to-trust', 'trust-is-built-through-kept-promises')
  ],
  [lessonKey('truth-about-business-growth', 'every-business-is-already-perfectly-designed')]: [
    lessonKey('business-foundations', 'every-system-produces-exactly-what-it-was-designed-to-produce'),
    lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'customer-feedback-should-change-the-business')
  ],
  [lessonKey('truth-about-business-growth', 'the-difference-between-activity-and-progress')]: [
    lessonKey('truth-about-business-growth', 'why-growth-is-a-system'),
    lessonKey('business-foundations', 'understanding-before-spending')
  ],
  [lessonKey('truth-about-business-growth', 'why-growth-is-a-system')]: [
    lessonKey('business-foundations', 'how-businesses-really-grow'),
    lessonKey('what-is-digital-trust', 'the-connected-business-is-the-future')
  ],
  [lessonKey('truth-about-business-growth', 'what-business-owners-really-buy')]: [
    lessonKey('how-customers-decide-who-to-trust', 'people-trust-what-they-can-understand'),
    lessonKey('ai-foundations', 'you-can-do-what-i-do-but-you-dont-have-to')
  ],
  [lessonKey('truth-about-business-growth', 'why-understanding-comes-before-advertising')]: [
    lessonKey('business-foundations', 'understanding-before-spending'),
    lessonKey('how-customers-decide-who-to-trust', 'trust-begins-before-the-first-conversation')
  ],

  [lessonKey('how-customers-decide-who-to-trust', 'trust-begins-before-the-first-conversation')]: [
    lessonKey('business-foundations', 'why-trust-comes-before-marketing'),
    lessonKey('what-is-digital-trust', 'your-website-is-no-longer-just-a-website')
  ],
  [lessonKey('how-customers-decide-who-to-trust', 'people-trust-what-they-can-understand')]: [
    lessonKey('business-foundations', 'why-nta-exists'),
    lessonKey('turning-what-a-business-knows-into-an-asset', 'stories-turn-experience-into-understanding')
  ],
  [lessonKey('how-customers-decide-who-to-trust', 'customers-trust-evidence-more-than-claims')]: [
    lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'customer-feedback-should-change-the-business'),
    lessonKey('what-is-digital-trust', 'digital-assets-keep-working')
  ],
  [lessonKey('how-customers-decide-who-to-trust', 'trust-is-built-through-kept-promises')]: [
    lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'the-sale-is-the-beginning-not-the-end'),
    lessonKey('truth-about-business-growth', 'marketing-doesnt-create-great-businesses')
  ],
  [lessonKey('how-customers-decide-who-to-trust', 'people-remember-how-a-business-made-them-feel')]: [
    lessonKey('what-is-digital-trust', 'your-website-is-no-longer-just-a-website'),
    lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'customer-feedback-should-change-the-business')
  ],
  [lessonKey('how-customers-decide-who-to-trust', 'trust-means-putting-the-relationship-before-the-transaction')]: [
    lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'the-sale-is-the-beginning-not-the-end'),
    lessonKey('truth-about-business-growth', 'what-business-owners-really-buy')
  ],

  [lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'the-sale-is-the-beginning-not-the-end')]: [
    lessonKey('how-customers-decide-who-to-trust', 'trust-means-putting-the-relationship-before-the-transaction'),
    lessonKey('what-is-digital-trust', 'relationships-are-your-greatest-competitive-advantage')
  ],
  [lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'staying-connected-without-always-selling')]: [
    lessonKey('turning-what-a-business-knows-into-an-asset', 'customer-questions-reveal-what-the-business-should-teach'),
    lessonKey('how-customers-decide-who-to-trust', 'trust-means-putting-the-relationship-before-the-transaction')
  ],
  [lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'a-business-should-remember-its-customers')]: [
    lessonKey('ai-foundations', 'ai-needs-context-before-it-can-be-helpful'),
    lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'customer-feedback-should-change-the-business')
  ],
  [lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'every-customer-relationship-should-teach-the-business-something')]: [
    lessonKey('turning-what-a-business-knows-into-an-asset', 'customer-questions-reveal-what-the-business-should-teach'),
    lessonKey('turning-what-a-business-knows-into-an-asset', 'your-business-knows-more-than-it-has-documented')
  ],
  [lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'customer-feedback-should-change-the-business')]: [
    lessonKey('turning-what-a-business-knows-into-an-asset', 'customer-questions-reveal-what-the-business-should-teach'),
    lessonKey('business-foundations', 'every-system-produces-exactly-what-it-was-designed-to-produce')
  ],
  [lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'customers-become-loyal-when-they-help-shape-the-business')]: [
    lessonKey('how-customers-decide-who-to-trust', 'customers-trust-evidence-more-than-claims'),
    lessonKey('turning-what-a-business-knows-into-an-asset', 'stories-turn-experience-into-understanding')
  ],
  [lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'the-strongest-growth-comes-from-relationships-that-create-more-relationships')]: [
    lessonKey('truth-about-business-growth', 'why-growth-is-a-system'),
    lessonKey('what-is-digital-trust', 'relationships-are-your-greatest-competitive-advantage')
  ],

  [lessonKey('turning-what-a-business-knows-into-an-asset', 'your-business-knows-more-than-it-has-documented')]: [
    lessonKey('business-foundations', 'what-building-my-own-digital-growth-office-taught-me'),
    lessonKey('ai-foundations', 'ai-needs-context-before-it-can-be-helpful')
  ],
  [lessonKey('turning-what-a-business-knows-into-an-asset', 'the-most-valuable-knowledge-usually-lives-in-the-owners-head')]: [
    lessonKey('ai-foundations', 'ai-makes-complicated-work-easier'),
    lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'every-customer-relationship-should-teach-the-business-something')
  ],
  [lessonKey('turning-what-a-business-knows-into-an-asset', 'customer-questions-reveal-what-the-business-should-teach')]: [
    lessonKey('how-customers-decide-who-to-trust', 'people-trust-what-they-can-understand'),
    lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'customer-feedback-should-change-the-business')
  ],
  [lessonKey('turning-what-a-business-knows-into-an-asset', 'stories-turn-experience-into-understanding')]: [
    lessonKey('how-customers-decide-who-to-trust', 'people-remember-how-a-business-made-them-feel'),
    lessonKey('how-customers-decide-who-to-trust', 'customers-trust-evidence-more-than-claims')
  ],
  [lessonKey('turning-what-a-business-knows-into-an-asset', 'documenting-a-process-makes-knowledge-repeatable')]: [
    lessonKey('business-foundations', 'every-system-produces-exactly-what-it-was-designed-to-produce'),
    lessonKey('ai-foundations', 'automation-comes-after-understanding')
  ],
  [lessonKey('turning-what-a-business-knows-into-an-asset', 'ai-becomes-more-valuable-when-it-learns-from-the-business')]: [
    lessonKey('ai-foundations', 'ai-needs-context-before-it-can-be-helpful'),
    lessonKey('ai-foundations', 'building-your-first-ai-teammate')
  ],
  [lessonKey('turning-what-a-business-knows-into-an-asset', 'knowledge-becomes-an-asset-when-it-can-keep-working-without-you')]: [
    lessonKey('what-is-digital-trust', 'digital-assets-keep-working'),
    lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'the-strongest-growth-comes-from-relationships-that-create-more-relationships')
  ],

  [lessonKey('ai-foundations', 'ai-isnt-magic-either')]: [
    lessonKey('business-foundations', 'ai-is-my-team-not-my-replacement'),
    lessonKey('ai-foundations', 'ai-needs-context-before-it-can-be-helpful')
  ],
  [lessonKey('ai-foundations', 'start-with-the-work-not-the-tool')]: [
    lessonKey('business-foundations', 'understanding-before-spending'),
    lessonKey('business-foundations', 'every-system-produces-exactly-what-it-was-designed-to-produce')
  ],
  [lessonKey('ai-foundations', 'ai-needs-context-before-it-can-be-helpful')]: [
    lessonKey('turning-what-a-business-knows-into-an-asset', 'the-most-valuable-knowledge-usually-lives-in-the-owners-head'),
    lessonKey('ai-foundations', 'ai-makes-complicated-work-easier')
  ],
  [lessonKey('ai-foundations', 'ai-can-assist-judgment-it-cannot-own-it')]: [
    lessonKey('business-foundations', 'why-trust-comes-before-marketing'),
    lessonKey('how-customers-decide-who-to-trust', 'trust-means-putting-the-relationship-before-the-transaction')
  ],
  [lessonKey('ai-foundations', 'a-prompt-is-the-beginning-of-a-conversation')]: [
    lessonKey('ai-foundations', 'ai-needs-context-before-it-can-be-helpful'),
    lessonKey('ai-foundations', 'ai-can-assist-judgment-it-cannot-own-it')
  ],
  [lessonKey('ai-foundations', 'automation-comes-after-understanding')]: [
    lessonKey('business-foundations', 'every-system-produces-exactly-what-it-was-designed-to-produce'),
    lessonKey('turning-what-a-business-knows-into-an-asset', 'documenting-a-process-makes-knowledge-repeatable')
  ],
  [lessonKey('ai-foundations', 'building-your-first-ai-teammate')]: [
    lessonKey('turning-what-a-business-knows-into-an-asset', 'ai-becomes-more-valuable-when-it-learns-from-the-business'),
    lessonKey('business-foundations', 'ai-is-my-team-not-my-replacement')
  ],
  [lessonKey('ai-foundations', 'when-ai-tells-you-youre-different')]: [
    lessonKey('ai-foundations', 'the-team-i-spent-my-life-trying-to-build'),
    lessonKey('business-foundations', 'why-nta-exists')
  ],
  [lessonKey('ai-foundations', 'the-team-i-spent-my-life-trying-to-build')]: [
    lessonKey('business-foundations', 'what-building-my-own-digital-growth-office-taught-me'),
    lessonKey('ai-foundations', 'you-can-do-what-i-do-but-you-dont-have-to')
  ],
  [lessonKey('ai-foundations', 'ai-makes-complicated-work-easier')]: [
    lessonKey('turning-what-a-business-knows-into-an-asset', 'the-most-valuable-knowledge-usually-lives-in-the-owners-head'),
    lessonKey('business-foundations', 'what-building-my-own-digital-growth-office-taught-me')
  ],
  [lessonKey('ai-foundations', 'i-see-artificial-intelligence-differently')]: [
    lessonKey('ai-foundations', 'ai-isnt-magic-either'),
    lessonKey('business-foundations', 'ai-is-my-team-not-my-replacement')
  ],
  [lessonKey('ai-foundations', 'ai-does-not-have-to-be-a-monster')]: [
    lessonKey('ai-foundations', 'ai-isnt-magic-either'),
    lessonKey('ai-foundations', 'ai-can-assist-judgment-it-cannot-own-it')
  ],
  [lessonKey('ai-foundations', 'you-can-do-what-i-do-but-you-dont-have-to')]: [
    lessonKey('business-foundations', 'what-building-my-own-digital-growth-office-taught-me'),
    lessonKey('business-foundations', 'understanding-before-spending')
  ],
  [lessonKey('ai-foundations', 'use-the-model-that-gets-the-job-done')]: [
    lessonKey('ai-foundations', 'start-with-the-work-not-the-tool'),
    lessonKey('ai-foundations', 'automation-comes-after-understanding')
  ],

  [lessonKey('what-is-digital-trust', 'what-is-digital-trust')]: [
    lessonKey('how-customers-decide-who-to-trust', 'trust-begins-before-the-first-conversation'),
    lessonKey('business-foundations', 'why-trust-comes-before-marketing')
  ],
  [lessonKey('what-is-digital-trust', 'your-website-is-no-longer-just-a-website')]: [
    lessonKey('how-customers-decide-who-to-trust', 'people-remember-how-a-business-made-them-feel'),
    lessonKey('business-foundations', 'every-system-produces-exactly-what-it-was-designed-to-produce')
  ],
  [lessonKey('what-is-digital-trust', 'why-traditional-marketing-is-no-longer-enough')]: [
    lessonKey('truth-about-business-growth', 'marketing-doesnt-create-great-businesses'),
    lessonKey('truth-about-business-growth', 'why-growth-is-a-system')
  ],
  [lessonKey('what-is-digital-trust', 'digital-assets-keep-working')]: [
    lessonKey('turning-what-a-business-knows-into-an-asset', 'knowledge-becomes-an-asset-when-it-can-keep-working-without-you'),
    lessonKey('truth-about-business-growth', 'why-growth-is-a-system')
  ],
  [lessonKey('what-is-digital-trust', 'ai-is-changing-how-customers-find-businesses')]: [
    lessonKey('ai-foundations', 'ai-isnt-magic-either'),
    lessonKey('how-customers-decide-who-to-trust', 'trust-begins-before-the-first-conversation')
  ],
  [lessonKey('what-is-digital-trust', 'relationships-are-your-greatest-competitive-advantage')]: [
    lessonKey('how-businesses-turn-trust-into-lasting-relationships', 'the-strongest-growth-comes-from-relationships-that-create-more-relationships'),
    lessonKey('how-customers-decide-who-to-trust', 'trust-means-putting-the-relationship-before-the-transaction')
  ],
  [lessonKey('what-is-digital-trust', 'the-connected-business-is-the-future')]: [
    lessonKey('business-foundations', 'what-building-my-own-digital-growth-office-taught-me'),
    lessonKey('truth-about-business-growth', 'why-growth-is-a-system')
  ]
});

const supplementalLessonResources = Object.freeze({
  [lessonKey('business-foundations', 'what-building-my-own-digital-growth-office-taught-me')]: [
    {
      type: 'NTA Point of View',
      title: 'The Work You Don’t See: Why Setup Matters',
      description: 'Why a simple result often reflects a great deal of discovery, setup, and experience behind the scenes.',
      path: '/canon/the-work-you-dont-see-why-setup-matters'
    }
  ],
  [lessonKey('ai-foundations', 'ai-makes-complicated-work-easier')]: [
    {
      type: 'NTA Point of View',
      title: 'The Work You Don’t See: Why Setup Matters',
      description: 'Why a business owner should be able to benefit from a simple result without becoming the technical expert.',
      path: '/canon/the-work-you-dont-see-why-setup-matters'
    }
  ],
  [lessonKey('ai-foundations', 'you-can-do-what-i-do-but-you-dont-have-to')]: [
    {
      type: 'NTA Point of View',
      title: 'The Work You Don’t See: Why Setup Matters',
      description: 'Why experienced setup and system design matter when technology is supposed to feel simple to use.',
      path: '/canon/the-work-you-dont-see-why-setup-matters'
    }
  ]
});

const collectionDefinitions = [
  {
    id: 1,
    slug: 'business-foundations',
    title: 'Business Foundations',
    description: 'Learn the core principles of building a business that grows through understanding rather than constant selling.',
    lessons: businessFoundationsLessons,
    nextCollectionSlug: 'truth-about-business-growth',
    previousCollectionSlug: null
  },
  {
    id: 2,
    slug: 'truth-about-business-growth',
    title: 'The Truth About Business Growth',
    description: 'Understand the difference between unpredictable spikes in activity and compounded digital momentum.',
    lessons: truthAboutBusinessGrowthLessons,
    nextCollectionSlug: 'how-customers-decide-who-to-trust',
    previousCollectionSlug: 'business-foundations'
  },
  {
    id: 3,
    slug: 'how-customers-decide-who-to-trust',
    title: 'How Customers Decide Who to Trust',
    description: 'Explore the psychological and practical steps customers take before deciding to hire a business.',
    lessons: howCustomersDecideWhoToTrustLessons,
    nextCollectionSlug: 'how-businesses-turn-trust-into-lasting-relationships',
    previousCollectionSlug: 'truth-about-business-growth'
  },
  {
    id: 4,
    slug: 'how-businesses-turn-trust-into-lasting-relationships',
    title: 'How Businesses Turn Trust Into Lasting Relationships',
    description: 'Learn how to transform one-time transactions into lasting partnerships and ongoing referrals.',
    lessons: howBusinessesTurnTrustIntoLastingRelationshipsLessons,
    nextCollectionSlug: 'turning-what-a-business-knows-into-an-asset',
    previousCollectionSlug: 'how-customers-decide-who-to-trust'
  },
  {
    id: 5,
    slug: 'turning-what-a-business-knows-into-an-asset',
    title: 'Turning What a Business Knows Into an Asset',
    description: 'Discover how to document and share your expertise so it works for your business 24/7.',
    lessons: turningWhatABusinessKnowsIntoAnAssetLessons,
    nextCollectionSlug: 'ai-foundations',
    previousCollectionSlug: 'how-businesses-turn-trust-into-lasting-relationships'
  },
  {
    id: 6,
    slug: 'ai-foundations',
    title: 'AI Foundations',
    description: 'A practical, hype-free introduction to using artificial intelligence in a local business.',
    lessons: completeAiFoundationsLessons,
    nextCollectionSlug: 'what-is-digital-trust',
    previousCollectionSlug: 'turning-what-a-business-knows-into-an-asset'
  },
  {
    id: 7,
    slug: 'what-is-digital-trust',
    title: 'What Is Digital Trust?',
    description: 'Understand why the internet has changed, and how trust is built in an AI-assisted world.',
    lessons: whatIsDigitalTrustLessons,
    nextCollectionSlug: null,
    previousCollectionSlug: 'ai-foundations'
  }
];

export const collectionsOrder = collectionDefinitions.map(collection => ({
  ...collection,
  lessons: withDerivedLessonNavigation(collection.lessons)
}));

export const masterCurriculumMap = collectionsOrder.flatMap(collection =>
  collection.lessons.map(lesson => ({
    collectionTitle: collection.title,
    collectionSlug: collection.slug,
    collectionNumber: collection.id,
    lessonTitle: lesson.title,
    lessonSlug: lesson.slug,
    lessonNumber: lesson.displayNumber,
    canonicalUrl: '/knowledge/' + collection.slug + '/' + lesson.slug,
    isImplemented: true,
    previousLessonSlug: lesson.previousLessonSlug,
    nextLessonSlug: lesson.nextLessonSlug,
    readingTime: lesson.readingTime,
    level: lesson.level,
    takeaway: lesson.takeaway
  }))
);


export const getCollectionBySlug = (slug) => collectionsOrder.find(c => c.slug === slug);
export const getLessonBySlug = (collectionSlug, lessonSlug) => {
  const collection = getCollectionBySlug(collectionSlug);
  return collection ? collection.lessons.find(l => l.slug === lessonSlug) : null;
};

const lessonLookup = new Map(
  collectionsOrder.flatMap(collection =>
    collection.lessons.map(lesson => [
      lessonKey(collection.slug, lesson.slug),
      {
        ...lesson,
        collectionSlug: collection.slug,
        collectionTitle: collection.title,
        collectionNumber: collection.id,
        path: `/knowledge/${collection.slug}/${lesson.slug}`
      }
    ])
  )
);

const lessonReferenceFromPath = (path = '') => {
  const match = String(path).match(/^\/knowledge\/([^/]+)\/([^/?#]+)/);
  return match ? lessonKey(match[1], match[2]) : null;
};

// Keeps the reader experience intentionally light: collection context and
// previous/next are already on every lesson; this adds only the few ideas that
// make the most sense after the lesson at hand.
export const getRelatedLessons = (collectionSlug, lessonSlug) => {
  const currentKey = lessonKey(collectionSlug, lessonSlug);
  const current = lessonLookup.get(currentKey);
  if (!current) return [];

  const structuralNeighbors = [
    current.previousLessonSlug && lessonKey(collectionSlug, current.previousLessonSlug),
    current.nextLessonSlug && lessonKey(collectionSlug, current.nextLessonSlug)
  ].filter(Boolean);

  const authoredReferences = (current.relatedLessons || [])
    .map(item => lessonReferenceFromPath(item?.link))
    .filter(Boolean);

  const contextualReferences = contextualLessonLinks[currentKey] || [];
  const candidates = [...new Set([...authoredReferences, ...contextualReferences])];

  return candidates
    .filter(reference => reference !== currentKey && !structuralNeighbors.includes(reference))
    .map(reference => lessonLookup.get(reference))
    .filter(Boolean)
    .slice(0, 3);
};

export const getConnectedLessonResources = (collectionSlug, lessonSlug) => {
  const currentKey = lessonKey(collectionSlug, lessonSlug);
  const supplementalResources = supplementalLessonResources[currentKey] || [];
  const relatedLessons = getRelatedLessons(collectionSlug, lessonSlug).map(lesson => ({
    type: 'Knowledge Library Lesson',
    title: lesson.title,
    description: lesson.description,
    collectionTitle: lesson.collectionTitle,
    path: lesson.path
  }));

  return [...supplementalResources, ...relatedLessons].slice(0, 3);
};
