import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const HAMPTON_DUMONT_SLUG = 'hampton-dumont';
const NOW = new Date().toISOString();

const BRANDING = {
  school_name: 'Hampton-Dumont Community Schools',
  school_slug: HAMPTON_DUMONT_SLUG,
  district_name: 'Hampton-Dumont',
  mascot_name: 'Bulldogs',
  network_name: 'Bulldog Story Lab',
  logo: 'https://via.placeholder.com/300x100/1e3a5f/ffffff?text=Bulldogs',
  primary_color: '#1e3a5f',
  secondary_color: '#f59e0b',
  accent_color: '#ffffff',
  intro_text: 'Welcome to Bulldog Story Lab, where we celebrate the achievements and moments that define our community.',
  outro_text: 'Bulldog Story Lab • Hampton-Dumont Community Schools • Celebrating our stories, every day',
  public_submission_page_title: 'Submit Your Story',
  public_gallery_title: 'Bulldog Story Gallery',
  upload_instructions: 'Share your photos and videos from school events, activities, and moments that matter. Max 500MB per file.',
  legal_release_text: 'By uploading content, you confirm that you have consent from all individuals in the media and agree to the terms of use.',
  contact_email: 'stories@hampton-dumont.k12.ia.us',
  social_youtube_url: 'https://youtube.com',
  social_facebook_url: 'https://facebook.com/hamptondumontschools',
  social_instagram_url: 'https://instagram.com/hamptondumontbulldogs',
  is_active: true
};

const STORIES = [
  {
    title: 'Robotics Team Advances to State Competition',
    slug: 'robotics-state-competition',
    excerpt: 'The H-D Robotics Club has advanced to the state finals after an impressive performance at the regional tournament.',
    body: '# Bulldogs Robotics Team Heads to State\n\nThe Hampton-Dumont Robotics Club had an outstanding performance at the regional competition, securing their spot at the state tournament. Team captain Sarah Johnson credits the group\'s success to months of dedication and problem-solving.\n\n## The Team\'s Journey\n\nStarting with just a vision and a pile of metal and plastic, the robotics team has spent the entire season building, testing, and refining their machine. Their hard work paid off when they navigated the competition course with precision and speed.\n\n## What\'s Next?\n\nThe team is now preparing for the state championship, where they\'ll compete against the best robotics programs across Iowa. The school community wishes them the very best of luck!\n\n**Go Bulldogs! 🤖**',
    featured_image_url: 'https://via.placeholder.com/1200x600/1e3a5f/ffffff?text=Robotics+Team',
    category_ids: '["academics", "clubs"]',
    author_ids: '["journalism-teacher"]',
    status: 'published',
    publish_status: 'published',
    visibility: 'public',
    featured: true,
    school_slug: HAMPTON_DUMONT_SLUG,
    published_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Friday Night Lights: Bulldogs Dominate Conference',
    slug: 'friday-night-football-conference',
    excerpt: 'The H-D football team continues their winning streak with a convincing victory over rival Central.',
    body: '# Friday Night Lights: A Bulldog Victory\n\nUnder the bright stadium lights, the Hampton-Dumont Bulldogs football team delivered an impressive performance, defeating Central 42-21 in a thrilling conference matchup.\n\n## Game Highlights\n\n- Quarterback Jake Martinez threw 3 touchdown passes\n- Running back Marcus Williams rushed for 187 yards\n- Defense recorded 5 sacks\n- Crowd attendance: Over 2,000 fans\n\n## Community Pride\n\nThe student section was electric, and the marching band delivered an outstanding halftime show. This win keeps the Bulldogs in first place in the conference.\n\n**#BulldogPride #FridayNightLights**',
    featured_image_url: 'https://via.placeholder.com/1200x600/f59e0b/1e3a5f?text=Football+Game',
    category_ids: '["sports"]',
    author_ids: '["sports-reporter"]',
    status: 'published',
    publish_status: 'published',
    visibility: 'public',
    featured: true,
    school_slug: HAMPTON_DUMONT_SLUG,
    published_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Choir Concert Showcases Musical Talent',
    slug: 'choir-spring-concert',
    excerpt: 'The H-D Choir performed a beautiful spring concert featuring classical and contemporary pieces.',
    body: '# A Night of Musical Excellence\n\nThe Hampton-Dumont High School Choir delivered a memorable performance at their spring concert, performing a diverse repertoire that showcased the talents of our student musicians.\n\n## Program Highlights\n\n- 45 students performed\n- Classical to contemporary selections\n- Standing ovation from the audience\n- Special feature: A cappella ensemble\n\n## Director\'s Note\n\nChoir Director Mrs. Chen praised the dedication and hard work of her students. "This group has truly grown as musicians this year," she said. "Their commitment to excellence is inspiring."\n\n**Congratulations to our talented choir students!**',
    featured_image_url: 'https://via.placeholder.com/1200x600/9333ea/ffffff?text=Choir+Concert',
    category_ids: '["arts"]',
    author_ids: '["arts-coordinator"]',
    status: 'published',
    publish_status: 'published',
    visibility: 'public',
    featured: false,
    school_slug: HAMPTON_DUMONT_SLUG,
    published_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'STEM Showcase Inspires Next Generation',
    slug: 'stem-showcase-2026',
    excerpt: 'Students showcased innovative STEM projects at the annual H-D STEM Showcase event.',
    body: '# STEM Showcase: Innovation on Display\n\nOver 200 people attended the Hampton-Dumont STEM Showcase, where students from grades 6-12 demonstrated innovative projects in science, technology, engineering, and mathematics.\n\n## Student Projects\n\n- Environmental monitoring systems\n- 3D-printed prosthetics\n- Machine learning applications\n- Water purification devices\n- And many more!\n\n## Community Impact\n\nLocal tech professionals and college representatives were impressed by the quality and creativity of the student work. Several students received college recruitment interest on the spot.\n\n**The future of innovation is in good hands with our Bulldog students!**',
    featured_image_url: 'https://via.placeholder.com/1200x600/0ea5e9/1e3a5f?text=STEM+Showcase',
    category_ids: '["academics"]',
    author_ids: '["stem-coordinator"]',
    status: 'published',
    publish_status: 'published',
    visibility: 'public',
    featured: false,
    school_slug: HAMPTON_DUMONT_SLUG,
    published_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Student Council Plants Trees for Community',
    slug: 'student-council-service-day',
    excerpt: 'Student Council organized a community service day focused on environmental stewardship.',
    body: '# Bulldogs Give Back: Community Service Day\n\nThe Hampton-Dumont Student Council organized a successful community service project, planting 150 native trees and shrubs at the city park.\n\n## Project Details\n\n- 75 student volunteers\n- 150 trees and shrubs planted\n- 12 hours of combined service\n- Partnership with City Parks Department\n\n## Student Leaders\n\nStudent Body President Alex Rodriguez said, "We wanted to give back to the community that supports us. Planting trees today means a greener, healthier community for everyone tomorrow."\n\n**That\'s what Bulldog Pride is all about!**',
    featured_image_url: 'https://via.placeholder.com/1200x600/22c55e/ffffff?text=Service+Day',
    category_ids: '["community"]',
    author_ids: '["student-council-advisor"]',
    status: 'published',
    publish_status: 'published',
    visibility: 'public',
    featured: false,
    school_slug: HAMPTON_DUMONT_SLUG,
    published_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const VIDEOS = [
  {
    title: 'Robotics Highlight Reel 2026',
    slug: 'robotics-highlight-2026',
    project_type: 'club_feature',
    school_slug: HAMPTON_DUMONT_SLUG,
    team_or_group: 'Robotics Club',
    description: 'A dynamic highlight reel showcasing the Robotics Team\'s regional competition performance.',
    status: 'published',
    public_video_url: 'https://via.placeholder.com/1280x720?text=Robotics+Highlight',
    cover_image: 'https://via.placeholder.com/1280x720/1e3a5f/ffffff?text=Robotics+Highlight',
    duration_target: '2-3 minutes',
    published_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    publish_to_gallery: true
  },
  {
    title: 'Football Game Recap: Week 8',
    slug: 'football-week-8-recap',
    project_type: 'sports_highlight',
    school_slug: HAMPTON_DUMONT_SLUG,
    team_or_group: 'Varsity Football',
    event_name: 'H-D vs Central',
    description: 'Highlights from Friday night\'s exciting football game victory.',
    status: 'published',
    public_video_url: 'https://via.placeholder.com/1280x720?text=Football+Recap',
    cover_image: 'https://via.placeholder.com/1280x720/f59e0b/1e3a5f?text=Football+Recap',
    published_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    publish_to_gallery: true
  },
  {
    title: 'Choir Concert Performance',
    slug: 'choir-concert-spring',
    project_type: 'arts_feature',
    school_slug: HAMPTON_DUMONT_SLUG,
    team_or_group: 'High School Choir',
    event_name: 'Spring Concert',
    description: 'Beautiful performances from our spring concert.',
    status: 'published',
    public_video_url: 'https://via.placeholder.com/1280x720?text=Choir+Performance',
    cover_image: 'https://via.placeholder.com/1280x720/9333ea/ffffff?text=Choir+Performance',
    published_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    publish_to_gallery: true
  }
];

const EVENTS = [
  {
    title: 'Regional Robotics Competition',
    slug: 'regional-robotics-2026',
    event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: 'Robotics Team competes at the regional competition.',
    school_slug: HAMPTON_DUMONT_SLUG,
    status: 'approved',
    publish_status: 'published'
  },
  {
    title: 'Spring Musical: The Crucible',
    slug: 'spring-musical-2026',
    event_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: 'Annual spring musical production featuring student performers.',
    school_slug: HAMPTON_DUMONT_SLUG,
    status: 'approved',
    publish_status: 'published'
  },
  {
    title: 'State STEM Competition',
    slug: 'state-stem-2026',
    event_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: 'Selected teams compete at the state STEM competition.',
    school_slug: HAMPTON_DUMONT_SLUG,
    status: 'approved',
    publish_status: 'published'
  },
  {
    title: 'Senior Prom',
    slug: 'senior-prom-2026',
    event_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: 'Annual senior class prom celebration.',
    school_slug: HAMPTON_DUMONT_SLUG,
    status: 'approved',
    publish_status: 'published'
  }
];

const SPOTLIGHTS = [
  {
    title: 'Teacher Spotlight: Mrs. Chen',
    slug: 'teacher-spotlight-chen',
    spotlight_type: 'teacher_spotlight',
    school_slug: HAMPTON_DUMONT_SLUG,
    featured_person: 'Mrs. Sarah Chen',
    featured_role: 'Choir Director',
    description: 'Meet Mrs. Chen, whose passion for music education inspires our students daily.',
    body: 'Mrs. Chen has been with H-D for 12 years, directing our award-winning choir program. Her students consistently perform at the highest levels.',
    featured_image_url: 'https://via.placeholder.com/600x400/9333ea/ffffff?text=Mrs+Chen',
    status: 'published',
    publish_status: 'published',
    visibility: 'public'
  },
  {
    title: 'Student Achievement: Alex Rodriguez',
    slug: 'student-spotlight-rodriguez',
    spotlight_type: 'student_achievement',
    school_slug: HAMPTON_DUMONT_SLUG,
    featured_person: 'Alex Rodriguez',
    featured_role: 'Student Body President & Robotics Captain',
    description: 'Alex leads by example both in student government and robotics.',
    body: 'As Student Body President and Robotics Team Captain, Alex has shown exceptional leadership, organizing community service projects and advancing the robotics team to state competition.',
    featured_image_url: 'https://via.placeholder.com/600x400/0ea5e9/1e3a5f?text=Alex+Rodriguez',
    status: 'published',
    publish_status: 'published',
    visibility: 'public'
  }
];

const SUBMISSIONS = [
  {
    submission_title: 'Football Game Highlights',
    contributor_name: 'Jake Martinez',
    contributor_email: 'jake@example.com',
    contributor_role: 'student',
    school: 'Hampton-Dumont HS',
    activity_type: 'sports',
    team_or_group: 'Varsity Football',
    event_name: 'H-D vs Central',
    description: 'Raw footage from Friday night\'s game.',
    upload_type: 'video_only',
    video_files: '["https://via.placeholder.com/1280x720?text=Raw+Video"]',
    consent_confirmed: true,
    legal_acknowledgement: true,
    status: 'approved',
    school_slug: HAMPTON_DUMONT_SLUG,
    ai_quality_score: 8.5,
    reviewed_by: 'sports-advisor@hd.edu'
  },
  {
    submission_title: 'Robotics Event Photos',
    contributor_name: 'Sarah Johnson',
    contributor_email: 'sarah@example.com',
    contributor_role: 'student',
    school: 'Hampton-Dumont HS',
    activity_type: 'clubs',
    team_or_group: 'Robotics Club',
    description: 'Behind-the-scenes photos from competition prep.',
    upload_type: 'photos_only',
    photo_files: '["https://via.placeholder.com/1200x800?text=Photo+1", "https://via.placeholder.com/1200x800?text=Photo+2"]',
    consent_confirmed: true,
    legal_acknowledgement: true,
    status: 'approved',
    school_slug: HAMPTON_DUMONT_SLUG,
    ai_quality_score: 9,
    reviewed_by: 'robotics-advisor@hd.edu'
  },
  {
    submission_title: 'Choir Concert Recording',
    contributor_name: 'Emily Rodriguez',
    contributor_email: 'emily@example.com',
    contributor_role: 'student',
    school: 'Hampton-Dumont HS',
    activity_type: 'arts',
    team_or_group: 'High School Choir',
    event_name: 'Spring Concert',
    description: 'Full concert recording from the spring performance.',
    upload_type: 'video_only',
    video_files: '["https://via.placeholder.com/1280x720?text=Concert+Video"]',
    consent_confirmed: true,
    legal_acknowledgement: true,
    status: 'approved',
    school_slug: HAMPTON_DUMONT_SLUG,
    ai_quality_score: 8.2,
    reviewed_by: 'arts-coordinator@hd.edu'
  },
  {
    submission_title: 'STEM Showcase Projects',
    contributor_name: 'Marcus Williams',
    contributor_email: 'marcus@example.com',
    contributor_role: 'student',
    school: 'Hampton-Dumont HS',
    activity_type: 'academics',
    team_or_group: 'STEM Club',
    event_name: 'STEM Showcase',
    description: 'Photos and videos of student STEM projects.',
    upload_type: 'mixed_media',
    video_files: '["https://via.placeholder.com/1280x720?text=STEM+Video"]',
    photo_files: '["https://via.placeholder.com/1200x800?text=Project+1", "https://via.placeholder.com/1200x800?text=Project+2"]',
    consent_confirmed: true,
    legal_acknowledgement: true,
    status: 'approved',
    school_slug: HAMPTON_DUMONT_SLUG,
    ai_quality_score: 8.8,
    reviewed_by: 'stem-coordinator@hd.edu'
  }
];

const VIDEO_PROJECTS = [
  {
    title: 'Weekly Recap: Week 8',
    slug: 'weekly-recap-week8',
    project_type: 'weekly_recap',
    school_slug: HAMPTON_DUMONT_SLUG,
    description: 'This week\'s highlights from around campus.',
    status: 'published',
    priority: 'normal'
  },
  {
    title: 'Robotics Path to State',
    slug: 'robotics-path-to-state',
    project_type: 'club_feature',
    school_slug: HAMPTON_DUMONT_SLUG,
    team_or_group: 'Robotics Club',
    description: 'The journey of our robotics team to the state competition.',
    status: 'published',
    priority: 'high'
  },
  {
    title: 'Spring Sports Highlights',
    slug: 'spring-sports-highlights',
    project_type: 'sports_highlight',
    school_slug: HAMPTON_DUMONT_SLUG,
    description: 'Spring athletic season highlights compilation.',
    status: 'published',
    priority: 'normal'
  },
  {
    title: 'Arts & Culture Showcase',
    slug: 'arts-culture-showcase',
    project_type: 'custom',
    school_slug: HAMPTON_DUMONT_SLUG,
    description: 'Celebrating our vibrant arts and culture programs.',
    status: 'published',
    priority: 'normal'
  }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Seed branding
    const brandingResult = await base44.entities.SchoolBranding.create(BRANDING);

    // Seed stories
    const storiesResult = await Promise.all(
      STORIES.map(story => base44.entities.Stories.create(story))
    );

    // Seed videos
    const videosResult = await Promise.all(
      VIDEOS.map(video => base44.entities.SchoolVideoProjects.create(video))
    );

    // Seed events
    const eventsResult = await Promise.all(
      EVENTS.map(event => base44.entities.SchoolEvents.create(event))
    );

    // Seed spotlights
    const spotlightsResult = await Promise.all(
      SPOTLIGHTS.map(spotlight => base44.entities.Spotlights.create(spotlight))
    );

    // Seed submissions
    const submissionsResult = await Promise.all(
      SUBMISSIONS.map(submission => base44.entities.SchoolSubmissions.create(submission))
    );

    // Seed video projects
    const projectsResult = await Promise.all(
      VIDEO_PROJECTS.map(project => base44.entities.SchoolVideoProjects.create(project))
    );

    return Response.json({
      success: true,
      message: 'Hampton-Dumont demo data seeded successfully',
      summary: {
        branding: 1,
        stories: storiesResult.length,
        videos: videosResult.length,
        events: eventsResult.length,
        spotlights: spotlightsResult.length,
        submissions: submissionsResult.length,
        videoProjects: projectsResult.length
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});