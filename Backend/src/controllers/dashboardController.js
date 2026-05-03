import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Activity from '../models/Activity.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({ 'members.user': userId });
    const projectIds = projects.map((p) => p._id);

    const taskQuery = { project: { $in: projectIds } };
    if (req.user.role === 'user') {
      taskQuery.assignee = userId;
    }
    const tasks = await Task.find(taskQuery);

    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    
    const tasksByStatus = {
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length,
    };

    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;

    const recentActivity = await Activity.find({ project: { $in: projectIds } })
      .populate('user', 'name avatarUrl')
      .populate('project', 'name')
      .sort('-createdAt')
      .limit(10);

    res.json({
      success: true,
      data: {
        totalProjects,
        totalTasks,
        tasksByStatus,
        overdueTasks,
        recentActivity,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
