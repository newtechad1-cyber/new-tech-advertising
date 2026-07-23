import React, { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SEOHead from '@/components/shared/SEOHead';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';

const QUESTIONS = [
  {
    label: 'What is your primary focus right now?',
    options: ['Getting Found Online', 'Building Trust & Reviews', 'Streamlining Operations'],
  },
  {
    label: 'How would you describe your current online presence?',
    options: ['Non-existent or broken', 'Outdated but functional', 'Good, but we want to grow further'],
  },
  {
    label: 'Where do you want your business to be in 12 months?',
    options: ['Consistent, predictable lead flow', 'The recognized leader in our market', 'Scaling smoothly with less manual work'],
  },
];

function getRecommendation(primaryGoal = '') {
  if (primaryGoal.includes('Found')) return 'Visibility & Growth';
  if (primaryGoal.includes('Trust')) return 'Reputation & Authority';
  if (primaryGoal.includes('Operations')) return 'Systematization & Scale';
  return 'Foundation & Build';
}

export default function NTAGrowthConversation() {
  const navigate = useNavigate();
  const wizardRef = useRef(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showContact, setShowContact] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    business_name: '',
    email: '',
    phone: '',
    website: '',
  });

  const recommendation = useMemo(() => getRecommendation(answers[0]), [answers]);

  const scrollToWizard = () => {
    wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const chooseAnswer = (answer) => {
    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = answer;
    setAnswers(nextAnswers);
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setShowContact(true);
    }
  };

  const submitConversation = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const notes = [
      'Growth Conversation completed',
      `Primary focus: ${answers[0] || 'Not answered'}`,
      `Current presence: ${answers[1] || 'Not answered'}`,
      `12-month goal: ${answers[2] || 'Not answered'}`,
      `Recommended stage: ${recommendation}`,
    ].join(' | ');

    try {
      const result = await base44.functions.invoke('ntaUnifiedIntake', {
        submission_type: 'growth_conversation',
        offer_type: 'growth_conversation',
        mapping_confidence: 'hardcoded',
        mapping_notes: 'Submitted from the public NTA Growth Conversation',
        source_system: 'website',
        source_page: '/growth-conversation',
        detected_route: '/growth-conversation',
        detected_component: 'NTAGrowthConversation',
        is_high_intent: true,
        ...form,
        notes,
        raw_payload: {
          answers,
          recommendation,
          journey_version: '2026-07-connected',
        },
      });

      const handoff = {
        name: form.name,
        business_name: form.business_name,
        email: form.email,
        phone: form.phone,
        website: form.website,
        answers,
        recommendation,
        submission_id: result?.data?.submission_id || result?.submission_id || '',
        company_id: result?.data?.company_id || result?.company_id || '',
        opportunity_id: result?.data?.opportunity_id || result?.opportunity_id || '',
        saved_at: new Date().toISOString(),
      };

      sessionStorage.setItem('nta_growth_conversation_handoff', JSON.stringify(handoff));
      localStorage.setItem('nta_growth_conversation_last', JSON.stringify(handoff));

      try {
        const { addCompletedConversation } = await import('@/lib/journeyMemory');
        addCompletedConversation('nta_growth');
      } catch (memoryError) {
        console.warn('Journey memory could not be updated:', memoryError);
      }

      navigate('/book-call?source=growth-conversation');
    } catch (submitError) {
      console.error(submitError);
      setError('We could not save your Growth Conversation. Please try again or call Rick at 641-420-8816.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 flex flex-col">
      <SEOHead
        title="Free Growth Conversation for Small Business | NTA"
        description="Answer a few practical questions about your business, receive a useful starting recommendation, and save your information so NTA can prepare for a helpful next conversation."
        howToData={{
          name: 'Start an NTA Growth Conversation',
          description: 'A free guided starting point for identifying a small business growth priority.',
          steps: [
            { name: 'Choose your focus', text: 'Identify the area that matters most right now.' },
            { name: 'Describe the current situation', text: 'Share the condition of your present online foundation.' },
            { name: 'Set the 12-month goal', text: 'Choose the result you want the business to reach.' },
            { name: 'Save the conversation', text: 'Provide contact information so NTA can prepare and follow up.' },
          ],
        }}
      />
      <MarketingNav />

      <main>
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-blue-400 font-medium text-sm tracking-widest uppercase mb-6">The NTA Growth Conversation™</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Start With What Is Really Happening in Your Business
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Get clarity before recommendations. Answer three practical questions, receive a starting direction, and save the conversation so nothing is lost when you choose your next step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={scrollToWizard} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-lg">
                Start the Free Conversation
              </button>
              <Link to="/free-audit" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-lg font-medium">
                Take the Free Gap Audit
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-slate-900/50 border-y border-slate-800/50">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {[
              ['Listen', 'Start with your goals and present situation instead of a predetermined package.'],
              ['Clarify', 'Organize the most important gap, opportunity, or dependency.'],
              ['Continue', 'Save the result directly to the NTA contact and opportunity system before booking.'],
            ].map(([title, text]) => (
              <div key={title} className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
                <p className="text-slate-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section ref={wizardRef} className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Your Free Growth Conversation</h2>
              <p className="text-slate-400">Your answers are saved only after you provide contact information and submit them.</p>
            </div>

            {!showContact ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="h-1 bg-slate-800 rounded-full mb-8 overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all" style={{ width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` }} />
                </div>
                <p className="text-sm text-slate-500 uppercase tracking-wider mb-4">Question {questionIndex + 1} of {QUESTIONS.length}</p>
                <h3 className="text-2xl md:text-3xl text-white font-medium mb-8">{QUESTIONS[questionIndex].label}</h3>
                <div className="space-y-3">
                  {QUESTIONS[questionIndex].options.map((option) => (
                    <button
                      key={option}
                      onClick={() => chooseAnswer(option)}
                      className="w-full text-left p-5 rounded-2xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 transition-all text-lg text-slate-200 flex justify-between items-center"
                    >
                      {option} <ChevronRight className="w-6 h-6 text-blue-400" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="text-center mb-8">
                  <p className="text-slate-400 mb-3">Your starting Growth Stage</p>
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-4">{recommendation}</h3>
                  <p className="text-slate-300">Save these answers so Rick can prepare before you talk.</p>
                </div>

                <form onSubmit={submitConversation} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <label className="text-sm text-slate-300">Your name
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white" />
                    </label>
                    <label className="text-sm text-slate-300">Business name
                      <input required value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} className="mt-2 w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white" />
                    </label>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <label className="text-sm text-slate-300">Email
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white" />
                    </label>
                    <label className="text-sm text-slate-300">Phone
                      <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white" />
                    </label>
                  </div>
                  <label className="text-sm text-slate-300">Website, if you have one
                    <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="mt-2 w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white" />
                  </label>

                  {error && <p className="text-rose-300 bg-rose-950/40 border border-rose-800 rounded-xl p-4">{error}</p>}

                  <button disabled={submitting} className="w-full inline-flex justify-center items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold rounded-xl text-lg">
                    {submitting ? 'Saving Your Conversation…' : 'Save and Choose a Time'} <ArrowRight className="w-5 h-5" />
                  </button>
                </form>

                <div className="mt-6 flex items-start gap-3 text-sm text-slate-500">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
                  <p>Your information is used to prepare and follow up. Completing this form does not enroll you in a service or start paid work.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-20 px-6 bg-slate-900/50 border-t border-slate-800/50 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">Prefer Another Starting Point?</h2>
            <p className="text-lg text-slate-400 mb-8">The free Gap Audit is better when you want a first-pass review of visible business and marketing gaps.</p>
            <Link to="/free-audit" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-xl">
              Take the Free Business Gap Audit <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
