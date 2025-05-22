
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "@/services/eventService";
import { useSpace } from "@/contexts/SpaceContext";

// Import components
import { HackathonCard } from "@/components/hackathons/HackathonCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Filter } from "lucide-react";

// Define valid event types to match what the backend accepts
type EventType = "hackathon" | "competition" | "quiz" | "workshop";

const Hackathons = () => {
  const navigate = useNavigate();
  const { userSpace } = useSpace();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<EventType | "all">("all");
  
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', 'all', userSpace],
    queryFn: () => fetchEvents(userSpace)
  });
  
  // Filter events based on search query and selected type
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType !== "all" ? event.type === selectedType : true;
    return matchesSearch && matchesType;
  });
  
  const activeEvents = filteredEvents.filter(event => event.status === "active");
  const upcomingEvents = filteredEvents.filter(event => event.status === "upcoming");
  // Fix the type check to match "completed" status
  const pastEvents = filteredEvents.filter(event => 
    event.status === "completed"
  );
  
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Hackathons & Events</h1>
        <Button onClick={() => navigate('/hackathons/create')}>Create Event</Button>
      </div>
      
      {/* Search and filter bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedType} onValueChange={(value) => setSelectedType(value as EventType | "all")}>
          <SelectTrigger>
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <span>{selectedType === "all" ? "Filter by type" : selectedType}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="hackathon">Hackathon</SelectItem>
            <SelectItem value="competition">Competition</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={clearFilters} disabled={!searchQuery && selectedType === "all"}>
          Clear filters
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">Loading events...</div>
      ) : (
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">
              Active <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold">
                {activeEvents.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold">
                {upcomingEvents.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="past">
              Past <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold">
                {pastEvents.length}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="pt-4">
            {activeEvents.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeEvents.map(hackathon => (
                  <HackathonCard key={hackathon.id} hackathon={hackathon} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-2">No active events</h3>
                <p className="text-muted-foreground">
                  There are no active events right now.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="pt-4">
            {upcomingEvents.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map(hackathon => (
                  <HackathonCard key={hackathon.id} hackathon={hackathon} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
                <p className="text-muted-foreground">
                  Check back later for upcoming events.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="pt-4">
            {pastEvents.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map(hackathon => (
                  <HackathonCard key={hackathon.id} hackathon={hackathon} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-2">No past events</h3>
                <p className="text-muted-foreground">
                  There are no past events to display.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Hackathons;
