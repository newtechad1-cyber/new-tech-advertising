import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import OpenAI from 'npm:openai';

const HEYGEN_API_KEY = Deno.env.get("Heygen") || Deno.env.get("HEYGEN_API_KEY") || Deno.env.get("heygen");
const OPENAI_API_KEY = Deno.env.get("OpenAI") || Deno.env.get("OPENAI_API_KEY") || Deno.env.get("openai");
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Generate script from various inputs using OpenAI
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

// Get HeyGen avatars
async function getAvatars() {
  const res = await fetch("https://api.heygen.com/v2/avatars", {
    headers: { "x-api-key": HEYGEN_API_KEY }
  });
  const data = await res.json();
  return data.data?.avatars || [];
}

// Get HeyGen voices
async function getVoices() {
  const res = await fetch("https://api.heygen.com/v2/voices", {
    headers: { "x-api-key": HEYGEN_API_KEY }
  });
  const data = await res.json();
  return data.data?.voices || [];
}

// Create HeyGen video
async function createHeygenVideo({ script, avatarId, voiceId, format = "16:9" }) {
  const dimension = format === "9:16" ? { width: 720, height: 1280 } :
                    format === "1:1"  ? { width: 720, height: 720 } :
                                        { width: 1280, height: 720 };

  const body = {
    video_inputs: [{
      character: {
        type: "avatar",
        avatar_id: avatarId,
        avatar_style: "normal"
      },
      voice: {
        type: "text",
        input_text: script,
        voice_id: voiceId
      }
    }],
    dimension,
    test: false
  };

  const res = await fetch("https://api.heygen.com/v2/video/generate", {
    method: "POST",
    headers: {
      "x-api-key": HEYGEN_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  
  const data = await res.json();
  if (!data.data?.video_id) throw new Error(data.message || "Failed to create HeyGen video");
  return data.data.video_id;
}

// Check HeyGen video status
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

  if (action === "get_avatars") {
    const avatars = await getAvatars();
    return Response.json({ avatars });
  }

  if (action === "get_voices") {
    const voices = await getVoices();
    return Response.json({ voices });
  }

  if (action === "create_video") {
    const { script, avatarId, voiceId, format, duration, title, entityType, entityId } = params;
    
    // Create in HeyGen
    const heygenVideoId = await createHeygenVideo({ script, avatarId, voiceId, format });
    
    // Save to VideoRequests entity
    const record = await base44.entities.VideoRequests.create({
      title: title || "AI Generated Video",
      requested_by: user.email,
      format,
      duration,
      script,
      render_job_id: heygenVideoId,
      render_status: "queued",
      status: "Rendering"
    });
    
    return Response.json({ video_id: heygenVideoId, record_id: record.id });
  }

  if (action === "check_status") {
    const { heygenVideoId, recordId } = params;
    const status = await getVideoStatus(heygenVideoId);
    
    // Update record if done
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