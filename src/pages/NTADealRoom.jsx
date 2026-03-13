import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams, useNavigate } from 'react-router-dom';
import DealRoomSummary from '@/components/deal-room/DealRoomSummary';
import DealRoomPlans from '@/components/deal-room/DealRoomPlans';
import DealRoomTestimonials from '@/components/deal-room/DealRoomTestimonials';
import DealRoomCTA from '@/components/deal-room/DealRoomCTA';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function NTADealRoom() {
  const { prospectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [opportunity, setOpportunity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOpportunity = async () => {
      try {
        const opp = await base44.entities.SalesOpportunity.read(prospectId);
        if (!opp) {
          setError('Opportunity not found');
          return;
        }
        setOpportunity(opp);

        // Track engagement
        await base44.entities.SalesOpportunity.update(prospectId, {
          engagement_score: (opp.engagement_score || 0) + 1,
        });
      } catch (err) {
        console.error('Error loading opportunity:', err);
        setError('Failed to load opportunity');
      } finally {
        setLoading(false);
      }
    };

    if (prospectId) {
      loadOpportunity();
    }
  }, [prospectId]);

  const handleSelectPlan = async (planKey) => {
    if (planKey === 'schedule_call') {
      window.location.href = `mailto:${opportunity.contact_email}?subject=Schedule Strategy Call`;
      return;
    }

    if (planKey === 'accept') {
      // Update proposal status
      try {
        await base44.entities.SalesOpportunity.update(prospectId, {
          proposal_status: 'accepted',
          decision_status: 'verbal_yes',
          decision_timeline: 'immediate',
        });

        alert('Thank you! We will contact you shortly to begin onboarding.');
      } catch (err) {
        console.error('Error accepting proposal:', err);
      }
      return;
    }

    // Start DIY / Choose plan
    try {
      await base44.entities.SalesOpportunity.update(prospectId, {
        target_plan: planKey,
        proposal_status: 'discussed',
      });

      // Redirect to checkout or signup
      window.location.href = '/nta/diy-growth-system';
    } catch (err) {
      console.error('Error selecting plan:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Opportunity Not Found</h1>
          <p className="text-slate-400 mb-6">{error || 'Unable to load this deal room'}</p>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-slate-300 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-bold text-white">{opportunity.company_name} Deal Room</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* Summary */}
          <DealRoomSummary opportunity={opportunity} />

          {/* Plans */}
          <DealRoomPlans
            opportunity={opportunity}
            onSelectPlan={handleSelectPlan}
          />

          {/* Testimonials */}
          <DealRoomTestimonials />

          {/* Final CTA */}
          <DealRoomCTA
            opportunity={opportunity}
            onSelectPlan={handleSelectPlan}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 border-t border-slate-700 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-400 text-sm">
          <p>Questions? Email us at sales@newtechadvertising.com</p>
        </div>
      </div>
    </div>
  );
}