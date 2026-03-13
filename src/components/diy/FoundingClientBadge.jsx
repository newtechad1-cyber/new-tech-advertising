import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

export function FoundingClientBadge({ size = 'default', variant = 'default' }) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    default: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const variantClasses = {
    default: 'bg-amber-600/20 text-amber-400 border border-amber-600/30',
    subtle: 'bg-amber-900/10 text-amber-300 border-0',
    solid: 'bg-amber-600 text-white border-0'
  };

  return (
    <Badge className={`inline-flex items-center font-semibold ${sizeClasses[size]} ${variantClasses[variant]}`}>
      <Zap className="w-4 h-4" />
      Early Access
    </Badge>
  );
}

export function EarlyAccessPromo() {
  return (
    <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700/40 rounded-lg p-4 space-y-2">
      <div className="flex items-center gap-2">
        <FoundingClientBadge size="sm" />
        <span className="text-sm font-semibold text-amber-200">Limited-Time Launch Price</span>
      </div>
      <p className="text-xs text-amber-300 leading-relaxed">
        Join as a founding client and lock in launch pricing for 12 months. Limited spots remaining.
      </p>
    </div>
  );
}

export default FoundingClientBadge;