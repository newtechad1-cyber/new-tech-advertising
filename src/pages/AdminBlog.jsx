import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '../components/auth/AdminGuard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Wand2, Save, Plus, RefreshCw, Trash2, Edit, Tag, X, Image, ExternalLink, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AdminBlog() {
    const queryClient = useQueryClient();
    const [selectedPost, setSelectedPost] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState('list'); // list, edit

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image_url: '',
        category: '',
        author: 'Rick',
        tags: [],
        meta_description: ''
    });

    const [generationPrompt, setGenerationPrompt] = useState({
        keywords: '',
        tone: 'professional yet accessible'
    });

    const { data: posts, isLoading } = useQuery({
        queryKey: ['admin-posts'],
        queryFn: () => base44.entities.BlogPost.list('-published_date'),
        initialData: []
    });

    const createPostMutation = useMutation({
        mutationFn: (data) => base44.entities.BlogPost.create({
            ...data,
            published_date: new Date().toISOString().split('T')[0]
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-posts']);
            toast.success('Post created successfully');
            setActiveTab('list');
        }
    });

    const updatePostMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.BlogPost.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-posts']);
            toast.success('Post updated successfully');
        }
    });

    const deletePostMutation = useMutation({
        mutationFn: (id) => base44.entities.BlogPost.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-posts']);
            toast.success('Post deleted');
            if (selectedPost?.id === deletePostMutation.variables) {
                setSelectedPost(null);
                setActiveTab('list');
            }
        }
    });

    const handleEdit = (post) => {
        setSelectedPost(post);
        setFormData({
            title: post.title || '',
            slug: post.slug || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            image_url: post.image_url || '',
            category: post.category || '',
            author: post.author || 'Rick',
            tags: post.tags || [],
            meta_description: post.meta_description || ''
        });
        setActiveTab('edit');
    };

    const handleCreateNew = () => {
        setSelectedPost(null);
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            image_url: '',
            category: '',
            author: 'Rick',
            tags: [],
            meta_description: ''
        });
        setActiveTab('edit');
    };

    const handleSave = () => {
        if (!formData.title || !formData.content) {
            toast.error('Title and Content are required');
            return;
        }

        if (selectedPost) {
            updatePostMutation.mutate({ id: selectedPost.id, data: formData });
        } else {
            createPostMutation.mutate(formData);
        }
    };

    // AI Functions
    const generateFullPost = async () => {
        if (!formData.title || !generationPrompt.keywords) {
            toast.error('Please provide a title and keywords');
            return;
        }
        setIsGenerating(true);
        try {
            const prompt = `
                Write a comprehensive, SEO-optimized blog post in markdown format.
                Title: ${formData.title}
                Keywords to include: ${generationPrompt.keywords}
                Tone: ${generationPrompt.tone}
                Target Audience: Small business owners interested in AI marketing.
                
                Structure:
                - Engaging Introduction
                - Clear Headings (H2, H3)
                - Bullet points for readability
                - Actionable Conclusion
                
                Also provide a short excerpt (max 160 chars) and a suggested slug.
                
                Return JSON format:
                {
                    "content": "markdown string...",
                    "excerpt": "string...",
                    "slug": "string-slug-format"
                }
            `;
            
            const res = await base44.integrations.Core.InvokeLLM({
                prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        content: { type: "string" },
                        excerpt: { type: "string" },
                        slug: { type: "string" }
                    }
                }
            });
            
            // The integration returns a parsed object if schema is provided
            const result = typeof res === 'string' ? JSON.parse(res) : res;
            
            setFormData(prev => ({
                ...prev,
                content: result.content,
                excerpt: result.excerpt,
                slug: result.slug || prev.slug
            }));
            toast.success('Content generated!');
        } catch (err) {
            console.error(err);
            toast.error('Generation failed');
        } finally {
            setIsGenerating(false);
        }
    };

    const rewriteContent = async () => {
        if (!formData.content) return;
        setIsGenerating(true);
        try {
            const prompt = `
                Rewrite the following blog post content to improve SEO, readability, and engagement.
                Maintain a ${generationPrompt.tone} tone.
                Fix any grammar issues.
                Use markdown formatting.
                
                Content:
                ${formData.content}
            `;
            
            const res = await base44.integrations.Core.InvokeLLM({ prompt });
            setFormData(prev => ({ ...prev, content: res }));
            toast.success('Content rewritten!');
        } catch (err) {
            toast.error('Rewrite failed');
        } finally {
            setIsGenerating(false);
        }
    };

    const generateMetaAndTags = async () => {
        if (!formData.content && !formData.title) return;
        setIsGenerating(true);
        try {
            const contentSample = (formData.content || '').substring(0, 1000);
            const prompt = `
                Analyze this blog post and generate SEO meta data.
                Title: ${formData.title}
                Content sample: ${contentSample}
                
                Return JSON:
                {
                    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
                    "meta_description": "SEO optimized description under 160 chars"
                }
            `;
            
            const res = await base44.integrations.Core.InvokeLLM({
                prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        tags: { type: "array", items: { type: "string" } },
                        meta_description: { type: "string" }
                    }
                }
            });

            const result = typeof res === 'string' ? JSON.parse(res) : res;
            
            setFormData(prev => ({
                ...prev,
                tags: result.tags,
                meta_description: result.meta_description
            }));
            toast.success('Meta data generated!');
        } catch (err) {
            toast.error('Meta generation failed');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <AdminGuard>
        <div className="min-h-screen bg-slate-50 pt-14 lg:pt-0">
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3 sticky top-0 z-10">
              <Link to={createPageUrl("AdminDashboard")}>
                <Button variant="ghost" size="sm" className="gap-1 text-slate-500 hover:text-slate-900">← Admin Hub</Button>
              </Link>
              <span className="text-slate-300">|</span>
              <span className="text-sm font-medium text-slate-700">Blog Manager</span>
            </div>
            <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Blog Manager</h1>
                        <p className="text-slate-500">Create and manage content with AI</p>
                    </div>
                    <div className="flex gap-2">
                        {activeTab === 'edit' && (
                            <Button variant="outline" onClick={() => setActiveTab('list')}>
                                Cancel
                            </Button>
                        )}
                        <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            New Post
                        </Button>
                    </div>
                </header>

                {activeTab === 'list' ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {isLoading ? (
                            <div className="col-span-full flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : posts.map(post => (
                            <Card key={post.id} className="group hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{post.title}</CardTitle>
                                    <div className="text-sm text-slate-500">{post.published_date}</div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                                        {post.excerpt || post.content?.substring(0, 100)}...
                                    </p>
                                    <div className="flex justify-end gap-2">
                                        <Link to={createPageUrl(`BlogPost?slug=${post.slug}`)} target="_blank">
                                            <Button variant="ghost" size="sm">
                                                <ExternalLink className="w-4 h-4 mr-1" /> View
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                                            <Edit className="w-4 h-4 mr-1" /> Edit
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            size="sm" 
                                            onClick={() => {
                                                if(window.confirm('Are you sure?')) deletePostMutation.mutate(post.id)
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Editor Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <Label>Title</Label>
                                        <Input 
                                            value={formData.title} 
                                            onChange={e => setFormData({...formData, title: e.target.value})}
                                            placeholder="Enter post title"
                                            className="text-lg font-medium"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Slug</Label>
                                            <Input 
                                                value={formData.slug} 
                                                onChange={e => setFormData({...formData, slug: e.target.value})}
                                                placeholder="post-url-slug"
                                            />
                                        </div>
                                        <div>
                                            <Label>Category</Label>
                                            <Input 
                                                value={formData.category} 
                                                onChange={e => setFormData({...formData, category: e.target.value})}
                                                placeholder="e.g., Marketing"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                       <Label>Featured Image</Label>
                                       <div className="flex gap-2 mt-1">
                                           <Input
                                               value={formData.image_url}
                                               onChange={e => setFormData({...formData, image_url: e.target.value})}
                                               placeholder="Paste image URL or upload below"
                                           />
                                           <label className="cursor-pointer shrink-0">
                                               <input
                                                   type="file"
                                                   accept="image/*,video/*"
                                                   className="hidden"
                                                   onChange={async (e) => {
                                                       const file = e.target.files[0];
                                                       if (!file) return;
                                                       toast.info('Uploading...');
                                                       const res = await base44.integrations.Core.UploadFile({ file });
                                                       if (file.type.startsWith('image/')) {
                                                           setFormData(prev => ({ ...prev, image_url: res.file_url }));
                                                       } else {
                                                           // Insert video URL into content
                                                           const tag = `\n<video src="${res.file_url}" controls style="max-width:100%"></video>\n`;
                                                           setFormData(prev => ({ ...prev, content: (prev.content || '') + tag }));
                                                       }
                                                       toast.success('File uploaded!');
                                                   }}
                                               />
                                               <Button type="button" variant="outline" size="icon" asChild>
                                                   <span><Upload className="w-4 h-4" /></span>
                                               </Button>
                                           </label>
                                       </div>
                                       {formData.image_url && (
                                           <img src={formData.image_url} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" />
                                       )}
                                    </div>

                                    <div>
                                       <Label>Content</Label>
                                       <div className="prose-editor mt-2">
                                           <ReactQuill 
                                               theme="snow"
                                               value={formData.content}
                                               onChange={content => setFormData({...formData, content})}
                                               className="h-96 mb-12"
                                               modules={{
                                                   toolbar: [
                                                       [{ header: [1, 2, 3, false] }],
                                                       ['bold', 'italic', 'underline', 'strike'],
                                                       [{ list: 'ordered' }, { list: 'bullet' }],
                                                       ['link', 'image', 'video'],
                                                       ['clean']
                                                   ]
                                               }}
                                           />
                                       </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar / AI Tools */}
                        <div className="space-y-6">
                            <Card className="bg-blue-50 border-blue-100">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-blue-800">
                                        <Wand2 className="w-5 h-5" />
                                        AI Assistant
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Target Keywords</Label>
                                        <Input 
                                            value={generationPrompt.keywords}
                                            onChange={e => setGenerationPrompt({...generationPrompt, keywords: e.target.value})}
                                            placeholder="e.g., small business ai, seo"
                                            className="bg-white"
                                        />
                                    </div>
                                    
                                    <Button 
                                        onClick={generateFullPost} 
                                        disabled={isGenerating}
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                    >
                                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                                        Generate Full Post
                                    </Button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-blue-200" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-blue-50 px-2 text-blue-500">Or Optimize</span>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={rewriteContent}
                                        disabled={isGenerating || !formData.content}
                                        variant="outline"
                                        className="w-full border-blue-200 hover:bg-blue-100 text-blue-700"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Rewrite for SEO & Tone
                                    </Button>

                                    <Button 
                                        onClick={generateMetaAndTags}
                                        disabled={isGenerating || (!formData.content && !formData.title)}
                                        variant="outline"
                                        className="w-full border-blue-200 hover:bg-blue-100 text-blue-700"
                                    >
                                        <Tag className="w-4 h-4 mr-2" />
                                        Generate Tags & Meta
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Meta Data</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Excerpt</Label>
                                        <Textarea 
                                            value={formData.excerpt}
                                            onChange={e => setFormData({...formData, excerpt: e.target.value})}
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <Label>Meta Description</Label>
                                        <Textarea 
                                            value={formData.meta_description}
                                            onChange={e => setFormData({...formData, meta_description: e.target.value})}
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <Label>Tags</Label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.tags.map((tag, i) => (
                                                <Badge key={i} variant="secondary" className="flex items-center gap-1">
                                                    {tag}
                                                    <button 
                                                        onClick={() => setFormData({
                                                            ...formData, 
                                                            tags: formData.tags.filter((_, idx) => idx !== i)
                                                        })}
                                                        className="hover:text-red-500"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <Input 
                                            placeholder="Add tag and press Enter"
                                            className="mt-2"
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = e.target.value.trim();
                                                    if (val && !formData.tags.includes(val)) {
                                                        setFormData({...formData, tags: [...formData.tags, val]});
                                                        e.target.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    
                                    <div className="pt-4 border-t space-y-2">
                                        <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700">
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Post
                                        </Button>
                                        {selectedPost?.slug && (
                                            <Link to={createPageUrl(`BlogPost?slug=${selectedPost.slug}`)} target="_blank">
                                                <Button variant="outline" className="w-full">
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    View on Blog
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </div>
        </AdminGuard>
    );
}