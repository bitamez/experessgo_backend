import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, User, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) setError(loginError.message);
    else navigate('/');
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-white/60">Enter your credentials to access your account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="email"
                required
                className="input-field w-full pl-11"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="password"
                required
                className="input-field w-full pl-11"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded-md border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500" />
              <span className="text-white/60">Remember me</span>
            </label>
            <Link to="/forgot-password" name="forgot-password" id="forgot-password" className="text-primary-500 hover:text-primary-400 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-button w-full flex items-center justify-center space-x-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-white/40">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="glass-button flex items-center justify-center space-x-2">
            <UserPlus className="w-5 h-5" />
            <span>Google</span>
          </button>
          <button className="glass-button flex items-center justify-center space-x-2">
            <User className="w-5 h-5" />
            <span>GitHub</span>
          </button>
        </div>

        <p className="text-center text-sm text-white/60">
          Don't have an account?{' '}
          <Link to="/signup" name="signup-link" id="signup-link" className="text-primary-500 font-semibold hover:text-primary-400 transition-colors">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
