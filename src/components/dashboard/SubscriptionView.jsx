import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CreditCard, Calendar } from 'lucide-react';

export default function SubscriptionView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-4 py-1">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">AI Marketing Suite Pro</p>
                <p className="text-sm text-slate-500">$297.00 / month</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Next billing date</p>
              <p className="text-sm text-slate-500">February 24, 2025</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Included in your plan:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Professional Website Design & Hosting",
                "Local SEO Optimization",
                "AI Content Creation (Blog & Social)",
                "Video Production (2/month)",
                "Review Management System",
                "Monthly Strategy Calls"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline">Cancel Subscription</Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Upgrade Plan</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Update your billing information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-14 bg-slate-100 rounded flex items-center justify-center border">
                <CreditCard className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-slate-500">Expires 12/2028</p>
              </div>
            </div>
            <Button variant="ghost" className="text-blue-600">Edit</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: "Jan 24, 2025", amount: "$297.00", status: "Paid" },
              { date: "Dec 24, 2024", amount: "$297.00", status: "Paid" },
              { date: "Nov 24, 2024", amount: "$297.00", status: "Paid" },
            ].map((invoice, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-sm">{invoice.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{invoice.amount}</span>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">{invoice.status}</Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><ArrowDownRight className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}