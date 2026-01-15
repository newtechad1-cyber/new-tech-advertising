import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Share2, Megaphone, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function SetupComplete() {
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const nextActions = [
    {
      icon: Share2,
      title: 'Connect Social Media',
      description: 'Link your social accounts for automated posting',
      action: 'Connect Now',
      onClick: () => navigate(createPageUrl('Dashboard') + '?tab=resources')
    },
    {
      icon: Megaphone,
      title: 'Create First Campaign',
      description: 'Launch your first marketing campaign',
      action: 'Create Campaign',
      onClick: () => navigate(createPageUrl('Dashboard') + '?tab=projects')
    },
    {
      icon: FileText,
      title: 'Review Resources',
      description: 'Watch tutorials and download templates',
      action: 'View Resources',
      onClick: () => navigate(createPageUrl('Dashboard') + '?tab=resources')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl w-full"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Setup Complete! 🎉
          </h1>
          <p className="text-xl text-slate-600">
            Your account is ready. Let's start growing your business!
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
            <CardTitle>What Happens Next?</CardTitle>
            <CardDescription className="text-white/90">
              Here's how we'll help you succeed
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Strategy Call (24 hours)</p>
                  <p className="text-sm text-slate-600">Your account manager will reach out to schedule your first call</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Setup & Optimization (48 hours)</p>
                  <p className="text-sm text-slate-600">We'll set up your website, SEO, and content strategy</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Launch & Grow (Ongoing)</p>
                  <p className="text-sm text-slate-600">Watch leads come in as our AI optimizes your marketing 24/7</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {nextActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-slate-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{action.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={action.onClick}
                  >
                    {action.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate(createPageUrl('Dashboard'))}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm text-slate-500 mt-4">
            Need help? Call us at 641-420-8816 or email rick@newtechadvertising.com
          </p>
        </div>
      </motion.div>
    </div>
  );
}