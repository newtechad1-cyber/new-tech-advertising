import React from 'react';
import { motion } from 'framer-motion';

export default function AIPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-invert prose-blue max-w-none"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Artificial Intelligence (AI) Policy</h1>
          <p className="text-slate-400 mb-12">Last Updated: 4/16/26</p>

          <div className="space-y-8 text-lg text-slate-300">
            <p>
              At New Tech Advertising, we believe in leveraging the best available technology to deliver high-quality, engaging, and valuable content to our audience. As part of this commitment, we utilize Artificial Intelligence (AI) tools to assist in our creative and operational processes.
            </p>
            
            <p>
              Because we value transparency and trust, this AI Policy outlines exactly how we use AI, how we protect your data, and the strict human oversight we apply to everything we publish.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">1. How We Use AI</h2>
              <p className="mb-4">We currently use generative AI tools (such as large language models and image generators) primarily to assist in our content creation process. AI helps us:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Brainstorm ideas and outline concepts.</li>
                <li>Draft initial structures for articles, blogs, and marketing materials.</li>
                <li>Perform preliminary research and summarize complex topics.</li>
                <li>Optimize content for readability and search engines.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">2. The "Human-in-the-Loop" Guarantee</h2>
              <p className="mb-4">While we use AI to accelerate our workflow, AI never has the final say.</p>
              <p className="mb-4">Every single piece of content generated with the assistance of AI undergoes rigorous human review before it is published. Our "human touch" ensures that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Accuracy:</strong> All facts, statistics, and claims are verified by a human.</li>
                <li><strong>Quality & Voice:</strong> The content is heavily edited to align with our brand voice, values, and quality standards.</li>
                <li><strong>Empathy & Context:</strong> Human editors ensure the content is culturally sensitive, appropriate, and genuinely helpful to our audience.</li>
              </ul>
              <p className="mt-4">We view AI as a collaborative assistant, not a replacement for human creativity and judgment.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">3. AI and User Privacy</h2>
              <p className="mb-4">Your privacy is paramount. When we use third-party AI tools, we strictly control the information that is shared with them.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We do not input sensitive consumer data, personal identifiers, or confidential client information into public AI models.</li>
                <li>We do not use your personal data to train our own AI models without your explicit, opt-in consent.</li>
                <li>Our use of AI is fully compliant with our overall <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">4. Continuous Monitoring and Legal Compliance</h2>
              <p>
                The legal landscape surrounding Artificial Intelligence is rapidly evolving. We are actively monitoring local, state, federal, and international AI regulations. We are committed to updating our practices and this policy to remain fully compliant with all emerging transparency, anti-discrimination, and copyright laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 mt-8">5. Feedback and Contact</h2>
              <p className="mb-4">If you have any questions, concerns, or feedback regarding our use of AI, or if you spot an error in any of our content, we want to hear from you.</p>
              <p className="mb-2">Please contact us at:</p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> <a href="mailto:info@newtechadvertising.com" className="text-blue-400 hover:text-blue-300">info@newtechadvertising.com</a></li>
                <li><strong>Mailing Address:</strong> 102 26th Street SW Mason City IA 50401</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}