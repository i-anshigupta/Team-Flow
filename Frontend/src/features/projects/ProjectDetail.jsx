import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Clock, Plus, X, User, Layout, BarChart3, PieChart as PieIcon, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState({
    todo: [],
    in_progress: [],
    review: [],
    done: []
  });
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeTab, setActiveTab] = useState('board'); // 'board' or 'reports'
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchProjectAndTasks();
    fetchAllUsers();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`)
      ]);
      setProject(projRes.data.data);
      
      const grouped = { todo: [], in_progress: [], review: [], done: [] };
      tasksRes.data.data.forEach(task => {
        if(grouped[task.status]) grouped[task.status].push(task);
      });
      setTasks(grouped);
      
      // Also fetch stats if we are on reports tab or just pre-fetch
      const statsRes = await api.get(`/projects/${id}/stats`);
      setStats(statsRes.data.data);
    } catch (err) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setAllUsers(data.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Safety check for keys
    if (!tasks[source.droppableId] || !tasks[destination.droppableId]) return;

    const sourceCol = [...tasks[source.droppableId]];
    const destCol = source.droppableId === destination.droppableId ? sourceCol : [...tasks[destination.droppableId]];
    
    const [movedTask] = sourceCol.splice(source.index, 1);
    if (!movedTask) return;

    movedTask.status = destination.droppableId;
    destCol.splice(destination.index, 0, movedTask);

    setTasks(prev => ({
      ...prev,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol
    }));

    try {
      await api.patch(`/tasks/${draggableId}`, { status: destination.droppableId });
      toast.success('Status updated');
      
      // Refresh stats
      const statsRes = await api.get(`/projects/${id}/stats`);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error('Drag update failed:', err);
      toast.error('Failed to update task');
      fetchProjectAndTasks(); // Revert on failure
    }
  };

  const onTaskSubmit = async (data) => {
    try {
      await api.post(`/projects/${id}/tasks`, {
        ...data,
        status: 'todo'
      });
      toast.success('Task created successfully');
      setShowTaskModal(false);
      reset();
      fetchProjectAndTasks();
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6db5aa]"></div></div>;

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-t-4 border-gray-200' },
    { id: 'in_progress', title: 'In Progress', color: 'border-t-4 border-amber-400' },
    { id: 'review', title: 'Review', color: 'border-t-4 border-[#6db5aa]' },
    { id: 'done', title: 'Done', color: 'border-t-4 border-emerald-500' }
  ];

  const COLORS = ['#6db5aa', '#fbbf24', '#f87171', '#10b981', '#6366f1'];

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111827]">{project?.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-500 font-medium">{project?.description || 'Project Workspace'}</p>
            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
            <span className="text-xs font-bold text-[#6db5aa] uppercase tracking-widest">{project?.status}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          <button 
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'board' ? 'bg-white text-[#6db5aa] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Layout size={16} /> Board
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'reports' ? 'bg-white text-[#6db5aa] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BarChart3 size={16} /> Reports
          </button>
        </div>

        <button 
          onClick={() => setShowTaskModal(true)}
          className="flex items-center gap-2 bg-[#6db5aa] hover:bg-[#5ca59a] text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg shadow-[#6db5aa]/20"
        >
          <Plus size={18} strokeWidth={3} /> New Task
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'board' ? (
          <motion.div 
            key="board"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 overflow-x-auto pb-6 scrollbar-hide"
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-6 h-full items-start">
                {columns.map((col) => (
                  <div key={col.id} className="w-80 min-w-[20rem] bg-gray-50/50 rounded-3xl p-5 flex flex-col max-h-full border border-gray-100/50">
                    <h3 className="font-bold mb-5 flex items-center justify-between text-[#111827]">
                      <span className="flex items-center gap-2">
                        {col.title}
                        <span className="bg-white border border-gray-100 text-gray-400 text-[10px] px-2 py-0.5 rounded-full shadow-sm">{tasks[col.id].length}</span>
                      </span>
                    </h3>
                    
                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`flex-1 overflow-y-auto min-h-[300px] transition-all duration-300 rounded-2xl p-1 ${snapshot.isDraggingOver ? 'bg-[#6db5aa]/10 ring-2 ring-[#6db5aa]/20 ring-inset' : ''}`}
                        >
                          {tasks[col.id].map((task, index) => (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] mb-4 border border-gray-50 ${col.color} ${snapshot.isDragging ? 'shadow-2xl scale-105 rotate-2 z-50 ring-4 ring-[#6db5aa]/10' : 'hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-[#6db5aa]/20'} transition-all`}
                                >
                                  <h4 className="font-bold text-[#111827] mb-3 leading-tight group-hover:text-[#6db5aa]">{task.title}</h4>
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {task.priority === 'urgent' && <span className="px-2 py-0.5 text-[9px] bg-red-50 text-red-500 rounded-full font-extrabold uppercase tracking-widest border border-red-100">Urgent</span>}
                                    {task.priority === 'high' && <span className="px-2 py-0.5 text-[9px] bg-amber-50 text-amber-600 rounded-full font-extrabold uppercase tracking-widest border border-amber-100">High</span>}
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-7 h-7 rounded-full bg-[#6db5aa]/10 flex items-center justify-center text-[10px] font-bold text-[#6db5aa] border-2 border-white shadow-sm overflow-hidden">
                                        {task.assignee?.avatarUrl ? <img src={task.assignee.avatarUrl} alt="" className="w-full h-full object-cover" /> : task.assignee?.name?.charAt(0) || <User size={12} />}
                                      </div>
                                      <span className="text-[11px] font-bold text-gray-500 truncate max-w-[90px]">
                                        {task.assignee?.name || 'Unassigned'}
                                      </span>
                                    </div>
                                    
                                    {task.dueDate && (
                                      <div className="text-[10px] font-extrabold text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                        <Clock size={10} className="text-gray-300" /> {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </motion.div>
        ) : (
          <motion.div 
            key="reports"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="text-lg font-bold text-[#111827] mb-8 flex items-center gap-3">
                  <PieIcon size={20} className="text-[#6db5aa]" /> Task Distribution by Status
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.statusData || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats?.statusData?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="text-lg font-bold text-[#111827] mb-8 flex items-center gap-3">
                  <BarChart3 size={20} className="text-[#6db5aa]" /> Task Count by Priority
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.priorityData || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="value" fill="#6db5aa" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-[#6db5aa] p-8 rounded-3xl shadow-xl shadow-[#6db5aa]/20 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-2xl font-extrabold mb-2">Project Performance Insight</h3>
                <p className="text-[#eef6f5] font-medium opacity-90 max-w-lg">
                  You have completed <span className="font-extrabold text-white">{stats?.statusData?.find(s => s.name === 'DONE')?.value || 0}</span> tasks out of <span className="font-extrabold text-white">{stats?.totalTasks || 0}</span>. 
                  Keep the momentum going to reach your project milestones!
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md relative z-10">
                <div className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Completion Rate</div>
                <div className="text-4xl font-extrabold">
                  {stats?.totalTasks > 0 ? Math.round(((stats?.statusData?.find(s => s.name === 'DONE')?.value || 0) / stats?.totalTasks) * 100) : 0}%
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-gray-50 relative"
            >
              <button 
                onClick={() => setShowTaskModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-extrabold text-[#111827] mb-6">Create New Task</h2>
              <form onSubmit={handleSubmit(onTaskSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#111827] mb-2">Task Title</label>
                  <input 
                    {...register('title', { required: true })}
                    placeholder="What needs to be done?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#6db5aa]/20 focus:border-[#6db5aa] outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#111827] mb-2">Priority</label>
                    <select 
                      {...register('priority')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#6db5aa]/20 focus:border-[#6db5aa] outline-none transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#111827] mb-2">Due Date</label>
                    <input 
                      type="date"
                      {...register('dueDate')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#6db5aa]/20 focus:border-[#6db5aa] outline-none transition-all font-bold text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#111827] mb-2">Assign To (System Users)</label>
                  <select 
                    {...register('assignee')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#6db5aa]/20 focus:border-[#6db5aa] outline-none transition-all font-bold text-sm"
                  >
                    <option value="">Unassigned</option>
                    {allUsers.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} (@{user.username})
                      </option>
                    ))}
                  </select>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-gray-400 font-bold ml-1">
                    <Info size={10} /> Now you can assign tasks to any user in the database.
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#111827] mb-2">Description</label>
                  <textarea 
                    {...register('description')}
                    placeholder="Add more details..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#6db5aa]/20 focus:border-[#6db5aa] outline-none transition-all"
                    rows="3"
                  ></textarea>
                </div>

                <div className="flex gap-3 justify-end mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowTaskModal(false)}
                    className="px-6 py-2.5 rounded-full font-bold text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-2.5 bg-[#6db5aa] text-white rounded-full font-bold hover:bg-[#5ca59a] transition-all shadow-md shadow-[#6db5aa]/20"
                  >
                    Create Task
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
