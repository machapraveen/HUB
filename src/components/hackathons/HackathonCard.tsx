
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/ProgressRing";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, Award, Code, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export type HackathonStatus = "upcoming" | "active" | "completed" | "past";
export type EventType = "hackathon" | "competition" | "quiz" | "workshop" | "other";

export type Hackathon = {
  id: string;
  title: string;
  organizer: string;
  startDate: string;
  endDate: string;
  status: HackathonStatus;
  progress: number;
  platform: string;
  location?: string;
  type?: EventType;
};

type HackathonCardProps = {
  hackathon: Hackathon;
};

export function HackathonCard({ hackathon }: HackathonCardProps) {
  const getStatusColor = (status: HackathonStatus) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "";
    }
  };

  const getTypeColor = (type?: EventType) => {
    switch (type) {
      case "hackathon":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "competition":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "quiz":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "workshop":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getTypeIcon = (type?: EventType) => {
    switch (type) {
      case "hackathon":
        return <Code size={14} />;
      case "competition":
        return <Award size={14} />;
      case "quiz":
        return <Brain size={14} />;
      default:
        return <Award size={14} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <Card className="overflow-hidden border hover:shadow-md transition-shadow">
      <Link to={`/hackathons/${hackathon.id}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{hackathon.title}</CardTitle>
              <CardDescription>{hackathon.organizer}</CardDescription>
            </div>
            <Badge className={cn("ml-2", getStatusColor(hackathon.status))}>
              {hackathon.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={14} className="mr-1" />
            <span>
              {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
            </span>
          </div>
          <div className="text-sm my-1">
            <span className="text-muted-foreground">Platform: </span>
            <span>{hackathon.platform}</span>
          </div>
          {hackathon.location && (
            <div className="text-sm">
              <span className="text-muted-foreground">Location: </span>
              <span>{hackathon.location}</span>
            </div>
          )}
          {hackathon.type && (
            <div className="mt-2">
              <Badge variant="outline" className={cn(getTypeColor(hackathon.type))}>
                <span className="flex items-center">
                  {getTypeIcon(hackathon.type)}
                  <span className="ml-1 capitalize">{hackathon.type}</span>
                </span>
              </Badge>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">Progress</div>
          <ProgressRing percentage={hackathon.progress} size={40} />
        </CardFooter>
      </Link>
    </Card>
  );
}
