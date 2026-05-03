import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ 'members.user': req.user._id }).populate('owner', 'name email avatarUrl');
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, description, dueDate } = req.body;
    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }],
      dueDate,
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members.user', 'name email avatarUrl')
      .populate('owner', 'name email avatarUrl');
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const isMember = project.members.some(m => m.user._id.equals(req.user._id));
    if (!isMember) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { name, description, status, dueDate } = req.body;
    const project = await Project.findById(req.params.id);

    if (name) project.name = name;
    if (description) project.description = description;
    if (status) project.status = status;
    if (dueDate) project.dueDate = dueDate;

    await project.save();
    res.json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await Task.deleteMany({ project: req.params.id });
    await Activity.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const project = await Project.findById(req.params.id);
    const isAlreadyMember = project.members.some((m) => m.user.equals(user._id));
    if (isAlreadyMember) {
      return res.status(400).json({ success: false, error: 'User is already a member' });
    }

    project.members.push({ user: user._id, role: role || 'member' });
    await project.save();

    res.json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const project = await Project.findById(req.params.id);

    project.members = project.members.filter((m) => !m.user.equals(userId));
    await project.save();

    res.json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getProjectStats = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ project: id });
    
    const statusCounts = {
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0
    };

    const priorityCounts = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    };

    tasks.forEach(task => {
      if (statusCounts[task.status] !== undefined) statusCounts[task.status]++;
      if (priorityCounts[task.priority] !== undefined) priorityCounts[task.priority]++;
    });

    const statusData = Object.keys(statusCounts).map(key => ({
      name: key.replace('_', ' ').toUpperCase(),
      value: statusCounts[key]
    }));

    const priorityData = Object.keys(priorityCounts).map(key => ({
      name: key.toUpperCase(),
      value: priorityCounts[key]
    }));

    res.json({
      success: true,
      data: {
        statusData,
        priorityData,
        totalTasks: tasks.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
