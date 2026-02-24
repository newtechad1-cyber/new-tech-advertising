import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import OpenAI from 'npm:openai';

const HEYGEN_API_KEY = Deno.env.get("Heygen") || Deno.env.get("HEYGEN_API_KEY");

async function generateScript({ prompt, content, topic, duration = "30s", format = "16:9" }) {
  const wordCount = duration === "15s" ? 40 : duration === "30s" ? 75 : 150;
  const orientation = format === "9:16" ? "vertical short-form (TikTok/Reels style)" : "horizontal promotional";
  const systemPrompt = `You are an expert short-form video scriptwriter for promotional business videos. 
Write compelling, conversational scripts that work for AI avatar presenters.
Keep it under ${wordCount} words. No stage directions. Just the spoken words.
Style: ${orientation}.`;
  const userPrompt = prompt || `Write a promotional video script about: ${topic || content || "our business"}`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }]
  });
  return completion.choices[0].message.content.trim();
}

async function generateSlideIdeas({ script, slideCount = 5 }) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a visual designer creating slide concepts for a promotional video. 
Given a video script, return a JSON array of ${slideCount} slide objects. Each slide has:
- "title": short text overlay (max 8 words)
- "caption": brief supporting text (max 15 words)
- "image_prompt": detailed DALL-E image generation prompt for the background image
- "duration": seconds this slide should show (distribute total evenly)
Return ONLY valid JSON array, no markdown.`
      },
      { role: "user", content: `Script: ${script}\nCreate ${slideCount} slides.` }
    ]
  });
  const raw = completion.choices[0].message.content.trim();
  return JSON.parse(raw);
}

async function generateSlideImage({ prompt }) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `Professional promotional photo for business video: ${prompt}. High quality, vibrant, suitable for marketing.`,
    n: 1,
    size: "1792x1024"
  });
  return response.data[0].url;
}

async function getAvatars() {
  const res = await fetch("https://api.heygen.com/v2/avatars", {
    headers: { "x-api-key": HEYGEN_API_KEY }
  });
  const data = await res.json();
  return data.data?.avatars || [];
}

async function getVoices() {
  const res = await fetch("https://api.heygen.com/v2/voices", {
    headers: { "x-api-key": HEYGEN_API_KEY }
  });
  const data = await res.json();
  return data.data?.voices || [];
}

async function createAvatarVideo({ script, avatarId, voiceId, format = "16:9" }) {
  const dimension = format === "9:16" ? { width: 720, height: 1280 } :
                    format === "1:1"  ? { width: 720, height: 720 } :
                                        { width: 1280, height: 720 };
  const body = {
    video_inputs: [{
      character: { type: "avatar", avatar_id: avatarId, avatar_style: "normal" },
      voice: { type: "text", input_text: script, voice_id: voiceId }
    }],
    dimension,
    test: false
  };
  const res = await fetch("https://api.heygen.com/v2/video/generate", {
    method: "POST",
    headers: { "x-api-key": HEYGEN_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!data.data?.video_id) throw new Error(data.message || "Failed to create HeyGen video");
  return data.data.video_id;
}

async function createSlideVideo({ slides, voiceId, script, format = "16:9" }) {
  // HeyGen slideshow-style video with images + voiceover
  const dimension = format === "9:16" ? { width: 720, height: 1280 } :
                    format === "1:1"  ? { width: 720, height: 720 } :
                                        { width: 1280, height: 720 };

  const video_inputs = slides.map((slide) => ({
    character: {
      type: "talking_photo",
      talking_photo_id: null
    },
    voice: {
      type: "text",
      input_text: slide.narration || slide.caption || slide.title,
      voice_id: voiceId
    },
    background: slide.image_url ? {
      type: "image",
      url: slide.image_url
    } : {
      type: "color",
      value: "#1e3a5f"
    }
  }));

  // Fall back to single-scene with full script if slides don't have narration chunks
  const body = {
    video_inputs: [{
      character: { type: "text_only" },
      voice: { type: "text", input_text: script, voice_id: voiceId },
      background: slides[0]?.image_url ? {
        type: "image",
        url: slides[0].image_url
      } : { type: "color", value: "#1e3a5f" }
    }],
    dimension,
    test: false
  };

  const res = await fetch("https://api.heygen.com/v2/video/generate", {
    method: "POST",
    headers: { "x-api-key": HEYGEN_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!data.data?.video_id) throw new Error(data.message || "Failed to create HeyGen slide video");
  return data.data.video_id;
}

async function getVideoStatus(videoId) {
  const res = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
    headers: { "x-api-key": HEYGEN_API_KEY }
  });
  const data = await res.json();
  return data.data || {};
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { action, ...params } = await req.json();

  if (action === "generate_script") {
    const script = await generateScript(params);
    return Response.json({ script });
  }

  if (action === "generate_slide_ideas") {
    const slides = await generateSlideIdeas(params);
    return Response.json({ slides });
  }

  if (action === "generate_slide_image") {
    const url = await generateSlideImage(params);
    return Response.json({ url });
  }

  if (action === "get_avatars") {
    const avatars = await getAvatars();
    return Response.json({ avatars });
  }

  if (action === "get_voices") {
    const voices = await getVoices();
    return Response.json({ voices });
  }

  if (action === "create_video") {
    const { script, avatarId, voiceId, format, duration, title, videoType, slides } = params;
    
    let heygenVideoId;
    if (videoType === "slides") {
      heygenVideoId = await createSlideVideo({ slides, voiceId, script, format });
    } else {
      heygenVideoId = await createAvatarVideo({ script, avatarId, voiceId, format });
    }

    const record = await base44.entities.VideoRequests.create({
      title: title || "AI Generated Video",
      requested_by: user.email,
      format,
      duration,
      script,
      shotlist: slides ? JSON.stringify(slides) : null,
      render_job_id: heygenVideoId,
      render_status: "queued",
      status: "Rendering"
    });

    return Response.json({ video_id: heygenVideoId, record_id: record.id });
  }

  if (action === "check_status") {
    const { heygenVideoId, recordId } = params;
    const status = await getVideoStatus(heygenVideoId);
    if (status.status === "completed" && status.video_url) {
      await base44.entities.VideoRequests.update(recordId, {
        render_status: "done",
        render_output_url: status.video_url,
        status: "Needs Review"
      });
    } else if (status.status === "failed") {
      await base44.entities.VideoRequests.update(recordId, {
        render_status: "failed",
        status: "Draft",
        render_error: status.error || "Rendering failed"
      });
    }
    return Response.json({ status: status.status, video_url: status.video_url });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
});