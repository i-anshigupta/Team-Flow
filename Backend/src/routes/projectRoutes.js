import express from 'express';
import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectStats,
} from '../controllers/projectController.js';
import { protect, systemRoleGuard } from '../middleware/auth.js';
import { roleGuard } from '../middleware/role.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getProjects).post(systemRoleGuard('admin'), createProject);

router
  .route('/:id')
  .get(roleGuard('member'), getProjectById)
  .patch(roleGuard('admin'), updateProject)
  .delete(roleGuard('admin'), deleteProject);

router.get('/:id/stats', roleGuard('member'), getProjectStats);
router.route('/:id/members').post(roleGuard('admin'), addMember);
router.route('/:id/members/:userId').delete(roleGuard('admin'), removeMember);

export default router;
