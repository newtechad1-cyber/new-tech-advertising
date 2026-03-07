import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, ArrowRight, Zap, Share2, Mail, BarChart2, Video, FileText, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Campaign Creation',
    subtitle: 'Learn the 5-step process to build powerful campaigns',
    icon: Zap
  },
  {
    id: 'define-goal',
    title: 'Step 1: Define Your Campaign Goal',
    subtitle: 'Choose what you want to achieve',
    icon: Target
  },
  {
    id: 'create-content',
    title: 'Step 2: Create Your Content',
    subtitle: 'Generate blog posts, videos, or social media content',
    icon: FileText
  },
  {
    id: 'build-audience',
    title: 'Step 3: Build Your Audience',
    subtitle: 'Collect emails and build your subscriber list',
    icon: Users
  },
  {
    id: 'launch-campaign',
    title: 'Step 4: Launch Campaign',
    subtitle: 'Schedule posts and send emails',
    icon: Share2
  },
  {
    id: 'track-results',
    title: 'Step 5: Track Results',
    subtitle: 'Monitor performance and optimize',
    icon: BarChart2
  },
  {
    id: 'congrats',
    title: 'You\'re Ready!',
    subtitle: 'Start building your first campaign',
    icon: CheckCircle2
  }
];

// Simple Target icon since it may not be in lucide
const Target = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="5" fill="none" strokeWidth="2" />
    <circle cx="12" cy="12" r="9" fill="none" strokeWidth="2" />
  </svg>
);

const CAMPAIGN_GOALS = [
  { id: 'traffic', label: 'Drive Website Traffic', description: 'Create content to boost SEO and visitor numbers' },
  { id: 'leads', label: 'Generate Leads', description: 'Build email list through lead magnets and campaigns' },
  { id: 'sales', label: 'Increase Sales', description: 'Convert visitors into paying customers' },
  { id: 'engagement', label: 'Boost Engagement', description: 'Grow social media followers and interaction' },
  { id: 'brand', label: 'Build Brand Authority', description: 'Establish thought leadership in your industry' }
];

export default function CampaignCreationWizard({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const step = STEPS[currentStep];
  const StepIcon = step.icon;

  const goNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const goPrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleGoalSelect = (goalId) => {
    setSelectedGoal(goalId);
    setTimeout(goNext, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 px-6 py-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <StepIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-slate-400 text-sm font-medium">STEP {currentStep} OF {STEPS.length}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{step.title}</h2>
            <p className="text-slate-400 text-sm mt-1">{step.subtitle}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          ></div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 min-h-96">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-600/20 p-2 rounded-lg mt-1">
                    <Zap className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Step 1: Define Your Goal</h3>
                    <p className="text-slate-400 text-sm mt-1">Choose what you want your campaign to achieve</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600/20 p-2 rounded-lg mt-1">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Step 2: Create Content</h3>
                    <p className="text-slate-400 text-sm mt-1">Generate blog posts, videos, and social content</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-600/20 p-2 rounded-lg mt-1">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Step 3: Build Your Audience</h3>
                    <p className="text-slate-400 text-sm mt-1">Collect emails and grow your subscriber list</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-600/20 p-2 rounded-lg mt-1">
                    <Share2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Step 4: Launch Campaign</h3>
                    <p className="text-slate-400 text-sm mt-1">Schedule posts and send targeted emails</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-orange-600/20 p-2 rounded-lg mt-1">
                    <BarChart2 className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Step 5: Track Results</h3>
                    <p className="text-slate-400 text-sm mt-1">Monitor performance and continuously optimize</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-300 text-sm">
                  <strong>Estimated time:</strong> 15-20 minutes to complete your first campaign from start to launch.
                </p>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              {CAMPAIGN_GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className={`w-full border rounded-lg p-4 text-left transition-all ${
                    selectedGoal === goal.id
                      ? 'border-indigo-500 bg-indigo-600/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{goal.label}</h3>
                      <p className="text-slate-400 text-sm mt-1">{goal.description}</p>
                    </div>
                    {selectedGoal === goal.id && <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Available Content Tools</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">Blog Management</p>
                      <p className="text-slate-400 text-xs">Write and publish SEO-optimized blog posts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">AI Video Studio</p>
                      <p className="text-slate-400 text-xs">Generate professional videos from scripts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Share2 className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">Social Content Creator</p>
                      <p className="text-slate-400 text-xs">Generate Instagram, TikTok, LinkedIn posts</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                After defining your goal, you'll use these tools to create compelling content that resonates with your audience.
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Building Your Audience</h3>
                <ol className="space-y-2 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">1</span>
                    <span>Add email signup forms to your website</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">2</span>
                    <span>Create lead magnets (ebooks, checklists, guides)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">3</span>
                    <span>Promote on social media and email</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">4</span>
                    <span>Manage subscribers in the Subscribers tool</span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Launching Your Campaign</h3>
                <ol className="space-y-2 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">1</span>
                    <span>Schedule blog posts and social content</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">2</span>
                    <span>Send email broadcasts to your list</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">3</span>
                    <span>Set up autoresponder sequences</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">4</span>
                    <span>Connect your social accounts for scheduling</span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="bg-orange-600/10 border border-orange-600/20 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Tracking & Optimization</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <div>
                    <p className="font-medium text-white mb-1">Analytics Metrics to Monitor:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                      <li>Website traffic and unique visitors</li>
                      <li>Email open rates and click-through rates</li>
                      <li>Social media engagement (likes, shares, comments)</li>
                      <li>Conversion rates and lead quality</li>
                      <li>Return on investment (ROI)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-full">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">You're Ready to Launch!</h3>
                <p className="text-slate-400 text-sm mt-2">
                  You now understand the 5-step campaign creation process. Let's get started!
                </p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-left">
                <p className="text-white text-sm font-medium mb-3">Quick Links to Get Started:</p>
                <div className="grid grid-cols-2 gap-2">
                  <a href={createPageUrl('AdminBlog')} className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" /> Blog Management
                  </a>
                  <a href={createPageUrl('AiVideoStudio')} className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" /> AI Video Studio
                  </a>
                  <a href={createPageUrl('ContentQueue')} className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" /> Content Calendar
                  </a>
                  <a href={createPageUrl('CRMHub')} className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" /> CRM Hub
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 px-6 py-4 flex items-center justify-between bg-slate-900/50">
          <Button 
            onClick={goPrev}
            variant="outline"
            disabled={currentStep === 0}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>

          <div className="flex gap-2">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep ? 'bg-indigo-600 w-6' : idx < currentStep ? 'bg-indigo-600 w-2' : 'bg-slate-700 w-2'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep === STEPS.length - 1 ? (
              <Button 
                onClick={onClose}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Close <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={goNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={currentStep === 1 && !selectedGoal}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}