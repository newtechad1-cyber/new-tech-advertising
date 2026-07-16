export const OPERATING_ACCOUNTS = [
  { key: 'nta', label: 'New Tech Advertising', aliases: ['nta', 'new tech advertising'] },
  { key: 'johnson-heating', label: 'Johnson Heating', aliases: ['johnson heating'] },
  { key: 'monson-plumbing', label: 'Monson Plumbing', aliases: ['monson plumbing'] },
];

export const normalizeAccountName = (value = '') => value
  .toLowerCase()
  .replace(/[^a-z0-9]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export function getOperatingAccount(client) {
  const name = normalizeAccountName(client?.business_name);
  return OPERATING_ACCOUNTS.find(account =>
    account.aliases.some(alias => name === alias || name.startsWith(`${alias} `))
  ) || null;
}

export const isOperatingAccount = (client) => Boolean(getOperatingAccount(client));

