import { invokeVerifiedPublicFunction } from '@/lib/publicVerification';
import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { contextFromSearch, followUpDetails } from '@/lib/contentJourney';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Mail, Phone, CheckCircle2, Loader2, MapPin } from 'lucide-react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

export default function Contact() {
  const location = useLocation();
  const context = contextFromSearch(location.search);
  const [preference, setPreference] = useState('email');
  const [errorMessage, setErrorMessage] = useState('');
  const submissionLock = useRef(false);
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    email: '',
    phone: '',
    message: '',
    company_fax: '',
  });
  const formStartedAt = useRef(Date.now());
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submissionLock.current) return;
    submissionLock.current = true;
    setLoading(true);
    setErrorMessage('');

    try {
      const params = new URLSearchParams(window.location.search);
      const sourceCampaign = params.get('utm_campaign') || params.get('campaign') || '';
      const followUp = followUpDetails({ message: formData.message, context, preference });

      // Single authoritative path: Submission → CRM contact/opportunity/deal/task.
      // The server also creates the compatibility Lead record that powers the
      // existing direct email alert, with complete source details.
      const response = await invokeVerifiedPublicFunction('ntaUnifiedIntake', {
        submission_type: 'contact',
        offer_type: 'consultation',
        mapping_confidence: 'hardcoded',
        mapping_notes: 'Contact.jsx /contact',
        detected_route: window.location.pathname,
        detected_component: 'Contact',
        source_system: 'website',
        source_page: window.location.pathname,
        source_url: window.location.href,
        source_campaign: sourceCampaign,
        name: formData.name,
        business_name: formData.business_name,
        email: formData.email,
        phone: formData.phone,
        notes: followUp.notes,
        priority: 'high',
        is_high_intent: true,
        skip_webhook: true,
        anti_spam: {
          honeypot: formData.company_fax,
          form_started_at: formStartedAt.current,
        },
        raw_payload: {
          ...followUp.metadata,
          referrer: document.referrer || '',
          utm_source: params.get('utm_source') || '',
          utm_medium: params.get('utm_medium') || '',
          utm_campaign: params.get('utm_campaign') || '',
          utm_content: params.get('utm_content') || '',
          utm_term: params.get('utm_term') || '',
        },
      });

      const result = response?.data ?? response;
      if (result?.success !== true || result?.accepted === false || !result?.submission_id) {
        throw new Error(result?.error || 'We could not confirm that your request was saved. Please call or text Rick at 641-420-8816.');
      }
      setSubmitted(true);
      setFormData({ name: '', business_name: '', email: '', phone: '', message: '', company_fax: '' });
      formStartedAt.current = Date.now();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setErrorMessage(error?.response?.data?.error || error?.message || 'We could not save your request. Please call or text Rick at 641-420-8816.');
    } finally {
      submissionLock.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Contact NTA | Practical AI Education for Small Business"
        description="Contact New Tech Advertising in Mason City, Iowa for practical AI education, business growth guidance, and connected systems for small-business owners."
      />
      <MarketingNav />
      
      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Talk to My Office™
            </h1>
            <p className="text-xl text-slate-600">
              Tell Rick what you are trying to improve. Choose the easiest way to continue the conversation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 bg-white border-2 border-slate-200">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">Call or text Rick</h3>
                  <a href="tel:641-420-8816" className="text-blue-600 hover:text-blue-700 text-lg">
                    641-420-8816
                  </a>
                  <p className="text-sm text-slate-600 mt-2">
<a href="sms:16414208816" className="font-semibold text-blue-600 hover:text-blue-700">Open a text to this number</a>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border-2 border-slate-200">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">Email</h3>
                  <a href="mailto:info@newtechadvertising.com" className="text-blue-600 hover:text-blue-700 text-lg break-all">
                    info@newtechadvertising.com
                  </a>
                  <p className="text-sm text-slate-600 mt-2">
                    Ask a question or tell us where you need help.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-white border-2 border-slate-200 mb-12">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">Location & Service Areas</h3>
                <p className="text-sm text-slate-600">
                  Based in Mason City, Iowa
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Working with businesses across the country, with roots in North Iowa and Southern Minnesota.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white shadow-xl">
            {submitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Your request is saved</h3>
                <p className="text-slate-600 mb-6">
                  Rick will review your message and your preferred reply method: {preference === 'call' ? 'a phone call' : preference === 'text' ? 'a text message' : 'email'}. {context ? 'The article or video topic is included with your request.' : 'You can keep exploring while you wait.'}
                </p>
                <p className="mb-6"><Link to={context?.path || '/knowledge'} className="font-semibold text-blue-600 hover:text-blue-700">{context ? 'Return to the article or video' : 'Keep exploring the Knowledge Library'} →</Link></p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Ask Rick to follow up</h2>
                <p className="text-slate-600">Share the question you want help with. Rick will use the information you provide to reply to this request.</p>
                {context && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm font-semibold text-slate-700">You were reading or watching:</p>
                    <Link to={context.path} className="mt-1 block font-semibold text-blue-700 hover:underline">{context.title}</Link>
                    <p className="mt-2 text-sm text-slate-600">This topic will be included with your message.</p>
                  </div>
                )}
                <fieldset>
                  <legend className="mb-3 font-medium text-slate-700">How would you like Rick to reply?</legend>
                  <div className="flex flex-wrap gap-4">
                    {[['email', 'Email'], ['call', 'Phone call'], ['text', 'Text message']].map(([value, label]) => (
                      <label key={value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-slate-800">
                        <input type="radio" name="preferred_contact" value={value} checked={preference === value} onChange={() => setPreference(value)} className="accent-blue-600" />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                {errorMessage && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{errorMessage}</p>}

                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 mb-2">Name <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    id="contact-name" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="contact-business_name" className="block text-sm font-medium text-slate-700 mb-2">Business or Organization <span className="text-slate-400">(optional)</span>
                  </label>
                  <Input
                    type="text"
                    id="contact-business_name" value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    placeholder="Your business name"
                    autoComplete="organization"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 mb-2">Email {preference === 'email' ? <span className="text-red-600">*</span> : <span className="text-slate-400">(optional)</span>}
                    </label>
                    <Input
                      type="email"
                      required={preference === 'email'}
                      id="contact-email" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-slate-700 mb-2">Phone {preference !== 'email' ? <span className="text-red-600">*</span> : <span className="text-slate-400">(optional)</span>}
                    </label>
                    <Input
                      type="tel"
                      required={preference !== 'email'}
                      id="contact-phone" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 mb-2">What would you like help with? <span className="text-red-600">*</span>
                  </label>
                  <Textarea
                    required
                    id="contact-message" value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    maxLength={2500}
                    placeholder="What would you like to improve, and what question is on your mind?"
                  />
                </div>

                <div
                  aria-hidden="true"
                  className="absolute -left-[10000px] h-px w-px overflow-hidden"
                >
                  <label htmlFor="contact-company-fax">Company fax (leave blank)</label>
                  <input
                    id="contact-company-fax"
                    type="text"
                    name="company_fax"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.company_fax}
                    onChange={(e) => setFormData({ ...formData, company_fax: e.target.value })}
                  />
                </div>

                <p className="text-sm leading-6 text-slate-600">By sending, you ask Rick to follow up about this request. To receive the weekly NTA Journal, you can <Link to="/nta-journal#subscribe" className="font-semibold text-blue-700 hover:underline">subscribe separately</Link>.</p>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send my follow-up request'
                  )}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
