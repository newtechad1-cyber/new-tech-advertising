import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Zap, Edit, CheckCircle, Loader2, Video, Send, Trash2 } from 'lucide-react';
import AgencyLayout from '../components/agency/AgencyLayout';
import CopyButton from '../components/video-engine/CopyButton';
import SendToLeadModal from '../components/video-engine/SendToLeadModal';
import VideoAssetFormModal from '../components/video-engine/VideoAssetFormModal';

const TABS = ['Overview', 'Script', 'Scenes', 'Generated Content', 'Usage'];

export default function VideoEngineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [generating, setGenerating] = useState(false);
  const [showSendModal, setSendModal] = useState(false);
  const [sendMessage, setSendMessage] = useState('');
  const [showEdit, setShowEdit] = useState(false);

  const load = async () => {
    const data = await base44.entities.VideoAsset.filter({ id });
    setAsset(data[0] || null);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const generateContent = async () => {
    if (!asset) return;
    setGenerating(true);
    const res = await base44.functions.invoke('generateVideoContent', {
      assetId: asset.id,
      title: asset.title,
      topic: asset.topic,
      script: asset.script,
      hook: asset.hook,
      cta: asset.cta,
      targetAudience: asset.target_audience,
      videoType: asset.video_type,
    });
    setGenerating(false);
    if (res.data?.success) {
      setAsset(prev => ({ ...prev, ...res.data.content, content_generated: true, status: 'Ready' }));
      setActiveTab('Generated Content');
    }
  };

  const markUsed = async () => {
    const today = new Date().toISOString().split('T')[0];
    await base44.entities.VideoAsset.update(asset.id, {
      status: 'Used',
      times_used: (asset.times_used || 0) + 1,
      last_used_date: today,
    });
    setAsset(prev => ({ ...prev, status: 'Used', times_used: (prev.times_used || 0) + 1, last_used_date: today }));
  };

  const deleteAsset = async () => {
    if (!confirm('Delete this video asset?')) return;
    await base44.entities.VideoAsset.delete(asset.id);
    navigate('/agency/video-engine');
  };

  if (loading) return <AgencyLayout><div className="p-8 text-slate-500 text-sm">Loading...</div></AgencyLayout>;
  if (!asset) return <AgencyLayout><div className="p-8 text-slate-500 text-sm">Asset not found.</div></AgencyLayout>;

  const platforms = (asset.platform_tags || '').split(',').map(p => p.trim()).filter(Boolean);

  return (
    <AgencyLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-start gap-3 flex-wrap">
          <button onClick={() => navigate('/agency/video-engine')}
            className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg mt-0.5">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white">{asset.title}</h1>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                asset.status === 'Ready' ? 'bg-emerald-900/50 text-emerald-300' :
                asset.status === 'Used' ? 'bg-slate-700 text-slate-500' :
                'bg-slate-700 text-slate-400'
              }`}>{asset.status}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-300">{asset.video_type}</span>
            </div>
            {asset.topic && <p className="text-sm text-slate-500 mt-0.5">{asset.topic}</p>}
            {platforms.length > 0 && (
              <div className="flex gap-1.5 mt-1 flex-wrap">
                {platforms.map(p => <span key={p} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{p}</span>)}
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0 flex-wrap">
            <button onClick={() => setShowEdit(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg">
              <Edit className="w-3.5 h-3.5" /> Edit
            </button>
            {asset.status !== 'Used' && (
              <button onClick={markUsed}
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5" /> Mark Used
              </button>
            )}
            <button onClick={deleteAsset}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 px-3 py-2 rounded-lg">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Generate Content CTA */}
        {!asset.content_generated && (
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-amber-300">Generate Supporting Content</p>
              <p className="text-xs text-amber-600 mt-0.5">AI will create Facebook post, LinkedIn post, outreach message, follow-up, email version, and short caption.</p>
            </div>
            <button onClick={generateContent} disabled={generating}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-sm px-4 py-2.5 rounded-xl flex-shrink-0 transition-colors">
              {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Zap className="w-4 h-4" /> Generate Content</>}
            </button>
          </div>
        )}

        {asset.content_generated && (
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 flex items-center justify-between gap-3">
            <p className="text-xs text-emerald-400 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Supporting content is ready</p>
            <button onClick={generateContent} disabled={generating}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-white bg-emerald-900/30 hover:bg-emerald-900/50 px-3 py-1.5 rounded-lg">
              {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
              Regenerate
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-slate-800">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-white'
                }`}>{tab}</button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'Overview' && (
          <div className="space-y-4">
            <InfoGrid asset={asset} />
            {asset.hook && <Section title="Hook">{asset.hook}</Section>}
            {asset.cta && <Section title="Call to Action">{asset.cta}</Section>}
            {/* Quick copy bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Copy</p>
              <div className="flex flex-wrap gap-2">
                <CopyButton text={asset.script} label="Copy Script" />
                <CopyButton text={asset.outreach_message} label="Outreach Message" />
                <CopyButton text={asset.followup_message} label="Follow-Up" />
                <CopyButton text={asset.facebook_post} label="Facebook Post" />
                <CopyButton text={asset.linkedin_post} label="LinkedIn Post" />
                <CopyButton text={asset.email_version} label="Email Version" />
              </div>
            </div>
            {/* Send to lead */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Send</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setSendMessage(asset.outreach_message || ''); setSendModal(true); }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 px-3 py-1.5 rounded-lg">
                  <Send className="w-3 h-3" /> Send to Lead
                </button>
                <button onClick={() => { setSendMessage(asset.followup_message || ''); setSendModal(true); }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg">
                  <Send className="w-3 h-3" /> Send Follow-Up
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Script' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">{asset.duration_seconds}s video</p>
              <CopyButton text={asset.script} label="Copy Script" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              {asset.hook && (
                <div className="mb-4 pb-4 border-b border-slate-800">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Hook</p>
                  <p className="text-sm text-white font-medium italic">"{asset.hook}"</p>
                </div>
              )}
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{asset.script || 'No script added yet.'}</p>
              {asset.cta && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">CTA</p>
                  <p className="text-sm text-emerald-300">{asset.cta}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Scenes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">Scene breakdown for filming</p>
              <CopyButton text={[asset.scene_breakdown, asset.text_overlays, asset.visual_suggestions].filter(Boolean).join('\n\n')} label="Copy All" />
            </div>
            {asset.scene_breakdown && (
              <ContentBlock title="Scene Breakdown" text={asset.scene_breakdown} />
            )}
            {asset.text_overlays && (
              <ContentBlock title="Text Overlays" text={asset.text_overlays} />
            )}
            {asset.visual_suggestions && (
              <ContentBlock title="Visual Suggestions" text={asset.visual_suggestions} />
            )}
          </div>
        )}

        {activeTab === 'Generated Content' && (
          <div className="space-y-4">
            {!asset.content_generated ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                <Zap className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <p className="text-slate-400 font-semibold text-sm mb-1">No content generated yet</p>
                <p className="text-slate-600 text-xs mb-4">Click "Generate Content" above to create posts, messages, and more.</p>
              </div>
            ) : (
              <>
                <GeneratedBlock title="Facebook Post" text={asset.facebook_post} />
                <GeneratedBlock title="LinkedIn Post" text={asset.linkedin_post} />
                <GeneratedBlock title="Short Caption" text={asset.short_caption} small />
                <GeneratedBlock title="Outreach Message" text={asset.outreach_message} onSend={() => { setSendMessage(asset.outreach_message); setSendModal(true); }} />
                <GeneratedBlock title="Follow-Up Message" text={asset.followup_message} onSend={() => { setSendMessage(asset.followup_message); setSendModal(true); }} />
                <GeneratedBlock title="Email Version" text={asset.email_version} />
              </>
            )}
          </div>
        )}

        {activeTab === 'Usage' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Times Used" value={asset.times_used || 0} />
              <Stat label="Status" value={asset.status} />
              <Stat label="Last Used" value={asset.last_used_date || '—'} />
            </div>
            {asset.target_audience && (
              <Section title="Target Audience">{asset.target_audience}</Section>
            )}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Actions</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={markUsed} disabled={asset.status === 'Used'}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 disabled:opacity-40 px-3 py-2 rounded-lg">
                  <CheckCircle className="w-3.5 h-3.5" /> Mark as Used
                </button>
                <button onClick={() => { setSendMessage(asset.outreach_message || ''); setSendModal(true); }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 px-3 py-2 rounded-lg">
                  <Send className="w-3.5 h-3.5" /> Send to Lead
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showSendModal && (
        <SendToLeadModal
          asset={asset}
          messageText={sendMessage}
          onClose={() => setSendModal(false)}
        />
      )}

      {showEdit && (
        <VideoAssetFormModal
          asset={asset}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => { setAsset(updated); setShowEdit(false); }}
        />
      )}
    </AgencyLayout>
  );
}

function InfoGrid({ asset }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: 'Type', value: asset.video_type },
        { label: 'Duration', value: asset.duration_seconds ? `${asset.duration_seconds}s` : '—' },
        { label: 'Status', value: asset.status },
        { label: 'Times Used', value: asset.times_used || 0 },
      ].map(s => (
        <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
          <p className="text-sm font-bold text-white">{s.value}</p>
          <p className="text-xs text-slate-600 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
      <p className="text-sm text-slate-300">{children}</p>
    </div>
  );
}

function ContentBlock({ title, text }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <CopyButton text={text} label="Copy" />
      </div>
      <p className="text-sm text-slate-300 whitespace-pre-wrap">{text}</p>
    </div>
  );
}

function GeneratedBlock({ title, text, small, onSend }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">{title}</p>
        <div className="flex gap-2">
          {onSend && (
            <button onClick={onSend}
              className="flex items-center gap-1 text-xs font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 px-2.5 py-1 rounded-lg">
              <Send className="w-3 h-3" /> Send to Lead
            </button>
          )}
          <CopyButton text={text} label="Copy" />
        </div>
      </div>
      <p className={`text-slate-300 whitespace-pre-wrap ${small ? 'text-sm font-semibold' : 'text-sm'}`}>{text || '—'}</p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
      <p className="text-lg font-black text-white">{value}</p>
      <p className="text-xs text-slate-600 mt-0.5">{label}</p>
    </div>
  );
}