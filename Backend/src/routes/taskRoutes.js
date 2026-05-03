import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { roleGuard } from '../middleware/role.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get('/my-tasks', getMyTasks);

router.route('/')
  .get(roleGuard('member'), getTasks)
  .post(roleGuard('member'), createTask);

router.route('/:taskId')
  .patch(roleGuard('member'), updateTask)
  .delete(roleGuard('admin'), deleteTask);

export default router;
