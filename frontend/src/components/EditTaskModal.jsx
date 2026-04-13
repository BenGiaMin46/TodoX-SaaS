import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Flag, Tag, Calendar, Type, Zap } from 'lucide-react';

const EditTaskModal = ({ task, isOpen, onClose, onUpdate }) => {
    const [title, setTitle] = useState(task.title);
    const [priority, setPriority] = useState(task.priority);
    const [category, setCategory] = useState(task.category);
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(task._id, { title, priority, category, dueDate });
        onClose();
    };

    const priorities = [
        { label: 'Low', color: 'bg-emerald-500/20 text-emerald-400' },
        { label: 'Medium', color: 'bg-amber-500/20 text-amber-400' },
        { label: 'High', color: 'bg-rose-500/20 text-rose-400' }
    ];

    const categories = ['Personal', 'Work', 'Health', 'Education', 'Other'];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full max-w-lg glass-darker rounded-[40px] border border-white/10 shadow-3xl overflow-hidden p-10"
                >
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black text-white flex items-center gap-4">
                            <span className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                                <Zap size={22} fill="currentColor" />
                            </span>
                            Synchronize Mission
                        </h2>
                        <button 
                            onClick={onClose}
                            className="p-3 text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                                <Type size={14} className="text-indigo-500" /> Strategic Objective
                            </label>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-bold placeholder:text-slate-600 shadow-inner"
                                placeholder="Redefine objective..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                                    <Tag size={14} className="text-purple-500" /> Category
                                </label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                                    <Calendar size={14} className="text-rose-500" /> Deadline
                                </label>
                                <input 
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-4 px-6 text-white text-xs font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                                <Flag size={14} className="text-amber-500" /> Priority Level
                            </label>
                            <div className="flex gap-4">
                                {priorities.map((p) => (
                                    <button
                                        key={p.label}
                                        type="button"
                                        onClick={() => setPriority(p.label)}
                                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                            priority === p.label 
                                                ? `${p.color} border-current ring-1 ring-current/40` 
                                                : 'bg-slate-900/60 text-slate-500 border-transparent hover:border-white/10'
                                        }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 flex gap-5">
                            <button 
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Abort
                            </button>
                            <button 
                                type="submit"
                                className="flex-[2] py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <Save size={18} />
                                Synchronize Changes
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditTaskModal;
