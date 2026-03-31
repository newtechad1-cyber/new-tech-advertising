import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles, ArrowRight, Share2, Lightbulb } from 'lucide-react';
import { useNextStepSuggestion, getNextActionLabel } from '@/components/diy/useNextStepSuggestion';

const ACTION_SUCCESS_CONFIG = {
  social_post: {
    title: 'Your First Post is Live! 🎉',
    description: 'Congratulations! Your post is now live on social media.',
    metric: 'Post Created',
    emoji: '📱',
    cta: 'View Post',
    nextAction: 'Create another post or try a campaign',
    color: 'from-orange-500 to-orange-600'
  },
  campaign: {
    title: 'Campaign Launched! 🚀',
    description: 'Your first campaign is now running. Sit back and watch the results.',
    metric: 'Campaign Active',
    emoji: '🎯',
    cta: 'View Campaign',
    nextAction: 'Create more content or check analytics',
    color: 'from-blue-500 to-blue-600'
  },
  video_script: {
    title: 'Script Ready to Go! 🎬',
    description: 'Your video script is ready. Next, create the video or share with your team.',
    metric: 'Script Generated',
    emoji: '🎥',
    cta: 'Refine Script',
    nextAction: 'Generate video or create another script',
    color: 'from-purple-500 to-purple-600'
  }
};

export default function FirstActionSuccessModal({
  isOpen,
  actionType,
  onClose,
  onNextStep,
  completedActions = []
}) {
  const config = ACTION_SUCCESS_CONFIG[actionType];
  const nextSuggestion = useNextStepSuggestion(completedActions);

  if (!actionType || !ACTION_SUCCESS_CONFIG[actionType]) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center space-y-3 pb-4">
          <div className="text-5xl">{config.emoji}</div>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            {config.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Description */}
          <p className="text-slate-700 text-center leading-relaxed">
            {config.description}
          </p>

          {/* Achievement Badge */}
          <div className="flex justify-center">
            <Badge className={`bg-gradient-to-r ${config.color} text-white px-3 py-1`}>
              <CheckCircle className="w-4 h-4 mr-1" />
              {config.metric}
            </Badge>
          </div>

          {/* Success Reinforcement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
            <div className="flex gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">You just took action!</p>
                <p className="text-xs text-blue-800">
                  This is the first step to real marketing growth. Keep the momentum going.
                </p>
              </div>
            </div>
          </div>

          {/* Next Action Suggestion */}
          {nextSuggestion ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
              <div className="flex gap-2 items-start">
                <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-blue-900">
                    {nextSuggestion.title}
                  </p>
                  <p className="text-xs text-blue-800 mt-1">
                    {nextSuggestion.message}
                  </p>
                  <p className="text-xs text-blue-700 italic mt-2">
                    💡 {nextSuggestion.why}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
              <p className="text-slate-600 mb-2">
                <span className="font-semibold">What's next?</span>
                <br />
                {config.nextAction}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 flex-col sm:flex-row">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Continue Browsing
          </Button>
          {nextSuggestion && (
            <Button
              onClick={() => {
                onNextStep?.(nextSuggestion.recommendedAction);
                onClose();
              }}
              className="flex-1 bg-green-600 text-white hover:bg-green-700"
            >
              {getNextActionLabel(nextSuggestion.recommendedAction)}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          <Button
            onClick={() => {
              onNextStep?.(actionType);
              onClose();
            }}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
          >
            {config.cta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Footer Message */}
        <p className="text-xs text-slate-500 text-center pt-2">
          You're on your way to marketing momentum 💪
        </p>
      </DialogContent>
    </Dialog>
  );
}