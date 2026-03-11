import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, ArrowRight, Link as LinkIcon } from "lucide-react";
import { createPageUrl } from "@/utils";

const ISSUE_MAP = {
  facebook: {
    needs_connection: {
      problem: "Facebook Page is not connected",
      fix: "Add META_PAGE_ACCESS_TOKEN and META_PAGE_ID to environment secrets, then verify in settings."
    },
    incomplete: {
      problem: "Facebook token exists but Page ID is not mapped",
      fix: "Open Facebook Settings and enter your Facebook Page ID."
    },
    token_expired: {
      problem: "Facebook access token has expired",
      fix: "Regenerate your Page Access Token in Facebook Business Manager and update META_PAGE_ACCESS_TOKEN."
    },
    error: {
      problem: "Facebook connection check returned an error",
      fix: "Review the error message in Facebook Settings and verify your token is valid."
    }
  },
  instagram: {
    needs_connection: {
      problem: "Instagram Business Account is not connected",
      fix: "Add META_INSTAGRAM_ACCOUNT_ID to environment secrets and verify the account in settings."
    },
    incomplete: {
      problem: "Instagram is partially configured but Business Account mapping is missing",
      fix: "Ensure your Instagram account is a Business or Creator account linked to your Facebook Page."
    },
    error: {
      problem: "Instagram connection check returned an error",
      fix: "Verify META_INSTAGRAM_ACCOUNT_ID is correct and the token has Instagram publishing permissions."
    }
  },
  youtube: {
    needs_connection: {
      problem: "YouTube channel is not connected",
      fix: "Set up YouTube Data API v3 OAuth credentials. Connect a YouTube channel to enable publishing."
    },
    token_expired: {
      problem: "YouTube OAuth token has expired",
      fix: "Re-authorize the YouTube connection to obtain a fresh access token."
    }
  },
  tiktok: {
    needs_connection: {
      problem: "TikTok OAuth authorization is incomplete",
      fix: "TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET are set. Complete the TikTok user OAuth authorization flow."
    }
  }
};

function getIssues(connections) {
  const issues = [];
  connections.forEach(conn => {
    const statusIssues = ISSUE_MAP[conn.platform_type];
    if (!statusIssues) return;
    const s = conn.connection_status;
    if (statusIssues[s]) {
      issues.push({ platform: conn.platform_type, ...statusIssues[s], status: s, connId: conn.id });
    }
  });
  return issues;
}

export default function ConnectionHealthPanel({ connections }) {
  const issues = getIssues(connections);
  const healthy = connections.filter(c => c.connection_status === 'connected' || c.connection_status === 'ready');
  const allHealthy = issues.length === 0;

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Connection Health & Troubleshooting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {healthy.length > 0 && (
          <div className="rounded-xl border border-green-800/30 bg-green-950/10 p-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            <p className="text-xs text-green-300 font-semibold">
              {healthy.length} channel{healthy.length !== 1 ? 's' : ''} healthy: {healthy.map(c => c.platform_type).join(', ')}
            </p>
          </div>
        )}

        {allHealthy && (
          <div className="text-center py-6 text-slate-600">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-600/40" />
            <p className="text-sm">No connection issues detected.</p>
          </div>
        )}

        {issues.map((issue, i) => (
          <div key={i} className="rounded-xl border border-orange-800/30 bg-orange-950/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-orange-200 capitalize">
                  {issue.platform} — {issue.problem}
                </p>
                <div className="flex items-start gap-1.5 mt-2">
                  <ArrowRight className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-400 leading-snug">{issue.fix}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {issues.length > 0 && (
          <p className="text-[10px] text-slate-600 pt-1">
            Fix these issues by updating environment secrets or editing the platform settings above.
            Blocked publish jobs will automatically retry after connections are restored.
          </p>
        )}
      </CardContent>
    </Card>
  );
}