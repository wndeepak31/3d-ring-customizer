'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        window.location.href = '/admin';
      } else {
        setError(data.error || 'Invalid password');
        setLoading(false);
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B132B] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-50"></div>

      <div className="max-w-md w-full space-y-8 bg-white/5 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/10 z-10">
        <div>
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-blue-900/50">L</div>
          </div>
          <h2 className="mt-2 text-center text-3xl font-light tracking-[0.2em] text-white uppercase">Jewel Core Admin</h2>
          <p className="mt-3 text-center text-sm text-blue-200/60 tracking-wider">SECURE PORTAL ACCESS</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg border border-red-500/30">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="sr-only">Password</label>
              <input
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-white/10 placeholder-blue-200/40 text-white bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                placeholder="Enter Administrator Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold tracking-widest uppercase rounded-xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B132B] focus:ring-blue-500 transition-all shadow-lg shadow-blue-900/50 disabled:bg-blue-800/50 disabled:text-white/50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
