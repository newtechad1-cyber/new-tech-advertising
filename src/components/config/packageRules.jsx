// Package configuration and SLA rules
export const PACKAGE_RULES = {
  diy: {
    id: 'diy',
    name: 'DIY Package',
    price: 0,
    postsPerWeek: null, // Unlimited
    sla: 'Immediate (self-service)',
    priority: 3,
    features: [
      'Full content creation tools',
      'Unlimited posts',
      'Self-scheduling',
      'No team support'
    ]
  },
  collaborative: {
    id: 'collaborative',
    name: '$197 Collaborative',
    price: 197,
    postsPerWeek: 5,
    sla: '2-3 business days',
    priority: 2,
    features: [
      'Up to 5 posts per week',
      'You provide content & media',
      'We schedule and post',
      'Email support'
    ]
  },
  done_for_you: {
    id: 'done_for_you',
    name: '$297 Done-For-You',
    price: 297,
    postsPerWeek: 10,
    sla: '24-48 hours',
    priority: 1,
    features: [
      'Up to 10 posts per week',
      'Full content creation',
      'Priority scheduling',
      'Dedicated support'
    ]
  }
};

// Helper to get package by ID or default
export const getPackageConfig = (packageId) => {
  return PACKAGE_RULES[packageId] || PACKAGE_RULES.collaborative;
};

// Check if user has exceeded weekly limit
export const checkWeeklyLimit = (packageId, submissionsThisWeek) => {
  const config = getPackageConfig(packageId);
  if (!config.postsPerWeek) return { canSubmit: true, remaining: null };
  
  const remaining = config.postsPerWeek - submissionsThisWeek;
  return {
    canSubmit: remaining > 0,
    remaining: Math.max(0, remaining),
    limit: config.postsPerWeek
  };
};

// Get start of current week (Monday)
export const getWeekStart = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
};