import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const PROMPTS = {
  story: `You are a student journalism assistant for a school storytelling platform.

Your task is to write a short positive news-style story based on photos or video uploaded by students.

The story must be appropriate for a school website and written in clear, natural language.

Guidelines:
• Focus on student participation and teamwork
• Highlight learning, creativity, or achievement
• Use a positive community tone
• Avoid exaggeration or marketing language
• Write in third person
• Keep the story between 120 and 200 words
• Make it suitable for parents, students, and the local community

Use the information below to generate the story.

School Name: {school_name}
Activity Type: {activity_type}
Event Name: {event_name}
Media Description: {clip_description}
Student Notes: {student_description}
Tags: {tags}
Participants: {participants}

Write a short story suitable for a school story hub.
Include a headline and the story body in this format:

HEADLINE
[Your headline here]

STORY
[Your story body here]`,

  captions: `You are writing captions for a digital school yearbook.

Write 3 short caption options for a photo or video moment captured by students.

Guidelines:
• Each caption must be 10–20 words
• Keep the tone positive and school appropriate
• Highlight the activity or student experience
• Avoid repeating the same wording

Use the information below.

School Name: {school_name}
Activity: {activity_type}
Event: {event_name}
Description of the moment: {clip_description}
Student notes: {student_description}

Generate three caption options in this format:

CAPTION 1
[Caption text]

CAPTION 2
[Caption text]

CAPTION 3
[Caption text]`,

  videoScript: `You are writing narration for a short school highlight video.

Create a voiceover script for a 30–60 second video.

Guidelines:
• Use warm, community-focused language
• Keep sentences short
• Focus on students and their activities
• Avoid marketing phrases
• Make the narration sound natural and conversational
• Total length should be about 60–90 words

Use the following information.

School Name: {school_name}
Activity: {activity_type}
Event: {event_name}
Video Description: {clip_description}
Student Notes: {student_description}

Write a short highlight narration:`,

  headlines: `You are creating headlines for a school story.

Generate 5 headline options for the story below.

Guidelines:
• Keep headlines clear and positive
• Focus on students and activities
• Use simple language appropriate for school news

Activity: {activity_type}
Event: {event_name}
Description: {clip_description}

Generate 5 headline options in this format:

HEADLINE 1
[Text]

HEADLINE 2
[Text]

HEADLINE 3
[Text]

HEADLINE 4
[Text]

HEADLINE 5
[Text]`,

  questions: `You are helping students conduct an interview for a school story.

Generate 5 interview questions students could ask participants in this activity.

Activity: {activity_type}
Event: {event_name}

Focus on questions about:
• teamwork
• learning
• preparation
• challenges
• goals

Generate 5 interview questions in this format:

QUESTION 1
[Text]

QUESTION 2
[Text]

QUESTION 3
[Text]

QUESTION 4
[Text]

QUESTION 5
[Text]`,
};

function interpolatePrompt(template, data) {
  let prompt = template;
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    prompt = prompt.replace(new RegExp(placeholder, 'g'), value || '');
  });
  return prompt;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      school_name,
      activity_type,
      event_name,
      upload_type,
      clip_description,
      student_description,
      tags,
      participants,
    } = body;

    const data = {
      school_name: school_name || '',
      activity_type: activity_type || '',
      event_name: event_name || '',
      upload_type: upload_type || '',
      clip_description: clip_description || '',
      student_description: student_description || '',
      tags: Array.isArray(tags) ? tags.join(', ') : tags || '',
      participants: participants || '',
    };

    // Generate all content types in parallel
    const results = await Promise.all([
      // Story
      base44.integrations.Core.InvokeLLM({
        prompt: interpolatePrompt(PROMPTS.story, data),
      }),

      // Captions
      base44.integrations.Core.InvokeLLM({
        prompt: interpolatePrompt(PROMPTS.captions, data),
      }),

      // Video Script
      base44.integrations.Core.InvokeLLM({
        prompt: interpolatePrompt(PROMPTS.videoScript, data),
      }),

      // Headlines
      base44.integrations.Core.InvokeLLM({
        prompt: interpolatePrompt(PROMPTS.headlines, data),
      }),

      // Interview Questions
      base44.integrations.Core.InvokeLLM({
        prompt: interpolatePrompt(PROMPTS.questions, data),
      }),
    ]);

    return Response.json({
      school_name,
      activity_type,
      event_name,
      generatedContent: {
        story: results[0],
        captions: results[1],
        videoScript: results[2],
        headlines: results[3],
        interviewQuestions: results[4],
      },
      status: 'success',
    });
  } catch (error) {
    console.error('Error generating story content:', error);
    return Response.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
});