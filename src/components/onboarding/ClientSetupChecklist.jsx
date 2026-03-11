import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const CHECKLIST_SECTIONS = [
  {
    title: 'Brand Setup',
    items: [
      { key: 'logo_uploaded', label: 'Logo uploaded' },
      { key: 'brand_colors_set', label: 'Brand colors set' },
      { key: 'cta_configured', label: 'CTA configured' },
      { key: 'website_url_confirmed', label: 'Website URL confirmed' },
    ],
  },
  {
    title: 'Publishing Setup',
    items: [
      { key: 'website_publishing_ready', label: 'Website publishing ready' },
      { key: 'facebook_connected', label: 'Facebook connected' },
      { key: 'instagram_mapped', label: 'Instagram mapped' },
      { key: 'youtube_connected', label: 'YouTube connected' },
      { key: 'tiktok_configured', label: 'TikTok configured' },
      { key: 'google_profile_linked', label: 'Google profile linked' },
    ],
  },
  {
    title: 'Content Setup',
    items: [
      { key: 'first_video_topic_selected', label: 'First video topic selected' },
      { key: 'script_generated', label: 'Script generated' },
      { key: 'branding_template_applied', label: 'Branding template applied' },
      { key: 'render_created', label: 'Render created' },
    ],
  },
  {
    title: 'Client Experience Setup',
    items: [
      { key: 'client_portal_activated', label: 'Client portal activated' },
      { key: 'approval_notifications_enabled', label: 'Approval notifications enabled' },
      { key: 'calendar_visible', label: 'Calendar visible' },
      { key: 'onboarding_welcome_sent', label: 'Onboarding welcome sent' },
    ],
  },
];

export default function ClientSetupChecklist({ clientData = {} }) {
  const getCompletionPercentage = () => {
    const allItems = CHECKLIST_SECTIONS.flatMap(s => s.items);
    const completed = allItems.filter(item => clientData[item.key]).length;
    return Math.round((completed / allItems.length) * 100);
  };

  const completion = getCompletionPercentage();

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white">Setup Checklist</h3>
          <span className={`text-sm font-bold ${completion === 100 ? 'text-emerald-400' : 'text-slate-400'}`}>
            {completion}%
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {CHECKLIST_SECTIONS.map((section, idx) => (
          <div key={idx}>
            <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase">{section.title}</h4>
            <div className="space-y-2">
              {section.items.map((item, itemIdx) => {
                const isChecked = clientData[item.key];
                return (
                  <div key={itemIdx} className="flex items-center gap-3">
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${isChecked ? 'text-slate-300 line-through' : 'text-slate-400'}`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}