import { useEffect } from 'react';
import { bookSchemaFor } from '@/data/bookSeo.js';
import { addPageSchema, canonicalPageUrl } from '@/lib/seoSchema';

export default function BookStructuredData({ book }) {
  const schema = bookSchemaFor(book);
  useEffect(() => {
    if (!schema) return undefined;
    return addPageSchema(document, schema, canonicalPageUrl(schema.url));
  }, [schema]);
  return null;
}
