import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type QuickAccess = {
  id: string;
  userId: "Macha" | "Veerendra" | "Both";
  title: string;
  url: string;
  createdDate: string;
  category?: string;
};

type QuickAccessRow = Database["public"]["Tables"]["quick_access"]["Row"];
type QuickAccessInsert = Database["public"]["Tables"]["quick_access"]["Insert"];

export const fetchQuickAccess = async (userSpace?: "Macha" | "Veerendra" | "Both") => {
  let query = supabase.from("quick_access").select("*");
  
  if (userSpace) {
    if (userSpace === "Both") {
      // For dashboard or shared view, get only "Both" links
      query = query.eq("user_space", "Both");
    } else {
      // For specific user space, get user-specific links AND shared links
      query = query.or(`user_space.eq.${userSpace},user_space.eq.Both`);
    }
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching quick access:", error);
    throw error;
  }

  return data.map(convertQuickAccessRowToQuickAccess);
};

export const createQuickAccess = async (link: Omit<QuickAccessInsert, "id" | "created_at">) => {
  const { data, error } = await supabase.from("quick_access").insert(link).select().single();

  if (error) {
    console.error("Error creating quick access:", error);
    throw error;
  }

  return convertQuickAccessRowToQuickAccess(data);
};

export const deleteQuickAccess = async (id: string) => {
  const { error } = await supabase.from("quick_access").delete().eq("id", id);

  if (error) {
    console.error("Error deleting quick access:", error);
    throw error;
  }
  
  // Return a promise to be compatible with React Query mutations
  return Promise.resolve();
};

// Helper function to convert database row to QuickAccess object
const convertQuickAccessRowToQuickAccess = (row: QuickAccessRow): QuickAccess => {
  return {
    id: row.id as string,
    userId: row.user_space,
    title: row.title,
    url: row.url,
    createdDate: new Date(row.created_at).toISOString(),
    category: row.color // Using color field as category for now
  };
};