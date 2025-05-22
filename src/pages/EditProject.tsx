
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save } from "lucide-react";
import { fetchProjectById, updateProject } from "@/services/projectService";
import { useToast } from "@/hooks/use-toast";

const EditProject = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch the project data
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id as string),
    enabled: !!id
  });
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    directoryPath: "",
    progress: 0,
    color: ""
  });
  
  // Update form data when project data is loaded
  useState(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        directoryPath: project.directoryPath || "",
        progress: project.progress,
        color: project.color
      });
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: (data: any) => updateProject(id as string, {
      name: data.name,
      description: data.description,
      github_url: data.directoryPath,
      progress: data.progress,
      color: data.color
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Project updated",
        description: "Project has been updated successfully."
      });
      navigate(`/projects/${id}`);
    },
    onError: (error) => {
      toast({
        title: "Error updating project",
        description: "An error occurred while updating the project.",
        variant: "destructive"
      });
      console.error("Error updating project:", error);
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progress' ? parseInt(value) : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading project details...</div>;
  }

  if (error || !project) {
    toast({
      title: "Error loading project",
      description: "Unable to load the project details",
      variant: "destructive",
    });
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-xl mb-4">Project not found</p>
        <Button onClick={() => navigate('/projects')}>Return to Projects</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/projects/${id}`)} 
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Edit Project</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Update your project information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input 
                id="name" 
                name="name"
                value={formData.name || project.name}
                onChange={handleChange}
                placeholder="Project name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description"
                value={formData.description || project.description}
                onChange={handleChange}
                placeholder="Project description"
                rows={4}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="directoryPath">Repository/Directory Path</Label>
              <Input 
                id="directoryPath" 
                name="directoryPath"
                value={formData.directoryPath || project.directoryPath || ""}
                onChange={handleChange}
                placeholder="GitHub URL or file path"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="color">Project Color</Label>
              <div className="flex gap-4 items-center">
                <Input 
                  id="color" 
                  name="color"
                  type="color"
                  value={formData.color || project.color}
                  onChange={handleChange}
                  className="w-20 h-10 p-1"
                />
                <Input
                  type="text"
                  name="color"
                  value={formData.color || project.color}
                  onChange={handleChange}
                  placeholder="#RRGGBB"
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="progress">Progress ({formData.progress || project.progress}%)</Label>
              <Input 
                id="progress" 
                name="progress"
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.progress || project.progress}
                onChange={handleChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" type="button" onClick={() => navigate(`/projects/${id}`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateProjectMutation.isPending}>
              {updateProjectMutation.isPending ? 'Saving...' : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default EditProject;
