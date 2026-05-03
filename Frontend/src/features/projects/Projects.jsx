import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useTheme } from '../../store/useTheme';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/projects', data);
      setProjects([...projects, res.data.data]);
      toast.success('Project created');
      setShowModal(false);
      reset();
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className={`text-3xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>Projects</h1>
          <p className={`font-medium text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Manage and track all your active initiatives.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} strokeWidth={3} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className={`h-48 rounded-2xl animate-pulse ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200/50'}`}></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link 
                to={`/projects/${project._id}`}
                className={`block h-full p-6 rounded-2xl border transition-all group backdrop-blur-xl ${theme === 'dark' ? 'bg-[#151c2e]/80 border-slate-800/80 shadow-[0_15px_40px_rgba(0,0,0,0.1)] hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.05)]' : 'bg-white border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:border-indigo-600/30'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`text-xl font-bold line-clamp-1 transition-colors ${theme === 'dark' ? 'text-white group-hover:text-indigo-400' : 'text-[#111827] group-hover:text-indigo-600'}`}>{project.name}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    project.status === 'active' 
                      ? theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                      : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className={`text-sm mb-6 line-clamp-2 font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{project.description || 'No description provided.'}</p>
                <div className={`flex items-center justify-between text-xs font-bold ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className={theme === 'dark' ? 'text-slate-600' : 'text-gray-300'} /> {project.members?.length || 0} Members
                  </div>
                  {project.dueDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className={theme === 'dark' ? 'text-slate-600' : 'text-gray-300'} /> {format(new Date(project.dueDate), 'MMM d, yyyy')}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
          
          {projects.length === 0 && (
            <div className={`col-span-full py-20 text-center rounded-3xl border-2 border-dashed ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-gray-50/50 border-gray-200'}`}>
              <p className={`font-bold text-lg ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>No projects found. Create your first one!</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative z-10 p-8 rounded-3xl w-full max-w-md shadow-2xl border ${theme === 'dark' ? 'bg-[#151c2e] border-slate-800' : 'bg-white border-gray-50'}`}
            >
              <h2 className={`text-2xl font-extrabold mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>New Project</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-[#111827]'}`}>Project Name</label>
                  <input 
                    {...register('name', { required: true })}
                    placeholder="e.g. Website Redesign"
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-[#111827] focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-[#111827]'}`}>Description</label>
                  <textarea 
                    {...register('description')}
                    placeholder="What is this project about?"
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-[#111827] focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600'}`}
                    rows="3"
                  ></textarea>
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-[#111827]'}`}>Target Date</label>
                  <input 
                    type="date"
                    {...register('dueDate')}
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-white focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-[#111827] focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600'}`}
                  />
                </div>
                <div className="flex gap-3 justify-end mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className={`px-6 py-2.5 rounded-full font-bold transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-2.5 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
