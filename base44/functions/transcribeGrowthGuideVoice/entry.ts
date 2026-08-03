import { secrets } from 'base44:runtime';

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

const transcriptionFailure = (status: number) => {
  if (status === 401 || status === 403) {
    return Response.json({
      error: 'Voice transcription could not authenticate with OpenAI. Check the OPENAI_API_KEY secret in Base44.'
    }, { status: 502 });
  }
  if (status === 429) {
    return Response.json({
      error: 'Voice transcription is temporarily busy. Please wait a moment and try again.'
    }, { status: 503 });
  }
  if (status === 400 || status === 415 || status === 422) {
    return Response.json({
      error: 'OpenAI could not read this recording format. Please record again or type your message.'
    }, { status: 422 });
  }
  return Response.json({
    error: 'OpenAI did not complete the transcription. Please try again.'
  }, { status: 502 });
};

export default async function (req: Request): Promise<Response> {
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

    const apiKey = secrets.get('OPENAI_API_KEY') || secrets.get('OpenAI');
    if (!apiKey) {
      return Response.json({
        error: 'Voice transcription is not configured. Add the OPENAI_API_KEY secret in Base44.'
      }, { status: 503 });
    }

    const audioFile = new File(
      [decodeBase64(audioBase64)],
      `talk-to-my-office.${extension}`,
      { type: mimeType }
    );
    if (audioFile.size < 1_000) {
      return Response.json({ error: 'The recording did not contain enough audio to transcribe.' }, { status: 422 });
    }

    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');
    formData.append(
      'prompt',
      'New Tech Advertising, NTA, Talk to My Office, Digital Growth Guide, Growth Roadmap, Knowledge Library.'
    );

    const openAIResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData
    });

    if (!openAIResponse.ok) {
      console.error('OpenAI transcription request failed', {
        status: openAIResponse.status,
        requestId: openAIResponse.headers.get('x-request-id')
      });
      return transcriptionFailure(openAIResponse.status);
    }

    const transcription = await openAIResponse.json();
    const transcript = String(transcription?.text || '').trim();

    if (!transcript) {
      return Response.json({ error: 'No speech was detected in the recording.' }, { status: 422 });
    }

    return Response.json({ transcript });
  } catch (error) {
    console.error('transcribeGrowthGuideVoice failed', error);
    return Response.json({
      error: 'The recording reached NTA, but the transcription function could not complete it.'
    }, { status: 500 });
  }
}
