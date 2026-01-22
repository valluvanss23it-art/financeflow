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
      asset_value_history: {
        Row: {
          asset_id: string
          created_at: string
          id: string
          recorded_at: string
          value: number
        }
        Insert: {
          asset_id: string
          created_at?: string
          id?: string
          recorded_at?: string
          value: number
        }
        Update: {
          asset_id?: string
          created_at?: string
          id?: string
          recorded_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "asset_value_history_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          created_at: string
          current_value: number
          id: string
          last_updated: string
          name: string
          notes: string | null
          purchase_date: string | null
          purchase_value: number | null
          type: Database["public"]["Enums"]["asset_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number
          id?: string
          last_updated?: string
          name: string
          notes?: string | null
          purchase_date?: string | null
          purchase_value?: number | null
          type?: Database["public"]["Enums"]["asset_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number
          id?: string
          last_updated?: string
          name?: string
          notes?: string | null
          purchase_date?: string | null
          purchase_value?: number | null
          type?: Database["public"]["Enums"]["asset_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emi_payments: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          id: string
          interest_component: number
          liability_id: string
          payment_date: string
          principal_component: number
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          id?: string
          interest_component: number
          liability_id: string
          payment_date?: string
          principal_component: number
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          id?: string
          interest_component?: number
          liability_id?: string
          payment_date?: string
          principal_component?: number
        }
        Relationships: [
          {
            foreignKeyName: "emi_payments_liability_id_fkey"
            columns: ["liability_id"]
            isOneToOne: false
            referencedRelation: "liabilities"
            referencedColumns: ["id"]
          },
        ]
      }
      expense: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          date: string
          description: string | null
          id: string
          is_recurring: boolean
          merchant: string
          payment_method: string | null
          recurring_frequency: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          is_recurring?: boolean
          merchant: string
          payment_method?: string | null
          recurring_frequency?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          is_recurring?: boolean
          merchant?: string
          payment_method?: string | null
          recurring_frequency?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      goal_contributions: {
        Row: {
          amount: number
          contribution_date: string
          created_at: string
          goal_id: string
          id: string
          is_recurring: boolean | null
          notes: string | null
          user_id: string
        }
        Insert: {
          amount: number
          contribution_date?: string
          created_at?: string
          goal_id: string
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          contribution_date?: string
          created_at?: string
          goal_id?: string
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_contributions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string
          created_at: string
          current_amount: number
          deadline: string | null
          id: string
          is_completed: boolean
          last_contribution_date: string | null
          name: string
          notes: string | null
          priority: string
          recurring_amount: number | null
          recurring_frequency: string | null
          target_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          current_amount?: number
          deadline?: string | null
          id?: string
          is_completed?: boolean
          last_contribution_date?: string | null
          name: string
          notes?: string | null
          priority?: string
          recurring_amount?: number | null
          recurring_frequency?: string | null
          target_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          current_amount?: number
          deadline?: string | null
          id?: string
          is_completed?: boolean
          last_contribution_date?: string | null
          name?: string
          notes?: string | null
          priority?: string
          recurring_amount?: number | null
          recurring_frequency?: string | null
          target_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      income: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["income_category"]
          created_at: string
          date: string
          description: string | null
          id: string
          is_recurring: boolean
          recurring_frequency: string | null
          source: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: Database["public"]["Enums"]["income_category"]
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          is_recurring?: boolean
          recurring_frequency?: string | null
          source: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["income_category"]
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          is_recurring?: boolean
          recurring_frequency?: string | null
          source?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      insurance: {
        Row: {
          coverage_amount: number
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean
          name: string
          next_premium_date: string | null
          notes: string | null
          policy_number: string | null
          premium_amount: number
          premium_frequency: string
          provider: string
          start_date: string
          type: Database["public"]["Enums"]["insurance_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          coverage_amount: number
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          name: string
          next_premium_date?: string | null
          notes?: string | null
          policy_number?: string | null
          premium_amount: number
          premium_frequency?: string
          provider: string
          start_date: string
          type?: Database["public"]["Enums"]["insurance_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          coverage_amount?: number
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          next_premium_date?: string | null
          notes?: string | null
          policy_number?: string | null
          premium_amount?: number
          premium_frequency?: string
          provider?: string
          start_date?: string
          type?: Database["public"]["Enums"]["insurance_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      liabilities: {
        Row: {
          created_at: string
          emi_amount: number
          id: string
          interest_rate: number
          is_paid_off: boolean
          name: string
          next_emi_date: string | null
          notes: string | null
          outstanding_balance: number
          principal_amount: number
          start_date: string
          tenure_months: number
          type: Database["public"]["Enums"]["liability_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emi_amount: number
          id?: string
          interest_rate: number
          is_paid_off?: boolean
          name: string
          next_emi_date?: string | null
          notes?: string | null
          outstanding_balance: number
          principal_amount: number
          start_date: string
          tenure_months: number
          type?: Database["public"]["Enums"]["liability_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emi_amount?: number
          id?: string
          interest_rate?: number
          is_paid_off?: boolean
          name?: string
          next_emi_date?: string | null
          notes?: string | null
          outstanding_balance?: number
          principal_amount?: number
          start_date?: string
          tenure_months?: number
          type?: Database["public"]["Enums"]["liability_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
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
      asset_type:
        | "cash"
        | "bank"
        | "fd"
        | "stocks"
        | "mutual_funds"
        | "crypto"
        | "gold"
        | "property"
        | "other"
      expense_category:
        | "food"
        | "transport"
        | "utilities"
        | "rent"
        | "healthcare"
        | "education"
        | "entertainment"
        | "shopping"
        | "insurance"
        | "subscriptions"
        | "travel"
        | "personal_care"
        | "household"
        | "gifts"
        | "investments"
        | "taxes"
        | "other"
      income_category:
        | "salary"
        | "freelance"
        | "business"
        | "investments"
        | "rental"
        | "dividends"
        | "interest"
        | "bonus"
        | "commission"
        | "gifts"
        | "other"
      insurance_type: "health" | "life" | "vehicle" | "property" | "other"
      liability_type:
        | "home_loan"
        | "car_loan"
        | "personal_loan"
        | "education_loan"
        | "credit_card"
        | "other"
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
    Enums: {
      asset_type: [
        "cash",
        "bank",
        "fd",
        "stocks",
        "mutual_funds",
        "crypto",
        "gold",
        "property",
        "other",
      ],
      expense_category: [
        "food",
        "transport",
        "utilities",
        "rent",
        "healthcare",
        "education",
        "entertainment",
        "shopping",
        "insurance",
        "subscriptions",
        "travel",
        "personal_care",
        "household",
        "gifts",
        "investments",
        "taxes",
        "other",
      ],
      income_category: [
        "salary",
        "freelance",
        "business",
        "investments",
        "rental",
        "dividends",
        "interest",
        "bonus",
        "commission",
        "gifts",
        "other",
      ],
      insurance_type: ["health", "life", "vehicle", "property", "other"],
      liability_type: [
        "home_loan",
        "car_loan",
        "personal_loan",
        "education_loan",
        "credit_card",
        "other",
      ],
    },
  },
} as const
