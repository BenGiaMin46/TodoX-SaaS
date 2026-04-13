import React from 'react';
import { motion } from 'framer-motion';
import emptyImg from '../assets/empty_state.png';

const EmptyState = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-6 glass border-dashed border-2 border-white/5 rounded-[40px] text-center overflow-hidden"
        >
            <div className="relative mb-8">
                <motion.img 
                    src={emptyImg}
                    alt="No tasks"
                    animate={{ 
                        y: [0, -15, 0],
                        rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                        duration: 6, 
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-64 h-64 object-contain drop-shadow-[0_20px_50px_rgba(99,102,241,0.3)]"
                />
            </div>
            
            <h3 className="text-3xl font-black text-white mb-4 tracking-tight">All set for now!</h3>
            <p className="text-slate-400 max-w-sm mx-auto leading-relaxed text-lg">
                You've completed all your goals. Take a moment to rest or start a new challenge.
            </p>
            
            <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mt-10 px-6 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-[0.2em]"
            >
                Ready for the next adventure
            </motion.div>
        </motion.div>
    );
};

export default EmptyState;
