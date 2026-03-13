/**
 * NTA Client Success + Retention Engine
 * Tracks engagement, streaks, milestones, and health
 */

/**
 * Calculate growth score based on activity and outcomes
 */
export const calculateGrowthScore = (metrics) => {
  if (!metrics) return 0;

  let score = 0;

  // Activity basis (30 points)
  score += Math.min(30, (metrics.campaigns_launched || 0) * 5);

  // Content creation (25 points)
  const videoPoints = Math.min(15, (metrics.videos_created || 0) * 3);
  const seoPoints = Math.min(10, (metrics.seo_pages_published || 0) * 2);
  score += videoPoints + seoPoints;

  // Outcomes (25 points)
  const leadPoints = Math.min(20, (metrics.leads_logged || 0) * 2);
  const postPoints = Math.min(5, (metrics.posts_created || 0) * 0.5);
  score += leadPoints + postPoints;

  // Momentum bonus (20 points)
  if (metrics.streak_weeks && metrics.streak_weeks > 0) {
    score += Math.min(20, metrics.streak_weeks * 5);
  }

  return Math.min(100, score);
};

/**
 * Determine growth trend based on score history
 */
export const calculateGrowthTrend = (scoreHistory) => {
  if (!scoreHistory || scoreHistory.length < 2) return 'stable';

  const recent = scoreHistory.slice(-3);
  const scores = recent.map((s) => s.score || 0);

  if (scores[scores.length - 1] > scores[0] + 5) {
    return 'improving';
  } else if (scores[scores.length - 1] < scores[0] - 5) {
    return 'declining';
  }
  return 'stable';
};

/**
 * Calculate streak based on last active date
 */
export const calculateStreak = (lastActiveDate, streakDays, streakWeeks) => {
  if (!lastActiveDate) {
    return { streakDays: 0, streakWeeks: 0 };
  }

  const today = new Date();
  const lastActive = new Date(lastActiveDate);
  const daysSinceActive = Math.floor(
    (today - lastActive) / (1000 * 60 * 60 * 24)
  );

  // If more than 1 day has passed, reset streak
  if (daysSinceActive > 1) {
    return { streakDays: 0, streakWeeks: 0 };
  }

  // If active today or yesterday, maintain/continue streak
  if (daysSinceActive <= 1) {
    return {
      streakDays: (streakDays || 0) + 1,
      streakWeeks: Math.ceil((streakDays + 1) / 7),
    };
  }

  return { streakDays: 0, streakWeeks: 0 };
};

/**
 * Detect milestone achievements
 */
export const detectMilestones = (metrics, previousMetrics) => {
  const milestones = [];

  // First campaign
  if (
    !previousMetrics?.milestone_first_campaign &&
    metrics.campaigns_launched > 0
  ) {
    milestones.push({
      type: 'first_campaign',
      title: 'Campaign Launched! 🚀',
      message: 'Your first marketing campaign is now live!',
      icon: 'rocket',
    });
  }

  // First video
  if (!previousMetrics?.milestone_first_video && metrics.videos_created > 0) {
    milestones.push({
      type: 'first_video',
      title: 'First Video Created! 🎬',
      message: 'Your first AI video is ready to engage your audience.',
      icon: 'video',
    });
  }

  // First lead
  if (!previousMetrics?.milestone_first_lead && metrics.leads_logged > 0) {
    milestones.push({
      type: 'first_lead',
      title: 'First Lead Logged! 📊',
      message: 'You are now tracking real business outcomes.',
      icon: 'trending-up',
    });
  }

  // 30 days active
  if (
    !previousMetrics?.milestone_30_days &&
    metrics.days_since_signup >= 30 &&
    metrics.streak_days > 7
  ) {
    milestones.push({
      type: '30_days',
      title: '30 Days of Momentum! 🎉',
      message: 'You are building real marketing consistency.',
      icon: 'calendar',
    });
  }

  // Growth score milestones
  if (
    !previousMetrics?.milestone_growth_score_50 &&
    metrics.growth_score >= 50
  ) {
    milestones.push({
      type: 'growth_score_50',
      title: 'Growth Score Milestone! 📈',
      message: 'You are halfway to maximum growth score.',
      icon: 'zap',
    });
  }

  if (
    !previousMetrics?.milestone_growth_score_75 &&
    metrics.growth_score >= 75
  ) {
    milestones.push({
      type: 'growth_score_75',
      title: 'Master Level Achieved! 👑',
      message: 'Your growth strategy is performing exceptionally.',
      icon: 'crown',
    });
  }

  return milestones;
};

/**
 * Detect inactivity and return rescue level
 */
export const detectInactivity = (metrics) => {
  const inactiveDays = metrics.inactive_days || 0;

  if (inactiveDays === 0) {
    return { level: 'active', message: null };
  }

  if (inactiveDays >= 1 && inactiveDays < 7) {
    return {
      level: 'warning',
      message:
        'Keep your momentum going—post something today to maintain your streak!',
      actionText: 'View Dashboard',
    };
  }

  if (inactiveDays >= 7 && inactiveDays < 14) {
    return {
      level: 'alert',
      message:
        'We miss you! Your marketing is on pause. Get back to it and regain your momentum.',
      actionText: 'Resume Marketing',
    };
  }

  if (inactiveDays >= 14) {
    return {
      level: 'critical',
      message:
        'Your marketing has been quiet for 2+ weeks. Let us help you get back on track.',
      actionText: 'Talk to Our Team',
    };
  }

  return { level: 'active', message: null };
};

/**
 * Calculate retention health score
 */
export const calculateRetentionHealth = (metrics) => {
  if (!metrics) return 0;

  let health = 50; // Base score

  // Streak contribution (max +30)
  health += Math.min(30, (metrics.streak_weeks || 0) * 5);

  // Growth score contribution (max +20)
  health += Math.min(20, (metrics.growth_score || 0) * 0.2);

  // Activity contribution (max +20)
  const totalActivity =
    (metrics.campaigns_launched || 0) +
    (metrics.videos_created || 0) +
    (metrics.leads_logged || 0);
  health += Math.min(20, totalActivity * 2);

  // Penalize inactivity (max -40)
  health -= Math.min(40, (metrics.inactive_days || 0) * 2);

  return Math.max(0, Math.min(100, health));
};

/**
 * Generate weekly focus plan
 */
export const generateWeeklyFocusPlan = (metrics, subscription) => {
  const tasks = [];

  // Base tasks for all users
  tasks.push({
    id: 'daily_post',
    title: 'Create 1 Social Post',
    description: 'Use AI to generate a relevant post for your audience',
    points: 10,
    completed: false,
  });

  tasks.push({
    id: 'weekly_plan',
    title: 'Plan Weekly Content',
    description: 'Map out your 3 main topics for the week',
    points: 15,
    completed: false,
  });

  // Growth-specific tasks
  if (metrics.campaigns_launched === 0) {
    tasks.push({
      id: 'first_campaign',
      title: 'Launch First Campaign',
      description: 'Set up your initial marketing campaign',
      points: 30,
      completed: false,
      priority: 'high',
    });
  }

  if (metrics.videos_created === 0 && metrics.campaigns_launched > 0) {
    tasks.push({
      id: 'first_video',
      title: 'Create First Video',
      description: 'Use AI Video Studio to create an intro video',
      points: 25,
      completed: false,
      priority: 'high',
    });
  }

  if (metrics.leads_logged === 0) {
    tasks.push({
      id: 'log_leads',
      title: 'Log First Leads',
      description: 'Start tracking leads from your marketing',
      points: 20,
      completed: false,
    });
  }

  // Optimization task if advanced
  if (metrics.campaigns_launched > 2) {
    tasks.push({
      id: 'analyze_performance',
      title: 'Review Performance Metrics',
      description: 'Check which content is driving results',
      points: 15,
      completed: false,
    });
  }

  return tasks;
};

/**
 * Weekly summary of wins
 */
export const getWeeklyWinsSummary = (metrics) => {
  const wins = [];

  if (metrics.posts_created > 0) {
    wins.push({
      label: 'Posts Created',
      value: metrics.posts_created,
      icon: 'share2',
      change:
        metrics.tasks_completed_this_week > 0 ? '+' : '→',
    });
  }

  if (metrics.videos_created > 0) {
    wins.push({
      label: 'Videos Generated',
      value: metrics.videos_created,
      icon: 'video',
      change: '✓',
    });
  }

  if (metrics.seo_pages_published > 0) {
    wins.push({
      label: 'SEO Pages',
      value: metrics.seo_pages_published,
      icon: 'search',
      change: '↗',
    });
  }

  if (metrics.leads_logged > 0) {
    wins.push({
      label: 'Leads Logged',
      value: metrics.leads_logged,
      icon: 'trending-up',
      change: '📈',
    });
  }

  return wins;
};