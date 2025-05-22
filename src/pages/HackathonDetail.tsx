
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ProgressRing } from "@/components/ProgressRing";
import { CommunicationList } from "@/components/communications/CommunicationList";
import { TaskCard } from "@/components/tasks/TaskCard";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { communications, tasks, documents, Communication, Document, Task } from "@/data/mockData";
import { Hackathon, EventType, fetchEventById, updateEvent } from "@/services/eventService";
import { ChevronLeft, Plus, Upload } from "lucide-react";

const HackathonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showAddCommunicationDialog, setShowAddCommunicationDialog] = useState(false);
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);
  const [showEditHackathonDialog, setShowEditHackathonDialog] = useState(false);
  const [tasksList, setTasksList] = useState(tasks);
  const [communicationsList, setCommunicationsList] = useState(communications);
  const [documentsList, setDocumentsList] = useState(documents);
  
  // Fetch the hackathon data
  const { data: hackathon, isLoading, error } = useQuery({
    queryKey: ['hackathon', id],
    queryFn: () => fetchEventById(id as string),
    enabled: !!id
  });
  
  // Filter communications, tasks and documents for this hackathon
  const hackathonCommunications = communicationsList.filter(c => c.hackathonId === id);
  const hackathonTasks = tasksList.filter(t => t.hackathonId === id);
  const hackathonDocuments = documentsList.filter(d => d.hackathonId === id);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading event details...</div>;
  }

  if (error || !hackathon) {
    toast({
      title: "Error loading event",
      description: "Unable to load the event details",
      variant: "destructive",
    });
    
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
        <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/hackathons">Return to Events</Link>
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
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

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "hackathon":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "competition":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "quiz":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "workshop":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    const newTask: Task = {
      id: (tasksList.length + 1).toString(),
      hackathonId: id || "",
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      assignedTo: formData.get("assignedTo") as "Macha" | "Veerendra" | "Both",
      status: "todo",
      dueDate: formData.get("dueDate") as string | undefined,
      priority: formData.get("priority") as "low" | "medium" | "high"
    };
    
    setTasksList([...tasksList, newTask]);
    setShowAddTaskDialog(false);
    
    toast({
      title: "Task added",
      description: `"${newTask.title}" has been added successfully.`,
    });
  };

  const handleAddCommunication = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    const newCommunication: Communication = {
      id: (communicationsList.length + 1).toString(),
      hackathonId: id || "",
      sender: formData.get("sender") as string,
      subject: formData.get("subject") as string,
      content: formData.get("content") as string,
      date: new Date().toISOString(),
      read: false,
      important: formData.get("important") === "true"
    };
    
    setCommunicationsList([...communicationsList, newCommunication]);
    setSelectedCommunication(newCommunication);
    setShowAddCommunicationDialog(false);
    
    toast({
      title: "Communication added",
      description: `"${newCommunication.subject}" has been added successfully.`,
    });
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    const newDocument: Document = {
      id: (documentsList.length + 1).toString(),
      hackathonId: id || "",
      name: formData.get("name") as string,
      type: formData.get("type") as "research" | "code" | "presentation" | "submission" | "other",
      uploadedBy: formData.get("uploadedBy") as "Macha" | "Veerendra",
      uploadDate: new Date().toISOString(),
      url: "#" // In a real app this would be the document URL
    };
    
    setDocumentsList([...documentsList, newDocument]);
    setShowAddDocumentDialog(false);
    
    toast({
      title: "Document added",
      description: `"${newDocument.name}" has been added successfully.`,
    });
  };
  
  const handleEditHackathon = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    const updatedHackathonData = {
      title: formData.get("title") as string,
      organizer: formData.get("organizer") as string,
      platform: formData.get("platform") as string,
      start_date: formData.get("startDate") as string,
      end_date: formData.get("endDate") as string,
      location: formData.get("location") as string || undefined,
      type: formData.get("type") as EventType || undefined,
      // We need to convert progress to a number for the database
      progress: parseInt(formData.get("progress") as string)
    };
    
    // Update the hackathon in the database
    updateEvent(id as string, updatedHackathonData)
      .then(() => {
        setShowEditHackathonDialog(false);
        
        toast({
          title: "Event updated",
          description: `"${updatedHackathonData.title}" has been updated successfully.`,
        });
        
        // Refetch the hackathon data
        window.location.reload();
      })
      .catch(error => {
        toast({
          title: "Error updating event",
          description: "An error occurred while updating the event.",
          variant: "destructive",
        });
        console.error("Error updating event:", error);
      });
  };

  const handleProgressUpdate = () => {
    setShowEditHackathonDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link to="/hackathons" className="mr-2">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{hackathon.title}</h1>
            <div className="flex flex-wrap items-center mt-1 gap-2">
              <Badge className={getStatusColor(hackathon.status)}>
                {hackathon.status}
              </Badge>
              {hackathon.type && (
                <Badge className={getTypeColor(hackathon.type)}>
                  {hackathon.type}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button onClick={() => setShowEditHackathonDialog(true)}>Edit Event</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Information about this event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-medium">Organizer</h3>
                <p className="text-muted-foreground">{hackathon.organizer}</p>
              </div>
              <div>
                <h3 className="font-medium">Platform</h3>
                <p className="text-muted-foreground">{hackathon.platform}</p>
              </div>
              <div>
                <h3 className="font-medium">Dates</h3>
                <p className="text-muted-foreground">
                  {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                </p>
              </div>
              {hackathon.location && (
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-muted-foreground">{hackathon.location}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Current completion status</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ProgressRing percentage={hackathon.progress} size={120} strokeWidth={8} showPercentage={true} />
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleProgressUpdate}>Update Progress</Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <Button onClick={() => setShowAddTaskDialog(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hackathonTasks.length > 0 ? (
              hackathonTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <p className="text-muted-foreground mb-4">No tasks added yet</p>
                <Button onClick={() => setShowAddTaskDialog(true)}>Add your first task</Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="communications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Communications</h2>
            <Button onClick={() => setShowAddCommunicationDialog(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Communication
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <CommunicationList 
              communications={hackathonCommunications} 
              onSelectCommunication={setSelectedCommunication}
            />
            
            <Card>
              {selectedCommunication ? (
                <>
                  <CardHeader>
                    <div className="text-sm text-muted-foreground mb-1">
                      From: {selectedCommunication.sender}
                    </div>
                    <CardTitle className="text-xl">{selectedCommunication.subject}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {new Date(selectedCommunication.date).toLocaleString()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{selectedCommunication.content}</p>
                  </CardContent>
                </>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Select a communication to view details</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Documents</h2>
            <Button onClick={() => setShowAddDocumentDialog(true)}>
              <Plus className="mr-2 h-4 w-4" /> Upload Document
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hackathonDocuments.length > 0 ? (
              hackathonDocuments.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <p className="text-muted-foreground mb-4">No documents uploaded yet</p>
                <Button onClick={() => setShowAddDocumentDialog(true)}>Upload your first document</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" name="title" placeholder="Enter task title" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Describe the task..."
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select name="assignedTo" defaultValue="Both">
                    <SelectTrigger>
                      <SelectValue placeholder="Select person" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Macha">Macha</SelectItem>
                      <SelectItem value="Veerendra">Veerendra</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Input id="dueDate" name="dueDate" type="date" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Add Communication Dialog */}
      <Dialog open={showAddCommunicationDialog} onOpenChange={setShowAddCommunicationDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Communication</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCommunication} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="sender">Sender Email</Label>
                <Input id="sender" name="sender" placeholder="example@organization.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="Email subject" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Email Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  placeholder="Email body content..."
                  rows={6}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="important" 
                  name="important" 
                  value="true"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="important">Mark as important</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Communication</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Add Document Dialog */}
      <Dialog open={showAddDocumentDialog} onOpenChange={setShowAddDocumentDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Upload New Document</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDocument} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Document Name</Label>
                <Input id="name" name="name" placeholder="Enter document name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Document Type</Label>
                <Select name="type" defaultValue="submission">
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="submission">Submission</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="uploadedBy">Uploaded By</Label>
                <Select name="uploadedBy" defaultValue="Macha">
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Macha">Macha</SelectItem>
                    <SelectItem value="Veerendra">Veerendra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="documentFile">Document File</Label>
                <div className="border-2 border-dashed rounded-md p-6 cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                  </div>
                  <input 
                    type="file" 
                    id="documentFile" 
                    className="hidden"
                    // In a real app, this would handle file upload
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Upload Document</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Hackathon Dialog */}
      <Dialog open={showEditHackathonDialog} onOpenChange={setShowEditHackathonDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditHackathon} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" name="title" defaultValue={hackathon.title} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Event Type</Label>
                <Select name="type" defaultValue={hackathon.type || "hackathon"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input id="organizer" name="organizer" defaultValue={hackathon.organizer} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="platform">Platform</Label>
                <Input id="platform" name="platform" defaultValue={hackathon.platform} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    name="startDate" 
                    type="date"
                    defaultValue={hackathon.startDate}
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input 
                    id="endDate" 
                    name="endDate" 
                    type="date"
                    defaultValue={hackathon.endDate}
                    required 
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input 
                  id="location" 
                  name="location"
                  defaultValue={hackathon.location}
                  placeholder="Enter location or 'Online'" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="progress">Progress</Label>
                <Input 
                  id="progress" 
                  name="progress" 
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  defaultValue={hackathon.progress.toString()}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>{hackathon.progress}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HackathonDetail;
