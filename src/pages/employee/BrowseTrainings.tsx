import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTrainings, enrollInTraining, fetchUserProgress } from '../../store/trainingSlice';
import TrainingCard from '../../components/training/TrainingCard';
import { Search, Filter } from 'lucide-react';

const BrowseTrainings = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { list: trainings, userProgress, isLoading } = useAppSelector(state => state.trainings);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        dispatch(fetchTrainings());
        if (user?.id) {
            dispatch(fetchUserProgress(user.id));
        }
    }, [dispatch, user?.id]);

    const handleEnroll = async (trainingId: string) => {
        if (user?.id) {
            await dispatch(enrollInTraining({ userId: user.id, trainingId }));
            // Could add toast here
        }
    };

    const isEnrolled = (trainingId: string) => {
        return userProgress.some(p => p.trainingId === trainingId);
    };

    const filteredTrainings = trainings.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || t.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Browse Trainings</h1>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search trainings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full sm:w-64 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="pl-10 pr-8 py-2 w-full sm:w-48 appearance-none border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Types</option>
                            <option value="technical">Technical</option>
                            <option value="soft-skills">Soft Skills</option>
                            <option value="compliance">Compliance</option>
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Loading trainings...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTrainings.length > 0 ? (
                        filteredTrainings.map(training => {
                            const enrolled = isEnrolled(training.id);
                            const isFull = training.enrolled >= training.maxSeats;
                            const isActionDisabled = enrolled || isFull;

                            let actionLabel = 'Enroll Now';
                            if (enrolled) actionLabel = 'Enrolled';
                            else if (isFull) actionLabel = 'Full';

                            return (
                                <TrainingCard
                                    key={training.id}
                                    training={training}
                                    actionLabel={actionLabel}
                                    onAction={() => handleEnroll(training.id)}
                                    isActionDisabled={isActionDisabled}
                                />
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-12 text-slate-500">
                            No trainings found matching your criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BrowseTrainings;
