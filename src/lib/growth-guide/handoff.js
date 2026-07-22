export const HANDOFF_OPTIONS = [
  { type: 'schedule_growth_conversation', title: 'Schedule a conversation', description: 'Choose a time to talk with Rick about what the Growth Guide understood.' },
  { type: 'request_callback', title: 'Ask Rick to call me', description: 'Leave a phone number and a good time for a personal callback.' },
  { type: 'continue_by_email', title: 'Continue by email', description: 'Let Rick follow up by email after reviewing your discovery.' },
  { type: 'receive_summary', title: 'Email me my summary', description: 'Receive a copy of the understanding you just confirmed.' },
  { type: 'save_and_return', title: 'Save and return later', description: 'Keep this discovery available in this browser for 30 days.' },
];

export const contactRequirements = type => ({
  needsPhone: type === 'request_callback',
  needsEmail: ['continue_by_email', 'receive_summary'].includes(type),
  needsContact: ['request_callback', 'continue_by_email', 'receive_summary'].includes(type),
});

export const validateHandoffContact = (type, contact = {}) => {
  const { needsPhone, needsEmail } = contactRequirements(type);
  if (needsPhone && !/^[-+().\s\d]{7,20}$/.test(contact.phone?.trim() || '')) return 'Enter a valid phone number.';
  if (needsEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email?.trim() || '')) return 'Enter a valid email address.';
  return null;
};
