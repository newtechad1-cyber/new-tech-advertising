# Local Page Template - Data Sources Map

## Overview
This document maps each section of the LocalPageTemplate to its data sources. This ensures:
- No thin content (each section pulls from specific, rich data sources)
- Variation across pages (different data sources = different content)
- Scalability (template works for any service/location/industry combination)

---

## Section-by-Section Data Mapping

### 1. HERO SECTION
**Component**: `Hero` section with breadcrumb, h1, intro, CTAs

**Data Sources**:
- `page.h1` — LocationPage entity (AI-generated, service + city specific)
- `page.intro_paragraph` — LocationPage entity (localized intro)
- `page.city` — LocationPage entity (breadcrumb)
- `page.cta_primary` + `page.cta_primary_url` — LocationPage or CTAOffer
- `page.cta_secondary` + `page.cta_secondary_url` — LocationPage

**Content Variation**:
- Each city gets unique h1 (includes location)
- Intro paragraph varies by local market context
- CTAs vary by service type

**Word Count**: 80-120 words

---

### 2. SERVICE OVERVIEW
**Component**: "What Is [Service]?" section

**Data Sources**:
- `page.service_overview` — LocationPage entity (AI-generated from service definition)
- `page.why_this_service_matters` — LocationPage entity (AI-generated, explains urgency)

**Content Variation**:
- Service copy varies by local context (from LocalMarketIntel)
- Urgency framing changes based on market competitiveness/digital maturity

**Word Count**: 150-200 words

---

### 3. WHY IT MATTERS IN [CITY]
**Component**: "Why This Matters for [City] Businesses" section

**Data Sources**:
- `page.local_market_context` — LocationPage entity (pulled from LocalMarketIntel analysis)
- `marketIntel.competition_level` — LocalMarketIntel entity (competitive landscape metric)
- `marketIntel.digital_maturity_estimate` — LocalMarketIntel entity (adoption metric)
- `page.local_examples` — LocationPage entity (industries that benefit in this city)

**Content Variation**:
- Market context is unique per city + industry
- Competitiveness bar chart changes per market
- Local examples vary by region (HVAC in cold climates, different trades in others)

**Word Count**: 200-280 words

---

### 4. COMMON PROBLEMS
**Component**: "Common Challenges for [City] Businesses" section

**Data Sources**:
- `industryIntel.common_pain_points` — IndustryIntel entity (4 pain points displayed)
- `industryIntel.common_buying_triggers` — IndustryIntel entity (6 triggers displayed)

**Content Variation**:
- Pain points vary significantly by industry (HVAC ≠ Plumbing ≠ General Services)
- Buying triggers are industry + location specific
- Text framing changes to emphasize local relevance

**Word Count**: 220-300 words

---

### 5. HOW WE HELP
**Component**: "How We Help [City] Businesses" section + process steps

**Data Sources**:
- `page.how_it_works` — LocationPage entity (AI-generated process explanation)
- Hardcoded process steps: Assess → Develop → Implement → Track

**Content Variation**:
- Explanation varies by service type
- Steps are generic but framing is service-specific

**Word Count**: 180-220 words

---

### 6. VIDEO SECTION (optional)
**Component**: Embedded video with title

**Data Sources**:
- `page.video_embed_url` — LocationPage entity (YouTube/Vimeo embed URL)
- `page.video_title` — LocationPage entity (video caption)

**Variation**: 
- Optional section (only renders if video_embed_url exists)
- Video should be service-specific explainer or testimonial

---

### 7. FAQ SECTION
**Component**: Expandable Q&A blocks (7 questions minimum)

**Data Sources**:
- `page.faq` — LocationPage entity (JSON array of 7-8 Q&A pairs)
- Questions are locally-specific (mention city, service, local context)
- Answers explain benefits relative to local market

**Content Variation**:
- Question phrasing varies dramatically across pages (not templated)
- Answers reference local market conditions and industry context
- Each Q&A is 2-3 sentences (150-250 words per Q&A × 7-8 = 1,050-2,000 words)

**Word Count**: 1,200-2,000 words (largest section, drives volume)

---

### 8. RELATED RESOURCES
**Component**: Related tools + related pages (4-6 items each)

**Data Sources**:
- `relatedTools` — array of Tool entities (up to 4 displayed)
- `relatedPages` — array of Page entities (up to 4 displayed)

**Data Population**:
- Tools are filtered by `related_cluster` or `active: true`
- Pages are filtered by `topic_cluster` or `related_pages` array in LocationPage

**Content Variation**:
- Link text varies (tool name, page title)
- Descriptions are pulled from entity metadata

**Word Count**: 100-150 words (links + short descriptions)

---

### 9. FINAL CTA SECTION
**Component**: Call-to-action block with heading, description, button

**Data Sources**:
- `page.cta_primary` — LocationPage entity (button text)
- `page.cta_primary_url` — LocationPage entity (destination: /start, /book-call, /get-started)
- Dynamic text: "Ready to Get Started in [City]?"

**Content Variation**:
- City name is interpolated
- Button destination varies by service type
- Button text varies

---

## Total Page Content by Word Count

| Section | Min Words | Max Words |
|---------|-----------|-----------|
| Hero | 80 | 120 |
| Service Overview | 150 | 200 |
| Why [City] | 200 | 280 |
| Common Problems | 220 | 300 |
| How We Help | 180 | 220 |
| FAQ (7-8 Q&As) | 1,200 | 2,000 |
| Related Resources | 100 | 150 |
| Final CTA | 50 | 80 |
| **TOTAL** | **2,180** | **3,430** |

**Target Range**: 2,200–3,200 words per page (avoids thin content, maintains freshness)

---

## Data Sources & Enrichment Strategy

### Primary Data Sources:
1. **LocationPage** entity — dynamically generated via LLM (unique per city)
2. **LocalMarketIntel** — city + service intelligence (markets, competition, trends)
3. **IndustryIntel** — service/industry problems, solutions, keywords
4. **CTAOffer** — call-to-action copy and links
5. **Tool** — related tools for this service/industry
6. **Page** — related content (articles, playbooks, resources)

### Variation Strategy to Prevent Thin Content:

1. **AI-Generated Unique Copy**: Hero, service overview, local context, how-it-works, FAQ all generated fresh per location
2. **Market-Specific Data**: Competition level, digital maturity, local examples all pull from LocalMarketIntel
3. **Industry-Specific Problems**: Pain points and buying triggers come from IndustryIntel (different per industry)
4. **Dynamic Links**: Related tools and pages vary by service/industry/topic cluster
5. **Localized Framing**: All copy references specific city and market conditions

---

## Batch Generation Workflow

### Input Requirements for Each Page:
```json
{
  "service_slug": "ada-website-compliance",
  "city": "Chicago",
  "state": "Illinois",
  "state_code": "IL",
  "industry_slug": "general"  // optional
}
```

### Generation Process:
1. **Fetch Supporting Data**:
   - Query `IndustryIntel` for `industry_slug`
   - Query `LocalMarketIntel` for `city` + `state` + `service_slug`
   - Query `CTAOffer` for relevant CTA by service
   - Query `Tool` and `Page` for related content

2. **Generate Page Content via LLM**:
   - Template prompt includes service context + market data
   - LLM generates unique h1, intro, FAQ, etc.
   - Response validation ensures minimum word count

3. **Create LocationPage Record**:
   - Populate all fields from LLM response
   - Link to `local_market_intel_id`
   - Set status to "published"
   - Index service_slug + city for discovery

4. **Log Quality Metrics**:
   - Word count validation (min 900, target 2,200+)
   - Uniqueness score (% unique vs similar pages)
   - Data source enrichment (how many entities referenced)

---

## Scaling Recommendations

### Safe to Generate:
- **100-500 pages**: 1-2 services × 50-100 cities, various industries
- **500-2,000 pages**: 3-5 services × 100 cities, 5-10 industries each
- **2,000+ pages**: Full matrix (services × cities × industries)

### Quality Controls:
- Minimum 900 word requirement per page
- Unique title/meta for each location
- AI-generated FAQ (not templated)
- Linked data from 3+ entities per page
- No duplicate slug combinations

---

## Files Reference

- **Component**: `components/templates/LocalPageTemplate.jsx`
- **Generator Function**: `functions/generateEnrichedLocationPage.js`
- **Page Route**: `pages/ServiceLocation.jsx`
- **Entity**: `entities/LocationPage.json`
- **Related Entities**: `IndustryIntel`, `LocalMarketIntel`, `CTAOffer`, `Tool`, `Page