import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GlassCardProps extends HTMLMotionProps<"div"> {
    className?: string;
    children: React.ReactNode;
    hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ className, children, hoverEffect = false, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={hoverEffect ? { y: -5, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" } : {}}
            className={cn(
                "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-lg rounded-2xl p-6 transition-all duration-300",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
