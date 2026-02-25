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
   const voices = data.data?.voices || [];
   // Map HeyGen voice structure to expected format
   return voices.map(v => ({
     voice_id: v.voice_id,
     display_name: (v.name || "").trim(),
     gender: v.gender,
     accent: v.accent,
     language: v.language,
     preview_url: v.preview_audio
   }));
}

async function createAvatarVideo({ script, avatarId, voiceId, format = "16:9", captions = {} }) {
   const dimension = format === "9:16" ? { width: 720, height: 1280 } :
                     format === "1:1"  ? { width: 720, height: 720 } :
                                         { width: 1280, height: 720 };
   const body = {
     video_inputs: [{
       character: { type: "avatar", avatar_id: avatarId, avatar_style: "normal" },
       voice: { type: "text", input_text: script, voice_id: voiceId },
       ...((captions[0] ?? captions["0"]) ? {
         text: {
           type: "text",
           text: captions[0] ?? captions["0"],
           position: { x: 0, y: 0.85 },
           font_size: 24,
           color: "#FFFFFF"
         }
       } : {})
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

async function createProductVideo({ slides, voiceId, script, format = "16:9", captions = {} }) {
   const dimension = format === "9:16" ? { width: 720, height: 1280 } :
                     format === "1:1"  ? { width: 720, height: 720 } :
                                         { width: 1280, height: 720 };

   const video_inputs = slides?.length > 0 ? slides.map((slide, idx) => {
     const captionText = captions[idx] ?? captions[String(idx)] ?? "";
     return {
       background: slide.image_url ? {
         type: "image",
         url: slide.image_url
       } : { type: "color", value: "#ffffff" },
       voice: { type: "text", input_text: slide.caption || slide.title || script, voice_id: voiceId },
       ...(captionText ? { text: { type: "text", text: captionText, position: { x: 0, y: 0.85 }, font_size: 24, line_height: 1.5, color: "#FFFFFF" } } : {})
     };
   }) : [{
     background: { type: "color", value: "#ffffff" },
     voice: { type: "text", input_text: script, voice_id: voiceId },
     ...((captions[0] ?? captions["0"]) ? { text: { type: "text", text: captions[0] ?? captions["0"], position: { x: 0, y: 0.85 }, font_size: 24, line_height: 1.5, color: "#FFFFFF" } } : {})
   }];

   const body = {
     video_inputs,
     dimension,
     test: false
   };

   const res = await fetch("https://api.heygen.com/v2/video/generate", {
     method: "POST",
     headers: { "x-api-key": HEYGEN_API_KEY, "Content-Type": "application/json" },
     body: JSON.stringify(body)
   });
   const data = await res.json();
   console.log("[HeyGen Product Video Response]", JSON.stringify(data, null, 2));
   if (!data.data?.video_id) throw new Error(`HeyGen error: ${JSON.stringify(data)}`);
   return data.data.video_id;
}

async function createAvatarSlidesVideo({ slides, voiceId, script, avatarId, format = "16:9", captions = {} }) {
   const dimension = format === "9:16" ? { width: 720, height: 1280 } :
                     format === "1:1"  ? { width: 720, height: 720 } :
                                         { width: 1280, height: 720 };

   const video_inputs = slides?.length > 0 ? slides.map((slide, idx) => {
     const captionText = captions[idx] ?? captions[String(idx)] ?? "";
     return {
       character: { type: "avatar", avatar_id: avatarId, avatar_style: "normal" },
       background: slide.image_url ? {
         type: "image",
         url: slide.image_url
       } : { type: "color", value: "#ffffff" },
       voice: { type: "text", input_text: slide.caption || slide.title || script, voice_id: voiceId },
       ...(captionText ? { text: { type: "text", text: captionText, position: { x: 0, y: 0.85 }, font_size: 24, color: "#FFFFFF" } } : {})
     };
   }) : [{
     character: { type: "avatar", avatar_id: avatarId, avatar_style: "normal" },
     background: { type: "color", value: "#ffffff" },
     voice: { type: "text", input_text: script, voice_id: voiceId },
     ...((captions[0] ?? captions["0"]) ? { text: { type: "text", text: captions[0] ?? captions["0"], position: { x: 0, y: 0.85 }, font_size: 24, color: "#FFFFFF" } } : {})
   }];

   const body = {
     video_inputs,
     dimension,
     test: false
   };

   const res = await fetch("https://api.heygen.com/v2/video/generate", {
     method: "POST",
     headers: { "x-api-key": HEYGEN_API_KEY, "Content-Type": "application/json" },
     body: JSON.stringify(body)
   });
   const data = await res.json();
   console.log("[HeyGen Avatar Slides Response]", JSON.stringify(data, null, 2));
   if (!data.data?.video_id) throw new Error(`HeyGen error: ${JSON.stringify(data)}`);
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

    if (action === "generate_caption") {
      const { slideTitle, slideContent, videoScript } = params;
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a video caption writer creating engaging, concise captions for promotional video slides.
Slide Title: ${slideTitle}
Slide Content: ${slideContent}
Video Script: ${videoScript}

Write a single, compelling caption (max 20 words) that complements the slide and keeps viewers engaged.
Return ONLY the caption text, no quotes or markdown.`
      });
      return Response.json({ caption: result.trim() });
    }

    if (action === "generate_overlay_image") {
      const { slideTitle, slideContent, videoScript } = params;
      const descriptionResult = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a visual design expert. Based on this slide:
Title: ${slideTitle}
Content: ${slideContent}
Script context: ${videoScript}

Generate a detailed description for a professional overlay graphic/image that complements this slide.
The image should be suitable as a branded overlay or accent image.
Return ONLY the image description (1-2 sentences), no markdown.`
      });
      const imageResult = await base44.integrations.Core.GenerateImage({
        prompt: `Professional branded overlay graphic for promotional video: ${descriptionResult}. Clean, modern design suitable for business marketing.`
      });
      return Response.json({ image_url: imageResult.url });
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
      const { script, voiceId, format, duration, title, videoType, slides, musicTrackUrl, musicGenerationPrompt, captions = {}, overlays = {} } = params;
      let finalAvatarId = params.avatarId || "Abigail_expressive_2024112501";

      if (!script || !script.trim()) {
        return Response.json({ error: "Script is required" }, { status: 400 });
      }
      if (!voiceId) {
        return Response.json({ error: "Voice ID is required" }, { status: 400 });
      }

      let heygenVideoId;
      try {
        if (videoType === "avatar") {
          heygenVideoId = await createAvatarVideo({ script, avatarId: finalAvatarId, voiceId, format, captions });
        } else if (videoType === "slides") {
          heygenVideoId = await createProductVideo({ slides, voiceId, script, format, captions });
        } else if (videoType === "avatar-slides") {
          heygenVideoId = await createAvatarSlidesVideo({ slides, voiceId, script, avatarId: finalAvatarId, format, captions });
        } else {
          return Response.json({ error: "Invalid video type" }, { status: 400 });
        }
      } catch (err) {
        console.error("[Create Video Error]", err.message);
        return Response.json({ error: err.message }, { status: 400 });
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
      const heygenStatus = status.status;

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