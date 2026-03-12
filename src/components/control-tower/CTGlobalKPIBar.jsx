import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const TrendBadge = ({ value, positive = true }) => (
  <div className={`flex items-center gap-1 text-[10px] font-bold ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
    {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
    {Math.abs(value)}%
  </div>
);

const KPIValue = ({ label, value, trend, trendPositive = true, currency = false }) => (
  <div className="text-center">
    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">{label}</p>
    <p className="text-3xl font-black text-white mb-1">
      {currency && '$'}{typeof value === 'number' ? value.toLocaleString() : value}
    </p>
    {trend !== undefined && <TrendBadge value={trend} positive={trendPositive} />}
  </div>
);

export default function CTGlobalKPIBar({ data }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <KPIValue label="Total MRR" value={data.totalMRR} trend={data.mrrTrend} currency />
      <KPIValue label="New MRR" value={data.newMRR} trend={data.newMRRTrend} currency trendPositive />
      <KPIValue label="Active Clients" value={data.activeClients} trend={data.clientsTrend} trendPositive />
      <KPIValue label="Expansion %" value={`${data.expansionPercent}%`} trend={data.expansionTrend} trendPositive />
      <KPIValue label="Health Avg" value={`${data.healthAvg}/100`} trend={data.healthTrend} trendPositive />
      <KPIValue label="Capacity" value={`${data.capacityUtilization}%`} trend={data.capacityTrend} trendPositive={false} />
    </div>
  );
}