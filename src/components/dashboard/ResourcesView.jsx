import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlayCircle, FileText, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function ResourcesView() {
  const resources = [
    {
      category: "Getting Started",
      items: [
        { title: "Welcome to New Tech Advertising", type: "video", duration: "5 min" },
        { title: "Setting up your Google Business Profile", type: "video", duration: "12 min" },
        { title: "How to handle new leads", type: "guide", format: "PDF" },
      ]
    },
    {
      category: "Marketing Strategy",
      items: [
        { title: "Understanding Local SEO", type: "video", duration: "15 min" },
        { title: "Responding to Reviews Templates", type: "template", format: "DOCX" },
        { title: "Social Media Best Practices", type: "guide", format: "PDF" },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Client Knowledge Base</h2>
        <p className="opacity-90 mb-6 max-w-2xl">
          Access exclusive training materials, guides, and templates to help you get the most out of your marketing services.
        </p>
        <div className="flex gap-4">
          <Button 
            variant="secondary" 
            className="bg-white text-purple-600 hover:bg-purple-50"
            onClick={() => toast.info('Video tutorials coming soon! Contact rick@newtechadvertising.com for personalized training.')}
          >
            <PlayCircle className="mr-2 h-4 w-4" /> Watch Tutorials
          </Button>
          <Button 
            variant="outline" 
            className="bg-transparent text-white border-white hover:bg-white/10"
            onClick={() => toast.info('Guides coming soon! Contact rick@newtechadvertising.com for support materials.')}
          >
            <FileText className="mr-2 h-4 w-4" /> Read Guides
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {resources.map((section, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{section.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                        {item.type === 'video' ? <PlayCircle className="h-5 w-5 text-blue-600" /> : 
                         item.type === 'template' ? <Download className="h-5 w-5 text-purple-600" /> :
                         <FileText className="h-5 w-5 text-slate-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500 capitalize">{item.type} • {item.duration || item.format}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => toast.info('Resource coming soon! Contact rick@newtechadvertising.com for assistance.')}
                    >
                      {item.type === 'template' ? 'Download' : 'View'} <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}