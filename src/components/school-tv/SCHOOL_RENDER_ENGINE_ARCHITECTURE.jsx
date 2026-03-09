# School Video Render Engine Architecture

## Overview

Complete backend service architecture for video production pipeline with 22 modular services handling:
- **Intake & Normalization** (3 services)
- **Analysis & Scoring** (3 services)  
- **Story & Scene Architecture** (2 services)
- **Asset Generation** (5 services)
- **Rendering** (2 services)
- **Publishing** (2 services)

All services are event-driven, support retry logic, and maintain machine-usable JSON configurations.

## Service Map

### Phase 1: Intake & Media Processing
```
SubmissionIntakeService
  ↓ Creates render job with input manifest
MediaNormalizationService
  ↓ Detects video properties, formats
ThumbnailService
  ↓ Extracts keyframes
```

### Phase 2: Analysis & Scoring  
```
TranscriptExtractionService
  ↓ OpenAI Whisper speech-to-text
ClipAnalysisService
  ↓ OpenAI Vision quality analysis
HighlightScoringService
  ↓ Ranks clips by highlight potential
```

### Phase 3: Story & Scene Architecture
```
StoryArchitectService
  ↓ GPT-4 narrative structure
SceneBuilderService
  ↓ Creates detailed scene sequence
```

### Phase 4: Asset Generation
```
VoiceoverScriptService → VoiceoverGenerationService
CaptionPlanningService → CaptionRenderService
MusicPlanningService → MusicSelectionService → MusicMixPrepService
BrandingAssetService
```

### Phase 5: Render Planning & Execution
```
RenderPlanBuilderService
  ↓ Machine-usable render plan JSON
RenderOrchestrator
  ↓ Executes all phases
FFmpegRenderAdapter (primary engine)
CreativeEnhancementAdapter (Pika/Runway/HeyGen)
```

### Phase 6: Publishing
```
PublishingPreparationService
  ↓ Generates platform-specific metadata
PublishingDispatcher
  ↓ Routes to YouTube, Facebook, Instagram, Gallery
```

## Key Features

### 1. Machine-Usable Render Plans
All rendering instructions stored as JSON in `render_plan_json`:
```json
{
  "version": "1.0",
  "scenes": [...],
  "assets": {
    "voiceover": {...},
    "captions": {...},
    "music": {...},
    "branding": {...}
  },
  "output": {
    "variants": ["landscape", "square", "vertical", "low_res_preview"]
  },
  "render_instructions": {
    "engine": "ffmpeg",
    "transitions_enabled": true,
    "effects_enabled": true
  }
}
```

### 2. Job Lifecycle States
```
pending → intake → normalizing → analyzing → planning 
→ generating_assets → ready_for_render → rendering 
→ completed
```

Failure branches:
```
[any stage] → failed (retry logic with exponential backoff)
              ↓
          max_retries exceeded → failed (permanent)
```

### 3. Output Variants
Automatically generate multiple output formats:
- **landscape** (16:9, 1920x1080) - YouTube, Facebook
- **square** (1:1, 1080x1080) - Instagram feed
- **vertical** (9:16, 1080x1920) - Instagram Stories, TikTok
- **low_res_preview** (854x480) - Drafts, previews

### 4. Render Profiles
Four built-in profiles with different characteristics:
- **weekly_recap** - Energetic, highlight-heavy, music-focused
- **sports_highlight** - Dynamic, fast-paced, celebration-oriented
- **classroom_spotlight** - Educational, warm, story-focused
- **event_recap** - Documentary, comprehensive, all-inclusive

## Data Structures

### Input Manifest
```json
{
  "submission_id": "sub_123",
  "assets": [
    {"type": "video", "url": "...", "properties": {...}},
    {"type": "photo", "url": "...", "properties": {...}}
  ],
  "transcript": "...",
  "analysis": {...},
  "thumbnails": [...],
  "ranked_by_highlight": [...]
}
```

### Render Plan JSON
Machine-readable plan for FFmpeg/render engines:
```json
{
  "scenes": [
    {
      "scene_number": 1,
      "duration_seconds": 5,
      "type": "intro",
      "assets": [...],
      "transitions": "fade_in",
      "effects": ["title_overlay"],
      "voiceover_needed": true
    }
  ],
  "assets": {
    "voiceover": {...},
    "captions": {...},
    "music": {...},
    "branding": {...}
  }
}
```

### Output Manifest
```json
{
  "outputs": [
    {
      "variant": "landscape",
      "video_url": "https://...",
      "thumbnail_url": "https://...",
      "duration_seconds": 150
    }
  ],
  "platform_metadata": {
    "youtube": {...},
    "facebook": {...},
    "instagram": {...},
    "gallery": {...}
  }
}
```

## Render Profiles

Each profile defined in `SchoolRenderProfiles`:

```javascript
{
  name: "weekly_recap",
  default_tone: "energetic",
  default_duration: "2-3 minutes",
  highlight_scoring_weight: 0.7, // Emphasizes highlights
  voiceover_enabled: true,
  captions_enabled: true,
  music_enabled: true,
  intro_enabled: true,
  outro_enabled: true,
  output_variants: ["landscape", "square", "vertical"]
}
```

## Service Integration Points

### OpenAI (Already Configured)
- **Vision API**: Clip analysis (quality, activity, emotion)
- **Whisper API**: Speech-to-text transcription
- **GPT-4**: Story architecture, voiceover scripts
- **GPT-3.5**: Caption planning, music planning

### FFmpeg (Primary Render Engine)
Convert `render_plan_json` to FFmpeg commands:
```bash
ffmpeg \
  -i input_video.mp4 \
  -i music_track.mp3 \
  -vf "...[filter_graph]..." \
  -af "...[audio_mix]..." \
  -c:v libx264 -c:a aac \
  output.mp4
```

### External Creative Services (Pluggable)
- **Pika AI**: Motion graphics, transitions, upscaling
- **Runway Gen3**: Generative effects, style transfer
- **HeyGen**: Avatar-based videos, lip sync

### Publishing Platforms (Pluggable)
- **YouTube**: YouTube Data API v3
- **Facebook**: Facebook Graph API
- **Instagram**: Instagram Graph API
- **Internal**: Custom CDN/storage
- **Website**: Download links

## Retry & Error Handling

Auto-retry logic with exponential backoff:
```
Retry 1: Immediate
Retry 2: After 5 minutes
Retry 3: After 15 minutes

Max retries: 3 (configurable per job)
Tracks failure stage for resumption
```

Error tracking:
```json
{
  "status": "failed",
  "failure_stage": "music_selection",
  "failure_reason": "Music library API timeout",
  "retry_count": 2,
  "max_retries": 3
}
```

## Processing Log

Every job maintains detailed processing timeline:
```json
[
  {"event": "intake_started", "timestamp": "2026-03-09T10:00:00Z"},
  {"event": "stage_completed", "stage": "normalizing", "timestamp": "..."},
  {"event": "stage_completed", "stage": "analyzing", "timestamp": "..."},
  {"event": "stage_failed", "stage": "music_selection", "error": "...", "timestamp": "..."},
  {"event": "all_stages_completed", "timestamp": "..."}
]
```

## High-Level API

Simple wrapper for all complex operations:

```javascript
import SchoolRenderEngine from '@/components/school-tv/schoolRenderEngine';

// Start complete pipeline
const job = await SchoolRenderEngine.startRenderPipeline(projectId, submissionId);

// Monitor progress
const status = await SchoolRenderEngine.getRenderJobStatus(job.render_job_id);

// Get machine-usable render plan
const plan = await SchoolRenderEngine.getRenderPlan(job.render_job_id);

// Render specific variant
await SchoolRenderEngine.renderVariant(job.render_job_id, 'square');

// Enhance with creative service
await SchoolRenderEngine.enhanceRender(job.render_job_id, 'pika_ai');

// Publish to platforms
await SchoolRenderEngine.publishToPlattforms(job.render_job_id, ['youtube', 'facebook']);
```

## File Organization

**Entities:**
- `entities/SchoolVideoRenderJobs.json` - Render job state & configs
- `entities/SchoolRenderProfiles.json` - Render profile templates

**Services (22 functions in functions/ directory):**
1. `schoolSubmissionIntakeService.js`
2. `schoolMediaNormalizationService.js`
3. `schoolThumbnailService.js`
4. `schoolTranscriptExtractionService.js`
5. `schoolClipAnalysisService.js`
6. `schoolHighlightScoringService.js`
7. `schoolStoryArchitectService.js`
8. `schoolSceneBuilderService.js`
9. `schoolVoiceoverScriptService.js`
10. `schoolCaptionPlanningService.js`
11. `schoolMusicPlanningService.js`
12. `schoolRenderPlanBuilderService.js`
13. `schoolVoiceoverGenerationService.js`
14. `schoolCaptionRenderService.js`
15. `schoolBrandingAssetService.js`
16. `schoolMusicSelectionService.js`
17. `schoolMusicMixPrepService.js`
18. `schoolRenderOrchestrator.js`
19. `schoolFFmpegRenderAdapter.js`
20. `schoolCreativeEnhancementAdapter.js`
21. `schoolPublishingPreparationService.js`
22. `schoolPublishingDispatcher.js`

**Helper & Documentation:**
- `components/school-tv/schoolRenderEngine.js` - High-level API
- `components/school-tv/SCHOOL_RENDER_ENGINE_ARCHITECTURE.md` - This document

## No Breaking Changes

✓ All existing pages work unchanged:
- BulldogTV (public gallery)
- BulldogTVWatch (video player)
- BulldogTVSubmit (public submission)
- AdminSchoolSubmissions
- AdminSchoolProjects
- AdminSchoolRenderQueue
- AdminSchoolLibrary
- AdminSchoolBranding

✓ All existing entities backward compatible:
- SchoolSubmissions (unchanged)
- SchoolVideoProjects (unchanged)
- SchoolBranding (unchanged)
- etc.

✓ New rendering is opt-in via project status updates

## Next Steps

1. **Test Pipeline**: Use `SchoolRenderEngine.startRenderPipeline()` on test project
2. **FFmpeg Integration**: Deploy FFmpeg worker container, update `schoolFFmpegRenderAdapter.js`
3. **Platform APIs**: Connect YouTube, Facebook, Instagram APIs
4. **Dashboard**: Add render job monitoring UI
5. **Advanced Features**: Real-time progress streaming, ML clip sequencing