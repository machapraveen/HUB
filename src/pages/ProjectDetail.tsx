import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressRing } from "@/components/ProgressRing";
import { ChevronLeft, Folder, Calendar, Edit, Plus, Upload } from "lucide-react";
import { fetchProjectById } from "@/services/projectService";
import { fetchTasks, createTask, Task } from "@/services/taskService";
import { fetchCommunications, createCommunication, Communication } from "@/services/communicationService";
import { fetchDocuments, createDocument, deleteDocument } from "@/services/documentService";
import { TaskCard } from "@/components/tasks/TaskCard";
import { CommunicationList } from "@/components/communications/CommunicationList";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { useToast } from "@/hooks/use-toast";
import { useSpace } from "@/contexts/SpaceContext";
import { supabase } from "@/integrations/supabase/client";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userSpace } = useSpace();
  const queryClient = useQueryClient();
  
  // Dialog states
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showAddCommunicationDialog, setShowAddCommunicationDialog] = useState(false);
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch the project data
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id as string),
    enabled: !!id
  });

  // Fetch project tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', 'project', id],
    queryFn: () => fetchTasks(undefined, id as string),
    enabled: !!id
  });

  // Fetch project communications
  const { data: communications = [] } = useQuery({
    queryKey: ['communications', 'project', id],
    queryFn: () => fetchCommunications(undefined, id as string),
    enabled: !!id
  });

  // Fetch project documents
  const { data: documents = [] } = useQuery({
    queryKey: ['documents', 'project', id],
    queryFn: () => fetchDocuments(undefined, undefined, id as string),
    enabled: !!id
  });

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'project', id] });
      toast({
        title: "Task added",
        description: "Task has been added successfully.",
      });
      setShowAddTaskDialog(false);
    }
  });

  const createCommunicationMutation = useMutation({
    mutationFn: createCommunication,
    onSuccess: (newCommunication) => {
      queryClient.invalidateQueries({ queryKey: ['communications', 'project', id] });
      setSelectedCommunication(newCommunication);
      toast({
        title: "Communication added",
        description: "Communication has been added successfully.",
      });
      setShowAddCommunicationDialog(false);
    }
  });

  const createDocumentMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', 'project', id] });
      toast({
        title: "Document uploaded",
        description: "Document has been uploaded successfully.",
      });
      setShowAddDocumentDialog(false);
      setSelectedFile(null);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">Loading project details...</div>
    );
  }

  if (error || !project) {
    toast({
      title: "Error loading project",
      description: "Unable to load the project details",
      variant: "destructive",
    });
    
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/projects">Return to Projects</Link>
        </Button>
      </div>
    );
  }

  const getUserColor = (userId: string) => {
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
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    createTaskMutation.mutate({
      project_id: id || "",
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      assigned_to: formData.get("assignedTo") as "Macha" | "Veerendra" | "Both",
      due_date: formData.get("dueDate") as string || undefined,
      priority: formData.get("priority") as "low" | "medium" | "high"
    });
  };

  const handleAddCommunication = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    createCommunicationMutation.mutate({
      project_id: id || "",
      sender: formData.get("sender") as string,
      subject: formData.get("subject") as string,
      content: formData.get("content") as string,
      important: formData.get("important") === "true"
    });
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !userSpace) return;
    
    setUploadingDocument(true);
    
    try {
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `projects/${id}/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      // Save document metadata to database
      createDocumentMutation.mutate({
        name: formData.get("name") as string,
        type: formData.get("type") as "research" | "code" | "presentation" | "submission" | "other",
        uploaded_by: formData.get("uploadedBy") as "Macha" | "Veerendra",
        url: publicUrl,
        project_id: id
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document",
        variant: "destructive"
      });
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDocument(documentId).then(() => {
        queryClient.invalidateQueries({ queryKey: ['documents', 'project', id] });
        toast({
          title: "Document deleted",
          description: "Document has been deleted successfully.",
        });
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link to="/projects" className="mr-2">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{project.name}</h1>
            <div className="flex items-center mt-1 gap-2">
              <Badge className={getUserColor(project.userId)}>
                {project.userId}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Created on {formatDate(project.createdDate)}
              </span>
            </div>
          </div>
        </div>
        <Button onClick={() => navigate(`/projects/edit/${project.id}`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Information about this project</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{project.description || "No description provided."}</p>
            
            {project.directoryPath && (
              <div className="flex items-center mt-4 text-sm p-2 bg-muted rounded-md">
                <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
                <code className="text-muted-foreground font-mono">{project.directoryPath}</code>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Current completion status</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ProgressRing percentage={project.progress} size={120} strokeWidth={8} showPercentage={true} />
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate(`/projects/edit/${project.id}`)}>Update Progress</Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="communications">Communications ({communications.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <Button onClick={() => setShowAddTaskDialog(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.length > 0 ? (
              tasks.map((task) => (
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
              communications={communications} 
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
            {documents.length > 0 ? (
              documents.map((document) => (
                <DocumentCard 
                  key={document.id} 
                  document={document} 
                  onDelete={() => handleDeleteDocument(document.id)}
                />
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
              <Button type="submit" disabled={createTaskMutation.isPending}>
                {createTaskMutation.isPending ? "Adding..." : "Add Task"}
              </Button>
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
                <Input id="subject" name="subject" placeholder="Communication subject" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  placeholder="Communication content..."
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
              <Button type="submit" disabled={createCommunicationMutation.isPending}>
                {createCommunicationMutation.isPending ? "Adding..." : "Add Communication"}
              </Button>
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
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Enter document name" 
                  defaultValue={selectedFile?.name || ""}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Document Type</Label>
                <Select name="type" defaultValue="other">
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
                <Select name="uploadedBy" defaultValue={userSpace || "Macha"}>
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
                <div className="border-2 border-dashed rounded-md p-6">
                  {selectedFile ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{selectedFile.name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to select file</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    id="documentFile" 
                    onChange={handleFileChange}
                    className="hidden"
                    required={!selectedFile}
                  />
                  <Button 
                    type="button"
                    variant="secondary"
                    className="mt-2 w-full"
                    onClick={() => document.getElementById("documentFile")?.click()}
                  >
                    {selectedFile ? "Change File" : "Select File"}
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={uploadingDocument || !selectedFile}
              >
                {uploadingDocument ? "Uploading..." : "Upload Document"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;