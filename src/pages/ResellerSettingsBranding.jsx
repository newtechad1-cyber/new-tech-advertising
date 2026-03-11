import React, { useState } from 'react';
import ResellerNav from '@/components/nav/ResellerNav';
import { ResellerProvider, useResellerContext } from '@/components/context/useResellerContext';
import { Palette, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function ResellerBrandingContent() {
  const { branding } = useResellerContext();
  const [formData, setFormData] = useState({
    brand_name: branding?.brand_name || '',
    primary_color: branding?.primary_color || '#1F2937',
    secondary_color: branding?.secondary_color || '#06B6D4',
    support_email: branding?.support_email || '',
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ResellerNav />

      <div className="max-w-screen-2xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Branding Settings</h2>
          <p className="text-slate-400 text-sm mt-1">Customize your white-label portal appearance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Form */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Type className="w-5 h-5 text-blue-400" />
                Brand Identity
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Brand Name</label>
                  <Input
                    value={formData.brand_name}
                    onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                    placeholder="Your Company Name"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Support Email</label>
                  <Input
                    value={formData.support_email}
                    onChange={(e) => setFormData({ ...formData, support_email: e.target.value })}
                    placeholder="support@company.com"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-violet-400" />
                Colors
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <Input
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="bg-slate-800 border-slate-700 flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Secondary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <Input
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="bg-slate-800 border-slate-700 flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button className="bg-cyan-600 hover:bg-cyan-700 w-full">Save Branding</Button>
          </div>

          {/* Preview */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 h-fit sticky top-6">
            <h3 className="text-lg font-bold text-white mb-4">Preview</h3>

            <div className="space-y-4">
              {/* Portal Header Preview */}
              <div
                style={{ backgroundColor: formData.primary_color }}
                className="rounded-lg p-4 text-white h-20 flex items-center justify-center"
              >
                <p className="text-sm font-bold">{formData.brand_name}</p>
              </div>

              {/* Button Preview */}
              <div className="space-y-2">
                <button
                  style={{ backgroundColor: formData.secondary_color }}
                  className="w-full text-white font-semibold py-2 rounded-lg transition-all hover:opacity-90"
                >
                  Sample Button
                </button>
                <p className="text-xs text-slate-400 text-center">Secondary Color</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ResellerSettingsBranding() {
  return (
    <ResellerProvider resellerId={localStorage.getItem('activeResellerId')}>
      <ResellerBrandingContent />
    </ResellerProvider>
  );
}