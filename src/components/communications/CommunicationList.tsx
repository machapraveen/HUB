
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Communication } from "@/data/mockData";

type CommunicationListProps = {
  communications: Communication[];
  onSelectCommunication: (communication: Communication) => void;
};

export function CommunicationList({ communications, onSelectCommunication }: CommunicationListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (communication: Communication) => {
    setSelectedId(communication.id);
    onSelectCommunication(communication);
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Communications</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {communications.length > 0 ? (
            communications.map((communication) => (
              <Button
                key={communication.id}
                variant="ghost"
                className="w-full justify-start px-4 py-3 h-auto text-left"
                onClick={() => handleSelect(communication)}
              >
                <div
                  className={`flex flex-col w-full ${
                    selectedId === communication.id ? "font-semibold" : ""
                  } ${!communication.read ? "font-medium" : ""}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="truncate max-w-[70%]">{communication.sender}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(communication.date)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="truncate max-w-[80%]">{communication.subject}</span>
                    {communication.important && (
                      <Badge variant="outline" className="ml-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        Important
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 truncate">
                    {communication.content.substring(0, 60)}...
                  </div>
                </div>
              </Button>
            ))
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              No communications yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
