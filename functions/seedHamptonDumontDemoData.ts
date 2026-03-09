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

    // 2. Seed Stories with rich content
    const storyTitles = [
      { 
        title: 'Robotics Team Wins State Championship', 
        excerpt: 'Hampton-Dumont Robotics advanced to nationals with an innovative design that impressed judges across Iowa.',
        body: 'In a thrilling competition at the state finals, our robotics team demonstrated exceptional engineering and teamwork. Their custom-built robot featured advanced autonomous programming and mechanical precision. Coach Martinez said, "These students represent the future of STEM innovation. Their dedication is inspiring." The team will now compete at nationals in April.',
        category: 'academics'
      },
      { 
        title: 'Bulldogs Football: Undefeated Season in Sight', 
        excerpt: 'With three games remaining, the football team continues its dominant run toward a perfect record.',
        body: 'The Hampton-Dumont Bulldogs defeated Central High 42-14 in a display of offensive prowess and defensive dominance. Quarterback Jake Richardson threw for 350 yards while the defense recorded 8 sacks. Friday night\'s homecoming game against Regional rival Lincoln will be the biggest test yet.',
        category: 'sports'
      },
      { 
        title: 'Spring Choir Concert: A Standing Ovation', 
        excerpt: 'Students performed repertoire from classical to contemporary, showcasing months of preparation.',
        body: 'The spring concert featured 150 student vocalists performing in four different ensembles. Highlights included a powerful rendition of "Hallelujah" and a contemporary arrangement of "Imagine." Director Sarah Chen praised the students: "Their commitment to excellence in music is remarkable. Every student left it all on stage."',
        category: 'arts'
      },
      { 
        title: 'STEM Showcase: Innovation Day at Hampton-Dumont', 
        excerpt: 'Fifty student projects showcased robotics, coding, environmental science, and engineering innovations.',
        body: 'The annual STEM Showcase brought together students, families, and community members to celebrate innovation. Projects ranged from a sustainable water filtration system to an AI chatbot that helps students with homework. Each project demonstrated critical thinking and problem-solving skills.',
        category: 'academics'
      },
      { 
        title: 'Student Council Raises $8,000 for Local Food Bank', 
        excerpt: 'A month-long campaign collected food, funds, and volunteer hours to support our community.',
        body: 'Under the leadership of Student Body President Maria Gonzalez, student government organized a comprehensive community service initiative. The food drive collected 3,000 pounds of food while fundraising efforts brought in $8,000. Fifty students volunteered at the food bank to help sort and distribute supplies.',
        category: 'community'
      },
    ];

    for (const storyData of storyTitles) {
      await base44.asServiceRole.entities.Stories.create({
        school_slug: schoolSlug,
        title: storyData.title,
        slug: storyData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        excerpt: storyData.excerpt,
        body: storyData.body,
        status: 'published',
        publish_status: 'published',
        visibility: 'public',
        featured: storyData.category === 'sports' || storyData.category === 'academics',
        featured_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
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
      { 
        title: 'John Martinez - State Championship Roboticist', 
        type: 'student',
        excerpt: 'A junior who led our robotics team to the state finals with innovative engineering',
        body: 'John Martinez is a junior at Hampton-Dumont known for his exceptional problem-solving skills and leadership. As captain of the robotics team, he guided his teammates to the state championship. "I love building things and working with my team," John says. His dream is to study mechanical engineering at MIT.'
      },
      { 
        title: 'Coach Sarah Chen - Inspiring Musical Excellence', 
        type: 'staff',
        excerpt: 'Our choir director transformed the music program and earned national recognition',
        body: 'Director Sarah Chen joined Hampton-Dumont three years ago and completely transformed our choir program. Under her direction, the choir earned a superior rating at the state competition. "Every student deserves to experience the joy of making music," she says. Her passion is contagious and has inspired 150 students to join choir this year.'
      },
    ];

    for (const spot of spotlightTitles) {
      await base44.asServiceRole.entities.Spotlights.create({
        school_slug: schoolSlug,
        title: spot.title,
        slug: spot.title.toLowerCase().replace(/\s+/g, '-'),
        spotlight_type: spot.type,
        description: spot.excerpt,
        body: spot.body,
        status: 'published',
        publish_status: 'published',
        visibility: 'public',
        featured: true,
        featured_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
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
      { 
        title: 'Meet the Robotics Team', 
        type: 'team_feature', 
        status: 'published',
        description: 'A behind-the-scenes look at the state-championship robotics team'
      },
      { 
        title: 'Homecoming 2025 Highlights', 
        type: 'event_recap', 
        status: 'published',
        description: 'The best moments from our homecoming week celebration'
      },
      { 
        title: 'Spring Concert 2025', 
        type: 'event_recap', 
        status: 'published',
        description: 'Students perform stunning musical selections at spring concert'
      },
      { 
        title: 'STEM Innovation Showcase', 
        type: 'event_recap', 
        status: 'review_ready',
        description: 'Students showcase engineering projects and scientific innovation'
      },
    ];

    for (const proj of projectNames) {
      await base44.asServiceRole.entities.VideoProjects.create({
        school_slug: schoolSlug,
        title: proj.title,
        slug: proj.title.toLowerCase().replace(/\s+/g, '-'),
        project_type: proj.type,
        status: proj.status,
        publish_status: proj.status === 'published' ? 'published' : 'not_ready',
        description: proj.description,
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