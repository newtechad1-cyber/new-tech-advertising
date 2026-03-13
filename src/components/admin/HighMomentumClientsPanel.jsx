import React from 'react';
import { TrendingUp, Star, Award, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HighMomentumClientsPanel({
  clients,
  onClientClick,
  onRequestTestimonial,
  onProposePremium,
  onFeatureStory,
}) {
  if (clients.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8 text-center">
        <TrendingUp className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-400">No high-momentum clients at this time</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-lg border border-green-500/20 overflow-hidden">
      <div className="p-6 border-b border-green-500/20">
        <h3 className="font-semibold text-white text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          High-Momentum Clients ({clients.length})
        </h3>
        <p className="text-sm text-green-300/70 mt-1">
          Strong growth + excellent engagement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-slate-800/50 rounded-lg border border-green-500/20 p-4 cursor-pointer hover:border-green-500/40 transition-colors"
            onClick={() => onClientClick?.(client)}
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="font-semibold text-white">{client.business_name}</div>
                <div className="text-xs text-slate-400 mt-1">{client.user_email}</div>
              </div>
              <Badge className="bg-green-600 text-white flex items-center gap-1">
                <Star className="w-3 h-3" />
                Star Client
              </Badge>
            </div>

            {/* Growth Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">Growth Score</span>
                <span className="text-sm font-bold text-green-300">
                  {client.retention?.growth_score || 0}/100
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${Math.min(client.retention?.growth_score || 0, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Key Achievements */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="bg-slate-900/50 p-2 rounded">
                <div className="text-slate-400">Campaigns</div>
                <div className="text-white font-semibold">
                  {client.retention?.campaigns_launched || 0}
                </div>
              </div>
              <div className="bg-slate-900/50 p-2 rounded">
                <div className="text-slate-400">Leads Tracked</div>
                <div className="text-white font-semibold">
                  {client.retention?.leads_logged || 0}
                </div>
              </div>
              <div className="bg-slate-900/50 p-2 rounded">
                <div className="text-slate-400">Videos Created</div>
                <div className="text-white font-semibold">
                  {client.retention?.videos_created || 0}
                </div>
              </div>
              <div className="bg-slate-900/50 p-2 rounded">
                <div className="text-slate-400">Streak</div>
                <div className="text-white font-semibold">
                  {client.retention?.streak_weeks || 0}w
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pointer-events-auto flex-wrap">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestTestimonial?.(client);
                }}
                size="sm"
                variant="outline"
                title="Request testimonial"
              >
                <Award className="w-3 h-3 mr-1" />
                Testimonial
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onFeatureStory?.(client);
                }}
                size="sm"
                variant="outline"
                title="Feature as success story"
              >
                <Share2 className="w-3 h-3 mr-1" />
                Feature
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onProposePremium?.(client);
                }}
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Propose Premium
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}