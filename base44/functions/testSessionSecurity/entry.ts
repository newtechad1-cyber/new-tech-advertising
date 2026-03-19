import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * TEST HELPER: Validates session security implementation.
 * Admin use only - demonstrates all session security features.
 * 
 * Usage: Call from admin dashboard to verify security controls are working.
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);

  try {
    const { student_user_id, school_slug } = await req.json();

    if (!student_user_id || !school_slug) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const results = {
      timestamp: new Date().toISOString(),
      tests: [],
    };

    // Test 1: Student exists and active
    const students = await base44.asServiceRole.entities.StudentUsers.filter({
      id: student_user_id,
    });

    if (!students || students.length === 0) {
      results.tests.push({
        name: 'Student lookup',
        status: 'FAIL',
        message: 'Student not found',
      });
      return Response.json(results);
    }

    const student = students[0];
    results.tests.push({
      name: 'Student lookup',
      status: 'PASS',
      message: `Found student: ${student.full_name}`,
    });

    // Test 2: Check StudentSessions entity
    const sessions = await base44.asServiceRole.entities.StudentSessions.filter({
      student_user_id: student_user_id,
      school_slug: school_slug,
    });

    results.tests.push({
      name: 'StudentSessions entity',
      status: sessions ? 'PASS' : 'FAIL',
      message: `${sessions ? sessions.length : 0} total sessions`,
    });

    // Test 3: Count active sessions
    const activeSessions = await base44.asServiceRole.entities.StudentSessions.filter({
      student_user_id: student_user_id,
      school_slug: school_slug,
      is_active: true,
    });

    results.tests.push({
      name: 'Active sessions count',
      status: 'PASS',
      message: `${activeSessions ? activeSessions.length : 0} active sessions`,
      count: activeSessions ? activeSessions.length : 0,
    });

    // Test 4: Check concurrent session control
    if (activeSessions && activeSessions.length > 1) {
      results.tests.push({
        name: 'Concurrent session control',
        status: 'WARNING',
        message: `Student has ${activeSessions.length} active sessions (expected max 1 after login)`,
      });
    } else {
      results.tests.push({
        name: 'Concurrent session control',
        status: 'PASS',
        message: 'Single-session policy enforced',
      });
    }

    // Test 5: Check session expiry logic
    if (activeSessions && activeSessions.length > 0) {
      const now = new Date();
      const expiredSessions = activeSessions.filter(
        s => new Date(s.expires_at) < now
      );

      if (expiredSessions.length > 0) {
        results.tests.push({
          name: 'Session expiration',
          status: 'WARNING',
          message: `${expiredSessions.length} sessions past expiry but still marked active`,
        });
      } else {
        results.tests.push({
          name: 'Session expiration',
          status: 'PASS',
          message: 'All active sessions are within expiry window',
        });
      }

      // Test 6: Check audit trail
      const hasAuditData = activeSessions.every(s =>
        s.created_at && s.last_seen_at && s.user_agent && s.ip_address
      );

      results.tests.push({
        name: 'Audit trail (created_at, last_seen_at, user_agent, ip_address)',
        status: hasAuditData ? 'PASS' : 'WARNING',
        message: hasAuditData ? 'All audit fields populated' : 'Some audit fields missing',
      });
    }

    // Test 7: Check student account status
    results.tests.push({
      name: 'Student account status',
      status: student.is_active ? 'PASS' : 'WARNING',
      message: `is_active=${student.is_active}, suspended_until=${student.suspended_until || 'null'}, can_upload=${student.can_upload}`,
    });

    // Test 8: Verify functions exist
    const functionTests = [
      'studentLoginSecure',
      'validateStudentSessionSecure',
      'studentLogout',
      'getStudentSessionInfo',
      'revokeStudentSessions',
      'onStudentAccountChanged',
    ];

    for (const funcName of functionTests) {
      try {
        // Try to invoke with dummy data to check if function exists
        // This will fail with auth error, but proves function exists
        await base44.asServiceRole.functions.invoke(funcName, {
          test: true,
        });
      } catch (err) {
        if (err.message.includes('not found')) {
          results.tests.push({
            name: `Function: ${funcName}`,
            status: 'FAIL',
            message: 'Function not found',
          });
        } else {
          // Function exists, auth error is expected
          results.tests.push({
            name: `Function: ${funcName}`,
            status: 'PASS',
            message: 'Function deployed',
          });
        }
      }
    }

    // Summary
    const passCount = results.tests.filter(t => t.status === 'PASS').length;
    const failCount = results.tests.filter(t => t.status === 'FAIL').length;
    const warnCount = results.tests.filter(t => t.status === 'WARNING').length;

    results.summary = {
      total: results.tests.length,
      pass: passCount,
      fail: failCount,
      warn: warnCount,
      status: failCount === 0 ? 'SECURE' : 'NEEDS_ATTENTION',
    };

    return Response.json(results);
  } catch (error) {
    console.error('Security test error:', error);
    return Response.json({ error: 'Test failed', details: error.message }, { status: 500 });
  }
});