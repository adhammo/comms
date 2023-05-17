export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          description: string
          id: string
          live: boolean
          title: string
        }
        Insert: {
          description: string
          id: string
          live?: boolean
          title: string
        }
        Update: {
          description?: string
          id?: string
          live?: boolean
          title?: string
        }
      }
      posts: {
        Row: {
          author: string
          category: string
          content: Json
          created_at: string
          description: string
          id: string
          live: boolean
          read_time: number
          title: string
        }
        Insert: {
          author: string
          category: string
          content: Json
          created_at?: string
          description: string
          id: string
          live?: boolean
          read_time: number
          title: string
        }
        Update: {
          author?: string
          category?: string
          content?: Json
          created_at?: string
          description?: string
          id?: string
          live?: boolean
          read_time?: number
          title?: string
        }
      }
      profiles: {
        Row: {
          bio: string
          first_name: string
          id: string
          last_name: string
          live: boolean
          role: string
          username: string
        }
        Insert: {
          bio?: string
          first_name: string
          id: string
          last_name: string
          live?: boolean
          role?: string
          username: string
        }
        Update: {
          bio?: string
          first_name?: string
          id?: string
          last_name?: string
          live?: boolean
          role?: string
          username?: string
        }
      }
      roles: {
        Row: {
          description: string
          id: string
          name: string
          priority: number
        }
        Insert: {
          description: string
          id: string
          name: string
          priority: number
        }
        Update: {
          description?: string
          id?: string
          name?: string
          priority?: number
        }
      }
      user_categories: {
        Row: {
          category: string
          username: string
        }
        Insert: {
          category: string
          username: string
        }
        Update: {
          category?: string
          username?: string
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
