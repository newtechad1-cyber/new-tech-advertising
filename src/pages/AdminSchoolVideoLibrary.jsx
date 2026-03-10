import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Search, Grid, List, Film, ExternalLink, AlertCircle,
  CheckCircle, Clock, Loader2, ChevronDown, Youtube, Globe
} from 'lucide-react';

// ── helpers ────────────────────────────────────────────────────────────────

const PROJECT_TYPE_LABELS = {
  weekly_recap:       'Weekly Recap',
  sports_highlight:   'Sports Highlight',
  classroom_spotlight:'Classroom Spotlight',
  student_story:      'Student Story',
  club_feature:       'Club Feature',
  arts_feature:       'Arts Feature',
  event_recap:        'Event Recap',
  district_message:   'District Message',
  recruitment_video:  'Recruitment Video',
  community_pride:    'Community Pride',
  custom:             'Custom',
};

const DESTINATION_ICONS = {
  gallery:          <Globe className="h-3 w-3" />,
  youtube:          <Youtube className="h-3 w-3" />,
  facebook:         <span className="text-xs font-bold">f</span>,
  instagram:        <span className="text-xs font-bold">ig</span>,
  website_download: <Globe className="h-3 w-3" />,
};

// Derive a single "library status" used for tab filtering
function libraryStatus(project, latestRender) {
  if (project.status === 'published' || project.publish_status === 'published') return 'published';
  if (project.status === 'failed' || latestRender?.status === 'failed') return 'failed';
  if (latestRender?.status === 'completed' || ['review_ready', 'approved'].includes(project.status)) return 'rendered';
  return 'draft';
}

const STATUS_STYLES = {
  draft:     'bg-gray-100 text-gray-700',
  rendered:  'bg-blue-100 text-blue-700',
  published: 'bg-green-100 text-green-700',
  failed:    'bg-red-100 text-red-700',
};

const RENDER_STATUS_STYLES = {
  completed: 'text-green-700',
  failed:    'text-red-600',
  rendering: 'text-blue-600',
  queued:    'text-gray-500',
  preparing: 'text-yellow-600',
  processing:'text-yellow-600',
  cancelled: 'text-gray-400',
};

// ── component ───────────────────────────────────────────────────────────────

export default function AdminSchoolVideoLibrary() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';

  const [projects, setProjects]         = useState([]);
  const [renders, setRenders]           = useState([]);
  const [publishingJobs, setPublishing] = useState([]);
  const [loading, setLoading]           = useState(true);

  const [viewMode, setViewMode]   = useState('grid');
  const [search, setSearch]       = useState('');
  const [statusTab, setStatusTab] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy]       = useState('newest');

  // ── Load data ────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Fetch projects first, then scope renders + publishing to matching project IDs
        const projs = await base44.entities.SchoolVideoProjects.filter({ school: schoolSlug }, '-created_date');
        const projectIds = (projs || []).map(p => p.id);

        const [rens, pubs] = projectIds.length > 0
          ? await Promise.all([
              base44.entities.SchoolVideoRenders.filter({ school_slug: schoolSlug }, '-created_date', 1000),
              base44.entities.SchoolVideoPublishing.filter({ project_id: { $in: projectIds } }, '-created_date', 1000),
            ])
          : [[], []];

        setProjects(projs || []);
        // Keep only renders that belong to one of our projects
        setRenders((rens || []).filter(r => projectIds.includes(r.project_id)));
        setPublishing(pubs || []);
      } catch (err) {
        console.error('Error loading video library:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [schoolSlug]);

  // ── Build joined items ────────────────────────────────────────────────────
  const items = useMemo(() => {
    return projects.map(project => {
      const projectRenders = renders
        .filter(r => r.project_id === project.id)
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      const latestRender = projectRenders[0] || null;

      const projectPubs = publishingJobs
        .filter(p => p.project_id === project.id && p.destination_status === 'published');

      return {
        project,
        latestRender,
        publishedDestinations: projectPubs,
        libStatus: libraryStatus(project, latestRender),
      };
    });
  }, [projects, renders, publishingJobs]);

  // ── Filtered + sorted items ───────────────────────────────────────────────
  const displayed = useMemo(() => {
    let result = items;

    if (statusTab !== 'all') result = result.filter(i => i.libStatus === statusTab);

    if (typeFilter !== 'all') result = result.filter(i => i.project.project_type === typeFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        (i.project.title || '').toLowerCase().includes(q) ||
        (i.project.generated_title || '').toLowerCase().includes(q) ||
        (i.project.activity_type || '').toLowerCase().includes(q) ||
        (i.project.event_name || '').toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'newest')    return new Date(b.project.created_date) - new Date(a.project.created_date);
      if (sortBy === 'oldest')    return new Date(a.project.created_date) - new Date(b.project.created_date);
      if (sortBy === 'title')     return (a.project.title || '').localeCompare(b.project.title || '');
      if (sortBy === 'published') return new Date(b.project.published_date || 0) - new Date(a.project.published_date || 0);
      return 0;
    });

    return result;
  }, [items, statusTab, typeFilter, search, sortBy]);

  const counts = useMemo(() => ({
    all:       items.length,
    draft:     items.filter(i => i.libStatus === 'draft').length,
    rendered:  items.filter(i => i.libStatus === 'rendered').length,
    published: items.filter(i => i.libStatus === 'published').length,
    failed:    items.filter(i => i.libStatus === 'failed').length,
  }), [items]);

  const projectDetailUrl = (id) =>
    `${createPageUrl('AdminSchoolProjectDetail')}?id=${id}&schoolSlug=${schoolSlug}`;

  if (loading) {
    return (
      <AdminLayout currentPageName="AdminSchoolVideoLibrary">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </AdminLayout>
    );
  }

  const content = (
    <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Video Library</h1>
            <p className="text-gray-500 mt-1 text-sm">{items.length} projects · {counts.published} published</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">

          {/* Status tabs */}
          <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-lg w-fit flex-wrap">
            {[
              { key: 'all',       label: 'All' },
              { key: 'draft',     label: 'Draft' },
              { key: 'rendered',  label: 'Rendered' },
              { key: 'published', label: 'Published' },
              { key: 'failed',    label: 'Failed' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusTab(tab.key)}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                  statusTab === tab.key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className="ml-1.5 text-xs text-gray-400">({counts[tab.key]})</span>
              </button>
            ))}
          </div>

          {/* Filters row */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-5 flex flex-col sm:flex-row gap-3 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title, event, activity..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                {Object.entries(PROJECT_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A–Z</option>
                <option value="published">Recently Published</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View toggle */}
            <div className="flex gap-1">
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Empty state */}
          {displayed.length === 0 && (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <Film className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-600 font-semibold">No videos found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or create a new project.</p>
            </div>
          )}

          {/* Grid view */}
          {viewMode === 'grid' && displayed.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayed.map(({ project, latestRender, publishedDestinations, libStatus }) => (
                <Link
                  key={project.id}
                  to={projectDetailUrl(project.id)}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group block"
                >
                  {/* Thumbnail */}
                  <div className="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {project.cover_image || latestRender?.thumbnail_url ? (
                      <img
                        src={project.cover_image || latestRender?.thumbnail_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Film className="h-12 w-12 text-gray-300" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[libStatus]}`}>
                        {libStatus}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm mb-0.5 line-clamp-1">
                      {project.generated_title || project.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">
                      {PROJECT_TYPE_LABELS[project.project_type] || project.project_type}
                      {project.event_name && ` · ${project.event_name}`}
                    </p>

                    <div className="space-y-1.5 text-xs text-gray-600">
                      {/* Render status */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Render</span>
                        {latestRender ? (
                          <span className={`font-semibold capitalize ${RENDER_STATUS_STYLES[latestRender.status] || 'text-gray-600'}`}>
                            {latestRender.status}
                            {latestRender.estimated_duration && ` · ${latestRender.estimated_duration}`}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </div>

                      {/* Publish destinations */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Published to</span>
                        {publishedDestinations.length > 0 ? (
                          <div className="flex gap-1 items-center">
                            {publishedDestinations.map(p => (
                              <span key={p.id} className="flex items-center gap-0.5 bg-green-50 text-green-700 px-1.5 py-0.5 rounded capitalize">
                                {DESTINATION_ICONS[p.destination]}
                                <span className="text-xs ml-0.5">{p.destination}</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </div>

                      {/* Date */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Created</span>
                        <span>{new Date(project.created_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* List view */}
          {viewMode === 'list' && displayed.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Render</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Published To</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayed.map(({ project, latestRender, publishedDestinations, libStatus }) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {project.cover_image || latestRender?.thumbnail_url ? (
                              <img src={project.cover_image || latestRender?.thumbnail_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Film className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{project.generated_title || project.title}</p>
                            {project.event_name && <p className="text-xs text-gray-400">{project.event_name}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {PROJECT_TYPE_LABELS[project.project_type] || project.project_type}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[libStatus]}`}>
                          {libStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm">
                        {latestRender ? (
                          <span className={`capitalize font-medium ${RENDER_STATUS_STYLES[latestRender.status] || 'text-gray-600'}`}>
                            {latestRender.status}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {publishedDestinations.length > 0 ? (
                          <div className="flex gap-1 flex-wrap">
                            {publishedDestinations.map(p => (
                              <span key={p.id} className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded capitalize">
                                {DESTINATION_ICONS[p.destination]}
                                {p.destination}
                                {p.destination_url && (
                                  <a href={p.destination_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                                    <ExternalLink className="h-3 w-3 text-green-500 hover:text-green-700" />
                                  </a>
                                )}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500">
                        {new Date(project.created_date).toLocaleDateString()}
                        {project.published_date && (
                          <div className="text-green-600 mt-0.5">
                            Published {new Date(project.published_date).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <Link to={projectDetailUrl(project.id)}>
                          <Button variant="ghost" size="sm" className="text-blue-600 gap-1">
                            <ExternalLink className="h-3.5 w-3.5" /> Open
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return <AdminLayout currentPageName="AdminSchoolVideoLibrary">{content}</AdminLayout>;
}