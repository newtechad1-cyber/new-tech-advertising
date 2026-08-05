import React from 'react';

import ADAComplianceBanner from '@/components/marketing/ADAComplianceBanner';
import YourDigitalGrowthGuide from '@/components/nta-guide/YourDigitalGrowthGuide';
import NewsletterPopup from '@/components/newsletter/NewsletterPopup';
import { createPageUrl } from '@/utils';

export default function Layout({ children, currentPageName }) {
  return (
    <>
      {children}
      <ADAComplianceBanner />
      <YourDigitalGrowthGuide />
      <NewsletterPopup />
    </>
  );
}