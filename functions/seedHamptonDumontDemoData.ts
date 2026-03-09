import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const schoolSlug = 'hampton-dumont';

    // 1. Seed SchoolBranding
    await base44.asServiceRole.entities.SchoolBranding.create({
      school_name: 'Hampton-Dumont High School',
      school_slug: schoolSlug,
      district_name: 'Dubuque County Community School District',
      mascot_name: 'Bulldogs',
      network_name: 'Bulldog Story Lab',
      logo: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=200',
      primary_color: '#1e3a5f',
      secondary_color: '#f59e0b',
      accent_color: '#ffffff',
      intro_text: 'Hampton-Dumont High School - Where Excellence Meets Excellence',
      outro_text: 'Go Bulldogs! Share your story.',
      public_submission_page_title: 'Share Your Story',
      public_gallery_title: 'Bulldog Story Hub',
      upload_instructions: 'Submit photos and videos of school activities, events, and achievements. All submissions will be reviewed before appearing on the public hub.',
      legal_release_text: 'By submitting content, you confirm you have permission from all people shown in the photos or videos. Submissions will be featured on the school website and social media.',
      contact_email: 'media@hamptondumont.edu',
      social_youtube_url: 'https://youtube.com/@bulldogstorylab',
      social_facebook_url: 'https://facebook.com/bulldogstorylab',
      social_instagram_url: 'https://instagram.com/bulldogstorylab',
      is_active: true,
    });

    // 2. Seed Stories
    const storyTitles = [
      { title: 'Robotics Team Advances to State Championship', excerpt: 'Our award-winning robotics club has earned their place at the state finals with an incredible robot design.', category: 'academics' },
      { title: 'Friday Night Lights: Bulldogs Dominate Rivals', excerpt: 'In an electrifying game, the football team secured victory with stellar defense and powerful plays.', category: 'sports' },
      { title: 'Choir Program Hits Perfect Note at Spring Concert', excerpt: 'The chorus performed a stunning selection of music that left the audience speechless.', category: 'arts' },
      { title: 'STEM Showcase Features Student Innovations', excerpt: 'Students from across the school demonstrated cutting-edge projects in engineering, coding, and design.', category: 'academics' },
      { title: 'Student Council Leads Community Service Initiative', excerpt: 'Our student leaders organized a successful food drive that collected over 500 pounds of donations.', category: 'community' },
    ];

    for (const storyData of storyTitles) {
      await base44.asServiceRole.entities.Stories.create({
        school_slug: schoolSlug,
        title: storyData.title,
        slug: storyData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        excerpt: storyData.excerpt,
        body: `${storyData.excerpt}\n\nThis remarkable achievement reflects the dedication and talent of our students. Our community continues to support excellence across all areas of school life.`,
        status: 'published',
        publish_status: 'published',
        visibility: 'public',
        featured: storyData.category === 'sports' || storyData.category === 'academics',
        published_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        public_url: `/schools/${schoolSlug}/stories/${storyData.title.toLowerCase().replace(/\s+/g, '-')}`,
        canonical_route: `/schools/${schoolSlug}/stories`,
      });
    }

    // 3. Seed Yearbook Season
    const seasonId = (await base44.asServiceRole.entities.YearbookSeasons.create({
      school_slug: schoolSlug,
      name: '2025-2026',
      slug: '2025-2026',
      school_year: '2026',
      start_date: '2025-08-15',
      end_date: '2026-06-01',
      status: 'in_progress',
      publish_status: 'published',
      featured: true,
      description: 'A year of excellence, growth, and unforgettable memories at Hampton-Dumont High School',
      public_url: `/schools/${schoolSlug}/yearbook/2025-2026`,
      canonical_route: `/schools/${schoolSlug}/yearbook`,
    })).id;

    // 4. Seed Yearbook Categories and Pages
    const categories = [
      { name: 'Sports', type: 'sports' },
      { name: 'Academics', type: 'academics' },
      { name: 'Arts & Music', type: 'arts' },
    ];

    for (const cat of categories) {
      const categoryId = (await base44.asServiceRole.entities.YearbookCategories.create({
        school_slug: schoolSlug,
        season_id: seasonId,
        name: cat.name,
        slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
        category_type: cat.type,
        status: 'published',
        public_url: `/schools/${schoolSlug}/yearbook/${seasonId}/${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
        canonical_route: `/schools/${schoolSlug}/yearbook`,
      })).id;

      // Seed pages for this category
      const pageNames = cat.type === 'sports' ? ['Football Season', 'Volleyball Champions'] : cat.type === 'academics' ? ['Robotics Excellence'] : ['Choir & Music'];
      
      for (const pageName of pageNames) {
        await base44.asServiceRole.entities.YearbookPages.create({
          school_slug: schoolSlug,
          season_id: seasonId,
          category_id: categoryId,
          title: pageName,
          slug: pageName.toLowerCase().replace(/\s+/g, '-'),
          description: `Highlights from ${pageName}`,
          body_text: `The ${pageName} was filled with inspiring moments and achievements. Our students brought dedication, teamwork, and school spirit to every event.`,
          status: 'published',
          publish_status: 'published',
          featured: true,
          visibility: 'public',
          published_date: new Date().toISOString(),
          public_url: `/schools/${schoolSlug}/yearbook/${seasonId}/${pageName.toLowerCase().replace(/\s+/g, '-')}`,
          canonical_route: `/schools/${schoolSlug}/yearbook`,
        });
      }
    }

    // 5. Seed Events
    const eventNames = [
      { title: 'State Robotics Championship', date: '2026-04-15', type: 'competition', summary: 'Our robotics team competes at the state level' },
      { title: 'Spring Football Game', date: '2026-03-20', type: 'game', summary: 'Annual spring scrimmage against rival schools' },
      { title: 'Spring Choir Concert', date: '2026-04-10', type: 'concert', summary: 'An evening of beautiful music performances' },
      { title: 'STEM Showcase', date: '2026-03-15', type: 'academic', summary: 'Students showcase innovative STEM projects' },
    ];

    for (const evt of eventNames) {
      await base44.asServiceRole.entities.SchoolEvents.create({
        school_slug: schoolSlug,
        title: evt.title,
        slug: evt.title.toLowerCase().replace(/\s+/g, '-'),
        event_type: evt.type,
        event_date: evt.date,
        location: 'Hampton-Dumont High School',
        summary: evt.summary,
        description: `${evt.summary}. This event celebrates the talents and achievements of our students.`,
        status: 'published',
        publish_status: 'published',
        visibility: 'public',
        featured: true,
        published_date: new Date().toISOString(),
        public_url: `/schools/${schoolSlug}/events/${evt.title.toLowerCase().replace(/\s+/g, '-')}`,
        canonical_route: `/schools/${schoolSlug}/events`,
      });
    }

    // 6. Seed Spotlights
    const spotlightTitles = [
      { title: 'Spotlight: John Martinez - Robotics Team Leader', type: 'student' },
      { title: 'Spotlight: Coach Sarah Johnson - Celebrating Excellence', type: 'staff' },
    ];

    for (const spot of spotlightTitles) {
      await base44.asServiceRole.entities.Spotlights.create({
        school_slug: schoolSlug,
        title: spot.title,
        slug: spot.title.toLowerCase().replace(/\s+/g, '-'),
        spotlight_type: spot.type,
        description: `Meet ${spot.title.split(': ')[1]}. Their dedication and passion inspire our community.`,
        body: 'Their outstanding contributions have made a real difference at Hampton-Dumont.',
        status: 'published',
        publish_status: 'published',
        visibility: 'public',
        featured: true,
        published_date: new Date().toISOString(),
        public_url: `/schools/${schoolSlug}/spotlights/${spot.title.toLowerCase().replace(/\s+/g, '-')}`,
        canonical_route: `/schools/${schoolSlug}/spotlights`,
      });
    }

    // 7. Seed Student Submissions
    const submissionTitles = [
      { title: 'Robotics Team Practice', activity: 'robotics', status: 'approved' },
      { title: 'Football Game Highlights', activity: 'football', status: 'approved' },
      { title: 'Choir Rehearsal', activity: 'choir', status: 'approved' },
      { title: 'STEM Fair Demonstrations', activity: 'stem', status: 'approved' },
    ];

    for (const sub of submissionTitles) {
      await base44.asServiceRole.entities.StudentVideoSubmissions.create({
        school_slug: schoolSlug,
        submission_title: sub.title,
        contributor_name: 'Student Contributor',
        contributor_email: 'student@hamptondumont.edu',
        contributor_role: 'student',
        school: 'Hampton-Dumont High School',
        activity_type: sub.activity,
        description: `Raw footage from ${sub.title}`,
        upload_type: 'video_only',
        status: sub.status,
        consent_confirmed: true,
        legal_acknowledgement: true,
        ai_quality_score: 85,
        ai_safety_flag: false,
      });
    }

    // 8. Seed Galleries
    const galleryNames = [
      { name: 'Robotics Lab in Action', type: 'theme' },
      { name: 'Fall Football Season 2025', type: 'event' },
      { name: 'Choir Behind the Scenes', type: 'theme' },
    ];

    for (const gal of galleryNames) {
      await base44.asServiceRole.entities.YearbookGalleries.create({
        school_slug: schoolSlug,
        season_id: seasonId,
        name: gal.name,
        slug: gal.name.toLowerCase().replace(/\s+/g, '-'),
        gallery_type: gal.type,
        image_urls: JSON.stringify([
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
          'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
        ]),
        status: 'published',
        featured: true,
      });
    }

    // 9. Seed Video Projects
    const projectNames = [
      { title: 'Robotics Team Story', type: 'team_feature', status: 'published' },
      { title: 'Football Game Recap', type: 'game_recap', status: 'published' },
      { title: 'Choir Concert Highlights', type: 'event_recap', status: 'published' },
      { title: 'STEM Showcase Showcase', type: 'event_recap', status: 'review_ready' },
    ];

    for (const proj of projectNames) {
      await base44.asServiceRole.entities.VideoProjects.create({
        school_slug: schoolSlug,
        title: proj.title,
        slug: proj.title.toLowerCase().replace(/\s+/g, '-'),
        project_type: proj.type,
        status: proj.status,
        publish_status: proj.status === 'published' ? 'published' : 'not_ready',
        description: proj.title,
        tone: 'warm',
        duration_target: '2-3 minutes',
        format_type: 'landscape',
        voiceover_enabled: true,
        captions_enabled: true,
        intro_enabled: true,
        outro_enabled: true,
        publish_to_gallery: true,
        published_date: proj.status === 'published' ? new Date().toISOString() : null,
        public_video_url: proj.status === 'published' ? `/video/${proj.slug}` : null,
      });
    }

    // 10. Seed Render Jobs with varied statuses
    const renderJobs = [
      { name: 'Robotics Story - Final Render', status: 'completed', progress: 100, project: 'Robotics Team Story' },
      { name: 'Football Recap - Processing', status: 'rendering', progress: 65, project: 'Football Game Recap' },
      { name: 'Choir Concert - Queued', status: 'queued', progress: 0, project: 'Choir Concert Highlights' },
      { name: 'STEM Showcase - Failed', status: 'failed', progress: 35, failure_stage: 'post_processing', project: 'STEM Showcase Showcase' },
    ];

    for (const job of renderJobs) {
      await base44.asServiceRole.entities.VideoRenderJobs.create({
        school_slug: schoolSlug,
        project_id: job.project,
        render_name: job.name,
        render_engine: 'internal',
        status: job.status,
        progress_percent: job.progress,
        failure_stage: job.failure_stage || null,
        error_message: job.failure_stage ? 'Encoding error during final pass' : null,
        resolution: '1920x1080',
        aspect_ratio: '16:9',
        output_url: job.status === 'completed' ? `/videos/${job.project}` : null,
        retry_count: 0,
        max_retries: 3,
      });
    }

    // 11. Seed AI Jobs and Outputs
    const aiJobs = [
      { type: 'story_generation', source: 'Robotics Team Story', status: 'completed' },
      { type: 'caption_generation', source: 'Football Game Recap', status: 'completed' },
      { type: 'headline', source: 'Choir Concert Highlights', status: 'completed' },
      { type: 'video_script', source: 'STEM Showcase Showcase', status: 'pending' },
    ];

    for (const job of aiJobs) {
      const aiJob = await base44.asServiceRole.entities.AIContentJobs.create({
        school_slug: schoolSlug,
        job_type: job.type,
        status: job.status,
        source_entity_type: 'VideoProjects',
        source_entity_id: job.source,
        requested_by: 'admin',
        completed_at: job.status === 'completed' ? new Date().toISOString() : null,
        output_data: job.status === 'completed' ? JSON.stringify({
          content: `AI-generated content for ${job.source}`,
        }) : null,
      });

      if (job.status === 'completed') {
        await base44.asServiceRole.entities.AIContentOutputs.create({
          school_slug: schoolSlug,
          ai_job_id: aiJob.id,
          output_type: job.type,
          source_entity_type: 'VideoProjects',
          source_entity_id: job.source,
          output_data: JSON.stringify({ content: `Generated ${job.type} for ${job.source}` }),
          status: 'approved',
          approved: true,
        });
      }
    }

    return Response.json({
      success: true,
      message: 'Hampton-Dumont demo data seeded successfully',
      items: {
        branding: 1,
        stories: 5,
        events: 4,
        spotlights: 2,
        submissions: 4,
        galleries: 3,
        projects: 4,
        render_jobs: 4,
        ai_jobs: 4,
      },
    });
  } catch (error) {
    console.error('Error seeding Hampton-Dumont data:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});