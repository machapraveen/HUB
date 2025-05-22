
import { useState } from "react";
import { Check, Clock, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type QuickTask = {
  id: string;
  userId: "Macha" | "Veerendra" | "Both";
  title: string;
  completed?: boolean;
  dueDate?: string;
  createdDate: string;
};

type QuickTaskProps = {
  task: QuickTask;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
};

export const QuickTask = ({ task, onComplete, onDelete }: QuickTaskProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getUserColor = (userId: QuickTask["userId"]) => {
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Today, ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-between py-3 px-4 rounded-lg transition-all",
        task.completed ? "bg-muted" : "bg-card hover:bg-accent/5",
        "border"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <Button
          size="icon"
          variant={task.completed ? "default" : "outline"}
          className={cn(
            "h-6 w-6 shrink-0 rounded-full",
            task.completed && "bg-primary text-primary-foreground"
          )}
          onClick={() => onComplete(task.id)}
        >
          {task.completed && <Check className="h-3 w-3" />}
        </Button>
        <div className="flex flex-col gap-1">
          <span className={cn("text-sm font-medium", task.completed && "line-through text-muted-foreground")}>
            {task.title}
          </span>
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <Badge variant="outline" className={getUserColor(task.userId)}>
              {task.userId}
            </Badge>
            {task.dueDate && (
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Created: {formatDate(task.createdDate)}</span>
            </div>
          </div>
        </div>
      </div>
      {isHovered && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete task</span>
        </Button>
      )}
    </div>
  );
};
