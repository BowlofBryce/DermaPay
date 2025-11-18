/*
  # DermaPay Database Schema
  
  This migration creates the complete database schema for DermaPay, a payment processor for tattoo artists.
  
  ## New Tables
  
  ### `merchants`
  Stores artist/shop information
  - `id` (uuid, primary key) - Unique merchant identifier
  - `user_id` (uuid, references auth.users) - Links to Supabase auth user
  - `full_name` (text) - Merchant's full name
  - `email` (text) - Contact email
  - `phone` (text) - Mobile phone number
  - `shop_name` (text) - Name of the shop/business
  - `city` (text) - City location
  - `state` (text) - State location
  - `business_type` (text) - Type: 'tattoo_artist', 'tattoo_shop', 'med_spa', 'other'
  - `monthly_volume` (text) - Expected volume: '<5k', '5k-15k', '>15k'
  - `default_fee_payer` (text) - Default: 'merchant' or 'customer'
  - `created_at` (timestamptz) - Account creation timestamp
  
  ### `bank_accounts`
  Stores bank account information for payouts
  - `id` (uuid, primary key) - Unique bank account identifier
  - `merchant_id` (uuid, references merchants) - Linked merchant
  - `routing_number` (text) - Bank routing number (encrypted in production)
  - `account_number_last4` (text) - Last 4 digits for display
  - `account_type` (text) - 'checking' or 'savings'
  - `deposyt_account_id` (text) - Deposyt's identifier for this account
  - `is_active` (boolean) - Whether this account is currently active
  - `created_at` (timestamptz) - Account link timestamp
  
  ### `payments`
  Stores all payment transactions
  - `id` (uuid, primary key) - Internal payment identifier
  - `merchant_id` (uuid, references merchants) - Merchant receiving payment
  - `deposyt_payment_id` (text) - Deposyt's payment identifier
  - `amount` (integer) - Amount in cents
  - `fee_payer` (text) - Who pays fee: 'merchant' or 'customer'
  - `customer_charged_amount` (integer) - Total amount charged to customer (with fee if applicable)
  - `mode` (text) - Payment mode: 'in_person' or 'link'
  - `status` (text) - Current status: 'pending', 'paid', 'failed', 'refunded'
  - `note` (text) - Optional payment note/description
  - `checkout_url` (text) - Payment link URL
  - `client_name` (text) - Optional client name
  - `created_at` (timestamptz) - Payment creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ## Security
  
  - Enable RLS on all tables
  - Merchants can only access their own data
  - Policies enforce authentication and ownership checks
*/

-- Create merchants table
CREATE TABLE IF NOT EXISTS merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  shop_name text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  business_type text NOT NULL DEFAULT 'tattoo_artist',
  monthly_volume text NOT NULL DEFAULT '<5k',
  default_fee_payer text NOT NULL DEFAULT 'merchant',
  created_at timestamptz DEFAULT now()
);

-- Create bank_accounts table
CREATE TABLE IF NOT EXISTS bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  routing_number text NOT NULL,
  account_number_last4 text NOT NULL,
  account_type text NOT NULL DEFAULT 'checking',
  deposyt_account_id text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  deposyt_payment_id text,
  amount integer NOT NULL,
  fee_payer text NOT NULL DEFAULT 'merchant',
  customer_charged_amount integer NOT NULL,
  mode text NOT NULL DEFAULT 'in_person',
  status text NOT NULL DEFAULT 'pending',
  note text,
  checkout_url text,
  client_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster merchant lookups
CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON merchants(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_merchant_id ON payments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_merchant_id ON bank_accounts(merchant_id);

-- Enable Row Level Security
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Merchants policies
CREATE POLICY "Users can view own merchant profile"
  ON merchants FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own merchant profile"
  ON merchants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own merchant profile"
  ON merchants FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Bank accounts policies
CREATE POLICY "Merchants can view own bank accounts"
  ON bank_accounts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = bank_accounts.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create own bank accounts"
  ON bank_accounts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = bank_accounts.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own bank accounts"
  ON bank_accounts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = bank_accounts.merchant_id
      AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = bank_accounts.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

-- Payments policies
CREATE POLICY "Merchants can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = payments.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can create own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = payments.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants can update own payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = payments.merchant_id
      AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = payments.merchant_id
      AND merchants.user_id = auth.uid()
    )
  );