import React from 'react';
import { AlertCircle, Clock, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DeadlineAlert = ({ urgentTasks, overdueTasks }) => {
    const totalUrgent = urgentTasks.length + overdueTasks.length;

    if (totalUrgent === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mb-10"
        >
            <div className="relative group overflow-hidden rounded-[32px] p-1 border border-white/10 shadow-2xl">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-indigo-500/20 animate-gradient-xy" />
                
                <div className="relative glass rounded-[28px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-2xl bg-slate-900/40">
                    <div className="flex items-center gap-6 text-center sm:text-left">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400 border border-rose-500/20 animate-pulse">
                                <AlertCircle size={32} />
                            </div>
                            <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
                                {totalUrgent}
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                                Strategic Risk Warning <Zap size={16} className="text-amber-400" />
                            </h3>
                            <p className="text-slate-400 text-sm font-medium mt-1">
                                {overdueTasks.length > 0 && `${overdueTasks.length} objectives exceeded deadline. `}
                                {urgentTasks.length > 0 && `${urgentTasks.length} missions closing within 24h. `}
                                Immediate intervention required.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[...overdueTasks, ...urgentTasks].slice(0, 3).map((task, i) => (
                                <div 
                                    key={task._id} 
                                    className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-300 ring-2 ring-white/5"
                                    title={task.title}
                                >
                                    {task.title.charAt(0)}
                                </div>
                            ))}
                            {totalUrgent > 3 && (
                                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white ring-2 ring-white/5">
                                    +{totalUrgent - 3}
                                </div>
                            )}
                        </div>
                        
                        <div className="h-10 w-px bg-white/10 hidden sm:block mx-2" />
                        
                        <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all active:scale-95 flex items-center gap-2 group/btn">
                            Focus Objectives <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DeadlineAlert;
