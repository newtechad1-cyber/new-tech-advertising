import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { schoolSlug } = await req.json();

    if (!schoolSlug) {
      return Response.json({ error: 'Missing schoolSlug' }, { status: 400 });
    }

    const templates = [
      {
        school_slug: schoolSlug,
        name: 'Story Generator',
        template_type: 'story_generator',
        system_prompt: 'You are a creative writer for a school newspaper. Write engaging, positive stories about student and staff achievements. Keep tone warm and inspirational. Focus on the human interest angle.',
        user_prompt_template: 'Write a compelling story about: {title}. Context: {description}. Submissions/content: {content}. Keep it 300-400 words.',
        output_format: 'text',
        tone: 'warm',
        max_tokens: 500,
        temperature: 0.8,
        is_active: true,
      },
      {
        school_slug: schoolSlug,
        name: 'Caption Generator',
        template_type: 'caption_generator',
        system_prompt: 'Generate short, engaging captions for school social media and video content. Be energetic and positive. Captions should be 1-2 sentences.',
        user_prompt_template: 'Generate 3 different captions for: {title}. Context: {description}. Return as JSON array of strings.',
        output_format: 'array',
        tone: 'energetic',
        max_tokens: 300,
        temperature: 0.9,
        is_active: true,
      },
      {
        school_slug: schoolSlug,
        name: 'Video Script Generator',
        template_type: 'video_script_generator',
        system_prompt: 'Write short, punchy video scripts for school videos. Use active voice. Include natural transitions. Keep pacing energetic.',
        user_prompt_template: 'Write a {duration} video script about {title}. Key points: {description}. Make it engaging for students and families.',
        output_format: 'text',
        tone: 'energetic',
        max_tokens: 600,
        temperature: 0.85,
        is_active: true,
      },
      {
        school_slug: schoolSlug,
        name: 'Headline Generator',
        template_type: 'headline_generator',
        system_prompt: 'Generate compelling headlines for school stories and events. Make them newsworthy and engaging. Should grab attention.',
        user_prompt_template: 'Generate 5 different headlines for a story about: {title}. Context: {description}. Return as JSON array of strings.',
        output_format: 'array',
        tone: 'professional',
        max_tokens: 200,
        temperature: 0.8,
        is_active: true,
      },
      {
        school_slug: schoolSlug,
        name: 'Interview Question Generator',
        template_type: 'interview_question_generator',
        system_prompt: 'Generate thoughtful interview questions for student spotlights and features. Questions should be open-ended and encourage interesting responses.',
        user_prompt_template: 'Generate 5 interview questions for a student/staff spotlight about: {subject_name}. Topic: {topic}. Return as JSON array of strings.',
        output_format: 'array',
        tone: 'warm',
        max_tokens: 400,
        temperature: 0.8,
        is_active: true,
      },
      {
        school_slug: schoolSlug,
        name: 'Story Rewriter',
        template_type: 'story_rewriter',
        system_prompt: 'Improve and rewrite school stories to be more engaging, clearer, and more professional. Keep the original facts and message. Enhance readability and impact.',
        user_prompt_template: 'Improve this story about {topic}: {original_text}. Make it more engaging while keeping all facts accurate.',
        output_format: 'text',
        tone: 'warm',
        max_tokens: 600,
        temperature: 0.7,
        is_active: true,
      },
      {
        school_slug: schoolSlug,
        name: 'Event Summary Generator',
        template_type: 'event_summary_generator',
        system_prompt: 'Write concise, engaging summaries of school events. Capture the spirit and highlights. 150-200 words.',
        user_prompt_template: 'Write a summary of the {event_name} event that happened on {event_date}. Key details: {event_details}.',
        output_format: 'text',
        tone: 'warm',
        max_tokens: 300,
        temperature: 0.75,
        is_active: true,
      },
      {
        school_slug: schoolSlug,
        name: 'Yearbook Blurb Generator',
        template_type: 'yearbook_blurb_generator',
        system_prompt: 'Write inspiring, celebratory yearbook introductions and section blurbs. Should feel timeless and meaningful. 100-150 words.',
        user_prompt_template: 'Write a yearbook intro blurb for {title}. School year: {school_year}. Themes: {themes}.',
        output_format: 'text',
        tone: 'inspirational',
        max_tokens: 250,
        temperature: 0.75,
        is_active: true,
      },
    ];

    for (const template of templates) {
      await base44.asServiceRole.entities.AIPromptTemplates.create(template);
    }

    return Response.json({
      success: true,
      message: `Seeded ${templates.length} AI prompt templates`,
      templates_created: templates.length,
    });
  } catch (error) {
    console.error('Error seeding prompt templates:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});