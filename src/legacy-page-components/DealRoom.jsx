import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DealRoomWelcome from '@/components/deal-room/DealRoomWelcome.jsx';
import StrategyBlock from '@/components/deal-room/StrategyBlock.jsx';
import PlatformPreview from '@/components/deal-room/PlatformPreview.jsx';
import ProofLayer from '@/components/deal-room/ProofLayer.jsx';
import ImplementationPlan from '@/components/deal-room/ImplementationPlan.jsx';
import PricingOptions from '@/components/deal-room/PricingOptions.jsx';
import DecisionPanel from '@/components/deal-room/DecisionPanel.jsx';

export default function DealRoom() {
  const { company } = useParams();
  const [industry, setIndustry] = useState('Service');

  useEffect(() => {
    // Track that deal room was opened
    console.log(`Deal room opened for: ${company}`);
    
    // In production, would send analytics event here
    // base44.analytics.track({ eventName: 'deal_room_opened', properties: { company } });
  }, [company]);

  // In real scenario, would fetch company data from API
  const companyName = company?.replace(/-/g, ' ').toUpperCase() || 'Your Business';

  return (
    <div className="min-h-screen bg-white">
      {/* Welcome Section */}
      <DealRoomWelcome company={companyName} industry={industry} />

      {/* Strategy Summary */}
      <StrategyBlock />

      {/* Platform Preview */}
      <PlatformPreview />

      {/* Proof Layer */}
      <ProofLayer industry={industry} />

      {/* Implementation Timeline */}
      <ImplementationPlan />

      {/* Pricing Options */}
      <PricingOptions />

      {/* Decision Action Panel */}
      <DecisionPanel />
    </div>
  );
}