import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Radio } from '../components/Radio';
import { createPaymentViaAPI, getCurrentMerchant } from '../lib/api';
import { Copy, Share2, ArrowLeft } from 'lucide-react';

export function TakePayment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'link' ? 'link' : 'in_person';

  const [mode, setMode] = useState<'in_person' | 'link'>(initialMode);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [feePayer, setFeePayer] = useState<'merchant' | 'customer'>('merchant');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [paymentCreated, setPaymentCreated] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');

  useEffect(() => {
    checkMerchant();
  }, []);

  const checkMerchant = async () => {
    const merchant = await getCurrentMerchant();
    if (merchant?.default_fee_payer) {
      setFeePayer(merchant.default_fee_payer);
    }
  };

  const handleCreatePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const amountInCents = Math.round(parseFloat(amount) * 100);

      const response = await createPaymentViaAPI({
        mode,
        amount: amountInCents,
        note: note || undefined,
        feePayer,
      });

      setPaymentId(response.id);
      setPaymentUrl(response.checkoutUrl);
      setDisplayAmount(amount);
      setPaymentCreated(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentUrl);
    alert('Link copied!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Payment Link',
        text: `Pay $${displayAmount}`,
        url: paymentUrl,
      });
    } else {
      handleCopyLink();
    }
  };

  if (paymentCreated) {
    return (
      <div className="min-h-screen bg-[#050608] py-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-gray-900 p-8 rounded-xl text-center">
            <div className="text-6xl mb-6">👍</div>
            <h1 className="text-3xl font-bold text-[#f9fafb] mb-6">
              Payment created
            </h1>

            <div className="mb-8">
              <p className="text-2xl text-[#f4c064] font-bold mb-6">
                ${displayAmount}
              </p>

              {mode === 'in_person' && (
                <div className="bg-white p-6 rounded-xl mb-6 inline-block">
                  <QRCodeSVG value={paymentUrl} size={256} />
                </div>
              )}

              <p className="text-gray-300 mb-4 text-lg">
                {mode === 'in_person'
                  ? 'Ask your client to scan this.'
                  : 'Share this link with your client.'}
              </p>

              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <p className="text-[#f9fafb] text-sm break-all">{paymentUrl}</p>
              </div>

              <div className="flex gap-3 justify-center">
                <Button onClick={handleCopyLink} variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy link
                </Button>
                <Button onClick={handleShare} variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <Button size="large" onClick={() => navigate('/dashboard')} className="w-full">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050608] py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Button
          variant="outline"
          size="small"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-gray-900 p-8 rounded-xl">
          <h1 className="text-3xl font-bold text-[#f9fafb] mb-6">Create a payment</h1>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="mb-6">
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setMode('in_person')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-base transition-colors ${
                  mode === 'in_person'
                    ? 'bg-[#f4c064] text-[#050608]'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                In person
              </button>
              <button
                onClick={() => setMode('link')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-base transition-colors ${
                  mode === 'link'
                    ? 'bg-[#f4c064] text-[#050608]'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Send link
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#f9fafb] text-base font-medium mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f9fafb] text-xl">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-[#f9fafb] text-xl placeholder-gray-500 focus:outline-none focus:border-[#f4c064]"
                  />
                </div>
              </div>

              <Input
                label="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Deposit for sleeve"
              />

              <div>
                <label className="block text-[#f9fafb] text-base font-medium mb-3">
                  Who pays the fee?
                </label>
                <div className="space-y-3">
                  <Radio
                    name="feePayer"
                    value="merchant"
                    label="I pay the fee"
                    checked={feePayer === 'merchant'}
                    onChange={(value) => setFeePayer(value as 'merchant' | 'customer')}
                  />
                  <Radio
                    name="feePayer"
                    value="customer"
                    label="Client pays the fee (adds it to their total)"
                    checked={feePayer === 'customer'}
                    onChange={(value) => setFeePayer(value as 'merchant' | 'customer')}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  If you pick 'Client pays the fee', we add a small fee on top so your payout stays the same.
                </p>
              </div>
            </div>
          </div>

          <Button
            size="large"
            onClick={handleCreatePayment}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creating...' : 'Create payment'}
          </Button>
        </div>
      </div>
    </div>
  );
}
