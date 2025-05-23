import { supabase } from "@/integrations/supabase/client";

export type Task = {
  id: string;
  hackathonId?: string;
  projectId?: string;
  title: string;
  description: string;
  assignedTo: "Macha" | "Veerendra" | "Both";
  status: "todo" | "in-progress" | "done";
  dueDate?: string;
  priority: "low" | "medium" | "high";
  createdDate: string;
};

type TaskInsert = {
  hackathon_id?: string;
  project_id?: string;
  title: string;
  description: string;
  assigned_to: "Macha" | "Veerendra" | "Both";
  status?: "todo" | "in-progress" | "done";
  due_date?: string;
  priority: "low" | "medium" | "high";
};

export const fetchTasks = async (hackathonId?: string, projectId?: string) => {
  let query = supabase.from("tasks").select("*");
  
  if (hackathonId) {
    query = query.eq("hackathon_id", hackathonId);
  } else if (projectId) {
    query = query.eq("project_id", projectId);
  }
  
  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }

  return data.map(convertTaskRowToTask);
};

export const createTask = async (task: TaskInsert) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select()
    .single();

  if (error) {
    console.error("Error creating task:", error);
    throw error;
  }

  return convertTaskRowToTask(data);
};

export const updateTask = async (id: string, updates: Partial<TaskInsert>) => {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating task:", error);
    throw error;
  }

  return convertTaskRowToTask(data);
};

export const deleteTask = async (id: string) => {
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    console.error("Error deleting task:", error);
    throw error;
  }

  return Promise.resolve();
};

// Helper function to convert database row to Task object
const convertTaskRowToTask = (row: any): Task => {
  return {
    id: row.id,
    hackathonId: row.hackathon_id || undefined,
    projectId: row.project_id || undefined,
    title: row.title,
    description: row.description,
    assignedTo: row.assigned_to,
    status: row.status || "todo",
    dueDate: row.due_date || undefined,
    priority: row.priority,
    createdDate: new Date(row.created_at).toISOString()
  };
};