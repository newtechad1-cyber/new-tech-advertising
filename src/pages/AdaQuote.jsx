import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';

export default function AdaQuote() {
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const leadId = urlParams.get('lead_id');
    
    if (!leadId) {
      navigate(createPageUrl('AdaAccessibility'));
      return;
    }

    loadLead(leadId);
  }, []);

  const loadLead = async (leadId) => {
    try {
      const leads = await base44.entities.AdaLead.filter({ id: leadId });
      if (leads.length > 0) {
        const leadData = leads[0];
        setLead(leadData);
        calculatePricing(leadData);
      }
    } catch (error) {
      console.error('Error loading lead:', error);
    }
  };

  const calculatePricing = async (leadData) => {
    let baseSetup = 0;
    let baseMonthly = 0;
    let multiplier = 1.0;

    // Base pricing
    if (leadData.nonprofit) {
      if (leadData.package === 'Starter') {
        baseSetup = 500;
        baseMonthly = 0;
      } else if (leadData.package === 'Growth') {
        baseSetup = 900;
        baseMonthly = 79;
      } else if (leadData.package === 'Authority') {
        baseSetup = 1750;
        baseMonthly = 149;
      }
    } else {
      if (leadData.package === 'Starter') {
        baseSetup = 750;
        baseMonthly = 0;
      } else if (leadData.package === 'Growth') {
        baseSetup = 1250;
        baseMonthly = 99;
      } else if (leadData.package === 'Authority') {
        baseSetup = 2500;
        baseMonthly = 199;
      }
    }

    // Market multiplier
    const state = leadData.state.toUpperCase();
    const city = leadData.city.toLowerCase();
    
    if (city.includes('mason city') || city.includes('clear lake') || city.includes('charles city')) {
      multiplier = 1.0;
    } else if (['IA', 'MN', 'WI'].includes(state)) {
      multiplier = 1.25;
    } else if (city.includes('minneapolis') || city.includes('des moines') || city.includes('chicago')) {
      multiplier = 1.6;
    } else {
      multiplier = 1.25;
    }

    // Adjustments
    const adjustments = [];
    let adjustmentTotal = 0;

    if (leadData.approximate_pages === '16-30') {
      adjustmentTotal += 250;
      adjustments.push({ label: 'Medium site (16-30 pages)', amount: 250 });
    } else if (leadData.approximate_pages === '31+') {
      adjustmentTotal += 500;
      adjustments.push({ label: 'Large site (31+ pages)', amount: 500 });
    }

    if (['medical', 'legal', 'hospitality', 'education'].includes(leadData.industry)) {
      adjustmentTotal += 500;
      adjustments.push({ label: 'High-risk industry', amount: 500 });
    }

    if (leadData.number_of_locations !== '1') {
      const extraLocations = leadData.number_of_locations === '2-3' ? 2 : 5;
      const locationFee = extraLocations * 100;
      adjustmentTotal += locationFee;
      adjustments.push({ label: `Multi-location (+${extraLocations})`, amount: locationFee });
    }

    if (['ecommerce', 'booking/scheduling'].includes(leadData.site_type)) {
      adjustmentTotal += 750;
      adjustments.push({ label: 'Complex site type', amount: 750 });
    }

    const finalSetup = Math.round((baseSetup + adjustmentTotal) * multiplier);
    const finalMonthly = Math.round(baseMonthly * multiplier);

    setPricing({
      setup: finalSetup,
      monthly: finalMonthly,
      multiplier,
      adjustments
    });

    // Update lead with pricing
    base44.entities.AdaLead.update(leadData.id, {
      setup_price: finalSetup,
      monthly_price: finalMonthly,
      multiplier,
      status: 'quoted'
    });

    // Send quote ready notification
    try {
      await base44.functions.invoke('sendAdaQuoteReady', {
        lead_id: leadData.id,
        stripe_link: getStripeLink()
      });
    } catch (emailError) {
      console.error('Quote notification failed:', emailError);
    }
  };

  const getStripeLink = () => {
    // Placeholder - replace with actual Stripe checkout links
    return 'https://buy.stripe.com/test_placeholder';
  };

  if (!lead || !pricing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Calculating your quote...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onCTAClick={() => {}} />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-900">Quote Ready</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Your ADA Accessibility Quote
            </h1>
            <p className="text-lg text-slate-600">
              for {lead.business_name}
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl border-2 border-blue-200 p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <Shield className="w-12 h-12 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {lead.package} Package
                  {lead.nonprofit && <span className="text-green-600 text-lg ml-2">(Nonprofit)</span>}
                </h2>
                <p className="text-slate-600">
                  {lead.package === 'Starter' && 'One-time remediation for core issues'}
                  {lead.package === 'Growth' && 'Fix + ongoing monitoring with quarterly reviews'}
                  {lead.package === 'Authority' && 'Full oversight with monthly reporting'}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 mb-6">
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-slate-600">Setup / Remediation</span>
                  <span className="font-bold text-slate-900">${pricing.setup.toLocaleString()}</span>
                </div>
                {pricing.monthly > 0 && (
                  <div className="flex justify-between text-lg">
                    <span className="text-slate-600">Monthly Monitoring</span>
                    <span className="font-bold text-slate-900">${pricing.monthly}/month</span>
                  </div>
                )}
              </div>

              {pricing.adjustments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Pricing adjustments:</p>
                  <ul className="space-y-2">
                    {pricing.adjustments.map((adj, i) => (
                      <li key={i} className="text-sm text-slate-600 flex justify-between">
                        <span>{adj.label}</span>
                        <span>+${adj.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pricing.multiplier !== 1.0 && (
                <div className="mt-4">
                  <p className="text-sm text-slate-600">
                    Market adjustment: {pricing.multiplier}x
                  </p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                📧 We'll email your detailed quote to <strong>{lead.email}</strong> within 1 business day.
              </p>
            </div>

            <Button
              onClick={() => window.location.href = getStripeLink()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
            >
              Proceed to Payment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <p className="text-sm text-slate-500 text-center mt-4">
              Have questions? Call or text Rick at <a href="tel:641-420-8816" className="text-blue-600 hover:underline">641-420-8816</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}