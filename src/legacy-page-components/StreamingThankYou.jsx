import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TestModeBanner from "../components/TestModeBanner";

export default function StreamingThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <TestModeBanner />
      <div className="flex items-center justify-center py-16 px-6">
      <Card className="max-w-2xl w-full p-12 bg-white shadow-xl text-center">
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Thanks — we received your request
        </h1>
        
        <p className="text-xl text-slate-600 mb-8">
          We will review your information and confirm whether streaming TV is a good fit for your business.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">What happens next:</h2>
          <ul className="text-left space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>We review your goals and budget</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>If it makes sense, we prepare a simple proposal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>If not, we will tell you honestly</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-slate-50 rounded-lg p-6 mb-8">
          <p className="text-slate-700">
            <strong>Questions?</strong> Reply to your confirmation email or call{" "}
            <a href="tel:641-420-8816" className="text-blue-600 hover:text-blue-700 font-semibold">
              641-420-8816
            </a>
            .
          </p>
        </div>
        
        <Link to={createPageUrl("Home")}>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto">
            Return to Home
          </Button>
          </Link>
          </Card>
          </div>
          </div>
  );
}