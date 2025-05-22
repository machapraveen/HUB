
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ProgressRing";
import { ChevronLeft, Folder, Calendar, Edit } from "lucide-react";
import { fetchProjectById } from "@/services/projectService";
import { useToast } from "@/hooks/use-toast";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch the project data
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id as string),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">Loading project details...</div>
    );
  }

  if (error || !project) {
    toast({
      title: "Error loading project",
      description: "Unable to load the project details",
      variant: "destructive",
    });
    
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/projects">Return to Projects</Link>
        </Button>
      </div>
    );
  }

  const getUserColor = (userId: string) => {
    switch (userId) {
      case "Macha":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "Veerendra":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Both":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link to="/projects" className="mr-2">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{project.name}</h1>
            <div className="flex items-center mt-1 gap-2">
              <Badge className={getUserColor(project.userId)}>
                {project.userId}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Created on {formatDate(project.createdDate)}
              </span>
            </div>
          </div>
        </div>
        <Button onClick={() => navigate(`/projects/edit/${project.id}`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Information about this project</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{project.description || "No description provided."}</p>
            
            {project.directoryPath && (
              <div className="flex items-center mt-4 text-sm p-2 bg-muted rounded-md">
                <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
                <code className="text-muted-foreground font-mono">{project.directoryPath}</code>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Current completion status</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ProgressRing percentage={project.progress} size={120} strokeWidth={8} showPercentage={true} />
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate(`/projects/edit/${project.id}`)}>Update Progress</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetail;
