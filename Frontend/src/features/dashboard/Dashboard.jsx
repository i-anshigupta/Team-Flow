import { useEffect, useState } from 'react';
import { api } from '../../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, CheckCircle2, Clock, AlertCircle, CheckCircle, ListTodo, RefreshCcw, Search, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useTheme } from '../../store/useTheme';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTask, setUpdatingTask] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/tasks/my-tasks')
      ]);
      setStats(statsRes.data.data);
      setMyTasks(tasksRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingTask(taskId);
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      toast.success(`Task moved to ${newStatus.replace('_', ' ')}`);
      fetchData(); // Refresh all data to update stats
    } catch (err) {
      toast.error('Failed to update task status');
    } finally {
      setUpdatingTask(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 p-6 md:p-10 animate-pulse relative z-10">
        <div className={`h-10 w-64 rounded-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200/50'}`}></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className={`h-32 rounded-[2rem] border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white/60 border-white'}`}></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`lg:col-span-2 h-[500px] rounded-[2.5rem] border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white/60 border-white'}`}></div>
          <div className={`h-[500px] rounded-[2.5rem] border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white/60 border-white'}`}></div>
        </div>
      </div>
    );
  }

  const cards = [
    { title: 'Active Projects', value: stats?.totalProjects || 0, icon: <Layers className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />, bg: theme === 'dark' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-white', border: theme === 'dark' ? 'group-hover:border-blue-500/30' : 'group-hover:border-blue-200' },
    { title: 'My Tasks', value: stats?.totalTasks || 0, icon: <ListTodo className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'} />, bg: theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-white', border: theme === 'dark' ? 'group-hover:border-indigo-500/30' : 'group-hover:border-indigo-200' },
    { title: 'Tasks Done', value: stats?.tasksByStatus?.done || 0, icon: <CheckCircle className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'} />, bg: theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-white', border: theme === 'dark' ? 'group-hover:border-emerald-500/30' : 'group-hover:border-emerald-200' },
    { title: 'Overdue', value: stats?.overdueTasks || 0, icon: <AlertCircle className={theme === 'dark' ? 'text-rose-400' : 'text-rose-500'} />, bg: theme === 'dark' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-white', border: theme === 'dark' ? 'group-hover:border-rose-500/30' : 'group-hover:border-rose-200' },
  ];

  const statusOptions = [
    { value: 'todo', label: 'To Do', icon: <ListTodo size={14} />, color: theme === 'dark' ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-white/50' },
    { value: 'in_progress', label: 'In Progress', icon: <RefreshCcw size={14} />, color: theme === 'dark' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-100 text-amber-600 border-white/50' },
    { value: 'review', label: 'In Review', icon: <Search size={14} />, color: theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-100 text-indigo-600 border-white/50' },
    { value: 'done', label: 'Completed', icon: <CheckCircle2 size={14} />, color: theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-600 border-white/50' },
  ];

  return (
    <div className="space-y-10 p-2 relative z-10">
      <div className="flex flex-col gap-2">
        <h1 className={`text-4xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Workspace Dashboard</h1>
        <p className={`font-medium text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Keep track of your projects and assigned tasks.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
            className={`${theme === 'dark' ? 'bg-[#151c2e]/80 border-slate-800/80 hover:shadow-[0_0_30px_rgba(99,102,241,0.05)]' : 'bg-white/80 border-white shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]'} backdrop-blur-xl p-8 rounded-[2rem] border transition-all group hover:-translate-y-1 relative overflow-hidden`}
          >
            <div className={`absolute inset-0 border-2 border-transparent rounded-[2rem] ${card.border} transition-colors duration-300 pointer-events-none`}></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className={`p-4 rounded-2xl ${card.bg} group-hover:scale-110 transition-transform duration-300 shadow-sm border`}>
                {card.icon}
              </div>
              <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{card.title}</span>
            </div>
            <p className={`text-4xl font-black relative z-10 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* My Tasks Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className={`text-2xl font-black flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              My Assigned Tasks <span className={`text-xs px-3 py-1 rounded-full shadow-sm border ${theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>{myTasks.length}</span>
            </h2>
          </div>
          
          <div className={`${theme === 'dark' ? 'bg-[#151c2e]/80 border-slate-800/80' : 'bg-white/80 border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)]'} backdrop-blur-xl rounded-[2.5rem] border overflow-hidden`}>
            <div className={`divide-y ${theme === 'dark' ? 'divide-slate-800/50' : 'divide-slate-100/50'}`}>
              {myTasks.length > 0 ? (
                myTasks.map((task, i) => (
                  <motion.div 
                    key={task._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all group ${theme === 'dark' ? 'hover:bg-slate-800/30' : 'hover:bg-indigo-50/30'}`}
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${theme === 'dark' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' : 'text-indigo-600 bg-indigo-50 border-indigo-100/50'}`}>{task.project?.name}</span>
                        {task.priority === 'urgent' && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]"></span>}
                      </div>
                      <h3 className={`text-lg font-bold transition-colors ${theme === 'dark' ? 'text-slate-200 group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'}`}>{task.title}</h3>
                      <div className="flex items-center gap-4">
                        <p className={`text-sm font-medium line-clamp-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>{task.description || 'No description provided.'}</p>
                        {task.dueDate && (
                          <span className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md ${theme === 'dark' ? 'text-slate-400 bg-slate-800' : 'text-slate-400 bg-slate-50'}`}>
                            <Clock size={12} className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-400'} /> {format(new Date(task.dueDate), 'MMM d')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative inline-block">
                        <select
                          disabled={updatingTask === task._id}
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          className={`appearance-none pl-4 pr-10 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest outline-none cursor-pointer transition-all border shadow-sm ${
                            statusOptions.find(o => o.value === task.status)?.color
                          }`}
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value} className={theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-900'}>{opt.label}</option>
                          ))}
                        </select>
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          {updatingTask === task._id ? <RefreshCcw size={12} className="animate-spin" /> : <MoreVertical size={12} />}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-20 text-center space-y-4">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto border ${theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-300'}`}>
                    <CheckCircle2 size={40} />
                  </div>
                  <p className={`font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>Great job! No pending tasks assigned to you.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="space-y-6">
          <h2 className={`text-2xl font-black px-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Feed</h2>
          <div className={`${theme === 'dark' ? 'bg-[#151c2e]/80 border-slate-800/80' : 'bg-white/80 border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)]'} backdrop-blur-xl rounded-[2.5rem] border p-6`}>
            <div className="space-y-8">
              {stats?.recentActivity?.length > 0 ? (
                stats.recentActivity.map((activity, i) => (
                  <motion.div 
                    key={activity._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 relative group"
                  >
                    {i !== stats.recentActivity.length - 1 && (
                      <div className={`absolute left-5 top-10 bottom-[-20px] w-px bg-gradient-to-b to-transparent ${theme === 'dark' ? 'from-slate-700' : 'from-indigo-100'}`}></div>
                    )}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 z-10 shadow-sm border transition-all ${theme === 'dark' ? 'bg-slate-800 text-indigo-400 border-slate-700 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white' : 'bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 border-indigo-100/50 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                      {activity.user?.name?.charAt(0) || '?'}
                    </div>
                    <div className="space-y-1">
                      <p className={`text-[13px] leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        <span className={`font-bold transition-colors ${theme === 'dark' ? 'text-slate-200 group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'}`}>{activity.user?.name}</span>{' '}
                        <span className="font-medium">{activity.action.replace('_', ' ')}</span>{' '}
                        <span className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>{activity.target}</span>
                      </p>
                      <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-slate-500 group-hover:text-indigo-400' : 'text-slate-300 group-hover:text-indigo-300'}`}>
                        {format(new Date(activity.createdAt), 'h:mm a • MMM d')}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className={`text-center py-10 font-bold italic ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`}>No activity yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
