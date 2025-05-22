
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/ProgressRing";
import { Badge } from "@/components/ui/badge";
import { Folder } from "lucide-react";
import { Project } from "@/data/mockData";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  onClick?: () => void;
};

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const getUserColor = (userId: Project["userId"]) => {
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
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
      style={{ borderLeft: `4px solid ${project.color}` }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <Badge className={cn(getUserColor(project.userId))}>
            {project.userId}
          </Badge>
        </div>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        {project.directoryPath && (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Folder size={14} className="mr-1" />
            <span>{project.directoryPath}</span>
          </div>
        )}
        <div className="text-sm">
          <span className="text-muted-foreground">Created: </span>
          <span>{formatDate(project.createdDate)}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Progress</div>
        <ProgressRing percentage={project.progress} size={40} />
      </CardFooter>
    </Card>
  );
}
