import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2 text-center">{title}</h3>
        <p className="text-slate-500 text-center mb-6 max-w-sm">{description}</p>
        {onAction && actionLabel && (
          <Button onClick={onAction} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}