import React from 'react';
import { Facebook, Globe, Instagram, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChannelHealthSnapshot({ clientProfile }) {
  const navigate = useNavigate();

  const channels = [
    {
      id: 1,
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      status: 'connected',
      account: 'Business Page',
    },
    {
      id: 2,
      name: 'Google Business',
      icon: <Globe className="w-5 h-5" />,
      status: 'connected',
      account: 'Active',
    },
    {
      id: 3,
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      status: clientProfile?.reconnect_required ? 'error' : 'connected',
      account: clientProfile?.reconnect_required ? 'Reconnect needed' : 'Connected',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Channel Status</h2>
        <button
          onClick={() => navigate('/client/channels')}
          className="text-slate-600 hover:text-slate-900 text-sm font-medium flex items-center gap-2"
        >
          Manage Channels
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <div key={channel.id} className="bg-white rounded-lg border border-slate-200 p-5 hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  channel.status === 'connected' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {channel.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{channel.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{channel.account}</p>
                </div>
              </div>
              {channel.status === 'connected' ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            {channel.status === 'error' && (
              <button className="w-full bg-red-50 text-red-700 px-3 py-2 rounded text-sm font-medium hover:bg-red-100 transition-colors">
                Fix Connection
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}