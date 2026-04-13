import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskInput from '../components/TaskInput';
import TaskCard from '../components/TaskCard';
import EditTaskModal from '../components/EditTaskModal';
import ProductivityChart from '../components/ProductivityChart';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileSpreadsheet, Activity, TrendingUp, Zap, Sparkles } from 'lucide-react';
import DeadlineAlert from '../components/DeadlineAlert';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const DashboardPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [editingTask, setEditingTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) fetchTasks();
    }, [user]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get('/tasks');
            if (res.data.success) {
                const allTasks = res.data.data;
                setTasks(allTasks);

                // Check for urgent tasks
                const now = new Date();
                const urgent = allTasks.filter(t => {
                    if (t.status === 'Completed' || !t.dueDate) return false;
                    const due = new Date(t.dueDate);
                    const diff = due - now;
                    return diff > 0 && diff < 24 * 60 * 60 * 1000; // < 24h
                });

                const overdue = allTasks.filter(t => {
                    if (t.status === 'Completed' || !t.dueDate) return false;
                    return new Date(t.dueDate) < now;
                });

                if (urgent.length > 0 || overdue.length > 0) {
                    toast((t) => (
                        <span className="flex items-center gap-2 font-bold text-slate-200">
                            ⚠️ Strategic Risk Detection: {urgent.length + overdue.length} missions require immediate focus.
                        </span>
                    ), { duration: 5000, icon: '🛡️' });
                }
            }
        } catch (err) {
            toast.error('Could not load task list');
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const addTask = async (taskData) => {
        try {
            const sanitizedData = {
                ...taskData,
                title: taskData.title.trim()
            };
            const res = await api.post('/tasks', sanitizedData);
            if (res.data.success) {
                setTasks([res.data.data, ...tasks]);
                toast.success('Strategy added successfully');
            }
        } catch (err) {
            toast.error('Error recording strategy');
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'In Progress' ? 'Completed' : 'In Progress';
        try {
            const res = await api.patch(`/tasks/${id}`, { status: newStatus });
            if (res.data.success) {
                setTasks(tasks.map(t => t._id === id ? res.data.data : t));
                if (newStatus === 'Completed') {
                    toast.success('Mission Accomplished 🎉');
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#6366f1', '#a855f7', '#10b981']
                    });
                }
            }
        } catch (err) {
            toast.error('Execution update failed');
        }
    };

    const updateTask = async (id, updatedData) => {
        try {
            const res = await api.patch(`/tasks/${id}`, updatedData);
            if (res.data.success) {
                setTasks(tasks.map(t => t._id === id ? res.data.data : t));
                toast.success('Objective synchronized');
            }
        } catch (err) {
            toast.error('Sync failed');
        }
    };

    const deleteTask = async (id) => {
        try {
            const res = await api.delete(`/tasks/${id}`);
            if (res.data.success) {
                setTasks(tasks.filter(t => t._id !== id));
                toast.success('Record purged');
                setTaskToDelete(null);
            }
        } catch (err) {
            toast.error('Purge failed');
        }
    };

    const exportExcel = async () => {
        try {
            const res = await api.get('/tasks/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `TodoX_Report_${new Date().toLocaleDateString()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Strategic report exported');
        } catch (err) {
            toast.error('Export failed');
        }
    };

    const urgentTasks = useMemo(() => {
        const now = new Date();
        return tasks.filter(t => {
            if (t.status === 'Completed' || !t.dueDate) return false;
            const due = new Date(t.dueDate);
            const diff = due - now;
            return diff > 0 && diff < 24 * 60 * 60 * 1000;
        });
    }, [tasks]);

    const overdueTasks = useMemo(() => {
        const now = new Date();
        return tasks.filter(t => {
            if (t.status === 'Completed' || !t.dueDate) return false;
            return new Date(t.dueDate) < now;
        });
    }, [tasks]);

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = 
            activeFilter === 'all' || 
            (activeFilter === 'pending' && task.status === 'In Progress') ||
            (activeFilter === 'completed' && task.status === 'Completed');
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'In Progress').length,
        completed: tasks.filter(t => t.status === 'Completed').length,
        percent: tasks.length ? Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100) : 0
    };

    const chartData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return {
                dayName: days[d.getDay()],
                dateStr: d.toLocaleDateString(),
                count: 0
            };
        });

        tasks.forEach(t => {
            if (t.status === 'Completed') {
                const completedDate = new Date(t.updatedAt || t.createdAt).toLocaleDateString();
                const dayIndex = last7Days.findIndex(d => d.dateStr === completedDate);
                if (dayIndex !== -1) last7Days[dayIndex].count++;
            }
        });

        return last7Days.map(d => ({ day: d.dayName, completed: d.count }));
    }, [tasks]);

    return (
        <>
        <div className="mesh-gradient" />
        <div className="grain-overlay" />
        <div className="min-h-screen content-layer text-slate-200 pb-20 overflow-x-hidden">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-6 pt-32">
                {/* Header Greeting */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-10"
                >
                    <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] mb-2 flex items-center gap-2">
                        <Zap size={12} fill="currentColor" /> Live Dashboard
                    </p>
                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter flex items-center gap-4">
                        {getGreeting()}, {user?.name.split(' ')[0]} <Sparkles className="text-amber-400" size={32} />
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Sidebar / Insights */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="glass rounded-[40px] p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700">
                                <TrendingUp size={120} />
                            </div>
                            
                            <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-4">
                                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                                    <Activity size={24} /> 
                                </div>
                                Strategy Overview
                            </h2>
                            
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 glass-darker rounded-3xl border border-white/5 relative overflow-hidden">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">Backlog</p>
                                        <p className="text-4xl font-black text-white relative z-10 tracking-tighter">{stats.pending}</p>
                                    </div>
                                    <div className="p-6 glass-darker rounded-3xl border border-white/5 relative overflow-hidden">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">Executed</p>
                                        <p className="text-4xl font-black text-emerald-400 relative z-10 tracking-tighter">{stats.completed}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Efficiency Rating</span>
                                        <span className="text-2xl font-black text-indigo-400 tracking-tighter">{stats.percent}%</span>
                                    </div>
                                    <div className="h-4 w-full bg-slate-900/60 rounded-full overflow-hidden border border-white/5 p-1 shadow-inner">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stats.percent}%` }}
                                            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                                            className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full relative"
                                        >
                                            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Velocity History</p>
                                    <ProductivityChart data={chartData} />
                                </div>
                            </div>
                        </section>

                        <button 
                            onClick={exportExcel}
                            className="w-full glass hover:bg-white/10 p-6 rounded-[24px] border border-white/10 flex items-center justify-center gap-4 transition-all active:scale-[0.95] text-slate-300 font-black uppercase tracking-widest text-xs group"
                        >
                            <FileSpreadsheet size={20} className="text-emerald-400 group-hover:rotate-12 transition-transform" />
                            Secure Analytics Export
                        </button>
                    </div>

                    {/* Main Board */}
                    <div className="lg:col-span-8 space-y-12">
                        <DeadlineAlert urgentTasks={urgentTasks} overdueTasks={overdueTasks} />
                        <TaskInput onAdd={addTask} />

                        <div className="flex flex-col sm:flex-row gap-8 items-center justify-between">
                            <div className="relative w-full sm:w-[400px] group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Filter objectives..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-slate-900/40 border border-white/10 rounded-[24px] py-5 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-base placeholder:text-slate-600 font-medium"
                                />
                            </div>

                            <div className="flex gap-2 p-2 glass rounded-[24px] border border-white/10 shadow-2xl">
                                {[
                                    { id: 'all', label: 'All' },
                                    { id: 'pending', label: 'Active' },
                                    { id: 'completed', label: 'Done' }
                                ].map(btn => (
                                    <button
                                        key={btn.id}
                                        onClick={() => setActiveFilter(btn.id)}
                                        className={`px-10 py-3 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 ${
                                            activeFilter === btn.id 
                                                ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/40' 
                                                : 'text-slate-500 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {btn.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {loading ? (
                                <div className="space-y-6">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-32 w-full bg-slate-800/30 rounded-[32px] animate-pulse border border-white/5"></div>
                                    ))}
                                </div>
                            ) : filteredTasks.length > 0 ? (
                                <motion.div 
                                    layout
                                    className="space-y-5"
                                >
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        {filteredTasks.map((task, index) => (
                                            <motion.div
                                                key={task._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: index * 0.04, ease: "easeOut" }}
                                            >
                                                <TaskCard 
                                                    task={task} 
                                                    onToggle={toggleStatus}
                                                    onDelete={() => setTaskToDelete(task._id)}
                                                    onEdit={() => setEditingTask(task)}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <EmptyState />
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {editingTask && (
                <EditTaskModal 
                    task={editingTask}
                    isOpen={!!editingTask}
                    onClose={() => setEditingTask(null)}
                    onUpdate={updateTask}
                />
            )}

            <ConfirmModal 
                isOpen={!!taskToDelete}
                onClose={() => setTaskToDelete(null)}
                onConfirm={() => deleteTask(taskToDelete)}
                title="Confirm Objectives Purge?"
                message="This action will permanently delete the mission record from your secure workspace. This cannot be undone."
                confirmText="Purge Record"
                type="danger"
            />
        </div>
        </>
    );
};

export default DashboardPage;
