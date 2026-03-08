import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp } from 'lucide-react';

export default function AccountSpotlights({ data }) {
  if (!data || !data.spotlights) return null;

  const { spotlights } = data;

  const spotlightCards = [
    {
      key: 'strongest_growth',
      title: '📈 Strongest Growth',
      icon: TrendingUp,
      color: 'border-green-200 bg-green-50'
    },
    {
      key: 'biggest_rescue_risk',
      title: '🔴 Biggest Rescue Risk',
      icon: AlertTriangle,
      color: 'border-red-200 bg-red-50'
    },
    {
      key: 'biggest_upsell',
      title: '💰 Biggest Upsell',
      icon: Star,
      color: 'border-purple-200 bg-purple-50'
    },
    {
      key: 'most_operationally_blocked',
      title: '⚙️ Most Blocked',
      icon: AlertCircle,
      color: 'border-orange-200 bg-orange-50'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Account Spotlights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {spotlightCards.map(spot => {
            const spotlight = spotlights[spot.key];
            
            if (!spotlight) {
              return (
                <div key={spot.key} className={`border rounded-lg p-3 ${spot.color} opacity-50`}>
                  <p className="text-xs font-semibold text-gray-600">{spot.title}</p>
                  <p className="text-xs text-gray-500 mt-1">No data available</p>
                </div>
              );
            }

            return (
              <div key={spot.key} className={`border rounded-lg p-3 ${spot.color}`}>
                <p className="text-xs font-semibold text-gray-900 mb-2">{spot.title}</p>
                <p className="text-sm font-bold text-gray-900">{spotlight.company_name}</p>
                <p className="text-xs text-gray-600 mt-1">{spotlight.reason}</p>
                <p className="text-xs font-semibold text-gray-700 mt-2">{spotlight.metric}</p>
                <Button variant="ghost" size="sm" className="text-xs w-full mt-2">
                  View Account
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

import { AlertTriangle, AlertCircle } from 'lucide-react';