
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTrainings, fetchUserProgress, completeTraining } from '../../store/trainingSlice';
import { QuizService } from '../../services/quizService';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import BadgeModal from '../common/BadgeModal';
import GlassCard from '../common/GlassCard';
import QuizModal from '../common/QuizModal';
import type { Quiz } from '../../types';

const EmployeeDashboard = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { list: trainings, userProgress, isLoading } = useAppSelector(state => state.trainings);

    // Badge State
    const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
    const [showBadgeModal, setShowBadgeModal] = useState(false);

    // Quiz State
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [pendingTrainingId, setPendingTrainingId] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchTrainings());
            dispatch(fetchUserProgress(user.id));
        }
    }, [dispatch, user?.id]);

    const handleCompleteClick = async (trainingId: string) => {
        // Check if quiz exists
        const quiz = await QuizService.getQuizByTrainingId(trainingId);
        if (quiz) {
            setActiveQuiz(quiz);
            setPendingTrainingId(trainingId);
        } else {
            // No quiz, complete directly
            await finalizeCompletion(trainingId);
        }
    };

    const handleQuizComplete = async (_score: number, passed: boolean) => {
        try {
            if (passed && pendingTrainingId) {
                await finalizeCompletion(pendingTrainingId);
            }
        } catch (error) {
            console.error('Quiz completion failed:', error);
        } finally {
            setActiveQuiz(null);
            setPendingTrainingId(null);
        }
    };

    const finalizeCompletion = async (trainingId: string) => {
        if (!user?.id) return;
        const result = await dispatch(completeTraining({ userId: user.id, trainingId })).unwrap();
        if (result.newBadges && result.newBadges.length > 0) {
            setEarnedBadges(result.newBadges);
            setShowBadgeModal(true);
        }
    };

    const ongoingTrainings = userProgress
        .filter(p => p.status === 'enrolled' || p.status === 'waitlisted')
        .map(p => trainings.find(t => t.id === p.trainingId))
        .filter((t): t is NonNullable<typeof t> => t !== undefined);

    const mandatoryTrainings = trainings.filter(t => t.isMandatory && t.status === 'ongoing');

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome back, {user?.name.split(' ')[0]}!
                    </h1>
                    <p className="text-slate-500 mt-2">Ready to level up your skills today?</p>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Ongoing Training</h2>
                {ongoingTrainings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ongoingTrainings.map(training => (
                            <GlassCard key={training.id} hoverEffect className="flex flex-col h-full border-l-4 border-l-indigo-500">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${training.type === 'technical' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {training.type}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {new Date(training.endDate) < new Date() ? 'Ends Soon' : 'Ongoing'}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold mb-2 line-clamp-2">{training.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 flex-1 line-clamp-3">
                                    {training.description}
                                </p>

                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 w-full">
                                    <div className="flex items-center text-sm text-slate-500 mb-2">
                                        <Calendar size={16} className="mr-2" />
                                        <span>{new Date(training.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-slate-500 mb-4">
                                        <Clock size={16} className="mr-2" />
                                        <span>{training.durationHours} hours</span>
                                    </div>

                                    <button
                                        onClick={() => handleCompleteClick(training.id)}
                                        className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={16} /> Mark as Complete
                                    </button>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                ) : (
                    <GlassCard className="p-8 text-center border-dashed">
                        <p className="text-slate-500">No ongoing trainings. check out upcoming courses!</p>
                    </GlassCard>
                )}
            </div>

            {showBadgeModal && (
                <BadgeModal
                    badges={earnedBadges}
                    onClose={() => setShowBadgeModal(false)}
                />
            )}

            {activeQuiz && (
                <QuizModal
                    quiz={activeQuiz}
                    onClose={() => { setActiveQuiz(null); setPendingTrainingId(null); }}
                    onComplete={handleQuizComplete}
                />
            )}

            <div>
                <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Upcoming Mandatory Training</h2>
                <div className="space-y-4">
                    {mandatoryTrainings.map(training => (
                        <GlassCard key={training.id} className="flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex gap-4 items-center">
                                <div className="w-2 h-16 bg-red-500 rounded-full"></div>
                                <div>
                                    <h3 className="font-bold text-lg">{training.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">Due by {new Date(training.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">REQUIRED</span>
                        </GlassCard>
                    ))}
                    {mandatoryTrainings.length === 0 && (
                        <p className="text-slate-500">No mandatory trainings pending. Great job!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
