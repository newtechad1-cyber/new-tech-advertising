import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ADAComplianceBanner() {
  return (
    <div className="bg-slate-900 border-t border-slate-800 py-4 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-emerald-400/80 flex-shrink-0" />
          <p className="text-xs text-slate-400 leading-snug">
            <Link to="/accessibility" className="font-semibold text-slate-200 underline hover:text-white mr-2">Accessibility &amp; Help:</Link>
            We are working to make this site usable for everyone. If you encounter a barrier, <Link to="/contact" className="font-semibold text-slate-200 underline hover:text-white">contact us for help or an accessible alternative</Link>. You can also call or text 641-420-8816.
          </p>
        </div>
      </div>
    </div>
  );
}