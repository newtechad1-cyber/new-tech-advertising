import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Loader2, Mail, Phone, Globe, MapPin, Building, FileText, CheckCircle, TrendingUp, RefreshCw } from 'lucide-react';
import { createPageUrl } from '../utils';
import { toast } from 'sonner';

export default function LeadDetail() {
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [onboarding, setOnboarding] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCalculatingScore, setIsCalculatingScore] = useState(false);
  const [scoreDetails, setScoreDetails] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const leadId = urlParams.get('id');
    if (leadId) {
      loadLeadData(leadId);
    } else {
      navigate(createPageUrl('LeadsDashboard'));
    }
  }, []);

  const loadLeadData = async (leadId) => {
    try {
      const leads = await base44.entities.AdaLead.filter({ id: leadId });
      if (leads.length > 0) {
        setLead(leads[0]);
        
        // Parse score factors if available
        if (leads[0].score_factors) {
          try {
            setScoreDetails(JSON.parse(leads[0].score_factors));
          } catch (e) {
            console.log('Could not parse score factors');
          }
        }
        
        // Try to load onboarding data
        try {
          const onboardings = await base44.entities.AdaOnboarding.filter({ lead_id: leadId });
          if (onboardings.length > 0) {
            setOnboarding(onboardings[0]);
          }
        } catch (e) {
          console.log('No onboarding data found');
        }
      }
    } catch (error) {
      toast.error('Failed to load lead');
      console.error('Error loading lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await base44.entities.AdaLead.update(lead.id, lead);
      toast.success('Lead updated successfully');
    } catch (error) {
      toast.error('Failed to update lead');
      console.error('Update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCalculateScore = async () => {
    setIsCalculatingScore(true);

    try {
      const response = await base44.functions.invoke('calculateLeadScore', {
        lead_id: lead.id
      });
      
      setLead({ ...lead, lead_score: response.data.score });
      setScoreDetails(response.data.details);
      toast.success('Lead score calculated');
    } catch (error) {
      toast.error('Failed to calculate score');
      console.error('Score calculation error:', error);
    } finally {
      setIsCalculatingScore(false);
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
        <p className="text-slate-600">Lead not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl('LeadsDashboard'))}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Leads
        </Button>

        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{lead.business_name}</h1>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-100 text-blue-800">{lead.package}</Badge>
                <Badge className={
                  lead.status === 'active' ? 'bg-green-100 text-green-800' :
                  lead.status === 'onboarded' ? 'bg-purple-100 text-purple-800' :
                  lead.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-yellow-100 text-yellow-800'
                }>{lead.status}</Badge>
                {lead.nonprofit && <Badge variant="outline">Nonprofit</Badge>}
                {lead.lead_score && (
                  <Badge className={
                    lead.lead_score >= 61 ? 'bg-green-100 text-green-800' :
                    lead.lead_score >= 31 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Score: {lead.lead_score}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {scoreDetails && (
          <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  AI Lead Score Analysis
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCalculateScore}
                  disabled={isCalculatingScore}
                >
                  {isCalculatingScore ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">Conversion Likelihood</p>
                  <p className="text-slate-900">{scoreDetails.conversion_likelihood}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Key Factors</p>
                  <ul className="space-y-1">
                    {scoreDetails.key_factors.map((factor, idx) => (
                      <li key={idx} className="text-sm text-slate-900">• {factor}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Recommended Action</p>
                  <p className="text-sm text-blue-800">{scoreDetails.recommended_action}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!lead.lead_score && (
          <Card className="mb-6 border-2 border-dashed">
            <CardContent className="py-8 text-center">
              <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 mb-4">No lead score calculated yet</p>
              <Button
                onClick={handleCalculateScore}
                disabled={isCalculatingScore}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isCalculatingScore ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 w-4 h-4" />
                    Calculate Lead Score
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Lead Details</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="notes">Notes & History</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <form onSubmit={handleUpdateLead}>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={lead.full_name}
                        onChange={(e) => setLead({ ...lead, full_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <div className="flex gap-2">
                        <Input
                          value={lead.email}
                          onChange={(e) => setLead({ ...lead, email: e.target.value })}
                        />
                        <Button variant="outline" size="icon" asChild>
                          <a href={`mailto:${lead.email}`}>
                            <Mail className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <div className="flex gap-2">
                        <Input
                          value={lead.phone}
                          onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                        />
                        <Button variant="outline" size="icon" asChild>
                          <a href={`tel:${lead.phone}`}>
                            <Phone className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Website URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={lead.website_url}
                          onChange={(e) => setLead({ ...lead, website_url: e.target.value })}
                        />
                        <Button variant="outline" size="icon" asChild>
                          <a href={lead.website_url} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Business Name</Label>
                      <Input
                        value={lead.business_name}
                        onChange={(e) => setLead({ ...lead, business_name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>City</Label>
                        <Input
                          value={lead.city}
                          onChange={(e) => setLead({ ...lead, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input
                          value={lead.state}
                          onChange={(e) => setLead({ ...lead, state: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Industry</Label>
                      <Input
                        value={lead.industry}
                        onChange={(e) => setLead({ ...lead, industry: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Number of Locations</Label>
                      <Input
                        value={lead.number_of_locations}
                        onChange={(e) => setLead({ ...lead, number_of_locations: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Website Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Site Type</Label>
                      <Input
                        value={lead.site_type}
                        onChange={(e) => setLead({ ...lead, site_type: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Approximate Pages</Label>
                      <Input
                        value={lead.approximate_pages}
                        onChange={(e) => setLead({ ...lead, approximate_pages: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={lead.notes || ''}
                        onChange={(e) => setLead({ ...lead, notes: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Package & Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Package</Label>
                      <Select value={lead.package} onValueChange={(value) => setLead({ ...lead, package: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Starter">Starter</SelectItem>
                          <SelectItem value="Growth">Growth</SelectItem>
                          <SelectItem value="Authority">Authority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select value={lead.status} onValueChange={(value) => setLead({ ...lead, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="quoted">Quoted</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="onboarded">Onboarded</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Setup Price</Label>
                        <Input
                          type="number"
                          value={lead.setup_price || ''}
                          onChange={(e) => setLead({ ...lead, setup_price: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Monthly Price</Label>
                        <Input
                          type="number"
                          value={lead.monthly_price || ''}
                          onChange={(e) => setLead({ ...lead, monthly_price: parseFloat(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Market Multiplier</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={lead.multiplier || 1.0}
                        onChange={(e) => setLead({ ...lead, multiplier: parseFloat(e.target.value) })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="onboarding">
            {onboarding ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Onboarding Completed
                  </CardTitle>
                  <CardDescription>
                    Completed on {new Date(onboarding.created_date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-slate-500">Preferred Contact Method</Label>
                      <p className="font-medium">{onboarding.best_contact_method}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500">Preferred Name</Label>
                      <p className="font-medium">{onboarding.preferred_contact_name}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500">Hosting Provider</Label>
                      <p className="font-medium">{onboarding.hosting_provider || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500">CMS Platform</Label>
                      <p className="font-medium">{onboarding.cms_platform || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-500">Login Access Notes</Label>
                    <p className="mt-1 p-3 bg-slate-50 rounded-lg">{onboarding.login_access_notes || 'None provided'}</p>
                  </div>

                  <div>
                    <Label className="text-slate-500">Priority Pages</Label>
                    <p className="mt-1 p-3 bg-slate-50 rounded-lg">{onboarding.priority_pages || 'None specified'}</p>
                  </div>

                  <div>
                    <Label className="text-slate-500">Deadlines</Label>
                    <p className="mt-1 p-3 bg-slate-50 rounded-lg">{onboarding.deadlines || 'No specific deadlines'}</p>
                  </div>

                  {onboarding.brand_assets_url && (
                    <div>
                      <Label className="text-slate-500">Brand Assets</Label>
                      <Button variant="outline" asChild className="mt-2">
                        <a href={onboarding.brand_assets_url} target="_blank" rel="noopener noreferrer">
                          <FileText className="w-4 h-4 mr-2" />
                          View Brand Assets
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No onboarding data available</p>
                  <p className="text-sm text-slate-400 mt-2">
                    This lead has not completed the onboarding process yet
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Timeline & Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-blue-500 pl-4 py-2">
                    <p className="font-semibold text-sm text-slate-900">Lead Created</p>
                    <p className="text-sm text-slate-500">{new Date(lead.created_date).toLocaleString()}</p>
                  </div>
                  {lead.updated_date && (
                    <div className="border-l-2 border-green-500 pl-4 py-2">
                      <p className="font-semibold text-sm text-slate-900">Last Updated</p>
                      <p className="text-sm text-slate-500">{new Date(lead.updated_date).toLocaleString()}</p>
                    </div>
                  )}
                  {onboarding && (
                    <div className="border-l-2 border-purple-500 pl-4 py-2">
                      <p className="font-semibold text-sm text-slate-900">Onboarding Completed</p>
                      <p className="text-sm text-slate-500">{new Date(onboarding.created_date).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}