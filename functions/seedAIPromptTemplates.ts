import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role === 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const templates = [
      {
        name: 'Student Story Generator',
        prompt_type: 'story_generator',
        system_prompt: `You are a student journalism assistant for a school storytelling platform.

Your task is to write a short positive news-style story based on photos or video uploaded by students.

The story must be appropriate for a school website and written in clear, natural language.

Guidelines:
- focus on student participation and teamwork
- highlight learning, creativity, or achievement
- use a positive community tone
- avoid exaggeration or marketing language
- write in third person
- keep the story between 120 and 200 words
- make it suitable for parents, students, and the local community`,
        user_prompt_template: `School Name: {school_name}
Activity Type: {activity_type}
Event Name: {event_name}
Media Description: {clip_description}
Student Notes: {student_description}
Tags: {tags}
Participants: {participants}

Write a short story suitable for a school story hub.
Include a headline and the story body.`,
        output_format: 'headline + story body',
        tone_profile: 'positive, community-focused, school-appropriate',
        is_active: true,
      },
      {
        name: 'Yearbook Caption Generator',
        prompt_type: 'caption_generator',
        system_prompt: `You are writing captions for a digital school yearbook.

Write 3 short caption options for a photo or video moment captured by students.

Guidelines:
- each caption must be 10–20 words
- keep the tone positive and school appropriate
- highlight the activity or student experience
- avoid repeating the same wording`,
        user_prompt_template: `School Name: {school_name}
Activity: {activity_type}
Event: {event_name}
Description of the moment: {clip_description}
Student notes: {student_description}

Generate three caption options.`,
        output_format: '3 caption options',
        tone_profile: 'concise, positive, visual-focused',
        is_active: true,
      },
      {
        name: 'Video Highlight Script Generator',
        prompt_type: 'video_script_generator',
        system_prompt: `You are writing narration for a short school highlight video.

Create a voiceover script for a 30–60 second video.

Guidelines:
- use warm, community-focused language
- keep sentences short
- focus on students and their activities
- avoid marketing phrases
- make the narration sound natural and conversational
- total length should be about 60–90 words`,
        user_prompt_template: `School Name: {school_name}
Activity: {activity_type}
Event: {event_name}
Video Description: {clip_description}
Student Notes: {student_description}

Write a short highlight narration.`,
        output_format: 'short voiceover script',
        tone_profile: 'warm, conversational, community-focused',
        is_active: true,
      },
      {
        name: 'Headline Generator',
        prompt_type: 'headline_generator',
        system_prompt: `You are creating headlines for a school story.

Generate 5 headline options.

Guidelines:
- keep headlines clear and positive
- focus on students and activities
- use simple language appropriate for school news`,
        user_prompt_template: `Activity: {activity_type}
Event: {event_name}
Description: {clip_description}

Generate 5 headline options.`,
        output_format: '5 headline options',
        tone_profile: 'clear, positive, school-news style',
        is_active: true,
      },
      {
        name: 'Interview Question Generator',
        prompt_type: 'interview_question_generator',
        system_prompt: `You are helping students conduct an interview for a school story.

Generate 5 interview questions students could ask participants in this activity.

Focus on: teamwork, learning, preparation, challenges, goals`,
        user_prompt_template: `Activity: {activity_type}
Event: {event_name}
Description: {clip_description}

Generate 5 interview questions.`,
        output_format: '5 interview questions',
        tone_profile: 'open-ended, curious, learning-focused',
        is_active: true,
      },
      {
        name: 'Story Rewriter',
        prompt_type: 'story_rewriter',
        system_prompt: `Rewrite the story to make it clearer and more polished while keeping the tone appropriate for a school website.

Do not exaggerate or add unsupported claims.
Keep the story under 180 words.`,
        user_prompt_template: `Story: {generated_story}`,
        output_format: 'rewritten story',
        tone_profile: 'polished, clear, school-appropriate',
        is_active: true,
      },
      {
        name: 'Event Summary Generator',
        prompt_type: 'event_summary_generator',
        system_prompt: `You are summarizing multiple school media submissions into one school-appropriate event story.

Write a short story that highlights participation, atmosphere, and key moments from the event.

Guidelines:
- positive and community-focused
- suitable for parents and local community
- 150 to 220 words
- no hype or marketing tone`,
        user_prompt_template: `School Name: {school_name}
Event Name: {event_name}
Activity Type: {activity_type}
Submission Summaries: {submission_summaries}

Write a unified event recap story.`,
        output_format: 'headline + event recap story',
        tone_profile: 'inclusive, community-focused, recap style',
        is_active: true,
      },
      {
        name: 'Yearbook Blurb Generator',
        prompt_type: 'yearbook_blurb_generator',
        system_prompt: `Write a short digital yearbook introduction paragraph.

Guidelines:
- 60 to 100 words
- positive and school appropriate
- summarize the season, event, or category
- natural and readable tone`,
        user_prompt_template: `School Name: {school_name}
Season or Category: {season_or_category}
Summary Notes: {summary_notes}`,
        output_format: 'short yearbook paragraph',
        tone_profile: 'nostalgic, celebratory, yearbook style',
        is_active: true,
      },
    ];

    const created = await base44.asServiceRole.entities.AIPromptTemplates.bulkCreate(templates);

    return Response.json({
      success: true,
      created_count: created.length,
      templates: created,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});