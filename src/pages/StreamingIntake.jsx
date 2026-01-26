import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TestModeBanner from "../components/TestModeBanner";

export default function StreamingIntake() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    business_name: "",
    email: "",
    phone: "",
    website_url: "",
    city: "",
    state: "",
    primary_goal: "",
    monthly_budget_range: "",
    notes: ""
  });

  useEffect(() => {
    checkTestMode();
  }, []);

  const checkTestMode = async () => {
    try {
      const settings = await base44.entities.AppSettings.list();
      if (settings.length > 0 && settings[0].test_mode_enabled) {
        setIsTestMode(true);
      }
    } catch (error) {
      console.log('Error checking test mode:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const leadData = {
        name: formData.full_name,
        business_name: formData.business_name,
        email: formData.email,
        phone: formData.phone,
        message: formData.notes || "",
        status: "new"
      };

      const lead = await base44.entities.Lead.create(leadData);

      await base44.entities.LeadActivity.create({
        lead_id: lead.id,
        activity_type: "form_submission",
        page_url: window.location.href,
        details: "Streaming TV intake submitted",
        metadata: {
          service_type: "streaming_tv",
          lead_source: "streaming_tv_page",
          website_url: formData.website_url,
          city: formData.city,
          state: formData.state,
          primary_goal: formData.primary_goal,
          monthly_budget_range: formData.monthly_budget_range,
          test_mode: isTestMode
        }
      });

      navigate(createPageUrl("StreamingThankYou"));
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your information. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <TestModeBanner />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Get Started with Streaming TV Advertising
          </h1>
          <p className="text-xl text-slate-600">
            Tell us about your business and goals. We will review your information and get back to you within 1-2 business days.
          </p>
        </div>

        <Card className="p-8 bg-white shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <Input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Business Name <span className="text-red-600">*</span>
                </label>
                <Input
                  type="text"
                  name="business_name"
                  required
                  value={formData.business_name}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Business Information</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Website URL
                </label>
                <Input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State
                  </label>
                  <Input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="IL"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Campaign Goals */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Campaign Goals</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Primary Goal
                </label>
                <select
                  name="primary_goal"
                  value={formData.primary_goal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                >
                  <option value="">Select a goal</option>
                  <option value="awareness">Brand Awareness</option>
                  <option value="local_visibility">Local Visibility</option>
                  <option value="credibility">Credibility & Trust</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Monthly Budget Range
                </label>
                <select
                  name="monthly_budget_range"
                  value={formData.monthly_budget_range}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                >
                  <option value="">Select a budget range</option>
                  <option value="500-1000">$500 - $1,000 per month</option>
                  <option value="1000-2000">$1,000 - $2,000 per month</option>
                  <option value="2000+">$2,000+ per month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Notes
                </label>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us more about your business, target audience, or any specific questions you have..."
                  className="w-full"
                />
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 h-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}