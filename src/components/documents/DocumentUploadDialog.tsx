
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createDocument } from "@/services/documentService";
import { supabase } from "@/integrations/supabase/client";
import { useSpace } from "@/contexts/SpaceContext";
import { File, Upload } from "lucide-react";

type DocumentUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
};

export function DocumentUploadDialog({ 
  open, 
  onOpenChange,
  onUploadComplete 
}: DocumentUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<"research" | "code" | "presentation" | "submission" | "other">("other");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { userSpace } = useSpace();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !userSpace) return;
    
    setIsUploading(true);
    
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${userSpace.toLowerCase()}/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // 2. Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      // 3. Save document metadata to database
      await createDocument({
        name: file.name,
        type: documentType,
        uploaded_by: userSpace as "Macha" | "Veerendra",
        url: publicUrl
      });
      
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully"
      });
      
      onUploadComplete();
      onOpenChange(false);
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="document-type">Document Type</Label>
            <Select
              value={documentType}
              onValueChange={(value) => setDocumentType(value as any)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
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

          <div>
            <Label htmlFor="file">Upload File</Label>
            <div className="mt-2">
              {file ? (
                <div className="flex items-center p-2 bg-muted rounded-md">
                  <File className="h-4 w-4 mr-2" />
                  <span className="text-sm truncate">{file.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setFile(null)}
                    className="ml-auto"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to browse or drag and drop
                  </p>
                  <Input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => document.getElementById("file")?.click()}
                  >
                    Select File
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
