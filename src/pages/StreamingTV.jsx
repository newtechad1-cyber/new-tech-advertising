import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight, Tv, Target, DollarSign, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function StreamingTV() {
  const navigate = useNavigate();

  const goToIntake = () => {
    navigate(createPageUrl("StreamingIntake"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDQwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xNCAzNmMtMi4yMSAwLTQtMS43OS00LTRzMS43OS00IDQtNCA0IDEuNzkgNCA0LTEuNzkgNC00IDR6bTQwIDBjLTIuMjEgMC00LTEuNzktNC00czEuNzktNCA0LTQgNCAxLjc5IDQgNC0xLjc5IDQtNCA0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Streaming TV Advertising<br />
              <span className="text-blue-400">for Local Businesses</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Show up on streaming TV, premium video, and connected devices — without traditional TV costs or contracts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={goToIntake}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto"
              >
                Request a Streaming TV Review
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={goToIntake}
                className="border-2 border-slate-300 text-slate-300 hover:bg-slate-800 hover:text-white text-lg px-8 py-6 h-auto"
              >
                See If Streaming TV Is Right for You
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What Streaming TV Is Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8 text-center">
            What Is Streaming TV Advertising?
          </h2>
          
          <div className="prose prose-lg lg:prose-xl max-w-none text-slate-700 space-y-6">
            <p className="text-xl leading-relaxed">
              Streaming TV advertising places short commercials inside content people already watch — such as streaming TV apps and premium video platforms.
            </p>
            
            <div className="bg-slate-50 rounded-lg p-8 my-8">
              <p className="text-xl font-semibold text-slate-900 mb-4">Unlike traditional TV, it allows:</p>
              <ul className="space-y-3">
                {[
                  "Local targeting",
                  "Flexible budgets",
                  "Better visibility across devices"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <span className="text-lg text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="text-center bg-blue-50 rounded-lg p-8 border-2 border-blue-200">
              <p className="text-xl font-semibold text-slate-900">
                This is not viral marketing or instant lead generation.
              </p>
              <p className="text-xl font-semibold text-blue-600 mt-2">
                It is about recognition and recall over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Works Best For Section */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-12 text-center">
            Who Streaming TV Works Best For
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {[
              { icon: Target, text: "Local service businesses" },
              { icon: Tv, text: "Professional offices" },
              { icon: Target, text: "Competitive local markets" },
              { icon: Check, text: "Businesses that value credibility and brand presence" }
            ].map((item, idx) => (
              <Card key={idx} className="p-6 bg-white border-2 border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 rounded-full p-3 flex-shrink-0">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-lg text-slate-700 font-semibold pt-2">{item.text}</p>
                </div>
              </Card>
            ))}
          </div>
          
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300">
            <p className="text-2xl font-bold text-slate-900 text-center">
              Consistency matters more than budget size.
            </p>
          </Card>
        </div>
      </section>

      {/* Budget Reality Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8 text-center">
            What Budget Makes Sense?
          </h2>
          
          <div className="prose prose-lg lg:prose-xl max-w-none text-slate-700 space-y-6 mb-12">
            <p className="text-xl leading-relaxed text-center">
              Streaming TV works when ads are shown consistently over time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="p-8 bg-slate-50 border-2 border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-slate-900">$500–$1,000/month</h3>
              </div>
              <p className="text-lg text-slate-700">Focused local visibility</p>
            </Card>
            
            <Card className="p-8 bg-slate-50 border-2 border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-slate-900">$1,000–$2,000/month</h3>
              </div>
              <p className="text-lg text-slate-700">Broader reach and stronger recall</p>
            </Card>
          </div>
          
          <Card className="p-8 bg-blue-600 text-white text-center">
            <p className="text-xl font-semibold">
              We will tell you honestly if your budget fits — or if another approach makes more sense.
            </p>
          </Card>
        </div>
      </section>

      {/* Commercial Creation Section */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8 text-center">
            What About the Commercial?
          </h2>
          
          <div className="prose prose-lg lg:prose-xl max-w-none text-slate-700 space-y-6 mb-12">
            <p className="text-xl leading-relaxed text-center">
              Every streaming campaign needs a short commercial.<br />
              We make this simple and affordable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 bg-white border-2 border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Video className="h-8 w-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-slate-900">AI-Assisted Commercial</h3>
              </div>
              <p className="text-slate-600 mb-4 italic">(most common)</p>
              <p className="text-lg text-slate-700 mb-4">
                15–30 seconds, stock visuals, captions, voiceover
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xl font-bold text-blue-600">One-time fee: $250–$500</p>
              </div>
            </Card>
            
            <Card className="p-8 bg-white border-2 border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Video className="h-8 w-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-slate-900">Hybrid Commercial</h3>
              </div>
              <p className="text-slate-600 mb-4 italic">&nbsp;</p>
              <p className="text-lg text-slate-700 mb-4">
                Uses your existing photos or video
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xl font-bold text-blue-600">One-time fee: $500–$1,000</p>
              </div>
            </Card>
          </div>
          
          <Card className="p-8 bg-slate-900 text-white text-center">
            <p className="text-xl font-semibold mb-2">
              This is not traditional TV production.
            </p>
            <p className="text-lg text-slate-300">
              No crews. No studios. No long-term commitment.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-center">
            How It Works
          </h2>
          
          <div className="space-y-8">
            {[
              "Strategy review",
              "Commercial creation",
              "Campaign setup",
              "Campaign goes live",
              "Ongoing monitoring and reporting"
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6 items-center">
                <div className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <p className="text-xl text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8">
            Not Sure If Streaming TV Makes Sense?
          </h2>
          
          <p className="text-xl text-slate-700 mb-12 leading-relaxed">
            Start with a short review.<br />
            We will help you decide — even if the answer is no.
          </p>
          
          <Button 
            size="lg" 
            onClick={goToIntake}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-10 py-7 h-auto font-bold"
          >
            Request a Streaming TV Review
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </section>


    </div>
  );
}