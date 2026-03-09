import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const schoolSlug = 'hampton-dumont';

    // Seed Stories
    const stories = await base44.asServiceRole.entities.Stories.bulkCreate([
      {
        school_slug: schoolSlug,
        title: 'Football Team Wins District Championship',
        slug: 'football-championship',
        excerpt: 'The Bulldogs secured their first district championship in 15 years with an impressive 42-28 victory.',
        body: 'In an exciting Friday night matchup, the Hampton-Dumont Bulldogs dominated their rivals to claim the district championship. The team showed incredible teamwork and determination throughout the season. This victory is a testament to the hard work and dedication of Coach Johnson and his players.',
        featured_image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
        status: 'published',
        featured: true,
        category_ids: '[]',
      },
      {
        school_slug: schoolSlug,
        title: 'Drama Department Presents Spring Musical',
        slug: 'spring-musical',
        excerpt: 'The talented students brought the classic musical to life with stunning performances.',
        body: 'Last weekend, the Drama Department performed an unforgettable rendition of a timeless classic. The cast, crew, and musicians worked tirelessly to create a production that will be remembered for years to come. Congratulations to all involved!',
        featured_image_url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
        status: 'published',
        featured: true,
        category_ids: '[]',
      },
      {
        school_slug: schoolSlug,
        title: 'Science Fair Showcases Student Innovation',
        slug: 'science-fair',
        excerpt: 'Students presented groundbreaking projects in biology, chemistry, physics, and environmental science.',
        body: 'Our annual science fair was a tremendous success this year. Students demonstrated remarkable creativity and scientific thinking. From water purification systems to robotics projects, the caliber of work was outstanding.',
        featured_image_url: 'https://images.unsplash.com/photo-1576258543632-60a3c3eb5eab?w=800',
        status: 'published',
        featured: false,
        category_ids: '[]',
      },
      {
        school_slug: schoolSlug,
        title: 'Art Students Display Work at Community Gallery',
        slug: 'art-gallery',
        excerpt: 'Paintings, sculptures, and digital art from our talented students are now on display.',
        body: 'We are proud to showcase the artistic talents of our students at the community gallery downtown. Visitors can view a diverse collection of work spanning multiple mediums and styles.',
        featured_image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        status: 'published',
        featured: false,
        category_ids: '[]',
      },
      {
        school_slug: schoolSlug,
        title: 'Environmental Club Plants 500 Trees',
        slug: 'environmental-club',
        excerpt: 'Students commit to sustainability with a major tree planting initiative.',
        body: 'The Environmental Club launched an ambitious tree planting project to improve air quality in our region. Over 500 native trees were planted by dedicated students and community volunteers.',
        featured_image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        status: 'published',
        featured: false,
        category_ids: '[]',
      },
    ]);

    // Seed Video Projects
    const videos = await base44.asServiceRole.entities.VideoProjects.bulkCreate([
      {
        school_slug: schoolSlug,
        title: 'Weekly Recap - Week of March 3rd',
        slug: 'weekly-recap-march-3',
        project_type: 'weekly_recap',
        description: 'Join us for a look back at the highlights from this week at Hampton-Dumont.',
        objective: 'Celebrate weekly achievements and community moments',
        target_audience: 'School community and families',
        tone: 'warm',
        status: 'published',
        public_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        cover_image_url: 'https://images.unsplash.com/photo-1495597798527-b8accf78b2b8?w=800',
        published_date: new Date().toISOString(),
      },
      {
        school_slug: schoolSlug,
        title: 'Sports Highlights - Basketball Season',
        slug: 'sports-highlights-basketball',
        project_type: 'sports_highlight',
        description: 'Watch the best plays from this season\'s basketball games.',
        objective: 'Showcase athletic excellence',
        target_audience: 'Students and families',
        tone: 'energetic',
        status: 'published',
        public_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        cover_image_url: 'https://images.unsplash.com/photo-1546519638-68711109039f?w=800',
        published_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        school_slug: schoolSlug,
        title: 'Meet the Robotics Team',
        slug: 'robotics-team-feature',
        project_type: 'club_feature',
        description: 'Get to know the students behind our award-winning robotics program.',
        objective: 'Highlight student achievements',
        target_audience: 'School community',
        tone: 'inspiring',
        status: 'published',
        public_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        cover_image_url: 'https://images.unsplash.com/photo-1488146221393-11019740572f?w=800',
        published_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]);

    // Seed Events
    const events = await base44.asServiceRole.entities.SchoolEvents.bulkCreate([
      {
        school_slug: schoolSlug,
        title: 'Spring Prom',
        slug: 'spring-prom',
        event_type: 'celebration',
        event_date: '2026-04-18',
        event_time: '19:00',
        location: 'Hampton-Dumont High School Gymnasium',
        summary: 'Join us for an unforgettable evening celebrating the school year.',
        description: 'Our annual Spring Prom is a night to remember. Dress to impress and celebrate with friends.',
        status: 'published',
        featured: true,
        cover_image_url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800',
        published_date: new Date().toISOString(),
      },
      {
        school_slug: schoolSlug,
        title: 'Academic Awards Ceremony',
        slug: 'academic-awards',
        event_type: 'academic',
        event_date: '2026-03-25',
        event_time: '18:00',
        location: 'Auditorium',
        summary: 'Recognizing outstanding academic achievement.',
        status: 'published',
        featured: false,
        cover_image_url: 'https://images.unsplash.com/photo-1543269865-cbdf26405b4a?w=800',
        published_date: new Date().toISOString(),
      },
      {
        school_slug: schoolSlug,
        title: 'Spring Band Concert',
        slug: 'spring-band-concert',
        event_type: 'concert',
        event_date: '2026-03-30',
        event_time: '19:30',
        location: 'Auditorium',
        summary: 'Experience the beautiful music of our talented musicians.',
        status: 'published',
        featured: false,
        cover_image_url: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800',
        published_date: new Date().toISOString(),
      },
      {
        school_slug: schoolSlug,
        title: 'Spring Athletic Day',
        slug: 'spring-athletic-day',
        event_type: 'competition',
        event_date: '2026-04-10',
        event_time: '10:00',
        location: 'Athletic Fields',
        summary: 'A day of friendly competition and athletic excellence.',
        status: 'published',
        featured: false,
        cover_image_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
        published_date: new Date().toISOString(),
      },
    ]);

    // Seed Spotlights
    const spotlights = await base44.asServiceRole.entities.Spotlights.bulkCreate([
      {
        school_slug: schoolSlug,
        title: 'Sarah Chen - National Science Olympiad Competitor',
        slug: 'sarah-chen-science',
        spotlight_type_id: '',
        featured_person_names: JSON.stringify(['Sarah Chen']),
        summary: 'Senior Sarah Chen advances to nationals in Science Olympiad.',
        full_text: 'Sarah has dedicated countless hours to her Science Olympiad preparation and has earned a spot at the national competition. Her passion for science and determination are an inspiration to all.',
        featured_image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
        status: 'published',
        publish_status: 'published',
        featured: true,
      },
      {
        school_slug: schoolSlug,
        title: 'Coach Mike Johnson - 20 Years of Excellence',
        slug: 'coach-mike-johnson',
        spotlight_type_id: '',
        featured_person_names: JSON.stringify(['Coach Mike Johnson']),
        summary: 'Celebrating Coach Johnson\'s two decades of dedication to student athletics.',
        full_text: 'Coach Johnson has mentored hundreds of students over his 20-year career. His impact extends far beyond the playing field, shaping young leaders and building character.',
        featured_image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
        status: 'published',
        publish_status: 'published',
        featured: false,
      },
    ]);

    // Seed Yearbook Season
    const season = await base44.asServiceRole.entities.YearbookSeasons.create({
      school_slug: schoolSlug,
      name: '2025-2026',
      slug: '2025-2026',
      school_year: '2026',
      start_date: '2025-08-15',
      end_date: '2026-05-30',
      status: 'published',
      publish_status: 'published',
      cover_image_url: 'https://images.unsplash.com/photo-1509516307049-a894f6346560?w=800',
      description: 'The 2025-2026 school year at Hampton-Dumont Community School.',
    });

    // Seed Yearbook Categories
    const categories = await base44.asServiceRole.entities.YearbookCategories.bulkCreate([
      {
        school_slug: schoolSlug,
        season_id: season.id,
        name: 'Athletics',
        slug: 'athletics',
        description: 'Celebrating our sports programs and athletic achievements.',
        category_type: 'sports',
        status: 'published',
        cover_image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      },
      {
        school_slug: schoolSlug,
        season_id: season.id,
        name: 'Student Life',
        slug: 'student-life',
        description: 'Moments from the daily lives of our students.',
        category_type: 'events',
        status: 'published',
        cover_image_url: 'https://images.unsplash.com/photo-1517457373614-b7152f5efd13?w=800',
      },
      {
        school_slug: schoolSlug,
        season_id: season.id,
        name: 'Classes',
        slug: 'classes',
        description: 'Class photos and memories.',
        category_type: 'people',
        status: 'published',
        cover_image_url: 'https://images.unsplash.com/photo-1509365338328-0b41e5c52e1f?w=800',
      },
    ]);

    // Seed Yearbook Pages
    await base44.asServiceRole.entities.YearbookPages.bulkCreate([
      {
        school_slug: schoolSlug,
        season_id: season.id,
        category_id: categories[0].id,
        title: 'Football Team',
        slug: 'football-team-page',
        description: 'Our championship-winning football team.',
        status: 'published',
        featured_image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      },
      {
        school_slug: schoolSlug,
        season_id: season.id,
        category_id: categories[1].id,
        title: 'Homecoming Dance',
        slug: 'homecoming-dance-page',
        description: 'Students celebrate homecoming night.',
        status: 'published',
        featured_image_url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800',
      },
      {
        school_slug: schoolSlug,
        season_id: season.id,
        category_id: categories[2].id,
        title: 'Class of 2026',
        slug: 'senior-class-page',
        description: 'Meet the graduating class of 2026.',
        status: 'published',
        featured_image_url: 'https://images.unsplash.com/photo-1509365338328-0b41e5c52e1f?w=800',
      },
    ]);

    // Seed Yearbook Galleries
    await base44.asServiceRole.entities.YearbookGalleries.bulkCreate([
      {
        school_slug: schoolSlug,
        season_id: season.id,
        name: 'Football Season',
        slug: 'football-gallery',
        gallery_type: 'event',
        image_urls: JSON.stringify([
          'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
          'https://images.unsplash.com/photo-1547917286-7a8e3a84e481?w=400',
          'https://images.unsplash.com/photo-1461910114934-7c559e0acccb?w=400',
        ]),
        status: 'published',
      },
      {
        school_slug: schoolSlug,
        season_id: season.id,
        name: 'Spring Play',
        slug: 'spring-play-gallery',
        gallery_type: 'event',
        image_urls: JSON.stringify([
          'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
          'https://images.unsplash.com/photo-1525717198915-8a54b94645f1?w=400',
          'https://images.unsplash.com/photo-1485579149c01123dd3b915f3f51043ee02bd3808?w=400',
        ]),
        status: 'published',
      },
      {
        school_slug: schoolSlug,
        season_id: season.id,
        name: 'School Dances',
        slug: 'dances-gallery',
        gallery_type: 'event',
        image_urls: JSON.stringify([
          'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400',
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
          'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400',
        ]),
        status: 'published',
      },
    ]);

    return Response.json({
      success: true,
      message: 'Demo content seeded successfully',
      counts: {
        stories: stories.length,
        videos: videos.length,
        events: events.length,
        spotlights: spotlights.length,
        yearbook_categories: categories.length,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});