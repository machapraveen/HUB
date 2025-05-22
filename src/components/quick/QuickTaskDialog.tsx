import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [selectedSpace, setSelectedSpace] = useState<"Macha" | "Veerendra" | "Both">("Both");
  
  // Set default space based on current context
  useState(() => {
    if (!userId || !userSpace || userSpace === "Both") {
      setSelectedSpace("Both");
    } else {
      setSelectedSpace(userSpace);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create task data
    const taskData = {
      title,
      dueDate: dueDate || undefined,
      userSpace: selectedSpace
    };
    
    // Pass data to parent component
    onCreateTask(taskData);
    
    // Reset form and close dialog
    setTitle("");
    setDueDate("");
    setSelectedSpace("Both");
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
              <Label>Visible To</Label>
              <RadioGroup value={selectedSpace} onValueChange={(val) => setSelectedSpace(val as "Macha" | "Veerendra" | "Both")} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Macha" id="task-macha" />
                  <Label htmlFor="task-macha">Macha</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Veerendra" id="task-veerendra" />
                  <Label htmlFor="task-veerendra">Veerendra</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Both" id="task-both" />
                  <Label htmlFor="task-both">Both</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                {selectedSpace === "Both" 
                  ? "This task will be shared and visible to both team members."
                  : `This task will be visible in ${selectedSpace}'s space.`
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