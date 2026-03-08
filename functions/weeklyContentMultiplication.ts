import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch recent blog posts and case studies
    const [blogPosts, caseStudies] = await Promise.all([
      base44.asServiceRole.entities.BlogPost.list('-created_date', 5),
      base44.asServiceRole.entities.CaseStudy.list('-created_date', 3)
    ]);

    const sources = [
      ...blogPosts.map(p => ({ title: p.title, type: 'blog_article', content: p.content || p.excerpt || '' })),
      ...caseStudies.filter(c => c.content_generated).map(c => ({ title: c.business_name + ' - ' + c.industry, type: 'case_study', content: `${c.problem || ''}\n\n${c.solution || ''}\n\n${c.results || ''}` }))
    ];

    if (sources.length === 0) {
      return Response.json({ success: true, message: 'No new content to process', processed: 0 });
    }

    // Check which ones haven't been multiplied yet
    const existingAssets = await base44.asServiceRole.entities.ContentAsset.list('-created_date', 50);
    const existingTitles = new Set(existingAssets.map(a => a.title));

    const newSources = sources.filter(s => !existingTitles.has(s.title) && s.content.length > 100);

    if (newSources.length === 0) {
      return Response.json({ success: true, message: 'All content already processed', processed: 0 });
    }

    // Process up to 3 per run to stay within limits
    const toProcess = newSources.slice(0, 3);
    const results = [];

    for (const source of toProcess) {
      const asset = await base44.asServiceRole.entities.ContentAsset.create({
        title: source.title,
        content_type: source.type,
        source_content: source.content,
        status: 'pending'
      });

      // Invoke multiply function
      const res = await base44.asServiceRole.functions.invoke('multiplyContent', { asset_id: asset.id });
      results.push({ title: source.title, success: res?.success || false });
    }

    return Response.json({ success: true, processed: results.length, results });

  } catch (error) {
    console.error('weeklyContentMultiplication error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});