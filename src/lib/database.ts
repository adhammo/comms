export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          description: string
          id: number
          title: string
        }
        Insert: {
          description: string
          id?: number
          title: string
        }
        Update: {
          description?: string
          id?: number
          title?: string
        }
      }
      posts: {
        Row: {
          author: string
          category: number
          content: Json
          created_at: string
          id: number
          title: string
        }
        Insert: {
          author: string
          category: number
          content: Json
          created_at?: string
          id?: number
          title: string
        }
        Update: {
          author?: string
          category?: number
          content?: Json
          created_at?: string
          id?: number
          title?: string
        }
      }
      profiles: {
        Row: {
          first_name: string
          id: string
          last_name: string
          role: number
        }
        Insert: {
          first_name: string
          id: string
          last_name: string
          role: number
        }
        Update: {
          first_name?: string
          id?: string
          last_name?: string
          role?: number
        }
      }
      roles: {
        Row: {
          description: string
          name: string
          priority: number
        }
        Insert: {
          description: string
          name: string
          priority: number
        }
        Update: {
          description?: string
          name?: string
          priority?: number
        }
      }
      user_categories: {
        Row: {
          category: number
          user: string
        }
        Insert: {
          category: number
          user: string
        }
        Update: {
          category?: number
          user?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
