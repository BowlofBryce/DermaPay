import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { ProgressBar } from '../components/ProgressBar';
import { signUp } from '../lib/auth';
import { createMerchant, createBankAccount } from '../lib/api';
import logo from '../assets/Untitled 56.svg';

export function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [step1Data, setStep1Data] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [step2Data, setStep2Data] = useState({
    shopName: '',
    city: '',
    state: '',
    businessType: 'tattoo_artist',
    monthlyVolume: '<5k',
  });

  const [step3Data, setStep3Data] = useState({
    routingNumber: '',
    accountNumber: '',
    accountType: 'checking' as 'checking' | 'savings',
    confirmed: false,
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleStep1Next = () => {
    if (!step1Data.fullName || !step1Data.email || !step1Data.phone || !step1Data.password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!step2Data.shopName || !step2Data.city || !step2Data.state) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleFinish = async () => {
    if (!step3Data.routingNumber || !step3Data.accountNumber || !step3Data.confirmed) {
      setError('Please fill in all fields and confirm');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await signUp(step1Data.email, step1Data.password);

      if (authError) throw authError;
      if (!authData.user) throw new Error('Sign up failed');

      const merchant = await createMerchant({
        full_name: step1Data.fullName,
        email: step1Data.email,
        phone: step1Data.phone,
        shop_name: step2Data.shopName,
        city: step2Data.city,
        state: step2Data.state,
        business_type: step2Data.businessType,
        monthly_volume: step2Data.monthlyVolume,
        default_fee_payer: 'merchant',
      });

      await createBankAccount({
        merchant_id: merchant.id,
        routing_number: step3Data.routingNumber,
        account_number: step3Data.accountNumber,
        account_type: step3Data.accountType,
      });

      setShowSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#050608] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-900 p-8 rounded-xl text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-[#f9fafb] mb-4">
            You're ready to take payments
          </h1>
          <Button size="large" onClick={() => navigate('/dashboard')} className="w-full">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050608] py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-gray-900 p-8 rounded-xl">
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="DermaPay"
              className="h-24 brightness-0 invert"
            />
          </div>
          <ProgressBar currentStep={step} totalSteps={3} />

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              <h2 className="text-3xl font-bold text-[#f9fafb] mb-6">About You</h2>
              <div className="space-y-4">
                <Input
                  label="Full name"
                  value={step1Data.fullName}
                  onChange={(e) => setStep1Data({ ...step1Data, fullName: e.target.value })}
                  placeholder="John Smith"
                />
                <Input
                  label="Email"
                  type="email"
                  value={step1Data.email}
                  onChange={(e) => setStep1Data({ ...step1Data, email: e.target.value })}
                  placeholder="john@example.com"
                />
                <Input
                  label="Mobile phone"
                  type="tel"
                  value={step1Data.phone}
                  onChange={(e) => setStep1Data({ ...step1Data, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
                <Input
                  label="Password"
                  type="password"
                  value={step1Data.password}
                  onChange={(e) => setStep1Data({ ...step1Data, password: e.target.value })}
                  placeholder="Choose a strong password"
                />
              </div>
              <div className="flex gap-4 mt-8">
                <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
                  Back to home
                </Button>
                <Button onClick={handleStep1Next} className="flex-1">
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-3xl font-bold text-[#f9fafb] mb-6">About Your Shop</h2>
              <div className="space-y-4">
                <Input
                  label="Shop name"
                  value={step2Data.shopName}
                  onChange={(e) => setStep2Data({ ...step2Data, shopName: e.target.value })}
                  placeholder="Ink Masters Studio"
                />
                <Input
                  label="City"
                  value={step2Data.city}
                  onChange={(e) => setStep2Data({ ...step2Data, city: e.target.value })}
                  placeholder="Los Angeles"
                />
                <Input
                  label="State"
                  value={step2Data.state}
                  onChange={(e) => setStep2Data({ ...step2Data, state: e.target.value })}
                  placeholder="CA"
                />
                <Select
                  label="What do you do?"
                  value={step2Data.businessType}
                  onChange={(e) => setStep2Data({ ...step2Data, businessType: e.target.value })}
                  options={[
                    { value: 'tattoo_artist', label: 'Tattoo artist' },
                    { value: 'tattoo_shop', label: 'Tattoo shop' },
                    { value: 'med_spa', label: 'Med spa' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
                <Select
                  label="Approx. monthly volume"
                  value={step2Data.monthlyVolume}
                  onChange={(e) => setStep2Data({ ...step2Data, monthlyVolume: e.target.value })}
                  options={[
                    { value: '<5k', label: 'Less than $5,000' },
                    { value: '5k-15k', label: '$5,000 - $15,000' },
                    { value: '>15k', label: 'More than $15,000' },
                  ]}
                />
              </div>
              <div className="flex gap-4 mt-8">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleStep2Next} className="flex-1">
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-3xl font-bold text-[#f9fafb] mb-6">Bank & Payout Info</h2>
              <div className="space-y-4">
                <Input
                  label="Business bank account routing number"
                  value={step3Data.routingNumber}
                  onChange={(e) => setStep3Data({ ...step3Data, routingNumber: e.target.value })}
                  placeholder="123456789"
                />
                <Input
                  label="Business bank account number"
                  value={step3Data.accountNumber}
                  onChange={(e) => setStep3Data({ ...step3Data, accountNumber: e.target.value })}
                  placeholder="1234567890"
                />
                <Select
                  label="Account type"
                  value={step3Data.accountType}
                  onChange={(e) => setStep3Data({ ...step3Data, accountType: e.target.value as 'checking' | 'savings' })}
                  options={[
                    { value: 'checking', label: 'Checking' },
                    { value: 'savings', label: 'Savings' },
                  ]}
                />
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={step3Data.confirmed}
                    onChange={(e) => setStep3Data({ ...step3Data, confirmed: e.target.checked })}
                    className="w-5 h-5 mt-1 text-[#f4c064] bg-gray-800 border-gray-700 rounded focus:ring-[#f4c064]"
                  />
                  <span className="text-[#f9fafb] text-base">
                    I confirm this is my business account.
                  </span>
                </label>
              </div>
              <div className="flex gap-4 mt-8">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1" disabled={loading}>
                  Back
                </Button>
                <Button onClick={handleFinish} className="flex-1" disabled={loading}>
                  {loading ? 'Setting up...' : 'Finish and go to dashboard'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
