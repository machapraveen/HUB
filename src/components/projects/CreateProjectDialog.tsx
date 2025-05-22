
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Folder } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProjectColorOption = {
  value: string;
  label: string;
};

const projectColors: ProjectColorOption[] = [
  { value: "#8B5CF6", label: "Purple" },
  { value: "#D946EF", label: "Magenta" },
  { value: "#F97316", label: "Orange" },
  { value: "#0EA5E9", label: "Blue" },
  { value: "#10B981", label: "Green" },
  { value: "#EC4899", label: "Pink" },
  { value: "#6366F1", label: "Indigo" },
  { value: "#F59E0B", label: "Amber" }
];

type CreateProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (project: any) => void;
};

export function CreateProjectDialog({ open, onOpenChange, onCreateProject }: CreateProjectDialogProps) {
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState<string>(projectColors[0].value);
  const [assignedTo, setAssignedTo] = useState<"Macha" | "Veerendra" | "Both">("Both");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const project = {
      name: formData.get("name"),
      description: formData.get("description"),
      directoryPath: formData.get("directoryPath"),
      color: selectedColor,
      userId: assignedTo,
      createdDate: new Date().toISOString(),
      progress: 0
    };

    onCreateProject(project);
    toast({
      title: "Project created",
      description: "Your new project has been created successfully.",
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project name</Label>
              <Input id="name" name="name" placeholder="Enter project name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Project description</Label>
              <Textarea id="description" name="description" placeholder="Add a description..." rows={3} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="directoryPath">
                <div className="flex items-center">
                  <Folder className="w-4 h-4 mr-2" />
                  <span>Project directory path (optional)</span>
                </div>
              </Label>
              <Input id="directoryPath" name="directoryPath" placeholder="/path/to/your/project" />
            </div>
            
            <div className="grid gap-2">
              <Label>Assigned to</Label>
              <RadioGroup value={assignedTo} onValueChange={(val) => setAssignedTo(val as "Macha" | "Veerendra" | "Both")} className="flex space-x-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Macha" id="macha" />
                  <Label htmlFor="macha">Macha</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Veerendra" id="veerendra" />
                  <Label htmlFor="veerendra">Veerendra</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Both" id="both" />
                  <Label htmlFor="both">Both</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid gap-2">
              <Label>Project Color</Label>
              <div className="flex flex-wrap gap-2">
                {projectColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    aria-label={`Select ${color.label} color`}
                    className={`w-8 h-8 rounded-full transition-all ${
                      selectedColor === color.value ? 'ring-2 ring-offset-2 ring-offset-background' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color.value)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
