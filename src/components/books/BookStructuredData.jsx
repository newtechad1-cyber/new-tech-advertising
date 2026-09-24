import { useEffect } from 'react';
import { bookSchemaFor } from '@/data/bookSeo.js';

export default function BookStructuredData({ book }) {
  useEffect(() => {
    document.head.querySelectorAll('script[data-seo-static-book-schema="true"]').forEach(script => script.remove());
  }, []);
  const schema = bookSchemaFor(book);
  return schema
    ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    : null;
}
