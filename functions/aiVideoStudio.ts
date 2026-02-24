import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const HEYGEN_API_KEY = Deno.env.get("Heygen") || Deno.env.get("HEYGEN_API_KEY");

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
  console.log("[HeyGen Avatar Response]", JSON.stringify(data, null, 2));
  if (!data.data?.video_id) throw new Error(`HeyGen error: ${data.message || JSON.stringify(data)}`);
  return data.data.video_id;
}

async function createSlideVideo({ slides, voiceId, script, format = "16:9" }) {
  const dimension = format === "9:16" ? { width: 720, height: 1280 } :
                    format === "1:1"  ? { width: 720, height: 720 } :
                                        { width: 1280, height: 720 };
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
  console.log("[HeyGen Slide Response]", JSON.stringify(data, null, 2));
  if (!data.data?.video_id) throw new Error(`HeyGen error: ${data.message || JSON.stringify(data)}`);
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
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    
    if (!HEYGEN_API_KEY) {
      return Response.json({ error: "HeyGen API key not configured" }, { status: 400 });
    }

    const { action, ...params } = await req.json();

    if (action === "generate_script") {
      const { prompt, content, topic, duration = "30s", format = "16:9" } = params;
      const wordCount = duration === "15s" ? 40 : duration === "30s" ? 75 : 150;
      const orientation = format === "9:16" ? "vertical short-form (TikTok/Reels style)" : "horizontal promotional";
      const userPrompt = prompt || `Write a promotional video script about: ${topic || content || "our business"}`;
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert short-form video scriptwriter for promotional business videos.
Write a compelling, conversational script that works for AI avatar presenters.
Keep it under ${wordCount} words. No stage directions. Just the spoken words.
Style: ${orientation}.

${userPrompt}`
      });
      return Response.json({ script: result });
    }

    if (action === "generate_slide_ideas") {
      const { script, slideCount = 5 } = params;
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a visual designer creating slide concepts for a promotional video.
Given this script, return exactly ${slideCount} slide objects as a JSON array.
Each slide must have:
- "title": short text overlay (max 8 words)
- "caption": brief supporting text (max 15 words)
- "image_prompt": detailed image generation prompt for the background
- "duration": seconds this slide should show

Script: ${script}

Return ONLY a valid JSON array, no markdown, no explanation.`,
        response_json_schema: {
          type: "object",
          properties: {
            slides: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  caption: { type: "string" },
                  image_prompt: { type: "string" },
                  duration: { type: "number" }
                }
              }
            }
          }
        }
      });
      return Response.json({ slides: result.slides || [] });
    }

    if (action === "generate_slide_image") {
      const { prompt } = params;
      const result = await base44.integrations.Core.GenerateImage({
        prompt: `Professional promotional photo for business video: ${prompt}. High quality, vibrant, suitable for marketing.`
      });
      return Response.json({ url: result.url });
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
      const { script, avatarId, voiceId, format, duration, title, videoType, slides, musicTrackUrl, musicGenerationPrompt, captions, overlays } = params;
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
        status: "Rendering",
        music_track_url: musicTrackUrl || null,
        music_generation_prompt: musicGenerationPrompt || null,
        caption: captions ? JSON.stringify(captions) : null,
        notes: overlays ? JSON.stringify(overlays) : null
      });
      return Response.json({ video_id: heygenVideoId, record_id: record.id });
    }

    if (action === "check_status") {
      const { heygenVideoId, recordId } = params;
      const status = await getVideoStatus(heygenVideoId);
      const heygenStatus = status.status; // "pending", "processing", "completed", "failed"

      if (heygenStatus === "completed" && status.video_url) {
        await base44.entities.VideoRequests.update(recordId, {
          render_status: "done",
          render_output_url: status.video_url,
          status: "Needs Review"
        });
      } else if (heygenStatus === "failed") {
        await base44.entities.VideoRequests.update(recordId, {
          render_status: "failed",
          status: "Draft",
          render_error: status.error || "Rendering failed"
        });
      } else if (heygenStatus === "processing" || heygenStatus === "pending") {
        await base44.entities.VideoRequests.update(recordId, {
          render_status: "rendering"
        });
      }
      return Response.json({ status: heygenStatus, video_url: status.video_url });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});