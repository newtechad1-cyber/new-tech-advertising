import { collectionsOrder } from '@/data/masterCurriculum';

const STOP_WORDS = new Set([
  'a', 'about', 'and', 'are', 'can', 'do', 'for', 'from', 'help', 'how', 'i',
  'in', 'is', 'it', 'me', 'my', 'of', 'on', 'the', 'to', 'what', 'with', 'you',
  'your'
]);

const normalize = (value = '') => String(value)
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const tokenize = value => normalize(value)
  .split(' ')
  .filter(token => (token === 'ai' || token.length > 2) && !STOP_WORDS.has(token));

const PUBLIC_LESSONS = collectionsOrder.flatMap(collection => collection.lessons.map(lesson => ({
  collectionTitle: collection.title,
  collectionNumber: collection.id,
  lessonTitle: lesson.title,
  lessonNumber: lesson.displayNumber,
  canonicalUrl: `/knowledge/${collection.slug}/${lesson.slug}`,
  takeaway: lesson.takeaway,
  content: lesson.content || ''
})));

const plainText = value => String(value || '')
  .replace(/[`*_>#-]/g, ' ')
  .replace(/\[[^\]]+\]\([^\)]+\)/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const relevantExcerpt = (content, tokens) => {
  const text = plainText(content);
  if (!text) return '';
  const normalizedText = normalize(text);
  const firstMatch = tokens
    .map(token => normalizedText.indexOf(token))
    .filter(index => index >= 0)
    .sort((left, right) => left - right)[0] ?? 0;
  const start = Math.max(0, firstMatch - 220);
  return text.slice(start, start + 1400);
};

export function findRelevantPublicLessons(question, limit = 4) {
  const normalizedQuestion = normalize(question);
  const tokens = tokenize(question);

  return PUBLIC_LESSONS
    .map(lesson => {
      const title = normalize(lesson.lessonTitle);
      const collection = normalize(lesson.collectionTitle);
      const takeaway = normalize(lesson.takeaway);
      const content = normalize(lesson.content);
      let score = 0;

      for (const token of tokens) {
        if (title.includes(token)) score += 5;
        if (collection.includes(token)) score += 3;
        if (takeaway.includes(token)) score += 1;
        if (content.includes(token)) score += 0.25;
      }

      if (normalizedQuestion.includes('operating system') && title.includes('operating system')) score += 12;
      if (tokens.includes('ai') || normalizedQuestion.includes('artificial intelligence')) {
        if (collection === 'ai foundations') score += 10;
      }

      return { ...lesson, score };
    })
    .filter(lesson => lesson.score > 0)
    .sort((left, right) => right.score - left.score || left.collectionNumber - right.collectionNumber || left.lessonNumber - right.lessonNumber)
    .slice(0, limit);
}

export function buildPublicKnowledgeContext(question) {
  const tokens = tokenize(question);
  return findRelevantPublicLessons(question).map(lesson => ({
    collection: lesson.collectionTitle,
    title: lesson.lessonTitle,
    takeaway: lesson.takeaway,
    excerpt: relevantExcerpt(lesson.content, tokens),
    url: lesson.canonicalUrl
  }));
}

const directAnswer = question => {
  const normalized = normalize(question);

  if (normalized.includes('operating system')) {
    return 'The [NTA Operating System™](/operating-system) is the practical method that connects a business’s foundation, visibility, customer trust, relationships, everyday work, and useful automation. It helps put improvements in the right order instead of adding another disconnected tool.';
  }

  if (tokenize(question).includes('ai') || normalized.includes('artificial intelligence')) {
    return 'NTA teaches AI as a practical teammate—not a replacement for your experience or judgment. Begin with the work the business already does, give AI the right context, confirm what it understood, and keep people responsible for important decisions. The [AI Foundations series](/knowledge/ai-foundations) teaches that approach one lesson at a time.';
  }

  if (normalized.includes('schedule') || normalized.includes('book') || normalized.includes('meeting')) {
    return 'You can choose a time on the [Book a Conversation](/book-call) page. Nothing is scheduled until you deliberately complete that step.';
  }

  if (normalized.includes('community partner')) {
    return 'The [Community Partner program](/community-partner) helps trusted local people introduce business owners to NTA’s practical education and growth system.';
  }

  if (normalized.includes('growth roadmap')) {
    return 'The [NTA Growth Roadmap™](/growth-roadmap-generator) turns what you learn about the business into priorities in the right order—what needs attention now, what can wait, and what the next practical step should be.';
  }

  if (normalized.includes('walk through') && normalized.includes('business growth')) {
    return 'Let’s begin with three plain questions: What are you trying to improve, what is happening now, and what feels most disconnected? You can use the guided [Growth Conversation](/growth-conversation), or type your first answer here.';
  }

  return null;
};

export function buildPublicKnowledgeFallback(question) {
  const direct = directAnswer(question);
  if (direct) {
    return `${direct}\n\nI’m using NTA’s published resources while the live conversation service reconnects.`;
  }

  const lessons = findRelevantPublicLessons(question, 3);
  if (lessons.length === 0) {
    return 'I couldn’t reach the live conversation service, but the [NTA Knowledge Library](/knowledge) is available now. Tell me the part of your business you are trying to improve—visibility, customer trust, follow-up, practical AI, or everyday operations—and I can point you to the right lesson.';
  }

  const links = lessons
    .map(lesson => `- [${lesson.lessonTitle}](${lesson.canonicalUrl}) — ${lesson.takeaway}`)
    .join('\n');

  return `I couldn’t reach the live conversation service, so I searched NTA’s published Knowledge Library instead. These lessons are the closest match:\n\n${links}\n\nWhich part would you like to talk through first?`;
}
