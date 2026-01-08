import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';

export default function AdaQuote() {
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    loadQuote();
  }, []);

  const loadQuote = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const leadId = urlParams.get('lead_id');

    if (!leadId) {
      toast.error('Invalid quote link');
      setIsLoading(false);
      return;
    }

    try {
      const leads = await base44.entities.AdaLead.filter({ id: leadId });
      if (leads.length === 0) {
        toast.error('Quote not found');
        return;
      }

      const leadData = leads[0];
      
      // Calculate pricing
      const pricing = calculatePricing(leadData);
      
      // Update lead with pricing
      await base44.entities.AdaLead.update(leadId, {
        setup_price: pricing.setupPrice,
        monthly_price: pricing.monthlyPrice,
        multiplier: pricing.multiplier
      });

      setLead({ ...leadData, ...pricing });

      // Track activity
      await base44.entities.LeadActivity.create({
        lead_id: leadId,
        activity_type: 'quote_viewed',
        page_url: '/ada/quote',
        details: `Quote viewed: ${pricing.setupPrice} setup, ${pricing.monthlyPrice}/mo`
      });

      // Emit webhook
      await base44.functions.invoke('adaWebhookHandler', {
        event: 'quote_generated',
        lead_id: leadId,
        package: leadData.package,
        pricing: {
          setup_price: pricing.setupPrice,
          monthly_price: pricing.monthlyPrice,
          multiplier: pricing.multiplier
        }
      });

    } catch (error) {
      toast.error('Failed to load quote');
      console.error('Quote error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePricing = (lead) => {
    const pkg = lead.package;
    const nonprofit = lead.nonprofit;
    
    // Base ranges
    let setupMin, setupMax, monthlyMin = 0, monthlyMax = 0;
    
    if (nonprofit) {
      if (pkg === 'Starter') {
        setupMin = 500; setupMax = 1000;
      } else if (pkg === 'Growth') {
        setupMin = 900; setupMax = 900; monthlyMin = 79; monthlyMax = 79;
      } else {
        setupMin = 1750; setupMax = 1750; monthlyMin = 149; monthlyMax = 149;
      }
    } else {
      if (pkg === 'Starter') {
        setupMin = 750; setupMax = 1500;
      } else if (pkg === 'Growth') {
        setupMin = 1250; setupMax = 2500; monthlyMin = 99; monthlyMax = 149;
      } else {
        setupMin = 2500; setupMax = 5000; monthlyMin = 199; monthlyMax = 299;
      }
    }

    // Start with default (Mason City baseline)
    let setupPrice = nonprofit ? 
      (pkg === 'Starter' ? 500 : pkg === 'Growth' ? 900 : 1750) :
      (pkg === 'Starter' ? 750 : pkg === 'Growth' ? 1250 : 2500);
    let monthlyPrice = nonprofit ?
      (pkg === 'Growth' ? 79 : pkg === 'Authority' ? 149 : 0) :
      (pkg === 'Growth' ? 99 : pkg === 'Authority' ? 199 : 0);

    // Apply adjustments BEFORE multiplier
    if (lead.approximate_pages === '16-30') setupPrice += 250;
    if (lead.approximate_pages === '31+') setupPrice += 500;
    
    if (lead.site_type === 'ecommerce' || lead.site_type === 'booking') setupPrice += 750;
    
    const highRisk = ['healthcare', 'finance', 'education', 'government'].some(r => 
      lead.industry?.toLowerCase().includes(r)
    );
    if (highRisk) setupPrice += 500;
    
    if (lead.number_of_locations === '2-3') setupPrice += 150;
    if (lead.number_of_locations === '4-10') setupPrice += 300;
    if (lead.number_of_locations === '11+') setupPrice += 500;

    // Determine market multiplier
    let multiplier = 1.0;
    const city = lead.city?.toLowerCase() || '';
    if (city.includes('des moines') || city.includes('cedar rapids') || city.includes('minneapolis')) {
      multiplier = 1.6; // Metro
    } else if (city.includes('iowa city') || city.includes('waterloo') || city.includes('rochester')) {
      multiplier = 1.25; // Regional
    }

    setupPrice = setupPrice * multiplier;
    monthlyPrice = monthlyPrice * multiplier;

    // Clamp to published ranges
    setupPrice = Math.max(setupMin, Math.min(setupMax, Math.round(setupPrice)));
    monthlyPrice = Math.max(monthlyMin, Math.min(monthlyMax, Math.round(monthlyPrice)));

    return { setupPrice, monthlyPrice, multiplier };
  };

  const handlePayNow = async () => {
    setIsCheckingOut(true);
    try {
      const response = await base44.functions.invoke('adaCreateCheckout', {
        lead_id: lead.id
      });
      
      // Redirect to Stripe Checkout
      window.location.href = response.data.checkout_url;
    } catch (error) {
      toast.error('Failed to create checkout session');
      console.error('Checkout error:', error);
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Quote not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4">Custom Quote</Badge>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Your ADA Compliance Quote
            </h1>
            <p className="text-xl text-slate-600">
              {lead.business_name}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Package Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Package:</span>
                  <span className="font-semibold">{lead.package}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Website Type:</span>
                  <span className="font-semibold capitalize">{lead.site_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pages:</span>
                  <span className="font-semibold">{lead.approximate_pages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Locations:</span>
                  <span className="font-semibold">{lead.number_of_locations}</span>
                </div>
                {lead.nonprofit && (
                  <Badge variant="outline" className="w-full justify-center">
                    Nonprofit Discount Applied
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Pricing Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-slate-700">Setup Fee:</span>
                    <span className="text-3xl font-bold text-slate-900">
                      ${lead.setupPrice}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    One-time compliance audit and remediation
                  </p>
                </div>
                
                {lead.monthlyPrice > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-slate-700">Monthly Monitoring:</span>
                      <span className="text-2xl font-bold text-slate-900">
                        ${lead.monthlyPrice}/mo
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Ongoing compliance monitoring and support
                    </p>
                  </div>
                )}

                {lead.multiplier !== 1.0 && (
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-slate-700">
                        Market adjustment: {(lead.multiplier * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">What's Included:</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span className="text-slate-700">WCAG 2.1 Level AA compliance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span className="text-slate-700">Automated accessibility testing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span className="text-slate-700">Manual audit by experts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span className="text-slate-700">Code remediation</span>
                  </div>
                  {lead.monthlyPrice > 0 && (
                    <>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-slate-700">Monthly monitoring</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-slate-700">Priority support</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mt-6">
                  <p className="text-sm text-slate-600 text-center mb-4">
                    Ready to protect your business and make your website accessible?
                  </p>
                  <Button
                    onClick={handlePayNow}
                    disabled={isCheckingOut}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-lg py-6"
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                        Loading Checkout...
                      </>
                    ) : (
                      <>
                        Pay ${lead.setupPrice} Now
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-slate-500 text-center mt-2">
                    Secure payment powered by Stripe
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}