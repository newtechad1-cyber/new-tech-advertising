import React, { useState } from 'react';
import { Eye, Monitor, Mail, LogIn } from 'lucide-react';

export default function BrandingPreviewPanel({ branding }) {
  const [activePreview, setActivePreview] = useState('portal');

  const previewTabs = [
    { id: 'portal', label: 'Portal', icon: Monitor },
    { id: 'login', label: 'Login', icon: LogIn },
    { id: 'email', label: 'Email', icon: Mail },
  ];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center gap-1 border-b border-slate-700 bg-slate-800/50 p-3">
        <Eye className="w-4 h-4 text-slate-400 mr-2" />
        {previewTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePreview(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1 ${
                activePreview === tab.id
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-6 min-h-96">
        {activePreview === 'portal' && (
          <div className="space-y-4">
            {/* Portal Header */}
            <div
              style={{ backgroundColor: branding?.primary_color }}
              className="rounded-lg p-4 text-white"
            >
              <div className="flex items-center gap-3">
                {branding?.logo_url && (
                  <img src={branding.logo_url} alt="Logo" className="h-8 object-contain" />
                )}
                <div>
                  <h2 className="text-lg font-bold">{branding?.brand_name || 'Your Platform'}</h2>
                  <p className="text-xs opacity-80">Dashboard</p>
                </div>
              </div>
            </div>

            {/* Sample Cards */}
            <div className="grid grid-cols-2 gap-3">
              {['Clients', 'Reports', 'Publishing', 'Analytics'].map((item, idx) => (
                <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                  <p className="text-xs font-semibold text-slate-300">{item}</p>
                  <p className="text-2xl font-bold text-white mt-1">—</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-700 text-xs text-slate-400">
              <p>{branding?.footer_text || '© 2026. All rights reserved.'}</p>
            </div>
          </div>
        )}

        {activePreview === 'login' && (
          <div className="max-w-sm mx-auto">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center space-y-4">
              {branding?.logo_url && (
                <img src={branding.logo_url} alt="Logo" className="h-12 mx-auto object-contain" />
              )}
              <h1 className="text-xl font-bold text-white">{branding?.login_page_title || 'Welcome'}</h1>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm"
                />
              </div>
              <button
                style={{ backgroundColor: branding?.secondary_color }}
                className="w-full text-white font-semibold py-2 rounded-lg transition-all hover:opacity-90"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {activePreview === 'email' && (
          <div className="max-w-sm mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
            {/* Email Header */}
            <div style={{ backgroundColor: branding?.primary_color }} className="p-4 text-white">
              <p className="text-sm font-bold">{branding?.email_header_text || 'Marketing Platform'}</p>
            </div>

            {/* Email Body */}
            <div className="p-6 text-slate-700">
              <p className="text-sm mb-4">Hello,</p>
              <p className="text-sm mb-4">This is a sample email from your platform.</p>
              <button
                style={{ backgroundColor: branding?.secondary_color }}
                className="text-white font-semibold px-4 py-2 rounded-lg text-sm"
              >
                View Details
              </button>
            </div>

            {/* Email Footer */}
            <div style={{ backgroundColor: '#f3f4f6' }} className="p-4 border-t text-center">
              <p className="text-xs text-slate-600">{branding?.email_footer_text || 'Powered by our platform'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}