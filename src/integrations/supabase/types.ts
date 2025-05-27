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
      files: {
        Row: {
          id: number
          title: string
          description: string | null
          category: string
          file_url: string
          file_size: string | null
          downloads: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          category: string
          file_url: string
          file_size?: string | null
          downloads?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          category?: string
          file_url?: string
          file_size?: string | null
          downloads?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          id: number
          file_id: number
          title: string
          google_form_url: string
          duration: number | null
          questions: number | null
          attempts: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          file_id: number
          title: string
          google_form_url: string
          duration?: number | null
          questions?: number | null
          attempts?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          file_id?: number
          title?: string
          google_form_url?: string
          duration?: number | null
          questions?: number | null
          attempts?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exams_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          username: string | null
          role: string | null
          study_plan: Json | null
          current_streak: number | null
          completed_plans: Json | null
          xp: number | null
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
          role?: string | null
          study_plan?: Json | null
          current_streak?: number | null
          completed_plans?: Json | null
          xp?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
          role?: string | null
          study_plan?: Json | null
          current_streak?: number | null
          completed_plans?: Json | null
          xp?: number | null
        }
        Relationships: []
      }
      user_xp: {
        Row: {
          id: number
          user_id: string
          username: string
          completed_days: number
          total_xp: number
          study_days_xp: number
          tasks_xp: number
          streak_xp: number
          plan_xp: number
          last_calculated: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          username?: string
          completed_days?: number
          total_xp?: number
          study_days_xp?: number
          tasks_xp?: number
          streak_xp?: number
          plan_xp?: number
          last_calculated?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          username?: string
          completed_days?: number
          total_xp?: number
          study_days_xp?: number
          tasks_xp?: number
          streak_xp?: number
          plan_xp?: number
          last_calculated?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_xp_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      weekly_events: {
        Row: {
          id: number
          title: string
          description: string | null
          category: string
          start_time: string
          duration_minutes: number
          xp_reward: number
          is_enabled: boolean
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          category: string
          start_time: string
          duration_minutes?: number
          xp_reward?: number
          is_enabled?: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          category?: string
          start_time?: string
          duration_minutes?: number
          xp_reward?: number
          is_enabled?: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_questions: {
        Row: {
          id: number
          event_id: number
          question_text: string
          question_type: string
          image_url: string | null
          passage_text: string | null
          category: string
          subcategory: string | null
          question_order: number
          options: Json
          correct_answer: number
          created_at: string
        }
        Insert: {
          id?: number
          event_id: number
          question_text: string
          question_type?: string
          image_url?: string | null
          passage_text?: string | null
          category: string
          subcategory?: string | null
          question_order: number
          options: Json
          correct_answer: number
          created_at?: string
        }
        Update: {
          id?: number
          event_id?: number
          question_text?: string
          question_type?: string
          image_url?: string | null
          passage_text?: string | null
          category?: string
          subcategory?: string | null
          question_order?: number
          options?: Json
          correct_answer?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_questions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "weekly_events"
            referencedColumns: ["id"]
          }
        ]
      }
      event_participations: {
        Row: {
          id: number
          event_id: number
          user_id: string
          answers: Json
          score: number
          total_questions: number
          time_taken_minutes: number
          xp_earned: number
          completed_at: string
        }
        Insert: {
          id?: number
          event_id: number
          user_id: string
          answers: Json
          score: number
          total_questions: number
          time_taken_minutes: number
          xp_earned: number
          completed_at?: string
        }
        Update: {
          id?: number
          event_id?: number
          user_id?: string
          answers?: Json
          score?: number
          total_questions?: number
          time_taken_minutes?: number
          xp_earned?: number
          completed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "weekly_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      leaderboard_view: {
        Row: {
          user_id: string
          username: string
          completed_days: number
          total_xp: number
          study_days_xp: number
          tasks_xp: number
          streak_xp: number
          plan_xp: number
          last_calculated: string
          rank: number
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_user_xp_basic: {
        Args: {
          target_user_id: string
        }
        Returns: number
      }
      get_user_profile_data: {
        Args: {
          target_user_id: string
        }
        Returns: {
          id: string
          username: string
          role: string
          study_plan: Json
          current_streak: number
          total_xp: number
          created_at: string
          updated_at: string
        }[]
      }
      save_study_plan: {
        Args: {
          target_user_id: string
          plan_data: Json
        }
        Returns: {
          success: boolean
          message: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
