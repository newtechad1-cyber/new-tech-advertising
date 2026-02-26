import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import Chatbot from '../components/Chatbot';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Download, ExternalLink } from 'lucide-react';

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    base44.entities.Product.filter({ status: 'active' }, '-created_date').then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const types = ['all', ...new Set(products.map(p => p.product_type))];
  const filtered = filter === 'all' ? products : products.filter(p => p.product_type === filter);

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <main>
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white text-center">
          <div className="max-w-3xl mx-auto px-6">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-blue-300" />
            <h1 className="text-4xl font-bold mb-4">Our Products & Resources</h1>
            <p className="text-lg text-slate-300">
              Ebooks, templates, courses, and tools to help grow your business.
            </p>
          </div>
        </section>

        {/* Filter Tabs */}
        {types.length > 1 && (
          <div className="border-b border-slate-200 sticky top-0 bg-white z-10">
            <div className="max-w-6xl mx-auto px-6 flex gap-2 py-3 overflow-x-auto">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                    filter === t
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            {loading ? (
              <div className="text-center py-20 text-slate-400">Loading products...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-slate-400">No products available yet. Check back soon!</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map(product => (
                  <div key={product.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-blue-400" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h2 className="text-lg font-bold text-slate-900 leading-tight">{product.name}</h2>
                        <Badge className="bg-slate-100 text-slate-600 capitalize text-xs ml-2 shrink-0">{product.product_type}</Badge>
                      </div>
                      {product.description && (
                        <p className="text-slate-600 text-sm mb-4 flex-1">{product.description}</p>
                      )}
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-slate-900">${Number(product.price).toFixed(2)}</span>
                        </div>
                        {product.file_url ? (
                          <a href={product.file_url} target="_blank" rel="noopener noreferrer" className="w-full block">
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                              <Download className="w-4 h-4 mr-2" /> Get Now
                            </Button>
                          </a>
                        ) : (
                          <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            onClick={() => window.open('mailto:rick@newtechadvertising.com?subject=Order: ' + encodeURIComponent(product.name), '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" /> Order Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}