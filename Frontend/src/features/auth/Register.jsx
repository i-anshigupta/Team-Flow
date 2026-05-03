import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { api } from '../../lib/axios';
import { useAuth } from '../../store/useAuth';
import toast from 'react-hot-toast';
import { User, Mail, Lock, UserCheck, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      role: 'user'
    }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const password = watch('password', '');
  const strength = Math.min(password.length * 10, 100);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/register', data);
      toast.success('Account created successfully! Please sign in to continue.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
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
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500"></div>
          <div className="p-8 sm:p-12">
            <div className="text-center mb-10">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 mb-6 shadow-inner border border-indigo-100/50"
              >
                <UserCheck size={32} strokeWidth={2.5} />
              </motion.div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Join TeamFlow</h1>
              <p className="text-slate-500 font-medium text-sm">Create your collaborative workspace today</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="relative group">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within:text-indigo-500">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      {...register('name', { required: 'Name is required' })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 focus:bg-white focus:ring-[3px] focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-300"
                      type="text"
                      placeholder="Jane Doe"
                    />
                  </div>
                  {errors.name && <span className="text-[11px] font-semibold text-rose-500 mt-1.5 ml-1 block">{errors.name.message}</span>}
                </div>

                <div className="relative group">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within:text-indigo-500">Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm group-focus-within:text-indigo-500 transition-colors">@</span>
                    <input 
                      {...register('username', { 
                        required: 'Username is required', 
                        pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Alphanumeric and underscores only' } 
                      })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 focus:bg-white focus:ring-[3px] focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-300"
                      type="text"
                      placeholder="jane_doe"
                    />
                  </div>
                  {errors.username && <span className="text-[11px] font-semibold text-rose-500 mt-1.5 ml-1 block">{errors.username.message}</span>}
                </div>
              </div>

              <div className="relative group">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within:text-indigo-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' }
                    })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 focus:bg-white focus:ring-[3px] focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-300"
                    type="email"
                    placeholder="jane@example.com"
                  />
                </div>
                {errors.email && <span className="text-[11px] font-semibold text-rose-500 mt-1.5 ml-1 block">{errors.email.message}</span>}
              </div>

              <div className="relative group">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within:text-indigo-500">Account Type</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <select
                    {...register('role', {
                      validate: (value, formValues) => {
                        const email = formValues.email?.toLowerCase() || '';
                        if (value === 'admin' && !email.endsWith('@ethara.in')) {
                          return 'Admin role requires an @ethara.in email.';
                        }
                        if (value === 'user' && email.endsWith('@ethara.in')) {
                          return 'Internal emails must use Admin role.';
                        }
                        return true;
                      }
                    })}
                    className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 focus:bg-white focus:ring-[3px] focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium appearance-none cursor-pointer"
                  >
                    <option value="user">Standard User</option>
                    <option value="admin">System Admin</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ArrowRight size={16} className="rotate-90" />
                  </div>
                </div>
                {errors.role && <span className="text-[11px] font-semibold text-rose-500 mt-1.5 ml-1 block">{errors.role.message}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="relative group">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within:text-indigo-500">Date of Birth</label>
                  <input 
                    {...register('dob', { required: 'DOB is required' })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 focus:bg-white focus:ring-[3px] focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium"
                    type="date"
                  />
                  {errors.dob && <span className="text-[11px] font-semibold text-rose-500 mt-1.5 ml-1 block">{errors.dob.message}</span>}
                </div>

                <div className="relative group">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within:text-indigo-500">Security Question</label>
                  <select 
                    {...register('securityQuestion', { required: 'Required' })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 focus:bg-white focus:ring-[3px] focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium appearance-none cursor-pointer"
                  >
                    <option value="What is your favourite movie?">Favourite Movie?</option>
                    <option value="Who was your favourite teacher?">Favourite Teacher?</option>
                    <option value="What is your first pet name?">First Pet Name?</option>
                  </select>
                </div>
              </div>

              <div className="relative group">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within:text-indigo-500">Security Answer</label>
                <input 
                  {...register('securityAnswer', { required: 'Security answer is required' })}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 focus:bg-white focus:ring-[3px] focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-300"
                  type="text"
                  placeholder="Your answer here..."
                />
                {errors.securityAnswer && <span className="text-[11px] font-semibold text-rose-500 mt-1.5 ml-1 block">{errors.securityAnswer.message}</span>}
              </div>

              <div className="relative group">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within:text-indigo-500">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    {...register('password', { 
                      required: 'Password is required', 
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
                        message: 'Must include letter, number, and symbol'
                      }
                    })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 focus:bg-white focus:ring-[3px] focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-300"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                {password && (
                  <div className="mt-3 px-1">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${strength < 40 ? 'bg-rose-500' : strength < 80 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${strength}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security Strength</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${strength < 40 ? 'text-rose-500' : strength < 80 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {strength < 40 ? 'Weak' : strength < 80 ? 'Medium' : 'Strong'}
                      </span>
                    </div>
                  </div>
                )}
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
                    <>Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500 font-medium">
                Already part of the team? <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold ml-1 transition-colors">Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-400 font-medium tracking-wide">
          Protected by industry standard encryption. By joining, you agree to our <span className="underline cursor-pointer hover:text-indigo-500 transition-colors">Terms</span>.
        </p>
      </motion.div>
    </div>
  );
}
