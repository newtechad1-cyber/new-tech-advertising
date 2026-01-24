import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckCircle, Download, AlertCircle } from 'lucide-react';

export default function RebuildProposal() {
  const [proposalData, setProposalData] = useState({
    clientName: '',
    websiteUrl: '',
    proposalDate: new Date().toISOString().split('T')[0],
    estimatedTimeline: '4-6 weeks',
    totalInvestment: '$2,500'
  });

  const [projectScope, setProjectScope] = useState({
    pagesIncluded: 'Home, About, Services, Contact',
    contactForms: 'Standard contact form with ADA-compliant validation',
    integrations: 'Google Analytics, Google Maps',
    contentNotes: 'Client to provide final copy and images'
  });

  const [approval, setApproval] = useState({
    signerName: '',
    signDate: '',
    disclaimerAccepted: false
  });

  const isApprovalValid = approval.signerName.trim() && approval.signDate && approval.disclaimerAccepted;

  const handleApprove = () => {
    if (!isApprovalValid) return;
    alert('Approval captured. Redirecting to secure payment…');
    setTimeout(() => {
      window.location.href = 'https://buy.stripe.com/14A3cweYia52dU55T1fMA08';
    }, 1000);
  };

  const handleDownload = () => {
    alert('Downloading proposal PDF...');
    // TODO: Wire up to PDF generation
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-slate-900">
              ADA-Friendly Website Rebuild Proposal
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Informational accessibility services only — not legal advice, certification, or guarantees.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Proposal Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Proposal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Client/Business Name</Label>
                <Input
                  value={proposalData.clientName}
                  onChange={(e) => setProposalData({ ...proposalData, clientName: e.target.value })}
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <Label>Website URL</Label>
                <Input
                  value={proposalData.websiteUrl}
                  onChange={(e) => setProposalData({ ...proposalData, websiteUrl: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label>Proposal Date</Label>
                <Input
                  type="date"
                  value={proposalData.proposalDate}
                  onChange={(e) => setProposalData({ ...proposalData, proposalDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Estimated Timeline</Label>
                <Input
                  value={proposalData.estimatedTimeline}
                  onChange={(e) => setProposalData({ ...proposalData, estimatedTimeline: e.target.value })}
                  placeholder="4-6 weeks"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Total Investment</Label>
                <Input
                  value={proposalData.totalInvestment}
                  onChange={(e) => setProposalData({ ...proposalData, totalInvestment: e.target.value })}
                  placeholder="$2,500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why a Rebuild */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Why a Rebuild Is Recommended</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-700 space-y-3">
            <p>
              Your current website may contain accessibility barriers that prevent visitors with disabilities from
              fully accessing your content and services. A rebuild ensures your site meets modern accessibility
              standards from the ground up.
            </p>
            <p>
              Rather than attempting to patch an existing site with inaccessible foundations, rebuilding allows us
              to implement best practices in structure, navigation, forms, and media—resulting in a more inclusive
              experience for all users.
            </p>
          </CardContent>
        </Card>

        {/* What's Included */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">What This Rebuild Includes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Semantic HTML structure for screen reader compatibility</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Keyboard navigation and focus indicators on all interactive elements</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Proper color contrast ratios for text and UI components</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Alt text and ARIA labels for images and media</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Accessible forms with clear labels, error messages, and validation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Mobile-responsive design optimized for all devices</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Basic testing against WCAG 2.1 Level AA guidelines</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Documentation of accessibility features implemented</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* What's NOT Included */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">What This Does Not Include</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Legal compliance certification or guarantee</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Ongoing accessibility audits or monitoring (available as add-on)</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Content creation or copywriting services</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Third-party integrations outside the agreed scope</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>SEO optimization or marketing services</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Legal review or advice regarding ADA Title III compliance</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Project Scope */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Project Scope</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Pages Included</Label>
              <Input
                value={projectScope.pagesIncluded}
                onChange={(e) => setProjectScope({ ...projectScope, pagesIncluded: e.target.value })}
                placeholder="List pages"
              />
            </div>
            <div>
              <Label>Contact Forms</Label>
              <Input
                value={projectScope.contactForms}
                onChange={(e) => setProjectScope({ ...projectScope, contactForms: e.target.value })}
                placeholder="Describe forms"
              />
            </div>
            <div>
              <Label>Integrations</Label>
              <Input
                value={projectScope.integrations}
                onChange={(e) => setProjectScope({ ...projectScope, integrations: e.target.value })}
                placeholder="List integrations"
              />
            </div>
            <div>
              <Label>Content Notes</Label>
              <Textarea
                value={projectScope.contentNotes}
                onChange={(e) => setProjectScope({ ...projectScope, contentNotes: e.target.value })}
                placeholder="Additional notes"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Payment Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-semibold text-blue-900 mb-2">Payment Structure</p>
              <p className="text-blue-800">50% due to begin • 50% due at launch</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="font-semibold text-slate-900 mb-2">Investment Range</p>
              <p className="text-slate-700">Typical starting range $995–$3,500 depending on scope</p>
            </div>
          </CardContent>
        </Card>

        {/* Optional Add-ons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Optional Add-ons</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-slate-700">
              <li className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span>Ongoing Accessibility Monitoring</span>
                <span className="font-semibold text-slate-900">$149/mo</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span>Managed Hosting & Maintenance</span>
                <span className="font-semibold text-slate-900">$99/mo</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span>Monthly Content Updates (up to 2 hours)</span>
                <span className="font-semibold text-slate-900">$197/mo</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Approval Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Approval & Signature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Signer Name (Required)</Label>
                <Input
                  value={approval.signerName}
                  onChange={(e) => setApproval({ ...approval, signerName: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label>Sign Date (Required)</Label>
                <Input
                  type="date"
                  value={approval.signDate}
                  onChange={(e) => setApproval({ ...approval, signDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <Checkbox
                id="disclaimer"
                checked={approval.disclaimerAccepted}
                onCheckedChange={(checked) => setApproval({ ...approval, disclaimerAccepted: checked })}
              />
              <label htmlFor="disclaimer" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
                I acknowledge that this proposal is for informational accessibility services only and does not
                constitute legal advice, ADA compliance certification, or a guarantee against legal action. I
                understand the scope of work and payment terms outlined above.
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleApprove}
            disabled={!isApprovalValid}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed h-12 text-lg"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Approve & Pay Deposit
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1 h-12 text-lg border-2"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Proposal Copy
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-slate-500 pb-8">
          Questions? Contact us at support@newtechadvertising.com
        </p>
      </div>
    </div>
  );
}