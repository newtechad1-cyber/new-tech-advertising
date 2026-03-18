import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * dailyProgrammaticPageGenerator
 * 
 * Runs daily to generate 5-10 location pages at a time.
 * This pacing prevents Google from flagging your site as spam.
 * 
 * Process:
 * 1. Fetch next 5-10 queued entries (ordered by priority_order)
 * 2. For each entry, generate all 5 services
 * 3. Mark as completed or failed
 * 4. Update generation count
 * 
 * Timeline with 5-10 pages/day:
 * - 100 cities → ~20 days to complete
 * - 500 total pages → ~100 days (10 cities/day × 5 services)
 * 
 * Safe for Google: Gradual rollout looks natural
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get next batch to process (5-10 cities queued entries)
    const batchSize = 7; // 7 cities × 5 services = 35-70 pages generated per day
    const nextBatch = await base44.entities.PageGenerationQueue.filter(
      { generation_status: 'queued' },
      'priority_order',
      batchSize
    );

    if (nextBatch.length === 0) {
      return Response.json({
        success: true,
        message: 'No queued entries to process',
        pages_generated: 0,
        batch_size: 0,
      });
    }

    const results = {
      pages_generated: 0,
      pages_failed: 0,
      entries_completed: 0,
      entries_failed: 0,
      details: []
    };

    for (const entry of nextBatch) {
      try {
        // Mark as in_progress
        await base44.entities.PageGenerationQueue.update(entry.id, {
          generation_status: 'in_progress',
          attempted_at: new Date().toISOString(),
        });

        const generatedPages = [];
        let servicesFailed = 0;

        // Generate page for each service
        for (const service of entry.services) {
          try {
            const pageResult = await base44.functions.invoke('generateEnrichedLocationPage', {
              service_slug: service,
              city: entry.city,
              state: entry.state,
              state_code: entry.state_code,
            });

            if (pageResult.data?.success) {
              generatedPages.push(pageResult.data.page_id);
              results.pages_generated++;
            } else {
              servicesFailed++;
              results.pages_failed++;
            }
          } catch (err) {
            console.error(`[dailyProgrammaticPageGenerator] Service ${service} failed:`, err.message);
            servicesFailed++;
            results.pages_failed++;
          }

          // Rate limiting: pause 200ms between service generations
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        // Mark entry as completed
        await base44.entities.PageGenerationQueue.update(entry.id, {
          generation_status: 'completed',
          generated_pages: generatedPages,
          services_generated: generatedPages.length,
          services_failed: servicesFailed,
          completed_at: new Date().toISOString(),
        });

        results.entries_completed++;
        results.details.push({
          city: entry.city,
          state: entry.state,
          pages_generated: generatedPages.length,
          services_failed: servicesFailed,
          status: 'completed'
        });
      } catch (err) {
        console.error(`[dailyProgrammaticPageGenerator] Entry ${entry.city} failed:`, err.message);

        // Mark entry as failed
        await base44.entities.PageGenerationQueue.update(entry.id, {
          generation_status: 'failed',
          error_message: err.message,
          completed_at: new Date().toISOString(),
        });

        results.entries_failed++;
        results.details.push({
          city: entry.city,
          state: entry.state,
          status: 'failed',
          error: err.message
        });
      }

      // Rate limiting: pause 500ms between city batches
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Get stats
    const queuedRemaining = await base44.entities.PageGenerationQueue.filter({
      generation_status: 'queued',
    });

    const completedTotal = await base44.entities.PageGenerationQueue.filter({
      generation_status: 'completed',
    });

    return Response.json({
      success: true,
      batch_size: nextBatch.length,
      pages_generated: results.pages_generated,
      pages_failed: results.pages_failed,
      entries_completed: results.entries_completed,
      entries_failed: results.entries_failed,
      remaining_queued: queuedRemaining.length,
      total_completed: completedTotal.length,
      total_pages_generated: completedTotal.length * 5,
      details: results.details,
      timeline_days_remaining: Math.ceil(queuedRemaining.length / 7)
    });
  } catch (error) {
    console.error('[dailyProgrammaticPageGenerator]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});