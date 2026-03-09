/**
 * Video Processing Service Configuration
 * Defines integration points for external video processing tools
 * This is the service layer architecture for the video engine
 */

export const VideoProcessingServices = {
  // Clip Analysis & Extraction
  clipAnalysis: {
    name: 'Clip Analysis',
    description: 'AI-powered video analysis for quality, emotion, and scene detection',
    provider: 'openai_vision',
    alternative_providers: ['anthropic_vision', 'google_vision'],
    inputs: ['video_url', 'photo_url'],
    outputs: ['quality_score', 'energy_score', 'emotional_tone', 'scene_description', 'ai_tags'],
    webhook: '/functions/schoolVideoClipAnalysis'
  },

  // Transcript Extraction
  transcription: {
    name: 'Speech-to-Text',
    description: 'Extract transcripts from video and audio content',
    provider: 'openai_whisper',
    alternative_providers: ['google_speech_to_text', 'aws_transcribe'],
    inputs: ['video_url', 'audio_url'],
    outputs: ['transcript', 'confidence_scores', 'speaker_identification'],
    webhook: '/functions/schoolVideoTranscriptExtraction',
    config: {
      language: 'en-US',
      include_timestamps: true,
      speaker_labels: true
    }
  },

  // Script Generation
  scriptGeneration: {
    name: 'AI Script Writer',
    description: 'Generate compelling video scripts from clips and briefs',
    provider: 'openai_gpt4',
    alternative_providers: ['anthropic_claude', 'google_palm'],
    inputs: ['clip_data', 'project_brief', 'branding_context', 'tone_style'],
    outputs: ['full_script', 'hook_line', 'call_to_action', 'scene_breakdown'],
    webhook: '/functions/schoolVideoScriptGeneration',
    config: {
      max_length: 2000,
      tone_options: ['inspiring', 'energetic', 'warm', 'proud', 'documentary', 'celebratory'],
      include_metadata: true
    }
  },

  // Caption/Subtitle Generation
  captionGeneration: {
    name: 'Caption Generator',
    description: 'Generate SRT captions and subtitles',
    provider: 'openai_gpt',
    alternative_providers: ['rev_api', 'googleapis_video_intelligence'],
    inputs: ['transcript', 'script', 'timing_data'],
    outputs: ['srt_file', 'caption_timing', 'speaker_labels'],
    webhook: '/functions/schoolVideoCaptionGeneration'
  },

  // Music Selection
  musicSelection: {
    name: 'Music Recommender',
    description: 'Select appropriate music based on video characteristics',
    provider: 'openai_analysis',
    inputs: ['project_type', 'tone', 'activity_type', 'duration'],
    outputs: ['recommended_style', 'music_references', 'timing_suggestions'],
    webhook: '/functions/schoolVideoMusicSelection',
    config: {
      music_library: 'school_royalty_free',
      bpm_range: [80, 140],
      genres: ['uplifting', 'inspiring', 'energetic', 'documentary']
    }
  },

  // Video Rendering
  videoRendering: {
    name: 'Video Renderer',
    description: 'Assemble clips into final video with effects and captions',
    provider: 'ffmpeg',
    alternative_providers: ['pika_ai', 'runway_gen3', 'heygen'],
    inputs: ['clips', 'script', 'captions', 'music', 'branding'],
    outputs: ['video_file', 'thumbnail', 'preview_video'],
    webhook: '/functions/schoolVideoRenderOrchestration',
    config: {
      formats: {
        landscape: { resolution: '1920x1080', ratio: '16:9', codec: 'h264' },
        square: { resolution: '1080x1080', ratio: '1:1', codec: 'h264' },
        vertical: { resolution: '1080x1920', ratio: '9:16', codec: 'h264' }
      },
      quality_presets: ['draft', 'preview', 'final'],
      timeout_minutes: 60,
      max_concurrent_jobs: 3
    }
  },

  // Publishing Orchestration
  publishing: {
    name: 'Publishing Manager',
    description: 'Multi-platform video publishing orchestration',
    provider: 'custom',
    platforms: {
      gallery: {
        name: 'Internal Gallery',
        webhook: '/functions/schoolVideoPublishGallery',
        config: { format: 'mp4', quality: 'hd' }
      },
      youtube: {
        name: 'YouTube',
        webhook: '/functions/schoolVideoPublishYoutube',
        requires_auth: true,
        config: { privacy: 'public', category: 'Education', tags: ['school'] }
      },
      facebook: {
        name: 'Facebook',
        webhook: '/functions/schoolVideoPublishFacebook',
        requires_auth: true,
        config: { privacy: 'public', auto_captions: true }
      },
      instagram: {
        name: 'Instagram Reels',
        webhook: '/functions/schoolVideoPublishInstagram',
        requires_auth: true,
        config: { format: 'vertical', duration: '15-90s' }
      },
      website_download: {
        name: 'Website Download',
        webhook: '/functions/schoolVideoPublishWebsite',
        config: { format: 'mp4', quality: 'hd', watermark: true }
      }
    }
  }
};

/**
 * Job Status Lifecycle
 */
export const JobStatusLifecycle = {
  clip_ingestion: ['queued', 'processing', 'completed', 'failed'],
  clip_analysis: ['pending', 'analyzing', 'completed', 'failed'],
  transcript_extraction: ['pending', 'processing', 'completed', 'failed'],
  script_generation: ['pending', 'generating', 'generated', 'failed'],
  caption_generation: ['pending', 'generating', 'completed', 'failed'],
  music_selection: ['pending', 'analyzing', 'recommended', 'failed'],
  video_rendering: ['queued', 'preparing', 'processing', 'rendering', 'completed', 'failed'],
  publishing: ['queued', 'preparing', 'publishing', 'published', 'scheduled', 'failed']
};

/**
 * Error Handling & Retry Strategy
 */
export const RetryStrategy = {
  maxRetries: 3,
  backoffMultiplier: 2,
  initialDelayMs: 5000,
  maxDelayMs: 300000, // 5 minutes
  retryableErrors: [
    'NETWORK_ERROR',
    'TIMEOUT',
    'RATE_LIMIT',
    'SERVICE_UNAVAILABLE'
  ]
};

/**
 * Service Priority Queue
 */
export const PriorityLevels = {
  high: 1,
  normal: 2,
  low: 3
};

export default VideoProcessingServices;