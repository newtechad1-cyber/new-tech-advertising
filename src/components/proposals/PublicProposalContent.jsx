import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, FileText, TrendingUp, MessageSquare, Clock, DollarSign } from 'lucide-react';
import AcceptModal from './viewer/AcceptModal';
import { toast } from 'sonner';

export default function PublicProposalContent({ proposal, isAdminPreview }) {
  const [modalAction, setModalAction] = useState(null);
  const [viewedSections, setViewedSections] = useState({});

  const trackSection = (section) => {
    if (!viewedSections[section]) {
      setViewedSections(prev => ({ ...prev, [section]: true }));
      if (!isAdminPreview) {
        fetch('/api/proposalActions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'section_viewed',
            token: proposal.public_token,
            section,
            time_spent: 10,
          }),
        }).catch(() => {});
      }
    }
  };

  const handleAction = async (action, name, email) => {
    if (isAdminPreview) {
      toast.success(`Preview: ${action} action would be recorded`);
      setModalAction(null);
      return;
    }

    try {
      const response = await fetch('/api/proposalActions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          token: proposal.public_token,
          viewer_name: name,
          viewer_email: email,
        }),
      });
      const json = await response.json();
      if (json.success) {
        setModalAction(null);
        toast.success(`${action === 'accept' ? 'Proposal approved!' : action === 'revision' ? 'Revision request sent!' : 'Call request sent!'} We'll be in touch shortly.`);
      }
    } catch (err) {
      toast.error('Failed to submit. Please try again.');
    }
  };

  const roiCalc = () => {
    if (!proposal.roi_inputs) return null;
    const r = proposal.roi_inputs;
    const monthly = Math.round((r.leads_per_month || 0) * (r.close_rate_percent || 0) / 100) * (r.avg_job_value || 0);
    const annual = monthly * 12;
    return { monthly, annual };
  };

  const roi = roiCalc();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Hero / Cover */}
      <section
        onMouseEnter={() => trackSection('hero')}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-sm font-medium text-blue-200 mb-3">Proposal</div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">{proposal.title}</h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">{proposal.executive_summary || 'Strategic recommendation tailored for your business.'}</p>
          {proposal.proposal_video_url && (
            <a href={proposal.proposal_video_url} target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">▶ Watch Overview Video</Button>
            </a>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Problem / Solution */}
        {(proposal.problem_summary || proposal.solution_summary) && (
          <section
            onMouseEnter={() => trackSection('problem_solution')}
            className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            {proposal.problem_summary && (
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">The Challenge</h2>
                <p className="text-slate-600 text-lg leading-relaxed">{proposal.problem_summary}</p>
              </div>
            )}
            {proposal.solution_summary && (
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Solution</h2>
                <p className="text-slate-600 text-lg leading-relaxed">{proposal.solution_summary}</p>
              </div>
            )}
          </section>
        )}

        {/* Deliverables */}
        {proposal.deliverables?.length > 0 && (
          <section onMouseEnter={() => trackSection('deliverables')} className="mb-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-12">What's Included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {proposal.deliverables.map((d, i) => (
                <Card key={i} className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                  <div className="text-3xl mb-3">{d.icon || '✅'}</div>
                  <h3 className="font-semibold text-slate-900 mb-2">{d.title}</h3>
                  <p className="text-slate-600 text-sm">{d.description}</p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Timeline */}
        {proposal.timeline_summary && (
          <section onMouseEnter={() => trackSection('timeline')} className="mb-20 bg-slate-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Timeline & Phases</h2>
            <div className="prose prose-sm prose-slate max-w-none">
              {proposal.timeline_summary.split('\n').map((line, i) => (
                line.trim() && <p key={i} className="text-slate-600 mb-4">{line}</p>
              ))}
            </div>
          </section>
        )}

        {/* Pricing */}
        {(proposal.one_time_fee > 0 || proposal.monthly_fee > 0 || proposal.pricing_summary) && (
          <section onMouseEnter={() => trackSection('pricing')} className="mb-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-12">Investment & Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {proposal.one_time_fee > 0 && (
                <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
                  <DollarSign className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-slate-600 text-sm mb-1">Setup Fee</p>
                  <p className="text-3xl font-bold text-blue-600">${proposal.one_time_fee.toLocaleString()}</p>
                </Card>
              )}
              {proposal.monthly_fee > 0 && (
                <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
                  <DollarSign className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-slate-600 text-sm mb-1">Monthly Fee</p>
                  <p className="text-3xl font-bold text-green-600">${proposal.monthly_fee.toLocaleString()}<span className="text-base">/mo</span></p>
                </Card>
              )}
              {proposal.estimated_value > 0 && (
                <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100">
                  <DollarSign className="w-8 h-8 text-indigo-600 mb-2" />
                  <p className="text-slate-600 text-sm mb-1">Total Investment</p>
                  <p className="text-3xl font-bold text-indigo-600">${proposal.estimated_value.toLocaleString()}</p>
                </Card>
              )}
            </div>
            {proposal.pricing_summary && (
              <div className="bg-slate-50 rounded-lg p-6">
                <p className="text-slate-600 text-base">{proposal.pricing_summary}</p>
              </div>
            )}
          </section>
        )}

        {/* ROI Projection */}
        {roi && (
          <section onMouseEnter={() => trackSection('roi')} className="mb-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Projected ROI & Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-8 border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100 text-center">
                <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <p className="text-slate-600 text-sm mb-2">Monthly Revenue Impact</p>
                <p className="text-4xl font-bold text-emerald-600">${roi.monthly.toLocaleString()}</p>
              </Card>
              <Card className="p-8 border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 text-center">
                <FileText className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <p className="text-slate-600 text-sm mb-2">First Year Revenue</p>
                <p className="text-4xl font-bold text-orange-600">${roi.annual.toLocaleString()}</p>
              </Card>
              <Card className="p-8 border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 text-center">
                <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <p className="text-slate-600 text-sm mb-2">Break-Even Timeline</p>
                <p className="text-4xl font-bold text-purple-600">&lt; 3 mo</p>
              </Card>
            </div>
            {proposal.roi_projection_summary && (
              <Card className="p-8 border-0 shadow-sm bg-slate-50">
                <p className="text-slate-700 text-base leading-relaxed">{proposal.roi_projection_summary}</p>
              </Card>
            )}
          </section>
        )}

        {/* Testimonials */}
        {proposal.testimonial_blocks?.length > 0 && (
          <section onMouseEnter={() => trackSection('testimonials')} className="mb-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-12">Why Businesses Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {proposal.testimonial_blocks.map((t, i) => (
                <Card key={i} className="p-6 border-0 shadow-sm bg-white">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <span key={j} className="text-yellow-400">★</span>)}
                  </div>
                  <p className="text-slate-700 italic mb-4">"{t.quote}"</p>
                  <div>
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="text-sm text-slate-500">{t.role} at {t.company}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {proposal.faq_items?.length > 0 && (
          <section onMouseEnter={() => trackSection('faq')} className="mb-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-12">Common Questions</h2>
            <div className="space-y-4">
              {proposal.faq_items.map((item, i) => (
                <Card key={i} className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                  <details className="cursor-pointer">
                    <summary className="font-semibold text-slate-900 flex items-center gap-3">
                      <span>❓</span> {item.question}
                    </summary>
                    <p className="text-slate-600 mt-4 ml-7">{item.answer}</p>
                  </details>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        {!isAdminPreview && (
          <section onMouseEnter={() => trackSection('cta')} className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-12 text-white text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Move Forward?</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              {proposal.acceptance_terms || "We're excited to help you achieve these results. Choose an option below to get started."}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => setModalAction('accept')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-semibold text-base"
              >
                ✅ {proposal.cta_text || 'Approve This Proposal'}
              </Button>
              <Button
                onClick={() => setModalAction('revision')}
                variant="outline"
                className="bg-white/20 text-white border-white/50 hover:bg-white/30 px-8 py-3 font-semibold text-base"
              >
                ✏️ Request Revisions
              </Button>
              <Button
                onClick={() => setModalAction('call_request')}
                variant="outline"
                className="bg-white/20 text-white border-white/50 hover:bg-white/30 px-8 py-3 font-semibold text-base"
              >
                📞 Schedule a Call
              </Button>
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="text-center py-12 border-t border-slate-200">
          <p className="text-slate-500 text-sm">
            This proposal is valid until {proposal.expires_at ? new Date(proposal.expires_at).toLocaleDateString() : 'further notice'}
          </p>
        </div>
      </div>

      {modalAction && (
        <AcceptModal
          action={modalAction}
          onConfirm={handleAction}
          onClose={() => setModalAction(null)}
        />
      )}
    </div>
  );
}