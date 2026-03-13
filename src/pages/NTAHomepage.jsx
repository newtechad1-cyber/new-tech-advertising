import React from 'react';
import NTANav from '@/components/nta-home/NTANav';
import NTAHero from '@/components/nta-home/NTAHero';
import NTAPainPoints from '@/components/nta-home/NTAPainPoints';
import NTASystemFlow from '@/components/nta-home/NTASystemFlow';
import NTAPlatformPreview from '@/components/nta-home/NTAPlatformPreview';
import NTAProof from '@/components/nta-home/NTAProof';
import NTAIndustries from '@/components/nta-home/NTAIndustries';
import NTAProcess from '@/components/nta-home/NTAProcess';
import NTAPricing from '@/components/nta-home/NTAPricing';
import NTAConversionClose from '@/components/nta-home/NTAConversionClose';
import NTAFooter from '@/components/nta-home/NTAFooter';

export default function NTAHomepage() {
  return (
    <div className="min-h-screen">
      <NTANav />
      <NTAHero />
      <NTAPainPoints />
      <NTASystemFlow />
      <NTAPlatformPreview />
      <NTAProof />
      <NTAIndustries />
      <NTAProcess />
      <NTAPricing />
      <NTAConversionClose />
      <NTAFooter />
    </div>
  );
}