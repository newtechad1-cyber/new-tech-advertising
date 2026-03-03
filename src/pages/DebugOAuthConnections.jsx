import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export default function DebugOAuthConnections() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const load = async () => {
      const user = await base44.auth.me();
      if (!user || user.role !== "admin") {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setIsAdmin(true);
      const data = await base44.entities.SocialAccount.list("-created_date", 100);
      setAccounts(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!isAdmin) return <div className="p-8 text-red-600 font-semibold">Admin access required.</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Debug: OAuth Connections</h1>
      <p className="text-sm text-gray-500 mb-6">
        Entity: <code className="bg-gray-100 px-1 rounded">SocialAccount</code> — tokens stored inside the <code className="bg-gray-100 px-1 rounded">metadata</code> field (access_token, refresh_token, scope, expires_at).
        Linked to the app (not per-user).
      </p>

      {accounts.length === 0 ? (
        <p className="text-gray-500">No OAuth connections found.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Provider</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Account Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Scopes</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Expires At</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Has Refresh Token</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Last Synced</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accounts.map((acct) => {
                const meta = acct.metadata || {};
                const hasRefresh = !!meta.refresh_token;
                const expiresAt = meta.expires_at ? new Date(meta.expires_at).toLocaleString() : "—";
                const scopes = meta.scope || "—";
                return (
                  <tr key={acct.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-700">{acct.platform}</td>
                    <td className="px-4 py-3">{acct.account_name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        acct.status === "connected" ? "bg-green-100 text-green-700" :
                        acct.status === "reauthentication_needed" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {acct.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-xs text-gray-600" title={scopes}>{scopes}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{expiresAt}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${hasRefresh ? "text-green-600" : "text-red-500"}`}>
                        {hasRefresh ? "✓ true" : "✗ false"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {acct.last_synced_at ? new Date(acct.last_synced_at).toLocaleString() : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}