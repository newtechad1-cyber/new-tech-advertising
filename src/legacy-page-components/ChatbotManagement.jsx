import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatbotForm from '@/components/chatbots/ChatbotForm';
import KnowledgeBasePanel from '@/components/chatbots/KnowledgeBasePanel';
import LeadsPanel from '@/components/chatbots/LeadsPanel';
import EmbedCodePanel from '@/components/chatbots/EmbedCodePanel';
import { Plus, Bot, Settings, BookOpen, Users, Code2, ChevronLeft } from 'lucide-react';

const statusColors = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-slate-100 text-slate-500',
  draft: 'bg-amber-100 text-amber-700',
};

const typeIcons = { sales: '💰', support: '🎧', general: '🤖' };

export default function ChatbotManagement() {
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBot, setEditingBot] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Chatbot.list('-created_date');
    setChatbots(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSaved = (saved) => {
    setShowForm(false);
    setEditingBot(null);
    load();
    if (saved?.id) setSelected(saved);
  };

  const handleDelete = async (bot) => {
    await base44.entities.Chatbot.delete(bot.id);
    if (selected?.id === bot.id) setSelected(null);
    load();
  };

  // Detail view
  if (selected) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> All Chatbots
          </button>

          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-2xl">
                {typeIcons[selected.type]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{selected.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={statusColors[selected.status]}>{selected.status}</Badge>
                  <span className="text-sm text-slate-500">{selected.type} bot</span>
                  {selected.website_url && (
                    <a href={selected.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      {selected.website_url}
                    </a>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setEditingBot(selected); setShowForm(true); }} className="gap-1.5">
              <Settings className="w-3.5 h-3.5" /> Edit Settings
            </Button>
          </div>

          <Tabs defaultValue="knowledge">
            <TabsList className="mb-4">
              <TabsTrigger value="knowledge" className="gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Knowledge Base</TabsTrigger>
              <TabsTrigger value="leads" className="gap-1.5"><Users className="w-3.5 h-3.5" /> Leads</TabsTrigger>
              <TabsTrigger value="embed" className="gap-1.5"><Code2 className="w-3.5 h-3.5" /> Embed Code</TabsTrigger>
            </TabsList>

            <div className="bg-white rounded-xl border p-5">
              <TabsContent value="knowledge">
                <KnowledgeBasePanel chatbot={selected} />
              </TabsContent>
              <TabsContent value="leads">
                <LeadsPanel chatbot={selected} />
              </TabsContent>
              <TabsContent value="embed">
                <EmbedCodePanel chatbot={selected} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {showForm && (
          <ChatbotForm
            chatbot={editingBot}
            open={showForm}
            onClose={() => { setShowForm(false); setEditingBot(null); }}
            onSaved={(saved) => { handleSaved(saved); setSelected(saved); }}
          />
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Chatbots</h1>
            <p className="text-slate-500 mt-1">{chatbots.length} chatbot{chatbots.length !== 1 ? 's' : ''} configured</p>
          </div>
          <Button onClick={() => { setEditingBot(null); setShowForm(true); }} className="gap-2">
            <Plus className="w-4 h-4" /> New Chatbot
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />)}
          </div>
        ) : chatbots.length === 0 ? (
          <div className="text-center py-20">
            <Bot className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No chatbots yet</p>
            <p className="text-slate-400 text-sm mt-1">Create your first chatbot to start capturing leads</p>
            <Button className="mt-4 gap-2" onClick={() => { setEditingBot(null); setShowForm(true); }}>
              <Plus className="w-4 h-4" /> Create Chatbot
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chatbots.map(bot => (
              <div
                key={bot.id}
                className="bg-white border rounded-xl p-5 cursor-pointer hover:shadow-md transition-all hover:border-slate-300"
                onClick={() => setSelected(bot)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: (bot.color_theme || '#2563eb') + '20' }}>
                    {typeIcons[bot.type]}
                  </div>
                  <Badge className={statusColors[bot.status]}>{bot.status}</Badge>
                </div>
                <h3 className="font-semibold text-slate-900">{bot.name}</h3>
                <p className="text-sm text-slate-500 capitalize mt-0.5">{bot.type} bot</p>
                {bot.website_url && (
                  <p className="text-xs text-slate-400 mt-1 truncate">{bot.website_url}</p>
                )}
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="text-xs text-slate-400">Click to manage</span>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: bot.color_theme || '#2563eb' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ChatbotForm
          chatbot={editingBot}
          open={showForm}
          onClose={() => { setShowForm(false); setEditingBot(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}