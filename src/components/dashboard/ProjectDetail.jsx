import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, Circle, Clock, FileText, MessageSquare, 
  Upload, Send, Paperclip, Calendar, ArrowLeft, Download
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ProjectDetail({ project, onBack }) {
  const [tasks, setTasks] = useState([]);
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjectData();
  }, [project.id]);

  const loadProjectData = async () => {
    try {
      const [fetchedTasks, fetchedFiles, fetchedComments] = await Promise.all([
        base44.entities.ProjectTask.list({ project_id: project.id }, { created_date: 1 }),
        base44.entities.ProjectFile.list({ project_id: project.id }, { created_date: -1 }),
        base44.entities.ProjectComment.list({ project_id: project.id }, { created_date: 1 })
      ]);
      setTasks(fetchedTasks);
      setFiles(fetchedFiles);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Failed to load project data", error);
      toast.error("Failed to load project details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const user = await base44.auth.me();
      const comment = await base44.entities.ProjectComment.create({
        project_id: project.id,
        content: newMessage,
        sender_name: user.full_name || 'User',
        is_manager: false
      });
      setComments([...comments, comment]);
      setNewMessage('');
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const newFile = await base44.entities.ProjectFile.create({
        project_id: project.id,
        name: file.name,
        url: file_url,
        type: file.name.split('.').pop()
      });
      setFiles([newFile, ...files]);
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading project details...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{project.name}</h2>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Badge variant="outline" className="capitalize">{project.status.replace('_', ' ')}</Badge>
            {project.due_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Due {format(new Date(project.due_date), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
          <TabsTrigger 
            value="tasks" 
            className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
          >
            Tasks & Progress
          </TabsTrigger>
          <TabsTrigger 
            value="files" 
            className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
          >
            Files & Assets
          </TabsTrigger>
          <TabsTrigger 
            value="discussion" 
            className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
          >
            Discussion
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">No tasks assigned yet.</p>
                ) : (
                  tasks.map(task => (
                    <div key={task.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      {task.status === 'done' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : task.status === 'in_progress' ? (
                        <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className={`font-medium ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                            {task.title}
                          </h4>
                          <Badge className={getStatusColor(task.status)} variant="secondary">
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        {task.due_date && (
                          <p className="text-xs text-slate-500 mt-1">
                            Due: {format(new Date(task.due_date), 'MMM d')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Project Assets</CardTitle>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <Button disabled={isUploading}>
                  {isUploading ? 'Uploading...' : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {files.length === 0 ? (
                  <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg">
                    <Upload className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500">No files uploaded yet</p>
                  </div>
                ) : (
                  files.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate text-sm" title={file.name}>{file.name}</p>
                          <p className="text-xs text-slate-500 uppercase">{file.type}</p>
                        </div>
                      </div>
                      <a href={file.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                        </Button>
                      </a>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussion" className="mt-6">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Project Discussion</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto space-y-4 pr-4 mb-4">
                {comments.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className={`flex flex-col ${!comment.is_manager ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        !comment.is_manager 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-slate-100 text-slate-800 rounded-tl-none'
                      }`}>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <span className="text-xs text-slate-400 mt-1 px-1">
                        {comment.sender_name} • {format(new Date(comment.created_date), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}