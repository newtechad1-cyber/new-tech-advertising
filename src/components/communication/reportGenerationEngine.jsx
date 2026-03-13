/**
 * Report & Summary Generation Engine
 * Converts raw activity, metrics, and outcomes into client-facing narratives
 */

export const generateWeeklySummary = async (organizationId, metricsSnapshot, activityData) => {
  // activityData includes: content created/published, videos, leads, engagement signals
  const {
    contentPublished = 0,
    videosCreated = 0,
    leadsLogged = 0,
    postsEngagement = [],
    jobsCompleted = 0
  } = activityData;

  const sections = [];

  // Opening narrative based on activity level
  if (contentPublished > 0 || videosCreated > 0) {
    sections.push({
      title: "This Week's Activity",
      narrative: `Your team published ${contentPublished} pieces of content${videosCreated > 0 ? ` and created ${videosCreated} videos` : ''}. ${jobsCompleted > 0 ? `${jobsCompleted} automated assets were generated and ready for review.` : ''}`
    });
  }

  // Lead activity
  if (leadsLogged > 0) {
    sections.push({
      title: "Inbound Momentum",
      narrative: `You captured ${leadsLogged} qualified leads this week. Leads are coming from your content strategy.`
    });
  }

  // Top engagement signal
  if (postsEngagement.length > 0) {
    const topPost = postsEngagement.sort((a, b) => (b.engagement || 0) - (a.engagement || 0))[0];
    if (topPost) {
      sections.push({
        title: "What's Performing",
        narrative: `Your ${topPost.type || 'content'} on ${topPost.platform} is outperforming with ${topPost.engagement} engagements. This is the type of content your audience responds to.`
      });
    }
  }

  // If quiet week, suggest action
  if (contentPublished === 0 && leadsLogged === 0) {
    sections.push({
      title: "Low Activity Alert",
      narrative: "No content was published this week. Consistent publishing keeps your visibility strong and leads flowing."
    });
  }

  return {
    summary: sections,
    quickStats: {
      contentPublished,
      videosCreated,
      leadsLogged,
      jobsCompleted
    }
  };
};

export const generateMonthlyReport = async (organizationId, snapshot, monthlyData) => {
  // snapshot = latest GrowthMetricsSnapshot
  // monthlyData includes: campaigns run, content output, leads/deals, activities
  const {
    contentPublished = 0,
    videosCreated = 0,
    pagesPublished = 0,
    leadsLogged = 0,
    dealsClosedCount = 0,
    revenueAttributed = 0,
    campaignMetrics = [],
    onboardingProgress = null
  } = monthlyData;

  const report = {
    executiveSummary: {
      growthScore: snapshot?.growthScore || 0,
      momentumScore: snapshot?.momentumScore || 0,
      trendDirection: getTrendDirection(snapshot?.growthScore),
      keyMetric: snapshot?.revenueAttributed > 0 ? `$${(snapshot.revenueAttributed / 100).toLocaleString()} in attributed revenue` : "Growth in progress"
    },

    whatWeBuilt: {
      title: "Marketing Execution",
      content: buildWhatWeBuiltSection(contentPublished, videosCreated, pagesPublished, campaignMetrics)
    },

    whatImproved: {
      title: "Performance Improvements",
      content: buildWhatImprovedSection(snapshot?.growthScore, snapshot?.momentumScore, contentPublished)
    },

    leadsAndRevenue: {
      title: "Business Impact",
      leads: leadsLogged,
      deals: dealsClosedCount,
      revenueAttributed: snapshot?.revenueAttributed || 0,
      narrative: buildLeadsRevenueNarrative(leadsLogged, dealsClosedCount, snapshot?.revenueAttributed)
    },

    recommendations: {
      title: "What's Next",
      items: buildRecommendations(snapshot, monthlyData)
    },

    upgradeOpportunity: buildUpgradeOpportunity(snapshot?.upgradeReadinessScore, snapshot?.planKey)
  };

  return report;
};

const getTrendDirection = (growthScore) => {
  if (!growthScore) return "stabilizing";
  if (growthScore >= 80) return "accelerating";
  if (growthScore >= 60) return "progressing";
  if (growthScore >= 40) return "developing";
  return "early stage";
};

const buildWhatWeBuiltSection = (content, videos, pages, campaigns) => {
  const items = [];

  if (content > 0) {
    items.push(`Published ${content} content pieces to your blog and social channels`);
  }
  if (videos > 0) {
    items.push(`Created ${videos} videos for YouTube, social media, and your website`);
  }
  if (pages > 0) {
    items.push(`Generated ${pages} location or service pages to expand your web presence`);
  }
  if (campaigns.length > 0) {
    items.push(`Executed ${campaigns.length} campaigns targeting your core audience`);
  }

  return items.length > 0
    ? items.join(". ") + "."
    : "Your content strategy is being developed. More execution coming next month.";
};

const buildWhatImprovedSection = (growthScore, momentumScore, contentCount) => {
  const improvements = [];

  if (contentCount > 0) {
    improvements.push("Content consistency is building your authority");
  }
  if (momentumScore > 50) {
    improvements.push("Growth is accelerating week-over-week");
  }
  if (growthScore > 60) {
    improvements.push("Your overall growth score improved");
  }

  return improvements.length > 0
    ? improvements.join(". ") + "."
    : "Your marketing foundation is strengthening.";
};

const buildLeadsRevenueNarrative = (leads, deals, revenue) => {
  if (deals > 0) {
    return `You closed ${deals} deal${deals > 1 ? 's' : ''} worth $${(revenue / 100).toLocaleString()}. These came from inbound leads and your content's proof value.`;
  }
  if (leads > 0) {
    return `You captured ${leads} qualified lead${leads > 1 ? 's' : ''} this month. These are prospects interested in your services and ready for conversation.`;
  }
  return "Your lead generation is building. With consistent content, leads will increase.";
};

const buildRecommendations = (snapshot, data) => {
  const recs = [];

  if (snapshot?.contentPublishedCount < 4) {
    recs.push({
      action: "Increase Publishing Frequency",
      reason: "Consistent weekly content drives more leads and visibility"
    });
  }

  if (snapshot?.leadsLoggedCount === 0) {
    recs.push({
      action: "Add Lead Capture Mechanism",
      reason: "Your content needs a call-to-action and lead form to convert readers"
    });
  }

  if (snapshot?.growthScore < 50) {
    recs.push({
      action: "Expand Content Strategy",
      reason: "More channels, more topics, more formats = more visibility"
    });
  }

  if (snapshot?.upgradeReadinessScore > 70) {
    recs.push({
      action: "Explore Managed Service Upgrade",
      reason: "You're ready for professional execution and faster results"
    });
  }

  return recs.length > 0 ? recs : [{ action: "Maintain Momentum", reason: "Continue execution of your current strategy" }];
};

const buildUpgradeOpportunity = (readinessScore, currentPlan) => {
  if (!readinessScore || readinessScore < 65) {
    return null;
  }

  return {
    show: true,
    title: "Ready for Your Next Growth Phase?",
    narrative: "Your execution metrics show you're ready for professional management. Our team can take over content creation and strategy.",
    cta: "Schedule an Upgrade Conversation"
  };
};

export const generateMilestoneMessage = (organizationId, milestoneType, data) => {
  // milestoneType: 'first_content', 'first_lead', '100_leads', 'revenue_milestone', '90_day_anniversary'
  const messages = {
    first_content: {
      subject: "🎉 Your First Content is Live!",
      body: `Congratulations! Your first piece of content just went live. This is the foundation of your growth strategy.`
    },
    first_lead: {
      subject: "🎯 Your First Lead!",
      body: `Your first qualified lead came in from your content. This proves your strategy is working.`
    },
    revenue_milestone: {
      subject: `💰 You've Hit $${data.amount} in Revenue!`,
      body: `Your marketing is driving real business results. This revenue came from people who found you through your content and digital presence.`
    },
    anniversary: {
      subject: `📊 ${data.months} Month Growth Check-In`,
      body: `You've grown from day one. Your growth score is ${data.growthScore}, and you're capturing leads consistently.`
    }
  };

  return messages[milestoneType] || { subject: "Your Growth Update", body: "You're making progress." };
};

export const generateInactivityNudge = (organizationId, daysSinceActivity, lastActivity) => {
  if (daysSinceActivity < 7) {
    return null; // Don't nudge if active
  }

  return {
    subject: daysSinceActivity > 30 
      ? `Let's Get Back on Track` 
      : `Your Content Strategy is Paused`,
    body: `It's been ${daysSinceActivity} days since you published content. To keep leads flowing, post at least weekly.`,
    cta: "Create New Content"
  };
};

export const generateUpgradeRecommendation = (snapshot, currentPlan) => {
  if (!snapshot || snapshot.upgradeReadinessScore < 65) {
    return null;
  }

  const planUpgrades = {
    diy: "Guided Growth",
    guided_growth: "Done For You",
    done_for_you: "Premium"
  };

  const nextPlan = planUpgrades[currentPlan];

  return {
    subject: `You're Ready for ${nextPlan || 'Your Next Growth Phase'}`,
    body: `Your execution metrics show you're generating leads and growth. It's time to scale with professional help.`,
    cta: "Explore Upgrade Options"
  };
};