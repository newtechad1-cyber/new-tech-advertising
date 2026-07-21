import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEOHead — Unified SEO & Structured Data management for every page.
 *
 * R0.7 Authority & Discoverability:
 *   - WebSite + SearchAction schema (sitewide)
 *   - Person schema (Rick Hesse — founder authority)
 *   - Article schema (for canon articles / blog posts)
 *   - LearningResource schema (for learning center content)
 *   - VideoObject schema (for pages with embedded videos)
 *   - CollectionPage schema (for canon collections)
 *   - HowTo schema (for discovery tools / processes)
 *   - BreadcrumbList (auto-generated from path)
 *   - FAQPage (page-level or default)
 *   - ProfessionalService (organization — sitewide)
 *
 * Canonical URL logic (G-002):
 *   1. If `canonical` prop is explicitly passed → use it.
 *   2. Otherwise → auto-generate from current route path.
 *   3. Always outputs full https://newtechadvertising.com/... URL.
 *   4. Strips trailing slashes (except root /).
 */
const SITE_ORIGIN = 'https://newtechadvertising.com';
const SITE_NAME = 'New Tech Advertising';

function buildCanonical(pathname) {
  const clean = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  return `${SITE_ORIGIN}${clean}`;
}

// ─── Rick Hesse Person Schema (founder authority) ─────────────────────────
const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_ORIGIN}/#rick-hesse`,
  "name": "Rick Hesse",
  "givenName": "Rick",
  "familyName": "Hesse",
  "jobTitle": "Founder and Digital Growth Guide",
  "description": "Founder of New Tech Advertising with more than 45 years of experience in business ownership, advertising, sales, and technology. Teaches small-business owners to use AI collaboratively while keeping human judgment and authority.",
  "url": `${SITE_ORIGIN}/about`,
  "image": `${SITE_ORIGIN}/og-image.png`,
  "worksFor": {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`
  },
  "knowsAbout": [
    "Practical Artificial Intelligence for Small Business",
    "Human-AI Collaboration",
    "Business Process Design",
    "Business Knowledge Systems",
    "Local Business Growth",
    "Digital Trust",
    "Content Strategy",
    "AI Search Optimization",
    "Small Business Marketing",
    "Video Marketing",
    "Social Media Automation"
  ],
  "sameAs": []
};

// ─── WebSite + SearchAction Schema (sitewide) ─────────────────────────────
const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_ORIGIN}/#website`,
  "name": SITE_NAME,
  "url": SITE_ORIGIN,
  "description": "Practical AI education and connected growth systems that help small-business owners turn their knowledge, judgment, and everyday work into repeatable business assets.",
  "publisher": {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${SITE_ORIGIN}/canon?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

export default function SEOHead({
  title = "Practical AI and Growth Systems for Small Business | NTA",
  description = "New Tech Advertising teaches small-business owners to use AI collaboratively and turn their experience into practical growth systems without surrendering judgment or control.",
  canonical,
  faqs = [],
  noIndex = false,
  // R0.7 — Article schema props
  articleData = null,     // { title, author, datePublished, dateModified, description, image, slug }
  // R0.7 — Video schema props
  videoData = null,       // { name, description, thumbnailUrl, uploadDate, contentUrl, embedUrl, duration }
  // R0.7 — LearningResource schema props
  learningData = null,    // { name, description, educationalLevel, learningResourceType }
  // R0.7 — CollectionPage schema props
  collectionData = null,  // { name, description, numberOfItems, hasPart: [{name, url}] }
  // R0.7 — HowTo schema props
  howToData = null,        // { name, description, steps: [{name, text}] }
}) {
  const location = useLocation();
  const resolvedCanonical = canonical || buildCanonical(location.pathname);

  useEffect(() => {
    const setMeta = (nameOrProperty, content, isProperty = false) => {
      if (!content) return null;
      const attr = isProperty ? 'property' : 'name';
      let meta = document.head.querySelector(`meta[${attr}="${nameOrProperty}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, nameOrProperty);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
      return meta;
    };

    const addSchema = (schemaObj) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaObj);
      script.className = 'seo-schema';
      document.head.appendChild(script);
      return script;
    };

    const elements = [];

    // ── 1. META TAGS ──────────────────────────────────────────────────────
    document.title = title;
    let titleTag = document.head.querySelector('title');
    if (!titleTag) {
      titleTag = document.createElement('title');
      document.head.appendChild(titleTag);
    }
    titleTag.textContent = title;

    elements.push(setMeta('title', title));
    elements.push(setMeta('description', description));
    elements.push(setMeta('keywords', "practical AI for small business, AI education for business owners, human AI collaboration, small business growth systems, owner knowledge systems, AI marketing Mason City Iowa"));
    elements.push(setMeta('robots', noIndex
      ? "noindex, nofollow"
      : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    ));
    elements.push(setMeta('author', "Rick Hesse"));
    elements.push(setMeta('geo.region', "US-IA"));
    elements.push(setMeta('geo.placename', "Mason City, Iowa"));
    elements.push(setMeta('ICBM', "43.1537, -93.2010"));

    // Canonical link
    const oldCanonical = document.head.querySelector('link[rel="canonical"]');
    if (oldCanonical) oldCanonical.remove();
    const canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', resolvedCanonical);
    document.head.appendChild(canonicalLink);
    elements.push(canonicalLink);

    // ── 2. OPEN GRAPH ─────────────────────────────────────────────────────
    elements.push(setMeta('og:type', articleData ? 'article' : 'website', true));
    elements.push(setMeta('og:url', resolvedCanonical, true));
    elements.push(setMeta('og:title', title, true));
    elements.push(setMeta('og:description', description, true));
    elements.push(setMeta('og:image', `${SITE_ORIGIN}/og-image.png`, true));
    elements.push(setMeta('og:site_name', SITE_NAME, true));
    elements.push(setMeta('og:locale', "en_US", true));

    // Article-specific OG tags
    if (articleData) {
      elements.push(setMeta('article:author', articleData.author || 'Rick Hesse', true));
      if (articleData.datePublished) elements.push(setMeta('article:published_time', articleData.datePublished, true));
      if (articleData.dateModified) elements.push(setMeta('article:modified_time', articleData.dateModified, true));
    }

    // ── 3. TWITTER CARD ───────────────────────────────────────────────────
    elements.push(setMeta('twitter:card', 'summary_large_image'));
    elements.push(setMeta('twitter:title', title));
    elements.push(setMeta('twitter:description', description));
    elements.push(setMeta('twitter:image', `${SITE_ORIGIN}/og-image.png`));

    // ── 4. WEBSITE + SEARCH ACTION SCHEMA (sitewide) ──────────────────────
    elements.push(addSchema(WEBSITE_SCHEMA));

    // ── 5. PROFESSIONAL SERVICE SCHEMA ────────────────────────────────────
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${SITE_ORIGIN}/#organization`,
      "name": "New Tech Advertising (NTA)",
      "founder": {
        "@type": "Person",
        "@id": `${SITE_ORIGIN}/#rick-hesse`
      },
      "telephone": "+1-641-420-8816",
      "email": "info@newtechadvertising.com",
      "url": SITE_ORIGIN,
      "description": "Practical AI education, marketing, and connected growth systems for small-business owners. NTA helps owners turn their experience and judgment into useful processes, content, customer systems, and software.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mason City",
        "addressRegion": "IA",
        "postalCode": "50401",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 43.1536,
        "longitude": -93.2010
      },
      "priceRange": "$$",
      "areaServed": [
        { "@type": "City", "name": "Mason City" },
        { "@type": "City", "name": "Rochester" },
        { "@type": "City", "name": "Austin" },
        { "@type": "City", "name": "Albert Lea" },
        { "@type": "State", "name": "Iowa" },
        { "@type": "State", "name": "Minnesota" }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Marketing Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI Social Media Marketing" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Local SEO Optimization" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Review Management" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI Video Content" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Website Development" } }
        ]
      }
    };
    elements.push(addSchema(localBusinessSchema));

    // ── 6. PERSON SCHEMA (Rick Hesse — founder authority) ─────────────────
    elements.push(addSchema(PERSON_SCHEMA));

    // ── 7. SPEAKABLE SCHEMA ───────────────────────────────────────────────
    const speakableSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", "h2", ".speakable"]
      },
      "url": resolvedCanonical
    };
    elements.push(addSchema(speakableSchema));

    // ── 8. ARTICLE SCHEMA (when articleData is provided) ──────────────────
    if (articleData) {
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": articleData.title || title,
        "description": articleData.description || description,
        "author": {
          "@type": "Person",
          "@id": `${SITE_ORIGIN}/#rick-hesse`,
          "name": articleData.author || "Rick Hesse"
        },
        "publisher": {
          "@type": "Organization",
          "@id": `${SITE_ORIGIN}/#organization`,
          "name": SITE_NAME,
          "logo": {
            "@type": "ImageObject",
            "url": `${SITE_ORIGIN}/og-image.png`
          }
        },
        "datePublished": articleData.datePublished || "2026-01-01",
        "dateModified": articleData.dateModified || articleData.datePublished || "2026-07-06",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": resolvedCanonical
        },
        "image": articleData.image || `${SITE_ORIGIN}/og-image.png`,
        "url": resolvedCanonical
      };
      elements.push(addSchema(articleSchema));
    }

    // ── 9. VIDEO SCHEMA (when videoData is provided) ──────────────────────
    if (videoData) {
      const videoSchema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": videoData.name || title,
        "description": videoData.description || description,
        "thumbnailUrl": videoData.thumbnailUrl || `${SITE_ORIGIN}/og-image.png`,
        "uploadDate": videoData.uploadDate || "2026-01-01",
        "contentUrl": videoData.contentUrl || videoData.embedUrl,
        "embedUrl": videoData.embedUrl,
        "publisher": {
          "@type": "Organization",
          "@id": `${SITE_ORIGIN}/#organization`
        },
        "author": {
          "@type": "Person",
          "@id": `${SITE_ORIGIN}/#rick-hesse`
        }
      };
      if (videoData.duration) videoSchema.duration = videoData.duration;
      elements.push(addSchema(videoSchema));
    }

    // ── 10. LEARNING RESOURCE SCHEMA ──────────────────────────────────────
    if (learningData) {
      const learningSchema = {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "name": learningData.name || title,
        "description": learningData.description || description,
        "educationalLevel": learningData.educationalLevel || "Beginner",
        "learningResourceType": learningData.learningResourceType || "lesson",
        "provider": {
          "@type": "Organization",
          "@id": `${SITE_ORIGIN}/#organization`
        },
        "author": {
          "@type": "Person",
          "@id": `${SITE_ORIGIN}/#rick-hesse`
        },
        "inLanguage": "en",
        "url": resolvedCanonical
      };
      elements.push(addSchema(learningSchema));
    }

    // ── 11. COLLECTION PAGE SCHEMA ────────────────────────────────────────
    if (collectionData) {
      const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": collectionData.name || title,
        "description": collectionData.description || description,
        "url": resolvedCanonical,
        "numberOfItems": collectionData.numberOfItems || 0,
        "publisher": {
          "@type": "Organization",
          "@id": `${SITE_ORIGIN}/#organization`
        }
      };
      if (collectionData.hasPart && collectionData.hasPart.length > 0) {
        collectionSchema.hasPart = collectionData.hasPart.map((item, i) => ({
          "@type": "CreativeWork",
          "position": i + 1,
          "name": item.name,
          "url": item.url ? `${SITE_ORIGIN}${item.url}` : undefined
        }));
      }
      elements.push(addSchema(collectionSchema));
    }

    // ── 12. HOWTO SCHEMA ──────────────────────────────────────────────────
    if (howToData) {
      const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": howToData.name || title,
        "description": howToData.description || description,
        "step": (howToData.steps || []).map((step, i) => ({
          "@type": "HowToStep",
          "position": i + 1,
          "name": step.name,
          "text": step.text
        }))
      };
      elements.push(addSchema(howToSchema));
    }

    // ── 13. FAQ SCHEMA ────────────────────────────────────────────────────
    const defaultFaqs = [
      {
        question: "What does New Tech Advertising do?",
        answer: "New Tech Advertising provides AI-powered marketing for small businesses including HVAC companies, plumbers, and restaurants. We automate social media posting, local SEO, Google review management, and AI video content creation. Based in Mason City, Iowa, we serve businesses across Iowa and Southern Minnesota."
      },
      {
        question: "How much does AI marketing cost for a small business?",
        answer: "NTA's AI marketing plans start at $297 per month and include automated social media posting, local SEO optimization, review management, and content creation. No contracts, cancel anytime."
      },
      {
        question: "Can AI really manage my business's social media?",
        answer: "Yes. NTA's AI creates industry-specific content, schedules posts across Facebook, Instagram, and LinkedIn, and monitors engagement. Our HVAC clients see an average 3x increase in Google reviews and consistent lead generation."
      },
      {
        question: "Does NTA work with businesses outside Iowa?",
        answer: "Yes. While based in Mason City, Iowa, NTA serves businesses across Iowa and Southern Minnesota including Rochester, Austin, and Albert Lea. Our AI-powered services work for any location."
      },
      {
        question: "What industries does New Tech Advertising specialize in?",
        answer: "NTA specializes in marketing for HVAC companies, plumbing businesses, and restaurants. We understand the seasonal patterns, local search behavior, and content needs unique to each industry."
      }
    ];

    const finalFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": finalFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    elements.push(addSchema(faqSchema));

    // ── 14. BREADCRUMB SCHEMA ─────────────────────────────────────────────
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    let breadcrumbUrl = window.location.origin;
    const breadcrumbItems = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": breadcrumbUrl
      }
    ];

    pathParts.forEach((part, index) => {
      breadcrumbUrl += `/${part}`;
      const name = part.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": name,
        "item": breadcrumbUrl
      });
    });

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    };
    elements.push(addSchema(breadcrumbSchema));

    // Cleanup
    return () => {
      elements.forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, [title, description, resolvedCanonical, faqs, noIndex, articleData, videoData, learningData, collectionData, howToData]);

  return null;
}
