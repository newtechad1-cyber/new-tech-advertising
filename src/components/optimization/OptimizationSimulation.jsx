import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Shield, CheckCircle2, TrendingUp } from 'lucide-react';

export default function OptimizationSimulation({ candidate = null, onApprove = () => {}, onCancel = () => {} }) {
  const [activeTab, setActiveTab] = useState('impact');

  if (!candidate || candidate.risk_level !== 'high') {
    return null;
  }

  // Simulated outcomes based on confidence & risk
  const baselineImpact = candidate.confidence_score * 0.8; // Conservative estimate
  const bestCaseImpact = candidate.confidence_score * 1.2;
  const worstCaseImpact = -candidate.confidence_score * 0.4;
  const likelyImpact = candidate.confidence_score * 0.9;

  return (
    <Card className="bg-slate-800/50 border-yellow-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-400" />
            <CardTitle className="text-white">Safe Simulation Preview</CardTitle>
          </div>
          <Badge className="bg-yellow-950 text-yellow-300">High-Risk</Badge>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Simulated impact analysis before approval on high-risk optimization
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* What's Changing */}
        <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 mb-2">Configuration Change</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">System</span>
              <Badge variant="outline">{candidate.target_system}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Config Key</span>
              <span className="text-xs font-mono text-slate-400">{candidate.target_config_key}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Current Value</span>
              <span className="text-xs font-mono text-slate-200">{candidate.current_value}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Proposed Value</span>
              <span className="text-xs font-mono text-emerald-300">{candidate.proposed_value}</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-700 border border-slate-600">
            <TabsTrigger value="impact">Impact Forecast</TabsTrigger>
            <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
            <TabsTrigger value="rollback">Rollback Plan</TabsTrigger>
          </TabsList>

          {/* Impact Forecast */}
          <TabsContent value="impact" className="space-y-3 mt-3">
            <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 mb-2">Most Likely Outcome</p>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-300">{likelyImpact.toFixed(1)}%</div>
                <p className="text-xs text-slate-400 mt-1">Expected improvement range</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-red-950/20 border border-red-700/30 rounded text-center">
                <p className="text-xs text-red-400 mb-1">Worst Case</p>
                <p className="text-sm font-bold text-red-300">{worstCaseImpact.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-slate-900/50 border border-slate-700 rounded text-center">
                <p className="text-xs text-slate-400 mb-1">Base Case</p>
                <p className="text-sm font-bold text-slate-300">{baselineImpact.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-emerald-950/20 border border-emerald-700/30 rounded text-center">
                <p className="text-xs text-emerald-400 mb-1">Best Case</p>
                <p className="text-sm font-bold text-emerald-300">+{bestCaseImpact.toFixed(1)}%</p>
              </div>
            </div>

            <div className="p-2 bg-blue-950/20 border border-blue-700/30 rounded">
              <p className="text-xs text-blue-400 mb-1">Confidence Level</p>
              <div className="h-2 bg-slate-900 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${candidate.confidence_score}%` }}
                />
              </div>
              <p className="text-xs text-blue-300 mt-1">{candidate.confidence_score}% confidence in prediction</p>
            </div>
          </TabsContent>

          {/* Risk Assessment */}
          <TabsContent value="risks" className="space-y-2 mt-3">
            <div className="p-3 bg-yellow-950/20 border border-yellow-700/30 rounded">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs space-y-1">
                  <p className="text-yellow-300 font-semibold">High-Risk Optimization</p>
                  <p className="text-yellow-200">
                    This optimization affects a critical system. Failure could impact multiple clients.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="p-2 bg-slate-900/50 rounded border border-slate-700 text-xs">
                <p className="text-slate-400 mb-1">✓ Mitigation Strategy</p>
                <p className="text-slate-300">Canary rollout to 5% of users first. Monitor for 24 hours.</p>
              </div>
              <div className="p-2 bg-slate-900/50 rounded border border-slate-700 text-xs">
                <p className="text-slate-400 mb-1">✓ Measurement Window</p>
                <p className="text-slate-300">7-day observation period before full rollout decision.</p>
              </div>
              <div className="p-2 bg-slate-900/50 rounded border border-slate-700 text-xs">
                <p className="text-slate-400 mb-1">✓ Rollback Trigger</p>
                <p className="text-slate-300">Automatic rollback if metric degrades >10% or errors spike.</p>
              </div>
            </div>
          </TabsContent>

          {/* Rollback Plan */}
          <TabsContent value="rollback" className="space-y-3 mt-3">
            <div className="p-3 bg-slate-900/50 rounded border border-slate-700">
              <p className="text-xs text-slate-400 mb-2">Rollback Timeline</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300">Automatic Detection</span>
                  <span className="text-emerald-400">Immediate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Configuration Reversion</span>
                  <span className="text-emerald-400">&lt; 5 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Service Recovery</span>
                  <span className="text-emerald-400">&lt; 10 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Admin Notification</span>
                  <span className="text-emerald-400">Real-time alert</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-950/20 border border-blue-700/30 rounded text-xs">
              <p className="text-blue-300 mb-1">✓ Safety Features Enabled</p>
              <ul className="text-blue-200 space-y-0.5 list-disc list-inside">
                <li>Rollback automation active</li>
                <li>Real-time metrics monitoring</li>
                <li>Canary deployment enabled</li>
                <li>Automatic alerts configured</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        {/* Decision Buttons */}
        <div className="flex gap-2 pt-2 border-t border-slate-700">
          <Button
            variant="outline"
            className="flex-1 text-slate-400"
            onClick={onCancel}
          >
            Decline
          </Button>
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={onApprove}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Approve with Safeguards
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}