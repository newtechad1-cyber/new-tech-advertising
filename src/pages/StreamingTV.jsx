import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight, Tv, DollarSign, Video, MapPin, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import Chatbot from '../components/Chatbot';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function StreamingTV() {
  const navigate = useNavigate();

  const goToIntake = () => {
    navigate(createPageUrl("StreamingIntake"));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCTAClick={() => {}} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-purple-50 via-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              TV Ads Without a<br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Big Budget
              </span>
            </h1>
            
            <p className="text-xl text-slate-700 max-w-4xl mx-auto mb-6 leading-relaxed">
              TV advertising used to be for big companies with big budgets. Not anymore.
            </p>
            
            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Your ad can appear where people already watch — like streaming services and apps — without spending thousands. You control where it shows, how much you spend, and who sees it.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={goToIntake}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg"
              >
                See If TV Ads Make Sense for My Business
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What This Actually Is */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              What Are Streaming TV Ads?
            </h2>
            <p className="text-xl text-slate-700 leading-relaxed">
              Simple: your ad appears where people already watch shows and movies.
            </p>
          </div>
          
          <div className="space-y-6">
            <Card className="p-8 bg-slate-50 border border-slate-200">
              <p className="text-lg text-slate-700 leading-relaxed">
                Think of the short ads you see when watching TV through apps or streaming services. That's what this is.
              </p>
            </Card>
            
            <Card className="p-8 bg-slate-50 border border-slate-200">
              <p className="text-lg text-slate-700 leading-relaxed">
                Your ad can show up before or during shows. It's usually 15-30 seconds long. People watch it, then go back to their show.
              </p>
            </Card>
            
            <Card className="p-8 bg-blue-50 border-2 border-blue-200">
              <p className="text-xl font-semibold text-slate-900 mb-3">
                Here's the difference from old TV:
              </p>
              <ul className="space-y-3">
                {[
                  "You can show it just in your local area — not the whole country",
                  "You control how much you spend each month",
                  "You don't need thousands of dollars to get started"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <span className="text-lg text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Local Businesses Use This */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Who This Works For
            </h2>
            <p className="text-xl text-slate-700 leading-relaxed">
              Local businesses that want more people to know their name.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {[
              { icon: MapPin, text: "Plumbers, electricians, and other service businesses" },
              { icon: Users, text: "Dentists, lawyers, real estate agents" },
              { icon: Tv, text: "Restaurants and retail shops" },
              { icon: Check, text: "Any business competing with other local businesses" }
            ].map((item, idx) => (
              <Card key={idx} className="p-6 bg-white border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 rounded-full p-3 flex-shrink-0">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-lg text-slate-700 pt-2">{item.text}</p>
                </div>
              </Card>
            ))}
          </div>
          
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 text-center">
            <p className="text-xl font-semibold text-slate-900 mb-3">
              The goal: when someone needs what you offer, they think of you first.
            </p>
            <p className="text-lg text-slate-700">
              This isn't about going viral or getting instant leads. It's about showing up consistently so people remember you.
            </p>
          </Card>
        </div>
      </section>

      {/* Budget Reality */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              What Does It Cost?
            </h2>
            <p className="text-xl text-slate-700 leading-relaxed">
              Less than you might think — but not pocket change either.
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none text-slate-700 mb-12">
            <p className="text-lg leading-relaxed">
              TV ads work when people see them over time. That means running ads for at least a few months, not just once or twice. Think of it like any other advertising — you need consistency.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="p-8 bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <h3 className="text-2xl font-bold text-slate-900">$500–$1,000/month</h3>
              </div>
              <p className="text-lg text-slate-700">Good starting point for smaller local areas</p>
            </Card>
            
            <Card className="p-8 bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <h3 className="text-2xl font-bold text-slate-900">$1,000–$2,000/month</h3>
              </div>
              <p className="text-lg text-slate-700">More reach, more people remembering your name</p>
            </Card>
          </div>
          
          <Card className="p-8 bg-purple-600 text-white text-center">
            <p className="text-xl font-semibold">
              We'll be honest: if your budget doesn't fit, we'll tell you. There are other ways to advertise that might work better.
            </p>
          </Card>
        </div>
      </section>

      {/* Commercial Creation */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              "But I Don't Have a Commercial"
            </h2>
            <p className="text-xl text-slate-700 leading-relaxed">
              That's okay. We make simple ads for you.
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none text-slate-700 mb-12">
            <p className="text-lg leading-relaxed">
              You don't need a film crew or a production company. We create simple ads that explain what you do and show your contact info. Most take a few days to make.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 bg-white border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Video className="h-8 w-8 text-purple-600" />
                <h3 className="text-2xl font-bold text-slate-900">Simple Ad</h3>
              </div>
              <p className="text-slate-600 mb-4 italic">(most common)</p>
              <p className="text-lg text-slate-700 mb-4">
                15–30 seconds with stock photos, text, and voiceover
              </p>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-xl font-bold text-purple-600">One-time: $250–$500</p>
              </div>
            </Card>
            
            <Card className="p-8 bg-white border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Video className="h-8 w-8 text-purple-600" />
                <h3 className="text-2xl font-bold text-slate-900">Custom Ad</h3>
              </div>
              <p className="text-slate-600 mb-4 italic">&nbsp;</p>
              <p className="text-lg text-slate-700 mb-4">
                Uses your existing photos or video footage
              </p>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-xl font-bold text-purple-600">One-time: $500–$1,000</p>
              </div>
            </Card>
          </div>
          
          <Card className="p-8 bg-slate-900 text-white text-center">
            <p className="text-xl font-semibold mb-2">
              This is not Hollywood production.
            </p>
            <p className="text-lg text-slate-300">
              No actors. No crews. No massive fees. Just a simple ad that gets your message across.
            </p>
          </Card>
        </div>
      </section>

      {/* Common Questions */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Common Questions
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-slate-50 border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                Will people actually watch my ad?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                Yes. These ads play before or during shows, just like traditional TV. People can't skip them. They see your business name and what you do. Over time, that builds recognition.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="bg-slate-50 border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                How do I know if it's working?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                We'll show you how many times your ad was shown and who saw it. The real results happen over time — people calling you because they remember seeing your ad.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="bg-slate-50 border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                What if I've tried ads before and they didn't work?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                TV ads work differently than Facebook or Google ads. This isn't about clicks — it's about showing up consistently so people remember you when they need what you offer. If instant leads are your goal, this might not be the right fit.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="bg-slate-50 border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                Can I stop anytime?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                Yes. We don't do long-term contracts. You can run ads for a few months and decide if it's worth continuing.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="bg-slate-50 border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                Do I need to understand how it works?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                No. We handle the setup, placement, and tracking. You just need to decide if the budget makes sense and approve the ad we create for you.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Integration Note */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="p-8 bg-white border-2 border-blue-200 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Works With Your Other Marketing</h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              If you're running social media or other local ads, your TV ads can reinforce the same message. It all works together.
            </p>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Not Sure If This Is Right for You?
            </h2>
            
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Let's figure it out together. We'll review your business, your budget, and your goals — then tell you honestly if TV ads make sense.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={goToIntake}
                className="bg-white text-purple-600 hover:bg-slate-100 px-10 py-7 text-xl font-bold"
              >
                See If TV Ads Make Sense for My Business
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>
            
            <p className="text-white/80 mt-8 text-lg">
              No pressure. No commitment. Just honest advice.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}