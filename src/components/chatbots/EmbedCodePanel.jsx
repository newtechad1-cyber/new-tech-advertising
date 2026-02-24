import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

export default function EmbedCodePanel({ chatbot }) {
  const [copied, setCopied] = useState(false);

  // Build the embed URL — points to the chatbot widget page
  const baseUrl = window.location.origin;
  const embedCode = `<!-- ${chatbot.name} Chatbot Widget -->
<script>
  (function() {
    var s = document.createElement('script');
    s.src = '${baseUrl}/chatbot-widget.js';
    s.setAttribute('data-chatbot-id', '${chatbot.id}');
    s.setAttribute('data-color', '${chatbot.color_theme || '#2563eb'}');
    s.defer = true;
    document.head.appendChild(s);
  })();
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Paste this snippet before the <code className="text-xs bg-slate-100 px-1 rounded">&lt;/body&gt;</code> tag on any page.</p>
        <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5">
          {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <pre className="bg-slate-900 text-green-400 text-xs rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">{embedCode}</pre>
    </div>
  );
}