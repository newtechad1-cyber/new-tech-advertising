import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
    try {
        const apiKey = Deno.env.get("YOUTUBE_API_KEY");
        const playlistId = Deno.env.get("YOUTUBE_PLAYLIST_ID");

        if (!apiKey || !playlistId) {
            return Response.json({ error: 'YouTube credentials not configured' }, { status: 500 });
        }

        const headers = {
            "Referer": "https://www.newtechadvertising.com/"
        };

        // 1. Get playlist items
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
        const playlistResponse = await fetch(playlistUrl, { headers });
        const playlistData = await playlistResponse.json();

        if (playlistData.error) {
            return Response.json({ error: playlistData.error.message }, { status: 500 });
        }

        if (!playlistData.items || playlistData.items.length === 0) {
            return Response.json({ videos: [] });
        }

        const videoIds = playlistData.items.map(item => item.contentDetails.videoId).join(',');

        // 2. Get video details (for duration and better snippets)
        const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${apiKey}`;
        const videosResponse = await fetch(videosUrl, { headers });
        const videosData = await videosResponse.json();

        if (videosData.error) {
            return Response.json({ error: videosData.error.message }, { status: 500 });
        }

        const videos = videosData.items.map(video => {
            // parse ISO 8601 duration
            const durationIso = video.contentDetails.duration;
            const match = durationIso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            let durationStr = '';
            if (match) {
                const h = parseInt(match[1] || 0);
                const m = parseInt(match[2] || 0);
                const s = parseInt(match[3] || 0);
                if (h > 0) durationStr += `${h}:`;
                durationStr += `${h > 0 ? m.toString().padStart(2, '0') : m}:${s.toString().padStart(2, '0')}`;
            }

            // Slugify the title
            const slug = video.snippet.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            // find max resolution thumbnail
            const thumbnails = video.snippet.thumbnails;
            const thumbnailUrl = thumbnails?.maxres?.url || thumbnails?.standard?.url || thumbnails?.high?.url || thumbnails?.medium?.url || thumbnails?.default?.url || null;

            return {
                title: video.snippet.title,
                description: video.snippet.description,
                youtubeId: video.id,
                youtubeUrl: `https://youtu.be/${video.id}`,
                embedUrl: `https://www.youtube.com/embed/${video.id}`,
                thumbnailUrl: thumbnailUrl,
                publishedAt: video.snippet.publishedAt,
                duration: durationStr,
                slug: slug
            };
        });

        return Response.json({ videos });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});