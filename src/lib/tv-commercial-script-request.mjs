// Read-only browser request orchestration for the public TV script tool.
// The backend intentionally requires authentication and may rate-limit requests.
export function tvScriptErrorMessage(error) {
  const code = error?.response?.status ?? error?.status ?? error?.data?.status;
  if (code === 401) return 'Please sign in to generate a script, then try again.';
  if (code === 429) return 'Too many requests right now. Please try again later.';
  return 'We could not generate your script right now. Please try again.';
}

export async function runTvCommercialScriptRequest({ form, invoke, onLoading, onScript, onError }) {
  if (!form?.businessName?.trim() || !form?.industry?.trim() || !form?.serviceArea?.trim()) return false;

  onLoading(true);
  onScript('');
  onError('');

  try {
    const response = await invoke('generateTvCommercialScript', {
      businessName: form.businessName,
      industry: form.industry,
      serviceArea: form.serviceArea,
      offer: form.offer,
      duration: form.duration,
      tone: form.tone,
    });
    const script = response?.data?.script;
    if (typeof script !== 'string' || !script.trim()) {
      throw new Error('Script text unavailable');
    }
    onScript(script);
    return true;
  } catch (error) {
    // Never show raw backend errors or request details to public visitors.
    onError(tvScriptErrorMessage(error));
    return false;
  } finally {
    onLoading(false);
  }
}
