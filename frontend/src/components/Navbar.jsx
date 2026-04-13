import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../utils/api';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="glass fixed top-0 w-full z-50 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter">TodoX</span>
                </Link>

                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                        <Link to="/profile" className="flex items-center gap-4 hover:bg-white/5 p-1 px-3 rounded-2xl transition-all group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{user?.name}</p>
                                <p className="text-xs text-slate-400">{user?.email}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                                {user?.avatar ? (
                                    <img 
                                        src={`${BASE_URL}${user.avatar}`} 
                                        alt={user.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                                        <User className="text-white" size={20} />
                                    </div>
                                )}
                            </div>
                        </Link>

                        <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

                        <button 
                            onClick={logout}
                            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
