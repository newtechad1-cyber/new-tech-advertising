import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getJourneyMemory, addCompletedModule, updateLearningProgress } from '@/lib/journeyMemory';

const ExperienceContext = createContext(null);

export function ExperienceProvider({ children }) {
  const [memory, setMemory] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMemory(getJourneyMemory());
  }, []);

  // Sync memory on route change to track navigation and prepare for future AI personalization
  useEffect(() => {
    setMemory(getJourneyMemory());
    // Future expansion: Record path visit history for AI contextualization
  }, [location.pathname]);

  const updateMemory = () => {
    setMemory(getJourneyMemory());
  };

  const completeModule = (moduleId) => {
    addCompletedModule(moduleId);
    updateMemory();
  };

  const launchPresentation = (path) => {
    navigate(path);
  };

  const resumeJourney = () => {
    if (memory?.roadmaps?.length > 0) return '/growth-roadmap-generator';
    if (memory?.businessScore) return '/my-growth-journey';
    return '/business-score';
  };

  return (
    <ExperienceContext.Provider value={{
      memory,
      updateMemory,
      completeModule,
      launchPresentation,
      resumeJourney,
      currentRoute: location.pathname
    }}>
      {children}
    </ExperienceContext.Provider>
  );
}

export const useExperience = () => useContext(ExperienceContext);