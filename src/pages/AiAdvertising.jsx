import { useState } from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import SignupModal from '../components/landing/SignupModal';
import Chatbot from '../components/Chatbot';
import { motion } from 'framer-motion';
import { Target, PieChart, DollarSign, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/shared/SEOHead';

export default function AiAdvertising() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <SEOHead 
        title="Should My Small Business Use Digital Advertising? | NTA"
        description="Understand where Google, social, display, and video advertising may fit in a small-business Digital Growth Roadmap before spending more money."
        serviceData={{
          name: 'Digital Advertising Planning and Management',
          serviceType: 'Digital advertising strategy, campaign planning, and management for small business',
          description: 'NTA helps small businesses decide when paid advertising makes sense, connect the message and destination, and review results without treating advertising as the whole strategy.',
          areaServed: 'United States',
          audience: 'Small-business owners and local or regional businesses'
        }}
        learningData={{
          name: 'Should a Small Business Use Digital Advertising?',
          description: 'A practical guide to deciding whether paid search, social, display, or video advertising belongs in the larger business plan.',
          educationalLevel: 'Beginner',
          learningResourceType: 'Practical guide'
        }}
      />
      <Header onCTAClick={() => setIsModalOpen(true)} />
      
      <main className="flex-grow pt-20">
        <section className="py-20 bg-gradient-to-br from-purple-900 to-blue-900 text-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Paid Advertising Should Support the Business <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Not Become the Strategy</span>
              </h1>
              <p className="text-xl text-slate-300 mb-10">
                Google, social, display, and video ads can help when the audience, offer, destination, budget, and follow-up are clear. NTA starts with those decisions before recommending a campaign.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
                <Button onClick={() => setIsModalOpen(true)} size="lg" className="bg-white text-purple-900 hover:bg-slate-100 px-8 py-6 text-lg rounded-xl font-bold">
                  Talk Through the Advertising Plan
                </Button>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 aspect-[21/9] max-w-3xl mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=1000&auto=format&fit=crop" 
                  alt="AI advertising dashboard showing Google and Facebook ad performance" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                <Target className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">Audience Fit</h3>
                <p className="text-slate-600 text-sm">Start with who the business is trying to reach, where those people are, and which paid channels actually fit that audience.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                <DollarSign className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">Budget Discipline</h3>
                <p className="text-slate-600 text-sm">Set a clear budget, define what should be measured, and review whether the campaign is producing useful business activity.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                <Zap className="w-10 h-10 text-yellow-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Connected Channels</h3>
                <p className="text-slate-600 text-sm">Search, social, display, streaming TV, and video can work together when each channel has a defined job in the customer path.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                <PieChart className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">Useful Measurement</h3>
                <p className="text-slate-600 text-sm">Track spend, response, conversions, and available business outcomes so the owner can decide what deserves more attention.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Deep Dive Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">What should happen before you spend more on digital advertising?</h2>
                <p className="speakable text-slate-600 text-lg mb-6">
                  Clarify the audience, the message, the destination, the budget, and what result would make the campaign useful. AI and platform automation can assist with bidding, targeting, reporting, and creative preparation, but they do not replace the business decisions behind the campaign.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-purple-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Platform Bidding Tools</h4>
                      <p className="text-slate-600">Advertising platforms can use automated bidding and historical signals to help manage delivery. The owner still needs clear goals, budgets, and review.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-purple-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Creative Testing</h4>
                      <p className="text-slate-600">Different messages, offers, and formats can be tested when there is enough volume and a clear reason to compare them. Testing should support learning, not create noise for its own sake.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-purple-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Geographic Targeting</h4>
                      <p className="text-slate-600">Location targeting can help focus a campaign on the areas the business actually serves, subject to the options and limits of the advertising platform being used.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl transform rotate-3 opacity-20"></div>
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative">
                  <h3 className="text-xl font-bold mb-6">What NTA Reviews With the Owner</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                      <div>
                        <p className="text-sm text-slate-500">Before the campaign</p>
                        <p className="font-bold text-slate-900">Goal, audience, offer, destination, budget</p>
                      </div>
                      <span className="text-slate-500 text-sm font-medium">Plan</span>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-0.5 h-8 bg-slate-200"></div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <div>
                        <p className="text-sm text-slate-500">After launch</p>
                        <p className="font-bold text-slate-900">Spend, response, conversions, business outcome</p>
                      </div>
                      <span className="text-green-500 text-sm font-medium">Review</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-sm text-slate-500 italic">
                      Results vary by business, offer, market, budget, platform, and follow-up. NTA does not promise a specific return.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Decide whether paid advertising belongs in the Roadmap.</h2>
            <p className="text-lg text-slate-600 mb-8">
              Paid advertising can create reach quickly, but it works best when the rest of the customer path is ready. We can review where advertising fits before increasing spend.
            </p>
            <Button onClick={() => setIsModalOpen(true)} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              Get A Free Audit
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Chatbot />
    </div>
  );
}