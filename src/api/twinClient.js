import { base44 } from '@/api/base44Client';

export async function triggerTwinAgent(webhookUrl, payload) {
  const response = await base44.functions.invoke('triggerTwinAgent', {
    webhook_url: webhookUrl,
    payload,
  });

  if (response.data?.error) {
    throw new Error(response.data.error);
  }

  return response.data?.result ?? response.data ?? {};
}
