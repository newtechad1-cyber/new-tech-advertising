import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const PROMPT_TEMPLATES = {
  story_generator: {
    system: `You are a student journalism assistant for a school storytelling platform.

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
    
    user: `School Name: {school_name}
Activity Type: {activity_type}
Event Name: {event_name}
Media Description: {clip_description}
Student Notes: {student_description}
Tags: {tags}
Participants: {participants}

Write a short story suitable for a school story hub. Include a headline and the story body.

Format as:
HEADLINE
[Your headline here]

STORY
[Your story body here]`,
  },

  caption_generator: {
    system: `You are writing captions for a digital school yearbook.

Write 3 short caption options for a photo or video moment captured by students.

Guidelines:
- each caption must be 10–20 words
- keep the tone positive and school appropriate
- highlight the activity or student experience
- avoid repeating the same wording`,
    
    user: `School Name: {school_name}
Activity: {activity_type}
Event: {event_name}
Description: {clip_description}
Student notes: {student_description}

Generate three caption options in this format:

CAPTION 1
[Text]

CAPTION 2
[Text]

CAPTION 3
[Text]`,
  },

  video_script_generator: {
    system: `You are writing narration for a short school highlight video.

Create a voiceover script for a 30–60 second video.

Guidelines:
- use warm, community-focused language
- keep sentences short
- focus on students and their activities
- avoid marketing phrases
- make the narration sound natural and conversational
- total length should be about 60–90 words`,
    
    user: `School Name: {school_name}
Activity: {activity_type}
Event: {event_name}
Video Description: {clip_description}
Student Notes: {student_description}

Write a short highlight narration.`,
  },

  headline_generator: {
    system: `You are creating headlines for a school story.

Generate 5 headline options.

Guidelines:
- keep headlines clear and positive
- focus on students and activities
- use simple language appropriate for school news`,
    
    user: `Activity: {activity_type}
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
  },

  interview_question_generator: {
    system: `You are helping students conduct an interview for a school story.

Generate 5 interview questions students could ask participants in this activity.

Focus on: teamwork, learning, preparation, challenges, goals`,
    
    user: `Activity: {activity_type}
Event: {event_name}
Description: {clip_description}

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
  },

  story_rewriter: {
    system: `Rewrite the story to make it clearer and more polished while keeping the tone appropriate for a school website.

Do not exaggerate or add unsupported claims.
Keep the story under 180 words.`,
    
    user: `Story: {generated_story}`,
  },

  event_summary_generator: {
    system: `You are summarizing multiple school media submissions into one school-appropriate event story.

Write a short story that highlights participation, atmosphere, and key moments from the event.

Guidelines:
- positive and community-focused
- suitable for parents and local community
- 150 to 220 words
- no hype or marketing tone`,
    
    user: `School Name: {school_name}
Event Name: {event_name}
Activity Type: {activity_type}
Submission Summaries: {submission_summaries}

Write a unified event recap story. Format as:
HEADLINE
[Your headline]

STORY
[Your story body]`,
  },

  yearbook_blurb_generator: {
    system: `Write a short digital yearbook introduction paragraph.

Guidelines:
- 60 to 100 words
- positive and school appropriate
- summarize the season, event, or category
- natural and readable tone`,
    
    user: `School Name: {school_name}
Season or Category: {season_or_category}
Summary Notes: {summary_notes}`,
  },
};

function interpolatePrompt(template, variables) {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value || '');
  });
  return result;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { job_id } = await req.json();

    // Fetch the job
    const jobs = await base44.asServiceRole.entities.AIContentJobs.filter({
      id: job_id,
    });

    if (!jobs || jobs.length === 0) {
      return Response.json({ error: 'Job not found' }, { status: 404 });
    }

    const job = jobs[0];

    // Fetch the template
    const templates = await base44.asServiceRole.entities.AIPromptTemplates.filter({
      id: job.prompt_template_id,
    });

    if (!templates || templates.length === 0) {
      return Response.json({ error: 'Template not found' }, { status: 404 });
    }

    const template = templates[0];
    const inputPayload = JSON.parse(job.input_payload_json || '{}');

    // Get template prompts
    const promptConfig = PROMPT_TEMPLATES[template.prompt_type];
    if (!promptConfig) {
      throw new Error(`Unknown prompt type: ${template.prompt_type}`);
    }

    const userPrompt = interpolatePrompt(promptConfig.user, inputPayload);

    // Call LLM
    const aiResponse = await base44.integrations.Core.InvokeLLM({
      prompt: userPrompt,
    });

    // Parse output
    let parsedOutput = {};
    const outputText = aiResponse;

    if (template.prompt_type === 'story_generator' || template.prompt_type === 'event_summary_generator') {
      const headlineMatch = outputText.match(/HEADLINE\s*\n(.*?)\n\nSTORY\s*\n(.*)/s);
      if (headlineMatch) {
        parsedOutput.title = headlineMatch[1].trim();
        parsedOutput.body = headlineMatch[2].trim();
      }
    } else if (template.prompt_type === 'caption_generator') {
      const captions = [];
      const captionRegex = /CAPTION \d+\s*\n(.*?)(?=\n\nCAPTION|\n*$)/gs;
      let match;
      while ((match = captionRegex.exec(outputText)) !== null) {
        captions.push(match[1].trim());
      }
      parsedOutput.caption_options = JSON.stringify(captions.slice(0, 3));
    } else if (template.prompt_type === 'headline_generator') {
      const headlines = [];
      const headlineRegex = /HEADLINE \d+\s*\n(.*?)(?=\n\nHEADLINE|\n*$)/gs;
      let match;
      while ((match = headlineRegex.exec(outputText)) !== null) {
        headlines.push(match[1].trim());
      }
      parsedOutput.headline_options = JSON.stringify(headlines.slice(0, 5));
    } else if (template.prompt_type === 'interview_question_generator') {
      const questions = [];
      const questionRegex = /QUESTION \d+\s*\n(.*?)(?=\n\nQUESTION|\n*$)/gs;
      let match;
      while ((match = questionRegex.exec(outputText)) !== null) {
        questions.push(match[1].trim());
      }
      parsedOutput.interview_questions = JSON.stringify(questions.slice(0, 5));
    } else if (template.prompt_type === 'video_script_generator' || template.prompt_type === 'story_rewriter' || template.prompt_type === 'yearbook_blurb_generator') {
      parsedOutput.body = outputText.trim();
    }

    // Create AIContentOutputs record
    const output = await base44.asServiceRole.entities.AIContentOutputs.create({
      ai_job_id: job.id,
      output_type: template.prompt_type.replace('_generator', '').replace('_rewriter', ''),
      ...parsedOutput,
    });

    // Update job status
    await base44.asServiceRole.entities.AIContentJobs.update(job.id, {
      status: 'completed',
      output_text: outputText,
      output_payload_json: JSON.stringify(parsedOutput),
      moderation_status: 'pending_review',
    });

    return Response.json({
      job_id: job.id,
      status: 'completed',
      output_id: output.id,
      preview: parsedOutput,
    });
  } catch (error) {
    console.error('AI Content Job Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});