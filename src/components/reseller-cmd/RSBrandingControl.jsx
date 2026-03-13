import React, { useState } from 'react';
import { Palette, Lock, Eye, EyeOff, Image, Type, Save } from 'lucide-react';

const LOCKED_ELEMENTS = [
  'NTA core platform positioning statement',
  'Service delivery methodology descriptions',
  'Performance guarantee language',
  'Technology stack documentation',
  'Pricing floor enforcement messaging',
];

const ALLOWED_ELEMENTS = [
  { id: 'logo', label: 'Company Logo', icon: Image, type: 'upload' },
  { id: 'primary_color', label: 'Primary Brand Color', icon: Palette, type: 'color' },
  { id: 'secondary_color', label: 'Secondary Color', icon: Palette, type: 'color' },
  { id: 'header_message', label: 'Proposal Header Message', icon: Type, type: 'textarea' },
];

export default function RSBrandingControl({ selectedReseller, onSave }) {
  const [branding, setBranding] = useState({
    logo: selectedReseller?.logo_url || '',
    primary_color: selectedReseller?.brand_primary_color || '#3b82f6',
    secondary_color: selectedReseller?.brand_secondary_color || '#1e3a5f',
    header_message: selectedReseller?.proposal_header_message || '',
  });
  const [showLocked, setShowLocked] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave?.(branding);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!selectedReseller) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
        <Palette className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-slate-500 text-sm">Select a reseller to configure branding</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm flex items-center gap-2"><Palette className="w-4 h-4 text-purple-400" /> Brand Control</h3>
          <p className="text-slate-500 text-xs mt-0.5">{selectedReseller.company_name}</p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            saved ? 'bg-green-600/20 text-green-400 border border-green-700/40' : 'bg-purple-600/20 text-purple-400 border border-purple-700/40 hover:bg-purple-600/30'
          }`}>
          <Save className="w-3 h-3" /> {saved ? 'Saved ✓' : 'Save Branding'}
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Allowed customizations */}
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-3">Reseller Can Customize</p>
          <div className="space-y-3">
            {ALLOWED_ELEMENTS.map((el) => {
              const Icon = el.icon;
              return (
                <div key={el.id} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                  <Icon className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-300 text-xs font-semibold mb-1">{el.label}</p>
                    {el.type === 'color' ? (
                      <div className="flex items-center gap-2">
                        <input type="color" value={branding[el.id] || '#3b82f6'}
                          onChange={e => setBranding(b => ({ ...b, [el.id]: e.target.value }))}
                          className="w-8 h-7 rounded cursor-pointer bg-transparent border-0" />
                        <span className="text-slate-500 text-xs font-mono">{branding[el.id] || '#3b82f6'}</span>
                      </div>
                    ) : el.type === 'textarea' ? (
                      <textarea value={branding[el.id] || ''} rows={2}
                        onChange={e => setBranding(b => ({ ...b, [el.id]: e.target.value }))}
                        placeholder="Enter custom header text..."
                        className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-purple-500 resize-none" />
                    ) : (
                      <input type="url" value={branding[el.id] || ''} placeholder="https://..."
                        onChange={e => setBranding(b => ({ ...b, [el.id]: e.target.value }))}
                        className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-purple-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Locked platform elements */}
        <div>
          <button onClick={() => setShowLocked(s => !s)}
            className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wide mb-2 hover:text-slate-400 transition-colors">
            {showLocked ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            Platform-Locked Content ({LOCKED_ELEMENTS.length})
          </button>
          {showLocked && (
            <div className="space-y-1.5">
              {LOCKED_ELEMENTS.map((el, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-900/60 border border-slate-700/30 rounded-lg opacity-60">
                  <Lock className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                  <span className="text-slate-500 text-xs">{el}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview card */}
        {(branding.primary_color || branding.header_message) && (
          <div className="p-4 rounded-xl border border-slate-600" style={{ background: `linear-gradient(135deg, ${branding.primary_color}20, ${branding.secondary_color}15)`, borderColor: `${branding.primary_color}40` }}>
            <p className="text-xs font-bold mb-1" style={{ color: branding.primary_color }}>Preview: Proposal Header</p>
            <p className="text-white text-sm font-semibold">{selectedReseller.company_name}</p>
            {branding.header_message && <p className="text-slate-300 text-xs mt-1 italic">"{branding.header_message}"</p>}
          </div>
        )}
      </div>
    </div>
  );
}