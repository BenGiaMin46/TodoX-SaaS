import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, CheckCircle2, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();

    // Standard Email Regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Frontend Validation
        if (!emailRegex.test(email)) {
            return toast.error('Please provide a valid email address');
        }

        setLoading(true);
        try {
            await register(name, email, password);
            toast.success('Account created successfully! Welcome ✨');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            await googleLogin(credentialResponse.credential);
            toast.success('Strategy initialized with Google! 🚀');
            navigate('/');
        } catch (err) {
            toast.error('Google account linking failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#050810]">
            <div className="mesh-gradient" />
            <div className="grain-overlay" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-indigo-500/20 mx-auto mb-6 transform hover:rotate-12 transition-transform cursor-pointer">
                        <CheckCircle2 className="text-white" size={40} />
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-3">Join TodoX</h1>
                    <p className="text-slate-400 font-medium">Elevate your professional productivity.</p>
                </div>

                <div className="glass p-10 rounded-[40px] border border-white/10 shadow-2xl backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Executive Analyst"
                                    className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-white font-medium shadow-inner"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Strategic Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input 
                                    type="email" 
                                    placeholder="analyst@todox.com"
                                    className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-white font-medium shadow-inner"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Credential</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-white font-medium shadow-inner"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 text-sm uppercase tracking-widest"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    Establish Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-4 bg-[#050810] text-slate-500 font-bold uppercase tracking-widest">Or synchronize with</span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google sync encountered an error')}
                            theme="filled_black"
                            shape="pill"
                            width="100%"
                            text="continue_with"
                        />
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-slate-400 font-medium">
                            Already finalized your profile?{' '}
                            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-black underline underline-offset-8 decoration-indigo-500/30 transition-all">
                                Executive Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-600 text-[10px] uppercase tracking-[0.4em] font-black flex items-center justify-center gap-3">
                        Strategic Task Management <CheckCircle2 size={12} className="text-indigo-500" />
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
