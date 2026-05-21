import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const response = await base44.functions.invoke('getYouTubePlaylist', {});
        const ytVideos = response.data.videos || [];
        
        const summary = ytVideos.map(v => ({ id: v.youtubeId, title: v.title, slug: v.slug }));
        
        return Response.json({ summary });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});