
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type Note = {
  id: string;
  userId: "Macha" | "Veerendra" | "Both";
  title: string;
  content?: string;
  tags?: string[];
  category?: string;
  progress: number;
  createdDate: string;
};

type NoteRow = Database["public"]["Tables"]["notes"]["Row"];
type NoteInsert = Database["public"]["Tables"]["notes"]["Insert"];

export const fetchNotes = async (userSpace?: "Macha" | "Veerendra" | "Both") => {
  let query = supabase.from("notes").select("*");
  
  if (userSpace) {
    if (userSpace === "Both") {
      query = query.eq("user_space", "Both");
    } else {
      query = query.or(`user_space.eq.${userSpace},user_space.eq.Both`);
    }
  }

  const { data, error } = await query.order("date", { ascending: false });

  if (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }

  return data.map(convertNoteRowToNote);
};

export const createNote = async (note: Omit<NoteInsert, "id" | "date">) => {
  const { data, error } = await supabase.from("notes").insert(note).select().single();

  if (error) {
    console.error("Error creating note:", error);
    throw error;
  }

  return convertNoteRowToNote(data);
};

export const updateNote = async (id: string, note: Partial<NoteInsert>) => {
  const { data, error } = await supabase
    .from("notes")
    .update(note)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating note:", error);
    throw error;
  }

  return convertNoteRowToNote(data);
};

export const deleteNote = async (id: string) => {
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
  
  // Return a promise to be compatible with React Query mutations
  return Promise.resolve();
};

// Helper function to convert database row to Note object
const convertNoteRowToNote = (row: NoteRow): Note => {
  return {
    id: row.id as string,
    userId: row.user_space,
    title: row.title,
    content: row.content || undefined,
    tags: row.tags || undefined,
    category: row.category || undefined,
    progress: row.progress,
    createdDate: new Date(row.date).toISOString()
  };
};
