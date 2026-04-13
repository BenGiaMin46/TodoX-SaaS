const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title cannot be empty'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    status: {
        type: String,
        enum: ['In Progress', 'Completed'],
        default: 'In Progress'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    category: {
        type: String,
        enum: ['Personal', 'Work', 'Health', 'Education', 'Other'],
        default: 'Other'
    },
    dueDate: {
        type: Date
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
