import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: "Peter Gardner",
    description: "",
    quote: "I have worked with Rick for many years now and have come to depend on his expertise in the field of social media marketing and web site development. Rick is a very unselfish person and has also taught me a lot about how to manage my own web site so I am not paying thousands of dollars to have someone else do it. Rick could keep this knowledge to himself and his guidance would be worth every penny. I enjoy working with him because he cares first about the client and helping them understand how things work if that's what they want to know. I would recommend Rick for anyone wanting to grow their social media footprint and develop an effective web site."
  },
  {
    name: "Roger Atherton",
    description: "",
    quote: "I've known and worked with Rick Hesse for nearly 25 years. Why I continue to work with him is that he always stays current with online digital marketing trends. He often comes to me to let me know of the latest Google or Facebook changes and how he plans to keep my business current. I appreciate his knowledge and expertise in web design, social media management and video production to provide content and support where my business needs it most, freeing me to run my business with one less thing to worry about."
  },
  {
    name: "Kelly Johnson",
    description: "Johnson Heating & AC",
    quote: "Very good experience working with Rick! The website turned out great and the social media content looks professional and creative. Communication is good and the process is smooth. Would definitely recommend to others looking for help with their online presence."
  },
  {
    name: "Sandy Ireland",
    description: "",
    quote: "When I started my biz-to-biz networking company, I needed everything: a website, email, and help with marketing. Rick at New Tech Advertising was referred to me. By the time I closed my business, I had worked with Rick for five years. He always went above and beyond with his help and expertise. I highly recommend Rick and his agency."
  },
  {
    name: "Tom Sims",
    description: "Local Guide",
    quote: "Great Place for everything on-line. How on-line advertising Works!"
  }
];

export default function CombinedReviewsSection() {
  return (
    <section className="bg-slate-950 py-24 px-6 border-t border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900 mb-6">
            <span className="text-sm font-bold text-slate-300">⭐ GOOGLE REVIEWS — 5.0 RATING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Trusted by Local Businesses Since 2012
          </h2>
          <p className="text-slate-400 text-lg">
            6 five-star reviews from real business owners in North Iowa.
          </p>
        </div>

        {/* Hero Testimonial */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-serif leading-none">"</div>
          <div className="flex gap-1 mb-6 relative z-10">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-[#F4C430] text-[#F4C430]" />
            ))}
          </div>
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-medium italic mb-8 relative z-10">
            "I cannot say enough good things about New Tech Advertising and owner Rick Hesse. From the very first conversation, Rick demonstrated a level of professionalism, creativity, and commitment to customer service that is hard to find today. Rick doesn't just sell advertising—he takes the time to understand your business, your goals, and your vision. His marketing strategies are innovative, effective, and tailored to deliver real results. Every project we've worked on has been handled with attention to detail, excellent communication, and a genuine desire to help our business succeed. What impresses me most is Rick's integrity. He does exactly what he says he's going to do, follows through on his commitments, and treats his clients like partners rather than customers. That's a rare quality in any industry. If you're looking for an advertising company that truly cares about helping your business grow, I highly recommend New Tech Advertising. Rick Hesse has earned my trust, my respect, and my continued business. Five stars all the way. Highly recommended!"
          </p>
          <div className="relative z-10">
            <p className="text-white font-bold text-lg">Jay Alan Monson</p>
            <p className="text-slate-400">Owner, Monson Plumbing, Heating &amp; Excavating</p>
          </div>
        </div>

        {/* Smaller Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {reviews.map((r, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-md flex flex-col h-full">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#F4C430] text-[#F4C430]" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed italic flex-1 mb-6">
                "{r.quote}"
              </p>
              <div className="border-t border-slate-800 pt-5 mt-auto">
                <p className="text-white font-bold">{r.name}</p>
                {r.description && <p className="text-slate-400 text-sm mt-1">{r.description}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a 
            href="https://www.google.com/search?q=New+Tech+Advertising+Mason+City+Iowa#lrd=1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-colors text-base"
          >
            See All Reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}