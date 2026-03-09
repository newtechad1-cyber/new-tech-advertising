import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams } from 'react-router-dom';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCw, Eye, AlertCircle } from 'lucide-react';

export default function AdminVideoRenderQueue() {
  const { schoolSlug } = useParams();
  const [renders, setRenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRender, setSelectedRender] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.SchoolVideoRenderJobs.filter({
          status: { $ne: 'completed' },
        });
        setRenders(data);
      } catch (error) {
        console.error('Error loading renders:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleRetry = async (renderId) => {
    await base44.entities.SchoolVideoRenderJobs.update(renderId, {
      status: 'queued',
      retry_count: (renders.find(r => r.id === renderId)?.retry_count || 0) + 1,
    });
    setRenders(renders.map(r => r.id === renderId ? { ...r, status: 'queued' } : r));
  };

  const statusColors = {
    queued: 'bg-gray-100 text-gray-800',
    processing: 'bg-blue-100 text-blue-800',
    rendering: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SchoolAdminNav />

      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 p-6">
          <h1 className="text-3xl font-bold text-gray-900">Render Queue</h1>
          <p className="text-gray-600 mt-1">{renders.length} jobs in queue</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-4">
            {renders.map((render) => (
              <div key={render.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">{render.render_name}</h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[render.status]}`}>
                        {render.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Queue position: #{render.queue_position}</p>
                    {render.retry_count > 0 && (
                      <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Retry #{render.retry_count}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedRender(render)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {render.status === 'failed' && (
                      <Button variant="outline" size="sm" onClick={() => handleRetry(render.id)}>
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress */}
                {render.status === 'rendering' && (
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedRender && (
        <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
          <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Render Details</h2>
            <button onClick={() => setSelectedRender(null)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-6">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Name</p>
              <p className="text-gray-900 font-medium">{selectedRender.render_name}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Status</p>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[selectedRender.status]}`}>
                {selectedRender.status}
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Output Format</p>
              <p className="text-gray-900">{selectedRender.output_format} • {selectedRender.resolution}</p>
            </div>

            {selectedRender.error_log && (
              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
                <p className="text-xs text-red-900 font-semibold uppercase mb-2">Error Log</p>
                <p className="text-sm text-red-900 font-mono whitespace-pre-wrap">{selectedRender.error_log}</p>
              </div>
            )}

            {selectedRender.output_url && (
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Download Output
              </Button>
            )}
          </div>

          <div className="bg-gray-50 border-t border-gray-200 p-6 space-y-3">
            {selectedRender.status === 'failed' && (
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={() => {
                  handleRetry(selectedRender.id);
                  setSelectedRender(null);
                }}
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Retry Render
              </Button>
            )}
            <Button variant="outline" className="w-full">
              Open Project
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}