import React from 'react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import RestaurantHero from '@/components/restaurants/RestaurantHero';
import TeamKnowsSection from '@/components/restaurants/TeamKnowsSection';
import BuildTeamSection from '@/components/restaurants/BuildTeamSection';
import CustomersTeachSection from '@/components/restaurants/CustomersTeachSection';
import KnowledgeLibrarySection from '@/components/restaurants/KnowledgeLibrarySection';
import ConsistencySection from '@/components/restaurants/ConsistencySection';
import GrowthRoadmapSection from '@/components/restaurants/GrowthRoadmapSection';
import GrowWhatMattersSection from '@/components/restaurants/GrowWhatMattersSection';
import ConnectExistingSection from '@/components/restaurants/ConnectExistingSection';
import TechnologyPeopleSection from '@/components/restaurants/TechnologyPeopleSection';
import StartConversationSection from '@/components/restaurants/StartConversationSection';
import CaseStudyIntro from '@/components/restaurants/case-study/CaseStudyIntro';
import CaseStudyRoadmap from '@/components/restaurants/case-study/CaseStudyRoadmap';
import CaseStudyRoadmapPDF from '@/components/restaurants/case-study/CaseStudyRoadmapPDF';
import CaseStudyTeamCallout from '@/components/restaurants/case-study/CaseStudyTeamCallout';
import CaseStudyInProgress from '@/components/restaurants/case-study/CaseStudyInProgress';
import CaseStudyCTA from '@/components/restaurants/case-study/CaseStudyCTA';

export default function RestaurantSolutions() {
  return (
    <div className="bg-[#020617] min-h-screen text-slate-300 font-sans selection:bg-blue-500/30">
      <MarketingNav />
      <main className="pt-20">
        <RestaurantHero />
        <TeamKnowsSection />
        <BuildTeamSection />
        <CustomersTeachSection />
        <KnowledgeLibrarySection />
        <ConsistencySection />
        <GrowthRoadmapSection />
        <div id="cattlemans-case-study" className="scroll-mt-24">
          <div id="cattlemans-case-study" className="scroll-mt-24">
          <CaseStudyIntro />
        </div>
        </div>
        <CaseStudyRoadmap />
        <CaseStudyRoadmapPDF />
        <CaseStudyTeamCallout />
        <CaseStudyInProgress />
        <CaseStudyCTA />
        <GrowWhatMattersSection />
        <ConnectExistingSection />
        <TechnologyPeopleSection />
        <StartConversationSection />
      </main>
      <SiteFooter />
    </div>
  );
}