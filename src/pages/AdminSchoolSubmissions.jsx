import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams } from 'react-router-dom';
import AdminShell from '@/components/school-tv/AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  AlertCircle,
  Archive,
  Sparkles,
  Loader2,
} from 'lucide-react';

export default function AdminSchoolSubmissions() {
  const { schoolSlug } = useParams();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.SchoolSubmissions.filter({
          school_slug: schoolSlug,
        });
        setSubmissions(data || []);
      } catch (error) {
        console.error('Error loading submissions:', error);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);



  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    review: 'bg-orange-100 text-orange-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const filteredSubmissions = submissions.filter(s => {
    const statusMatch = filterStatus === 'all' || s.status === filterStatus;
    const searchMatch = !searchTerm || 
      s.submission_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contributor_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const handleApprove = async (id) => {
    try {
      await base44.entities.SchoolSubmissions.update(id, { status: 'approved' });
      setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'approved' } : s));
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error approving submission:', error);
      alert('Error approving submission');
    }
  };

  const handleReject = async (id) => {
    try {
      await base44.entities.SchoolSubmissions.update(id, { status: 'rejected' });
      setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error rejecting submission:', error);
      alert('Error rejecting submission');
    }
  };

  const handleArchive = async (id) => {
    try {
      await base44.entities.SchoolSubmissions.update(id, { status: 'archived' });
      setSubmissions(submissions.filter(s => s.id !== id));
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error archiving submission:', error);
      alert('Error archiving submission');
    }
  };

  const handleSaveToStory = async (submission) => {
    try {
      // Create a story from the submission
      const story = await base44.entities.Stories.create({
        school_slug: schoolSlug,
        title: submission.submission_title,
        slug: submission.submission_title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        excerpt: submission.description?.substring(0, 200) || '',
        body: submission.description || `Based on submission: ${submission.submission_title}`,
        featured_image_url: submission.thumbnail || null,
        status: 'draft',
        visibility: 'staff',
      });
      // Update submission to mark it as linked
      await base44.entities.SchoolSubmissions.update(submission.id, {
        status: 'assigned_to_project',
        project_id: story.id,
      });
      setSubmissions(submissions.map(s => s.id === submission.id ? { ...s, status: 'assigned_to_project', project_id: story.id } : s));
      setSelectedSubmission(null);
      alert(`Story created successfully! Edit it in the Story Library.`);
    } catch (error) {
      console.error('Error saving to story:', error);
      alert('Error saving to story');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <AdminShell schoolSlug={schoolSlug}>
      <div className="flex-1 overflow-auto">
        {/* Header */}
         <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
           <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
             <h1 className="text-3xl font-bold text-gray-900">Content Submissions</h1>
             <p className="text-gray-600 mt-2">Review and approve student submissions. Check consent and safety flags before publishing.</p>
           </div>
         </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Filters & Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                 <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                 <Input
                   placeholder="Search by title or contributor..."
                   className="pl-10"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
               <div className="flex gap-2">
                 <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="review">Needs Review</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {filteredSubmissions.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Contributor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Submitted</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Safety</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                         <div>
                           <p className="text-gray-900 font-semibold text-sm">{submission.contributor_name}</p>
                           <p className="text-xs text-gray-500 mt-1">
                             {submission.contributor_role || 'Student'}
                           </p>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <p className="text-gray-900 font-semibold text-sm">{submission.submission_title}</p>
                       </td>
                       <td className="px-6 py-4">
                         <span className="text-sm text-gray-700 capitalize">{submission.activity_type}</span>
                       </td>
                       <td className="px-6 py-4">
                         <span className="text-sm text-gray-700">{new Date(submission.created_date).toLocaleDateString()}</span>
                       </td>
                       <td className="px-6 py-4">
                         <div className="space-y-1">
                           {!submission.consent_confirmed && (
                             <p className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">⚠ No consent</p>
                           )}
                           {submission.ai_safety_flag && (
                             <p className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded flex items-center gap-1">
                               <AlertCircle className="h-3 w-3" /> Review needed
                             </p>
                           )}
                           {submission.consent_confirmed && !submission.ai_safety_flag && (
                             <p className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">✓ Safe</p>
                           )}
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[submission.status]}`}>
                           {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                         <Button
                           variant="outline"
                           size="sm"
                           className="text-blue-600"
                           onClick={() => setSelectedSubmission(submission)}
                         >
                           Review
                         </Button>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-600 mb-4">No submissions found</p>
                <p className="text-sm text-gray-500">When students submit content, it will appear here for review.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Drawer */}
       {selectedSubmission && (
         <>
           {/* Overlay */}
           <div 
             className="fixed inset-0 bg-black bg-opacity-30 z-40"
             onClick={() => setSelectedSubmission(null)}
           />
           <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
             <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between">
               <h2 className="text-xl font-bold">Submission Detail</h2>
               <button
                 onClick={() => setSelectedSubmission(null)}
                 className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
               >
                 ✕
               </button>
             </div>
          
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* Submission Status Alert */}
            {!selectedSubmission.consent_confirmed && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Consent Not Confirmed</p>
                  <p className="text-sm text-red-800 mt-1">This submission cannot be approved without verified parental/guardian consent.</p>
                </div>
              </div>
            )}
            {selectedSubmission.ai_safety_flag && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900">AI Safety Review Needed</p>
                  <p className="text-sm text-orange-800 mt-1">AI content screening flagged this for manual review. Please verify before approving.</p>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Contributor</p>
              <p className="text-gray-900 font-medium">{selectedSubmission.contributor_name}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Title</p>
              <p className="text-gray-900 font-medium">{selectedSubmission.submission_title}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Type</p>
              <p className="text-gray-900">{selectedSubmission.activity_type}</p>
            </div>

            {selectedSubmission.ai_quality_score > 0 && (
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-600">
                <p className="text-xs text-purple-900 font-medium uppercase mb-2">AI Quality Score</p>
                <p className="text-sm text-purple-900">{(selectedSubmission.ai_quality_score * 100).toFixed(0)}%</p>
              </div>
            )}
            
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Consent Status</p>
              <div className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedSubmission.consent_confirmed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {selectedSubmission.consent_confirmed ? '✓ Consent provided' : '✗ No consent'}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-t border-gray-200 p-6 space-y-2">
            <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Moderation Actions</p>
            {selectedSubmission.consent_confirmed ? (
              <>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                  onClick={() => handleApprove(selectedSubmission.id)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  ✓ Approve for Publishing
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-purple-600 border-purple-200"
                  onClick={() => handleSaveToStory(selectedSubmission)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Turn Into Story
                </Button>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleReject(selectedSubmission.id)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-red-600 font-semibold mb-2">Cannot approve without consent</p>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleReject(selectedSubmission.id)}
                >
                  Reject (No Consent)
                </Button>
              </div>
            )}
            <Button 
              variant="ghost" 
              className="w-full text-gray-600"
              onClick={() => handleArchive(selectedSubmission.id)}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
            </div>
            </div>
            </>
            )}
            </AdminShell>
            );
            }