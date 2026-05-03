import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { api } from '../../lib/axios';
import toast from 'react-hot-toast';
import { Lock, Mail, Calendar, HelpCircle, Key, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', data);
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfd] py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-12">
            {!success ? (
              <>
                <div className="text-center mb-10">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 mb-6"
                  >
                    <Key size={32} />
                  </motion.div>
                  <h1 className="text-4xl font-black text-[#111827] mb-3 tracking-tight">Recover Access</h1>
                  <p className="text-gray-500 font-medium text-sm">Verify your identity to reset your password</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Account Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        {...register('email', { required: 'Email is required' })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#6db5aa]/10 focus:border-[#6db5aa] outline-none transition-all text-[#111827] font-semibold"
                        type="email"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        {...register('dob', { required: 'DOB is required' })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#6db5aa]/10 focus:border-[#6db5aa] outline-none transition-all text-[#111827] font-semibold"
                        type="date"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="relative">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Security Question</label>
                      <div className="relative">
                        <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select 
                          {...register('securityQuestion', { required: 'Required' })}
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#6db5aa]/10 focus:border-[#6db5aa] outline-none transition-all text-[#111827] font-semibold appearance-none cursor-pointer"
                        >
                          <option value="What is your favourite movie?">Favourite Movie?</option>
                          <option value="Who was your favourite teacher?">Favourite Teacher?</option>
                          <option value="What is your first pet name?">First Pet Name?</option>
                        </select>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Answer</label>
                      <input 
                        {...register('securityAnswer', { required: 'Answer is required' })}
                        className="w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#6db5aa]/10 focus:border-[#6db5aa] outline-none transition-all text-[#111827] font-semibold"
                        type="text"
                        placeholder="Your answer"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Set New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        {...register('newPassword', { 
                          required: 'New password is required',
                          minLength: { value: 6, message: 'Min 6 chars' }
                        })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#6db5aa]/10 focus:border-[#6db5aa] outline-none transition-all text-[#111827] font-semibold"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full py-4 mt-6 bg-[#111827] hover:bg-[#1f2937] text-white rounded-2xl font-bold transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>Verify & Reset Password <ArrowRight size={18} /></>
                    )}
                  </button>
                </form>

                <div className="mt-10 text-center">
                  <Link to="/login" className="text-gray-400 hover:text-[#111827] font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                    <ArrowLeft size={16} /> Back to Login
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 mb-6"
                >
                  <CheckCircle2 size={48} />
                </motion.div>
                <h2 className="text-3xl font-black text-[#111827] mb-4">Security Verified!</h2>
                <p className="text-gray-500 font-medium mb-8">Your password has been reset successfully. You will be redirected to the login page in a moment.</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full py-4 bg-[#6db5aa] text-white rounded-2xl font-bold shadow-lg shadow-[#6db5aa]/20"
                >
                  Go to Login Now
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
