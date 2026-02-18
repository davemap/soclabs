export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      design_docs: {
        Row: {
          content: string
          created_at: string
          design_id: string
          id: string
          last_synced_at: string
          section_id: string
          sort_order: number
          source_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          design_id: string
          id?: string
          last_synced_at?: string
          section_id: string
          sort_order?: number
          source_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          design_id?: string
          id?: string
          last_synced_at?: string
          section_id?: string
          sort_order?: number
          source_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      organisation_join_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          organisation_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          organisation_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          organisation_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisation_join_requests_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          country: string | null
          created_at: string
          created_by: string | null
          description: string | null
          email: string | null
          id: string
          logo: string | null
          long_description: string | null
          name: string
          type: string
          updated_at: string
          url: string | null
          verified: boolean
        }
        Insert: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo?: string | null
          long_description?: string | null
          name: string
          type?: string
          updated_at?: string
          url?: string | null
          verified?: boolean
        }
        Update: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo?: string | null
          long_description?: string | null
          name?: string
          type?: string
          updated_at?: string
          url?: string | null
          verified?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          blurb: string | null
          created_at: string
          full_name: string | null
          hide_location: boolean | null
          id: string
          location: string | null
          orcid: string | null
          organisations: string[] | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          blurb?: string | null
          created_at?: string
          full_name?: string | null
          hide_location?: boolean | null
          id?: string
          location?: string | null
          orcid?: string | null
          organisations?: string[] | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          blurb?: string | null
          created_at?: string
          full_name?: string | null
          hide_location?: boolean | null
          id?: string
          location?: string | null
          orcid?: string | null
          organisations?: string[] | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      project_content: {
        Row: {
          body: string
          created_at: string
          id: string
          project_id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          project_id: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          project_id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_content_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_join_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          project_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          project_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          project_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_join_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          assignee_id: string | null
          blurb: string | null
          completed_date: string | null
          created_at: string
          done: boolean
          effort_rating: number | null
          id: string
          learning_topic_ids: string[] | null
          phase: string
          project_id: string
          projected_end_date: string | null
          sort_order: number
          start_date: string | null
          task: string
          uncertainty_rating: number | null
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          blurb?: string | null
          completed_date?: string | null
          created_at?: string
          done?: boolean
          effort_rating?: number | null
          id?: string
          learning_topic_ids?: string[] | null
          phase: string
          project_id: string
          projected_end_date?: string | null
          sort_order?: number
          start_date?: string | null
          task: string
          uncertainty_rating?: number | null
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          blurb?: string | null
          completed_date?: string | null
          created_at?: string
          done?: boolean
          effort_rating?: number | null
          id?: string
          learning_topic_ids?: string[] | null
          phase?: string
          project_id?: string
          projected_end_date?: string | null
          sort_order?: number
          start_date?: string | null
          task?: string
          uncertainty_rating?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phase_completions: {
        Row: {
          completed_date: string | null
          created_at: string
          effort_rating: number | null
          id: string
          phase: string
          project_id: string
          uncertainty_rating: number | null
          updated_at: string
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          effort_rating?: number | null
          id?: string
          phase: string
          project_id: string
          uncertainty_rating?: number | null
          updated_at?: string
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          effort_rating?: number | null
          id?: string
          phase?: string
          project_id?: string
          uncertainty_rating?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_phase_completions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          asic_process: string | null
          created_at: string
          description: string | null
          docs_url: string | null
          email_invites: string[] | null
          fpga_family: string | null
          github_url: string | null
          id: string
          image_url: string | null
          interests: string[] | null
          invited_members: string[] | null
          organisations: string[] | null
          reference_soc: string
          status: string
          target_technology: string | null
          technologies: string[] | null
          timeframe: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          asic_process?: string | null
          created_at?: string
          description?: string | null
          docs_url?: string | null
          email_invites?: string[] | null
          fpga_family?: string | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          interests?: string[] | null
          invited_members?: string[] | null
          organisations?: string[] | null
          reference_soc: string
          status?: string
          target_technology?: string | null
          technologies?: string[] | null
          timeframe?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          asic_process?: string | null
          created_at?: string
          description?: string | null
          docs_url?: string | null
          email_invites?: string[] | null
          fpga_family?: string | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          interests?: string[] | null
          invited_members?: string[] | null
          organisations?: string[] | null
          reference_soc?: string
          status?: string
          target_technology?: string | null
          technologies?: string[] | null
          timeframe?: string | null
          title?: string
          updated_at?: string
          user_id?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
