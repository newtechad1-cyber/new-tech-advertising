import fs from 'node:fs';
const rollout = JSON.parse(fs.readFileSync('docs/security/core-bridge/rollout.json', 'utf8'));
const pending = [];
for (const name of ['ntaUnifiedIntake', 'submitRecruitingApplication', 'publicationSignup', 'trackBookEvent']) {
  const source = fs.readFileSync(`base44/functions/${name}/entry.ts`, 'utf8');
  if (!source.includes("Deno.env.get('NTA_CORE_BRIDGE_SECRET')") || !source.includes("headers: { 'x-nta-core-bridge-secret': secret }")) pending.push(name);
}
const recruiting = fs.readFileSync('src/pages/RegionalAccountManager.jsx', 'utf8');
if (/recruitingIntake|createClient/.test(recruiting)) pending.push('public recruiting form still calls Core directly');
if (rollout.stage !== 'active_source_verified') pending.push('Core receiver changes have not been activated and source-verified');
if (pending.length) {
  console.error('Release pending: save NTA_CORE_BRIDGE_SECRET in both Base44 apps, then activate and verify the prepared connection changes.');
  pending.forEach(item => console.error('- ' + item));
  process.exitCode = 1;
} else console.log('Core bridge source checks passed. Published behavior and email delivery still require live verification.');
