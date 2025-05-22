
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Updated Document type to match what we're using in the app
export type Document = {
  id: string;
  hackathonId: string;
  name: string;
  type: "research" | "code" | "presentation" | "submission" | "other";
  uploadedBy: "Macha" | "Veerendra";
  uploadDate: string;
  url: string;
};

type DocumentCardProps = {
  document: Document;
  onDelete?: () => void;
};

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const getDocumentTypeIcon = (type: Document["type"]) => {
    switch (type) {
      case "research":
        return "📊";
      case "code":
        return "💻";
      case "presentation":
        return "📑";
      case "submission":
        return "📝";
      case "other":
      default:
        return "📄";
    }
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase() || "";
  };

  const getAssigneeColor = (assignee: Document["uploadedBy"]) => {
    switch (assignee) {
      case "Macha":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "Veerendra":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-start">
        <div className="text-3xl mr-3">
          {getDocumentTypeIcon(document.type)}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{document.name}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(document.uploadDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-1">
          <Button size="sm" variant="ghost" className="ml-2" asChild>
            <a href={document.url} target="_blank" rel="noopener noreferrer">
              <Download size={16} />
            </a>
          </Button>
          {onDelete && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-red-500 hover:text-red-700"
              onClick={onDelete}
            >
              ×
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge>{document.type}</Badge>
          <Badge variant="outline" className={getAssigneeColor(document.uploadedBy)}>
            {document.uploadedBy}
          </Badge>
          <Badge variant="secondary">{getFileExtension(document.name)}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
