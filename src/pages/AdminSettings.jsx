import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import AdminGuard from '../components/auth/AdminGuard';
import { Loader2 } from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const allSettings = await base44.entities.AppSettings.list();
      if (allSettings.length > 0) {
        setSettings(allSettings[0]);
        setTestMode(allSettings[0].test_mode_enabled || false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTestMode = async (enabled) => {
    setSaving(true);
    try {
      if (settings) {
        await base44.entities.AppSettings.update(settings.id, {
          test_mode_enabled: enabled
        });
      } else {
        const newSettings = await base44.entities.AppSettings.create({
          test_mode_enabled: enabled
        });
        setSettings(newSettings);
      }
      setTestMode(enabled);
    } catch (error) {
      console.error('Error updating test mode:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">App Settings</h1>

          <Card>
            <CardHeader>
              <CardTitle>Testing & Development</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="test-mode" className="text-base font-semibold">
                    Test Mode
                  </Label>
                  <p className="text-sm text-slate-600">
                    Shows banner on public pages and tags all created records with test metadata
                  </p>
                </div>
                <Switch
                  id="test-mode"
                  checked={testMode}
                  onCheckedChange={toggleTestMode}
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  );
}