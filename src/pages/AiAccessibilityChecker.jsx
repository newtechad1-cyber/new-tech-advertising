import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { Shield, Loader, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export default function AiAccessibilityChecker() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAudit = async (e) => {
    e.preventDefault();
    if (!websiteUrl) {
      setError('Please enter a website URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await base44.functions.invoke('auditWebsiteAccessibility', {
        website_url: websiteUrl,
        lead_email: email,
        lead_phone: phone,
      });

      if (response.data.success) {
        setResult(response.data.result);
      } else {
        setError(response.data.error || 'Audit failed');
      }
    } catch (err) {
      console.error('[AiAccessibilityChecker] Error:', err);
      setError(err.message || 'Error performing audit');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low':
        return 'bg-emerald-900/30 border-emerald-700/50';
      case 'medium':
        return 'bg-amber-900/30 border-amber-700/50';
      case 'high':
        return 'bg-orange-900/30 border-orange-700/50';
      case 'critical':
        return 'bg-rose-900/30 border-rose-700/50';
      default:
        return 'bg-slate-900/30';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'low':
        return <CheckCircle className="w-6 h-6 text-emerald-400" />;
      case 'medium':
        return <AlertTriangle className="w-6 h-6 text-amber-400" />;
      case 'high':
        return <AlertTriangle className="w-6 h-6 text-orange-400" />;
      case 'critical':
        return <AlertTriangle className="w-6 h-6 text-rose-400" />;
      default:
        return <Shield className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <MarketingNav />

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Free ADA Website Checker</h1>
            <p className="text-slate-300 text-lg">
              Get instant accessibility insights for your website
            </p>
          </div>

          {!result ? (
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-8">
              <form onSubmit={handleAudit} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Website URL *</label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    disabled={isLoading}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Email (optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      disabled={isLoading}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Phone (optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      disabled={isLoading}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-900/30 border border-rose-700 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <p className="text-rose-300 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Scanning Your Website...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Run Free Audit
                    </>
                  )}
                </button>

                <p className="text-slate-400 text-xs text-center">
                  This scan takes 10-30 seconds and analyzes your website for common accessibility issues.
                </p>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Results Summary */}
              <div className={`border rounded-lg p-8 ${getRiskColor(result.risk_level)}`}>
                <div className="flex items-start gap-4">
                  {getRiskIcon(result.risk_level)}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">Audit Complete</h2>
                    <p className="text-slate-300">
                      Website: <span className="text-white font-semibold">{websiteUrl}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Scores */}
              <div className="grid sm:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 text-center">
                  <p className="text-slate-400 text-sm mb-2">Compliance Score</p>
                  <p className="text-3xl font-bold text-violet-400">{result.compliance_score}%</p>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 text-center">
                  <p className="text-slate-400 text-sm mb-2">Risk Level</p>
                  <p className="text-xl font-bold text-white capitalize">{result.risk_level}</p>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 text-center">
                  <p className="text-slate-400 text-sm mb-2">WCAG Level</p>
                  <p className="text-3xl font-bold text-white">{result.wcag_level}</p>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 text-center">
                  <p className="text-slate-400 text-sm mb-2">Issues Found</p>
                  <p className="text-3xl font-bold text-rose-400">{result.issues_count}</p>
                </div>
              </div>

              {/* Issues */}
              {result.issues_count > 0 && (
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-white font-semibold text-lg mb-4">Issues Found</h3>
                  <ul className="space-y-3">
                    {result.issues.map((issue, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-300">
                        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Recommended Actions
                  </h3>
                  <ol className="space-y-2">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-slate-300 flex gap-3">
                        <span className="text-violet-400 font-semibold">{idx + 1}.</span>
                        {rec}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Report */}
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Full Report</h3>
                <div className="bg-slate-800 rounded p-4 text-slate-300 text-sm whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
                  {result.report}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-violet-900/30 border border-violet-700/50 rounded-lg p-8 text-center">
                <h3 className="text-white font-semibold text-xl mb-4">Ready to Fix Your Website?</h3>
                <p className="text-slate-300 mb-6">
                  Our team can help you remediate these issues and achieve WCAG compliance.
                </p>
                <button
                  onClick={() => {
                    setResult(null);
                    setWebsiteUrl('');
                  }}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors mr-3"
                >
                  Audit Another Site
                </button>
                <a
                  href="mailto:info@nta.com?subject=ADA%20Website%20Remediation"
                  className="inline-block bg-slate-700 hover:bg-slate-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Schedule Consultation
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}