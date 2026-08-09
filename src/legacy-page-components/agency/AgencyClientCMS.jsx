import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../../components/agency/AgencyLayout';
import { 
  FolderOpen, Plus, Filter, Search, MoreHorizontal, CheckCircle2, 
  Clock, AlertCircle, FileImage, FileText, Video, LayoutDashboard,
  ExternalLink, Download, Share2, UploadCloud, ChevronLeft, Calendar, X
} from 'lucide-react';
import { format } from 'date-fns';

const ASSET_TYPES = [
  "Business Profile", "Logo", "Brand Color", "Photo/Image", "Video", 
  "AI Content", "Website Page", "Social Post", "Learning Asset", 
  "Signed Document", "Proposal", "Approval", "Note", "Service Delivery Checklist", "Other"
];

const STATUSES = [
  "Draft", "Needs Review", "Approved", "Exported", "Delivered", "Scheduled", "Published", "Archived"
];

const PLATFORMS = [
  "Facebook", "Instagram", "LinkedIn", "TikTok", "YouTube", "Website", "Email", "Portal", "None", "Other"
];

export default function AgencyClientCMS() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [assets, setAssets] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [filterCampaign, setFilterCampaign] = useState('All');
  const [search, setSearch] = useState('');

  // Modals
  const [createModal, setCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    asset_name: '',
    asset_type: 'Photo/Image',
    status: 'Draft',
    platform: 'None',
    campaign_id: '',
    content_text: '',
    file_url: '',
    notes: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        const c = await base44.entities.Client.get(id).catch(async () => await base44.entities.Clients.get(id));
        setClient(c);
        
        const [assetData, camps] = await Promise.all([
          base44.entities.ClientAsset.filter({ client_id: id }),
          base44.entities.Campaign.filter({ client_id: id })
        ]);
        setAssets(assetData || []);
        setCampaigns(camps || []);
      } catch (e) {
        console.error("Failed to load CMS data", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.asset_name) return;
    setSubmitting(true);
    try {
      const newAsset = await base44.entities.ClientAsset.create({
        ...formData,
        client_id: id,
        business_name: client?.business_name || '',
        date_created: new Date().toISOString()
      });
      setAssets([newAsset, ...assets]);
      setCreateModal(false);
      setFormData({
        asset_name: '', asset_type: 'Photo/Image', status: 'Draft', 
        platform: 'None', campaign_id: '', content_text: '', file_url: '', notes: ''
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = async (assetId) => {
    // Manual export to Content360 placeholder action
    try {
      await base44.entities.ClientAsset.update(assetId, { status: 'Exported' });
      setAssets(assets.map(a => a.id === assetId ? { ...a, status: 'Exported' } : a));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <AgencyLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </AgencyLayout>
    );
  }

  const filteredAssets = assets.filter(a => {
    if (filterType !== 'All' && a.asset_type !== filterType) return false;
    if (filterStatus !== 'All' && a.status !== filterStatus) return false;
    if (filterPlatform !== 'All' && a.platform !== filterPlatform) return false;
    if (filterCampaign !== 'All' && a.campaign_id !== filterCampaign) return false;
    if (search && !a.asset_name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Needs Review': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Exported': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Delivered': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Published': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Scheduled': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Archived': return 'bg-slate-800 text-slate-400 border-slate-700';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getAssetIcon = (type) => {
    if (type?.includes('Video')) return <Video className="w-5 h-5" />;
    if (type?.includes('Photo') || type?.includes('Logo')) return <FileImage className="w-5 h-5" />;
    if (type?.includes('Document') || type?.includes('Proposal')) return <FileText className="w-5 h-5" />;
    return <FolderOpen className="w-5 h-5" />;
  };

  return (
    <AgencyLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to={`/agency/clients/${id}`} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white leading-tight">Asset Library & CMS</h1>
              <p className="text-sm text-slate-400 mt-0.5">{client?.business_name || 'Client'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
            >
              <Plus className="w-4 h-4" /> Add Asset
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Assets', value: assets.length, icon: FolderOpen },
            { label: 'Needs Review', value: assets.filter(a => a.status === 'Needs Review').length, icon: AlertCircle, color: 'text-amber-400' },
            { label: 'Approved', value: assets.filter(a => a.status === 'Approved').length, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Exported', value: assets.filter(a => a.status === 'Exported').length, icon: UploadCloud, color: 'text-blue-400' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color || 'text-white'}`}>{stat.value}</p>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl">
                <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-400'}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search assets..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0">
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 focus:border-blue-500 outline-none">
                <option value="All">All Types</option>
                {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 focus:border-blue-500 outline-none">
                <option value="All">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 focus:border-blue-500 outline-none">
                <option value="All">All Platforms</option>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Asset List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Asset Name</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Platform</th>
                  <th className="px-6 py-4 font-semibold">Date Created</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      <FolderOpen className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                      <p>No assets found matching your criteria.</p>
                    </td>
                  </tr>
                ) : filteredAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                          {getAssetIcon(asset.asset_type)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{asset.asset_name}</p>
                          {asset.content_text && <p className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">{asset.content_text}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{asset.asset_type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{asset.platform !== 'None' ? asset.platform : '—'}</td>
                    <td className="px-6 py-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {asset.date_created ? format(new Date(asset.date_created), 'MMM d, yyyy') : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {asset.file_url && (
                          <a href={asset.file_url} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="View File">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button 
                          onClick={() => handleExport(asset.id)}
                          disabled={asset.status === 'Exported' || asset.status === 'Published'}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-medium rounded-lg transition-colors"
                          title="Manual Export to Content360"
                        >
                          <UploadCloud className="w-3.5 h-3.5" /> Export
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Create Modal */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Add New Asset</h3>
              <button onClick={() => setCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Asset Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.asset_name}
                  onChange={e => setFormData({...formData, asset_name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Spring Promo Image"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
                  <select 
                    value={formData.asset_type}
                    onChange={e => setFormData({...formData, asset_type: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Platform</label>
                  <select 
                    value={formData.platform}
                    onChange={e => setFormData({...formData, platform: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Campaign ID (Optional)</label>
                  <select 
                    value={formData.campaign_id}
                    onChange={e => setFormData({...formData, campaign_id: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">None</option>
                    {campaigns.map(c => <option key={c.id} value={c.id}>{c.campaign_name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">File URL (Optional)</label>
                <input 
                  type="url" 
                  value={formData.file_url}
                  onChange={e => setFormData({...formData, file_url: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Content Text (Optional)</label>
                <textarea 
                  value={formData.content_text}
                  onChange={e => setFormData({...formData, content_text: e.target.value})}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Post copy, article text, etc..."
                />
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button type="button" onClick={() => setCreateModal(false)} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
                  {submitting ? 'Creating...' : 'Create Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AgencyLayout>
  );
}