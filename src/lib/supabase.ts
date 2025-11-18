import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Merchant {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  shop_name: string;
  city: string;
  state: string;
  business_type: string;
  monthly_volume: string;
  default_fee_payer: 'merchant' | 'customer';
  created_at: string;
}

export interface Payment {
  id: string;
  merchant_id: string;
  deposyt_payment_id: string | null;
  amount: number;
  fee_payer: 'merchant' | 'customer';
  customer_charged_amount: number;
  mode: 'in_person' | 'link';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  note: string | null;
  checkout_url: string | null;
  client_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface BankAccount {
  id: string;
  merchant_id: string;
  routing_number: string;
  account_number_last4: string;
  account_type: 'checking' | 'savings';
  deposyt_account_id: string | null;
  is_active: boolean;
  created_at: string;
}
