import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, CheckCircle2, BookOpen, Target, Building2, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function OnboardingFlow({ onComplete, initialData }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    business_name: '',
    industry: '',
    target_audience: '',
    unique_selling_propositions: '',
    marketing_goals: [],
    completed_checklist_items: []
  });

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Save to database
      const dataToSave = {
        ...formData,
        onboarding_completed: true
      };
      
      if (initialData?.id) {
        await base44.entities.ClientProfile.update(initialData.id, dataToSave);
      } else {
        await base44.entities.ClientProfile.create(dataToSave);
      }
      
      onComplete(dataToSave);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGoal = (goal) => {
    const currentGoals = formData.marketing_goals || [];
    if (currentGoals.includes(goal)) {
      updateFormData('marketing_goals', currentGoals.filter(g => g !== goal));
    } else {
      updateFormData('marketing_goals', [...currentGoals, goal]);
    }
  };

  const marketingGoalsOptions = [
    "Increase Brand Awareness",
    "Generate More Leads",
    "Improve Website Traffic",
    "Boost Social Media Engagement",
    "Enhance Customer Retention",
    "Launch New Product/Service"
  ];

  const checklistItems = [
    { id: 'profile', label: 'Complete Business Profile', desc: 'Fill in your core business details' },
    { id: 'goals', label: 'Define Marketing Goals', desc: 'Set clear objectives for your campaign' },
    { id: 'resources', label: 'Review Training Materials', desc: 'Watch the welcome video in Resources' },
    { id: 'connect', label: 'Connect Social Accounts', desc: 'Link your social media profiles' }
  ];

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="business_name">Business Name</Label>
          <Input 
            id="business_name" 
            placeholder="e.g. Acme Corp" 
            value={formData.business_name}
            onChange={(e) => updateFormData('business_name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input 
            id="industry" 
            placeholder="e.g. Retail, Healthcare, Technology" 
            value={formData.industry}
            onChange={(e) => updateFormData('industry', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="target_audience">Target Audience</Label>
          <Textarea 
            id="target_audience" 
            placeholder="Who are your ideal customers? (e.g. Small business owners in the Midwest, aged 30-50)" 
            value={formData.target_audience}
            onChange={(e) => updateFormData('target_audience', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="usp">Unique Selling Propositions (USP)</Label>
          <Textarea 
            id="usp" 
            placeholder="What makes your business unique? (e.g. 24/7 support, eco-friendly materials)" 
            value={formData.unique_selling_propositions}
            onChange={(e) => updateFormData('unique_selling_propositions', e.target.value)}
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {marketingGoalsOptions.map((goal) => (
          <div 
            key={goal}
            className={`
              p-4 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-3
              ${(formData.marketing_goals || []).includes(goal) 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'}
            `}
            onClick={() => toggleGoal(goal)}
          >
            <Checkbox 
              checked={(formData.marketing_goals || []).includes(goal)}
              onCheckedChange={() => toggleGoal(goal)}
            />
            <span className="font-medium text-sm">{goal}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <h4 className="font-semibold text-green-900">You're almost there!</h4>
        </div>
        <p className="text-green-700 text-sm">
          Here is your personalized checklist to get started with New Tech Advertising.
        </p>
      </div>

      <div className="space-y-3">
        {checklistItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-white border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`
                h-8 w-8 rounded-full flex items-center justify-center
                ${item.id === 'profile' || item.id === 'goals' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}
              `}>
                {item.id === 'profile' || item.id === 'goals' ? <CheckCircle2 className="h-5 w-5" /> : <div className="h-2 w-2 bg-slate-400 rounded-full" />}
              </div>
              <div>
                <p className="font-medium text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </div>
            {item.id === 'resources' && (
              <Button variant="outline" size="sm" className="text-blue-600" onClick={() => window.open('/dashboard?tab=resources', '_blank')}>
                View Resources <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to New Tech Advertising</h1>
        <p className="text-slate-600">Let's get your account set up for success.</p>
      </div>

      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors
              ${step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}
            `}>
              {s}
            </div>
            {s < 3 && (
              <div className={`w-20 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {step === 1 && <><Building2 className="h-5 w-5" /> Business Information</>}
            {step === 2 && <><Target className="h-5 w-5" /> Marketing Goals</>}
            {step === 3 && <><BookOpen className="h-5 w-5" /> Getting Started Checklist</>}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Tell us a bit about your business so we can tailor our services."}
            {step === 2 && "What do you hope to achieve with our marketing solutions?"}
            {step === 3 && "Review these steps to kickstart your growth journey."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </CardContent>

        <CardFooter className="flex flex-col items-end gap-3 border-t p-6 bg-slate-50 rounded-b-xl">
          {step === 1 && !formData.business_name && (
            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2 w-full">
              ⚠️ Please enter your business name to continue
            </p>
          )}
          
          <div className="flex justify-between w-full">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              disabled={step === 1}
            >
              Back
            </Button>
            
            {step < 3 ? (
              <Button 
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={step === 1 && !formData.business_name}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete} 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}