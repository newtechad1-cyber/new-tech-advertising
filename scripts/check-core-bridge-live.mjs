// This check uses no contacts, visitor tokens or secrets. The public handler
// sends only fixed, authenticated connection_check metadata to three Core receivers.
const endpoint = 'https://base44.app/api/apps/691f41a18de4a7f498c8f884/functions/ntaUnifiedIntake';
const receivers = ['ntaUnifiedIntake', 'submitRecruitingApplication', 'trackBookEvent'];
try {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://newtechadvertising.com' },
    body: JSON.stringify({ connection_check: true }),
    signal: AbortSignal.timeout(25000),
  });
  const body = await response.json();
  if (response.status !== 200 || body.connection_ready !== true ||
      !receivers.every(name => body.connections?.[name] === true)) {
    console.error('Live Core connection is not ready. Confirm the identical NTA_CORE_BRIDGE_SECRET value is saved in both apps, then run this check again.');
    process.exitCode = 1;
  } else {
    console.log('Live public-to-Core authentication passed for all three receivers. No leads, audits or emails were created.');
  }
} catch {
  console.error('Live Core connection could not be verified. Resolve the connection before publishing.');
  process.exitCode = 1;
}
