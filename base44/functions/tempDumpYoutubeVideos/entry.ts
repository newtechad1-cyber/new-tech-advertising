// Retired internal debugging endpoint.
// Public YouTube content is available only through getYouTubePlaylist.
Deno.serve(() => Response.json(
  { error: 'This endpoint is retired.' },
  { status: 410 },
));