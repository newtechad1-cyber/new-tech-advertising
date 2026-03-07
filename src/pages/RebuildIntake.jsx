import { useEffect } from 'react';
import { createPageUrl } from '@/utils';
// Canonical: RebuildIntake → Rebuild-Intake
export default function RebuildIntake() {
  useEffect(() => { window.location.replace(createPageUrl('Rebuild-Intake')); }, []);
  return null;
}