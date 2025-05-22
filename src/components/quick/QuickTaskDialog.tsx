
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
  const { userSpace } = useSpace();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create task data
    const taskData = {
      title,
      dueDate: dueDate || undefined,
      userSpace: userSpace || "Both"
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
                {userSpace || "Both"}
              </div>
              <p className="text-xs text-muted-foreground">
                Tasks are created for your current space.
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
