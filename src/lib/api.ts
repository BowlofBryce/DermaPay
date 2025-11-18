import { supabase, Merchant, Payment, BankAccount } from './supabase';
import { DEMO_USER } from './auth';

const DEMO_PAYMENTS: Payment[] = [
  {
    id: 'pmt_1',
    merchant_id: 'demo-merchant',
    deposyt_payment_id: null,
    amount: 25000,
    customer_charged_amount: 25750,
    status: 'paid',
    mode: 'in_person',
    fee_payer: 'customer',
    note: 'Half sleeve deposit',
    checkout_url: 'https://pay.dermapay.com/demo1',
    client_name: 'Sarah Johnson',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pmt_2',
    merchant_id: 'demo-merchant',
    deposyt_payment_id: null,
    amount: 8000,
    customer_charged_amount: 8000,
    status: 'pending',
    mode: 'link',
    fee_payer: 'merchant',
    note: 'Flash piece - walk-in',
    checkout_url: 'https://pay.dermapay.com/demo2',
    client_name: 'Mike Chen',
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
  {
    id: 'pmt_3',
    merchant_id: 'demo-merchant',
    deposyt_payment_id: null,
    amount: 15000,
    customer_charged_amount: 15450,
    status: 'failed',
    mode: 'in_person',
    fee_payer: 'customer',
    note: 'Touch-up session',
    checkout_url: 'https://pay.dermapay.com/demo3',
    client_name: 'Alex Rivera',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

const DEMO_MERCHANT: Merchant = {
  id: 'demo-merchant',
  user_id: 'demo-user',
  full_name: 'Demo Artist',
  email: 'demo@dermapay.com',
  phone: '555-0123',
  shop_name: 'Demo Tattoo Studio',
  city: 'Los Angeles',
  state: 'CA',
  business_type: 'sole_proprietor',
  monthly_volume: '10000-50000',
  default_fee_payer: 'customer',
  created_at: new Date().toISOString(),
};

export async function createMerchant(data: {
  full_name: string;
  email: string;
  phone: string;
  shop_name: string;
  city: string;
  state: string;
  business_type: string;
  monthly_volume: string;
  default_fee_payer: 'merchant' | 'customer';
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: merchant, error } = await supabase
    .from('merchants')
    .insert({
      user_id: user.id,
      ...data,
    })
    .select()
    .single();

  if (error) throw error;
  return merchant as Merchant;
}

export async function createBankAccount(data: {
  merchant_id: string;
  routing_number: string;
  account_number: string;
  account_type: 'checking' | 'savings';
}) {
  const last4 = data.account_number.slice(-4);

  const { data: bankAccount, error } = await supabase
    .from('bank_accounts')
    .insert({
      merchant_id: data.merchant_id,
      routing_number: data.routing_number,
      account_number_last4: last4,
      account_type: data.account_type,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return bankAccount as BankAccount;
}

export async function getMerchantByUserId(userId: string) {
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as Merchant | null;
}

export async function getCurrentMerchant() {
  const demoUser = localStorage.getItem('demoUser');
  if (demoUser) {
    return DEMO_MERCHANT;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return getMerchantByUserId(user.id);
}

export async function getPayments(merchantId: string, limit = 50) {
  if (merchantId === 'demo-merchant') {
    return DEMO_PAYMENTS;
  }

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Payment[];
}

export async function getPaymentById(paymentId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .maybeSingle();

  if (error) throw error;
  return data as Payment | null;
}

export async function updateMerchant(merchantId: string, updates: Partial<Merchant>) {
  const { data, error } = await supabase
    .from('merchants')
    .update(updates)
    .eq('id', merchantId)
    .select()
    .single();

  if (error) throw error;
  return data as Merchant;
}

export async function createPaymentViaAPI(input: {
  mode: 'in_person' | 'link';
  amount: number;
  note?: string;
  feePayer: 'merchant' | 'customer';
}) {
  const demoUser = localStorage.getItem('demoUser');

  if (demoUser) {
    // Demo mode: create a mock payment locally
    const paymentId = crypto.randomUUID();
    const shortId = paymentId.substring(0, 8);
    const checkoutUrl = `https://pay.dermapay.com/${shortId}`;

    let customerChargedAmount = input.amount;
    if (input.feePayer === 'customer') {
      customerChargedAmount = Math.round(input.amount * 1.03);
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      id: paymentId,
      checkoutUrl,
      amount: input.amount,
      customerChargedAmount,
    };
  }

  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create payment');
  }

  return response.json();
}
