
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Document } from "@/components/documents/DocumentCard";

type DocumentInsert = {
  name: string;
  type: "research" | "code" | "presentation" | "submission" | "other";
  uploaded_by: "Macha" | "Veerendra";
  url: string;
  hackathon_id?: string;
};

export const fetchDocuments = async (userSpace?: "Macha" | "Veerendra" | "Both") => {
  let query = supabase.from("documents").select("*");
  
  if (userSpace) {
    if (userSpace === "Both") {
      // Only get projects specifically marked as "Both"
      query = query.eq("uploaded_by", "Both");
    } else {
      // Get documents for this user or marked as "Both"
      query = query.or(`uploaded_by.eq.${userSpace},uploaded_by.eq.Both`);
    }
  }

  const { data, error } = await query.order("upload_date", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }

  return data.map(convertDatabaseRowToDocument);
};

export const createDocument = async (document: DocumentInsert) => {
  const { data, error } = await supabase.from("documents").insert(document).select().single();

  if (error) {
    console.error("Error creating document:", error);
    throw error;
  }

  return convertDatabaseRowToDocument(data);
};

export const deleteDocument = async (id: string) => {
  const { error } = await supabase.from("documents").delete().eq("id", id);

  if (error) {
    console.error("Error deleting document:", error);
    throw error;
  }

  return Promise.resolve();
};

// Helper function to convert database row to Document object
const convertDatabaseRowToDocument = (row: any): Document => {
  return {
    id: row.id,
    hackathonId: row.hackathon_id || "",
    name: row.name,
    type: row.type,
    uploadedBy: row.uploaded_by,
    uploadDate: row.upload_date,
    url: row.url
  };
};
