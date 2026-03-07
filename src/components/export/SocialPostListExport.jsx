import React, { useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import ExportPostsButton from './ExportPostsButton';

export default function SocialPostListExport({ posts, businessProfileId }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const togglePost = (postId) => {
    setSelectedIds(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === posts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(posts.map(p => p.id));
    }
  };

  const allSelected = selectedIds.length === posts.length && posts.length > 0;
  const someSelected = selectedIds.length > 0 && selectedIds.length < posts.length;

  return (
    <div className="space-y-4">
      {/* Selection toolbar */}
      {posts.length > 0 && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              {allSelected ? (
                <CheckCircle className="w-5 h-5 text-violet-400" />
              ) : someSelected ? (
                <div className="w-5 h-5 rounded border-2 border-violet-400 bg-violet-400/20" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">
                {selectedIds.length > 0
                  ? `${selectedIds.length} selected`
                  : 'Select all'}
              </span>
            </button>
          </div>

          {selectedIds.length > 0 && (
            <ExportPostsButton
              postIds={selectedIds}
              businessProfileId={businessProfileId}
              exportType="selected_posts"
            />
          )}
        </div>
      )}

      {/* Posts list */}
      <div className="space-y-2">
        {posts.map(post => (
          <div
            key={post.id}
            className="bg-slate-900 border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-slate-600 transition-colors"
            onClick={() => togglePost(post.id)}
          >
            <div className="flex items-start gap-4">
              {selectedIds.includes(post.id) ? (
                <CheckCircle className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-white font-semibold">{post.title}</p>
                    <p className="text-slate-400 text-xs">
                      {post.platform} • {post.post_type}
                    </p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm line-clamp-2">{post.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}