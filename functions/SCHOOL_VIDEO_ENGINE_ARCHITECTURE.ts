# School Video Network - Video Engine Integration Architecture

## System Overview

The Video Engine Integration Layer provides a modular, extensible backend architecture for processing school-generated video content through a complete production pipeline. All UI and entity structures remain unchanged; this layer adds the orchestration, monitoring, and integration points needed to connect external services.

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PUBLIC SUBMISSION PORTAL                      │
│            (No changes - existing BulldogTVSubmit.jsx)           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
         ┌────────────────────────────────────┐
         │     SchoolSubmissions Entity        │
         │    (Status: approved/rejected)     │
         └────────┬───────────────────────────┘
                  │
                  ▼ [Approval → Processing]
    ╔═════════════════════════════════════════════════════════════╗
    ║          CLIP INGESTION & ANALYSIS LAYER                   ║
    ╠═════════════════════════════════════════════════════════════╣
    ║                                                              ║
    ║  1. schoolVideoClipIngestion.js                             ║
    ║     • Extracts video/photo files from submission            ║
    ║     • Creates SchoolVideoClips records                      ║
    ║     • Queues clips for analysis                             ║
    ║                                                              ║
    ║  2. schoolVideoClipAnalysis.js                              ║
    ║     • Calls OpenAI Vision for frame analysis                ║
    ║     • Scores: quality (0-10), energy (0-10)                 ║
    ║     • Detects: scene, activity, location, tone              ║
    ║     • Tags: AI-generated metadata tags                      ║
    ║     • Queues video clips for transcription                  ║
    ║                                                              ║
    ║  3. schoolVideoTranscriptExtraction.js                      ║
    ║     • Calls Whisper/STT service for video audio             ║
    ║     • Stores transcript in SchoolVideoClips                 ║
    ║                                                              ║
    ║  Updates: SchoolVideoClips                                  ║
    ╚═════════════════════════════════════════════════════════════╝
                             │
                             ▼
         ┌────────────────────────────────────┐
         │   SchoolVideoProjects Entity        │
         │  (Status: collecting_assets)       │
         └────────┬───────────────────────────┘
                  │
                  ▼ [Ready → Script Generation]
    ╔═════════════════════════════════════════════════════════════╗
    ║          CREATIVE GENERATION LAYER                          ║
    ╠═════════════════════════════════════════════════════════════╣
    ║                                                              ║
    ║  1. schoolVideoScriptGeneration.js                          ║
    ║     • Fetches selected clips from project                   ║
    ║     • Fetches school branding & context                     ║
    ║     • Calls OpenAI GPT-4 to generate:                       ║
    ║       - Hook line (first 10 seconds)                        ║
    ║       - Full voiceover script                               ║
    ║       - Scene structure & sequencing                        ║
    ║       - On-screen text overlays                             ║
    ║       - Call-to-action messaging                            ║
    ║     • Creates SchoolVideoScripts record                     ║
    ║     • Updates project status → script_generated             ║
    ║                                                              ║
    ║  2. schoolVideoCaptionGeneration.js                         ║
    ║     • Uses generated script + transcript data               ║
    ║     • Generates SRT subtitle file                           ║
    ║     • Adds speaker labels & timing                          ║
    ║     • Stores in SchoolVideoScripts.caption_text             ║
    ║                                                              ║
    ║  3. schoolVideoMusicSelection.js                            ║
    ║     • Analyzes project tone, activity, target audience      ║
    ║     • Queries SchoolMusicProfiles database                  ║
    ║     • Recommends best-fit music style via GPT               ║
    ║     • Updates project.selected_music_style                  ║
    ║                                                              ║
    ║  Updates: SchoolVideoScripts, SchoolVideoProjects           ║
    ╚═════════════════════════════════════════════════════════════╝
                             │
                             ▼
         ┌────────────────────────────────────┐
         │   SchoolVideoProjects Entity        │
         │   (Status: queued_for_render)      │
         └────────┬───────────────────────────┘
                  │
                  ▼ [Approved → Render Queue]
    ╔═════════════════════════════════════════════════════════════╗
    ║          VIDEO RENDERING ORCHESTRATION LAYER                ║
    ╠═════════════════════════════════════════════════════════════╣
    ║                                                              ║
    ║  1. schoolVideoRenderOrchestration.js                       ║
    ║     • Fetches project + script + approved clips             ║
    ║     • Creates SchoolVideoRenders job record                 ║
    ║     • Manages priority queue:                               ║
    ║       - High priority: faster queue position                ║
    ║       - Normal/Low: standard queue ordering                 ║
    ║     • Supports multiple render engines:                     ║
    ║       ✓ FFmpeg (local/cloud)                                ║
    ║       ✓ Pika API (generative AI)                            ║
    ║       ✓ Runway Gen3 (advanced generative)                   ║
    ║       ✓ HeyGen (avatar-based videos)                        ║
    ║     • Queues render job with render engine                  ║
    ║     • Starts webhook for progress updates                   ║
    ║                                                              ║
    ║  2. schoolVideoRenderMonitor.js (webhook listener)          ║
    ║     • Receives progress updates from render engine:         ║
    ║       - Status: queued → preparing → rendering → completed  ║
    ║       - Progress percentage                                 ║
    ║       - Output video URL                                    ║
    ║       - Errors/retry info                                   ║
    ║     • Updates SchoolVideoRenders job record                 ║
    ║     • Auto-retry on failure (max 3 attempts)                ║
    ║     • Updates project status → review_ready                 ║
    ║                                                              ║
    ║  Updates: SchoolVideoRenders, SchoolVideoProjects           ║
    ║  External Integration Points:                               ║
    ║    - FFmpeg worker (local or Docker)                        ║
    ║    - Pika AI API                                            ║
    ║    - Runway ML API                                          ║
    ║    - HeyGen API                                             ║
    ╚═════════════════════════════════════════════════════════════╝
                             │
                             ▼
         ┌────────────────────────────────────┐
         │   SchoolVideoProjects Entity        │
         │    (Status: review_ready)          │
         └────────┬───────────────────────────┘
                  │
                  ▼ [Admin Approval → Publishing]
    ╔═════════════════════════════════════════════════════════════╗
    ║          MULTI-PLATFORM PUBLISHING LAYER                    ║
    ╠═════════════════════════════════════════════════════════════╣
    ║                                                              ║
    ║  1. schoolVideoPublishingOrchestration.js                   ║
    ║     • Receives list of publish targets                      ║
    ║     • Creates SchoolVideoPublishing records                 ║
    ║     • Queues platform-specific publish jobs                 ║
    ║                                                              ║
    ║  2. Platform-Specific Publishers:                           ║
    ║     • schoolVideoPublishGallery.js                          ║
    ║       - Stores in internal gallery                          ║
    ║       - Updates project.public_video_url                    ║
    ║                                                              ║
    ║     • schoolVideoPublishYoutube.js (planned)                ║
    ║       - YouTube Data API v3 integration                     ║
    ║       - Metadata: title, description, tags, category        ║
    ║       - Thumbnail generation                                ║
    ║       - Scheduled vs. immediate publish                     ║
    ║                                                              ║
    ║     • schoolVideoPublishFacebook.js (planned)               ║
    ║       - Facebook API integration                            ║
    ║       - Auto-captions per platform                          ║
    ║       - Privacy controls                                    ║
    ║                                                              ║
    ║     • schoolVideoPublishInstagram.js (planned)              ║
    ║       - Vertical format (9:16)                              ║
    ║       - Reels API (15-90s duration)                         ║
    ║       - Hashtags & description                              ║
    ║                                                              ║
    ║  3. schoolVideoPublishingMonitor.js (webhook listener)      ║
    ║     • Receives platform publish confirmations               ║
    ║     • Updates SchoolVideoPublishing records                 ║
    ║     • Aggregates publish status across platforms            ║
    ║     • Updates project.publish_status                        ║
    ║                                                              ║
    ║  Updates: SchoolVideoPublishing, SchoolVideoProjects        ║
    ║  External Integration Points:                               ║
    ║    - YouTube Data API                                       ║
    ║    - Facebook Graph API                                     ║
    ║    - Instagram Graph API                                    ║
    ║    - Custom gallery storage                                 ║
    ╚═════════════════════════════════════════════════════════════╝
                             │
                             ▼
         ┌────────────────────────────────────┐
         │   SchoolVideoProjects Entity        │
         │    (Status: published)              │
         │   SchoolVideoPublishing records     │
         │  (All destinations: published)      │
         └────────────────────────────────────┘
```

## Entity Relationships

```
SchoolSubmissions
  ├─ approved/rejected
  └─ triggers clip ingestion
       │
       ▼
  SchoolVideoClips (analysis results)
       │
       ├─ quality_score, energy_score
       ├─ emotional_tone, ai_tags
       ├─ transcript (from STT)
       └─ used in project assembly
            │
            ▼
       SchoolVideoProjects
            │
            ├─ selected clips
            ├─ project metadata
            └─ triggers script generation
                 │
                 ▼
            SchoolVideoScripts
                 │
                 ├─ full_voiceover_script
                 ├─ caption_text (SRT)
                 ├─ scene_structure
                 └─ triggers render
                      │
                      ▼
                 SchoolVideoRenders
                      │
                      ├─ status tracking
                      ├─ output_url
                      └─ triggers publish
                           │
                           ▼
                      SchoolVideoPublishing
                           │
                           ├─ platform targets
                           ├─ destination_url
                           └─ final URLs
```

## Function Invocation Patterns

### Automatic (Event-Driven via Entity Changes)

```javascript
// Entity automation watches SchoolSubmissions & SchoolVideoProjects
// Triggers schoolVideoProcessingAutomation.js

Event: SchoolSubmissions.status = 'approved'
  ↓
  invoke('schoolVideoClipIngestion', { submission_id, submission })

Event: SchoolVideoProjects.status = 'ready_for_ai'
  ↓
  invoke('schoolVideoScriptGeneration', { project_id })
  invoke('schoolVideoCaptionGeneration', { script_id, project_id })
  invoke('schoolVideoMusicSelection', { project_id })

Event: SchoolVideoProjects.status = 'queued_for_render'
  ↓
  invoke('schoolVideoRenderOrchestration', { project_id, render_config })

Event: SchoolVideoProjects.status = 'approved'
  ↓
  invoke('schoolVideoPublishingOrchestration', { project_id, publish_targets })
```

### Manual (Admin-Triggered from Dashboard)

```javascript
// Admin clicks "Generate Script" button
invoke('schoolVideoScriptGeneration', { project_id })

// Admin clicks "Queue for Render"
invoke('schoolVideoRenderOrchestration', { project_id, render_config })

// Admin clicks "Publish to YouTube"
invoke('schoolVideoPublishingOrchestration', {
  project_id,
  publish_targets: [{ platform: 'youtube' }]
})
```

### Webhook-Driven (From External Services)

```javascript
// Render engine (FFmpeg/Pika/Runway) completes job
POST /functions/schoolVideoRenderMonitor
{
  "render_job_id": "...",
  "status": "completed",
  "output_url": "https://...",
  "progress": 100
}

// Publishing service confirms upload
POST /functions/schoolVideoPublishingMonitor
{
  "publish_job_id": "...",
  "status": "published",
  "destination_url": "https://youtube.com/watch?v=..."
}
```

## Integration Points with External Services

### 1. Video Analysis
- **Service**: OpenAI Vision API
- **Function**: schoolVideoClipAnalysis.js
- **Inputs**: Video/photo URL
- **Outputs**: Quality scores, tags, scene descriptions, emotional tone
- **Alternative Providers**: Google Vision API, Anthropic Claude Vision

### 2. Speech-to-Text
- **Service**: OpenAI Whisper API
- **Function**: schoolVideoTranscriptExtraction.js
- **Inputs**: Video/audio URL
- **Outputs**: Transcript with timestamps, speaker labels
- **Alternative Providers**: Google Speech-to-Text, AWS Transcribe, Rev

### 3. Script Generation
- **Service**: OpenAI GPT-4 / GPT-4 Turbo
- **Function**: schoolVideoScriptGeneration.js
- **Inputs**: Clip data, project brief, branding context, tone
- **Outputs**: Hook line, full script, scene structure, call-to-action
- **Alternative Providers**: Anthropic Claude, Google PaLM

### 4. Video Rendering
- **Service**: FFmpeg (local), Pika API, Runway Gen3, HeyGen
- **Function**: schoolVideoRenderOrchestration.js
- **Inputs**: Clips, script, captions, music, branding
- **Outputs**: MP4/WebM video files, thumbnails
- **Features**: Queue management, priority ordering, multi-format output

### 5. Publishing
- **YouTube**: YouTube Data API v3
- **Facebook**: Facebook Graph API
- **Instagram**: Instagram Graph API / Meta Business API
- **Internal**: Custom storage/CDN

## Configuration & Customization

### Render Engine Selection

```javascript
// In admin dashboard or via API:
render_config = {
  engine: 'ffmpeg',        // or 'pika', 'runway', 'heygen'
  format: 'mp4',           // or 'webm'
  resolution: '1920x1080', // or '1080x1080' (square), '1080x1920' (vertical)
  aspect_ratio: '16:9',    // or '1:1', '9:16'
  quality_preset: 'final'  // 'draft', 'preview', 'final'
}
```

### Music Library Integration

```javascript
// SchoolMusicProfiles entity
{
  name: "Uplifting Orchestral",
  category: "inspiring",
  style_description: "Grand orchestral themes with building intensity",
  bpm_range: "120-140",
  mood: "triumphant",
  usage_context: "championship wins, celebrations",
  is_default: false,
  is_active: true
}
```

### School Branding Integration

```javascript
// SchoolBranding entity used in:
// - Script generation (intro/outro text)
// - Render jobs (watermarks, color schemes)
// - Publishing (channel names, descriptions)

{
  intro_text: "Brought to you by Bulldog TV",
  outro_text: "Go Bulldogs!",
  primary_color: "#1e3a5f",
  secondary_color: "#f59e0b",
  logo: "https://..."
}
```

## Error Handling & Retry Strategy

```javascript
RetryStrategy = {
  maxRetries: 3,
  backoffMultiplier: 2,
  initialDelayMs: 5000,      // 5 seconds
  maxDelayMs: 300000,        // 5 minutes
  retryableErrors: [
    'NETWORK_ERROR',
    'TIMEOUT',
    'RATE_LIMIT',
    'SERVICE_UNAVAILABLE'
  ]
}
```

## Status Tracking

### Project Status Lifecycle
```
draft 
  → collecting_assets 
  → ready_for_ai 
  → script_generated 
  → queued_for_render 
  → rendering 
  → review_ready 
  → approved 
  → published
  → (or) failed
```

### Render Job Status
```
queued → preparing → processing → rendering → completed
                                          ↓
                                        (or) failed → queued (retry)
```

### Publishing Status
```
queued → preparing → publishing → published
                                ↓
                              (or) failed
```

## Security & Permissions

- **Admin Only**: Approval, render queuing, publishing
- **Submission Creator**: Can edit own submission until approved
- **Service Role**: All internal function invocations use service role
- **API Keys**: Stored as secrets (OPENAI_API_KEY, etc.)
- **Webhooks**: Validate source before processing updates

## Monitoring & Logging

All functions include:
- Structured logging with `[Service Name]` prefix
- Error logging with full stack traces
- Status update logging for audit trail
- Webhook confirmation logging
- Queue position logging for transparency

## Future Extensions

1. **Advanced Rendering**
   - Real-time render progress streaming
   - Multi-GPU job distribution
   - Format-specific optimizations

2. **AI Enhancements**
   - Custom voice synthesis (ElevenLabs)
   - Automated B-roll suggestion
   - Smart clip sequencing via ML

3. **Analytics Integration**
   - View counts per platform
   - Engagement metrics aggregation
   - Performance scoring

4. **Mobile App Support**
   - Push notifications for job completion
   - Mobile clip upload/editing
   - Simplified dashboard on mobile

5. **Advanced Scheduling**
   - Cron-based publishing
   - Time-zone aware scheduling
   - Blackout periods for publishing