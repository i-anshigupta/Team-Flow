import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { api } from '../../lib/axios';
import { useAuth } from '../../store/useAuth';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      localStorage.setItem('refreshToken', res.data.data.refreshToken);
      setAuth(res.data.data.user, res.data.data.accessToken);
      toast.success('Welcome back to TeamFlow!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-500/10 blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500"></div>
          <div className="p-8 sm:p-10">
            <div className="text-center mb-10">
              <motion.div 
                initial={{ rotate: -15, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 mb-6 shadow-inner border border-indigo-100/50"
              >
                <LogIn size={32} strokeWidth={2.5} />
              </motion.div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
              <p className="text-slate-500 font-medium text-sm">Sign in to continue your journey</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="relative group">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within:text-indigo-500">Username or Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    {...register('identifier', { required: 'Username or Email is required' })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 focus:bg-white focus:ring-[3px] focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-300"
                    type="text"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.identifier && <span className="text-[11px] font-semibold text-rose-500 mt-1.5 ml-1 block">{errors.identifier.message}</span>}
              </div>

              <div className="relative group">
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider transition-colors group-focus-within:text-indigo-500">Password</label>
                  <Link to="/forgot-password" title="Recover password" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    {...register('password', { required: 'Password is required' })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 focus:bg-white focus:ring-[3px] focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-300"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <span className="text-[11px] font-semibold text-rose-500 mt-1.5 ml-1 block">{errors.password.message}</span>}
              </div>

              <button 
                disabled={loading}
                className="w-full py-4 mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-bold transition-all shadow-[0_10px_25px_rgba(99,102,241,0.4)] hover:shadow-[0_15px_35px_rgba(99,102,241,0.5)] disabled:opacity-70 disabled:hover:shadow-none flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500 font-medium">
                New to the platform? <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-bold ml-1 transition-colors">Create an account</Link>
              </p>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex items-center justify-center gap-2 text-slate-400 font-medium"
        >
          <Sparkles size={14} className="text-amber-400" />
          <p className="text-[11px] uppercase tracking-widest font-semibold">Experience seamless teamwork</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
