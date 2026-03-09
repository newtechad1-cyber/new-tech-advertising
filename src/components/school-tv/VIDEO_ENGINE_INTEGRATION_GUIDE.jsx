# Video Engine Integration Guide

## Quick Start

### Backend Services Implemented ✓

**Clip Processing** (3 services)
- ✓ `schoolVideoClipIngestion.js` - Extract video/photo files
- ✓ `schoolVideoClipAnalysis.js` - AI quality & scene analysis
- ✓ `schoolVideoTranscriptExtraction.js` - Speech-to-text

**Creative Generation** (3 services)
- ✓ `schoolVideoScriptGeneration.js` - AI script writing
- ✓ `schoolVideoCaptionGeneration.js` - SRT subtitle generation
- ✓ `schoolVideoMusicSelection.js` - AI music recommendations

**Rendering** (2 services)
- ✓ `schoolVideoRenderOrchestration.js` - Job queuing & priority
- ✓ `schoolVideoRenderMonitor.js` - Webhook progress tracking

**Publishing** (6 services)
- ✓ `schoolVideoPublishingOrchestration.js` - Multi-platform orchestration
- ✓ `schoolVideoPublishGallery.js` - Internal gallery (ready)
- ✓ `schoolVideoPublishYoutube.js` - YouTube upload (skeleton)
- ✓ `schoolVideoPublishFacebook.js` - Facebook upload (skeleton)
- ✓ `schoolVideoPublishInstagram.js` - Instagram Reels (skeleton)
- ✓ `schoolVideoPublishWebsite.js` - Website download (ready)

**Automation & Monitoring** (3 services)
- ✓ `schoolVideoProcessingAutomation.js` - Event-driven workflow
- ✓ `schoolVideoRenderMonitor.js` - Render webhook listener
- ✓ `schoolVideoPublishingMonitor.js` - Publishing webhook listener

**Configuration & Helpers**
- ✓ `VideoProcessingServiceConfig.js` - Service definitions & config
- ✓ `schoolVideoEngine.js` - High-level API helper
- ✓ Documentation (this file + SCHOOL_VIDEO_ENGINE_ARCHITECTURE.md)

## Integration Checklist

### Phase 1: Core Infrastructure (Complete)
- [x] Service skeleton for all 14 backend functions
- [x] Entity updates via SchoolVideoClips, SchoolVideoRenders, SchoolVideoPublishing
- [x] Event-driven automation framework
- [x] Webhook handlers for async processing
- [x] Error handling & retry strategy

### Phase 2: External Service Integration (Ready for Implementation)

#### OpenAI Integration
- [x] Analysis prompt structure
- [x] Script generation templates
- [x] Response schema definitions
- [ ] **TO IMPLEMENT**: Fine-tune prompts, add temperature/model selection

#### Render Engine Integration
- [ ] **TO IMPLEMENT**: FFmpeg worker setup
  - Docker container or Lambda function
  - Receives render job from queue
  - Processes clips + script + captions + music
  - Returns output_url to webhook
  
- [ ] **TO IMPLEMENT**: Alternative engines (optional)
  - Pika AI API integration
  - Runway Gen3 API integration
  - HeyGen avatar video integration

#### YouTube API Integration
- [ ] **TO IMPLEMENT**: Google OAuth setup
- [ ] **TO IMPLEMENT**: Video upload implementation
- [ ] **TO IMPLEMENT**: Metadata configuration
- [ ] **TO IMPLEMENT**: Thumbnail generation

#### Facebook/Instagram Integration
- [ ] **TO IMPLEMENT**: Meta Business API setup
- [ ] **TO IMPLEMENT**: Video upload implementation
- [ ] **TO IMPLEMENT**: Caption auto-generation
- [ ] **TO IMPLEMENT**: Scheduling support

### Phase 3: Advanced Features (Future)
- [ ] Real-time render progress streaming
- [ ] Advanced clip sequencing via ML
- [ ] ElevenLabs voice synthesis
- [ ] Automated B-roll suggestions
- [ ] Analytics aggregation from platforms
- [ ] Mobile app notifications
- [ ] Advanced scheduling (cron-based, time-zone aware)

## How to Integrate Each Service

### 1. OpenAI/Vision Integration (Already Ready)
The system already uses `base44.integrations.Core.InvokeLLM` which has OpenAI configured.
- **Required secret**: `OPENAI_API_KEY` (already set ✓)
- **Services using it**:
  - schoolVideoClipAnalysis.js
  - schoolVideoTranscriptExtraction.js
  - schoolVideoScriptGeneration.js
  - schoolVideoCaptionGeneration.js
  - schoolVideoMusicSelection.js

### 2. FFmpeg/Render Engine Integration
**Setup**:
1. Deploy FFmpeg worker (Docker or Lambda)
2. Update `schoolVideoRenderOrchestration.js`:
   ```javascript
   // Add render worker URL
   const RENDER_WORKER_URL = process.env.RENDER_WORKER_URL;
   
   // Queue job to worker
   const queueResponse = await fetch(`${RENDER_WORKER_URL}/queue`, {
     method: 'POST',
     body: JSON.stringify({
       render_job_id: renderJob.id,
       clips: clipData,
       script: scriptData,
       captions: captionData,
       music: musicData,
       output_format: render_config.format,
       callback_url: `${BASE_URL}/functions/schoolVideoRenderMonitor`
     })
   });
   ```

3. Worker processes and calls webhook:
   ```javascript
   POST /functions/schoolVideoRenderMonitor
   {
     "render_job_id": "...",
     "status": "completed",
     "output_url": "s3://...",
     "progress": 100
   }
   ```

### 3. YouTube Integration
**Setup**:
1. Create Google Cloud Project
2. Enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. In `schoolVideoPublishYoutube.js`:
   ```javascript
   // Fetch YouTube connection from OAuth
   const { accessToken } = await base44.asServiceRole.connectors.getConnection('youtube');
   
   // Upload video
   const response = await fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet,status', {
     method: 'POST',
     headers: { Authorization: `Bearer ${accessToken}` },
     body: JSON.stringify({
       snippet: {
         title: title,
         description: description,
         tags: ['school', 'bulldog']
       },
       status: { privacyStatus: 'public' }
     })
   });
   ```

### 4. Facebook Integration
**Setup**:
1. Create Facebook App
2. Get Page Access Token
3. In `schoolVideoPublishFacebook.js`:
   ```javascript
   // Use stored access token
   const accessToken = process.env.META_PAGE_ACCESS_TOKEN; // Already set ✓
   
   // Upload video
   const response = await fetch('https://graph.facebook.com/v18.0/{page-id}/videos', {
     method: 'POST',
     body: formData, // multipart with video file
     headers: { Authorization: `Bearer ${accessToken}` }
   });
   ```

### 5. Instagram Integration
**Setup**:
Same as Facebook (using Meta Business API)
```javascript
// Upload Reel
const response = await fetch('https://graph.instagram.com/v18.0/{user-id}/ig_videos', {
  method: 'POST',
  body: formData, // multipart with video file
  headers: { Authorization: `Bearer ${accessToken}` }
});
```

## How to Use (For Developers)

### Option A: Automatic (Event-Driven)
1. User approves submission → clip ingestion starts automatically
2. Admin sets project status to 'ready_for_ai' → script generation starts
3. Admin sets project status to 'queued_for_render' → render job queued
4. Admin approves project → publishing queued to all enabled platforms

### Option B: Manual (Dashboard Buttons)
Add buttons to AdminSchoolProjects:
```jsx
<Button onClick={() => SchoolVideoEngine.startProductionPipeline(projectId)}>
  Auto Start Pipeline
</Button>

<Button onClick={() => SchoolVideoEngine.publishVideo(projectId, ['gallery', 'youtube'])}>
  Publish
</Button>

<Button onClick={() => SchoolVideoEngine.getProjectStatus(projectId)}>
  Check Status
</Button>
```

### Option C: Programmatic (Helper Module)
```javascript
import SchoolVideoEngine from '@/components/school-tv/schoolVideoEngine';

// Start pipeline
await SchoolVideoEngine.startProductionPipeline(projectId, {
  render_config: {
    engine: 'ffmpeg',
    format: 'mp4',
    resolution: '1920x1080'
  }
});

// Get real-time status
const status = await SchoolVideoEngine.getProjectStatus(projectId);

// Publish to platforms
await SchoolVideoEngine.publishVideo(projectId, ['gallery', 'youtube', 'facebook']);

// Get published URLs
const urls = await SchoolVideoEngine.getPublishedUrls(projectId);
```

## Testing the Services

### 1. Test Clip Analysis
```javascript
await base44.functions.invoke('schoolVideoClipAnalysis', {
  clip_id: 'test-clip-1',
  media_url: 'https://example.com/test-video.mp4',
  media_type: 'video'
});
```

### 2. Test Script Generation
```javascript
await base44.functions.invoke('schoolVideoScriptGeneration', {
  project_id: 'proj1'
});
```

### 3. Test Render Orchestration
```javascript
await base44.functions.invoke('schoolVideoRenderOrchestration', {
  project_id: 'proj1',
  render_config: {
    engine: 'ffmpeg',
    format: 'mp4',
    resolution: '1920x1080'
  }
});
```

### 4. Test Publishing
```javascript
await base44.functions.invoke('schoolVideoPublishingOrchestration', {
  project_id: 'proj1',
  publish_targets: [
    { platform: 'gallery' },
    { platform: 'youtube' }
  ]
});
```

## Webhook Testing

Use ngrok or similar to expose local webhook:
```bash
ngrok http 3000

# Then POST to:
curl -X POST http://YOUR_NGROK_URL/functions/schoolVideoRenderMonitor \
  -H "Content-Type: application/json" \
  -d '{
    "render_job_id": "render-123",
    "status": "completed",
    "output_url": "https://example.com/video.mp4"
  }'
```

## Environment Variables / Secrets

**Already Set** ✓
- `OPENAI_API_KEY` - For analysis, script generation, captions
- `META_PAGE_ACCESS_TOKEN` - For Facebook publishing
- `META_INSTAGRAM_ACCOUNT_ID` - For Instagram publishing

**To Set** (when implementing)
- `RENDER_WORKER_URL` - Your FFmpeg/render service URL
- `GOOGLE_OAUTH_CLIENT_ID` / `GOOGLE_OAUTH_CLIENT_SECRET` - For YouTube
- `YOUTUBE_CHANNEL_ID` - Target YouTube channel
- `PIKA_API_KEY` - If using Pika for rendering
- `RUNWAY_API_KEY` - If using Runway for rendering
- `HEYGEN_API_KEY` - Already set ✓, if using HeyGen

## Architecture Guarantees

✓ **No UI Changes** - All existing pages work unchanged
✓ **No Entity Schema Changes** - All entities backward compatible
✓ **Modular** - Each service can be tested independently
✓ **Extensible** - New render engines/platforms easily added
✓ **Observable** - Full logging for debugging
✓ **Resilient** - Automatic retry with exponential backoff
✓ **Secure** - Service role isolation, API key management
✓ **Scalable** - Queue-based job distribution

## Next Steps

1. **Week 1**: Implement FFmpeg render worker
2. **Week 2**: Integrate YouTube API
3. **Week 3**: Integrate Facebook/Instagram APIs
4. **Week 4**: Add admin dashboard UI for pipeline monitoring
5. **Week 5**: Advanced features (real-time progress, ML sequencing, etc.)

## Support & Debugging

All functions include:
- Structured logging with `[Service Name]` prefix
- Full error messages and stack traces
- Webhook confirmation logs
- Queue position tracking

Check Base44 function logs for real-time debugging:
Dashboard → Code → Functions → [function_name] → Logs