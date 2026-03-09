import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const HAMPTON_DUMONT_SLUG = 'hampton-dumont';
const NOW = new Date().toISOString();

const BRANDING = {
  school_name: 'Hampton-Dumont Community Schools',
  school_slug: HAMPTON_DUMONT_SLUG,
  district_name: 'Hampton-Dumont District',
  mascot_name: 'Bulldogs',
  network_name: 'Bulldog Story Lab',
  logo: 'https://via.placeholder.com/300x100/1e3a5f/ffffff?text=Bulldogs',
  primary_color: '#1e3a5f',
  secondary_color: '#f59e0b',
  accent_color: '#ffffff',
  intro_text: 'Where student voices matter. We celebrate achievement, embrace diversity, and showcase the remarkable talents of our Bulldog community.',
  outro_text: 'Bulldog Story Lab • Hampton-Dumont Community Schools • #BulldogPride',
  public_submission_page_title: 'Share Your Bulldog Story',
  public_gallery_title: 'Bulldog Story Gallery',
  upload_instructions: 'Upload photos and videos from school events, sports, performances, academic achievements, and community moments. Help us celebrate what makes our school special.',
  legal_release_text: 'By submitting content, you confirm having consent from all people shown and agree to our community guidelines.',
  contact_email: 'media@hampton-dumont.k12.ia.us',
  social_youtube_url: 'https://youtube.com/c/hamptondumontschools',
  social_facebook_url: 'https://facebook.com/hamptondumontschools',
  social_instagram_url: 'https://instagram.com/hamptondumontbulldogs',
  is_active: true
};

const STORIES = [
  {
    title: 'From Dream to Reality: Robotics Team Advances to State Championship',
    slug: 'robotics-state-competition',
    excerpt: 'After 6 months of innovation, persistence, and teamwork, the H-D Robotics Club earned their spot at the state finals.',
    body: '# Bulldogs Robotics Team Advances to State Championship\n\n"This is what happens when you believe in yourself and your team," says Sarah Johnson, team captain. After six months of intensive work, the Hampton-Dumont Robotics Club advanced to the state championship, outperforming 12 other regional teams.\n\n## Behind the Success\n\nStarting with a blank sheet of paper last fall, the team of 14 students designed, built, and refined their competition robot—from welding steel frames to programming complex autonomous systems.\n\n**"Every single person contributed something essential,"** said team advisor Mr. Marcus Chen. **"This isn\'t just about robots—it\'s about learning that impossible becomes possible when you work together."\n\n## What\'s Next?\n\nThe Bulldogs will compete at the Iowa FIRST State Championship in April, competing against schools from across Iowa. Their innovative approach has already caught the attention of universities and tech companies.\n\nWe\'re incredibly proud of these young engineers who represent the best of Bulldog excellence and determination.\n\n**#BulldogPride #FIRSTRobotics #StateChampionship**',
    featured_image_url: 'https://via.placeholder.com/1200x600/1e3a5f/ffffff?text=Robotics+Team+Celebrating',
    category_ids: '["stem", "clubs"]',
    author_ids: '[]',
    status: 'published',
    publish_status: 'published',
    visibility: 'public',
    featured: true,
    school_slug: HAMPTON_DUMONT_SLUG,
    published_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Friday Night Lights: Bulldogs Earn Playoff Spot With Historic Victory',
    slug: 'friday-night-football-playoff',
    excerpt: 'In a thrilling game, the Bulldogs secured their playoff spot with a dramatic 42-21 victory over rival Central High.',
    body: '# Friday Night Glory: Bulldogs Make Playoffs\n\nWhen QB Jake Martinez unleashed a perfect spiral into the end zone with 2:47 left in the fourth quarter, a roar erupted from the crowd of over 2,500 fans packed into Bulldog Stadium. The Hampton-Dumont Bulldogs had just clinched their playoff spot with a dominant 42-21 victory over Central High.\n\n## The Story of the Game\n\nIt wasn\'t just the scoreboard—it was the HEART on every play. Running back Marcus Williams ran with the determination that defines Bulldog football, rushing 31 times for 187 yards and 3 touchdowns. The defense was relentless, recording 5 sacks and forcing 3 turnovers.\n\n## Community Support\n\nThe marching band never stopped playing. The student section never stopped cheering. The crowd never stopped believing. This is what Friday night football means in Hampton-Dumont.\n\n**"This is for our community,"** said Coach Randy Thompson after the game. **"This playoff spot belongs to our fans, our families, and our school."\n\n## What\'s Next?\n\nThe Bulldogs (10-2) will host a playoff game next Friday at home. One step closer to the championship.\n\n**#BulldogPride #FridayNightLights #OneToBowl**',
    featured_image_url: 'https://via.placeholder.com/1200x600/f59e0b/1e3a5f?text=Football+Victory+Celebration',
    category_ids: '["sports"]',
    author_ids: '[]',
    status: 'published',
    publish_status: 'published',
    visibility: 'public',
    featured: true,
    school_slug: HAMPTON_DUMONT_SLUG,
    published_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'A Night to Remember: H-D Choir Delivers Standing Ovation Performance',
    slug: 'choir-spring-concert',
    excerpt: 'With harmonies that moved audiences to tears, the H-D Choir proved that music knows no limits.',
    body: '# A Night of Pure Magic: H-D Choir Performs\n\nAs the lights dimmed in the auditorium, 48 student voices came together in a perfect harmony that stopped the audience mid-breath. The Hampton-Dumont High School Choir delivered an unforgettable spring concert, performing a journey from Mozart to modern world music.\n\n## The Performance\n\nFrom the opening notes of "O Magnum Mysterium" to the moving finale of "Hallelujah," every moment reflected countless hours of practice, dedication, and pure love for music.\n\n**"What they did tonight,"** said Director Mrs. Sarah Chen, **"is something you can\'t teach—it\'s the result of 48 hearts beating as one. They made us feel something."\n\n## Special Moments\n\n- Sophomore Quinn Martinez\'s breathtaking solo performance of "Someone You Love"\n- The powerful a cappella rendition of "Circle of Life" (standing ovation)\n- A surprise performance with the middle school choir—passing the torch of musical excellence\n- The entire audience singing along to the encore: "Don\'t Stop Believin\'"\n\n## Community Impact\n\nOver 900 people packed the auditorium. Many left with tears. All left inspired.\n\n**Thank you to our incredible choir students for reminding us that the arts matter, that beauty matters, and that your voices matter.**\n\n**#BulldogVoices #ArtsExcellence #MusicHeals**',
    featured_image_url: 'https://via.placeholder.com/1200x600/9333ea/ffffff?text=Choir+Standing+Ovation',
    category_ids: '["arts", "performing-arts"]',
    author_ids: '[]',
    status: 'published',
    publish_status: 'published',
    visibility: 'public',
    featured: false,
    school_slug: HAMPTON_DUMONT_SLUG,
    published_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Students Turn Ideas Into Reality: STEM Showcase Lights Up Innovation',
    slug: 'stem-showcase-2026',
    excerpt: 'From solar-powered water pumps to AI disease detection, H-D students are solving real-world problems.',
    body: '# STEM Showcase: Where Big Ideas Come to Life\n\nWhen 8th grader Maya Patel explained her water purification system to a room full of impressed engineers, she wasn\'t just presenting a school project—she was showing the future of sustainable technology. This was the heart of the 2026 Hampton-Dumont STEM Showcase.\n\n## The Projects That Amazed\n\n**Environmental Innovation:** Teams presented solar-powered irrigation systems, urban composting solutions, and air quality monitoring devices.\n\n**Medical Technology:** Students built 3D-printed prosthetics and created a machine-learning app to help detect early signs of disease.\n\n**Robotics & Engineering:** Fully autonomous robots, drones for agricultural monitoring, and engineering solutions for local problems.\n\n**And they were ALL done by our students.**\n\n## The Audience\n\nOver 500 people filled the auditorium—parents, teachers, and more importantly, professional engineers, startup founders, and university professors. Every single project received genuine interest and encouragement.\n\n**"I came expecting a nice school event,"** said tech executive David Park. **"I\'m leaving knowing that the next generation is going to change the world. These kids are READY."**\n\n## What This Means\n\nSeveral students were offered summer internships. Two projects were recommended for state-level competitions. But more importantly? These students learned that their ideas matter. That their work has value. That they CAN make a difference.\n\n**This is STEM education done right. This is Bulldog Excellence.**\n\n**#FutureInnovators #BulldogSTEM #IdeaBigAct**',
    featured_image_url: 'https://via.placeholder.com/1200x600/0ea5e9/1e3a5f?text=STEM+Showcase+Innovation',
    category_ids: '["academics", "stem"]',
    author_ids: '[]',
    status: 'published',
    publish_status: 'published',
    visibility: 'public',
    featured: false,
    school_slug: HAMPTON_DUMONT_SLUG,
    published_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    title: 'Bulldogs Lead: Students Plant 250 Trees, Inspire District Change',
    slug: 'student-council-service-day',
    excerpt: 'When 80 H-D students showed up on a cold Saturday, they didn\'t just plant trees—they planted the seeds of community impact.',
    body: '# Bulldogs Lead the Way: Service Day Creates Lasting Change\n\nWith shovels in hand and determination in their hearts, 80 Hampton-Dumont students showed up on Saturday morning to do something remarkable. By day\'s end, they had planted 250 native trees and shrubs across three locations in our community.\n\n## The Story Behind the Service\n\nStudent Body President Alex Rodriguez felt frustrated watching environmental challenges ignored. So he did something about it.\n\n**"I realized we didn\'t have to wait for adults to make a difference,"** Alex said. **"We ARE the future. We could start today."\n\n## What Happened\n\n- 80 student volunteers gave their Saturday\n- 250 trees planted across 3 community sites\n- 15+ parent and staff volunteers\n- $3,000 in community donations to fund the project\n- Adoption of the trees by student groups for ongoing stewardship\n\n## The Real Impact\n\nCity Mayor Jennifer Thompson attended the event and made an announcement: Hampton-Dumont students would lead a district-wide environmental initiative next fall. Our Bulldogs are now official partners in shaping our community\'s green future.\n\n**"Your parents should be incredibly proud,"** the Mayor said to the students. **"You\'re showing us what community leadership looks like."**\n\n## What\'s Next?\n\nThe student council is already planning spring clean-up days, river restoration projects, and a "One Bulldog, One Tree" campaign where every graduating senior plants a tree.\n\n**This is what it means to be a Bulldog: leaders, changemakers, community builders.**\n\n**#BulldogCommunity #ServiceWithPurpose #LeadByExample**',
    featured_image_url: 'https://via.placeholder.com/1200x600/22c55e/ffffff?text=Students+Making+Impact',
    category_ids: '["community", "leadership"]',
    author_ids: '[]',
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