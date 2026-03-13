import React from 'react';
import { Check, ArrowRight, Star, Zap, Crown } from 'lucide-react';

const ICONS = {
  visibility_foundation: Star,
  market_authority: Zap,
  market_domination: Crown,
};

const COLORS = {
  visibility_foundation: { accent: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', badge: 'bg-blue-100 text-blue-700' },
  market_authority:      { accent: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', badge: 'bg-purple-100 text-purple-700' },
  market_domination:     { accent: '#f59e0b', bg: '#fffbeb', border: '#fde68a', badge: 'bg-amber-100 text-amber-800' },
};

export default function PSPackageCard({ pkg, pkgKey, pricing, isSelected, isRecommended, onSelect, showUpgradePath, onUpgrade }) {
  const Icon = ICONS[pkgKey] || Star;
  const clr = COLORS[pkgKey] || COLORS.visibility_foundation;

  return (
    <div
      onClick={() => onSelect(pkgKey)}
      className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all ${
        isSelected ? 'shadow-xl' : 'hover:shadow-md hover:border-slate-300'
      }`}
      style={{
        borderColor: isSelected ? clr.accent : '#e2e8f0',
        background: isSelected ? clr.bg : 'white',
      }}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black text-white shadow"
          style={{ background: clr.accent }}>
          Recommended
        </div>
      )}

      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: clr.bg }}>
          <Icon className="w-5 h-5" style={{ color: clr.accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-slate-900 text-sm leading-tight">{pkg.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{pkg.tagline}</p>
        </div>
      </div>

      {/* Investment */}
      <div className="mb-4 p-3 rounded-xl" style={{ background: isSelected ? 'white' : '#f8fafc' }}>
        {pricing ? (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">${pricing.adjustedMonthly?.toLocaleString()}</span>
              <span className="text-xs text-slate-400">/mo</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">+ ${pricing.adjustedSetup?.toLocaleString()} one-time setup</p>
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">${pkg.base_monthly?.toLocaleString()}</span>
              <span className="text-xs text-slate-400">/mo</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">+ ${pkg.base_setup?.toLocaleString()} one-time setup</p>
          </>
        )}
      </div>

      {/* Capability highlights */}
      <div className="space-y-1.5 mb-4">
        {(pkg.capabilities || []).slice(0, 5).map((cap, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
            <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: clr.accent }} />
            {cap}
          </div>
        ))}
      </div>

      {/* Content stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Articles/mo', val: pkg.content_articles },
          { label: 'Social posts', val: pkg.social_posts },
          { label: 'Videos/mo', val: pkg.videos },
        ].map(s => (
          <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: isSelected ? 'white' : '#f1f5f9' }}>
            <p className="text-base font-black text-slate-900">{s.val}</p>
            <p className="text-xs text-slate-400 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Select / selected indicator */}
      <div className={`w-full py-2.5 rounded-xl text-xs font-black text-center transition-colors ${
        isSelected ? 'text-white shadow' : 'border border-slate-200 text-slate-600 hover:border-slate-300'
      }`} style={isSelected ? { background: clr.accent } : {}}>
        {isSelected ? 'Selected' : 'Select Package'}
      </div>

      {/* Upgrade nudge */}
      {isSelected && showUpgradePath && pkg.upgrade_path && (
        <button onClick={(e) => { e.stopPropagation(); onUpgrade(pkg.upgrade_path); }}
          className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl border border-dashed hover:border-slate-300 hover:bg-slate-50 transition-colors"
          style={{ color: clr.accent, borderColor: clr.accent + '60' }}>
          See upgrade path <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}