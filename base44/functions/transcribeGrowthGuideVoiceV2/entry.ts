// Retired legacy endpoint. The active public transcription route is
// transcribeGrowthGuideVoice, which applies trusted-origin and rate protections.
export default async function (): Promise<Response> {
  return Response.json({ error: 'This endpoint is retired.' }, { status: 410 });
}
