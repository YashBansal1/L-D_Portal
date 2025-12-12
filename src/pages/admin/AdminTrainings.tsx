import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTrainings, deleteTraining } from '../../store/trainingSlice';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AssignTrainingModal from '../../components/admin/AssignTrainingModal';
import type { Training } from '../../types';

const AdminTrainings = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { list: trainings, isLoading } = useAppSelector(state => state.trainings);
    const [assigningTraining, setAssigningTraining] = useState<Training | null>(null);

    useEffect(() => {
        dispatch(fetchTrainings());
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this training?')) {
            await dispatch(deleteTraining(id));
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h1 className="text-2xl font-bold">Manage Trainings</h1>
                <button
                    onClick={() => navigate('/admin/trainings/new')}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    <span>Create New</span>
                </button>
            </div>

            {assigningTraining && (
                <AssignTrainingModal
                    training={assigningTraining}
                    onClose={() => setAssigningTraining(null)}
                />
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Title</th>
                            <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Instructor</th>
                            <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Dates</th>
                            <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Enrollment</th>
                            <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {trainings.map((training) => (
                            <tr key={training.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-900 dark:text-white">{training.title}</p>
                                    <span className={`text - xs px - 2 py - 0.5 rounded - full ${training.type === 'technical' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                        } `}>{training.type}</span>
                                </td>
                                <td className="px-6 py-4">{training.instructor}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {new Date(training.startDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="capitalize">{training.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-600"
                                                style={{ width: `${(training.enrolled / training.maxSeats) * 100}% ` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-slate-500">{training.enrolled}/{training.maxSeats}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setAssigningTraining(training)}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                                        >
                                            Assign
                                        </button>
                                        <button
                                            onClick={() => navigate(`/admin/trainings/edit/${training.id}`)}
                                            className="text-slate-600 hover:text-slate-800 font-medium text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(training.id)}
                                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTrainings;
