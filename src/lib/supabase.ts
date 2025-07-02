import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      inventory_items: {
        Row: {
          id: string;
          item_id: string;
          name: string;
          category: string;
          quantity: number;
          unit: string;
          min_quantity: number;
          max_quantity: number;
          location: string;
          supplier: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          name: string;
          category: string;
          quantity?: number;
          unit?: string;
          min_quantity?: number;
          max_quantity?: number;
          location?: string;
          supplier?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          name?: string;
          category?: string;
          quantity?: number;
          unit?: string;
          min_quantity?: number;
          max_quantity?: number;
          location?: string;
          supplier?: string;
          description?: string;
          updated_at?: string;
        };
      };
      inventory_transactions: {
        Row: {
          id: string;
          inventory_item_id: string;
          transaction_type: '入庫' | '出庫' | '調整';
          quantity_change: number;
          reason: string;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          inventory_item_id: string;
          transaction_type: '入庫' | '出庫' | '調整';
          quantity_change: number;
          reason?: string;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          inventory_item_id?: string;
          transaction_type?: '入庫' | '出庫' | '調整';
          quantity_change?: number;
          reason?: string;
          created_at?: string;
          created_by?: string | null;
        };
      };
    };
  };
};