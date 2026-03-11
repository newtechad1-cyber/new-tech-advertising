import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function ChangeRequestModal({ isOpen, video, onSubmit, onClose }) {
  const [feedback, setFeedback] = useState('');
  const [categories, setCategories] = useState({
    caption: false,
    timing: false,
    branding: false,
    other: false
  });

  const handleSubmit = () => {
    onSubmit(feedback);
    setFeedback('');
    setCategories({ caption: false, timing: false, branding: false, other: false });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Changes</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <p className="text-sm text-slate-600">
            Let us know what you'd like us to adjust on "{video?.title}"
          </p>

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-slate-700 uppercase">
              What needs to change?
            </Label>
            <div className="space-y-2">
              {[
                { key: 'caption', label: 'Edit caption or text' },
                { key: 'timing', label: 'Change publish timing' },
                { key: 'branding', label: 'Branding or colors' },
                { key: 'other', label: 'General feedback' }
              ].map(cat => (
                <div key={cat.key} className="flex items-center gap-2">
                  <Checkbox
                    id={cat.key}
                    checked={categories[cat.key]}
                    onCheckedChange={(checked) =>
                      setCategories({ ...categories, [cat.key]: checked })
                    }
                  />
                  <label htmlFor={cat.key} className="text-sm text-slate-700 cursor-pointer">
                    {cat.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-xs font-semibold text-slate-700 uppercase">
              Your feedback
            </Label>
            <Textarea
              id="feedback"
              placeholder="Tell us what changes you'd like..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-24 resize-none"
            />
            <p className="text-xs text-slate-500">
              Our team will review and update this content
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!feedback.trim()}
              className="flex-1"
            >
              Send Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}