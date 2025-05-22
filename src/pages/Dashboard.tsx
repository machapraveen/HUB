import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CheckCircle, Calendar, Link as LinkIcon, List, Folder } from "lucide-react";
import { HackathonCard } from "@/components/hackathons/HackathonCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { QuickTask } from "@/components/quick/QuickTask";
import { QuickAccessItem } from "@/components/quick/QuickAccess";
import { QuickTaskDialog } from "@/components/quick/QuickTaskDialog";
import { QuickAccessDialog } from "@/components/quick/QuickAccessDialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSpace } from "@/contexts/SpaceContext";

// Import our services
import { fetchEvents } from "@/services/eventService";
import { fetchProjects } from "@/services/projectService";
import { fetchQuickTasks, createQuickTask, updateQuickTask, deleteQuickTask } from "@/services/quickTaskService";
import { fetchQuickAccess, createQuickAccess, deleteQuickAccess } from "@/services/quickAccessService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userSpace } = useSpace();
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  
  // Fetch events - use current userSpace to show relevant events
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events', 'dashboard', userSpace],
    queryFn: () => fetchEvents(userSpace)
  });
  
  // Fetch only shared projects for dashboard
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', 'dashboard', 'Both'],
    queryFn: () => fetchProjects("Both")
  });
  
  // Fetch quick tasks - use userSpace if available, otherwise "Both"
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['quickTasks', userSpace || "Both"],
    queryFn: () => fetchQuickTasks(userSpace || "Both")
  });
  
  // Fetch quick access links - use userSpace if available, otherwise "Both"
  const { data: accessLinks = [], isLoading: linksLoading } = useQuery({
    queryKey: ['quickAccess', userSpace || "Both"],
    queryFn: () => fetchQuickAccess(userSpace || "Both")
  });
  
  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: createQuickTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickTasks'] });
      toast({
        title: "Task added",
        description: "Your new task has been created successfully."
      });
      setShowTaskDialog(false);
    }
  });
  
  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => updateQuickTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickTasks'] });
    }
  });
  
  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: deleteQuickTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickTasks'] });
      toast({
        title: "Task deleted"
      });
    }
  });
  
  // Create quick access mutation
  const createLinkMutation = useMutation({
    mutationFn: createQuickAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickAccess'] });
      toast({
        title: "Link added",
        description: "Your new quick access link has been created successfully."
      });
      setShowLinkDialog(false);
    }
  });
  
  // Delete quick access mutation
  const deleteLinkMutation = useMutation({
    mutationFn: deleteQuickAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickAccess'] });
      toast({
        title: "Link deleted"
      });
    }
  });
  
  const activeHackathons = events.filter(h => h.status === "active");
  const upcomingHackathons = events.filter(h => h.status === "upcoming");
  const sharedProjects = projects.slice(0, 3); // Only show first 3 shared projects
  
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const pendingTasksCount = tasks.filter(task => !task.completed).length;

  const handleAddTask = (taskData: any) => {
    createTaskMutation.mutate({
      title: taskData.title,
      due_date: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
      user_space: taskData.userSpace // Use the selected space from dialog
    });
  };

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTaskMutation.mutate({
        id: taskId,
        data: { completed: !task.completed }
      });
      
      toast({
        title: task.completed ? "Task marked as incomplete" : "Task completed",
        description: task.title,
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const handleAddLink = (linkData: any) => {
    createLinkMutation.mutate({
      title: linkData.title,
      url: linkData.url,
      color: linkData.category || null,
      user_space: linkData.userSpace // Use the selected space from dialog
    });
  };

  const handleDeleteLink = (linkId: string) => {
    const link = accessLinks.find(l => l.id === linkId);
    if (link) {
      deleteLinkMutation.mutate(linkId);
    }
  };

  // Navigate to the shared projects only
  const navigateToSharedProjects = () => {
    navigate('/projects?view=shared');
  };

  const isLoading = eventsLoading || projectsLoading || tasksLoading || linksLoading;

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Active Events Card */}
        <Card className="col-span-full md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <CardDescription>
                Currently running hackathons & competitions
              </CardDescription>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {activeHackathons.length > 0 ? (
              <div className="space-y-4">
                {activeHackathons.map(hackathon => (
                  <div 
                    key={hackathon.id}
                    className="flex items-center p-2 cursor-pointer rounded-md hover:bg-muted"
                    onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                  >
                    <div>
                      <div className="font-medium">{hackathon.title}</div>
                      <div className="text-xs text-muted-foreground">{hackathon.organizer}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active events</p>
            )}
            <Button variant="ghost" className="w-full mt-4" onClick={() => navigate('/hackathons')}>
              View all events
            </Button>
          </CardContent>
        </Card>

        {/* Projects Card - Only show shared projects */}
        <Card className="col-span-full md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Shared Projects</CardTitle>
              <CardDescription>
                Collaborative development projects
              </CardDescription>
            </div>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {sharedProjects.length > 0 ? (
              <div className="space-y-4">
                {sharedProjects.map(project => (
                  <div 
                    key={project.id}
                    className="flex items-center p-2 cursor-pointer rounded-md hover:bg-muted"
                    onClick={() => navigate(`/projects/${project.id}`)}
                    style={{ borderLeft: `3px solid ${project.color}` }}
                  >
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {project.progress}% complete • Shared
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No shared projects created yet</p>
            )}
            <Button variant="ghost" className="w-full mt-4" onClick={navigateToSharedProjects}>
              View shared projects
            </Button>
          </CardContent>
        </Card>

        {/* Tasks Summary Card */}
        <Card className="col-span-full md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Tasks Summary</CardTitle>
              <CardDescription>
                Your quick tasks overview
              </CardDescription>
            </div>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{completedTasksCount}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{pendingTasksCount}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setShowTaskDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Quick Task
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <Button variant="outline" onClick={() => navigate('/hackathons')}>View All</Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingHackathons.length > 0 ? (
            upcomingHackathons.map(hackathon => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))
          ) : (
            <div className="col-span-full py-8 text-center">
              <p className="text-muted-foreground">No upcoming events</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Tasks & Quick Access Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Quick Tasks</CardTitle>
              <CardDescription>
                Manage your short-term tasks
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowTaskDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <QuickTask
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                />
              ))
            ) : (
              <div className="py-8 text-center">
                <List className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No tasks added yet</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Access */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>
                Quickly access important links
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowLinkDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {accessLinks.length > 0 ? (
              accessLinks.map(link => (
                <QuickAccessItem
                  key={link.id}
                  item={link}
                  onDelete={handleDeleteLink}
                />
              ))
            ) : (
              <div className="py-8 text-center">
                <LinkIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No quick access links added yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <QuickTaskDialog
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        onCreateTask={handleAddTask}
      />
      
      <QuickAccessDialog
        open={showLinkDialog}
        onOpenChange={setShowLinkDialog}
        onCreateLink={handleAddLink}
      />
    </div>
  );
};

export default Dashboard;