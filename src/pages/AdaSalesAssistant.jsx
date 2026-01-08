import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Mail, TrendingUp, HelpCircle, Loader2, Copy, CheckCircle, Send, Clock, AlertCircle, FileText, Target, Lightbulb, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdaSalesAssistant() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState('');
  const [emailContext, setEmailContext] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [crmAnalysis, setCrmAnalysis] = useState(null);
  const [isLoadingCrm, setIsLoadingCrm] = useState(false);
  const [selectedLeadForCrm, setSelectedLeadForCrm] = useState('');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const allLeads = await base44.entities.AdaLead.list('-created_date', 100);
      setLeads(allLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
    }
  };

  const handleAssistantRequest = async (taskType) => {
    if (taskType !== 'answer_question' && !selectedLead) {
      toast.error('Please select a lead');
      return;
    }

    if (taskType === 'answer_question' && !question) {
      toast.error('Please enter a question');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await base44.functions.invoke('adaSalesAssistant', {
        task_type: taskType,
        lead_id: selectedLead || null,
        question: question || null,
        context: emailContext || null
      });

      setResult(response.data.result);
    } catch (error) {
      toast.error('Failed to get response. Please try again.');
      console.error('Assistant error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    let textToCopy = result;
    
    // If result has subject_line and email_body, format them together
    if (result.subject_line && result.email_body) {
      textToCopy = `Subject: ${result.subject_line}\n\n${result.email_body}`;
    }
    
    navigator.clipboard.writeText(typeof textToCopy === 'string' ? textToCopy : JSON.stringify(textToCopy, null, 2));
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const loadRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      const response = await base44.functions.invoke('automatedEmailFollowUp', {
        action: 'check_all_leads'
      });
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      toast.error('Failed to load recommendations');
      console.error('Recommendations error:', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleAutomatedFollowUp = async (leadId, sendNow = false) => {
    setIsLoading(true);
    try {
      const response = await base44.functions.invoke('automatedEmailFollowUp', {
        action: 'generate_sequence',
        lead_id: leadId,
        send_immediately: sendNow
      });
      
      if (sendNow && response.data.sent) {
        toast.success('Email sent successfully!');
        loadRecommendations(); // Refresh recommendations
      } else {
        setResult(response.data.email);
        toast.success('Email drafted - review before sending');
      }
    } catch (error) {
      toast.error('Failed to generate follow-up');
      console.error('Automation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrmAnalysis = async () => {
    if (!selectedLeadForCrm) {
      toast.error('Please select a lead');
      return;
    }

    setIsLoadingCrm(true);
    setCrmAnalysis(null);

    try {
      const response = await base44.functions.invoke('adaSalesAssistant', {
        task_type: 'crm_intelligence',
        lead_id: selectedLeadForCrm
      });
      setCrmAnalysis(response.data.analysis);
      toast.success('CRM analysis complete');
    } catch (error) {
      toast.error('Failed to analyze lead');
      console.error('CRM analysis error:', error);
    } finally {
      setIsLoadingCrm(false);
    }
  };

  const handleApplyStatusUpdate = async (newStatus) => {
    if (!selectedLeadForCrm) return;

    try {
      await base44.entities.AdaLead.update(selectedLeadForCrm, { status: newStatus });
      toast.success(`Lead status updated to ${newStatus}`);
      loadLeads(); // Refresh leads
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Status update error:', error);
    }
  };

  const selectedLeadData = leads.find(l => l.id === selectedLead);

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">AI Sales Assistant</h1>
          </div>
          <p className="text-slate-600">AI-powered tools for drafting emails, analyzing leads, and answering questions</p>
        </div>

        <Tabs defaultValue="email" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-4xl">
            <TabsTrigger value="email" className="gap-2">
              <Mail className="w-4 h-4" />
              Draft Email
            </TabsTrigger>
            <TabsTrigger value="automation" className="gap-2">
              <Bot className="w-4 h-4" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="crm" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              CRM Intelligence
            </TabsTrigger>
            <TabsTrigger value="analyze" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Analyze Lead
            </TabsTrigger>
            <TabsTrigger value="questions" className="gap-2">
              <HelpCircle className="w-4 h-4" />
              Answer Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Draft Follow-up Email</CardTitle>
                  <CardDescription>Generate personalized emails based on lead status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Select Lead</Label>
                    <Select value={selectedLead} onValueChange={setSelectedLead}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a lead..." />
                      </SelectTrigger>
                      <SelectContent>
                        {leads.map(lead => (
                          <SelectItem key={lead.id} value={lead.id}>
                            {lead.business_name} - {lead.full_name} ({lead.status})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedLeadData && (
                    <div className="bg-slate-50 rounded-lg p-4 text-sm space-y-1">
                      <p><strong>Status:</strong> {selectedLeadData.status}</p>
                      <p><strong>Package:</strong> {selectedLeadData.package}</p>
                      <p><strong>Location:</strong> {selectedLeadData.city}, {selectedLeadData.state}</p>
                    </div>
                  )}

                  <div>
                    <Label>Previous Interaction History (Optional)</Label>
                    <Textarea
                      value={emailContext}
                      onChange={(e) => setEmailContext(e.target.value)}
                      placeholder="e.g., We spoke on 1/5 and they mentioned budget concerns. They were interested in Growth but wanted to think about it. They asked about the monitoring frequency..."
                      rows={4}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Include any previous calls, emails, or conversations to make the follow-up more contextual
                    </p>
                  </div>

                  <Button
                    onClick={() => handleAssistantRequest('draft_email')}
                    disabled={isLoading || !selectedLead}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 w-4 h-4" />
                        Draft Email
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
               <CardHeader>
                 <div className="flex items-center justify-between">
                   <CardTitle>Generated Email</CardTitle>
                   {result && (
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={handleCopy}
                       className="gap-2"
                     >
                       {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                       {copied ? 'Copied!' : 'Copy'}
                     </Button>
                   )}
                 </div>
               </CardHeader>
               <CardContent>
                 {result ? (
                   <div className="space-y-4">
                     {result.subject_line && (
                       <div>
                         <Label className="text-slate-500 text-xs mb-1">Subject Line</Label>
                         <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                           <p className="font-semibold text-slate-900">{result.subject_line}</p>
                         </div>
                       </div>
                     )}
                     <div>
                       <Label className="text-slate-500 text-xs mb-1">Email Body</Label>
                       <div className="bg-white border border-slate-200 rounded-lg p-4 whitespace-pre-wrap text-sm">
                         {result.email_body || result}
                       </div>
                     </div>
                   </div>
                 ) : (
                   <div className="text-center py-12 text-slate-400">
                     <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                     <p>Your generated email will appear here</p>
                   </div>
                 )}
               </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="automation">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    Automated Follow-up System
                  </CardTitle>
                  <CardDescription>
                    AI-powered email sequences based on lead status and activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• New leads (2+ days): Welcome & introduction email</li>
                        <li>• Quoted leads (3+ days): Gentle follow-up on quote</li>
                        <li>• Quoted leads (7+ days): Re-engagement with fresh angle</li>
                        <li>• Cold leads (7+ days): Check-in with helpful resources</li>
                      </ul>
                    </div>

                    <Button
                      onClick={loadRecommendations}
                      disabled={isLoadingRecommendations}
                      className="w-full"
                    >
                      {isLoadingRecommendations ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Scanning Leads...
                        </>
                      ) : (
                        <>
                          <Clock className="mr-2 w-4 h-4" />
                          Check for Leads Needing Follow-up
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <AlertCircle className="w-5 h-5 inline mr-2 text-orange-600" />
                      {recommendations.length} Lead{recommendations.length > 1 ? 's' : ''} Need Follow-up
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recommendations.map((rec) => (
                        <div key={rec.lead_id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">{rec.business_name}</p>
                              <p className="text-sm text-slate-600">{rec.full_name} • {rec.email}</p>
                              <p className="text-xs text-slate-500 mt-1">{rec.reason}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                {rec.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAutomatedFollowUp(rec.lead_id, false)}
                              disabled={isLoading}
                              className="flex-1"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Draft Email
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                if (confirm(`Send automated follow-up to ${rec.full_name}?`)) {
                                  handleAutomatedFollowUp(rec.lead_id, true);
                                }
                              }}
                              disabled={isLoading}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Send Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {recommendations.length === 0 && !isLoadingRecommendations && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="text-slate-600">All leads are up to date!</p>
                    <p className="text-sm text-slate-500 mt-2">No follow-ups needed at this time</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="crm">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    AI-Powered CRM Intelligence
                  </CardTitle>
                  <CardDescription>
                    Comprehensive lead analysis with interaction summaries, conversion predictions, and proactive strategies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Select Lead</Label>
                    <Select value={selectedLeadForCrm} onValueChange={setSelectedLeadForCrm}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a lead to analyze" />
                      </SelectTrigger>
                      <SelectContent>
                        {leads.map(lead => (
                          <SelectItem key={lead.id} value={lead.id}>
                            {lead.business_name} - {lead.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleCrmAnalysis}
                    disabled={!selectedLeadForCrm || isLoadingCrm}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {isLoadingCrm ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Analyzing Lead...
                      </>
                    ) : (
                      <>
                        <Target className="mr-2 w-4 h-4" />
                        Run CRM Intelligence Analysis
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {crmAnalysis && (
                <>
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-900">
                        <FileText className="w-5 h-5" />
                        Interaction Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 whitespace-pre-line">{crmAnalysis.interaction_summary}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-900">
                        <TrendingUp className="w-5 h-5" />
                        Conversion Probability Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Conversion Score</span>
                        <span className={`text-2xl font-bold ${
                          crmAnalysis.conversion_probability.score >= 70 ? 'text-green-600' :
                          crmAnalysis.conversion_probability.score >= 40 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {crmAnalysis.conversion_probability.score}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            crmAnalysis.conversion_probability.score >= 70 ? 'bg-green-500' :
                            crmAnalysis.conversion_probability.score >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${crmAnalysis.conversion_probability.score}%` }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">Confidence Level</p>
                        <p className="text-slate-600">{crmAnalysis.conversion_probability.confidence}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">Key Indicators</p>
                        <ul className="space-y-1">
                          {crmAnalysis.conversion_probability.key_indicators.map((indicator, idx) => (
                            <li key={idx} className="text-sm text-slate-600">• {indicator}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">Risk Factors</p>
                        <ul className="space-y-1">
                          {crmAnalysis.conversion_probability.risk_factors.map((risk, idx) => (
                            <li key={idx} className="text-sm text-slate-600">• {risk}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-900">
                        <Lightbulb className="w-5 h-5" />
                        Proactive Outreach Strategy
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">Recommended Approach</p>
                        <p className="text-slate-700">{crmAnalysis.outreach_strategy.recommended_approach}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">Best Time to Contact</p>
                        <p className="text-slate-600">{crmAnalysis.outreach_strategy.best_time}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">Talking Points</p>
                        <ul className="space-y-1">
                          {crmAnalysis.outreach_strategy.talking_points.map((point, idx) => (
                            <li key={idx} className="text-sm text-slate-600">• {point}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">Market Trends</p>
                        <p className="text-slate-600">{crmAnalysis.outreach_strategy.market_context}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-orange-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-900">
                        <RefreshCw className="w-5 h-5" />
                        Recommended Status Update
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
                        <p className="text-sm font-semibold text-orange-900 mb-2">AI Recommendation</p>
                        <p className="text-sm text-orange-800 mb-3">{crmAnalysis.status_recommendation.reasoning}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-700">
                            Suggested Status: <strong className="text-orange-900">{crmAnalysis.status_recommendation.suggested_status}</strong>
                          </span>
                          {crmAnalysis.status_recommendation.suggested_status !== leads.find(l => l.id === selectedLeadForCrm)?.status && (
                            <Button
                              size="sm"
                              onClick={() => handleApplyStatusUpdate(crmAnalysis.status_recommendation.suggested_status)}
                              className="ml-auto"
                            >
                              Apply Update
                            </Button>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">Next Steps</p>
                        <ul className="space-y-1">
                          {crmAnalysis.status_recommendation.next_steps.map((step, idx) => (
                            <li key={idx} className="text-sm text-slate-600">
                              {idx + 1}. {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {!crmAnalysis && !isLoadingCrm && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Bot className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 mb-2">Select a lead and run analysis</p>
                    <p className="text-sm text-slate-500">
                      Get AI-powered insights on lead behavior, conversion probability, and recommended actions
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analyze">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analyze Lead</CardTitle>
                  <CardDescription>Get AI-powered upsell and cross-sell recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Select Lead</Label>
                    <Select value={selectedLead} onValueChange={setSelectedLead}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a lead..." />
                      </SelectTrigger>
                      <SelectContent>
                        {leads.map(lead => (
                          <SelectItem key={lead.id} value={lead.id}>
                            {lead.business_name} - {lead.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedLeadData && (
                    <div className="bg-slate-50 rounded-lg p-4 text-sm space-y-1">
                      <p><strong>Industry:</strong> {selectedLeadData.industry}</p>
                      <p><strong>Package:</strong> {selectedLeadData.package}</p>
                      <p><strong>Locations:</strong> {selectedLeadData.number_of_locations}</p>
                      <p><strong>Pages:</strong> {selectedLeadData.approximate_pages}</p>
                      <p><strong>Nonprofit:</strong> {selectedLeadData.nonprofit ? 'Yes' : 'No'}</p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleAssistantRequest('analyze_lead')}
                    disabled={isLoading || !selectedLead}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 w-4 h-4" />
                        Analyze Lead
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Analysis Results</CardTitle>
                    {result && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="gap-2"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="bg-white border border-slate-200 rounded-lg p-4 whitespace-pre-wrap text-sm">
                      {result}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Analysis results will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="questions">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ask a Question</CardTitle>
                  <CardDescription>Get quick answers about ADA compliance and pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Your Question</Label>
                    <Textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="e.g., What's the difference between WCAG 2.0 and 2.1?"
                      rows={4}
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                    <p className="font-semibold text-blue-900 mb-2">Example Questions:</p>
                    <ul className="text-blue-800 space-y-1">
                      <li>• How long does remediation typically take?</li>
                      <li>• What are the most common ADA violations?</li>
                      <li>• Do small businesses need to comply with ADA?</li>
                      <li>• What's included in monthly monitoring?</li>
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleAssistantRequest('answer_question')}
                    disabled={isLoading || !question}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <HelpCircle className="mr-2 w-4 h-4" />
                        Get Answer
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Answer</CardTitle>
                    {result && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="gap-2"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="bg-white border border-slate-200 rounded-lg p-4 whitespace-pre-wrap text-sm">
                      {result}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Your answer will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </AdminLayout>
  );
}