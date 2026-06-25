/**
 * Journey Memory™
 * 
 * Internal memory layer to track visitor progress through the NTA Operating System.
 * Currently uses local storage. Prepared for future CRM synchronization.
 */

const STORAGE_KEY = 'nta_journey_memory';

const defaultMemory = {
  // Visitor Identity
  visitor: {
    name: '',
    role: '',
    focus: ''
  },
  // Growth Guide State
  guideState: {
    step: 0
  },
  // Core Tracking
  completedConversations: [],
  businessScore: null,
  growthStage: null,
  roadmaps: [],
  learningProgress: {},
  recommendedModules: [],
  completedModules: [],
  meetingHistory: [],
  futureGoals: [],
  // Sync
  lastSyncedAt: null
};

export const getJourneyMemory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    // Merge nested objects to avoid undefined errors if schema changes
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultMemory,
        ...parsed,
        visitor: { ...defaultMemory.visitor, ...(parsed.visitor || {}) },
        guideState: { ...defaultMemory.guideState, ...(parsed.guideState || {}) },
        learningProgress: { ...defaultMemory.learningProgress, ...(parsed.learningProgress || {}) }
      };
    }
    return { ...defaultMemory };
  } catch (error) {
    console.error('Error reading Journey Memory:', error);
    return { ...defaultMemory };
  }
};

export const updateJourneyMemory = (updates) => {
  try {
    const current = getJourneyMemory();
    const updated = { 
        ...current, 
        ...updates,
        visitor: { ...current.visitor, ...(updates.visitor || {}) },
        guideState: { ...current.guideState, ...(updates.guideState || {}) },
        learningProgress: { ...current.learningProgress, ...(updates.learningProgress || {}) }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error updating Journey Memory:', error);
    return getJourneyMemory();
  }
};

export const resetJourneyMemory = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMemory));
  return { ...defaultMemory };
};

// Specific tracking helpers

export const updateVisitorProfile = (profile) => {
  return updateJourneyMemory({ visitor: profile });
};

export const updateGuideState = (state) => {
  return updateJourneyMemory({ guideState: state });
};

export const addCompletedConversation = (conversationId) => {
  const current = getJourneyMemory();
  if (!current.completedConversations.includes(conversationId)) {
    return updateJourneyMemory({
      completedConversations: [...current.completedConversations, conversationId]
    });
  }
  return current;
};

export const setBusinessScore = (score) => {
  return updateJourneyMemory({ businessScore: score });
};

export const setGrowthStage = (stage) => {
  return updateJourneyMemory({ growthStage: stage });
};

export const addRoadmap = (roadmap) => {
  const current = getJourneyMemory();
  return updateJourneyMemory({
    roadmaps: [...current.roadmaps, roadmap]
  });
};

export const updateLearningProgress = (moduleId, progress) => {
  return updateJourneyMemory({
    learningProgress: { [moduleId]: progress }
  });
};

export const addRecommendedModule = (moduleId) => {
    const current = getJourneyMemory();
    if (!current.recommendedModules.includes(moduleId)) {
      return updateJourneyMemory({
        recommendedModules: [...current.recommendedModules, moduleId]
      });
    }
    return current;
};

export const addCompletedModule = (moduleId) => {
  const current = getJourneyMemory();
  if (!current.completedModules.includes(moduleId)) {
    return updateJourneyMemory({
      completedModules: [...current.completedModules, moduleId]
    });
  }
  return current;
};

export const addMeeting = (meeting) => {
  const current = getJourneyMemory();
  return updateJourneyMemory({
    meetingHistory: [...current.meetingHistory, meeting]
  });
};

export const addFutureGoal = (goal) => {
  const current = getJourneyMemory();
  if (!current.futureGoals.includes(goal)) {
    return updateJourneyMemory({
      futureGoals: [...current.futureGoals, goal]
    });
  }
  return current;
};