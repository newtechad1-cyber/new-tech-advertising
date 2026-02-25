import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';

export default function PortfolioManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    website_url: '',
    screenshot_url: '',
    description: '',
    industry: ''
  });
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: portfolioItems = [], isLoading } = useQuery({
    queryKey: ['portfolioItems'],
    queryFn: () => base44.entities.PortfolioItem.list()
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PortfolioItem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PortfolioItem.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PortfolioItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
    }
  });

  const handleScreenshotUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, screenshot_url: file_url });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      website_url: item.website_url,
      screenshot_url: item.screenshot_url,
      description: item.description || '',
      industry: item.industry || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      title: '',
      website_url: '',
      screenshot_url: '',
      description: '',
      industry: ''
    });
  };

  if (isLoading) return <div className="p-6 text-center">Loading portfolio items...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Portfolio Management</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Portfolio Item
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-6 bg-slate-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{editingItem ? 'Edit' : 'Add New'} Portfolio Item</h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Title *</label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Local Plumbing Company Website"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website URL *</label>
              <Input
                required
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Screenshot *</label>
              {formData.screenshot_url && (
                <div className="mb-3 relative inline-block">
                  <img src={formData.screenshot_url} alt="Preview" className="max-w-xs max-h-48 rounded border" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, screenshot_url: '' })}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 p-3 border-2 border-dashed rounded cursor-pointer hover:bg-slate-100">
                <Upload className="w-4 h-4" />
                <span className="text-sm">{uploading ? 'Uploading...' : 'Upload Screenshot'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <Input
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g., Plumbing, Law, Healthcare"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the project and your work..."
                className="h-24"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {item.screenshot_url && (
              <img
                src={item.screenshot_url}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              {item.industry && <p className="text-sm text-gray-500 mb-2">{item.industry}</p>}
              {item.description && <p className="text-sm text-gray-600 mb-3">{item.description}</p>}
              <a
                href={item.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm mb-4 inline-block"
              >
                Visit Website →
              </a>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                  className="gap-2"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => deleteMutation.mutate(item.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {portfolioItems.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-500">
          <p>No portfolio items yet. Add your first one!</p>
        </div>
      )}
    </div>
  );
}