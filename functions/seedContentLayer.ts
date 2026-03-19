import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const schoolSlug = 'hampton-dumont';

    // Seed Spotlight Types
    const spotlightTypes = await base44.asServiceRole.entities.SpotlightTypes.bulkCreate([
      { name: 'Student Feature', slug: 'student', description: 'Student achievement and profile', sort_order: 1 },
      { name: 'Teacher Feature', slug: 'teacher', description: 'Teacher and staff profiles', sort_order: 2 },
      { name: 'Club Spotlight', slug: 'club', description: 'Club and organization highlights', sort_order: 3 },
      { name: 'Alumni Profile', slug: 'alumni', description: 'Alumni achievement stories', sort_order: 4 },
    ]);

    // Seed Story Categories
    const storyCategories = await base44.asServiceRole.entities.StoryCategories.bulkCreate([
      { school_slug: schoolSlug, name: 'Sports', slug: 'sports', category_type: 'subject', sort_order: 1 },
      { school_slug: schoolSlug, name: 'Arts & Culture', slug: 'arts', category_type: 'subject', sort_order: 2 },
      { school_slug: schoolSlug, name: 'Academic News', slug: 'academics', category_type: 'subject', sort_order: 3 },
      { school_slug: schoolSlug, name: 'Community Events', slug: 'events', category_type: 'event', sort_order: 4 },
    ]);

    // Seed Story Authors
    const authors = await base44.asServiceRole.entities.StoryAuthors.bulkCreate([
      { school_slug: schoolSlug, display_name: 'Sarah Mills', role_type: 'staff', email: 'smills@hdcsd.org' },
      { school_slug: schoolSlug, display_name: 'Mike Johnson', role_type: 'teacher', email: 'mjohnson@hdcsd.org' },
      { school_slug: schoolSlug, display_name: 'Emma Rodriguez', role_type: 'student', email: 'erodriguez@hdcsd.org' },
    ]);

    // Seed Tags
    const tags = await base44.asServiceRole.entities.Tags.bulkCreate([
      { school_slug: schoolSlug, name: 'Football', slug: 'football', tag_type: 'team' },
      { school_slug: schoolSlug, name: 'Volleyball', slug: 'volleyball', tag_type: 'team' },
      { school_slug: schoolSlug, name: 'Marching Band', slug: 'marching-band', tag_type: 'team' },
      { school_slug: schoolSlug, name: 'Robotics', slug: 'robotics', tag_type: 'team' },
      { school_slug: schoolSlug, name: 'Homecoming', slug: 'homecoming', tag_type: 'general' },
    ]);

    // Seed Yearbook Season
    const season = await base44.asServiceRole.entities.YearbookSeasons.create({
      school_slug: schoolSlug,
      name: '2025-2026 School Year',
      slug: '2025-2026',
      academic_year: '2025-2026',
      season_type: 'full_year',
      title: 'Bulldog Pride: The 2025-2026 Yearbook',
      description: 'Capturing the spirit and memories of Hampton-Dumont High School',
      intro_text: 'Welcome to the digital yearbook for Hampton-Dumont High School. Explore our stories, events, and achievements from the 2025-2026 school year.',
      status: 'ready',
      cover_image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
    });

    // Seed Yearbook Categories
    const categories = await base44.asServiceRole.entities.YearbookCategories.bulkCreate([
      {
        school_slug: schoolSlug,
        season_id: season.id,
        name: 'Sports',
        slug: 'sports',
        category_type: 'sports',
        description: 'Team achievements and game highlights',
        intro_text: 'From football field victories to volleyball championships, our athletes represented HD with pride.',
        status: 'ready',
        sort_order: 1,
      },
      {
        school_slug: schoolSlug,
        season_id: season.id,
        name: 'Academics',
        slug: 'academics',
        category_type: 'academics',
        description: 'Classroom and educational highlights',
        intro_text: 'Excellence in education drives everything we do at Hampton-Dumont.',
        status: 'ready',
        sort_order: 2,
      },
      {
        school_slug: schoolSlug,
        season_id: season.id,
        name: 'Arts & Performance',
        slug: 'arts',
        category_type: 'arts',
        description: 'Music, theater, and visual arts',
        intro_text: 'Our talented performers brought creativity and culture to our community.',
        status: 'ready',
        sort_order: 3,
      },
      {
        school_slug: schoolSlug,
        season_id: season.id,
        name: 'Clubs & Organizations',
        slug: 'clubs',
        category_type: 'clubs',
        description: 'Student groups and activities',
        intro_text: 'Students led and participated in diverse clubs that enriched school life.',
        status: 'ready',
        sort_order: 4,
      },
    ]);

    // Seed Stories
    const stories = await base44.asServiceRole.entities.Stories.bulkCreate([
      {
        school_slug: schoolSlug,
        title: 'Football Season Recap: Bulldogs Go 9-1',
        slug: 'football-season-9-1',
        excerpt: 'Hampton-Dumont football team caps off an incredible season with strong performances throughout.',
        body: 'The 2025 football season was one for the record books at Hampton-Dumont High School. Our Bulldogs finished with a 9-1 regular season record, earning the top seed in the district playoffs. Led by senior quarterback Marcus Thompson and an outstanding defense, the team averaged 32 points per game while holding opponents to just 14 points per contest.',
        story_type: 'recap',
        status: 'approved',
        publish_status: 'published',
        visibility: 'public',
        author_id: authors[1]?.id,
        categories: JSON.stringify([storyCategories[0]?.id]),
        tags: JSON.stringify([tags[0]?.id]),
        featured: true,
      },
      {
        school_slug: schoolSlug,
        title: 'Marching Band Takes First at State Competition',
        slug: 'marching-band-state-champs',
        excerpt: 'HD Marching Band earns top honors at the Iowa State Marching Band Championship.',
        body: 'In an outstanding display of musicality and precision, the Hampton-Dumont High School Marching Band captured first place in their classification at the Iowa State Marching Band Championship. The band performed their original show "Colors of Our Community" to a standing ovation from the crowd and praise from the judges.',
        story_type: 'news',
        status: 'approved',
        publish_status: 'published',
        visibility: 'public',
        author_id: authors[0]?.id,
        categories: JSON.stringify([storyCategories[1]?.id]),
        tags: JSON.stringify([tags[2]?.id]),
        featured: true,
      },
      {
        school_slug: schoolSlug,
        title: 'Robotics Team Advances to Regional Finals',
        slug: 'robotics-regional-finals',
        excerpt: 'The HDSTEM Robotics Team qualifies for regional competition with impressive performance.',
        body: 'The Hampton-Dumont High School Robotics Team successfully designed, built, and competed with their innovative robot "Bulldog Prime" in the FIRST Robotics regional competition. The team demonstrated exceptional engineering, teamwork, and problem-solving skills, earning a spot in the regional finals.',
        story_type: 'feature',
        status: 'approved',
        publish_status: 'published',
        visibility: 'public',
        author_id: authors[2]?.id,
        categories: JSON.stringify([storyCategories[2]?.id]),
        tags: JSON.stringify([tags[3]?.id]),
      },
    ]);

    // Seed Events
    const events = await base44.asServiceRole.entities.SchoolEvents.bulkCreate([
      {
        school_slug: schoolSlug,
        title: 'Homecoming Game: Bulldogs vs Knights',
        slug: 'homecoming-game-2025',
        event_type: 'game',
        event_date: '2025-10-10',
        location: 'HD Stadium',
        summary: 'Annual homecoming football game with pre-game festivities and celebration.',
        description: 'Join us for our annual homecoming game! The Bulldogs take on the Central Knights in a battle for conference supremacy. Festivities begin at 5 PM with the homecoming parade, followed by the game at 7 PM.',
        status: 'approved',
        publish_status: 'published',
        visibility: 'public',
        linked_season_id: season.id,
        featured: true,
      },
      {
        school_slug: schoolSlug,
        title: 'Fall Band Concert',
        slug: 'fall-band-concert-2025',
        event_type: 'concert',
        event_date: '2025-11-15',
        location: 'HD Auditorium',
        summary: 'Hampton-Dumont Band and Orchestra presents their fall concert.',
        description: 'Experience the musical talents of our high school band and orchestra. The concert will feature selections ranging from classical to contemporary works.',
        status: 'approved',
        publish_status: 'published',
        visibility: 'public',
        linked_season_id: season.id,
      },
      {
        school_slug: schoolSlug,
        title: 'Winter Sports Kickoff Assembly',
        slug: 'winter-sports-kickoff-2025',
        event_type: 'assembly',
        event_date: '2025-11-21',
        location: 'HD Gymnasium',
        summary: 'Celebrate winter athletes and their upcoming seasons.',
        description: 'All winter sports teams are recognized and introduced to the student body. Get pumped for basketball, wrestling, swimming, and more!',
        status: 'approved',
        publish_status: 'published',
        visibility: 'public',
        linked_season_id: season.id,
      },
    ]);

    // Seed Spotlights
    const spotlights = await base44.asServiceRole.entities.Spotlights.bulkCreate([
      {
        school_slug: schoolSlug,
        title: 'Marcus Thompson: Leading the Bulldogs',
        slug: 'marcus-thompson-qb',
        spotlight_type: 'student',
        featured_name: 'Marcus Thompson',
        featured_role: 'Senior, Quarterback',
        featured_group: 'Bulldog Football',
        headline: 'Leading the Charge',
        subheadline: 'Senior QB Marcus Thompson guides Bulldogs to outstanding season',
        excerpt: 'Marcus Thompson has been the heartbeat of the Bulldog football team, leading with poise and precision.',
        body: 'Senior quarterback Marcus Thompson has had an outstanding final season with the Hampton-Dumont Bulldogs. With a 68% completion percentage and 28 touchdown passes, Marcus has demonstrated exceptional leadership both on and off the field. His ability to read defenses and make quick decisions has been instrumental in the team\'s 9-1 record.',
        quote_text: '"I\'m grateful for my teammates and coaches who believed in me. This team has special chemistry."',
        status: 'approved',
        publish_status: 'published',
        visibility: 'public',
        linked_story_id: stories[0]?.id,
        linked_season_id: season.id,
        featured: true,
      },
      {
        school_slug: schoolSlug,
        title: 'Ms. Chen: Teaching Excellence',
        slug: 'ms-chen-teacher-feature',
        spotlight_type: 'teacher',
        featured_name: 'Ms. Julia Chen',
        featured_role: 'AP Biology Teacher',
        featured_group: 'Science Department',
        headline: 'Inspiring Future Scientists',
        subheadline: 'Ms. Chen brings passion and innovation to the science classroom',
        excerpt: 'Ms. Julia Chen has transformed science education at Hampton-Dumont with innovative labs and engaging lessons.',
        body: 'Ms. Julia Chen has been named the 2025 Teacher of the Year for her exceptional dedication to student learning. Her AP Biology students consistently score in the top percentile on standardized exams, and her laboratory experiences have inspired many students to pursue science careers.',
        quote_text: '"My goal is to make science accessible and exciting for every student who walks through my classroom door."',
        status: 'approved',
        publish_status: 'published',
        visibility: 'public',
        linked_season_id: season.id,
        featured: true,
      },
    ]);

    // Seed Yearbook Pages
    const yearbookPages = await base44.asServiceRole.entities.YearbookPages.bulkCreate([
      {
        school_slug: schoolSlug,
        season_id: season.id,
        category_id: categories[0]?.id,
        title: 'Football: Champions on the Field',
        slug: 'football-champions',
        page_type: 'content',
        status: 'approved',
        publish_status: 'published',
        visibility: 'public',
        intro_text: 'The 2025 Bulldog football team had an exceptional season with a 9-1 record and strong playoff performance.',
        layout_type: 'hero_text',
        cover_image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
        featured: true,
      },
      {
        school_slug: schoolSlug,
        season_id: season.id,
        category_id: categories[2]?.id,
        title: 'Music: The Sound of Pride',
        slug: 'music-programs',
        page_type: 'content',
        status: 'approved',
        publish_status: 'published',
        visibility: 'public',
        intro_text: 'From marching band championships to concert hall performances, our musicians showcase talent and artistry.',
        layout_type: 'mixed',
        cover_image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        featured: true,
      },
    ]);

    return Response.json({
      success: true,
      created: {
        spotlight_types: spotlightTypes.length,
        story_categories: storyCategories.length,
        authors: authors.length,
        tags: tags.length,
        season: 1,
        categories: categories.length,
        stories: stories.length,
        events: events.length,
        spotlights: spotlights.length,
        yearbook_pages: yearbookPages.length,
      },
      message: 'Content layer seeded successfully for Hampton-Dumont',
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});