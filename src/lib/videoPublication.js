// Machine-readable video dates must include the original time and timezone.
// Never turn a calendar date into an invented publication time.
export function isVideoPublicationTimestamp(value) {
  return typeof value === 'string'
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)
    && Number.isFinite(Date.parse(value));
}

export function requireVideoPublicationTimestamp(value, context = 'video') {
  if (!isVideoPublicationTimestamp(value)) {
    throw new Error('Missing verified publication timestamp with timezone: ' + context);
  }
  return value;
}
