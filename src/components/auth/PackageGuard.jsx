import React from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * PackageGuard - Block actions not available in current package
 * @param {string} requiredPackage - 'collaborative' or 'done_for_you'
 * @param {string} userPackage - Current user's package
 * @param {string} feature - Name of the feature being blocked
 * @param {function} onUpgrade - Optional callback for upgrade action
 */
export default function PackageGuard({ 
  requiredPackage, 
  userPackage, 
  feature,
  onUpgrade,
  children 
}) {
  const packageHierarchy = {
    diy: 0,
    collaborative: 1,
    done_for_you: 2
  };

  const hasAccess = packageHierarchy[userPackage] >= packageHierarchy[requiredPackage];

  if (hasAccess) {
    return children;
  }

  const upgradeMessages = {
    collaborative: {
      title: 'Available with $197 Collaborative or Higher',
      message: 'This feature requires a paid plan. Upgrade to unlock team scheduling and support.'
    },
    done_for_you: {
      title: 'Available with $297 Done-For-You',
      message: 'This premium feature is included in our Done-For-You package with full content creation and priority support.'
    }
  };

  const upgradeInfo = upgradeMessages[requiredPackage] || upgradeMessages.collaborative;

  return (
    <div className="flex items-center justify-center min-h-[300px] p-4">
      <Card className="max-w-md w-full border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-3 text-purple-600">
            <Sparkles className="w-6 h-6" />
            <CardTitle>{upgradeInfo.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">
            {upgradeInfo.message}
          </p>
          {feature && (
            <p className="text-sm text-slate-500">
              <strong>Feature:</strong> {feature}
            </p>
          )}
          {onUpgrade && (
            <Button onClick={onUpgrade} className="w-full bg-purple-600 hover:bg-purple-700">
              Upgrade Package
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}