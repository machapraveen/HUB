
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type Project = {
  id: string;
  userId: "Macha" | "Veerendra" | "Both";
  name: string;
  description: string;
  directoryPath?: string;
  color: string;
  createdDate: string;
  progress: number;
};

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export const fetchProjects = async (userSpace?: "Macha" | "Veerendra" | "Both") => {
  let query = supabase.from("projects").select("*");
  
  if (userSpace) {
    if (userSpace === "Both") {
      // Only get projects specifically marked as "Both"
      query = query.eq("user_space", "Both");
    } else {
      // Get projects for this user or marked as "Both"
      query = query.or(`user_space.eq.${userSpace},user_space.eq.Both`);
    }
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }

  return data.map(convertProjectRowToProject);
};

export const fetchProjectById = async (id: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }

  return convertProjectRowToProject(data);
};

export const createProject = async (project: Omit<ProjectInsert, "id" | "created_at">) => {
  const { data, error } = await supabase.from("projects").insert(project).select().single();

  if (error) {
    console.error("Error creating project:", error);
    throw error;
  }

  return convertProjectRowToProject(data);
};

export const updateProject = async (id: string, project: ProjectUpdate) => {
  const { data, error } = await supabase
    .from("projects")
    .update(project)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating project:", error);
    throw error;
  }

  return convertProjectRowToProject(data);
};

// Helper function to convert database row to Project object
const convertProjectRowToProject = (row: ProjectRow): Project => {
  return {
    id: row.id as string,
    userId: row.user_space,
    name: row.name,
    description: row.description || "",
    directoryPath: row.github_url || undefined,
    color: row.color,
    createdDate: formatDate(row.created_at),
    progress: row.progress
  };
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString();
};
