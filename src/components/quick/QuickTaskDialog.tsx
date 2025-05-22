import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSpace } from "@/contexts/SpaceContext";

export type QuickTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: { title: string; dueDate?: string; userSpace: string }) => void;
};

export function QuickTaskDialog({ open, onOpenChange, onCreateTask }: QuickTaskDialogProps) {
  const { userSpace, userId } = useSpace();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  // Determine the correct space to show
  const getDisplaySpace = () => {
    // If we're in dashboard (no specific user), show "Both"
    if (!userId || !userSpace || userSpace === "Both") {
      return "Both";
    }
    // If we're in a specific user space, show that space
    return userSpace;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create task data
    const taskData = {
      title,
      dueDate: dueDate || undefined,
      userSpace: getDisplaySpace()
    };
    
    // Pass data to parent component
    onCreateTask(taskData);
    
    // Reset form and close dialog
    setTitle("");
    setDueDate("");
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Quick Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="userSpace">Visible To</Label>
              <div className="bg-muted p-2 rounded-md text-sm">
                {getDisplaySpace()}
              </div>
              <p className="text-xs text-muted-foreground">
                {getDisplaySpace() === "Both" 
                  ? "This task will be shared and visible to both team members."
                  : `This task will be visible in ${getDisplaySpace()}'s space.`
                }
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}