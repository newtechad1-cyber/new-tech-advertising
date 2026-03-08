import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, X } from 'lucide-react';

const CONFIG = {
  accept: {
    emoji: '✅',
    title: 'Approve This Proposal',
    subtitle: "We'd love to confirm who we're speaking with before we get started.",
    cta: 'Approve Proposal',
    bg: 'bg-green-500 hover:bg-green-600',
  },
  revision: {
    emoji: '✏️',
    title: 'Request Changes',
    subtitle: "Let us know how to reach you and we'll follow up to discuss revisions.",
    cta: 'Submit Revision Request',
    bg: 'bg-amber-500 hover:bg-amber-600',
  },
  call_request: {
    emoji: '📞',
    title: 'Schedule a Call',
    subtitle: "Share your contact info and we'll reach out to set up a time.",
    cta: 'Request a Call',
    bg: 'bg-blue-600 hover:bg-blue-700',
  },
};

export default function AcceptModal({ action, onConfirm, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const cfg = CONFIG[action] || CONFIG.call_request;

  const submit = async () => {
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    await onConfirm(action, name.trim(), email.trim());
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="text-4xl mb-4">{cfg.emoji}</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">{cfg.title}</h2>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">{cfg.subtitle}</p>

        <div className="space-y-3 mb-6">
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">Your Name *</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Full name"
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">Your Email *</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@yourbusiness.com"
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
          </div>
        </div>

        <Button
          className={`w-full text-white font-semibold py-3 ${cfg.bg}`}
          onClick={submit}
          disabled={!name.trim() || !email.trim() || loading}
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {cfg.cta}
        </Button>
        <button
          onClick={onClose}
          className="w-full text-center text-slate-400 text-sm mt-3 hover:text-slate-600 transition-colors"
        >
          Go back to proposal
        </button>
      </div>
    </div>
  );
}