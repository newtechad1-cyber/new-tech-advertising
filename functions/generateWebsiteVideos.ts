import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const HEYGEN_API_KEY = Deno.env.get("Heygen") || Deno.env.get("HEYGEN_API_KEY");

const WEBSITE_VIDEO_SLOTS = [
  {
    slot_key: "homepage_demo",
    title: "NTA Platform Demo",
    label: "Homepage — Platform Demo",
    duration: "30s",
    format: "16:9",
    script_prompt: `Write a compelling 30-second promotional video script (max 75 words, spoken voiceover only, no stage directions) for New Tech Advertising (NTA).
NTA is an AI-powered marketing platform for small businesses. It automatically creates social media posts, videos, and website content.
Highlight: saves hours of work, no marketing team needed, AI writes and schedules everything, posts to Facebook/Instagram automatically.
Tone: energetic, confident, direct. End with: "Start your free trial at NewTechAdvertising.com"`
  },
  {
    slot_key: "hvac_demo",
    title: "HVAC Marketing Demo",
    label: "HVAC Page — Marketing Demo",
    duration: "30s",
    format: "16:9",
    script_prompt: `Write a compelling 30-second promotional video script (max 75 words, spoken voiceover only, no stage directions) for an HVAC marketing platform.
The platform uses AI to automatically create seasonal HVAC promotions, maintenance reminders, and equipment upgrade posts for Facebook and Instagram.
Target: HVAC business owners who are too busy to do their own marketing.
Highlight: seasonal content, automatic scheduling, no marketing agency needed, more service calls.
Tone: professional, practical. End with: "Start your free trial at NewTechAdvertising.com"`
  },
  {
    slot_key: "restaurant_demo",
    title: "Restaurant Marketing Demo",
    label: "Restaurant Page — Marketing Demo",
    duration: "30s",
    format: "16:9",
    script_prompt: `Write a compelling 30-second promotional video script (max 75 words, spoken voiceover only, no stage directions) for a restaurant social media marketing platform.
The platform uses AI to automatically create menu highlights, daily specials, event promotions, and behind-the-scenes videos for restaurants.
Target: restaurant owners who want more walk-ins and reservations from social media.
Highlight: posts daily without effort, professional food content, no photographer needed.
Tone: warm, appetizing, exciting. End with: "Start your free trial at NewTechAdvertising.com"`
  }
];

async function getDefaultAvatar() {
  const res = await fetch("https://api.heygen.com/v2/avatars", {
    headers: { "x-api-key": HEYGEN_API_KEY }
  });
  const data = await res.json();
  const avatars = data.data?.avatars || [];
  // Prefer a known professional avatar
  const preferred = avatars.find(a => a.avatar_id?.includes("Abigail")) || avatars[0];
  return preferred?.avatar_id || "Abigail_expressive_2024112501";
}

async function getDefaultVoice() {
  const res = await fetch("https://api.heygen.com/v2/voices", {
    headers: { "x-api-key": HEYGEN_API_KEY }
  });
  const data = await res.json();
  const voices = (data.data?.voices || []).filter(v => !v.language || v.language === "English");
  const preferred = voices.find(v => v.gender === "female" && v.accent === "American") || voices[0];
  return preferred?.voice_id;
}

async function createHeyGenVideo({ script, avatarId, voiceId, format }) {
  const dimension = format === "9:16" ? { width: 720, height: 1280 } :
                    format === "1:1"  ? { width: 720, height: 720 } :
                                        { width: 1280, height: 720 };
  const body = {
    video_inputs: [{
      character: { type: "avatar", avatar_id: avatarId, avatar_style: "normal" },
      voice: { type: "text", input_text: script, voice_id: voiceId }
    }],
    caption: true,
    dimension,
    test: false
  };
  const res = await fetch("https://api.heygen.com/v2/video/generate", {
    method: "POST",
    headers: { "x-api-key": HEYGEN_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
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
    if (user.role !== "admin") return Response.json({ error: "Admin only" }, { status: 403 });

    if (!HEYGEN_API_KEY) return Response.json({ error: "HeyGen API key not configured" }, { status: 400 });

    const { action, ...params } = await req.json();

    // List current website video slots with their status
    if (action === "list_slots") {
      const existing = await base44.asServiceRole.entities.VideoRequests.filter(
        { requested_by: "website_video_generator" }
      );
      const result = WEBSITE_VIDEO_SLOTS.map(slot => {
        const record = existing.find(r => r.title === slot.title) || null;
        return {
          ...slot,
          record_id: record?.id || null,
          render_status: record?.render_status || null,
          render_output_url: record?.render_output_url || null,
          script: record?.script || null,
          created_date: record?.created_date || null,
        };
      });
      return Response.json({ slots: result });
    }

    // Generate script for a single slot
    if (action === "generate_script") {
      const { slot_key } = params;
      const slot = WEBSITE_VIDEO_SLOTS.find(s => s.slot_key === slot_key);
      if (!slot) return Response.json({ error: "Unknown slot" }, { status: 400 });

      const script = await base44.integrations.Core.InvokeLLM({ prompt: slot.script_prompt });
      return Response.json({ script: script.trim() });
    }

    // Submit a slot to HeyGen for rendering
    if (action === "submit_video") {
      const { slot_key, script } = params;
      const slot = WEBSITE_VIDEO_SLOTS.find(s => s.slot_key === slot_key);
      if (!slot || !script) return Response.json({ error: "Missing slot_key or script" }, { status: 400 });

      const [avatarId, voiceId] = await Promise.all([getDefaultAvatar(), getDefaultVoice()]);
      const heygenVideoId = await createHeyGenVideo({ script, avatarId, voiceId, format: slot.format });

      // Delete old record for this slot if exists
      const existing = await base44.asServiceRole.entities.VideoRequests.filter({
        requested_by: "website_video_generator",
        title: slot.title
      });
      for (const r of existing) {
        await base44.asServiceRole.entities.VideoRequests.delete(r.id);
      }

      const record = await base44.asServiceRole.entities.VideoRequests.create({
        title: slot.title,
        requested_by: "website_video_generator",
        format: slot.format,
        duration: slot.duration,
        script,
        render_job_id: heygenVideoId,
        render_status: "queued",
        status: "Rendering"
      });

      return Response.json({ record_id: record.id, heygen_video_id: heygenVideoId });
    }

    // Poll status for a record
    if (action === "check_status") {
      const { record_id, heygen_video_id } = params;
      const status = await getVideoStatus(heygen_video_id);
      const heygenStatus = status.status;

      if (heygenStatus === "completed" && status.video_url) {
        await base44.asServiceRole.entities.VideoRequests.update(record_id, {
          render_status: "done",
          render_output_url: status.video_url,
          status: "Needs Review"
        });
      } else if (heygenStatus === "failed") {
        await base44.asServiceRole.entities.VideoRequests.update(record_id, {
          render_status: "failed",
          status: "Draft",
          render_error: status.error?.message || "Rendering failed"
        });
      } else {
        await base44.asServiceRole.entities.VideoRequests.update(record_id, {
          render_status: "rendering"
        });
      }

      return Response.json({ status: heygenStatus, video_url: status.video_url || null });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("[generateWebsiteVideos]", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});