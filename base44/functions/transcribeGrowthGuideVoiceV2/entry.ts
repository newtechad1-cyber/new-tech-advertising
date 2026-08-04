import { secrets } from 'base44:runtime';

const FUNCTION_VERSION = 'v2-direct-2026-08-04-deploy-sync';
const MAX_BASE64_LENGTH = 8_000_000;
const ALLOWED_AUDIO_TYPES: Record<string, string> = {
  'audio/webm': 'webm',
  'audio/mp4': 'm4a',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/mpeg': 'mp3'
};

type FailureStage =
  | 'REQUEST_DECODING'
  | 'SECRET_ACCESS'
  | 'AUDIO_DECODING'
  | 'AUDIO_FILE_CREATION'
  | 'MULTIPART_CREATION'
  | 'OPENAI_REQUEST'
  | 'OPENAI_RESPONSE';

const decodeBase64 = (value: string) => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
};

const transcriptionFailure = (status: number, providerMessage = '') => {
  const safeMessage = providerMessage
    .replace(/sk-[A-Za-z0-9_-]+/g, '[redacted-key]')
    .replace(/Bearer\\s+\\S+/gi, 'Bearer [redacted]')
    .slice(0, 240);

  if (status === 401 || status === 403) {
    return Response.json({
      error: 'Voice transcription could not authenticate with OpenAI. Check the OPENAI_API_KEY secret in Base44.',
      diagnostic_code: 'OPENAI_AUTH_FAILED',
      provider_message: safeMessage || undefined
    }, { status: 502 });
  }
  if (status === 429) {
    return Response.json({
      error: 'Voice transcription is temporarily busy. Please wait a moment and try again.',
      diagnostic_code: 'OPENAI_RATE_LIMITED'
    }, { status: 503 });
  }
  if (status === 400 || status === 415 || status === 422) {
    return Response.json({
      error: 'OpenAI could not read this recording format. Please record again or type your message.',
      diagnostic_code: 'OPENAI_AUDIO_REJECTED'
    }, { status: 422 });
  }
  return Response.json({
    error: 'OpenAI did not complete the transcription. Please try again.',
    diagnostic_code: `OPENAI_HTTP_${status}`
  }, { status: 502 });
};

export default async function (req: Request): Promise<Response> {
  let stage: FailureStage = 'REQUEST_DECODING';

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

    stage = 'SECRET_ACCESS';
    let apiKey = await Promise.resolve(secrets.get('OPENAI_API_KEY'));
    if (!apiKey) {
      apiKey = await Promise.resolve(secrets.get('OpenAI'));
    }
    if (!apiKey) {
      return Response.json({
        error: 'Voice transcription is not configured. Add the OPENAI_API_KEY secret in Base44.',
        diagnostic_code: 'OPENAI_KEY_MISSING'
      }, { status: 503 });
    }

    stage = 'AUDIO_DECODING';
    const audioBytes = decodeBase64(audioBase64);

    stage = 'AUDIO_FILE_CREATION';
    const audioFile = new File(
      [audioBytes],
      `talk-to-my-office-v2.${extension}`,
      { type: mimeType }
    );
    if (audioFile.size < 1_000) {
      return Response.json({ error: 'The recording did not contain enough audio to transcribe.' }, { status: 422 });
    }

    stage = 'MULTIPART_CREATION';
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');
    formData.append(
      'prompt',
      'New Tech Advertising, NTA, Talk to My Office, Digital Growth Guide, Growth Roadmap, Knowledge Library.'
    );

    stage = 'OPENAI_REQUEST';
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
      let providerMessage = '';
      try {
        const providerError = await openAIResponse.clone().json();
        providerMessage = typeof providerError?.error?.message === 'string'
          ? providerError.error.message
          : '';
      } catch {
        // Keep the stable diagnostic response if OpenAI did not return JSON.
      }
      return transcriptionFailure(openAIResponse.status, providerMessage);
    }

    stage = 'OPENAI_RESPONSE';
    const transcription = await openAIResponse.json();
    const transcript = String(transcription?.text || '').trim();

    if (!transcript) {
      return Response.json({ error: 'No speech was detected in the recording.' }, { status: 422 });
    }

    return Response.json({ transcript, function_version: FUNCTION_VERSION });
  } catch (error) {
    console.error('transcribeGrowthGuideVoiceV2 failed', {
      stage,
      name: error instanceof Error ? error.name : 'UnknownError'
    });
    return Response.json({
      error: `Voice transcription stopped during ${stage.toLowerCase().replaceAll('_', ' ')}.`,
      diagnostic_code: `${stage}_FAILED`,
      function_version: FUNCTION_VERSION
    }, { status: 500 });
  }
}
