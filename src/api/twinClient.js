const NTA_KEY = 'e762e17c5dafa164dcae394bb01324ed2eef644edd45e621389666be4fbb4910';

export async function triggerTwinAgent(webhookUrl, payload) {
  console.log('[TwinAgent] POST →', webhookUrl, payload);

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-NTA-KEY': NTA_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error('[TwinAgent] Failed:', response.status, response.statusText);
    throw new Error(`TwinAgent request failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json().catch(() => ({}));
  console.log('[TwinAgent] Success:', result);
  return result;
}