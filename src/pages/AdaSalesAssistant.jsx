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
import { Bot, Mail, TrendingUp, HelpCircle, Loader2, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdaSalesAssistant() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState('');
  const [emailContext, setEmailContext] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="email" className="gap-2">
              <Mail className="w-4 h-4" />
              Draft Email
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