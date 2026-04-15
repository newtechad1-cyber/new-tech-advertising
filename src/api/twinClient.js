export async function triggerTwinAgent(webhookUrl, payload) {
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NTA-KEY': 'e762e17c5dafa164dcae394bb01324ed2eef644edd45e621389666be4fbb4910',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Twin Agent Handoff Failed', error);
  }
}