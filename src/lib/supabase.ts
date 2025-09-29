import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      buying_prices: {
        Row: {
          id: string
          quantity_range: string
          price_inr: number
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          quantity_range: string
          price_inr: number
          sort_order: number
          created_at?: string
        }
        Update: {
          id?: string
          quantity_range?: string
          price_inr?: number
          sort_order?: number
          created_at?: string
        }
      }
      app_config: {
        Row: {
          key: string
          value: number
          created_at: string
        }
        Insert: {
          key: string
          value: number
          created_at?: string
        }
        Update: {
          key?: string
          value?: number
          created_at?: string
        }
      }
      admins: {
        Row: {
          user_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          phone_number: string | null
          city: string | null
          upi_id: string | null
          kyc_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          phone_number?: string | null
          city?: string | null
          upi_id?: string | null
          kyc_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          phone_number?: string | null
          city?: string | null
          upi_id?: string | null
          kyc_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          transaction_type: 'buy' | 'sell'
          amount_inr: number
          amount_usdt: number | null
          exchange_rate: number | null
          network_type: 'TRC20' | 'ERC20' | null
          wallet_address: string | null
          upi_id: string | null
          utr_number: string | null
          payment_proof_url: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          timer_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          transaction_type: 'buy' | 'sell'
          amount_inr: number
          amount_usdt?: number | null
          exchange_rate?: number | null
          network_type?: 'TRC20' | 'ERC20' | null
          wallet_address?: string | null
          upi_id?: string | null
          utr_number?: string | null
          payment_proof_url?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          timer_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          transaction_type?: 'buy' | 'sell'
          amount_inr?: number
          amount_usdt?: number | null
          exchange_rate?: number | null
          network_type?: 'TRC20' | 'ERC20' | null
          wallet_address?: string | null
          upi_id?: string | null
          utr_number?: string | null
          payment_proof_url?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          timer_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          user_id: string
          transaction_id: string | null
          subject: string
          description: string | null
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          transaction_id?: string | null
          subject: string
          description?: string | null
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          transaction_id?: string | null
          subject?: string
          description?: string | null
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          created_at?: string
          updated_at?: string
        }
      }
      crypto_wallets: {
        Row: {
          id: string
          network_type: 'TRC20' | 'ERC20'
          wallet_address: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          network_type: 'TRC20' | 'ERC20'
          wallet_address: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          network_type?: 'TRC20' | 'ERC20'
          wallet_address?: string
          is_active?: boolean
          created_at?: string
        }
      }
    }
  }
}
