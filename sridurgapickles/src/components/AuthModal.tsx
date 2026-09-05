import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Lock, Mail } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setError('');
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const request = mode === 'signup'
        ? supabase.auth.signUp({ email: email.trim(), password })
        : supabase.auth.signInWithPassword({ email: email.trim(), password });

      const result = await Promise.race([
        request,
        new Promise<{ error: Error }>((resolve) =>
          setTimeout(() => resolve({ error: new Error('TIMEOUT') }), 12000)
        ),
      ]);

      if (result.error) {
        setError(result.error.message === 'TIMEOUT'
          ? 'Sign in is taking too long. Please check your internet connection and try again.'
          : mode === 'signup'
            ? 'Could not create account. Please try a different email or a stronger password.'
            : 'Invalid email or password. Please try again.');
        return;
      }

      setError('');
      if (mode === 'signup' && !('data' in result && result.data.session)) {
        setError('Account created. Please verify your email, then sign in.');
        setMode('signin');
        return;
      }
      onClose();
    } catch {
      setError('Unable to connect to the sign-in service. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-stone-400 hover:text-stone-600">
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <Lock className="h-7 w-7 text-amber-700" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-800">
            {mode === 'signin' ? 'Admin Sign In' : 'Create Admin Account'}
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {mode === 'signin' ? 'Sign in to manage your products' : 'The first account created becomes the admin'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-600">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-3 focus:border-amber-500 focus:outline-none"
                placeholder="admin@example.com"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-600">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-3 focus:border-amber-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-stone-500">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
            className="font-semibold text-amber-700 hover:underline"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
