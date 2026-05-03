import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/useAuth';
import { useTheme } from '../store/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FolderKanban, UserCircle, LogOut, Moon, Sun, Menu, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('refreshToken');
    logout();
  };

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/projects', icon: <FolderKanban size={20} />, label: 'Projects', adminOnly: true },
    { to: '/profile', icon: <UserCircle size={20} />, label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 flex flex-col transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${theme === 'dark' ? 'bg-[#151c2e] border-r border-slate-800' : 'bg-white border-r border-gray-100'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">
            TeamFlow
          </h1>
          <button 
            onClick={() => setIsOpen(false)}
            className={`p-2 rounded-xl transition-colors lg:hidden ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-50 text-gray-400'}`}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== 'admin') return null;
            const isActive = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
            
            return (
              <Link 
                key={item.to}
                to={item.to} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between group px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/20' 
                    : theme === 'dark'
                      ? 'text-slate-400 hover:bg-slate-800/50 hover:text-indigo-400'
                      : 'text-slate-500 hover:bg-indigo-50/50 hover:text-indigo-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon} {item.label}
                </div>
                {isActive && <ChevronRight size={14} className="opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className={`p-6 border-t ${theme === 'dark' ? 'border-slate-800/50' : 'border-gray-50'}`}>
          <button 
            onClick={handleLogout} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${theme === 'dark' ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default function Layout() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Close sidebar when location changes (for mobile)
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className={`flex h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0b0f19] text-slate-50' : 'bg-slate-50 text-slate-900'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className={`sticky top-0 z-30 p-4 flex items-center justify-between lg:justify-end transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0b0f19]/80 border-b border-slate-800/80 backdrop-blur-md' : 'bg-white/80 border-b border-gray-100 backdrop-blur-md'}`}>
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 rounded-xl shadow-sm transition-colors ${theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              <Menu size={24} />
            </button>
            <h1 className={`text-xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>TeamFlow</h1>
          </div>

          <div className="flex items-center gap-4">
            <motion.button 
              whileTap={{ scale: 0.8, rotate: 180 }}
              onClick={toggleTheme} 
              className={`p-2.5 rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'bg-gray-50 hover:bg-gray-100 text-gray-500 shadow-sm'}`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <Link to="/profile" className="group">
              {user?.avatar || user?.profilePicture || user?.photo ? (
                <img src={user.avatar || user.profilePicture || user.photo} alt={user.name} className={`w-10 h-10 rounded-xl object-cover shadow-sm transition-transform group-hover:scale-105 ${theme === 'dark' ? 'border border-slate-700' : 'border border-indigo-100'}`} />
              ) : (
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all shadow-sm ${theme === 'dark' ? 'bg-slate-800 text-indigo-400 border border-slate-700 hover:bg-indigo-600 hover:text-white' : 'bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white'}`}>
                  {user?.name?.charAt(0)}
                </div>
              )}
            </Link>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6 md:p-10 max-w-7xl mx-auto w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
