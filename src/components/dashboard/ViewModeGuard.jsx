import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ViewModeGuard({ 
  requiredMode, 
  currentMode, 
  message,
  actionLabel,
  onAction 
}) {
  if (currentMode === requiredMode) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3 text-amber-600">
            <AlertCircle className="w-6 h-6" />
            <CardTitle>Access Restricted</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">
            {message || `This feature is only available in ${requiredMode} mode.`}
          </p>
          {onAction && actionLabel && (
            <Button onClick={onAction} className="w-full">
              {actionLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}