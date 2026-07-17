export function normalizeJournalArticle(article, type) {
  let normalized = {
    source_type: type,
    source_id: article.id || article.slug || '',
    slug: article.slug || '',
    title: article.title || 'Untitled Article',
    excerpt: article.excerpt || article.description || article.subtitle || '',
    url: '',
    reading_time: article.reading_time || article.readingTime || '5 min read',
    featured_image_url: article.featured_image_url || article.image_url || '',
    category: article.category || '',
    display_order: 0,
    is_lead: false
  };

  switch (type) {
    case 'POV':
      normalized.url = `/point-of-view/${normalized.slug}`;
      break;
    case 'Flagship':
      normalized.url = `/knowledge/articles/${normalized.slug}`;
      break;
    case 'PublishingArticle':
      normalized.url = `/article/${normalized.slug}`;
      break;
    case 'KnowledgeArticle':
      normalized.url = `/knowledge/${normalized.slug}`;
      break;
    default:
      normalized.url = `/${normalized.slug}`;
  }

  return normalized;
}