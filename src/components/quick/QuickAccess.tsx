
import { useState } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuickAccess } from "@/data/mockData";
import { cn } from "@/lib/utils";

type QuickAccessProps = {
  item: QuickAccess;
  onDelete: (id: string) => void;
};

export function QuickAccessItem({ item, onDelete }: QuickAccessProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getUserColor = (userId: QuickAccess["userId"]) => {
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

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "hackathon":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300";
      case "research":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "collaboration":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleOpenLink = () => {
    window.open(item.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-between py-3 px-4 rounded-lg transition-all",
        "bg-card hover:bg-accent/5",
        "border"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={handleOpenLink}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium cursor-pointer hover:underline" onClick={handleOpenLink}>
            {item.title}
          </span>
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <Badge variant="outline" className={getUserColor(item.userId)}>
              {item.userId}
            </Badge>
            {item.category && (
              <Badge variant="outline" className={getCategoryColor(item.category)}>
                {item.category}
              </Badge>
            )}
            <div className="text-muted-foreground text-xs truncate max-w-[200px]">
              {item.url}
            </div>
          </div>
        </div>
      </div>
      {isHovered && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete link</span>
        </Button>
      )}
    </div>
  );
}
