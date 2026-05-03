import Task from '../models/Task.js';
import Project from '../models/Project.js';
import Activity from '../models/Activity.js';

export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const filter = { project: projectId };
    
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignee) filter.assignee = req.query.assignee;
    
    // Role-based access: users can only see their own tasks
    if (req.user.role === 'user') {
      filter.assignee = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate('assignee', 'name avatarUrl')
      .populate('createdBy', 'name');

    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, assignee, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      project: projectId,
      assignee: assignee || null,
      createdBy: req.user._id,
      dueDate,
    });

    await Activity.create({
      project: projectId,
      user: req.user._id,
      action: 'created_task',
      target: title,
    });

    // Automatically add assignee to project members if not already there
    if (assignee) {
      const project = await Project.findById(projectId);
      if (project && !project.members.some(m => m.user.equals(assignee))) {
        project.members.push({ user: assignee, role: 'member' });
        await project.save();
      }
    }

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

    const { title, description, status, priority, assignee, dueDate } = req.body;
    
    if (status && status !== task.status) {
      await Activity.create({
        project: task.project,
        user: req.user._id,
        action: 'updated_status',
        target: title || task.title,
        meta: { from: task.status, to: status }
      });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (assignee !== undefined) {
      task.assignee = assignee;
      // Add new assignee to project members if not already there
      if (assignee) {
        const project = await Project.findById(task.project);
        if (project && !project.members.some(m => m.user.equals(assignee))) {
          project.members.push({ user: assignee, role: 'member' });
          await project.save();
        }
      }
    }
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    res.json({ success: true, data: task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

    await Task.findByIdAndDelete(req.params.taskId);
    
    await Activity.create({
      project: task.project,
      user: req.user._id,
      action: 'deleted_task',
      target: task.title,
    });

    res.json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignee: req.user._id })
      .populate('project', 'name')
      .sort('dueDate');
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
