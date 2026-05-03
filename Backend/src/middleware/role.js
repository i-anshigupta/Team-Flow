import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const roleGuard = (minRole) => async (req, res, next) => {
  try {
    // Global Admin Bypass
    if (req.user.role === 'admin') {
      return next();
    }

    let projectId = req.params.id || req.params.projectId || req.body.project;

    // If projectId is missing but we have a taskId, we can find the project
    if (!projectId && (req.params.taskId || req.body.taskId)) {
      const taskId = req.params.taskId || req.body.taskId;
      const task = await Task.findById(taskId);
      if (task) {
        projectId = task.project;
      }
    }

    if (!projectId) {
      return res.status(400).json({ success: false, error: 'Project ID is required' });
    }

    const project = await Project.findOne({
      _id: projectId,
      'members.user': req.user._id,
    });

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found or you are not a member' });
    }

    const member = project.members.find((m) => m.user.equals(req.user._id));

    if (minRole === 'admin' && member.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admin role required' });
    }

    req.project = project;
    req.projectMember = member;
    next();
  } catch (error) {
    console.error('Role Guard Error:', error);
    res.status(500).json({ success: false, error: 'Server error in role validation' });
  }
};
