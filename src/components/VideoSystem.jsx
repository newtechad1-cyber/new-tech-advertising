import React from 'react';

function getYouTubeEmbedUrl(urlOrId) {
  if (!urlOrId) return '';
  if (urlOrId.includes('/embed/')) return urlOrId;
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return `https://www.youtube.com/embed/${urlOrId}`;
  }
  try {
    const url = new URL(urlOrId);
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace('/', '').trim();
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (url.pathname.includes('/shorts/')) {
        const id = url.pathname.split('/shorts/')[1]?.split('/')[0];
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
    }
  } catch (e) {
    return '';
  }
  return '';
}

export default function VideoSystem({
  video,
  title = 'Video',
  format = 'landscape',
  maxWidth,
  className = '',
  priority = false,
  rounded = '16px',
  shadow = true,
  border = true,
  autoplay = false,
  muted = false,
  controls = true,
  modestBranding = true,
  rel = 0,
}) {
  const embedBase = getYouTubeEmbedUrl(video);

  if (!embedBase) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          maxWidth: maxWidth || '960px',
          margin: '0 auto',
          padding: '24px',
          borderRadius: rounded,
          background: '#111',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        Invalid YouTube URL or video ID
      </div>
    );
  }

  const params = new URLSearchParams();
  if (autoplay) params.set('autoplay', '1');
  if (muted) params.set('mute', '1');
  if (!controls) params.set('controls', '0');
  if (modestBranding) params.set('modestbranding', '1');
  params.set('rel', String(rel));
  params.set('playsinline', '1');

  const src = `${embedBase}?${params.toString()}`;
  const isPortrait = format === 'portrait';

  return (
    <div className={className} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: maxWidth || (isPortrait ? '315px' : '960px'),
          aspectRatio: isPortrait ? '9 / 16' : '16 / 9',
          minHeight: isPortrait ? '560px' : '315px',
          borderRadius: rounded,
          overflow: 'hidden',
          background: '#000',
          border: border ? '1px solid rgba(255,255,255,0.12)' : 'none',
          boxShadow: shadow ? '0 25px 50px rgba(0,0,0,0.35)' : 'none',
        }}
      >
        <iframe
          src={src}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading={priority ? 'eager' : 'lazy'}
          referrerPolicy="strict-origin-when-cross-origin"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 0,
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}