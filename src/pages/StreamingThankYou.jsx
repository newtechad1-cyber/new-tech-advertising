import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function StreamingThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center py-16 px-6">
      <Card className="max-w-2xl w-full p-12 bg-white shadow-xl text-center">
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Thank You for Your Interest!
        </h1>
        
        <p className="text-xl text-slate-600 mb-8">
          We have received your information and will review it carefully.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">What Happens Next?</h2>
          <ul className="text-left space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>We will review your business information and goals</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>A member of our team will contact you within 1-2 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>We will discuss whether streaming TV makes sense for your business</span>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={createPageUrl("Home")}>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
              Return to Home
            </Button>
          </Link>
          
          <Link to={createPageUrl("StreamingTV")}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto">
              Learn More About Streaming TV
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}