
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSpace } from "@/contexts/SpaceContext";

export type QuickAccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateLink: (link: { title: string; url: string; category?: string; userSpace: string }) => void;
};

export function QuickAccessDialog({ open, onOpenChange, onCreateLink }: QuickAccessDialogProps) {
  const { userSpace } = useSpace();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("none");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure URL has protocol
    let formattedUrl = url;
    if (formattedUrl && !formattedUrl.startsWith('http')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    // Create link data
    const linkData = {
      title,
      url: formattedUrl,
      category: category === "none" ? undefined : category,
      userSpace: userSpace || "Both"
    };
    
    // Pass data to parent component
    onCreateLink(linkData);
    
    // Reset form and close dialog
    setTitle("");
    setUrl("");
    setCategory("none");
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Quick Access Link</DialogTitle>
          <DialogDescription>Add a new quick access link to your dashboard.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Link Title</Label>
              <Input
                id="title"
                placeholder="Enter link title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="Enter URL (e.g. example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="hackathon">Hackathon</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="collaboration">Collaboration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="userSpace">Visible To</Label>
              <div className="bg-muted p-2 rounded-md text-sm">
                {userSpace || "Both"}
              </div>
              <p className="text-xs text-muted-foreground">
                Links are created for your current space.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Link</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
