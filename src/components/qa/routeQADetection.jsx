export function detectRouteIssues(routes) {
  const issues = [];

  routes.forEach((r) => {
    if (!r.path) {
      issues.push({
        type: "missing_path",
        message: `Route ${r.name || "unknown"} has no path`,
      });
    }

    if (r.path && !r.path.startsWith("/")) {
      issues.push({
        type: "invalid_path",
        message: `Route ${r.path} should start with /`,
      });
    }

    if (!r.component) {
      issues.push({
        type: "missing_component",
        message: `Route ${r.path} has no component`,
      });
    }
  });

  return issues;
}

export const ROUTE_INVENTORY = [];

export function groupRoutesByFamily() {
  return {
    public: [],
    main_admin: [],
    school_admin: [],
    client_portal: [],
  };
}

export function calculateQAMetrics(checks) {
  return {
    total: checks.length,
    tested: checks.filter(c => c.tested).length,
    passed: checks.filter(c => c.status === 'pass').length,
    broken: checks.filter(c => c.status === 'broken').length,
    coverage: checks.length > 0 ? Math.round((checks.filter(c => c.tested).length / checks.length) * 100) : 0,
  };
}