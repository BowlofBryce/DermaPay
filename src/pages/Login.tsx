import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { signIn } from '../lib/auth';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) throw signInError;

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900 p-8 rounded-xl">
          <div className="flex justify-center mb-6">
            <img
              src="/src/assets/Untitled 56.svg"
              alt="DermaPay"
              className="h-24 brightness-0 invert"
            />
          </div>
          <h1 className="text-3xl font-bold text-[#f9fafb] mb-8 text-center">Log In</h1>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email or username"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com or Demo"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/signup" className="text-[#f4c064] hover:underline text-base">
              New here? Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
