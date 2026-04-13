const Task = require('../models/task.model');
const xlsx = require('xlsx');

// @desc    Get all tasks for current user
// @route   GET /api/tasks
// @access  Private
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Could not fetch tasks',
            error: err.message
        });
    }
};

// @desc    Add new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
    try {
        const { title, priority, category, dueDate } = req.body;
        
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Task title cannot be empty'
            });
        }
        
        const taskData = {
            title,
            priority,
            category,
            dueDate,
            user: req.user.id
        };

        const task = await Task.create(taskData);
        
        res.status(201).json({
            success: true,
            data: task
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Could not create task',
            error: err.message
        });
    }
};

// @desc    Update task
// @route   PATCH /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this task'
            });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Could not update task',
            error: err.message
        });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this task'
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Could not delete task',
            error: err.message
        });
    }
};

// @desc    Export Excel for current user
// @route   GET /api/tasks/export
// @access  Private
exports.exportToExcel = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).lean();
        
        const data = tasks.map((task, index) => ({
            'No.': index + 1,
            'Title': task.title,
            'Status': task.status,
            'Priority': task.priority,
            'Category': task.category,
            'Due Date': task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US') : 'N/A',
            'Created At': new Date(task.createdAt).toLocaleString('en-US')
        }));

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'My Tasks');

        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=my_tasks.xlsx');
        res.send(buffer);

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error exporting to Excel',
            error: err.message
        });
    }
};
