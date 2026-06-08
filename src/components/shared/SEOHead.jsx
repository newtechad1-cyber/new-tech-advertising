import React, { useEffect } from 'react';

export default function SEOHead({
  title = "New Tech Advertising | AI Marketing for Small Business",
  description = "AI-powered marketing for HVAC, plumbing, and restaurant businesses in Iowa and Southern Minnesota. Automated social media, local SEO, review management, and AI video content.",
  canonical = "https://newtechadvertising.com/",
  faqs = []
}) {
  useEffect(() => {
    // Helper to set or create meta tags
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

    // Helper to add JSON-LD schema
    const addSchema = (schemaObj) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaObj);
      script.className = 'seo-schema';
      document.head.appendChild(script);
      return script;
    };

    const elements = [];

    // 1. META TAGS
    // Update document title directly
    document.title = title;
    
    // Also explicitly ensure <title> tag exists in HEAD and is updated
    let titleTag = document.head.querySelector('title');
    if (!titleTag) {
      titleTag = document.createElement('title');
      document.head.appendChild(titleTag);
    }
    titleTag.textContent = title;

    // Add meta title as a fallback
    elements.push(setMeta('title', title));
    
    elements.push(setMeta('description', description));
    elements.push(setMeta('keywords', "AI marketing Mason City Iowa, HVAC marketing, plumbing marketing, restaurant marketing, social media automation, AI SEO, local business marketing Iowa, small business marketing Minnesota"));
    elements.push(setMeta('robots', "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"));
    elements.push(setMeta('author', "New Tech Advertising"));
    elements.push(setMeta('geo.region', "US-IA"));
    elements.push(setMeta('geo.placename', "Mason City, Iowa"));
    elements.push(setMeta('ICBM', "43.1537, -93.2010"));

    // Canonical link
    const oldCanonical = document.head.querySelector('link[rel="canonical"]');
    if (oldCanonical) {
      oldCanonical.remove();
    }
    const canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', canonical);
    document.head.appendChild(canonicalLink);
    elements.push(canonicalLink);

    // 2. OPEN GRAPH
    elements.push(setMeta('og:type', 'website', true));
    elements.push(setMeta('og:url', canonical, true));
    elements.push(setMeta('og:title', title, true));
    elements.push(setMeta('og:description', description, true));
    elements.push(setMeta('og:image', "https://newtechadvertising.com/og-image.png", true));
    elements.push(setMeta('og:site_name', "New Tech Advertising", true));
    elements.push(setMeta('og:locale', "en_US", true));

    // 3. TWITTER CARD
    elements.push(setMeta('twitter:card', 'summary_large_image'));
    elements.push(setMeta('twitter:title', title));
    elements.push(setMeta('twitter:description', description));
    elements.push(setMeta('twitter:image', "https://newtechadvertising.com/og-image.png"));

    // 4. PROFESSIONAL SERVICE SCHEMA (Deep JSON-LD)
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "New Tech Advertising (NTA)",
      "founder": {
        "@type": "Person",
        "name": "Rick A. Hesse"
      },
      "telephone": "+1-641-420-8816",
      "email": "info@newtechadvertising.com",
      "url": "https://newtechadvertising.com",
      "description": "AI-driven local marketing automation, CTV streaming ads, and automated high-converting CRM systems for small business contractors.",
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
        { "@type": "City", "name": "North Iowa" },
        { "@type": "City", "name": "Southern Minnesota" },
        { "@type": "City", "name": "Mason City" },
        { "@type": "City", "name": "Rochester" }
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

    // 5. SPEAKABLE SCHEMA
    const speakableSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", "h2", ".speakable"]
      },
      "url": canonical
    };
    elements.push(addSchema(speakableSchema));

    // 6. FAQ SCHEMA
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

    // 7. BREADCRUMB SCHEMA
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
  }, [title, description, canonical, faqs]);

  return null;
}