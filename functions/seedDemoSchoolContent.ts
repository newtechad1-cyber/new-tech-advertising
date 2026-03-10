import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // First, create the demo school branding
    await base44.asServiceRole.entities.DemoSchoolBranding.create({
      school_name: 'North Valley High School',
      mascot: 'Falcons',
      primary_color: '#001a4d',
      secondary_color: '#c0c0c0',
      accent_color: '#0052cc',
      short_description: 'Where Excellence Takes Flight',
      motto: 'Soar Higher Every Day'
    });

    // Seed demo content
    const seedContent = [
      {
        title: 'North Valley Falcons Advance to State Semifinals',
        slug: 'falcons-state-semifinals',
        content_type: 'sports_highlight',
        category: 'basketball',
        summary: 'The girls basketball team clinches regional tournament with dramatic overtime victory.',
        script: `In an electrifying regional tournament final, the North Valley Falcons girls basketball team defeated Lincoln Central 58-56 in overtime. Led by senior captain Maya Rodriguez and junior standout Jennifer Chen, the Falcons executed a perfect final sequence to secure their ticket to the state semifinals. Coach Patricia Williams praised the team's resilience and teamwork. This victory marks the third consecutive year the team has advanced to states.`,
        thumbnail_url: 'https://images.unsplash.com/photo-1546519638-68711109d298?w=800&q=80',
        image_urls: '["https://images.unsplash.com/photo-1546519638-68711109d298?w=800&q=80"]',
        publish_status: 'published',
        featured: true,
        ai_generated: true,
        tags: 'sports,basketball,tournament,state',
        view_count: 1247
      },
      {
        title: 'Meet Alex Park: From Robotics to Innovation',
        slug: 'alex-park-robotics',
        content_type: 'student_spotlight',
        category: 'academics',
        summary: 'Senior robotics team lead designed award-winning autonomous drone system.',
        script: `Senior Alex Park has been leading North Valley's robotics team for the past three years. This year, his team designed and built an autonomous drone system that won the regional innovation championship. Alex credits his teachers and teammates for pushing him to think bigger. After graduation, he'll be attending MIT on a robotics scholarship. His innovation is expected to impact the aerospace industry.`,
        thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
        image_urls: '["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"]',
        publish_status: 'published',
        featured: false,
        ai_generated: true,
        tags: 'students,academics,robotics,achievement',
        view_count: 856
      },
      {
        title: 'North Valley Launches Community Coat Drive',
        slug: 'coat-drive-community',
        content_type: 'school_news',
        category: 'community',
        summary: 'Student council organizes winter support initiative for local families.',
        script: `The North Valley student council has launched a community coat drive to support families in need during the cold months. Students have already donated over 200 coats, and the drive continues through the end of the month. Student body president James Wilson said the initiative reflects the school's commitment to community care. Donations can be dropped off at the main office during school hours.`,
        thumbnail_url: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=800&q=80',
        image_urls: '["https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=800&q=80"]',
        publish_status: 'published',
        featured: false,
        ai_generated: true,
        tags: 'community,service,students,giving',
        view_count: 623
      },
      {
        title: 'Spring Musical "Hamilton" Breaks Box Office Records',
        slug: 'hamilton-musical-success',
        content_type: 'event_story',
        category: 'arts',
        summary: 'Drama club production sells out six-night run with standing ovations.',
        script: `North Valley's drama club production of "Hamilton" has broken school records with a completely sold-out six-night run. Over 2,000 community members attended the performances, featuring a cast of 50 student performers. Director Michael Torres called it the most ambitious production in the school's history. The production will be performed again next year due to overwhelming demand.`,
        thumbnail_url: 'https://images.unsplash.com/photo-1503483384298-af5f4e39d18d?w=800&q=80',
        image_urls: '["https://images.unsplash.com/photo-1503483384298-af5f4e39d18d?w=800&q=80"]',
        publish_status: 'published',
        featured: true,
        ai_generated: true,
        tags: 'arts,drama,performance,events,theater',
        view_count: 2104
      },
      {
        title: 'Debate Team Dominates State Championship',
        slug: 'debate-state-champions',
        content_type: 'club_feature',
        category: 'academics',
        summary: 'Competitive debate squad wins three state titles this season.',
        script: `The North Valley debate team has captured three state championship titles this season, continuing their streak as one of the state's strongest competitive debate programs. Coach Sarah Martinez attributes the success to the team's dedication to research and critical thinking. Individual members also placed in top rankings in policy debate, public forum, and Lincoln-Douglas debate categories.`,
        thumbnail_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        image_urls: '["https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"]',
        publish_status: 'published',
        featured: false,
        ai_generated: true,
        tags: 'academics,debate,competition,achievement,state',
        view_count: 734
      },
      {
        title: 'Principal Weekly Message: Celebrating Excellence',
        slug: 'principal-weekly-message',
        content_type: 'announcement',
        category: 'administration',
        summary: 'Principal highlights recent student and staff achievements.',
        script: `This week, I want to celebrate the incredible achievements of our students and staff. From our state championship debate team to our robotics innovators, from our award-winning drama production to our athletes competing at the highest levels—North Valley is a school where excellence is the norm. I'm proud to be your principal and proud to serve this community.`,
        thumbnail_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        image_urls: '["https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"]',
        publish_status: 'published',
        featured: false,
        ai_generated: true,
        tags: 'announcements,principal,school-wide,achievements',
        view_count: 1891
      }
    ];

    // Set publish dates (spread across recent dates)
    const now = new Date();
    seedContent.forEach((item, index) => {
      const daysAgo = Math.floor(Math.random() * 30);
      const publishDate = new Date(now);
      publishDate.setDate(publishDate.getDate() - daysAgo);
      item.publish_date = publishDate.toISOString();
    });

    // Bulk create content
    await base44.asServiceRole.entities.DemoSchoolContent.bulkCreate(seedContent);

    return Response.json({
      success: true,
      message: 'Demo school branding and content seeded successfully',
      content_count: seedContent.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});