import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function ApprovalConfirmation({ type, onViewNext }) {
  const messages = {
    approved: {
      emoji: '👍',
      title: 'Great!',
      message: 'Your content has been approved.',
      detail: 'We will publish it as scheduled.',
      actions: [
        { label: 'Approve Next Item', onClick: onViewNext, primary: true },
        { label: 'View Calendar', onClick: () => {}, primary: false }
      ]
    },
    changes_requested: {
      emoji: '📝',
      title: 'Thanks for the feedback',
      message: 'Our team will update this content and resend for approval.',
      detail: "We'll notify you when it's ready.",
      actions: [
        { label: 'Review Next Item', onClick: onViewNext, primary: true },
        { label: 'View Requests', onClick: () => {}, primary: false }
      ]
    }
  };

  const config = messages[type];

  return createPortal(
    <div className="fixed inset-0 pointer-events-none flex items-end justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-lg pointer-events-auto mb-4 animate-in fade-in slide-in-from-bottom-4">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-4xl">{config.emoji}</div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{config.title}</h3>
              <p className="text-slate-700 mt-1">{config.message}</p>
              <p className="text-sm text-slate-600 mt-1">{config.detail}</p>
            </div>
            <div className="flex gap-2 pt-2">
              {config.actions.map((action, idx) => (
                <Button
                  key={idx}
                  onClick={action.onClick}
                  variant={action.primary ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body
  );
}