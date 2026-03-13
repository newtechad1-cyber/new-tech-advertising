import React from 'react';
import { CheckCircle2, Phone, MessageSquare, DollarSign, Calendar, Loader2 } from 'lucide-react';

const fmt = (n) => n ? `$${Number(n).toLocaleString()}` : '—';

export default function DRStickyFooter({ monthlyFee, setupFee, startDate, contractTerm, packageName, onAccept, onCallRequest, onChangeRequest, accepting }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-700/80 shadow-2xl">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center gap-6 flex-wrap">
          {/* Investment summary */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-slate-500 text-xs">Monthly</p>
                <p className="text-white font-black text-lg">{fmt(monthlyFee)}<span className="text-slate-400 text-xs font-normal">/mo</span></p>
              </div>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div>
              <p className="text-slate-500 text-xs">Setup</p>
              <p className="text-white font-bold">{fmt(setupFee)}</p>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-slate-500 text-xs">Start Date</p>
                <p className="text-white font-bold text-sm">{startDate || 'TBD'}</p>
              </div>
            </div>
            {contractTerm && (
              <>
                <div className="w-px h-10 bg-slate-700" />
                <div>
                  <p className="text-slate-500 text-xs">Term</p>
                  <p className="text-white font-bold text-sm">{contractTerm} months</p>
                </div>
              </>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onChangeRequest}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Request Changes
            </button>
            <button
              onClick={onCallRequest}
              className="flex items-center gap-2 px-4 py-2.5 border border-blue-600/60 hover:border-blue-500 text-blue-400 hover:text-blue-300 rounded-xl text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              Schedule a Call
            </button>
            <button
              onClick={onAccept}
              disabled={accepting}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-green-900/50 disabled:opacity-60"
            >
              {accepting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Accept This Plan</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}