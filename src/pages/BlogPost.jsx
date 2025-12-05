import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import SignupModal from '../components/landing/SignupModal';
import Chatbot from '../components/Chatbot';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';
import { createPageUrl } from '../utils';

export default function BlogPost() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: () => base44.entities.BlogPost.list(), // Fetch all and filter client side since we don't have a direct get or it might be safer
    enabled: !!id
  });

  const post = posts ? posts.find(p => p.id === id) : null;

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header onCTAClick={() => setIsModalOpen(true)} />
      
      <main className="flex-grow pt-20">
        {isLoading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
        ) : !post ? (
          <div className="py-32 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Post not found</h2>
            <Link to={createPageUrl('Blog')} className="text-indigo-600 hover:underline">
              Return to Blog
            </Link>
          </div>
        ) : (
          <article>
            {/* Hero Image */}
            <div className="h-96 w-full relative">
              <img 
                src={post.image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-4xl mx-auto px-6 text-center text-white">
                  <div className="inline-block bg-indigo-600 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                    {post.category}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    {post.title}
                  </h1>
                  <div className="flex items-center justify-center gap-6 text-sm md:text-base text-slate-200">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" /> {post.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> {post.published_date}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 py-16">
              <Link 
                to={createPageUrl('Blog')}
                className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
              </Link>
              
              <div className="prose prose-lg prose-slate max-w-none">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
              
              {/* CTA Box */}
              <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100 text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to grow your business?</h3>
                <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                  Get started with our AI-powered marketing solutions today. No contracts, just results.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all hover:scale-105"
                >
                  Get Started Now
                </button>
              </div>
            </div>
          </article>
        )}
      </main>

      <Footer />
      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Chatbot />
    </div>
  );
}