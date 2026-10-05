import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Lock, Mail, ArrowLeft, Sparkles } from 'lucide-react';

export const AdminLogin = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.user?.role === 'admin') {
        addToast('Welcome back, Admin!', 'success');
        navigate('/admin');
      } else {
        addToast('Access denied: Admin privileges required', 'error');
      }
    } catch (err) {
      addToast(err.response?.data?.errors?.[0] || 'Invalid admin credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@mrdcinemaeditz.com');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center p-4 relative overflow-hidden text-white selection:bg-[#D4A346] selection:text-black">
      {/* Ambient background glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4A346]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#996F28]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-block relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#D4A346] via-[#F5C869] to-[#996F28] shadow-2xl shadow-[#D4A346]/20 mb-4">
            <img
              src="/logo.png"
              alt="MRD CINEMA EDITZ"
              className="w-full h-full object-cover rounded-full bg-black"
            />
          </div>
          <h1 className="font-cinematic text-2xl font-bold tracking-widest text-white">
            MRD STUDIO
          </h1>
          <div className="flex items-center justify-center gap-1.5 mt-1 text-xs font-mono-code uppercase tracking-wider text-[#F5C869]">
            <ShieldCheck className="w-4 h-4 text-[#D4A346]" />
            <span>Admin Portal Access</span>
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-[#0F0F13]/90 border border-[#D4A346]/30 rounded-3xl p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mrdcinemaeditz.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#15151B] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4A346] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#15151B] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4A346] transition-colors"
                />
              </div>
            </div>

            {/* Quick Fill Helper */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleQuickFill}
                className="inline-flex items-center gap-1.5 text-[#F5C869] hover:text-[#D4A346] transition-colors font-mono-code text-[11px]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick-fill seeded credentials</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-heading font-bold text-xs uppercase tracking-widest text-black bg-gold-gradient hover:opacity-95 active:scale-[0.98] transition-all duration-200 shadow-xl shadow-[#D4A346]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enter Admin Console</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800/80 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
