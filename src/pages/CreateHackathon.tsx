import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSpace } from "@/contexts/SpaceContext";
import { createEvent, EventType } from "@/services/eventService";
import { toast } from "@/hooks/use-toast";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CreateHackathon = () => {
  const navigate = useNavigate();
  const { userSpace } = useSpace();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<EventType>("hackathon");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event created",
        description: "Your new event has been created successfully."
      });
      navigate("/hackathons");
    },
    onError: (error) => {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your event.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !organizer || !platform || !startDate || !endDate) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Determine status based on dates
    const now = new Date();
    let status: "upcoming" | "active" | "completed" = "upcoming";
    
    if (startDate && endDate) {
      if (now < startDate) {
        status = "upcoming";
      } else if (now > endDate) {
        status = "completed";
      } else {
        status = "active";
      }
    }
    
    createEventMutation.mutate({
      title,
      organizer,
      platform,
      location: location || undefined,
      description: description || undefined,
      type,
      start_date: startDate?.toISOString() || new Date().toISOString(),
      end_date: endDate?.toISOString() || new Date().toISOString(),
      status,
      user_space: userSpace || "Both"
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
        <Button variant="outline" onClick={() => navigate("/hackathons")}>
          Cancel
        </Button>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="title">Event Title *</Label>
              <Input 
                id="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="organizer">Organizer *</Label>
              <Input 
                id="organizer" 
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="Organization or person"
                required
              />
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description"
                rows={4}
              />
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="eventType">Event Type *</Label>
              <Select value={type} onValueChange={(value) => setType(value as EventType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hackathon">Hackathon</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="startDate">Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="endDate">End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="platform">Platform *</Label>
              <Input 
                id="platform" 
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="E.g., Devfolio, Unstop, In-person"
                required
              />
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input 
                id="location" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="E.g., Online, City name, or specific address"
              />
            </div>
            
            <div className="grid gap-3">
              <Label>Visible To</Label>
              <div className="bg-muted p-2 rounded-md text-sm">
                {userSpace || "Both"}
              </div>
              <p className="text-xs text-muted-foreground">
                Event will be created for your current space.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateHackathon;
