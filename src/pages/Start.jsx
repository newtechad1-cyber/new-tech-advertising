import React, { useEffect } from 'react';
import { createPageUrl } from '@/utils';

// Canonical: /start → Get-Started
export default function Start() {
  useEffect(() => {
    window.location.replace(createPageUrl('Get-Started'));
  }, []);
  return null;
}