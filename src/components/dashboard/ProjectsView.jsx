import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FolderKanban, Calendar, MoreVertical, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import ProjectDetail from './ProjectDetail';
import EmptyState from './EmptyState';
import { toast } from 'sonner';

export default function ProjectsView() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await base44.entities.Project.list({}, { created_date: -1 });
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateDemoProject = async () => {
    setLoading(true);
    try {
      // Create a demo project for the user
      const project = await base44.entities.Project.create({
        name: "Website Redesign 2025",
        description: "Complete overhaul of the company website with AI integration.",
        status: "active",
        start_date: new Date().toISOString(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        progress: 15
      });

      // Add some tasks
      await base44.entities.ProjectTask.bulkCreate([
        { project_id: project.id, title: "Initial Requirements Gathering", status: "done", due_date: new Date().toISOString() },
        { project_id: project.id, title: "Design Mockups", status: "in_progress", due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
        { project_id: project.id, title: "Content Strategy", status: "todo", due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() }
      ]);

      setProjects([project, ...projects]);
      setSelectedProject(project);
    } catch (error) {
      console.error("Failed to create demo project", error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Projects</h2>
          <p className="text-slate-500">Manage and track your ongoing services</p>
        </div>
        <Button onClick={handleCreateDemoProject} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Request New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No Active Projects Yet"
          description="Your projects and campaigns will appear here once your account manager sets them up. This typically happens within 48 hours of onboarding."
          actionLabel="Contact Support"
          onAction={() => toast.info('Call us at 641-420-8816 or email rick@newtechadvertising.com')}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => setSelectedProject(project)}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                    <FolderKanban className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                    ${project.status === 'active' ? 'bg-green-100 text-green-700' : 
                      project.status === 'completed' ? 'bg-slate-100 text-slate-700' : 
                      'bg-yellow-100 text-yellow-700'}`
                  }>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-medium">{project.progress || 0}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                        style={{ width: `${project.progress || 0}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 text-sm text-slate-500 border-t p-4 mt-2 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {project.due_date ? `Due ${format(new Date(project.due_date), 'MMM d, yyyy')}` : 'No deadline'}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}