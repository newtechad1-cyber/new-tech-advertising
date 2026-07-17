import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, Save, Send, Eye, FileText, LayoutList, MessageSquare, Plus, Trash2, Star, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { pointOfViewArticles } from '@/data/povArticles';
import { flagshipArticleToolsVsSystem, flagshipArticleDIYToDFY } from '@/data/flagshipArticles';
import { normalizeJournalArticle } from './normalizeJournalArticle';

const flagshipArticles = [flagshipArticleToolsVsSystem, flagshipArticleDIYToDFY];
import JournalPreviewModal from './JournalPreviewModal';

import EmailBodyEditor from '@/components/crm/EmailBodyEditor';

export default function JournalEditionBuilder({ issue, onClose }) {
  const [formData, setFormData] = useState(issue || {});
  const [activeTab, setActiveTab] = useState('details');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [articleLibrary, setArticleLibrary] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    loadArticleLibrary();
  }, []);

  const loadArticleLibrary = async () => {
    let library = [];
    
    // Static POV
    pointOfViewArticles.forEach(a => {
      library.push(normalizeJournalArticle(a, 'POV'));
    });

    // Static Flagship
    flagshipArticles.forEach(a => {
      library.push(normalizeJournalArticle(a, 'Flagship'));
    });

    try {
      const pArticles = await base44.entities.PublishingArticle.list('-created_date', 50);
      pArticles.forEach(a => {
        library.push(normalizeJournalArticle(a, 'PublishingArticle'));
      });
    } catch(err) { console.warn(err); }

    try {
      const kArticles = await base44.entities.KnowledgeArticle.list('-created_date', 50);
      kArticles.forEach(a => {
        library.push(normalizeJournalArticle(a, 'KnowledgeArticle'));
      });
    } catch(err) { console.warn(err); }

    setArticleLibrary(library);
  };

  const checkSlugDuplicate = async (slug) => {
    if (!slug) return false;
    const normalizedSlug = slug.trim().toLowerCase();
    try {
      const matches = await base44.entities.JournalIssue.filter({ slug: normalizedSlug });
      // Exclude current issue if saving
      const duplicates = matches.filter(m => m.id !== formData.id);
      return duplicates.length > 0;
    } catch (err) {
      console.warn("Failed checking slug", err);
      return false;
    }
  };

  const reindexArticles = (articles) => {
    return articles.map((a, i) => ({ ...a, display_order: i + 1 }));
  };

  const handleSave = async (status = null) => {
    setIsSaving(true);
    setSaveStatus(status === 'Published' ? 'Publishing...' : 'Saving...');
    try {
      const payload = { ...formData };
      
      if (status) {
        payload.status = status;
        if (status === 'Published' && !payload.date) {
          payload.date = new Date().toISOString().split('T')[0];
        }
      }

      if (payload.slug) {
        payload.slug = payload.slug.trim().toLowerCase();
        const isDupe = await checkSlugDuplicate(payload.slug);
        if (isDupe) {
          setSaveStatus('Slug conflict');
          setValidationErrors(['This Journal slug is already in use. Choose a different slug before continuing.']);
          return false;
        }
      }

      let updated;
      if (payload.id) {
        updated = await base44.entities.JournalIssue.update(payload.id, payload);
      } else {
        updated = await base44.entities.JournalIssue.create(payload);
      }

      setFormData(updated);
      setSaveStatus(status === 'Published' ? 'Published' : 'Draft saved');
      setValidationErrors([]);
      setTimeout(() => setSaveStatus(''), 3000);
      return true;
    } catch (err) {
      console.error(err);
      setSaveStatus('Save failed');
      return false;
    } finally {
      setIsSaving(false);
      setPublishDialogOpen(false);
    }
  };

  const validateForPublish = () => {
    const errors = [];
    if (!formData.issue_number) errors.push('Missing issue number');
    if (!formData.title) errors.push('Missing title');
    if (!formData.slug) errors.push('Missing slug');
    if (!formData.selected_articles || formData.selected_articles.length === 0) {
      errors.push('Please select at least one article');
    } else if (!formData.selected_articles.some(a => a.is_lead)) {
      errors.push('Please select exactly one lead article');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const tryPublish = () => {
    if (validateForPublish()) {
      setPublishDialogOpen(true);
    }
  };

  const addArticle = (article) => {
    let current = formData.selected_articles || [];
    if (current.find(a => a.source_id === article.source_id && a.source_type === article.source_type)) return;
    
    let newArticles = [...current, { ...article, is_lead: current.length === 0 }];
    newArticles = reindexArticles(newArticles);
    setFormData({ ...formData, selected_articles: newArticles });
  };

  const removeArticle = (index) => {
    let newArticles = [...(formData.selected_articles || [])];
    newArticles.splice(index, 1);
    
    // Explicitly leaving it without a lead if the lead was removed. Validation will catch it.
    
    newArticles = reindexArticles(newArticles);
    setFormData({ ...formData, selected_articles: newArticles });
  };

  const setLeadArticle = (index) => {
    let newArticles = (formData.selected_articles || []).map((a, i) => ({
      ...a,
      is_lead: i === index
    }));
    setFormData({ ...formData, selected_articles: newArticles });
  };

  const moveArticle = (index, direction) => {
    let newArticles = [...(formData.selected_articles || [])];
    if (direction === 'up' && index > 0) {
      const temp = newArticles[index - 1];
      newArticles[index - 1] = newArticles[index];
      newArticles[index] = temp;
    } else if (direction === 'down' && index < newArticles.length - 1) {
      const temp = newArticles[index + 1];
      newArticles[index + 1] = newArticles[index];
      newArticles[index] = temp;
    }
    newArticles = reindexArticles(newArticles);
    setFormData({ ...formData, selected_articles: newArticles });
  };

  const filteredLibrary = articleLibrary.filter(a => {
    if (sourceFilter !== 'All' && a.source_type !== sourceFilter) return false;
    if (searchTerm && !a.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-white text-lg">Edition Builder</h1>
            <p className="text-xs text-slate-500">Issue #{formData.issue_number} • {formData.status}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-400">
            {isSaving && <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />}
            {saveStatus}
          </span>
          <button onClick={() => setPreviewOpen(true)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button onClick={() => handleSave('Draft')} disabled={isSaving} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button onClick={tryPublish} disabled={isSaving} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50">
            <Send className="w-4 h-4" /> Publish
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-5xl mx-auto w-full p-6">
        
        {validationErrors.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3 text-red-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold mb-1 text-red-300">Complete these items before publishing:</h4>
              <ul className="list-disc ml-5 space-y-1 text-sm">
                {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-900 border border-slate-800 w-full justify-start rounded-xl p-1 mb-8">
            <TabsTrigger value="details" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white flex-1"><FileText className="w-4 h-4 mr-2" /> Details</TabsTrigger>
            <TabsTrigger value="articles" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white flex-1"><LayoutList className="w-4 h-4 mr-2" /> Articles</TabsTrigger>
            <TabsTrigger value="intro" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white flex-1"><MessageSquare className="w-4 h-4 mr-2" /> Introduction</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">Edition Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Issue Number</label>
                  <input 
                    type="number" 
                    value={formData.issue_number || ''} 
                    onChange={e => setFormData({...formData, issue_number: parseInt(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Publication Date</label>
                  <input 
                    type="date" 
                    value={formData.date || ''} 
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-400 mb-2">Title</label>
                  <input 
                    type="text" 
                    value={formData.title || ''} 
                    onChange={e => {
                      const title = e.target.value;
                      // Auto-slug only if slug is empty or matches previous title's slug
                      const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      setFormData(prev => ({
                        ...prev, 
                        title,
                        slug: (!prev.slug || prev.slug === (prev.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) ? autoSlug : prev.slug
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-400 mb-2">Slug</label>
                  <input 
                    type="text" 
                    value={formData.slug || ''} 
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-400 mb-2">Subtitle / Theme</label>
                  <input 
                    type="text" 
                    value={formData.subtitle || ''} 
                    onChange={e => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" 
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Selected Articles */}
              <div className="lg:col-span-3 space-y-4">
                <h2 className="text-xl font-bold text-white mb-6">Selected Articles</h2>
                {(!formData.selected_articles || formData.selected_articles.length === 0) ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                    No articles selected. Choose from the library on the right.
                  </div>
                ) : (
                  formData.selected_articles.map((article, idx) => (
                    <div key={idx} className={`bg-slate-900 border ${article.is_lead ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'border-slate-800'} rounded-2xl p-4 flex items-start gap-4`}>
                      <div className="flex flex-col gap-1 text-slate-600 mt-2">
                        <button onClick={() => moveArticle(idx, 'up')} disabled={idx === 0} className="hover:text-white disabled:opacity-30"><ChevronLeft className="w-5 h-5 rotate-90" /></button>
                        <button onClick={() => moveArticle(idx, 'down')} disabled={idx === formData.selected_articles.length - 1} className="hover:text-white disabled:opacity-30"><ChevronLeft className="w-5 h-5 -rotate-90" /></button>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">{article.source_type}</span>
                          {article.is_lead && <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 flex items-center gap-1"><Star className="w-3 h-3" /> Lead Article</span>}
                        </div>
                        <h4 className="font-bold text-white text-lg">{article.title}</h4>
                        <p className="text-sm text-slate-400 line-clamp-2 mt-1">{article.excerpt}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <button onClick={() => removeArticle(idx)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        {!article.is_lead && (
                          <button onClick={() => setLeadArticle(idx)} className="text-xs font-bold text-indigo-400 hover:text-indigo-300">Make Lead</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Article Library */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[600px]">
                <h2 className="text-lg font-bold text-white mb-4">Article Library</h2>
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white mb-4 focus:outline-none focus:border-indigo-500" 
                />
                <select 
                  value={sourceFilter} 
                  onChange={e => setSourceFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white mb-4 focus:outline-none"
                >
                  <option value="All">All Sources</option>
                  <option value="POV">NTA Point of View</option>
                  <option value="Flagship">Flagship Articles</option>
                  <option value="PublishingArticle">Publishing Articles</option>
                  <option value="KnowledgeArticle">Knowledge Library</option>
                </select>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {filteredLibrary.map((article, idx) => {
                    const isSelected = formData.selected_articles?.some(a => a.source_id === article.source_id);
                    return (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 hover:border-slate-700 transition-colors">
                        <h5 className="font-bold text-sm text-white leading-tight mb-1">{article.title}</h5>
                        <span className="text-[10px] text-slate-500">{article.source_type}</span>
                        <div className="mt-3 flex justify-end">
                          <button 
                            onClick={() => addArticle(article)} 
                            disabled={isSelected}
                            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-slate-800 transition-colors"
                          >
                            {isSelected ? <><Check className="w-3 h-3" /> Added</> : <><Plus className="w-3 h-3" /> Add</>}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="intro" className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
              <h2 className="text-xl font-bold text-white mb-2">Introduction & Closing</h2>
              
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Introduction Headline</label>
                <input 
                  type="text" 
                  value={formData.introduction_headline || ''} 
                  onChange={e => setFormData({...formData, introduction_headline: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Introductory Message (Markdown)</label>
                <textarea 
                  rows={8}
                  value={formData.introductory_message || ''}
                  onChange={e => setFormData({...formData, introductory_message: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-mono text-sm"
                  placeholder="Enter introduction in Markdown format..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Closing Message (Markdown)</label>
                <textarea 
                  rows={6}
                  value={formData.closing_message || ''}
                  onChange={e => setFormData({...formData, closing_message: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-mono text-sm"
                  placeholder="Enter closing message in Markdown format..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Editor Signature</label>
                  <input 
                    type="text" 
                    value={formData.editor_signature || ''} 
                    onChange={e => setFormData({...formData, editor_signature: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" 
                  />
                </div>
              </div>

            </div>
          </TabsContent>
        </Tabs>
      </div>

      <JournalPreviewModal 
        isOpen={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        issue={formData} 
      />

      <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Publish this Journal edition?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will make the edition available in the public NTA Journal archive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving} className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleSave('Published')} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Publish Edition
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}