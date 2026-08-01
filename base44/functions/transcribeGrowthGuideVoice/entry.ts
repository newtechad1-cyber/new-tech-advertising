import OpenAI from 'npm:openai';

const MAX_BASE64_LENGTH = 8_000_000;
const ALLOWED_AUDIO_TYPES: Record<string, string> = {
  'audio/webm': 'webm',
  'audio/mp4': 'm4a',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/mpeg': 'mp3'
};

const decodeBase64 = (value: string) => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
};

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const audioBase64 = typeof body?.audio_base64 === 'string' ? body.audio_base64 : '';
    const mimeType = String(body?.mime_type || '').split(';')[0].toLowerCase();
    const extension = ALLOWED_AUDIO_TYPES[mimeType];

    if (!audioBase64 || !extension) {
      return Response.json({ error: 'A supported audio recording is required.' }, { status: 400 });
    }
    if (audioBase64.length > MAX_BASE64_LENGTH) {
      return Response.json({ error: 'The recording is too long. Please keep it under one minute.' }, { status: 413 });
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OpenAI');
    if (!apiKey) throw new Error('OpenAI transcription is not configured');

    const audioFile = new File(
      [decodeBase64(audioBase64)],
      `talk-to-my-office.${extension}`,
      { type: mimeType }
    );
    if (audioFile.size < 1_000) {
      return Response.json({ error: 'The recording did not contain enough audio to transcribe.' }, { status: 422 });
    }
    const openai = new OpenAI({ apiKey });
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      prompt: 'New Tech Advertising, NTA, Talk to My Office, Digital Growth Guide, Growth Roadmap, Knowledge Library.'
    });
    const transcript = String(transcription?.text || '').trim();

    if (!transcript) {
      return Response.json({ error: 'No speech was detected in the recording.' }, { status: 422 });
    }

    return Response.json({ transcript });
  } catch (error) {
    console.error('transcribeGrowthGuideVoice failed', error);
    return Response.json({
      error: error instanceof Error && error.message.includes('configured')
        ? 'Voice transcription is not configured in Base44 yet.'
        : 'The recording reached NTA, but could not be transcribed. Please try again.'
    }, { status: 500 });
  }
});
