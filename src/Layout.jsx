import React from 'react';

import ADAComplianceBanner from '@/components/marketing/ADAComplianceBanner';
import YourDigitalGrowthGuide from '@/components/nta-guide/YourDigitalGrowthGuide';
import NewsletterPopup from '@/components/newsletter/NewsletterPopup';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <ADAComplianceBanner />
      <YourDigitalGrowthGuide />
      <NewsletterPopup />
    </>
  );
}
