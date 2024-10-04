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
      alumni: {
        Row: {
          birth_date: string | null
          created_at: string
          degree_id: number | null
          first_name: string
          id: string
          last_name: string
          location: string | null
          middle_name: string | null
          profile_description: string | null
          profile_picture: string | null
          updated_at: string
          year_batch: number | null
          year_graduation: number | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          degree_id?: number | null
          first_name: string
          id: string
          last_name: string
          location?: string | null
          middle_name?: string | null
          profile_description?: string | null
          profile_picture?: string | null
          updated_at?: string
          year_batch?: number | null
          year_graduation?: number | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          degree_id?: number | null
          first_name?: string
          id?: string
          last_name?: string
          location?: string | null
          middle_name?: string | null
          profile_description?: string | null
          profile_picture?: string | null
          updated_at?: string
          year_batch?: number | null
          year_graduation?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alumni_degree_id_fkey"
            columns: ["degree_id"]
            isOneToOne: false
            referencedRelation: "degrees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alumni_degree_id_fkey"
            columns: ["degree_id"]
            isOneToOne: false
            referencedRelation: "vw_degree_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alumni_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          created_at: string
          description: string | null
          id: number
          posted_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          posted_date?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          posted_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_socials: {
        Row: {
          alumni_user_id: string
          created_at: string
          id: number
          link: string
          platform_name: string
          updated_at: string
        }
        Insert: {
          alumni_user_id: string
          created_at?: string
          id?: number
          link: string
          platform_name: string
          updated_at?: string
        }
        Update: {
          alumni_user_id?: string
          created_at?: string
          id?: number
          link?: string
          platform_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_socials_alumni_fk"
            columns: ["alumni_user_id"]
            isOneToOne: false
            referencedRelation: "alumni"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_socials_alumni_fk"
            columns: ["alumni_user_id"]
            isOneToOne: false
            referencedRelation: "vw_alumni_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      contributors: {
        Row: {
          alumni_user_id: string | null
          amount: number | null
          created_at: string
          donation_type: string
          fundraising_project_id: number
          goods_description: string | null
          id: number
          proof_url: string | null
          updated_at: string
        }
        Insert: {
          alumni_user_id?: string | null
          amount?: number | null
          created_at?: string
          donation_type: string
          fundraising_project_id: number
          goods_description?: string | null
          id?: number
          proof_url?: string | null
          updated_at?: string
        }
        Update: {
          alumni_user_id?: string | null
          amount?: number | null
          created_at?: string
          donation_type?: string
          fundraising_project_id?: number
          goods_description?: string | null
          id?: number
          proof_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contributors_alumni_fk"
            columns: ["alumni_user_id"]
            isOneToOne: false
            referencedRelation: "alumni"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributors_alumni_fk"
            columns: ["alumni_user_id"]
            isOneToOne: false
            referencedRelation: "vw_alumni_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      degree_categories: {
        Row: {
          category_name: string
          id: number
        }
        Insert: {
          category_name: string
          id?: number
        }
        Update: {
          category_name?: string
          id?: number
        }
        Relationships: []
      }
      degrees: {
        Row: {
          degree_category_id: number | null
          degree_name: string
          id: number
        }
        Insert: {
          degree_category_id?: number | null
          degree_name: string
          id?: number
        }
        Update: {
          degree_category_id?: number | null
          degree_name?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "degrees_degree_category_id_fkey"
            columns: ["degree_category_id"]
            isOneToOne: false
            referencedRelation: "degree_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      employment_history: {
        Row: {
          alumni_user_id: string
          company_name: string
          created_at: string
          end_date: string | null
          id: number
          start_date: string | null
          updated_at: string
        }
        Insert: {
          alumni_user_id: string
          company_name: string
          created_at?: string
          end_date?: string | null
          id?: number
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          alumni_user_id?: string
          company_name?: string
          created_at?: string
          end_date?: string | null
          id?: number
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employment_history_alumni_fk"
            columns: ["alumni_user_id"]
            isOneToOne: false
            referencedRelation: "alumni"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employment_history_alumni_fk"
            columns: ["alumni_user_id"]
            isOneToOne: false
            referencedRelation: "vw_alumni_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      event_links: {
        Row: {
          created_at: string
          event_id: number
          id: number
          link: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: number
          id?: number
          link: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: number
          id?: number
          link?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_links_event_fk"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_links_event_fk"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "vw_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_links_event_fk"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "vw_fundraising_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          deadline: string | null
          description: string | null
          event_datetime: string
          goal: number | null
          id: number
          is_fundraising: boolean | null
          location: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          event_datetime: string
          goal?: number | null
          id?: number
          is_fundraising?: boolean | null
          location?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string | null
          event_datetime?: string
          goal?: number | null
          id?: number
          is_fundraising?: boolean | null
          location?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          created_at: string
          department_id: number
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id: number
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: number
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_department_fk"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_department_fk"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "vw_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      sy_officers: {
        Row: {
          alumni_user_id: string
          created_at: string
          department_id: number
          end_date: string | null
          id: number
          role: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          alumni_user_id: string
          created_at?: string
          department_id: number
          end_date?: string | null
          id?: number
          role: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          alumni_user_id?: string
          created_at?: string
          department_id?: number
          end_date?: string | null
          id?: number
          role?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sy_officers_alumni_fk"
            columns: ["alumni_user_id"]
            isOneToOne: false
            referencedRelation: "alumni"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sy_officers_alumni_fk"
            columns: ["alumni_user_id"]
            isOneToOne: false
            referencedRelation: "vw_alumni_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sy_officers_department_fk"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sy_officers_department_fk"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "vw_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role: Database["public"]["Enums"]["system_roles"]
          user_id: string
        }
        Insert: {
          role?: Database["public"]["Enums"]["system_roles"]
          user_id: string
        }
        Update: {
          role?: Database["public"]["Enums"]["system_roles"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_login: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          is_active?: boolean
          last_login?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vw_alumni_directory: {
        Row: {
          birth_date: string | null
          created_at: string | null
          degree_category: string | null
          degree_category_id: number | null
          degree_id: number | null
          degree_name: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          location: string | null
          middle_name: string | null
          profile_description: string | null
          profile_picture: string | null
          updated_at: string | null
          year_batch: number | null
          year_graduation: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alumni_degree_id_fkey"
            columns: ["degree_id"]
            isOneToOne: false
            referencedRelation: "degrees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alumni_degree_id_fkey"
            columns: ["degree_id"]
            isOneToOne: false
            referencedRelation: "vw_degree_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alumni_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "degrees_degree_category_id_fkey"
            columns: ["degree_category_id"]
            isOneToOne: false
            referencedRelation: "degree_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_announcements: {
        Row: {
          created_at: string | null
          description: string | null
          id: number | null
          posted_date: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number | null
          posted_date?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number | null
          posted_date?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vw_degree_programs: {
        Row: {
          degree_category: string | null
          degree_category_id: number | null
          degree_name: string | null
          id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "degrees_degree_category_id_fkey"
            columns: ["degree_category_id"]
            isOneToOne: false
            referencedRelation: "degree_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_departments: {
        Row: {
          created_at: string | null
          id: number | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vw_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_datetime: string | null
          id: number | null
          is_fundraising: boolean | null
          location: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_datetime?: string | null
          id?: number | null
          is_fundraising?: boolean | null
          location?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_datetime?: string | null
          id?: number | null
          is_fundraising?: boolean | null
          location?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vw_fundraising_contributions: {
        Row: {
          alumni_user_id: string | null
          amount: number | null
          contribution_id: number | null
          created_at: string | null
          donation_type: string | null
          first_name: string | null
          fundraising_project_id: number | null
          goods_description: string | null
          last_name: string | null
          proof_url: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contributors_alumni_fk"
            columns: ["alumni_user_id"]
            isOneToOne: false
            referencedRelation: "alumni"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributors_alumni_fk"
            columns: ["alumni_user_id"]
            isOneToOne: false
            referencedRelation: "vw_alumni_directory"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_fundraising_projects: {
        Row: {
          created_at: string | null
          deadline: string | null
          description: string | null
          event_datetime: string | null
          goal: number | null
          id: number | null
          location: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          event_datetime?: string | null
          goal?: number | null
          id?: number | null
          location?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          event_datetime?: string | null
          goal?: number | null
          id?: number | null
          location?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vw_officers: {
        Row: {
          alumni_user_id: string | null
          created_at: string | null
          department_id: number | null
          department_name: string | null
          end_date: string | null
          first_name: string | null
          id: number | null
          last_name: string | null
          role: string | null
          start_date: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sy_officers_alumni_fk"
            columns: ["alumni_user_id"]
            isOneToOne: false
            referencedRelation: "alumni"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sy_officers_alumni_fk"
            columns: ["alumni_user_id"]
            isOneToOne: false
            referencedRelation: "vw_alumni_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sy_officers_department_fk"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sy_officers_department_fk"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "vw_departments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          role_name: Database["public"]["Enums"]["system_roles"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      login_user: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      system_roles: "ADMIN" | "ALUMNI"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
