import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Facebook, Instagram, Loader2, CheckCircle, AlertCircle, ImageIcon, Sparkles } from 'lucide-react';

const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600', textColor: 'text-blue-600', borderColor: 'border-blue-600' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-pink-600', textColor: 'text-pink-600', borderColor: 'border-pink-600' },
];

export default function SocialImagePost({ initialImageUrl = null, onClose }) {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(initialImageUrl || null);
  const [caption, setCaption] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['facebook']);
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState([]);
  const [generatingCaption, setGeneratingCaption] = useState(false);

  useEffect(() => {
    base44.entities.MediaAsset.filter({ asset_type: 'image' }, '-created_date', 20).then(setImages);
  }, []);

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const generateCaption = async () => {
    if (!selectedImage) return;
    setGeneratingCaption(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write an engaging social media caption for a business image. Keep it concise, conversational, and include 3-5 relevant hashtags at the end. No quotation marks, just the caption text.`,
    });
    setCaption(result);
    setGeneratingCaption(false);
  };

  const post = async () => {
    if (!selectedImage || !caption.trim() || selectedPlatforms.length === 0) return;
    setPosting(true);
    setResults([]);

    const outcomes = await Promise.all(
      selectedPlatforms.map(async (platform) => {
        try {
          const res = await base44.functions.invoke('postToMeta', {
            platform,
            message: caption,
            image_url: selectedImage,
          });
          return { platform, success: true, post_id: res.data?.post_id };
        } catch (err) {
          return { platform, success: false, error: err.message };
        }
      })
    );

    setResults(outcomes);
    setPosting(false);
  };

  const allPosted = results.length > 0 && results.every(r => r.success);

  return (
    <div className="space-y-6">
      {/* Platform selection */}
      <div>
        <p className="text-slate-300 text-sm font-medium mb-3">Post to</p>
        <div className="flex gap-3">
          {PLATFORMS.map(p => {
            const Icon = p.icon;
            const active = selectedPlatforms.includes(p.id);
            return (
              <button key={p.id} onClick={() => togglePlatform(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${active ? `${p.color} border-transparent text-white` : `border-slate-600 text-slate-400 hover:${p.borderColor} hover:${p.textColor}`}`}>
                <Icon className="w-4 h-4" />{p.label}
              </button>
            );
          })}
        </div>
        {selectedPlatforms.includes('instagram') && !selectedImage && (
          <p className="text-amber-400 text-xs mt-2">⚠ Instagram requires an image to post</p>
        )}
      </div>

      {/* Image picker */}
      <div>
        <p className="text-slate-300 text-sm font-medium mb-3">Select Image</p>
        {selectedImage && (
          <div className="mb-3 relative inline-block">
            <img src={selectedImage} className="h-32 rounded-lg object-cover border border-slate-600" alt="Selected" />
            <button onClick={() => setSelectedImage(null)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">✕</button>
          </div>
        )}
        {!selectedImage && (
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
            {images.map(img => (
              <button key={img.id} onClick={() => setSelectedImage(img.url)}
                className="rounded-lg overflow-hidden border-2 border-transparent hover:border-pink-500 transition-all">
                <img src={img.url} alt={img.name} className="w-full h-16 object-cover" />
              </button>
            ))}
            {images.length === 0 && (
              <div className="col-span-4 text-slate-500 text-sm py-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />No images in library. Generate or upload one first.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Caption */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-slate-300 text-sm font-medium">Caption</p>
          <Button size="sm" variant="ghost" onClick={generateCaption} disabled={generatingCaption}
            className="text-pink-400 hover:text-pink-300 text-xs h-7">
            {generatingCaption ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
            AI Caption
          </Button>
        </div>
        <Textarea
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="Write your caption or let AI generate one..."
          className="bg-slate-800 border-slate-700 text-white resize-none h-28"
        />
        <p className="text-slate-500 text-xs mt-1 text-right">{caption.length} chars</p>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map(r => (
            <div key={r.platform} className={`flex items-center gap-3 p-3 rounded-lg ${r.success ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
              {r.success ? <CheckCircle className="w-4 h-4 text-green-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
              <span className="text-sm text-white capitalize">{r.platform}: {r.success ? `Posted successfully!` : r.error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Post button */}
      {!allPosted && (
        <Button onClick={post} disabled={posting || !caption.trim() || selectedPlatforms.length === 0 || (!selectedImage && selectedPlatforms.includes('instagram'))}
          className="w-full bg-pink-600 hover:bg-pink-700">
          {posting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Posting...</> : `Post to ${selectedPlatforms.length > 1 ? 'All Selected' : selectedPlatforms[0] || 'Platform'}`}
        </Button>
      )}
      {allPosted && (
        <Button onClick={() => { setResults([]); setCaption(''); setSelectedImage(null); }} className="w-full bg-slate-700 hover:bg-slate-600">
          Post Another
        </Button>
      )}
    </div>
  );
}