import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import SignupModal from '../components/landing/SignupModal';
import Chatbot from '../components/Chatbot';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { createPageUrl } from '../utils';

export default function Blog() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list({ sort: { published_date: -1 } }),
    initialData: []
  });

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header onCTAClick={() => setIsModalOpen(true)} />
      
      <main className="flex-grow pt-20">
        <div className="bg-slate-50 py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Latest Insights</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover the latest trends in AI marketing, automation, and business growth strategies.
            </p>
          </div>
        </div>

        <div className="py-16 max-w-6xl mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link 
                  key={post.id} 
                  to={`${createPageUrl('BlogPost')}?id=${post.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      {post.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {post.published_date}
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-slate-600 mb-6 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                      Read Article <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {!isLoading && posts.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              No articles found. Check back soon!
            </div>
          )}
        </div>
      </main>

      <Footer />
      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Chatbot />
    </div>
  );
}

// Need to import useState since I used it
import { useState } from 'react';