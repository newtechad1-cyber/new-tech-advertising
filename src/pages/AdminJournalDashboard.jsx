import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Newspaper, FileEdit, Eye, Copy, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import JournalEditionBuilder from '../components/journal-builder/JournalEditionBuilder';

export default function AdminJournalDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIssue, setEditingIssue] = useState(null);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.JournalIssue.list('-issue_number', 50);
      setIssues(data || []);
    } catch (err) {
      console.error('Failed to load issues', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async (isFirst = false) => {
    const payload = isFirst ? {
      issue_number: 1,
      title: "Your Business Is an Experience",
      slug: "your-business-is-an-experience",
      status: "Draft",
      author: "Rick Hesse",
      editor_signature: "Rick Hesse",
      introduction_headline: "Your Business Is More Than What You Sell"
    } : {
      issue_number: (issues[0]?.issue_number || 0) + 1,
      title: "New Edition",
      slug: "new-edition-" + Date.now(),
      status: "Draft",
      author: "Rick Hesse"
    };

    try {
      const newIssue = await base44.entities.JournalIssue.create(payload);
      setIssues([newIssue, ...issues]);
      setEditingIssue(newIssue);
    } catch (err) {
      console.error('Failed to create new issue', err);
    }
  };

  const handleDuplicate = async (issue) => {
    try {
      const payload = { ...issue, id: undefined, created_date: undefined, updated_date: undefined };
      payload.title = payload.title + ' (Copy)';
      payload.slug = payload.slug + '-copy-' + Date.now();
      payload.issue_number = (issues[0]?.issue_number || 0) + 1;
      payload.status = 'Draft';
      
      const newIssue = await base44.entities.JournalIssue.create(payload);
      setIssues([newIssue, ...issues]);
    } catch (err) {
      console.error('Failed to duplicate issue', err);
    }
  };

  if (editingIssue) {
    return (
      <JournalEditionBuilder 
        issue={editingIssue} 
        onClose={() => {
          setEditingIssue(null);
          loadIssues();
        }} 
      />
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-bold mb-2">
            <Newspaper className="w-5 h-5" /> NTA Journal
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Edition Management
          </h1>
          <p className="text-slate-500 mt-2">
            Build, preview, organize, and publish NTA Journal editions.
          </p>
        </div>
        <button 
          onClick={() => handleCreateNew(false)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Create New Edition
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : issues.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <BookOpen className="w-16 h-16 text-indigo-500/50 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">The NTA Journal is ready for its first issue.</h2>
          <p className="text-slate-500 max-w-lg mx-auto mb-8">
            Create Issue No. 1 and begin assembling "Your Business Is an Experience."
          </p>
          <button 
            onClick={() => handleCreateNew(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold mx-auto transition-colors"
          >
            Create Issue No. 1 <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider font-semibold text-slate-500">
                <th className="p-4 pl-6">Issue</th>
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Articles</th>
                <th className="p-4">Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {issues.map(issue => (
                <tr key={issue.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-900 dark:text-white">
                    #{issue.issue_number}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{issue.title}</p>
                    <p className="text-xs text-slate-500 font-mono mt-1">/{issue.slug}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                      issue.status === 'Published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                      issue.status === 'Draft' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">
                    {issue.selected_articles?.length || 0}
                  </td>
                  <td className="p-4 text-slate-500 text-sm">
                    {issue.date || issue.created_date ? new Date(issue.date || issue.created_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleDuplicate(issue)}
                        className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setEditingIssue(issue)}
                        className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                        title="Edit Edition"
                      >
                        <FileEdit className="w-4 h-4" />
                      </button>
                      {issue.status === 'Published' && (
                        <a 
                          href={`/journal/${issue.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                          title="View Live"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}