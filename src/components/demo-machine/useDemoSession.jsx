import { useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';

export function getOrCreateSessionKey() {
  let key = localStorage.getItem('nta_demo_session');
  if (!key) {
    key = 'demo_' + Math.random().toString(36).slice(2) + Date.now();
    localStorage.setItem('nta_demo_session', key);
  }
  return key;
}

export function useDemoTrack() {
  const sessionKey = getOrCreateSessionKey();

  const track = async (interaction_type, extra = {}) => {
    try {
      await base44.functions.invoke('trackDemoInteraction', {
        interaction_type,
        session_key: sessionKey,
        page_path: window.location.pathname,
        ...extra,
      });
    } catch (e) {
      // silent
    }
  };

  return { track, sessionKey };
}

export function useDemoPageView(pageName) {
  const { track } = useDemoTrack();
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    track('page_view', { page_path: pageName });
  }, [pageName]);
}