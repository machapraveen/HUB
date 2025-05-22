
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/data/mockData";

type TaskCardProps = {
  task: Task;
  onClick?: () => void;
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "";
    }
  };

  const getAssigneeColor = (assignee: Task["assignedTo"]) => {
    switch (assignee) {
      case "Macha":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "Veerendra":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Both":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300";
      default:
        return "";
    }
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{task.title}</CardTitle>
          <Badge className={getStatusColor(task.status)}>
            {task.status.replace("-", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {task.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className={getAssigneeColor(task.assignedTo)}>
            {task.assignedTo}
          </Badge>
          <Badge variant="outline" className={getPriorityColor(task.priority)}>
            {task.priority} priority
          </Badge>
          {task.dueDate && (
            <Badge variant="outline">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
