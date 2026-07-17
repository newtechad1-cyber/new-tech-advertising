import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Newspaper, Mail, X } from 'lucide-react';
import { formatShortDate } from '@/components/journal/journalData';
import ReactMarkdown from 'react-markdown';

export default function JournalPreviewModal({ isOpen, onClose, issue }) {
  const [activeTab, setActiveTab] = useState('web');

  if (!issue) return null;

  const leadArticle = issue.selected_articles?.find(a => a.is_lead) || issue.selected_articles?.[0];
  const otherArticles = issue.selected_articles?.filter(a => a !== leadArticle) || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-950 border-slate-800 text-slate-200">
        <DialogHeader className="p-4 border-b border-slate-800 flex flex-row items-center justify-between sticky top-0 bg-slate-950 z-10 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-slate-200">
            Preview: Issue #{issue.issue_number}
          </DialogTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[300px] mx-auto">
            <TabsList className="grid w-full grid-cols-2 bg-slate-900 border border-slate-800">
              <TabsTrigger value="web" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                <Newspaper className="w-4 h-4 mr-2" /> Web
              </TabsTrigger>
              <TabsTrigger value="email" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                <Mail className="w-4 h-4 mr-2" /> Email
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
          <TabsContent value="web" className="m-0 h-full">
            <div className="max-w-3xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
              <header className="text-center mb-12 border-b border-slate-800 pb-12">
                <div className="inline-block text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-500/30 rounded-full px-4 py-1.5 mb-6 bg-indigo-500/10">
                  The NTA Journal • Issue #{issue.issue_number}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">{issue.title}</h1>
                {issue.subtitle && <p className="text-xl text-slate-400">{issue.subtitle}</p>}
                
                {(issue.author || issue.date) && (
                  <div className="flex items-center justify-center gap-4 mt-6 text-sm text-slate-500 font-medium">
                    {issue.author && <span>{issue.author}</span>}
                    {issue.author && issue.date && <span>•</span>}
                    {issue.date && <span>{formatShortDate(issue.date)}</span>}
                  </div>
                )}
              </header>

              {issue.introduction_headline && (
                <h2 className="text-2xl font-bold text-white mb-6">{issue.introduction_headline}</h2>
              )}

              {issue.introductory_message && (
                <div className="prose prose-invert prose-slate max-w-none mb-12 prose-p:leading-relaxed prose-p:text-slate-300">
                  <ReactMarkdown>{issue.introductory_message}</ReactMarkdown>
                </div>
              )}

              {leadArticle && (
                <div className="mb-12 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                  <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2 block">Featured Read</span>
                  <h3 className="text-2xl font-bold text-white mb-3">{leadArticle.title}</h3>
                  <p className="text-slate-400 mb-6">{leadArticle.excerpt}</p>
                  <div className="flex items-center gap-4">
                    <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors">
                      Read Article
                    </button>
                    <span className="text-xs text-slate-500 font-medium">{leadArticle.reading_time || '5 min read'}</span>
                  </div>
                </div>
              )}

              {otherArticles.length > 0 && (
                <div className="space-y-8 mb-12">
                  <h3 className="text-lg font-bold text-slate-300 border-b border-slate-800 pb-2">Also in this issue</h3>
                  {otherArticles.map((article, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-6 items-start group">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{article.title}</h4>
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center gap-3">
                          <button className="text-indigo-400 text-sm font-bold hover:text-indigo-300">Read Article →</button>
                          <span className="text-xs text-slate-500">{article.reading_time || '5 min read'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(issue.closing_message || issue.editor_signature) && (
                <div className="mt-12 pt-8 border-t border-slate-800">
                  {issue.closing_message && (
                    <div className="prose prose-invert prose-slate max-w-none mb-6 prose-p:leading-relaxed prose-p:text-slate-300">
                      <ReactMarkdown>{issue.closing_message}</ReactMarkdown>
                    </div>
                  )}
                  {issue.editor_signature && (
                    <p className="text-slate-400 italic">
                      — {issue.editor_signature}
                    </p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="email" className="m-0 h-full">
            <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-2xl text-slate-900 font-sans">
              <div className="bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider text-center p-2 rounded mb-8">
                Preview Only — No Email Will Be Sent
              </div>
              
              <div className="text-center mb-8 border-b border-slate-200 pb-8">
                <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-4">The NTA Journal</p>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{issue.title}</h1>
                <p className="text-slate-500">Issue #{issue.issue_number}</p>
              </div>

              {issue.introduction_headline && (
                <h2 className="text-xl font-bold text-slate-900 mb-4">{issue.introduction_headline}</h2>
              )}

              {issue.introductory_message && (
                <div className="prose prose-slate max-w-none mb-8 text-base text-slate-700">
                  <ReactMarkdown>{issue.introductory_message}</ReactMarkdown>
                </div>
              )}

              {leadArticle && (
                <div className="mb-10 bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2 block">Featured Read</span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{leadArticle.title}</h3>
                  <p className="text-slate-600 mb-4 text-sm">{leadArticle.excerpt}</p>
                  <a href="#" className="inline-block bg-indigo-600 text-white font-bold py-2 px-6 rounded-md text-sm decoration-none">
                    Read Article
                  </a>
                </div>
              )}

              {otherArticles.length > 0 && (
                <div className="space-y-6 mb-10">
                  {otherArticles.map((article, idx) => (
                    <div key={idx} className="border-t border-slate-100 pt-6">
                      <h4 className="text-lg font-bold text-slate-900 mb-2">{article.title}</h4>
                      <p className="text-slate-600 text-sm mb-3">{article.excerpt}</p>
                      <a href="#" className="text-indigo-600 font-bold text-sm">Read Article →</a>
                    </div>
                  ))}
                </div>
              )}

              {(issue.closing_message || issue.editor_signature) && (
                <div className="mt-8 pt-8 border-t border-slate-200">
                  {issue.closing_message && (
                    <div className="prose prose-slate max-w-none mb-4 text-base text-slate-700">
                      <ReactMarkdown>{issue.closing_message}</ReactMarkdown>
                    </div>
                  )}
                  {issue.editor_signature && (
                    <p className="text-slate-600 italic">
                      — {issue.editor_signature}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
                <p>You are receiving this email because you subscribed to The NTA Journal.</p>
                <p className="mt-2"><a href="#" className="underline">Unsubscribe</a> • <a href="#" className="underline">Update Preferences</a></p>
                <p className="mt-2">New Tech Advertising, LLC</p>
              </div>
            </div>
          </TabsContent>
        </div>
      </DialogContent>
    </Dialog>
  );
}