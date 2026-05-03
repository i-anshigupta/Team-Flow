import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../store/useTheme';

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen overflow-x-hidden relative transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0b0f19] text-slate-50' : 'bg-slate-50 text-slate-900'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] animate-pulse transition-colors duration-500 ${theme === 'dark' ? 'bg-indigo-600/20' : 'bg-indigo-500/10'}`} style={{ animationDuration: '8s' }}></div>
        <div className={`absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px] animate-pulse transition-colors duration-500 ${theme === 'dark' ? 'bg-violet-600/20' : 'bg-violet-500/10'}`} style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
        <div className={`absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full blur-[120px] animate-pulse transition-colors duration-500 ${theme === 'dark' ? 'bg-purple-600/20' : 'bg-purple-500/10'}`} style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="py-5 px-6 md:px-12 flex justify-between items-center w-full bg-transparent relative z-50">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white transform group-hover:scale-110 transition-transform">
              <path d="M12 2.5L3 7L12 11.5L21 7L12 2.5Z" fill="currentColor"/>
              <path d="M3 12L12 16.5L21 12" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
              <path d="M3 17L12 21.5L21 17" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="leading-[1.1]">
            <span className={`block font-black text-[18px] tracking-tight group-hover:text-indigo-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>TeamFlow</span>
            <span className={`block font-semibold text-[11px] tracking-widest uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Workspace</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className={`hidden lg:flex items-center gap-8 text-[14px] font-bold tracking-wide transition-colors ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
          <button className="flex items-center gap-1 hover:text-indigo-500 transition-colors">Platform <ChevronDown size={14} className="mt-0.5" /></button>
          <button className="flex items-center gap-1 hover:text-indigo-500 transition-colors">Solutions <ChevronDown size={14} className="mt-0.5" /></button>
          <button className="hover:text-indigo-500 transition-colors">Pricing</button>
          <button className="flex items-center gap-1 hover:text-indigo-500 transition-colors">Resources <ChevronDown size={14} className="mt-0.5" /></button>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <motion.button 
            whileTap={{ scale: 0.8, rotate: 180 }}
            onClick={toggleTheme} 
            className={`p-2.5 rounded-full transition-all mr-2 ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          <Link to="/login" className={`px-6 py-2.5 rounded-full border text-[14px] font-bold transition-all ${theme === 'dark' ? 'border-slate-700 text-slate-200 hover:border-indigo-400 hover:text-indigo-400 hover:bg-indigo-900/30' : 'border-slate-200 text-slate-700 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50'}`}>
            Sign In
          </Link>
          <Link to="/register" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[14px] font-bold hover:from-indigo-500 hover:to-violet-500 transition-all shadow-[0_10px_25px_rgba(99,102,241,0.3)] hover:shadow-[0_15px_35px_rgba(99,102,241,0.4)]">
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex flex-col lg:flex-row items-center justify-between pt-20 pb-10 px-6 md:px-12 relative w-full min-h-[calc(100vh-160px)] max-w-7xl mx-auto gap-12">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2 text-left z-20 relative"
        >

          <h1 className={`text-[3rem] sm:text-[4rem] lg:text-[4.5rem] leading-[1.1] font-extrabold tracking-tight mb-6 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">Teamwork</span> Through Collaboration
          </h1>
          <p className={`text-lg md:text-[1.15rem] max-w-xl mb-10 leading-relaxed font-medium transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Empower your team to collaborate seamlessly, streamline workflows, and drive results together with confidence and clarity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[15px] font-bold hover:from-indigo-500 hover:to-violet-500 transition-all shadow-[0_10px_25px_rgba(99,102,241,0.3)] hover:shadow-[0_15px_35px_rgba(99,102,241,0.4)] text-center">
              Start for free
            </Link>
            <button className={`w-full sm:w-auto px-8 py-3.5 rounded-full border-2 text-[15px] font-bold transition-all text-center ${theme === 'dark' ? 'border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-900/30' : 'border-slate-200 text-slate-700 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50'}`}>
              Book a demo
            </button>
          </div>
        </motion.div>

        {/* Graphic Area */}
        <div className="relative w-full lg:w-1/2 flex justify-center items-center mt-12 lg:mt-0 pb-10 lg:pb-0">
          
          {/* Abstract Background Elements (Nodes and Lines) */}
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
            {/* Connecting Lines */}
            <svg className="absolute w-[120%] h-[120%] overflow-visible opacity-50 -left-[10%]" viewBox="0 0 1000 600" fill="none">
              <path d="M 150 300 Q 350 150 500 200 T 850 250" stroke="url(#gradient1)" strokeWidth="2" fill="none" strokeDasharray="6 6" />
              <path d="M 500 200 Q 700 50 850 150" stroke="url(#gradient2)" strokeWidth="2" fill="none" strokeDasharray="6 6" />
              <path d="M 100 450 Q 300 500 500 450" stroke="url(#gradient1)" strokeWidth="2" fill="none" strokeDasharray="6 6" />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
            </svg>

            {/* Small Floating Nodes */}
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className={`absolute top-[10%] left-[5%] w-12 h-12 rounded-xl flex items-center justify-center border rotate-12 z-30 transition-colors ${theme === 'dark' ? 'bg-[#151c2e] border-slate-700 shadow-[0_10px_30px_rgba(99,102,241,0.4)]' : 'bg-white shadow-[0_10px_30px_rgba(99,102,241,0.2)] border-indigo-50'}`}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500"></div>
            </motion.div>
            <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className={`absolute top-[70%] right-[10%] w-16 h-16 rounded-[1rem] flex items-center justify-center border -rotate-6 z-30 transition-colors ${theme === 'dark' ? 'bg-[#151c2e] border-slate-700 shadow-[0_15px_40px_rgba(139,92,246,0.4)]' : 'bg-white shadow-[0_15px_40px_rgba(139,92,246,0.2)] border-violet-50'}`}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-400 to-purple-500 rotate-45"></div>
            </motion.div>
            <div className={`absolute top-[20%] right-[5%] w-10 h-10 rounded-full blur-[3px] transition-colors ${theme === 'dark' ? 'bg-indigo-400/30' : 'bg-indigo-500/20'}`}></div>
          </div>

          {/* Team Meeting Image */}
          <motion.div 
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className={`relative z-20 w-full rounded-[2rem] overflow-hidden shadow-[0_30px_80px_-20px_rgba(99,102,241,0.3)] border-[6px] transition-colors ${theme === 'dark' ? 'border-[#1e293b] bg-[#0f172a]' : 'border-white/80 bg-white'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent pointer-events-none mix-blend-overlay z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Team collaborating in a meeting" 
              className="w-full h-auto object-cover rounded-[1.5rem]"
            />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-8 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center w-full relative z-30 transition-colors ${theme === 'dark' ? 'bg-transparent border-t border-transparent' : 'bg-white/50 backdrop-blur-md border-t border-slate-200/50'}`}>
        
        {/* Footer Navigation Links Removed */}
        
        {/* Social Icons */}
        <div className={`flex items-center gap-5 mb-6 sm:mb-0 transition-colors ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
          <a href="https://github.com/i-anshigupta" target="_blank" rel="noopener noreferrer" className={`transition-colors ${theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-indigo-600'}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/anshigupta/" target="_blank" rel="noopener noreferrer" className={`transition-colors ${theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-indigo-600'}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <div className={`text-[12px] font-medium tracking-wide transition-colors ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
          © {new Date().getFullYear()} TeamFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
