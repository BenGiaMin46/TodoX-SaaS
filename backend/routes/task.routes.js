const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

// Áp dụng middleware protect cho toàn bộ task routes
router.use(protect);

// CRUD routes
router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// Export route
router.get('/export', taskController.exportToExcel);

module.exports = router;
