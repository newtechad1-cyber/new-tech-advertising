import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Track new user first actions and milestones
 * Returns state for:
 * - Whether to show welcome banner
 * - Which actions user has completed
 * - Whether to show success modals
 */

export const useFirstValueTracking = (userId) => {
  const [state, setState] = useState({
    isNewUser: false,
    showWelcome: false,
    completedActions: [],
    lastCompletedAction: null,
    showSuccessModal: false,
    isLoading: true
  });

  // Load user's first-time state on mount
  useEffect(() => {
    const loadUserState = async () => {
      try {
        if (!userId) {
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        // Check for onboarding profile
        const profiles = await base44.entities.OnboardingProfile.filter(
          { userId },
          '-createdAt',
          1
        );

        if (profiles.length === 0) {
          // New user - create tracking record
          const profile = await base44.entities.OnboardingProfile.create({
            userId,
            onboardingStatus: 'welcome_shown',
            firstActionAt: null,
            completedActions: JSON.stringify([])
          });

          setState(prev => ({
            ...prev,
            isNewUser: true,
            showWelcome: true,
            isLoading: false
          }));
        } else {
          const profile = profiles[0];
          const completed = profile.completedActions 
            ? JSON.parse(profile.completedActions) 
            : [];

          setState(prev => ({
            ...prev,
            isNewUser: false,
            showWelcome: profile.onboardingStatus !== 'welcome_dismissed',
            completedActions: completed,
            isLoading: false
          }));
        }
      } catch (error) {
        console.error('Error loading user onboarding state:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadUserState();
  }, [userId]);

  // Track when user completes first action
  const trackFirstAction = useCallback(async (actionId) => {
    try {
      const profiles = await base44.entities.OnboardingProfile.filter(
        { userId },
        '-createdAt',
        1
      );

      if (profiles.length === 0) return;

      const profile = profiles[0];
      const completed = profile.completedActions 
        ? JSON.parse(profile.completedActions) 
        : [];

      // Add action if not already completed
      if (!completed.includes(actionId)) {
        completed.push(actionId);

        await base44.entities.OnboardingProfile.update(profile.id, {
          completedActions: JSON.stringify(completed),
          firstActionAt: profile.firstActionAt || new Date().toISOString(),
          onboardingStatus: 'first_action_completed'
        });

        setState(prev => ({
          ...prev,
          completedActions: completed,
          lastCompletedAction: actionId,
          showSuccessModal: true
        }));

        // Track analytics
        base44.analytics.track({
          eventName: 'diy_first_action_completed',
          properties: { actionType: actionId }
        });
      }
    } catch (error) {
      console.error('Error tracking first action:', error);
    }
  }, [userId]);

  // Dismiss welcome banner
  const dismissWelcome = useCallback(async () => {
    try {
      const profiles = await base44.entities.OnboardingProfile.filter(
        { userId },
        '-createdAt',
        1
      );

      if (profiles.length > 0) {
        await base44.entities.OnboardingProfile.update(profiles[0].id, {
          onboardingStatus: 'welcome_dismissed'
        });
      }

      setState(prev => ({ ...prev, showWelcome: false }));

      base44.analytics.track({
        eventName: 'diy_welcome_dismissed',
        properties: {}
      });
    } catch (error) {
      console.error('Error dismissing welcome:', error);
    }
  }, [userId]);

  // Close success modal
  const closeSuccessModal = useCallback(() => {
    setState(prev => ({ ...prev, showSuccessModal: false }));
  }, []);

  return {
    ...state,
    trackFirstAction,
    dismissWelcome,
    closeSuccessModal
  };
};