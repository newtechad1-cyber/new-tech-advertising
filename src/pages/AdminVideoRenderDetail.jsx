import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { ArrowLeft, RotateCcw, Copy, CheckCircle2, AlertCircle, Play } from 'lucide-react';

const STATUS_COLORS = {
  queued: 'bg-gray-100 text-gray-800',
  preparing: 'bg-blue-100 text-blue-800',
  processing: 'bg-blue-100 text-blue-800',
  rendering: 'bg-cyan-100 text-cyan-800',
  post_processing: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-200 text-gray-700',
};

export default function AdminVideoRenderDetail() {
  const { schoolSlug, renderJobId } = useParams();
  const [job, setJob] = useState(null);
  const [project, setProject] = useState(null);
  const [inputManifest, setInputManifest] = useState([]);
  const [outputManifest, setOutputManifest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const jobData = await base44.entities.VideoRenderJobs.filter({
          id: renderJobId,
        });

        if (jobData.length > 0) {
          const renderJob = jobData[0];
          setJob(renderJob);

          if (renderJob.project_id) {
            const projectData = await base44.entities.VideoProjects.filter({
              id: renderJob.project_id,
            });
            if (projectData.length > 0) {
              setProject(projectData[0]);
            }
          }

          if (renderJob.input_manifest) {
            try {
              setInputManifest(JSON.parse(renderJob.input_manifest));
            } catch (e) {
              setInputManifest([]);
            }
          }

          if (renderJob.output_manifest) {
            try {
              setOutputManifest(JSON.parse(renderJob.output_manifest));
            } catch (e) {
              setOutputManifest(null);
            }
          }
        }
      } catch (error) {
        console.error('Error loading render job:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [renderJobId]);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await base44.entities.VideoRenderJobs.update(renderJobId, {
        status: 'queued',
        retry_count: (job.retry_count || 0) + 1,
        last_retry_at: new Date().toISOString(),
        progress_percent: 0,
      });
      setJob({
        ...job,
        status: 'queued',
        retry_count: (job.retry_count || 0) + 1,
        progress_percent: 0,
      });
      alert('Render job queued for retry');
    } catch (error) {
      console.error('Error retrying render job:', error);
      alert('Failed to retry job');
    } finally {
      setRetrying(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;
  if (!job) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Render job not found</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <Link to={`/admin/schools/${schoolSlug}/render-queue`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2 font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to Render Queue
      </Link>

      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{job.render_name}</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[job.status] || 'bg-gray-100'}`}>
              {job.status.replace(/_/g, ' ')}
            </span>
            {project && <span>{project.title}</span>}
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-orange-600">{job.progress_percent}%</p>
          <p className="text-sm text-gray-600">Progress</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${job.progress_percent}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Summary */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Job Summary</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Render Engine</p>
                <p className="font-semibold text-gray-900 capitalize">{job.render_engine}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Output Format</p>
                <p className="font-semibold text-gray-900">{job.output_format}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Resolution</p>
                <p className="font-semibold text-gray-900">{job.resolution}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Aspect Ratio</p>
                <p className="font-semibold text-gray-900">{job.aspect_ratio}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Est. Duration</p>
                <p className="font-semibold text-gray-900">{job.estimated_duration}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Queue Position</p>
                <p className="font-semibold text-gray-900">#{job.queue_position + 1}</p>
              </div>
            </div>
          </div>

          {/* Render Plan */}
          {job.render_plan_snapshot && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Render Plan</h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto text-gray-700 max-h-48 overflow-y-auto">
                {JSON.stringify(JSON.parse(job.render_plan_snapshot), null, 2)}
              </pre>
            </div>
          )}

          {/* Input Manifest */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Input Assets ({inputManifest.length})</h3>
            {inputManifest.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {inputManifest.map((asset, idx) => (
                  <div key={idx} className="flex items-start justify-between p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">{asset.name || `Asset ${idx + 1}`}</p>
                      <p className="text-xs text-gray-600">{asset.type} • {asset.duration || 'N/A'}</p>
                    </div>
                    <p className="text-xs text-gray-600">{asset.size || 'Unknown'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No input assets logged</p>
            )}
          </div>

          {/* Output Manifest */}
          {outputManifest && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Output Manifest</h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto text-gray-700 max-h-48 overflow-y-auto">
                {JSON.stringify(outputManifest, null, 2)}
              </pre>
            </div>
          )}

          {/* Error Log */}
          {job.status === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> Failure Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-red-900 mb-1">Failure Stage</p>
                  <p className="font-semibold text-red-800">{job.failure_stage}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-900 mb-1">Error Message</p>
                  <p className="text-sm text-red-800 bg-white p-3 rounded border border-red-200">{job.error_message}</p>
                </div>
                {job.error_log && (
                  <div>
                    <p className="text-xs font-semibold text-red-900 mb-1">Full Error Log</p>
                    <pre className="text-xs bg-white p-3 rounded border border-red-200 overflow-x-auto max-h-40 overflow-y-auto text-red-800">
                      {job.error_log}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Timeline</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Created</p>
                <p className="text-sm text-gray-900">{new Date(job.created_date).toLocaleString()}</p>
              </div>
              {job.render_start && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Started</p>
                  <p className="text-sm text-gray-900">{new Date(job.render_start).toLocaleString()}</p>
                </div>
              )}
              {job.render_end && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Completed</p>
                  <p className="text-sm text-gray-900">{new Date(job.render_end).toLocaleString()}</p>
                </div>
              )}
              {job.last_retry_at && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Last Retry</p>
                  <p className="text-sm text-gray-900">{new Date(job.last_retry_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Output Links */}
          {job.status === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Output Files
              </h3>
              <div className="space-y-2">
                {job.output_url && (
                  <div className="flex gap-2">
                    <a
                      href={job.output_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <Play className="h-3 w-3" /> View Video
                    </a>
                    <button
                      onClick={() => copyToClipboard(job.output_url)}
                      className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded text-xs font-semibold"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {job.thumbnail_url && (
                  <div className="text-xs text-green-700 bg-white p-2 rounded border border-green-200">
                    <p className="font-semibold mb-1">Thumbnail</p>
                    <p className="break-all text-green-600 cursor-pointer hover:underline" onClick={() => copyToClipboard(job.thumbnail_url)}>
                      Copy URL
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            {job.status === 'failed' && job.retry_count < job.max_retries && (
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-4 w-4" /> {retrying ? 'Retrying...' : 'Retry Render'}
              </button>
            )}
            {job.max_retries && job.retry_count >= job.max_retries && job.status === 'failed' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-900">Max retries reached ({job.max_retries})</p>
              </div>
            )}
            {project && (
              <Link
                to={`/admin/schools/${schoolSlug}/projects/${project.id}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm text-center"
              >
                Open Project
              </Link>
            )}
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm">
              Mark Reviewed
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}