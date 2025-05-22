export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          image_url: string | null
          location: string | null
          organizer: string
          platform: string | null
          start_date: string
          status: Database["public"]["Enums"]["event_status"]
          title: string
          type: Database["public"]["Enums"]["event_type"]
          url: string | null
          user_space: Database["public"]["Enums"]["user_space"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          image_url?: string | null
          location?: string | null
          organizer: string
          platform?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["event_status"]
          title: string
          type?: Database["public"]["Enums"]["event_type"]
          url?: string | null
          user_space?: Database["public"]["Enums"]["user_space"]
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          image_url?: string | null
          location?: string | null
          organizer?: string
          platform?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["event_status"]
          title?: string
          type?: Database["public"]["Enums"]["event_type"]
          url?: string | null
          user_space?: Database["public"]["Enums"]["user_space"]
        }
        Relationships: []
      }
      notes: {
        Row: {
          category: string | null
          content: string | null
          date: string
          id: string
          progress: number
          tags: string[] | null
          title: string
          user_space: Database["public"]["Enums"]["user_space"]
        }
        Insert: {
          category?: string | null
          content?: string | null
          date?: string
          id?: string
          progress?: number
          tags?: string[] | null
          title: string
          user_space?: Database["public"]["Enums"]["user_space"]
        }
        Update: {
          category?: string | null
          content?: string | null
          date?: string
          id?: string
          progress?: number
          tags?: string[] | null
          title?: string
          user_space?: Database["public"]["Enums"]["user_space"]
        }
        Relationships: []
      }
      projects: {
        Row: {
          color: string
          created_at: string
          demo_url: string | null
          description: string | null
          github_url: string | null
          id: string
          image_url: string | null
          name: string
          progress: number
          tech_stack: string[] | null
          user_space: Database["public"]["Enums"]["user_space"]
        }
        Insert: {
          color?: string
          created_at?: string
          demo_url?: string | null
          description?: string | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          name: string
          progress?: number
          tech_stack?: string[] | null
          user_space?: Database["public"]["Enums"]["user_space"]
        }
        Update: {
          color?: string
          created_at?: string
          demo_url?: string | null
          description?: string | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          name?: string
          progress?: number
          tech_stack?: string[] | null
          user_space?: Database["public"]["Enums"]["user_space"]
        }
        Relationships: []
      }
      quick_access: {
        Row: {
          color: string | null
          created_at: string
          icon: string | null
          id: string
          title: string
          url: string
          user_space: Database["public"]["Enums"]["user_space"]
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          title: string
          url: string
          user_space?: Database["public"]["Enums"]["user_space"]
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          title?: string
          url?: string
          user_space?: Database["public"]["Enums"]["user_space"]
        }
        Relationships: []
      }
      quick_tasks: {
        Row: {
          completed: boolean
          created_date: string
          due_date: string | null
          id: string
          title: string
          user_space: Database["public"]["Enums"]["user_space"]
        }
        Insert: {
          completed?: boolean
          created_date?: string
          due_date?: string | null
          id?: string
          title: string
          user_space?: Database["public"]["Enums"]["user_space"]
        }
        Update: {
          completed?: boolean
          created_date?: string
          due_date?: string | null
          id?: string
          title?: string
          user_space?: Database["public"]["Enums"]["user_space"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      event_status: "active" | "upcoming" | "completed"
      event_type: "hackathon" | "competition" | "quiz" | "workshop"
      user_space: "Macha" | "Veerendra" | "Both"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      event_status: ["active", "upcoming", "completed"],
      event_type: ["hackathon", "competition", "quiz", "workshop"],
      user_space: ["Macha", "Veerendra", "Both"],
    },
  },
} as const
