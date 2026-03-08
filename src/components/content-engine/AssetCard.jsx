import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function AssetCard({ title, icon: IconComponent, content, badgeLabel, badgeColor = 'bg-blue-100 text-blue-700' }) {
  const Icon = IconComponent;
  const [expanded, setExpanded] = useState(false);

  if (!content) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(typeof content === 'string' ? content : JSON.stringify(content, null, 2));
    toast.success('Copied to clipboard!');
  };

  const displayContent = typeof content === 'string' ? content : JSON.stringify(JSON.parse(content), null, 2);

  return (
    <Card className="border border-slate-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-left flex-1"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Icon className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">{title}</CardTitle>
              {badgeLabel && <Badge className={`text-xs mt-0.5 ${badgeColor}`}>{badgeLabel}</Badge>}
            </div>
            {expanded ? <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" /> : <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />}
          </button>
          <Button size="sm" variant="ghost" onClick={copyToClipboard} className="ml-2 shrink-0">
            <Copy className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent>
          <pre className="text-xs text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-lg p-4 max-h-80 overflow-y-auto font-sans leading-relaxed">
            {displayContent}
          </pre>
        </CardContent>
      )}
    </Card>
  );
}