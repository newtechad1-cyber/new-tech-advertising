import { useMemo } from 'react';

/**
 * Determines the next recommended marketing step based on completed actions
 * Returns actionable suggestion with context
 */

const NEXT_STEP_LOGIC = {
  // After first action
  social_post: {
    nextActions: ['campaign', 'video_script', 'log_lead'],
    suggestion: {
      title: 'Your Post is Live!',
      message: 'Next, set up a campaign to automate more content and track performance.',
      recommendedAction: 'campaign',
      why: 'Campaigns multiply your reach by automating posts on a schedule.'
    }
  },
  campaign: {
    nextActions: ['social_post', 'video_script', 'log_lead'],
    suggestion: {
      title: 'Campaign is Running!',
      message: 'Next, create a video to drive 3x more engagement than text alone.',
      recommendedAction: 'video_script',
      why: 'Video content gets significantly higher engagement and shares.'
    }
  },
  video_script: {
    nextActions: ['social_post', 'campaign', 'log_lead'],
    suggestion: {
      title: 'Script Ready to Produce!',
      message: 'Next, create your first social post to start driving traffic today.',
      recommendedAction: 'social_post',
      why: 'Start with quick social wins while your video is being produced.'
    }
  },
  log_lead: {
    nextActions: ['social_post', 'campaign', 'video_script'],
    suggestion: {
      title: 'Lead Tracked!',
      message: 'Next, create content to attract more leads like this one.',
      recommendedAction: 'social_post',
      why: 'Content marketing is the fastest way to increase lead flow.'
    }
  }
};

export const useNextStepSuggestion = (completedActions = []) => {
  const suggestion = useMemo(() => {
    if (!completedActions || completedActions.length === 0) {
      return null;
    }

    // Get the most recent completed action
    const lastAction = completedActions[completedActions.length - 1];
    const logic = NEXT_STEP_LOGIC[lastAction];

    if (!logic) {
      return null;
    }

    // Filter out already completed actions
    const availableNextActions = logic.nextActions.filter(
      (action) => !completedActions.includes(action)
    );

    return {
      ...logic.suggestion,
      recommendedAction: logic.suggestion.recommendedAction,
      availableAlternatives: availableNextActions.filter(
        (a) => a !== logic.suggestion.recommendedAction
      )
    };
  }, [completedActions]);

  return suggestion;
};

/**
 * Returns the next action UI label for inline suggestions
 */
export const getNextActionLabel = (actionId) => {
  const labels = {
    social_post: 'Create a social post',
    campaign: 'Launch a campaign',
    video_script: 'Write a video script',
    log_lead: 'Log a lead'
  };
  return labels[actionId] || 'Take next action';
};