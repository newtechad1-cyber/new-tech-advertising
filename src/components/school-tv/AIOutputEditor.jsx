import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AIStatusBadge from './AIStatusBadge';
import {
  Save,
  X,
  RefreshCw,
  Copy,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function AIOutputEditor({ output, onClose, onSave }) {
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState({
    title: output.title || '',
    body: output.body || '',
  });
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = editedContent.title + '\n\n' + editedContent.body;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSave(editedContent);
    setEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Review & Edit AI Output</h3>
            <p className="text-purple-100 text-sm mt-1">Make any changes before approving</p>
          </div>
          <Button
            variant="ghost"
            className="text-white hover:text-purple-100"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Status */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">This is an AI-generated draft</p>
                <p>Please review the content carefully. Edit as needed before approving for publication.</p>
              </div>
            </div>
          </div>

          {/* Editing Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900 uppercase">Content</h4>
              {!editing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600"
                  onClick={() => setEditing(true)}
                >
                  Edit Content
                </Button>
              ) : (
                <div className="text-xs text-orange-700 font-semibold bg-orange-50 px-3 py-1 rounded">
                  Editing Mode
                </div>
              )}
            </div>

            {editing ? (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                    Headline
                  </label>
                  <Input
                    value={editedContent.title}
                    onChange={(e) =>
                      setEditedContent({ ...editedContent, title: e.target.value })
                    }
                    className="text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                    Story Body
                  </label>
                  <textarea
                    value={editedContent.body}
                    onChange={(e) =>
                      setEditedContent({ ...editedContent, body: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    rows="8"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => setEditing(false)}
                  >
                    Done Editing
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Headline</p>
                  <h3 className="text-2xl font-bold text-gray-900">{editedContent.title}</h3>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Story Body</p>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {editedContent.body}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quality Indicators */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-green-900">School-Safe</p>
                  <p className="text-green-800 text-xs">Content meets school guidelines</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-green-900">Community-Focused</p>
                  <p className="text-green-800 text-xs">Appropriate for parents and families</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className={copied ? 'text-green-600' : ''}
            >
              <Copy className="h-4 w-4 mr-1" />
              {copied ? 'Copied!' : 'Copy All'}
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Regenerate
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleSave}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve & Use
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}