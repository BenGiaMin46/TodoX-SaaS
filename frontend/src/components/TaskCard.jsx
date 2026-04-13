import React from 'react';
import { Trash2, Calendar, Tag, CheckCircle2, Edit2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const TaskCard = ({ task, onToggle, onDelete, onEdit }) => {
    const priorityColors = {
        'Low': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'Medium': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        'High': 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    };

    const isCompleted = task.status === 'Completed';
    
    // Urgency Logic
    const now = new Date();
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const isOverdue = dueDate && dueDate < now && !isCompleted;
    const isUrgent = dueDate && (dueDate - now) > 0 && (dueDate - now) < 24 * 60 * 60 * 1000 && !isCompleted;

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`group p-6 rounded-[28px] border transition-all duration-500 ${
                isCompleted 
                    ? 'bg-slate-900/30 border-slate-800/50 backdrop-blur-sm' 
                    : 'glass border-white/5 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10'
            }`}
        >
            <div className="flex items-start gap-5">
                <button 
                    onClick={() => onToggle(task._id, task.status)}
                    className={`mt-1.5 w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isCompleted 
                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' 
                            : 'border-2 border-slate-700 text-transparent hover:border-indigo-500 hover:text-indigo-400 bg-white/5'
                    }`}
                >
                    <CheckCircle2 size={18} />
                </button>

                <div className="flex-1 min-w-0">
                    <h3 className={`text-xl font-bold transition-all duration-300 truncate tracking-tight ${
                        isCompleted ? 'text-slate-500 line-through' : 'text-white'
                    }`}>
                        {task.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 mt-4">
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${priorityColors[task.priority] || priorityColors['Medium']}`}>
                            {task.priority || 'Medium'}
                        </span>
                        
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Tag size={13} className="text-indigo-400/60" />
                            {task.category || 'Other'}
                        </div>

                        {isOverdue && (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest border border-rose-500/20 animate-pulse">
                                Overdue
                            </div>
                        )}

                        {isUrgent && (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                                <Clock size={12} className="animate-spin-slow" /> Urgent
                            </div>
                        )}

                        {task.dueDate && (
                            <div className={`flex items-center gap-1.5 text-xs font-medium ${
                                isOverdue ? 'text-rose-400' : isUrgent ? 'text-amber-400' : 'text-slate-500'
                            }`}>
                                <Calendar size={13} className={isOverdue ? 'text-rose-400' : isUrgent ? 'text-amber-400' : 'text-purple-400/60'} />
                                {new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            </div>
                        )}
                        
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                            <Clock size={12} />
                            {new Date(task.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                    <button 
                        onClick={onEdit}
                        className="p-3 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-2xl transition-all active:scale-90"
                        title="Edit"
                    >
                        <Edit2 size={20} />
                    </button>
                    <button 
                        onClick={() => onDelete(task._id)}
                        className="p-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all active:scale-90"
                        title="Delete"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;
