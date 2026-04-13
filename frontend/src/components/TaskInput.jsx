import React, { useState } from 'react';
import { Plus, Tag, Flag, Calendar, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const TaskInput = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [category, setCategory] = useState('Other');
    const [dueDate, setDueDate] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            toast.error('Mission description required');
            return;
        }
        onAdd({ title: trimmedTitle, priority, category, dueDate });
        setTitle('');
        setDueDate('');
        setIsExpanded(false);
    };

    const priorities = [
        { label: 'Low', color: 'bg-emerald-500/20 text-emerald-400' },
        { label: 'Medium', color: 'bg-amber-500/20 text-amber-400' },
        { label: 'High', color: 'bg-rose-500/20 text-rose-400' }
    ];

    const categories = ['Personal', 'Work', 'Health', 'Education', 'Other'];

    return (
        <div className="glass-darker rounded-[32px] p-6 border border-white/10 shadow-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <form onSubmit={handleSubmit} className="relative z-10">
                <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center text-indigo-400 border border-white/5">
                        <Target size={24} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Define next strategic objective..." 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                        className="flex-1 bg-transparent border-none focus:outline-none text-xl text-white placeholder:text-slate-600 font-bold"
                    />
                    <button 
                        type="submit"
                        disabled={!title.trim()}
                        className="bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-30 disabled:active:scale-100 text-white p-4 rounded-2xl transition-all active:scale-[0.95] shadow-xl shadow-indigo-500/30"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 mt-8 border-t border-white/5">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Flag size={14} className="text-indigo-500" /> Strategic Priority
                                    </label>
                                    <div className="flex gap-2">
                                        {priorities.map((p) => (
                                            <button
                                                key={p.label}
                                                type="button"
                                                onClick={() => setPriority(p.label)}
                                                className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border ${
                                                    priority === p.label 
                                                        ? `${p.color} border-current ring-1 ring-current/30` 
                                                        : 'bg-slate-900/50 text-slate-500 border-transparent hover:border-white/10'
                                                }`}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Tag size={14} className="text-purple-500" /> Operations Category
                                    </label>
                                    <select 
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 appearance-none"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Calendar size={14} className="text-pink-500" /> Deadline
                                    </label>
                                    <input 
                                        type="date" 
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-8 flex justify-end">
                                <button 
                                    type="button"
                                    onClick={() => setIsExpanded(false)}
                                    className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
                                >
                                    Minimize Workspace
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
};

export default TaskInput;
