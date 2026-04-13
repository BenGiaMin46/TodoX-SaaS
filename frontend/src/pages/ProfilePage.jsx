import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { BASE_URL } from '../utils/api';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Shield, Save, ArrowLeft, Camera, CheckCircle, Loader2, Calendar, Target, Award, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ total: 0, completed: 0, rate: 0 });
    const [preview, setPreview] = useState(user?.avatar ? `${BASE_URL}${user.avatar}` : null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            fetchStatsAndHistory();
            setPreview(user.avatar ? `${BASE_URL}${user.avatar}` : null);
            setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
        }
    }, [user]);

    const fetchStatsAndHistory = async () => {
        try {
            const res = await api.get('/tasks');
            if (res.data.success) {
                const allTasks = res.data.data;
                const completed = allTasks.filter(t => t.status === 'Completed');
                setTasks(completed);
                
                const total = allTasks.length;
                const completedCount = completed.length;
                const rate = total > 0 ? Math.round((completedCount / total) * 100) : 0;
                setStats({ total, completed: completedCount, rate });
            }
        } catch (err) {
            console.error('Error loading tasks');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Local preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);

        const formDataAvatar = new FormData();
        formDataAvatar.append('avatar', file);

        setUploading(true);
        try {
            const res = await api.put('/auth/avatar', formDataAvatar);
            if (res.data.success) {
                // IMPORTANT: Merge with existing token
                const updatedUser = { ...user, ...res.data.data };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                toast.success('Avatar synchronized successfully! ✨');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload connection failed');
            setPreview(user?.avatar ? `${BASE_URL}${user.avatar}` : null);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password && formData.password !== formData.confirmPassword) {
            return toast.error('Confirmation password does not match');
        }

        setLoading(true);
        try {
            const updateData = {
                name: formData.name.trim(),
                email: formData.email.trim()
            };
            if (formData.password) updateData.password = formData.password;

            const res = await api.put('/auth/profile', updateData);
            
            if (res.data.success) {
                // IMPORTANT: Merge with existing token
                const updatedUser = { ...user, ...res.data.data };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                toast.success('Profile credentials synchronized! 🎉');
                setFormData({ ...formData, password: '', confirmPassword: '' });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Sync connection failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div className="mesh-gradient" />
        <div className="grain-overlay" />
        <div className="min-h-screen content-layer text-slate-200 pb-20 overflow-x-hidden">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 pt-32">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Header/Info Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-4 space-y-6"
                    >
                        <div className="glass rounded-[32px] p-8 text-center border border-white/10 shadow-2xl relative overflow-hidden group/card text-slate-200">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                            
                            <div className="relative inline-block mb-6">
                                <div className="w-36 h-36 rounded-full bg-slate-800 flex items-center justify-center border-4 border-white/10 shadow-2xl overflow-hidden group/avatar">
                                    {preview ? (
                                        <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                                            <User size={72} className="text-white/80" />
                                        </div>
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                                            <Loader2 className="animate-spin text-white" size={32} />
                                        </div>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <button 
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-2 right-2 p-3 bg-indigo-600 rounded-2xl border-2 border-slate-900 text-white hover:bg-indigo-500 transition-all shadow-xl active:scale-90"
                                >
                                    <Camera size={18} />
                                </button>
                            </div>
                            
                            <h2 className="text-3xl font-black text-white mb-1 truncate px-2">{user?.name}</h2>
                            <p className="text-slate-400 text-sm mb-6 truncate px-2">{user?.email}</p>
                            
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <div className="text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Success</p>
                                    <p className="text-xl font-black text-indigo-400">{stats.rate}%</p>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Goals</p>
                                    <p className="text-xl font-black text-white">{stats.completed}</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex items-center justify-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-[0.2em] bg-indigo-500/5 py-3 rounded-2xl border border-indigo-500/10">
                                    <Shield size={14} />
                                    Account Verified
                                </div>
                                
                                <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                    <Calendar size={14} />
                                    Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'April 2026'}
                                </div>
                            </div>
                        </div>

                        <div className="glass rounded-[32px] p-8 border border-white/5 relative overflow-hidden group/quote">
                            <Award className="absolute -right-4 -bottom-4 text-indigo-500/10 group-hover/quote:scale-125 transition-transform" size={100} />
                            <p className="text-sm text-slate-400 leading-relaxed italic z-10 relative pr-4">
                                "The only way to achieve the impossible is to believe it is possible. Keep pushing forward."
                            </p>
                        </div>
                    </motion.div>

                    {/* Edit Form */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-8"
                    >
                        <div className="glass rounded-[40px] p-10 border border-white/10 shadow-2xl backdrop-blur-3xl">
                            <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                                    <Target className="text-white" size={20} />
                                </div>
                                Workspace Identity
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Personal Identity</label>
                                        <div className="relative group">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                            <input 
                                                type="text" 
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-5 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-white font-medium"
                                                placeholder="Enter full name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Communication Channel</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-5 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-white font-medium"
                                                placeholder="Enter email address"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Security Credential</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                            <input 
                                                type="password" 
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Leave blank to keep current"
                                                className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-5 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Verification</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                            <input 
                                                type="password" 
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Repeat new password"
                                                className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-5 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 block">
                                    <button
                                        type="submit"
                                        disabled={loading || uploading}
                                        className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                            <>
                                                <Save size={18} />
                                                Synchronize Profile
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* Completed Plans History */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-12"
                >
                    <div className="glass rounded-[40px] p-10 border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                            <CheckCircle size={150} />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                            <h3 className="text-2xl font-black text-white flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                    <CheckCircle size={20} />
                                </div>
                                Accomplishment Log
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mastery Level:</span>
                                <span className="bg-emerald-500/10 text-emerald-400 px-5 py-2 rounded-2xl text-xs font-black border border-emerald-500/20 uppercase tracking-widest">
                                    {stats.completed} Objectives
                                </span>
                            </div>
                        </div>

                        {tasks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {tasks.slice(0, 8).map((task) => (
                                    <div key={task._id} className="p-6 glass-darker rounded-[24px] border border-white/5 flex items-start gap-5 hover:border-indigo-500/30 transition-all group/item">
                                        <div className="mt-1 w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover/item:scale-110 transition-transform">
                                            <CheckCircle size={18} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold mb-1 text-lg group-hover/item:text-indigo-300 transition-colors">{task.title}</p>
                                            <p className="text-xs text-slate-500 font-medium">
                                                Finalized on {new Date(task.updatedAt || task.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {tasks.length > 8 && (
                                    <div className="md:col-span-2 text-center pt-8 border-t border-white/5">
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">And {tasks.length - 8} other strategic objectives met</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-slate-900/20 rounded-[32px] border border-dashed border-white/5">
                                <Activity className="mx-auto text-slate-700 mb-4" size={48} />
                                <p className="text-slate-500 italic max-w-sm mx-auto">"Precision is the key to mastery. Begin your mission to see your achievements documented here."</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
        </>
    );
};

export default ProfilePage;
