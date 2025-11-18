import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Radio } from '../components/Radio';
import { getCurrentMerchant, updateMerchant } from '../lib/api';
import { supabase, Merchant, BankAccount } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';

export function Settings() {
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [shopName, setShopName] = useState('');
  const [city, setCity] = useState('');
  const [defaultFeePayer, setDefaultFeePayer] = useState<'merchant' | 'customer'>('merchant');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const merchantData = await getCurrentMerchant();
      if (!merchantData) {
        navigate('/signup');
        return;
      }

      setMerchant(merchantData);
      setFullName(merchantData.full_name);
      setEmail(merchantData.email);
      setShopName(merchantData.shop_name);
      setCity(merchantData.city);
      setDefaultFeePayer(merchantData.default_fee_payer);

      const { data: bankData } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('merchant_id', merchantData.id)
        .eq('is_active', true)
        .maybeSingle();

      setBankAccount(bankData);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!merchant) return;

    setSaving(true);
    setSuccess(false);

    try {
      await updateMerchant(merchant.id, {
        full_name: fullName,
        shop_name: shopName,
        city,
        default_fee_payer: defaultFeePayer,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050608] flex items-center justify-center">
        <div className="text-[#f9fafb] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050608] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="outline"
          size="small"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="bg-gray-900 p-8 rounded-xl">
          <h1 className="text-3xl font-bold text-[#f9fafb] mb-8">Settings</h1>

          {success && (
            <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-6">
              Settings saved successfully!
            </div>
          )}

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-[#f9fafb] mb-4">Your Info</h2>
              <div className="space-y-4">
                <Input
                  label="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  label="Email"
                  value={email}
                  disabled
                  helperText="Email cannot be changed"
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#f9fafb] mb-4">Shop Info</h2>
              <div className="space-y-4">
                <Input
                  label="Shop name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#f9fafb] mb-4">Default Fee Setting</h2>
              <p className="text-gray-400 text-sm mb-4">
                Who should pay the processing fee by default?
              </p>
              <div className="space-y-3">
                <Radio
                  name="defaultFeePayer"
                  value="merchant"
                  label="I pay"
                  checked={defaultFeePayer === 'merchant'}
                  onChange={(value) => setDefaultFeePayer(value as 'merchant' | 'customer')}
                />
                <Radio
                  name="defaultFeePayer"
                  value="customer"
                  label="Client pays"
                  checked={defaultFeePayer === 'customer'}
                  onChange={(value) => setDefaultFeePayer(value as 'merchant' | 'customer')}
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#f9fafb] mb-4">Payout Bank</h2>
              {bankAccount ? (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-[#f9fafb] mb-2">
                    Account ending in {bankAccount.account_number_last4}
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    Type: {bankAccount.account_type.charAt(0).toUpperCase() + bankAccount.account_type.slice(1)}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Contact support to change your bank account
                  </p>
                </div>
              ) : (
                <p className="text-gray-400">No bank account linked</p>
              )}
            </div>

            <Button
              size="large"
              onClick={handleSave}
              disabled={saving}
              className="w-full"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
