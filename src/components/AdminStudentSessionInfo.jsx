import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, Trash2, Loader2 } from 'lucide-react';

/**
 * Admin component: displays student session info and allows revocation.
 * Shows active sessions, last activity, device info.
 * 
 * Props:
 * - studentUserId: string
 * - schoolSlug: string
 * - studentEmail: string (for display)
 */
export default function AdminStudentSessionInfo({
  studentUserId,
  schoolSlug,
  studentEmail,
}) {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revoking, setRevoking] = useState(null);

  useEffect(() => {
    const loadSessionInfo = async () => {
      try {
        setLoading(true);
        const response = await base44.functions.invoke('getStudentSessionInfo', {
          student_user_id: studentUserId,
          school_slug: schoolSlug,
        });

        if (response.data) {
          setSessionInfo(response.data);
        }
      } catch (err) {
        setError('Failed to load session info');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (studentUserId && schoolSlug) {
      loadSessionInfo();
    }
  }, [studentUserId, schoolSlug]);

  const handleRevokeSession = async (sessionId) => {
    try {
      setRevoking(sessionId);
      await base44.functions.invoke('revokeStudentSessions', {
        student_user_id: studentUserId,
        school_slug: schoolSlug,
        reason: `Manual admin revocation for session ${sessionId}`,
      });
      // Reload session info
      const response = await base44.functions.invoke('getStudentSessionInfo', {
        student_user_id: studentUserId,
        school_slug: schoolSlug,
      });
      if (response.data) {
        setSessionInfo(response.data);
      }
    } catch (err) {
      setError('Failed to revoke session');
      console.error(err);
    } finally {
      setRevoking(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
        </CardContent>
      </Card>
    );
  }

  const activeSessions = sessionInfo?.sessions || [];
  const activeCount = sessionInfo?.active_session_count || 0;
  const lastActivity = sessionInfo?.last_activity;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Session Status
        </CardTitle>
        <CardDescription>{studentEmail}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-semibold">Active Sessions</p>
            <p className="text-2xl font-bold text-blue-600">{activeCount}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-semibold">Total Created</p>
            <p className="text-2xl font-bold text-gray-700">
              {sessionInfo?.total_sessions_created || 0}
            </p>
          </div>
        </div>

        {/* Last Activity */}
        {lastActivity && (
          <div className="border-l-4 border-green-500 bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 font-semibold">Last Activity</p>
            <p className="text-sm text-gray-800">
              {new Date(lastActivity).toLocaleString()}
            </p>
          </div>
        )}

        {/* Active Sessions List */}
        {activeSessions.length > 0 ? (
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-sm font-semibold text-gray-900">Active Sessions</h4>
            {activeSessions.map((session, idx) => (
              <div
                key={session.session_id}
                className="bg-gray-50 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-mono truncate">
                      Session {idx + 1}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-700">
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <p className="font-semibold">
                          {new Date(session.created_at).toLocaleDateString()} at{' '}
                          {new Date(session.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Expires:</span>
                        <p className="font-semibold">
                          {new Date(session.expires_at).toLocaleDateString()} at{' '}
                          {new Date(session.expires_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Last Seen:</span>
                        <p className="font-semibold">
                          {new Date(session.last_seen_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Device:</span>
                        <p className="text-xs font-mono text-gray-600 truncate">
                          {session.user_agent}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">IP Address:</span>
                        <p className="font-semibold">{session.ip_address}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevokeSession(session.session_id)}
                    disabled={revoking === session.session_id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {revoking === session.session_id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 border-t text-gray-500">
            <p className="text-sm">No active sessions</p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-xs text-blue-900">
          <p className="font-semibold mb-1">Session Security:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>New login revokes previous sessions (single-session policy)</li>
            <li>Disabled/suspended students lose access immediately</li>
            <li>Sessions expire after 24 hours</li>
            <li>All activity tracked for audit</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}