import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, Target, AlertCircle } from 'lucide-react';

export default function ClientGrowthKPIStrip({ snapshot, className = '' }) {
  if (!snapshot) return null;

  const getGrowthColor = (score) => {
    if (score >= 75) return 'bg-green-50 border-green-200';
    if (score >= 50) return 'bg-blue-50 border-blue-200';
    if (score >= 25) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreLabel = (score) => {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Good';
    if (score >= 25) return 'Fair';
    return 'Needs Boost';
  };

  const getMomentumTrend = (score) => {
    if (score > 60) return { icon: '📈', label: 'Strong Momentum', color: 'text-green-600' };
    if (score > 40) return { icon: '➡️', label: 'Steady Progress', color: 'text-blue-600' };
    if (score > 20) return { icon: '📉', label: 'Declining', color: 'text-amber-600' };
    return { icon: '⚠️', label: 'At Risk', color: 'text-red-600' };
  };

  const momentum = getMomentumTrend(snapshot.momentumScore);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
      {/* Growth Score */}
      <Card className={`p-4 border-2 ${getGrowthColor(snapshot.growthScore)}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-600">Growth Score</p>
            <p className="text-3xl font-bold mt-1">{snapshot.growthScore}</p>
            <p className="text-xs text-slate-600 mt-1">{getScoreLabel(snapshot.growthScore)}</p>
          </div>
          <TrendingUp className="w-6 h-6 text-slate-400" />
        </div>
      </Card>

      {/* Momentum */}
      <Card className="p-4 border-2 border-purple-200 bg-purple-50">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-600">Momentum</p>
            <p className="text-3xl font-bold mt-1">{snapshot.momentumScore}</p>
            <p className={`text-xs font-medium mt-1 ${momentum.color}`}>
              {momentum.icon} {momentum.label}
            </p>
          </div>
          <Zap className="w-6 h-6 text-purple-400" />
        </div>
      </Card>

      {/* Revenue Impact */}
      <Card className="p-4 border-2 border-green-200 bg-green-50">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-600">Revenue Attributed</p>
            <p className="text-2xl font-bold mt-1">
              ${(snapshot.revenueAttributed / 100).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </p>
            <p className="text-xs text-slate-600 mt-1">This period</p>
          </div>
          <Target className="w-6 h-6 text-green-400" />
        </div>
      </Card>

      {/* ROI */}
      <Card className={`p-4 border-2 ${snapshot.roiEstimate > 0 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-600">Estimated ROI</p>
            <p className="text-2xl font-bold mt-1">{snapshot.roiEstimate}%</p>
            <Badge variant="outline" className="text-xs mt-1">
              {snapshot.roiConfidence} confidence
            </Badge>
          </div>
          {snapshot.roiEstimate > 0 ? (
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          ) : (
            <AlertCircle className="w-6 h-6 text-slate-400" />
          )}
        </div>
      </Card>
    </div>
  );
}