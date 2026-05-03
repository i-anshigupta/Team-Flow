import { useState } from 'react';
import { useAuth } from '../../store/useAuth';
import { api } from '../../lib/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Key, Camera } from 'lucide-react';
import { useTheme } from '../../store/useTheme';

export default function Profile() {
  const { user, setAuth } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setLoading(true);
    try {
      await api.patch('/auth/change-password', passwords);
      toast.success('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10">
      <div className="flex flex-col gap-2">
        <h1 className={`text-3xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>Account Settings</h1>
        <p className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Manage your profile and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className={`${theme === 'dark' ? 'bg-[#151c2e]/80 border-slate-800/80 shadow-[0_15px_40px_rgba(0,0,0,0.1)]' : 'bg-white border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'} p-8 rounded-3xl border text-center backdrop-blur-xl transition-all`}>
            <div className="relative inline-block mb-6">
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-bold border-2 shadow-xl ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400 border-slate-700/50' : 'bg-indigo-50 text-indigo-600 border-white'}`}>
                {user?.name?.charAt(0)}
              </div>
              <button className={`absolute -bottom-2 -right-2 p-2 rounded-xl shadow-lg border transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-indigo-400' : 'bg-white border-gray-50 text-gray-400 hover:text-indigo-600'}`}>
                <Camera size={16} />
              </button>
            </div>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>{user?.name}</h2>
            <p className={`font-medium text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`}>@{user?.username}</p>
            <div className={`mt-4 inline-block px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-full ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
              {user?.role}
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-[#151c2e]/80 border-slate-800/80 shadow-[0_15px_40px_rgba(0,0,0,0.1)]' : 'bg-white border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'} p-6 rounded-3xl border space-y-4 backdrop-blur-xl transition-all`}>
            <div className={`flex items-center gap-4 p-3 rounded-2xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50/50'}`}>
              <Mail className={theme === 'dark' ? 'text-slate-400' : 'text-gray-400'} size={18} />
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`}>Email Address</p>
                <p className={`text-sm font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>{user?.email}</p>
              </div>
            </div>
            <div className={`flex items-center gap-4 p-3 rounded-2xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50/50'}`}>
              <Shield className={theme === 'dark' ? 'text-slate-400' : 'text-gray-400'} size={18} />
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`}>Security Status</p>
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'}`}>Verified Account</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className={`${theme === 'dark' ? 'bg-[#151c2e]/80 border-slate-800/80 shadow-[0_15px_40px_rgba(0,0,0,0.1)]' : 'bg-white border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'} p-8 rounded-3xl border backdrop-blur-xl transition-all`}>
            <h3 className={`text-lg font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>
              <Key size={20} className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} /> Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-[#111827]'}`}>Current Password</label>
                <input 
                  type="password"
                  required
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-white focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-[#111827] focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600'}`}
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-[#111827]'}`}>New Password</label>
                  <input 
                    type="password"
                    required
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-white focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-[#111827] focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600'}`}
                    placeholder="Min 6 characters"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-[#111827]'}`}>Confirm New Password</label>
                  <input 
                    type="password"
                    required
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-white focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-[#111827] focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600'}`}
                    placeholder="Repeat new password"
                  />
                </div>
              </div>
              <button 
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg shadow-indigo-600/20 disabled:opacity-50 mt-4"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
