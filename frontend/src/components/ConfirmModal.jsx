import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, type = 'danger' }) => {
    if (!isOpen) return null;

    const colors = {
        danger: 'from-rose-600 to-pink-600 shadow-rose-500/25',
        warning: 'from-amber-600 to-orange-600 shadow-amber-500/25'
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-sm glass border border-white/10 rounded-[32px] p-8 shadow-2xl"
                >
                    <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${colors[type]} flex items-center justify-center mb-6 shadow-lg`}>
                            <AlertCircle className="text-white" size={32} />
                        </div>
                        
                        <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            {message}
                        </p>

                        <div className="flex flex-col w-full gap-3">
                            <button 
                                onClick={onConfirm}
                                className={`w-full py-4 rounded-2xl bg-gradient-to-r ${colors[type]} text-white font-black uppercase tracking-widest text-sm transition-all active:scale-[0.98] shadow-lg`}
                            >
                                {confirmText}
                            </button>
                            <button 
                                onClick={onClose}
                                className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmModal;
