# School Video Network - Video Engine Integration Architecture

## System Overview

The Video Engine Integration Layer provides a modular, extensible backend architecture for processing school-generated video content through a complete production pipeline. All UI and entity structures remain unchanged; this layer adds the orchestration, monitoring, and integration points needed to connect external services.

## Data Flow Architecture

**CLIP INGESTION & ANALYSIS LAYER**
- schoolVideoClipIngestion.js: Extracts video/photo files, creates SchoolVideoClips
- schoolVideoClipAnalysis.js: OpenAI Vision analysis → quality/energy scores, scene detection
- schoolVideoTranscriptExtraction.js: Whisper STT → transcript extraction

**CREATIVE GENERATION LAYER**
- schoolVideoScriptGeneration.js: GPT-4 script generation from clips + branding
- schoolVideoCaptionGeneration.js: SRT caption generation from transcript
- schoolVideoMusicSelection.js: AI-recommended music style selection

**VIDEO RENDERING ORCHESTRATION**
- schoolVideoRenderOrchestration.js: Priority queue, render job management
- schoolVideoRenderMonitor.js: Webhook listener for render progress
- Supports: FFmpeg, Pika AI, Runway Gen3, HeyGen

**MULTI-PLATFORM PUBLISHING**
- schoolVideoPublishingOrchestration.js: Multi-platform job queuing
- schoolVideoPublishGallery.js: Internal gallery publishing
- schoolVideoPublishYoutube.js: YouTube Data API integration
- schoolVideoPublishingMonitor.js: Platform webhook handler

## Entity Relationships

```
SchoolSubmissions (approved)
  → schoolVideoClipIngestion
    → SchoolVideoClips (with analysis)
      → SchoolVideoProjects (ready_for_ai)
        → schoolVideoScriptGeneration
          → SchoolVideoScripts (with captions/music)
            → schoolVideoRenderOrchestration
              → SchoolVideoRenders (queued)
                → schoolVideoRenderMonitor (webhook)
                  → SchoolVideoProjects (review_ready)
                    → schoolVideoPublishingOrchestration
                      → SchoolVideoPublishing (queued per platform)
                        → schoolVideoPublishingMonitor (webhook)
                          → SchoolVideoProjects (published)
```

## Integration Points with External Services

### 1. Video Analysis
- **Service**: OpenAI Vision API
- **Function**: schoolVideoClipAnalysis.js
- **Outputs**: Quality scores (0-10), energy scores, scene descriptions, emotional tone, AI tags

### 2. Speech-to-Text
- **Service**: OpenAI Whisper API
- **Function**: schoolVideoTranscriptExtraction.js
- **Outputs**: Transcript with timestamps, speaker labels

### 3. Script Generation
- **Service**: OpenAI GPT-4 Turbo
- **Function**: schoolVideoScriptGeneration.js
- **Outputs**: Hook line, full voiceover script, scene structure, on-screen text, captions, call-to-action

### 4. Video Rendering
- **Services**: FFmpeg (local), Pika API, Runway Gen3, HeyGen
- **Function**: schoolVideoRenderOrchestration.js
- **Features**: Priority queue, multi-format output (MP4, WebM), aspect ratios (16:9, 1:1, 9:16)

### 5. Publishing
- **YouTube**: YouTube Data API v3
- **Facebook**: Facebook Graph API
- **Instagram**: Instagram Graph API
- **Gallery**: Custom CDN/storage

## Function Invocation Patterns

### Event-Driven (Automatic via Entity Changes)
- SchoolSubmissions.status = 'approved' → schoolVideoClipIngestion
- SchoolVideoProjects.status = 'ready_for_ai' → schoolVideoScriptGeneration + schoolVideoCaptionGeneration + schoolVideoMusicSelection
- SchoolVideoProjects.status = 'queued_for_render' → schoolVideoRenderOrchestration
- SchoolVideoProjects.status = 'approved' → schoolVideoPublishingOrchestration

### Webhook-Driven (From External Services)
- Render engine completion → schoolVideoRenderMonitor (updates render status)
- Platform publish confirmation → schoolVideoPublishingMonitor (updates publish status)

## Status Tracking

**Project Status Lifecycle**:
draft → collecting_assets → ready_for_ai → script_generated → queued_for_render → rendering → review_ready → approved → published

**Render Job Status**:
queued → preparing → processing → rendering → completed (or failed with retry)

**Publishing Status**:
queued → preparing → publishing → published (or failed)

## Configuration Examples

### Render Job Configuration
```javascript
render_config = {
  engine: 'ffmpeg',              // or 'pika', 'runway', 'heygen'
  format: 'mp4',
  resolution: '1920x1080',       // or '1080x1080' (square), '1080x1920' (vertical)
  aspect_ratio: '16:9',
  quality_preset: 'final'        // 'draft', 'preview', 'final'
}
```

### Music Selection (from SchoolMusicProfiles)
```javascript
{
  name: "Uplifting Orchestral",
  category: "inspiring",
  style_description: "Grand orchestral themes",
  bpm_range: "120-140",
  mood: "triumphant",
  usage_context: "championship wins, celebrations"
}
```

### School Branding Integration
Used in script generation, render jobs, and publishing:
- intro_text, outro_text
- primary_color, secondary_color
- logo, watermarks
- social URLs

## Error Handling

**Retry Strategy**:
- Max retries: 3 attempts
- Backoff: exponential (2x multiplier)
- Initial delay: 5 seconds
- Max delay: 5 minutes
- Retryable errors: NETWORK_ERROR, TIMEOUT, RATE_LIMIT, SERVICE_UNAVAILABLE

## Architecture Benefits

✓ **Modular**: Each service is independent and testable
✓ **Extensible**: New render engines/platforms easily added
✓ **Scalable**: Queue-based job distribution
✓ **Observable**: Full logging and status tracking
✓ **Resilient**: Automatic retry, fallback handling
✓ **Secure**: Service role isolation, API key management
✓ **Production-Ready**: No UI changes required; backend ready for external integrations

## No UI/Entity Changes

- All existing pages remain unchanged (BulldogTV, BulldogTVWatch, BulldogTVSubmit, etc.)
- All existing admin pages work as-is (AdminSchoolSubmissions, AdminSchoolProjects, etc.)
- All existing entities stay intact (schema unchanged)
- Backward compatible with current workflows
- Service layer is completely transparent to frontend