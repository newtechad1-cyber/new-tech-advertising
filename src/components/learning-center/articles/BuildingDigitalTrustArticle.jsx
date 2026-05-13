import React from 'react';
import { ChevronDown } from 'lucide-react';
import LCInsightBlock from '@/components/learning-center/LCInsightBlock';
import LCCallToAction from '@/components/learning-center/LCCallToAction';

export default function BuildingDigitalTrustArticle() {
  return (
    <div className="prose prose-invert prose-lg max-w-none">
      <p className="text-xl text-slate-300 leading-relaxed mb-10">
        Before a customer ever picks up the phone or walks through your door, they have already made a decision about your business. In today's digital landscape, trust isn't earned during the first conversation—it's established through the digital footprint you leave online. 
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-6">What Digital Trust Means Today</h2>
      <p>
        Digital trust is the cumulative confidence a prospect feels when researching your business. It is built through a combination of consistent branding, authentic social proof, and a seamless user experience. When any of these elements are missing or broken, trust erodes instantly.
      </p>
      <p>
        Today, digital trust is formed by:
      </p>
      <ul className="space-y-3 mb-8 list-none pl-0">
        <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Modern, Accessible Websites:</strong> Sites that look professional and work perfectly for all users on all devices.</li>
        <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Authentic Reviews:</strong> A steady stream of positive, recent feedback across platforms.</li>
        <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Video & Social Proof:</strong> Seeing real people, real projects, and real expertise before buying.</li>
        <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Brand Consistency:</strong> The same name, address, phone number, and message everywhere.</li>
      </ul>

      <LCInsightBlock 
        type="business_insight"
        title="The Zero-Click Decision"
        content="Many customers now make their buying decision without ever clicking through to your website. They judge you entirely on your Google Business Profile, your reviews, and what AI search engines summarize about you."
      />

      <h2 className="text-2xl font-bold text-white mt-12 mb-6">Why Trust Impacts Visibility</h2>
      <p>
        Search engines and AI models are fundamentally designed to answer user questions with the most reliable, trustworthy information available. They don't want to recommend a business that looks shady, has terrible reviews, or presents conflicting information.
      </p>
      <p>
        When your business demonstrates strong digital trust signals—like consistent NAP (Name, Address, Phone) data, accessible website code, and active customer reviews—Google and AI agents reward you with higher visibility. They view your business as a "safe bet" to recommend to their users.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-6">Common Trust Problems Small Businesses Have</h2>
      <p>
        Many excellent local businesses lose to inferior competitors simply because their digital trust signals are weak. Common issues include:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
        <div className="bg-slate-900 border border-rose-900/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-rose-400 mb-4">Trust Killers</h3>
          <ul className="space-y-3 text-slate-300">
            <li>• Outdated, slow, or broken websites</li>
            <li>• No recent reviews (or unanswered negative ones)</li>
            <li>• Inaccessible websites that frustrate users and AI</li>
            <li>• Stock photos instead of real team/project images</li>
            <li>• Inconsistent business info across directories</li>
          </ul>
        </div>
        <div className="bg-slate-900 border border-emerald-900/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-emerald-400 mb-4">Trust Builders</h3>
          <ul className="space-y-3 text-slate-300">
            <li>• Fast, accessible, mobile-first websites</li>
            <li>• Consistent, positive review generation</li>
            <li>• Educational video content answering common questions</li>
            <li>• Clear, transparent pricing and service details</li>
            <li>• Active, helpful social media presence</li>
          </ul>
        </div>
      </div>

      <LCInsightBlock 
        type="real_world"
        title="The Power of Video"
        content="Video is the ultimate shortcut to digital trust. When a prospect sees your face, hears your voice, and watches you explain how you solve their problem, their anxiety drops and their trust skyrockets."
      />

      <h2 className="text-2xl font-bold text-white mt-12 mb-6">How Businesses Build Digital Trust</h2>
      <p>
        Building digital trust is not an overnight hack; it is a systematic approach to your online presence. Here are the practical steps to start:
      </p>
      <ol className="space-y-4 mb-10 list-none pl-0">
        <li className="flex items-start gap-4">
          <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">1</span>
          <div>
            <strong className="text-white block mb-1">Audit Your Foundation</strong>
            Ensure your website is fast, mobile-friendly, and ADA accessible. If it isn't, you are actively turning away both customers and AI search engines.
          </div>
        </li>
        <li className="flex items-start gap-4">
          <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">2</span>
          <div>
            <strong className="text-white block mb-1">Systematize Reviews</strong>
            Don't just hope for reviews. Implement a system that automatically asks happy customers for feedback via SMS or email immediately after service.
          </div>
        </li>
        <li className="flex items-start gap-4">
          <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">3</span>
          <div>
            <strong className="text-white block mb-1">Create Educational Content</strong>
            Stop just selling. Start answering the questions your customers are asking. Use video to explain your process, pricing, and expertise.
          </div>
        </li>
        <li className="flex items-start gap-4">
          <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold">4</span>
          <div>
            <strong className="text-white block mb-1">Unify Your Brand</strong>
            Ensure your Google Business Profile, website, Facebook page, and local directory listings all tell the exact same, accurate story.
          </div>
        </li>
      </ol>

      <h2 className="text-2xl font-bold text-white mt-16 mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4 mb-16 not-prose">
        {[
          { q: "Why does digital trust matter so much now?", a: "Customers have endless options. If they sense any friction, outdated information, or lack of social proof, they immediately click back to Google and call your competitor." },
          { q: "Can reviews actually affect my SEO?", a: "Absolutely. Google explicitly states that high-quality, positive reviews improve your business's visibility and likelihood to show up in the local 'Map Pack'." },
          { q: "Does video really help build trust?", a: "Yes. Video humanizes your business. It allows prospects to 'meet' you before they hire you, which drastically reduces buying friction." },
          { q: "Does website accessibility improve trust?", a: "Yes. An accessible website ensures everyone can use your site comfortably. It also forces your website to use clean, semantic code, which AI models and search engines strongly prefer." }
        ].map((faq, i) => (
          <details key={i} className="group bg-slate-900 border border-slate-800 rounded-xl">
            <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-white">
              <span>{faq.q}</span>
              <span className="transition group-open:rotate-180">
                <ChevronDown className="w-5 h-5 text-slate-500" />
              </span>
            </summary>
            <div className="text-slate-400 p-5 pt-0 leading-relaxed border-t border-slate-800 mt-2">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div className="not-prose">
        <LCCallToAction mode="audit" title="Is Your Digital Trust Costing You Leads?" description="Get a free gap audit to see exactly how customers and AI engines view your business online today." />
      </div>
    </div>
  );
}