import React, { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { Loader2, Eye, BarChart2, CheckCircle2 } from 'lucide-react';
import NTACommandNav from '@/components/nta-command/NTACommandNav';
import DRHeader from '@/components/nta-deal-room/DRHeader';
import DRStrategyHero from '@/components/nta-deal-room/DRStrategyHero';
import DRVisibilitySnapshot from '@/components/nta-deal-room/DRVisibilitySnapshot';
import DRGrowthPlan from '@/components/nta-deal-room/DRGrowthPlan';
import DRROIZone from '@/components/nta-deal-room/DRROIZone';
import DRProofStack from '@/components/nta-deal-room/DRProofStack';
import DRProcessTimeline from '@/components/nta-deal-room/DRProcessTimeline';
import DRFAQSection from '@/components/nta-deal-room/DRFAQSection';
import DRStickyFooter from '@/components/nta-deal-room/DRStickyFooter';

const SECTIONS = ['strategy', 'visibility', 'plan', 'roi', 'proof', 'process', 'faq'];

export default function NTADealRoom() {
  const urlParams = new URLSearchParams(window.location.search);
  const dealRoomId = urlParams.get('id');
  const oppId = urlParams.get('opp');

  const [dealRoom, setDealRoom] = useState(null);
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [viewedSections, setViewedSections] = useState(new Set());

  const sectionRefs = {
    strategy: useRef(null),
    visibility: useRef(null),
    plan: useRef(null),
    roi: useRef(null),
    proof: useRef(null),
    process: useRef(null),
    faq: useRef(null),
  };

  // Load data
  useEffect(() => {
    const load = async () => {
      try {
        if (dealRoomId) {
          const rooms = await base44.entities.DealRoom.filter({ id: dealRoomId });
          if (rooms?.[0]) setDealRoom(rooms[0]);
        }
        if (oppId) {
          const opps = await base44.entities.SalesOpportunity.filter({ id: oppId });
          if (opps?.[0]) setOpportunity(opps[0]);
        }
        // If neither, load most recent from pipeline for demo purposes
        if (!dealRoomId && !oppId) {
          const opps = await base44.entities.SalesOpportunity.filter({ stage: 'proposal_sent' }, '-updated_date', 1);
          if (opps?.[0]) setOpportunity(opps[0]);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [dealRoomId, oppId]);

  // Track view + record activity
  useEffect(() => {
    if (!dealRoom) return;
    const now = new Date().toISOString();
    base44.entities.DealRoom.update(dealRoom.id, {
      view_count: (dealRoom.view_count || 0) + 1,
      last_viewed_at: now,
    }).catch(console.error);
    base44.entities.DealRoomActivity.create({
      deal_room_id: dealRoom.id,
      activity_type: 'viewed',
    }).catch(console.error);
  }, [dealRoom?.id]);

  // Intersection observer for section tracking
  useEffect(() => {
    const observers = [];
    SECTIONS.forEach(sec => {
      const el = sectionRefs[sec]?.current;
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setViewedSections(prev => new Set([...prev, sec]));
          if (dealRoom) {
            base44.entities.DealRoomActivity.create({
              deal_room_id: dealRoom.id,
              activity_type: 'section_viewed',
              section_name: sec,
            }).catch(() => {});
          }
        }
      }, { threshold: 0.3 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [dealRoom?.id]);

  const scrollToProposal = () => {
    sectionRefs.plan?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const trackCTA = useCallback((label) => {
    if (!dealRoom) return;
    base44.entities.DealRoomActivity.create({
      deal_room_id: dealRoom.id,
      activity_type: 'cta_clicked',
      cta_label: label,
    }).catch(() => {});
    base44.entities.DealRoom.update(dealRoom.id, {
      cta_clicks: (dealRoom.cta_clicks || 0) + 1,
    }).catch(() => {});
  }, [dealRoom]);

  const handleAccept = async () => {
    setAccepting(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    try {
      if (dealRoom) {
        await base44.entities.DealRoom.update(dealRoom.id, { status: 'accepted', accepted_at: today });
        await base44.entities.DealRoomActivity.create({ deal_room_id: dealRoom.id, activity_type: 'accepted' });
      }
      if (opportunity) {
        await base44.entities.SalesOpportunity.update(opportunity.id, {
          stage: 'verbal_yes',
          last_activity_date: today,
        });
      }
      trackCTA('Accept Plan');
      setAccepted(true);
    } catch (e) { console.error(e); }
    setAccepting(false);
  };

  const handleCallRequest = () => {
    trackCTA('Schedule Call');
    if (dealRoom) base44.entities.DealRoomActivity.create({ deal_room_id: dealRoom.id, activity_type: 'call_requested' }).catch(() => {});
  };

  const handleChangeRequest = () => {
    trackCTA('Request Changes');
    if (dealRoom) base44.entities.DealRoomActivity.create({ deal_room_id: dealRoom.id, activity_type: 'changes_requested' }).catch(() => {});
  };

  // Derive display data from deal room or opportunity fallback
  const company = dealRoom?.company_name || opportunity?.company_name || 'Your Business';
  const industry = dealRoom?.industry || opportunity?.industry;
  const city = dealRoom?.city || opportunity?.city;
  const packageTier = dealRoom?.package_tier || 'authority';
  const monthlyFee = dealRoom?.monthly_fee || opportunity?.deal_value || 1997;
  const setupFee = dealRoom?.setup_fee || 2497;
  const contractTerm = dealRoom?.contract_term_months || 12;
  const startDate = dealRoom?.start_date || format(new Date(), 'yyyy-MM-dd');
  const totalValue = dealRoom?.total_contract_value || monthlyFee * contractTerm + setupFee;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-600/20 border-2 border-green-500/50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-white text-3xl font-black mb-3">You're In!</h2>
          <p className="text-slate-300 text-base mb-4">
            Welcome to NTA, {company.split(' ')[0]}. Your growth journey starts now. We'll be in touch within 24 hours to schedule your onboarding call.
          </p>
          <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-5 text-left">
            <p className="text-slate-400 text-sm mb-2">What happens next:</p>
            {['Onboarding call scheduled within 24 hours', 'Strategy & brand intake sent via email', 'Content calendar built in week 1', 'First content goes live within 2 weeks'].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      <NTACommandNav />
      {/* Engagement indicator (top bar for operator awareness) */}
      {viewedSections.size > 0 && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-blue-950/80 backdrop-blur-sm border-b border-blue-800/40 px-4 py-1.5 flex items-center gap-3">
          <Eye className="w-3 h-3 text-blue-400" />
          <span className="text-blue-300 text-xs">Prospect actively reading</span>
          <div className="flex gap-1 ml-2">
            {SECTIONS.map(s => (
              <div key={s} className={`w-2 h-2 rounded-full ${viewedSections.has(s) ? 'bg-blue-400' : 'bg-slate-700'}`} />
            ))}
          </div>
          <span className="text-blue-400 text-xs ml-auto">{viewedSections.size}/{SECTIONS.length} sections viewed</span>
        </div>
      )}

      <div className={viewedSections.size > 0 ? 'pt-8' : ''}>
        <DRHeader company={company} industry={industry} city={city} strategyTitle={dealRoom?.strategy_title} />

        <div ref={sectionRefs.strategy}>
          <DRStrategyHero company={company} industry={industry} city={city} onScrollToProposal={scrollToProposal} />
        </div>

        <div ref={sectionRefs.visibility}>
          <DRVisibilitySnapshot industry={industry} />
        </div>

        <div ref={sectionRefs.plan}>
          <DRGrowthPlan
            packageTier={packageTier}
            monthlyFee={monthlyFee}
            setupFee={setupFee}
            contractTerm={contractTerm}
            startDate={startDate}
            totalValue={totalValue}
          />
        </div>

        <div ref={sectionRefs.roi}>
          <DRROIZone industry={industry} monthlyFee={monthlyFee} />
        </div>

        <div ref={sectionRefs.proof}>
          <DRProofStack />
        </div>

        <div ref={sectionRefs.process}>
          <DRProcessTimeline />
        </div>

        <div ref={sectionRefs.faq}>
          <DRFAQSection />
        </div>
      </div>

      <DRStickyFooter
        monthlyFee={monthlyFee}
        setupFee={setupFee}
        startDate={startDate}
        contractTerm={contractTerm}
        packageName={packageTier}
        onAccept={handleAccept}
        onCallRequest={handleCallRequest}
        onChangeRequest={handleChangeRequest}
        accepting={accepting}
      />
    </div>
  );
}