import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { getCurrentMerchant, getPayments } from '../lib/api';
import { signOut } from '../lib/auth';
import { Payment, Merchant } from '../lib/supabase';
import { Settings } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const merchantData = await getCurrentMerchant();
      if (!merchantData) {
        navigate('/signup');
        return;
      }

      setMerchant(merchantData);

      const paymentsData = await getPayments(merchantData.id);
      setPayments(paymentsData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-900/50 text-green-200 border-green-700';
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-200 border-yellow-700';
      case 'failed':
        return 'bg-red-900/50 text-red-200 border-red-700';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050608] flex items-center justify-center">
        <div className="text-[#f9fafb] text-xl">Loading...</div>
      </div>
    );
  }

  const isDemo = merchant?.id === 'demo-merchant';

  return (
    <div className="min-h-screen bg-[#050608] pb-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {isDemo && (
          <div className="mb-6 rounded-xl border border-yellow-400/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
            You are viewing a demo account. Data shown here is example data only.
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#f9fafb]">
            Welcome, {merchant?.full_name.split(' ')[0]}
          </h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="small"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="small" onClick={handleSignOut}>
              Log out
            </Button>
          </div>
        </div>

        <div className="space-y-4 mb-12">
          <Button
            size="large"
            className="w-full text-xl"
            onClick={() => navigate('/take-payment')}
          >
            Take a Payment
          </Button>
          <Button
            variant="outline"
            size="large"
            className="w-full"
            onClick={() => navigate('/take-payment?mode=link')}
          >
            Send Payment Link
          </Button>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-[#f9fafb] mb-6">Today's payments</h2>

          {payments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-6">
                No payments yet. Tap 'Take a Payment' to create your first one.
              </p>
              <Button onClick={() => navigate('/take-payment')}>
                Take a Payment
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[#f9fafb] font-medium text-lg">
                        {formatCurrency(payment.amount)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs border ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {formatTime(payment.created_at)}
                      {payment.client_name && ` • ${payment.client_name}`}
                      {payment.note && ` • ${payment.note}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
