import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit2, Trash2, Mail, Loader2, Check, X } from 'lucide-react';

export default function AdminSchoolStudentUsers() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('school') || 'hampton-dumont';

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await base44.entities.StudentUsers.filter({
          school_slug: schoolSlug,
        }, '-created_date');
        setStudents(data || []);
      } catch (err) {
        console.error('Error loading students:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [schoolSlug]);

  useEffect(() => {
    let result = students;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(s =>
        s.full_name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }

    if (gradeFilter !== 'all') {
      result = result.filter(s => s.grade === gradeFilter);
    }

    setFilteredStudents(result);
  }, [students, searchTerm, gradeFilter]);

  const handleToggleUpload = async (student) => {
    try {
      const updated = await base44.entities.StudentUsers.update(student.id, {
        can_upload: !student.can_upload,
      });
      setStudents(students.map(s => s.id === student.id ? updated : s));
    } catch (err) {
      console.error('Error updating student:', err);
    }
  };

  const handleDelete = async (studentId) => {
    if (!confirm('Delete this student?')) return;
    try {
      await base44.entities.StudentUsers.delete(studentId);
      setStudents(students.filter(s => s.id !== studentId));
    } catch (err) {
      console.error('Error deleting student:', err);
    }
  };

  const getUploadStats = (studentId) => {
    // This would normally query StudentUploads - for now return placeholder
    return 0;
  };

  if (loading) {
    return (
      <AdminLayout currentPageName="AdminSchoolStudentUsers">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  const content = (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Users</h1>
          <p className="text-gray-600 mt-1">Manage student accounts and upload permissions</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="h-5 w-5" />
          Invite Student
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Grade</label>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Grades</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Uploads</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Can Upload</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{student.full_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {student.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{student.grade || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{getUploadStats(student.id)}</td>
                <td className="px-6 py-4">
                  <Button
                    size="sm"
                    variant={student.can_upload ? 'default' : 'outline'}
                    onClick={() => handleToggleUpload(student)}
                    className="gap-1"
                  >
                    {student.can_upload ? (
                      <>
                        <Check className="h-3 w-3" />
                        Enabled
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3" />
                        Disabled
                      </>
                    )}
                  </Button>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${student.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {student.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedStudent(student)}
                    className="gap-1"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(student.id)}
                    className="gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No students found</p>
          </div>
        )}
      </div>
    </div>
  );

  return <AdminLayout currentPageName="AdminSchoolStudentUsers">{content}</AdminLayout>;
}