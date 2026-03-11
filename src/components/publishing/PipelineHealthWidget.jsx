import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, TrendingUp, Clock, Zap } from 'lucide-react';

export default function PipelineHealthWidget({ metrics = {} }) {
  const {
    avgTimeToPublish = 0,
    approvalBottleneck = 0,
    connectionIssues = 0,
    failedJobs = 0,
  } = metrics;

  const getHealthScore = () => {
    let score = 100;
    if (approvalBottleneck > 0) score -= approvalBottleneck * 5;
    if (connectionIssues > 0) score -= connectionIssues * 10;
    if (failedJobs > 0) score -= failedJobs * 8;
    return Math.max(0, score);
  };

  const health = getHealthScore();
  const getHealthColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-500', label: 'Excellent' };
    if (score >= 60) return { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500', label: 'Good' };
    if (score >= 40) return { bg: 'bg-orange-50', text: 'text-orange-700', bar: 'bg-orange-500', label: 'Fair' };
    return { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500', label: 'Poor' };
  };

  const healthColor = getHealthColor(health);

  return (
    <Card className={`${healthColor.bg} border`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Pipeline Health
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Health Score */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-semibold ${healthColor.text}`}>{health}% Health</span>
            <span className={`text-xs ${healthColor.text}`}>{healthColor.label}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`${healthColor.bar} h-2 rounded-full transition-all`}
              style={{ width: `${health}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="space-y-2">
          {/* Approval Bottleneck */}
          <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-slate-700">Approval Queue</span>
            </div>
            <span className={`text-sm font-bold ${approvalBottleneck > 5 ? 'text-amber-600' : 'text-slate-700'}`}>
              {approvalBottleneck} pending
            </span>
          </div>

          {/* Connection Issues */}
          <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-slate-700">Connection Issues</span>
            </div>
            <span className={`text-sm font-bold ${connectionIssues > 0 ? 'text-red-600' : 'text-slate-700'}`}>
              {connectionIssues} channels
            </span>
          </div>

          {/* Failed Jobs */}
          <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-medium text-slate-700">Failed Jobs</span>
            </div>
            <span className={`text-sm font-bold ${failedJobs > 0 ? 'text-orange-600' : 'text-slate-700'}`}>
              {failedJobs} retries
            </span>
          </div>

          {/* Avg Time */}
          <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-medium text-slate-700">Avg Time to Publish</span>
            </div>
            <span className="text-sm font-bold text-slate-700">
              {avgTimeToPublish} {avgTimeToPublish === 1 ? 'hour' : 'hours'}
            </span>
          </div>
        </div>

        {/* Recommendation */}
        {health < 60 && (
          <div className="pt-2 border-t border-slate-300/50">
            <p className="text-xs text-slate-700">
              <strong>Action needed:</strong> {connectionIssues > 0 ? 'Fix channel connections' : 'Review approval queue'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}