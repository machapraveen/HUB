import { supabase } from "@/integrations/supabase/client";

export type Communication = {
  id: string;
  hackathonId?: string;
  projectId?: string;
  sender: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  important: boolean;
};

type CommunicationInsert = {
  hackathon_id?: string;
  project_id?: string;
  sender: string;
  subject: string;
  content: string;
  important?: boolean;
  read?: boolean;
};

export const fetchCommunications = async (hackathonId?: string, projectId?: string) => {
  let query = supabase.from("communications").select("*");
  
  if (hackathonId) {
    query = query.eq("hackathon_id", hackathonId);
  } else if (projectId) {
    query = query.eq("project_id", projectId);
  }
  
  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching communications:", error);
    throw error;
  }

  return data.map(convertCommunicationRowToCommunication);
};

export const createCommunication = async (communication: CommunicationInsert) => {
  const { data, error } = await supabase
    .from("communications")
    .insert(communication)
    .select()
    .single();

  if (error) {
    console.error("Error creating communication:", error);
    throw error;
  }

  return convertCommunicationRowToCommunication(data);
};

export const updateCommunication = async (id: string, updates: Partial<CommunicationInsert>) => {
  const { data, error } = await supabase
    .from("communications")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating communication:", error);
    throw error;
  }

  return convertCommunicationRowToCommunication(data);
};

export const deleteCommunication = async (id: string) => {
  const { error } = await supabase.from("communications").delete().eq("id", id);

  if (error) {
    console.error("Error deleting communication:", error);
    throw error;
  }

  return Promise.resolve();
};

// Helper function to convert database row to Communication object
const convertCommunicationRowToCommunication = (row: any): Communication => {
  return {
    id: row.id,
    hackathonId: row.hackathon_id || undefined,
    projectId: row.project_id || undefined,
    sender: row.sender,
    subject: row.subject,
    content: row.content,
    date: new Date(row.created_at).toISOString(),
    read: row.read || false,
    important: row.important || false
  };
};