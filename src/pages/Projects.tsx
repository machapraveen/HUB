
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSpace } from "@/contexts/SpaceContext";
import { fetchProjects, createProject } from "@/services/projectService";

const Projects = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userSpace } = useSpace();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Fetch all projects data
  const { data: allProjects = [], isLoading } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: () => fetchProjects()
  });
  
  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Project created",
        description: "Your new project has been created successfully.",
      });
      setCreateDialogOpen(false);
    }
  });
  
  const machaProjects = allProjects.filter(p => p.userId === "Macha" || p.userId === "Both");
  const veerendraProjects = allProjects.filter(p => p.userId === "Veerendra" || p.userId === "Both");
  const bothProjects = allProjects.filter(p => p.userId === "Both");

  const handleCreateProject = (projectData: any) => {
    createProjectMutation.mutate({
      name: projectData.name,
      description: projectData.description,
      color: projectData.color,
      progress: 0,
      user_space: userSpace || "Both"
    });
  };

  const handleClickProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="macha">Macha</TabsTrigger>
          <TabsTrigger value="veerendra">Veerendra</TabsTrigger>
          <TabsTrigger value="both">Shared</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allProjects.length > 0 ? (
              allProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={() => handleClickProject(project.id)}
                />
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <p className="text-muted-foreground mb-4">No projects created yet</p>
                <Button onClick={() => setCreateDialogOpen(true)}>Create your first project</Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="macha" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {machaProjects.length > 0 ? (
              machaProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={() => handleClickProject(project.id)}
                />
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <p className="text-muted-foreground">No projects assigned to Macha</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="veerendra" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {veerendraProjects.length > 0 ? (
              veerendraProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={() => handleClickProject(project.id)}
                />
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <p className="text-muted-foreground">No projects assigned to Veerendra</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="both" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bothProjects.length > 0 ? (
              bothProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={() => handleClickProject(project.id)}
                />
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <p className="text-muted-foreground">No shared projects</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <CreateProjectDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateProject={handleCreateProject}
      />
      
      {/* Quick Access Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button size="lg" className="h-14 w-14 rounded-full shadow-lg" onClick={() => setCreateDialogOpen(true)}>
          <Plus size={24} />
        </Button>
      </div>
    </div>
  );
};

export default Projects;
