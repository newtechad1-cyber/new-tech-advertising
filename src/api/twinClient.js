export async function triggerTwinAgent(webhookUrl, payload) {
  console.log('[TwinAgent] Triggering webhook:', webhookUrl, 'Payload:', payload);

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-NTA-KEY': 'e762e17c5dafa164dcae394bb01324ed2eef644edd45e621389666be4fbb4910',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error('[TwinAgent] Request failed:', response.status, response.statusText);
    throw new Error(`TwinAgent handoff failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json().catch(() => ({}));
  console.log('[TwinAgent] Success:', result);
  return result;
}