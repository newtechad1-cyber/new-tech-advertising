import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { type } = await req.json();

    const storyIdeas = [
      {
        type: 'sports_highlight',
        title: 'North Valley Falcons Advance to State Semifinals',
        category: 'basketball',
        summary: 'The girls basketball team clinches regional tournament with dramatic overtime victory.',
        script: `In an electrifying regional tournament final, the North Valley Falcons girls basketball team defeated Lincoln Central 58-56 in overtime. Led by senior captain Maya Rodriguez and junior standout Jennifer Chen, the Falcons executed a perfect final sequence to secure their ticket to the state semifinals. Coach Patricia Williams praised the team's resilience and teamwork.`,
        tags: 'sports,basketball,tournament,womens-athletics'
      },
      {
        type: 'student_spotlight',
        title: 'Meet Alex Park: From Robotics to Innovation',
        category: 'academics',
        summary: 'Senior robotics team lead designed award-winning autonomous drone system.',
        script: `Senior Alex Park has been leading North Valley's robotics team for the past three years. This year, his team designed and built an autonomous drone system that won the regional innovation championship. Alex credits his teachers and teammates for pushing him to think bigger. After graduation, he'll be attending MIT on a robotics scholarship.`,
        tags: 'students,academics,robotics,achievement'
      },
      {
        type: 'school_news',
        title: 'North Valley Launches Community Coat Drive',
        category: 'community',
        summary: 'Student council organizes winter support initiative for local families.',
        script: `The North Valley student council has launched a community coat drive to support families in need during the cold months. Students have already donated over 200 coats, and the drive continues through the end of the month. Student body president James Wilson said the initiative reflects the school's commitment to community care.`,
        tags: 'community,service,students'
      },
      {
        type: 'event_story',
        title: 'Spring Musical "Hamilton" Breaks Box Office Records',
        category: 'arts',
        summary: 'Drama club production sells out six-night run with standing ovations.',
        script: `North Valley's drama club production of "Hamilton" has broken school records with a completely sold-out six-night run. Over 2,000 community members attended the performances, featuring a cast of 50 student performers. Director Michael Torres called it the most ambitious production in the school's history.`,
        tags: 'arts,drama,performance,events'
      },
      {
        type: 'club_feature',
        title: 'Debate Team Dominates State Championship',
        category: 'academics',
        summary: 'Competitive debate squad wins three state titles this season.',
        script: `The North Valley debate team has captured three state championship titles this season, continuing their streak as one of the state's strongest competitive debate programs. Coach Sarah Martinez attributes the success to the team's dedication to research and critical thinking.`,
        tags: 'academics,debate,competition,achievement'
      },
      {
        type: 'announcement',
        title: 'Principal Weekly Message: Celebrating Excellence',
        category: 'administration',
        summary: 'Principal highlights recent student and staff achievements.',
        script: `This week, I want to celebrate the incredible achievements of our students and staff. From our state championship debate team to our robotics innovators, from our award-winning drama production to our athletes competing at the highest levels—North Valley is a school where excellence is the norm. I'm proud to be your principal.`,
        tags: 'announcements,principal,school-wide'
      },
      {
        type: 'sports_highlight',
        title: 'Marching Band Takes Home Festival Grand Championship',
        category: 'music',
        summary: 'Falcon band dominates regional marching festival with perfect scores.',
        script: `The North Valley Falcon Marching Band has claimed the grand championship at the regional marching festival, earning perfect scores in visual performance, music, and overall effect. Director John Hernandez praised the students' 10-month commitment to excellence.`,
        tags: 'sports,music,band,performance'
      },
      {
        type: 'student_spotlight',
        title: 'Science Fair Winner Heads to International Competition',
        category: 'academics',
        summary: 'Sophomore researcher wins state science fair with groundbreaking study.',
        script: `Sophomore Emma Thompson has won the state science fair with her groundbreaking research on ocean plastic biodegradation. Her project will now advance to the international science fair in Geneva. Science teacher Dr. Robert Kim mentored Emma throughout the research process.`,
        tags: 'students,science,achievement,research'
      }
    ];

    const randomIdea = storyIdeas[Math.floor(Math.random() * storyIdeas.length)];

    return Response.json(randomIdea);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});