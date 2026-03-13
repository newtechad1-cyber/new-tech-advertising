import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import FunnelProgress from '@/components/nta-demo-funnel/FunnelProgress';
import NTASiteGuide from '@/components/nta-guide/NTASiteGuide';
import StepQualification from '@/components/nta-demo-funnel/StepQualification';
import StepInsights from '@/components/nta-demo-funnel/StepInsights';
import StepBooking from '@/components/nta-demo-funnel/StepBooking';
import StepConfirmation from '@/components/nta-demo-funnel/StepConfirmation';

// Lead scoring logic
function calculateLeadScore(data) {
  let score = 0;
  const urgencyScores = { immediate: 40, next_30_days: 30, next_90_days: 15, just_exploring: 5 };
  const investmentScores = { over_10k: 25, '5k_10k': 20, '3k_5k': 15, '1k_3k': 10, under_1k: 5 };
  const goalScores = { beat_competitors: 20, more_leads: 18, brand_authority: 15, expand_locations: 15, better_roi: 12, reduce_marketing_cost: 10 };
  score += urgencyScores[data.urgency] || 0;
  score += investmentScores[data.monthly_investment_range] || 0;
  score += goalScores[data.primary_goal] || 0;
  if (data.contact_phone) score += 10;
  if (data.current_marketing) score += 5;
  return Math.min(100, score);
}

export default function NTADemoFunnel() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [bookingData, setBookingData] = useState({});
  const [applicationId, setApplicationId] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleQualification = async (data) => {
    const score = calculateLeadScore(data);
    const merged = { ...data, lead_score: score };
    setFormData(merged);
    setSaving(true);

    // Create DemoApplication
    const app = await base44.entities.DemoApplication.create({
      ...merged,
      status: 'qualified',
    }).catch(console.error);

    if (app) {
      setApplicationId(app.id);

      // Create SalesOpportunity
      await base44.entities.SalesOpportunity.create({
        company_name: data.business_name,
        contact_name: data.contact_name,
        contact_email: data.contact_email,
        phone: data.contact_phone,
        city: data.city,
        industry: data.industry,
        stage: 'discovery',
        source: 'demo_request',
        notes: `Lead Score: ${score}. Goal: ${data.primary_goal}. Urgency: ${data.urgency}. Budget: ${data.monthly_investment_range}.`,
        deal_value: score > 70 ? 3000 : score > 50 ? 2000 : 1500,
      }).catch(console.error);

      // Save insight preview
      const insights = {
        application_id: app.id,
        business_name: data.business_name,
        city: data.city,
        industry: data.industry,
        visibility_gap_score: Math.min(94, Math.round(62 * 1.2)),
        competitor_count_active: 7,
        content_opportunity_index: 78,
        estimated_missed_leads_monthly: 18,
        keywords_not_ranking: 140,
        streaming_gap_present: true,
        insight_viewed_at: new Date().toISOString(),
      };
      await base44.entities.LeadInsightPreview.create(insights).catch(console.error);
    }

    setSaving(false);
    setStep(2);
  };

  const handleInsightNext = async () => {
    if (applicationId) {
      await base44.entities.DemoApplication.update(applicationId, { status: 'insight_viewed' }).catch(console.error);
    }
    setStep(3);
  };

  const handleBooking = async (booking) => {
    setBookingData(booking);
    setSaving(true);

    const demoBooking = await base44.entities.DemoBooking.create({
      application_id: applicationId || 'direct',
      business_name: formData.business_name,
      contact_name: formData.contact_name,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      demo_date: booking.demo_date,
      demo_time: booking.demo_time,
      industry: formData.industry,
      city: formData.city,
      lead_score: formData.lead_score || 0,
      status: 'confirmed',
      warmup_sequence_started: true,
    }).catch(console.error);

    if (applicationId) {
      await base44.entities.DemoApplication.update(applicationId, {
        status: 'booked',
        booking_id: demoBooking?.id,
      }).catch(console.error);
    }

    setSaving(false);
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
            <span className="text-white text-xs font-black">NTA</span>
          </div>
          <span className="text-slate-900 font-black">Strategy Session</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Zap className="w-3.5 h-3.5 text-blue-500" />
          Powered by NTA Authority Platform
        </div>
      </div>

      {/* Landing hero — only on step 0 (we skip, go straight to step 1) */}

      {/* Main funnel container */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Progress */}
        {step <= 4 && <FunnelProgress currentStep={step} />}

        {/* Step panels */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          {step === 1 && (
            <StepQualification data={formData} onNext={handleQualification} />
          )}
          {step === 2 && (
            <StepInsights data={formData} onNext={handleInsightNext} loading={saving} />
          )}
          {step === 3 && (
            <StepBooking data={formData} onNext={handleBooking} onBack={() => setStep(2)} />
          )}
          {step === 4 && (
            <StepConfirmation data={formData} booking={bookingData} />
          )}
        </div>

        {/* Trust footer */}
        {step < 4 && (
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span>🔒 Secure & Private</span>
            <span>⭐ 4.9 Client Rating</span>
            <span>📅 No Commitment</span>
          </div>
        )}
      </div>
    </div>
  );
}