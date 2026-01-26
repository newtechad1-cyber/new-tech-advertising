import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { AlertTriangle } from 'lucide-react';

export default function TestModeBanner() {
  const [isTestMode, setIsTestMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkTestMode();
  }, []);

  const checkTestMode = async () => {
    try {
      const settings = await base44.entities.AppSettings.list();
      if (settings.length > 0 && settings[0].test_mode_enabled) {
        setIsTestMode(true);
      }
    } catch (error) {
      console.log('Error checking test mode:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isTestMode) return null;

  return (
    <div className="bg-yellow-500 text-slate-900 py-2 px-4 text-center font-semibold text-sm flex items-center justify-center gap-2">
      <AlertTriangle className="w-4 h-4" />
      TEST MODE ENABLED
    </div>
  );
}