import { businessFoundationsLessons } from './businessFoundations';
import { truthAboutBusinessGrowthLessons } from './truthAboutBusinessGrowth';
import { howCustomersDecideWhoToTrustLessons } from './howCustomersDecideWhoToTrust';
import { howBusinessesTurnTrustIntoLastingRelationshipsLessons } from './howBusinessesTurnTrustIntoLastingRelationships';
import { turningWhatABusinessKnowsIntoAnAssetLessons } from './turningWhatABusinessKnowsIntoAnAsset';
import { aiFoundationsLessons } from './aiFoundations';
import { lesson11 as aiFoundationsLesson11 } from './aiFoundationsLesson11';
import { lesson12 as aiFoundationsLesson12 } from './aiFoundationsLesson12';
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
  aiFoundationsLesson12
];

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