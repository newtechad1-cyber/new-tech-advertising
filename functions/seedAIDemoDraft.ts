import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Create sample AI jobs and outputs for demo
    const demoJobs = [
      {
        job_type: 'generate_story',
        source_entity_type: 'SchoolSubmissions',
        source_entity_id: 'robotics-001',
        status: 'completed',
        prompt_template_id: 'story-gen',
        input_payload_json: JSON.stringify({
          school_name: 'Hampton-Dumont High School',
          activity_type: 'Robotics Competition Build Day',
          event_name: 'Regional Robotics Championship Prep',
          clip_description: 'Students assembling robot chassis and testing mechanics',
          student_description: 'Team working hard to get ready for regionals',
          tags: 'robotics, STEM, engineering',
          participants: 'Robotics Club Members',
        }),
        output_text: `Robotics Team Prepares for Regional Competition

Students in the Hampton-Dumont High School robotics club recently gathered in the lab to continue building and testing their competition robot. Working together, team members adjusted the robot's wheels, suspension system, and programming to improve performance ahead of the upcoming regional competition.

The team spent the afternoon troubleshooting mechanical issues and testing different configurations. "It takes all of us working as a team to get this right," said one student involved in the testing. The project gives students the chance to apply engineering and problem-solving skills while collaborating with classmates toward a shared goal.

The team will compete in the regional robotics challenge next month.`,
        moderation_status: 'approved',
      },
      {
        job_type: 'generate_captions',
        source_entity_type: 'SchoolSubmissions',
        source_entity_id: 'robotics-001',
        status: 'completed',
        prompt_template_id: 'caption-gen',
        moderation_status: 'approved',
        output_text: `Students test their competition robot in the lab. Robotics team members collaborate on a mechanical adjustment. Team members work together to improve robot performance.`,
      },
      {
        job_type: 'generate_video_script',
        source_entity_type: 'SchoolSubmissions',
        source_entity_id: 'football-001',
        status: 'completed',
        prompt_template_id: 'video-script-gen',
        moderation_status: 'approved',
        output_text: `Students at Hampton-Dumont High School showed incredible spirit at Friday night's football game. The team played with energy and determination on every play. Our athletes work hard in practice and on game day to represent their school with pride. Friday night under the lights—that's what Bulldog football is all about.`,
      },
      {
        job_type: 'generate_headlines',
        source_entity_type: 'SchoolSubmissions',
        source_entity_id: 'choir-001',
        status: 'completed',
        prompt_template_id: 'headline-gen',
        moderation_status: 'approved',
        output_text: `Choir Performs Spring Concert to Packed Audience. Hampton-Dumont Singers Showcase Talent and Harmony. Spring Concert Highlights Excellence in Music. Voices United: Choir Delivers Memorable Performance. Students Bring Music to Life in Spring Concert.`,
      },
      {
        job_type: 'generate_story',
        source_entity_type: 'SchoolSubmissions',
        source_entity_id: 'stem-001',
        status: 'completed',
        prompt_template_id: 'story-gen',
        moderation_status: 'pending_review',
        output_text: `STEM Showcase Celebrates Student Innovation

The annual Hampton-Dumont STEM Showcase brought together students from across grade levels to demonstrate their projects and discoveries. From robotics to environmental science, students displayed the breadth of their learning and creativity.

Visitors walked through displays featuring everything from engineering challenges to biological research. Each student explained their project and the learning process behind it. Parents and community members were impressed by the depth of work and the enthusiasm students brought to their presentations.

The showcase celebrates the school's commitment to science, technology, engineering, and mathematics education. It gives students a chance to showcase their skills and inspire others to pursue STEM fields.`,
      },
    ];

    const created = await base44.asServiceRole.entities.AIContentJobs.bulkCreate(demoJobs);

    return Response.json({
      success: true,
      created_count: created.length,
      jobs: created,
    });
  } catch (error) {
    console.error('Seed demo error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});