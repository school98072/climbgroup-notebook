export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          climbing_style: 'bouldering' | 'sport' | 'both' | null
          experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          climbing_style?: 'bouldering' | 'sport' | 'both' | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          climbing_style?: 'bouldering' | 'sport' | 'both' | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          video_url: string
          thumbnail_url: string | null
          duration: number | null
          route_name: string | null
          grade: string | null
          location: string | null
          privacy: 'private' | 'group' | 'public'
          status: 'uploading' | 'processing' | 'ready' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          video_url: string
          thumbnail_url?: string | null
          duration?: number | null
          route_name?: string | null
          grade?: string | null
          location?: string | null
          privacy?: 'private' | 'group' | 'public'
          status?: 'uploading' | 'processing' | 'ready' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          video_url?: string
          thumbnail_url?: string | null
          duration?: number | null
          route_name?: string | null
          grade?: string | null
          location?: string | null
          privacy?: 'private' | 'group' | 'public'
          status?: 'uploading' | 'processing' | 'ready' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
      beta_detections: {
        Row: {
          id: string
          video_id: string
          move_type: string
          confidence: number
          start_time: number
          end_time: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          video_id: string
          move_type: string
          confidence: number
          start_time: number
          end_time: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          move_type?: string
          confidence?: number
          start_time?: number
          end_time?: number
          description?: string | null
          created_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          avatar_url: string | null
          privacy: 'public' | 'private' | 'invite'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          avatar_url?: string | null
          privacy?: 'public' | 'private' | 'invite'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          avatar_url?: string | null
          privacy?: 'public' | 'private' | 'invite'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: 'admin' | 'moderator' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: 'admin' | 'moderator' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: 'admin' | 'moderator' | 'member'
          joined_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          video_id: string | null
          group_id: string | null
          user_id: string
          content: string
          timestamp: number | null
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          video_id?: string | null
          group_id?: string | null
          user_id: string
          content: string
          timestamp?: number | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          video_id?: string | null
          group_id?: string | null
          user_id?: string
          content?: string
          timestamp?: number | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      annotations: {
        Row: {
          id: string
          video_id: string
          user_id: string
          timestamp: number
          content: string
          annotation_type: 'note' | 'feedback' | 'highlight'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          video_id: string
          user_id: string
          timestamp: number
          content: string
          annotation_type?: 'note' | 'feedback' | 'highlight'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          user_id?: string
          timestamp?: number
          content?: string
          annotation_type?: 'note' | 'feedback' | 'highlight'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      climbing_style: 'bouldering' | 'sport' | 'both'
      experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
      video_privacy: 'private' | 'group' | 'public'
      video_status: 'uploading' | 'processing' | 'ready' | 'failed'
      group_privacy: 'public' | 'private' | 'invite'
      member_role: 'admin' | 'moderator' | 'member'
      annotation_type: 'note' | 'feedback' | 'highlight'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
