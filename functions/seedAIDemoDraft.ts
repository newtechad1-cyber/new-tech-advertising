import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { schoolSlug } = await req.json();

    if (!schoolSlug) {
      return Response.json({ error: 'Missing schoolSlug' }, { status: 400 });
    }

    const demoJobs = [
      {
        school_slug: schoolSlug,
        job_type: 'story_generation',
        status: 'completed',
        source_entity_type: 'StudentVideoSubmissions',
        source_entity_id: 'demo_robotics_submission',
        requested_by: 'system',
        requested_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        output_data: JSON.stringify({
          story: 'The robotics team showcased their innovative design at this weekend competition. With precision engineering and creative problem-solving, they navigated complex challenges and earned recognition for their technical excellence and teamwork.',
        }),
      },
      {
        school_slug: schoolSlug,
        job_type: 'caption_generation',
        status: 'completed',
        source_entity_type: 'StudentVideoSubmissions',
        source_entity_id: 'demo_football_submission',
        requested_by: 'system',
        requested_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        output_data: JSON.stringify({
          captions: [
            '🏈 Game day excellence! Our team brought the energy and the wins.',
            '⭐ Where hard work meets heart. Football glory achieved!',
            '💪 Building champions on and off the field.',
          ],
        }),
      },
      {
        school_slug: schoolSlug,
        job_type: 'headline',
        status: 'completed',
        source_entity_type: 'Spotlights',
        source_entity_id: 'demo_choir_spotlight',
        requested_by: 'system',
        requested_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        output_data: JSON.stringify({
          headlines: [
            'Choir Program Hits Perfect Note at Spring Concert',
            'Vocal Excellence: Students Shine in Harmonious Showcase',
            'Singing Together: Choir Students Unite in Musical Celebration',
            'From Rehearsal to Stage: Choir Program Takes Spotlight',
            'Voices Raised in Unity: Spring Concert Proves Choir\'s Strength',
          ],
        }),
      },
      {
        school_slug: schoolSlug,
        job_type: 'video_script',
        status: 'completed',
        source_entity_type: 'VideoProjects',
        source_entity_id: 'demo_stem_project',
        requested_by: 'system',
        requested_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        output_data: JSON.stringify({
          script: 'This year\'s STEM Showcase brought ideas to life. Students demonstrated cutting-edge projects spanning robotics, coding, and engineering. Watch as they present innovations that could shape tomorrow. From young minds come big ideas. This is STEM in action at Hampton-Dumont.',
        }),
      },
      {
        school_slug: schoolSlug,
        job_type: 'yearbook_intro',
        status: 'completed',
        source_entity_type: 'YearbookSeasons',
        source_entity_id: 'demo_fall_yearbook',
        requested_by: 'system',
        requested_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        output_data: JSON.stringify({
          intro: 'Fall came with golden light and boundless possibilities. As temperatures dropped, school spirit heated up. From Friday night lights to stage spotlights, from classroom breakthroughs to friendship moments captured between classes—this season defined who we are. These pages tell the story of a community that challenges, supports, and celebrates each other. Welcome to our story.',
        }),
      },
    ];

    for (const job of demoJobs) {
      await base44.asServiceRole.entities.AIContentJobs.create(job);
    }

    return Response.json({
      success: true,
      message: `Seeded ${demoJobs.length} demo AI jobs`,
      jobs_created: demoJobs.length,
    });
  } catch (error) {
    console.error('Error seeding demo AI jobs:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});