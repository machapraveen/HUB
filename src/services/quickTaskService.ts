import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type QuickTask = {
  id: string;
  userId: "Macha" | "Veerendra" | "Both";
  title: string;
  completed: boolean;
  dueDate?: string;
  createdDate: string;
};

type QuickTaskRow = Database["public"]["Tables"]["quick_tasks"]["Row"];
type QuickTaskInsert = Database["public"]["Tables"]["quick_tasks"]["Insert"];

export const fetchQuickTasks = async (userSpace?: "Macha" | "Veerendra" | "Both") => {
  let query = supabase.from("quick_tasks").select("*");
  
  if (userSpace) {
    if (userSpace === "Both") {
      // For dashboard or shared view, get only "Both" tasks
      query = query.eq("user_space", "Both");
    } else {
      // For specific user space, get user-specific tasks AND shared tasks
      query = query.or(`user_space.eq.${userSpace},user_space.eq.Both`);
    }
  }

  const { data, error } = await query.order("created_date", { ascending: false });

  if (error) {
    console.error("Error fetching quick tasks:", error);
    throw error;
  }

  return data.map(convertQuickTaskRowToQuickTask);
};

export const createQuickTask = async (task: Omit<QuickTaskInsert, "id" | "created_date">) => {
  const { data, error } = await supabase.from("quick_tasks").insert(task).select().single();

  if (error) {
    console.error("Error creating quick task:", error);
    throw error;
  }

  return convertQuickTaskRowToQuickTask(data);
};

export const updateQuickTask = async (id: string, task: Partial<QuickTaskInsert>) => {
  const { data, error } = await supabase
    .from("quick_tasks")
    .update(task)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating quick task:", error);
    throw error;
  }

  return convertQuickTaskRowToQuickTask(data);
};

export const deleteQuickTask = async (id: string) => {
  const { error } = await supabase.from("quick_tasks").delete().eq("id", id);

  if (error) {
    console.error("Error deleting quick task:", error);
    throw error;
  }
  
  // Return a promise to be compatible with React Query mutations
  return Promise.resolve();
};

// Helper function to convert database row to QuickTask object
const convertQuickTaskRowToQuickTask = (row: QuickTaskRow): QuickTask => {
  return {
    id: row.id as string,
    userId: row.user_space,
    title: row.title,
    completed: row.completed,
    dueDate: row.due_date ? new Date(row.due_date).toISOString() : undefined,
    createdDate: new Date(row.created_date).toISOString()
  };
};