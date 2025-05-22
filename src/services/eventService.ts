
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type HackathonStatus = "upcoming" | "active" | "completed";
export type EventType = "hackathon" | "competition" | "quiz" | "workshop";

export interface Hackathon {
  id: string;
  title: string;
  organizer: string;
  startDate: string;
  endDate: string;
  status: HackathonStatus;
  progress: number;
  platform: string;
  location?: string;
  type?: EventType;
  description?: string;
}

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];

export const fetchEvents = async (userSpace?: "Macha" | "Veerendra" | "Both") => {
  let query = supabase.from("events").select("*");
  
  if (userSpace) {
    if (userSpace === "Both") {
      query = query.eq("user_space", "Both");
    } else {
      query = query.or(`user_space.eq.${userSpace},user_space.eq.Both`);
    }
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching events:", error);
    throw error;
  }

  return data.map(convertEventRowToHackathon);
};

export const fetchEventById = async (id: string) => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }

  return convertEventRowToHackathon(data);
};

export const createEvent = async (event: Omit<EventInsert, "id" | "created_at">) => {
  console.log("Creating event with data:", event);
  
  const { data, error } = await supabase.from("events").insert(event).select().single();

  if (error) {
    console.error("Error creating event:", error);
    throw error;
  }

  return convertEventRowToHackathon(data);
};

export const updateEvent = async (id: string, event: Partial<EventInsert>) => {
  const { data, error } = await supabase
    .from("events")
    .update(event)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating event:", error);
    throw error;
  }

  return convertEventRowToHackathon(data);
};

export const deleteEvent = async (id: string) => {
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// Helper function to convert database row to Hackathon object
const convertEventRowToHackathon = (row: EventRow): Hackathon => {
  return {
    id: row.id as string,
    title: row.title,
    organizer: row.organizer,
    startDate: formatDate(row.start_date),
    endDate: formatDate(row.end_date),
    status: row.status,
    progress: calculateProgress(row.start_date, row.end_date),
    platform: row.platform || "Unknown", // Provide default value to make it required
    location: row.location || undefined,
    type: row.type,
    description: row.description
  };
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};

// Helper function to calculate progress
const calculateProgress = (startDateStr: string, endDateStr: string): number => {
  const now = new Date();
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  
  // If event hasn't started yet
  if (now < startDate) {
    return 0;
  }
  
  // If event has ended
  if (now > endDate) {
    return 100;
  }
  
  // Calculate progress
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsedDuration = now.getTime() - startDate.getTime();
  const progress = Math.round((elapsedDuration / totalDuration) * 100);
  
  return Math.min(100, Math.max(0, progress));
};
