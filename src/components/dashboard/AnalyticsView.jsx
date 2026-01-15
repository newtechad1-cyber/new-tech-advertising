import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Users, MousePointerClick, PhoneCall } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ActionCards from './ActionCards';
import SubmitContentWizard from './SubmitContentWizard';

const trafficData = [
  { name: 'Mon', visitors: 420 },
  { name: 'Tue', visitors: 560 },
  { name: 'Wed', visitors: 580 },
  { name: 'Thu', visitors: 690 },
  { name: 'Fri', visitors: 890 },
  { name: 'Sat', visitors: 450 },
  { name: 'Sun', visitors: 380 },
];

const leadData = [
  { name: 'Week 1', leads: 12 },
  { name: 'Week 2', leads: 18 },
  { name: 'Week 3', leads: 25 },
  { name: 'Week 4', leads: 32 },
];

export default function AnalyticsView() {
  const [user, setUser] = useState(null);
  const [subscriptionPackage, setSubscriptionPackage] = useState('297'); // Default to Done-For-You
  const [showSubmitWizard, setShowSubmitWizard] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      
      // TODO: Load actual subscription package from user profile or subscription entity
      // For now, defaulting to '297' - replace with actual logic
      setSubscriptionPackage('297');
    } catch (error) {
      console.error('[AnalyticsView] Error loading user:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Submit Content Wizard Modal */}
      {showSubmitWizard && (
        <SubmitContentWizard 
          onClose={() => setShowSubmitWizard(false)}
          onSubmitSuccess={() => {
            setShowSubmitWizard(false);
          }}
        />
      )}

      {/* Action Cards - Displayed prominently at top */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <ActionCards 
          userRole={user?.role} 
          subscriptionPackage={subscriptionPackage}
          onSubmitContent={() => setShowSubmitWizard(true)}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 mt-8">Performance Overview</h2>
        <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,970</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Through Rate</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.3%</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +1.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">143</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Website Traffic</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="visitors" stroke="#2563eb" fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Lead Generation Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="leads" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}