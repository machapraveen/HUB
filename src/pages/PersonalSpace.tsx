import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSpace } from "@/contexts/SpaceContext";
import { useToast } from "@/hooks/use-toast";
import { SecurityCodeVerification } from "@/components/security/SecurityCodeVerification";

// Import services
import { fetchQuickTasks, createQuickTask, deleteQuickTask } from "@/services/quickTaskService";
import { fetchQuickAccess, createQuickAccess, deleteQuickAccess } from "@/services/quickAccessService";
import { fetchProjects } from "@/services/projectService";
import { fetchNotes, createNote, deleteNote } from "@/services/noteService";
import { fetchDocuments, deleteDocument } from "@/services/documentService";

// Import components
import { QuickTask } from "@/components/quick/QuickTask";
import { QuickAccessItem } from "@/components/quick/QuickAccess";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { DocumentUploadDialog } from "@/components/documents/DocumentUploadDialog";
import { QuickTaskDialog } from "@/components/quick/QuickTaskDialog";
import { QuickAccessDialog } from "@/components/quick/QuickAccessDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const PersonalSpace = () => {
  // Get the current user space from the URL
  const { userId, userSpace, securityVerified } = useSpace();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [documentUploadOpen, setDocumentUploadOpen] = useState(false);

  // Don't fetch data until security is verified
  const { data: quickTasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['quickTasks', userSpace],
    queryFn: () => fetchQuickTasks(userSpace),
    enabled: securityVerified,
  });

  const { data: quickAccess = [], isLoading: isLoadingLinks } = useQuery({
    queryKey: ['quickAccess', userSpace],
    queryFn: () => fetchQuickAccess(userSpace),
    enabled: securityVerified,
  });

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects', userSpace],
    queryFn: () => fetchProjects(userSpace),
    enabled: securityVerified,
  });

  const { data: notes = [], isLoading: isLoadingNotes } = useQuery({
    queryKey: ['notes', userSpace],
    queryFn: () => fetchNotes(userSpace),
    enabled: securityVerified,
  });

  const { data: documents = [], isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['documents', userSpace],
    queryFn: () => fetchDocuments(userSpace),
    enabled: securityVerified,
  });

  // Create quick task mutation
  const createTaskMutation = useMutation({
    mutationFn: createQuickTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickTasks'] });
      toast({
        title: "Task created",
        description: "Your new task has been added.",
      });
      setTaskDialogOpen(false);
    }
  });

  // Create quick access mutation
  const createLinkMutation = useMutation({
    mutationFn: createQuickAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickAccess'] });
      toast({
        title: "Link created",
        description: "Your new quick access link has been added.",
      });
      setLinkDialogOpen(false);
    }
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteQuickTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickTasks'] });
      toast({
        title: "Task deleted",
        description: "The task has been removed.",
      });
    }
  });

  // Delete link mutation
  const deleteAccessMutation = useMutation({
    mutationFn: (accessId: string) => deleteQuickAccess(accessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickAccess'] });
      toast({
        title: "Link deleted",
        description: "The quick access link has been removed.",
      });
    }
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => {
      return deleteNote(noteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: "Note deleted",
        description: "The note has been removed.",
      });
    }
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: string) => {
      return deleteDocument(documentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: "Document deleted",
        description: "The document has been removed.",
      });
    }
  });

  const handleCreateTask = (taskData: any) => {
    createTaskMutation.mutate({
      title: taskData.title,
      due_date: taskData.dueDate,
      user_space: taskData.userSpace // Use the selected space from dialog
    });
  };

  const handleCreateLink = (linkData: any) => {
    createLinkMutation.mutate({
      title: linkData.title,
      url: linkData.url,
      color: linkData.category,
      user_space: linkData.userSpace // Use the selected space from dialog
    });
  };

  const handleDocumentUploadComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  };

  const handleClickProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  // Show security verification if not verified
  if (userId && !securityVerified) {
    return <SecurityCodeVerification />;
  }

  // If trying to access a space directly without a valid userSpace value
  if (!userSpace) {
    return <Navigate to="/" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {userSpace === "Macha" ? "Macha's" : "Veerendra's"} Space
        </h1>
        <div className="flex space-x-2">
          <Button onClick={() => setTaskDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
          <Button onClick={() => setLinkDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Link
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="links">Quick Access</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="mt-6">
          <div className="space-y-4">
            {isLoadingTasks ? (
              <div>Loading tasks...</div>
            ) : quickTasks.length > 0 ? (
              quickTasks.map((task) => (
                <QuickTask 
                  key={task.id} 
                  task={task}
                  onDelete={() => deleteTaskMutation.mutate(task.id)}
                  onComplete={() => {/* Handle task completion */}}
                />
              ))
            ) : (
              <div className="text-center p-8">
                <p className="text-muted-foreground">No tasks added yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setTaskDialogOpen(true)}
                >
                  Add your first task
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="links" className="mt-6">
          <div className="space-y-4">
            {isLoadingLinks ? (
              <div>Loading links...</div>
            ) : quickAccess.length > 0 ? (
              quickAccess.map((link) => (
                <QuickAccessItem
                  key={link.id}
                  item={link}
                  onDelete={() => deleteAccessMutation.mutate(link.id)}
                />
              ))
            ) : (
              <div className="text-center p-8">
                <p className="text-muted-foreground">No quick access links added yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setLinkDialogOpen(true)}
                >
                  Add your first link
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoadingProjects ? (
              <div className="col-span-full text-center">Loading projects...</div>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={() => handleClickProject(project.id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center p-8">
                <p className="text-muted-foreground">No projects added yet</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Documents</h2>
            <Button onClick={() => setDocumentUploadOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Upload Document
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoadingDocuments ? (
              <div className="col-span-full text-center">Loading documents...</div>
            ) : documents.length > 0 ? (
              documents.map((doc) => (
                <DocumentCard 
                  key={doc.id} 
                  document={doc} 
                  onDelete={() => deleteDocumentMutation.mutate(doc.id)} 
                />
              ))
            ) : (
              <div className="col-span-full text-center p-8">
                <p className="text-muted-foreground">No documents uploaded yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setDocumentUploadOpen(true)}
                >
                  Upload your first document
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <QuickTaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onCreateTask={handleCreateTask}
      />
      
      <QuickAccessDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        onCreateLink={handleCreateLink}
      />
      
      <DocumentUploadDialog
        open={documentUploadOpen}
        onOpenChange={setDocumentUploadOpen}
        onUploadComplete={handleDocumentUploadComplete}
      />
      
      {/* Mobile quick action buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 md:hidden">
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={() => setDocumentUploadOpen(true)}>
          <Plus size={24} />
        </Button>
      </div>
    </div>
  );
};

export default PersonalSpace;