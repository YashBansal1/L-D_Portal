import React from 'react';
import { createPortal } from 'react-dom';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';

// simplified confetti implementation without external heavy library if possible, 
// using simple CSS or a lightweight approach. But user asked for "Best suited". 
// Since I can't install 'react-confetti' easily without permission and restart, 
// I will build a Custom CSS Confetti Modal.

interface BadgeModalProps {
    badges: string[];
    onClose: () => void;
}

const BadgeModal: React.FC<BadgeModalProps> = ({ badges, onClose }) => {
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
            >
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-yellow-400/20 via-transparent to-purple-500/20 animate-spin-slow"></div>
                </div>

                <div className="relative z-10">
                    <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-orange-200 shadow-xl">
                        <Award size={48} className="text-yellow-600" />
                    </div>

                    <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                        Congratulations!
                    </h2>

                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                        You've unlocked {badges.length > 1 ? 'new badges' : 'a new badge'}:
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center mb-8">
                        {badges.map(badge => (
                            <span key={badge} className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full font-bold text-lg shadow-sm">
                                {badge}
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                    >
                        Awesome!
                    </button>
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

export default BadgeModal;
