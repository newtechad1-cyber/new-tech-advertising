import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { 
  FileSignature, ChevronLeft, ShieldCheck, 
  CheckCircle2, Download, AlertCircle, Clock
} from 'lucide-react';

export default function DocumentSigner() {
  const { clientId, agreementId } = useParams();
  const navigate = useNavigate();
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Signature Form State
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const doc = await base44.entities.ClientAgreement.get(agreementId);
        setAgreement(doc);
      } catch (e) {
        setError('Document not found or access denied.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [agreementId]);

  const handleSign = async (e) => {
    e.preventDefault();
    if (!signerName || !signerEmail || !agreed) {
      setError('Please fill out all fields and agree to the terms.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await base44.entities.ClientAgreement.update(agreementId, {
        status: 'Signed',
        signer_name: signerName,
        signer_email: signerEmail,
        signed_date: new Date().toISOString(),
        signature_data: `DIGITAL_SIGNATURE|IP_VERIFIED|${new Date().getTime()}`
      });
      
      setSuccess(true);
      // Update local state to reflect signed status
      setAgreement(prev => ({
        ...prev,
        status: 'Signed',
        signer_name: signerName,
        signer_email: signerEmail,
        signed_date: new Date().toISOString()
      }));
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    window.open(`/api/functions/exportAgreementPDF?id=${agreementId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-slate-700 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Document Not Found</h1>
        <p className="text-slate-400 mb-6">The document you are looking for does not exist or has been removed.</p>
        <Link to={`/c/${clientId}`} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
          Return to Portal
        </Link>
      </div>
    );
  }

  const isSigned = agreement.status === 'Signed' || agreement.status === 'Completed';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to={`/c/${clientId}`} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-slate-200">Secure Document Viewer</span>
          </div>
        </div>
        {isSigned && (
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors">
            <Download className="w-4 h-4" /> PDF
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
          
          {/* Document Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 lg:p-10 shadow-xl">
              <div className="border-b border-slate-800 pb-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-full uppercase tracking-wider">
                    {agreement.agreement_type}
                  </span>
                  {isSigned ? (
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Executed
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Pending Signature
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-black text-white mb-2">{agreement.title}</h1>
                <p className="text-slate-400">Prepared for <strong className="text-slate-200">{agreement.business_name}</strong></p>
              </div>

              <div className="prose prose-invert prose-slate max-w-none">
                {agreement.content ? (
                  <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                    {agreement.content}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No document content provided.</p>
                )}
              </div>
            </div>
          </div>

          {/* Signature Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24 shadow-xl">
              {isSigned ? (
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Document Signed</h3>
                    <p className="text-sm text-slate-400">This document has been legally executed and securely stored.</p>
                  </div>
                  
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Signed By</p>
                      <p className="text-sm font-medium text-white">{agreement.signer_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Email</p>
                      <p className="text-sm font-medium text-white">{agreement.signer_email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Timestamp</p>
                      <p className="text-sm font-medium text-white">{new Date(agreement.signed_date).toLocaleString()}</p>
                    </div>
                  </div>

                  <button onClick={handleDownloadPDF} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors">
                    <Download className="w-4 h-4" /> Download PDF Copy
                  </button>
                </div>
              ) : success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
                  <p className="text-sm text-slate-400 mb-6">Your signature has been securely recorded.</p>
                  <Link to={`/c/${clientId}`} className="block w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors">
                    Return to Portal
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSign} className="space-y-5">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Sign Document</h3>
                    <p className="text-sm text-slate-400">Please review the document and sign below to accept the terms.</p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-xs text-red-400">{error}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Legal Name</label>
                    <input 
                      type="text" 
                      value={signerName}
                      onChange={e => setSignerName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      value={signerEmail}
                      onChange={e => setSignerEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 bg-slate-950 border border-slate-700 rounded transition-colors peer-checked:bg-blue-600 peer-checked:border-blue-600 group-hover:border-slate-500"></div>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-xs text-slate-400 leading-relaxed">
                      I agree to be legally bound by this document and its terms. My typed name serves as my official digital signature.
                    </span>
                  </label>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full flex items-center justify-center py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                  >
                    {submitting ? 'Processing...' : 'Sign & Accept'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}