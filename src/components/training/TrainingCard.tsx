import React from 'react';
import type { Training } from '../../types';
import { Calendar, Clock, User, Users } from 'lucide-react';

interface TrainingCardProps {
    training: Training;
    actionLabel?: string;
    onAction?: () => void;
    isActionDisabled?: boolean;
    secondaryAction?: React.ReactNode;
}

const TrainingCard: React.FC<TrainingCardProps> = ({
    training,
    actionLabel,
    onAction,
    isActionDisabled = false,
    secondaryAction
}) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
            <div className={`h-2 w-full ${training.type === 'technical' ? 'bg-blue-500' :
                    training.type === 'compliance' ? 'bg-red-500' : 'bg-green-500'
                }`}></div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full uppercase font-semibold tracking-wider ${training.type === 'technical' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            training.type === 'compliance' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                        {training.type}
                    </span>
                    {training.isMandatory && (
                        <span className="text-xs font-bold text-red-500 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded-full">
                            MANDATORY
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2" title={training.title}>
                    {training.title}
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 flex-1" title={training.description}>
                    {training.description}
                </p>

                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-6">
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-slate-400" />
                        <span>{training.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-slate-400" />
                        <span>{new Date(training.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 flex-1">
                            <Clock size={16} className="text-slate-400" />
                            <span>{training.durationHours}h</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-slate-400" />
                            <span>{training.enrolled}/{training.maxSeats}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-auto">
                    {onAction && actionLabel && (
                        <button
                            onClick={onAction}
                            disabled={isActionDisabled}
                            className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            {actionLabel}
                        </button>
                    )}
                    {secondaryAction}
                </div>
            </div>
        </div>
    );
};

export default TrainingCard;
