import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MetaPageSelector from '@/components/social/MetaPageSelector';

export default function MetaConnect() {
  const [status, setStatus] = useState('loading'); // loading | select | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [pageName, setPageName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [availablePages, setAvailablePages] = useState([]);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const select = params.get('select');
    const error = params.get('error');
    const acctId = params.get('account_id');
    const page = params.get('page');

    setAccountId(acctId || '');

    if (error) {
      setErrorMessage(decodeURIComponent(error));
      setStatus('error');
      return;
    }

    if (success) {
      setPageName(decodeURIComponent(page || ''));
      setStatus('success');
      return;
    }

    if (select && acctId) {
      // Load available pages for selection
      const loadPages = async () => {
        const connections = await base44.entities.MetaConnection.filter({ account_id: acctId });
        const conn = connections?.[0];
        if (conn?.available_pages?.length > 0) {
          setAvailablePages(conn.available_pages);
          setStatus('select');
          setShowSelector(true);
        } else {
          setErrorMessage('No pages found to select.');
          setStatus('error');
        }
      };
      loadPages();
      return;
    }

    setStatus('error');
    setErrorMessage('Invalid callback parameters.');
  }, []);

  const handlePageSelected = (data) => {
    setShowSelector(false);
    setPageName(data.facebook_page_name || '');
    setStatus('success');
  };

  const backUrl = accountId
    ? createPageUrl('SocialAccounts') + `?account_id=${accountId}`
    : createPageUrl('SocialAccounts');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-10 max-w-md w-full text-center space-y-4">

        {status === 'loading' && (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-800">Connecting Meta…</h2>
            <p className="text-gray-500 text-sm">Please wait.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-800">Meta Connected!</h2>
            {pageName && <p className="text-gray-500 text-sm">Page: <strong>{pageName}</strong></p>}
            <p className="text-gray-500 text-sm">Your Facebook Page and Instagram are ready for auto-posting.</p>
            <a href={backUrl}>
              <Button className="w-full mt-2">← Back to Social Accounts</Button>
            </a>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-800">Connection Failed</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-left">
              <p className="text-red-700 text-sm break-words">{errorMessage}</p>
            </div>
            <a href={backUrl}>
              <Button variant="outline" className="w-full mt-2">← Back to Social Accounts</Button>
            </a>
          </>
        )}

        {status === 'select' && (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-800">Select a Page…</h2>
          </>
        )}
      </div>

      {showSelector && (
        <MetaPageSelector
          open={showSelector}
          accountId={accountId}
          pages={availablePages}
          onClose={() => { setShowSelector(false); setStatus('error'); setErrorMessage('Page selection cancelled.'); }}
          onSelected={handlePageSelected}
        />
      )}
    </div>
  );
}