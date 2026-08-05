// Deployment stamp for the registered production transcription service.
const FUNCTION_VERSION = 'v1-direct-2026-08-05-production-sync-r3';
const MAX_BASE64_LENGTH = 8_000_000;
const OPENAI_TIMEOUT_MS = 25_000;
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

// Base44's client wraps non-2xx function responses in an opaque exception.
// Keep expected operational failures in a 200 JSON envelope so the visitor
// always receives the actual, safe diagnostic rather than a generic error.
const voiceError = (error: string, diagnosticCode: string, providerMessage = '') => {
  const safeProviderMessage = providerMessage
    .replace(/sk-[A-Za-z0-9_-]+/g, '[redacted-key]')
    .replace(/Bearer\s+\S+/gi, 'Bearer [redacted]')
    .slice(0, 240);

  return Response.json({
    error,
    diagnostic_code: diagnosticCode,
    provider_message: safeProviderMessage || undefined,
    function_version: FUNCTION_VERSION
  });
};

const transcriptionFailure = (status: number, providerMessage = '') => {
  if (status === 401 || status === 403) {
    return voiceError(
      'Voice transcription could not authenticate with OpenAI. The configured Base44 secret was rejected.',
      'OPENAI_AUTH_FAILED',
      providerMessage
    );
  }
  if (status === 429) {
    return voiceError(
      'Voice transcription is temporarily unavailable because OpenAI is rate-limited or billing is unavailable.',
      'OPENAI_RATE_LIMITED',
      providerMessage
    );
  }
  if (status === 400 || status === 415 || status === 422) {
    return voiceError(
      'OpenAI could not read this recording format. Please record again or type your message.',
      'OPENAI_AUDIO_REJECTED',
      providerMessage
    );
  }
  return voiceError(
    'OpenAI did not complete the transcription.',
    `OPENAI_HTTP_${status}`,
    providerMessage
  );
};

export default async function transcribeGrowthGuideVoice(req: Request): Promise<Response> {
  let stage: FailureStage = 'REQUEST_DECODING';

  try {
    const body = await req.json();
    const audioBase64 = typeof body?.audio_base64 === 'string' ? body.audio_base64 : '';
    const mimeType = String(body?.mime_type || '').split(';')[0].toLowerCase();
    const extension = ALLOWED_AUDIO_TYPES[mimeType];

    if (!audioBase64 || !extension) {
      return voiceError('A supported audio recording is required.', 'AUDIO_FORMAT_UNSUPPORTED');
    }
    if (audioBase64.length > MAX_BASE64_LENGTH) {
      return voiceError('The recording is too long. Please keep it under one minute.', 'AUDIO_TOO_LARGE');
    }

    stage = 'SECRET_ACCESS';
    const apiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OpenAI') || '';
    if (!apiKey) {
      return voiceError(
        'Voice transcription is not configured. Add the OPENAI_API_KEY secret in Base44.',
        'OPENAI_KEY_MISSING'
      );
    }

    stage = 'AUDIO_DECODING';
    const audioBytes = decodeBase64(audioBase64);

    stage = 'AUDIO_FILE_CREATION';
    const audioFile = new File(
      [audioBytes],
      `talk-to-my-office.${extension}`,
      { type: mimeType }
    );
    if (audioFile.size < 1_000) {
      return voiceError(
        'The recording did not contain enough audio to transcribe.',
        'AUDIO_TOO_SHORT'
      );
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
    let openAIResponse: Response;
    try {
      openAIResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: formData,
        signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS)
      });
    } catch (error) {
      if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
        return voiceError(
          'Voice transcription timed out while waiting for OpenAI. Please try again or type your message.',
          'OPENAI_REQUEST_TIMED_OUT'
        );
      }
      throw error;
    }

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
        // Preserve the stable diagnostic when OpenAI does not return JSON.
      }
      return transcriptionFailure(openAIResponse.status, providerMessage);
    }

    stage = 'OPENAI_RESPONSE';
    const transcription = await openAIResponse.json();
    const transcript = String(transcription?.text || '').trim();

    if (!transcript) {
      return voiceError('No speech was detected in the recording.', 'NO_SPEECH_DETECTED');
    }

    return Response.json({ transcript, function_version: FUNCTION_VERSION });
  } catch (error) {
    console.error('transcribeGrowthGuideVoice failed', {
      stage,
      name: error instanceof Error ? error.name : 'UnknownError'
    });
    return voiceError(
      `Voice transcription stopped during ${stage.toLowerCase().replaceAll('_', ' ')}.`,
      `${stage}_FAILED`
    );
  }
}
