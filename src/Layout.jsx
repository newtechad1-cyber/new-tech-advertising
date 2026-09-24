
import ADAComplianceBanner from '@/components/marketing/ADAComplianceBanner';

function skipToContent(event) {
  const target = document.querySelector('main, [role="main"], h1');
  if (!target) return;
  event.preventDefault();
  target.id = target.id || 'main-content';
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: 'start' });
}

import YourDigitalGrowthGuide from '@/components/nta-guide/YourDigitalGrowthGuide';
import NewsletterPopup from '@/components/newsletter/NewsletterPopup';

export default function Layout({ children }) {
  return (
    <>
      <a href="#main-content" onClick={skipToContent} className="fixed left-4 top-2 z-[1000] -translate-y-24 rounded-lg bg-white px-4 py-3 font-bold text-slate-950 shadow-xl focus:translate-y-0">Skip to main content</a>
      {children}
      <ADAComplianceBanner />
      <YourDigitalGrowthGuide />
      <NewsletterPopup />
    </>
  );
}
