import React from 'react';
import { useGlobalContext } from './useGlobalContext.js';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

/**
 * ContextGuard Component
 * 
 * Restricts access to pages based on GlobalAppContext
 * 
 * Usage:
 * <ContextGuard requiredContext="client">
 *   <ClientDashboard />
 * </ContextGuard>
 * 
 * or
 * 
 * <ContextGuard requiredContext={["agency", "client"]}>
 *   <PublishingPage />
 * </ContextGuard>
 */
export default function ContextGuard({ 
  children, 
  requiredContext,
  requiredVertical,
  fallbackRoute
}) {
  const { context, loading, isContextType } = useGlobalContext();

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-slate-500">Loading context...</div>
      </div>
    );
  }

  if (!context) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p>Failed to initialize context. Please refresh the page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check context type
  if (requiredContext) {
    const contextArray = Array.isArray(requiredContext) ? requiredContext : [requiredContext];
    const contextMatch = contextArray.some(ctx => isContextType(ctx));

    if (!contextMatch) {
      return (
        <UnauthorizedContextView 
          current={context.active_context_type}
          required={requiredContext}
          fallbackRoute={fallbackRoute}
        />
      );
    }
  }

  // Check vertical type
  if (requiredVertical && context.active_context_type === 'vertical_system') {
    if (context.active_vertical_type !== requiredVertical) {
      return (
        <UnauthorizedContextView 
          current={context.active_vertical_type}
          required={requiredVertical}
          message="This page is only available for the specified vertical system."
          fallbackRoute={fallbackRoute}
        />
      );
    }
  }

  return children;
}

/**
 * Display unauthorized context message
 */
function UnauthorizedContextView({ current, required, message, fallbackRoute }) {
  const getDashboardUrl = () => {
    // Redirect to appropriate dashboard based on required context
    if (Array.isArray(required)) {
      // Default to admin dashboard if multiple contexts accepted
      return createPageUrl('AdminDashboard');
    }

    switch (required) {
      case 'client':
        return createPageUrl('ClientDashboard');
      case 'school':
        return createPageUrl('AdminSchoolDashboard');
      case 'agency':
        return createPageUrl('AdminDashboard');
      case 'vertical_system':
        return createPageUrl('AdminDashboard');
      default:
        return createPageUrl('Home');
    }
  };

  const redirectUrl = fallbackRoute || getDashboardUrl();

  return (
    <div className="p-6 min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="max-w-md border-red-200 bg-red-50">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-red-900">Wrong Context</h2>
              <p className="text-sm text-red-800 mt-1">
                {message || `This page requires ${formatContextType(required)} context, but you're in ${formatContextType(current)} mode.`}
              </p>
            </div>
          </div>

          <div className="bg-red-100 rounded px-3 py-2 text-xs text-red-700 font-mono">
            Current: <span className="font-bold">{current?.toUpperCase()}</span>
            <br />
            Required: <span className="font-bold">{formatContextType(required)}</span>
          </div>

          <a
            href={redirectUrl}
            className="block mt-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition text-center"
          >
            Return to Dashboard
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Helper: Format context type for display
 */
function formatContextType(type) {
  if (Array.isArray(type)) {
    return type.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' or ');
  }
  return type?.charAt(0).toUpperCase() + type?.slice(1) || 'Unknown';
}