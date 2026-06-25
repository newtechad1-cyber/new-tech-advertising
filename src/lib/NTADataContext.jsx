import React, { createContext, useContext, useState } from 'react';

const NTADataContext = createContext();

export const useNTAData = () => {
  const context = useContext(NTADataContext);
  if (!context) {
    throw new Error('useNTAData must be used within an NTADataProvider');
  }
  return context;
};

export const NTADataProvider = ({ children }) => {
  // 1. Core Business & Growth Data
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [growthScores, setGrowthScores] = useState([]);
  const [growthStages, setGrowthStages] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  
  // 2. Ecosystem Users
  const [communityPartners, setCommunityPartners] = useState([]);
  const [aiLearners, setAiLearners] = useState([]);
  
  // 3. Conversational & Relationship Data
  const [discoveryConversations, setDiscoveryConversations] = useState([]);
  const [relationshipBuilderResults, setRelationshipBuilderResults] = useState([]);
  
  // 4. Infrastructure & Integrations (Placeholders)
  const [meetingScheduling, setMeetingScheduling] = useState({ status: 'idle', provider: null });
  const [pdfGeneration, setPdfGeneration] = useState({ status: 'idle', queue: 0 });
  const [emailAutomation, setEmailAutomation] = useState({ status: 'idle', pending: 0 });
  const [crmSync, setCrmSync] = useState({ status: 'connected', lastSync: new Date().toISOString() });

  const value = {
    // State Access
    data: {
      businessProfiles,
      growthScores,
      growthStages,
      roadmaps,
      communityPartners,
      aiLearners,
      discoveryConversations,
      relationshipBuilderResults,
      meetingScheduling,
      pdfGeneration,
      emailAutomation,
      crmSync
    },
    // Setters (For future external API wiring)
    actions: {
      setBusinessProfiles,
      setGrowthScores,
      setGrowthStages,
      setRoadmaps,
      setCommunityPartners,
      setAiLearners,
      setDiscoveryConversations,
      setRelationshipBuilderResults,
      setMeetingScheduling,
      setPdfGeneration,
      setEmailAutomation,
      setCrmSync
    }
  };

  return (
    <NTADataContext.Provider value={value}>
      {children}
    </NTADataContext.Provider>
  );
};