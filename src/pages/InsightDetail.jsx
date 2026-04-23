import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

export default function InsightDetail() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [relatedAssets, setRelatedAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    base44.entities.InsightPage.filter({ slug, publish_status: 'published' }).then(async results => {
      if (!results.length) { setNotFound(true); setLoading(false); return; }
      const p = results[0];
      setPage(p);
      const [camp, assets] = await Promise.all([
        p.campaign_id ? base44.entities.SpokeCampaign.get(p.campaign_id).catch(() => null) : Promise.resolve(null),
        base44.entities.NTAContentAsset.filter({ campaign_id: p.campaign_id || '' }),
      ]);
      setCampaign(camp);
      setRelatedAssets(assets.filter(a => a.approval_status === 'approved').slice(0, 4));
      setLoading(false);
    });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-6">
      <BookOpen className="w-12 h-12 text-slate-700 mb-4" />
      <h1 className="text-2xl font-bold text-white mb-2">Insight Not Found</h1>
      <p className="text-slate-500 mb-6">This page may have been unpublished or the URL is incorrect.</p>
      <Link to="/insights" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300">
        <ArrowLeft className="w-4 h-4" /> Back to Insights
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 sticky top-0 bg-slate-950/95 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/insights" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Insights
          </Link>
          <Link to="/" className="text-white font-black text-lg">NTA</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-10">
          {campaign && (
            <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-3">{campaign.pillar || campaign.campaign_name}</p>
          )}
          <h1 className="text-4xl font-black leading-tight text-white">{page.headline || page.title}</h1>
          {page.subheadline && <p className="text-slate-400 text-xl mt-4 leading-relaxed">{page.subheadline}</p>}
        </div>

        {/* Video */}
        {page.video_url && (
          <div className="mb-10 rounded-2xl overflow-hidden bg-black aspect-video">
            {page.video_url.includes('youtube') || page.video_url.includes('youtu.be') ? (
              <iframe
                src={page.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                className="w-full h-full" allowFullScreen title={page.title}
              />
            ) : (
              <video src={page.video_url} controls className="w-full h-full object-cover" />
            )}
          </div>
        )}

        {/* Article body */}
        {page.article_body && (
          <div className="prose prose-invert prose-slate max-w-none mb-12
            prose-h2:text-2xl prose-h2:font-bold prose-h2:text-white
            prose-h3:text-xl prose-h3:font-semibold prose-h3:text-slate-200
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-li:text-slate-300
            prose-blockquote:border-blue-600 prose-blockquote:text-slate-400">
            <ReactMarkdown>{page.article_body}</ReactMarkdown>
          </div>
        )}

        {/* CTA */}
        {(page.cta_text || page.cta_link) && (
          <div className="bg-blue-950/40 border border-blue-900/60 rounded-2xl p-8 text-center mb-12">
            <h2 className="text-xl font-bold text-white mb-2">Ready to take the next step?</h2>
            <p className="text-slate-400 mb-5">Work with our team to implement this for your business.</p>
            {page.cta_link ? (
              <a href={page.cta_link} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">
                {page.cta_text || 'Get Started'} <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <Link to="/book-call"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">
                {page.cta_text || 'Book a Call'} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}

        {/* Related content */}
        {relatedAssets.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Related Content</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedAssets.map(a => (
                <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">{a.platform?.replace(/_/g,' ')} · {a.asset_type}</p>
                  <p className="text-sm font-semibold text-white">{a.asset_name}</p>
                  {a.hook && <p className="text-xs text-slate-400 mt-1">{a.hook}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-600 mt-10">
        © {new Date().getFullYear()} NTA · <Link to="/" className="hover:text-slate-400">Home</Link> · <Link to="/insights" className="hover:text-slate-400">All Insights</Link>
      </footer>
    </div>
  );
}