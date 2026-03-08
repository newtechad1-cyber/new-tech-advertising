import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import LeadCaptureForm from './LeadCaptureForm';

export default function ExitIntentPopup({ serviceSlug, guideTitle }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (dismissed || submitted) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !dismissed && !submitted) {
        setShow(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [dismissed, submitted]);

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="text-4xl mb-3">📺</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Before You Go…</h2>
          <p className="text-slate-600">
            Download the free guide: <strong>"{guideTitle || 'How Local Businesses Win With AI Marketing'}"</strong>
          </p>
        </div>

        <LeadCaptureForm
          serviceSlug={serviceSlug}
          sourcePage="exit_intent_popup"
          ctaLabel="Send Me the Free Guide"
          compact={true}
          onSuccess={() => { setSubmitted(true); setTimeout(dismiss, 2500); }}
        />
      </div>
    </div>
  );
}