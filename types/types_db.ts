import Stripe from "stripe"

import type { ChatMessage, GeoLocation, LibraryStatus } from "./types"

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          billing_address: Stripe.Address | Json
          payment_method: Stripe.PaymentMethod[Stripe.PaymentMethod.Type] | Json
          full_name: string | null
          avatar_url: string | null
          email: string
          access_token: string
          usage: number
          lang: string
          geo_location: GeoLocation
          ip: string
          role: Database["public"]["Enums"]["user_role"]
          block: boolean
          referral: string | null
          theme: string | null
          created_at: string
        }
        Insert: {
          id: string
          billing_address?: Stripe.Address | Json
          payment_method?:
            | Stripe.PaymentMethod[Stripe.PaymentMethod.Type]
            | Json
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
          access_token?: string
          usage?: number
          lang?: string
          geo_location?: GeoLocation
          ip?: string
          role?: Database["public"]["Enums"]["user_role"]
          block?: boolean
          referral?: string | null
          theme?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          billing_address?: Stripe.Address | Json
          payment_method?:
            | Stripe.PaymentMethod[Stripe.PaymentMethod.Type]
            | Json
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
          access_token?: string
          usage?: number
          lang?: string
          geo_location?: GeoLocation
          ip?: string
          role?: Database["public"]["Enums"]["user_role"]
          block?: boolean
          referral?: string | null
          theme?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      chat: {
        Row: {
          id: string
          user_id: string
          title: string
          messages: ChatMessage[]
          liked: boolean | null
          language: string | null
          grade: string | null
          type: string
          file_id: string | null
          filename: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id: string
          title?: string
          messages: ChatMessage[]
          liked?: boolean | null
          language?: string | null
          grade?: string | null
          type?: string
          file_id?: string | null
          filename?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          messages?: ChatMessage[]
          liked?: boolean | null
          language?: string | null
          grade?: string | null
          type?: string
          file_id?: string | null
          filename?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      libraries: {
        Row: {
          id: string
          user_id: string
          file_id: string
          name: string
          file_type: string
          status: LibraryStatus
          public_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id: string
          file_id: string
          name: string
          file_type: string
          status: LibraryStatus
          public_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_id?: string
          name?: string
          file_type?: string
          status?: LibraryStatus
          public?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      share_chat: {
        Row: {
          id: string
          user_id: string
          chat_id: string
          created_at: string
        }
        Insert: {
          id: string
          user_id: string
          chat_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          chat_id?: string
          created_at?: string
        }
      }
      books: {
        Row: {
          content: string | null
          created_at: string
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id: string
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      books_collection: {
        Row: {
          abstract: string | null
          authors: string | null
          collection: string
          created_at: string
          file_id: string
          id: string
          isbn: string | null
          public_id: string
          published_date: string | null
          publisher: string | null
          status: string
          tags: string
          title: string
          type: string
          lang: string
          updated_at: string
        }
        Insert: {
          abstract?: string | null
          authors?: string | null
          collection: string
          created_at?: string
          file_id: string
          id?: string
          isbn?: string | null
          public_id: string
          published_date?: string | null
          publisher?: string | null
          status: string
          tags: string
          title: string
          type: string
          lang: string
          updated_at?: string
        }
        Update: {
          abstract?: string | null
          authors?: string | null
          collection?: string
          created_at?: string
          file_id?: string
          id?: string
          isbn?: string | null
          public_id?: string
          published_date?: string | null
          publisher?: string | null
          status?: string
          tags?: string
          title?: string
          type?: string
          lang?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          created_at: string
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          customer_id: string
          created_at: string
        }
        Insert: {
          id: string
          customer_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          active: boolean | null
          name: string | null
          description: string | null
          image: string | null
          metadata: Json | null
        }
        Insert: {
          id: string
          active?: boolean | null
          name?: string | null
          description?: string | null
          image?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          active?: boolean | null
          name?: string | null
          description?: string | null
          image?: string | null
          metadata?: Json | null
        }
        Relationships: []
      }
      prices: {
        Row: {
          id: string
          product_id: string | null
          active: boolean | null
          unit_amount: number | null
          currency: string | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          trial_period_days: number | null
          metadata: Json | null
          description: string | null
        }
        Insert: {
          id: string
          product_id?: string | null
          active?: boolean | null
          unit_amount?: number | null
          currency?: string | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          trial_period_days?: number | null
          metadata?: Json | null
          description?: string | null
        }
        Update: {
          id?: string
          product_id?: string | null
          active?: boolean | null
          unit_amount?: number | null
          currency?: string | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          trial_period_days?: number | null
          metadata?: Json | null
          description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          cancel_at_period_end: boolean | null
          created: string
          current_period_start: string
          current_period_end: string
          ended_at: string | null
          cancel_at: string | null
          canceled_at: string | null
          trial_start: string | null
          trial_end: string | null
          provider: string
        }
        Insert: {
          id: string
          user_id: string
          status?: Database["public"]["Enums"]["subscription_status"]
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          cancel_at_period_end?: boolean | null
          created?: string
          current_period_start?: string
          current_period_end?: string
          ended_at?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          provider?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          cancel_at_period_end?: boolean | null
          created?: string
          current_period_start?: string
          current_period_end?: string
          ended_at?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          provider?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      kw_match_books: {
        Args: {
          query_text: string
          match_count: number
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      kw_match_documents: {
        Args: {
          query_text: string
          match_count: number
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_books: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      user_role: "student" | "teacher" | "professional"
      content_access_role: "free" | "basic" | "premium"
      pricing_type: "one_time" | "recurring"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
        | "one_time"
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
