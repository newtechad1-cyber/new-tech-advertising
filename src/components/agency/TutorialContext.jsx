import React, { createContext, useContext, useState, useCallback } from 'react';

const LS_KEY = 'agency_tutorial_completed';

export const STEPS = [
  {
    id: 1,
    route: '/agency',
    title: 'Daily Command Center',
    text: 'This is your command center. Start here every day and follow the Next Best Actions.',
    highlight: 'daily-command-panel',
  },
  {
    id: 2,
    route: '/agency/leads',
    title: 'Leads',
    text: 'This is where all incoming leads live. Review and update contact information here.',
    highlight: 'leads-table',
  },
  {
    id: 3,
    route: '/agency/pipeline',
    title: 'Sales Pipeline',
    text: 'This is your sales pipeline. Move deals through stages as you progress the sale.',
    highlight: 'pipeline-board',
  },
  {
    id: 4,
    route: '/agency/spoke-campaigns',
    title: 'Spoke Campaigns',
    text: 'Each campaign generates marketing content for a client.',
    highlight: 'campaign-list',
  },
  {
    id: 5,
    route: '/agency/spoke-campaigns',
    title: 'Campaign Actions',
    text: 'Use these actions to generate content assets for the campaign.',
    highlight: 'campaign-actions',
    requiresFirstCampaign: true,
  },
  {
    id: 6,
    route: '/agency/spoke-campaigns',
    title: 'Review & Approve Content',
    text: 'Review and approve content before it is scheduled.',
    highlight: 'campaign-assets',
  },
  {
    id: 7,
    route: '/agency/spoke-campaigns',
    title: 'Schedule Approved Content',
    text: 'This sends approved content into the Social Queue.',
    highlight: 'schedule-approved-btn',
  },
  {
    id: 8,
    route: '/agency/social-queue',
    title: 'Social Queue',
    text: 'This is where scheduled posts live. Everything going out should appear here.',
    highlight: 'social-queue-table',
  },
  {
    id: 9,
    route: '/agency',
    title: 'Back to Dashboard',
    text: 'This will now reflect what\'s scheduled and what needs to be done next.',
    highlight: 'daily-command-panel',
  },
];

export const HELP_TOOLTIPS = {
  'daily-command-panel': 'Your daily command center. Follow the Next Best Actions to run your day.',
  'leads-table': 'All incoming leads. Review and update contact info here.',
  'pipeline-board': 'Sales pipeline. Move deals through stages as you progress.',
  'campaign-list': 'Spoke campaigns. Each one generates marketing content for a client.',
  'campaign-actions': 'Generate content assets for this campaign.',
  'campaign-assets': 'Review and approve content before it is scheduled.',
  'schedule-approved-btn': 'Sends approved content into the Social Queue.',
  'social-queue-table': 'Scheduled posts. Everything going out lives here.',
};

const TutorialContext = createContext(null);

export function TutorialProvider({ children }) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [helpMode, setHelpMode] = useState(false);
  const [firstCampaignId, setFirstCampaignId] = useState(null);

  const isCompleted = () => localStorage.getItem(LS_KEY) === 'true';

  const start = useCallback(() => {
    setStepIndex(0);
    setActive(true);
  }, []);

  const next = useCallback(() => {
    setStepIndex(i => {
      if (i >= STEPS.length - 1) {
        setActive(false);
        localStorage.setItem(LS_KEY, 'true');
        return 0;
      }
      return i + 1;
    });
  }, []);

  const back = useCallback(() => {
    setStepIndex(i => Math.max(0, i - 1));
  }, []);

  const skip = useCallback(() => {
    setActive(false);
    localStorage.setItem(LS_KEY, 'true');
    setStepIndex(0);
  }, []);

  const toggleHelp = useCallback(() => setHelpMode(h => !h), []);

  const currentStep = STEPS[stepIndex];

  return (
    <TutorialContext.Provider value={{
      active, start, next, back, skip,
      stepIndex, currentStep, totalSteps: STEPS.length,
      helpMode, toggleHelp,
      firstCampaignId, setFirstCampaignId,
      isCompleted,
    }}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  return useContext(TutorialContext);
}