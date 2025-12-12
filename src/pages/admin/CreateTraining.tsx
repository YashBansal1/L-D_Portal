import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createTraining, updateTraining, fetchTrainings } from '../../store/trainingSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';

const CreateTraining = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { list: trainings } = useAppSelector(state => state.trainings);

    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        instructor: '',
        startDate: '',
        endDate: '',
        durationHours: 0,
        type: 'technical' as const,
        format: 'online' as const,
        maxSeats: 20,
        isMandatory: false,
        tags: '',
    });

    useEffect(() => {
        if (!trainings.length) {
            dispatch(fetchTrainings());
        }
    }, [dispatch, trainings.length]);

    useEffect(() => {
        if (isEdit && id) {
            const training = trainings.find(t => t.id === id);
            if (training) {
                setFormData({
                    ...training,
                    startDate: new Date(training.startDate).toISOString().slice(0, 16),
                    endDate: new Date(training.endDate).toISOString().slice(0, 16),
                    tags: training.tags ? training.tags.join(', ') : ''
                } as any);
            }
        }
    }, [isEdit, id, trainings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting training form...', { isEdit, id, formData });

        try {
            const trainingData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()),
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
            };

            if (isEdit && id) {
                console.log('Updating training:', trainingData);
                await dispatch(updateTraining({ ...trainingData, id } as any)).unwrap();
                console.log('Update successful');
            } else {
                console.log('Creating training:', trainingData);
                await dispatch(createTraining(trainingData)).unwrap();
                console.log('Creation successful');
            }
            // Refresh list to ensure up-to-date data
            dispatch(fetchTrainings());
            navigate('/admin/trainings');
        } catch (error) {
            console.error('Failed to save training:', error);
            alert(`Failed to save training: ${error}`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{isEdit ? 'Edit Training' : 'Create New Training'}</h2>
                <button onClick={() => navigate('/admin/trainings')} className="p-2 hover:bg-slate-100 rounded-full">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Instructor</label>
                        <input
                            type="text"
                            name="instructor"
                            value={formData.instructor}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Max Seats</label>
                        <input
                            type="number"
                            name="maxSeats"
                            value={formData.maxSeats}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent"
                        >
                            <option value="technical">Technical</option>
                            <option value="soft-skills">Soft Skills</option>
                            <option value="compliance">Compliance</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Format</label>
                        <select
                            name="format"
                            value={formData.format}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent"
                        >
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Start Date</label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">End Date</label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Duration (Hours)</label>
                        <input
                            type="number"
                            name="durationHours"
                            value={formData.durationHours}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="React, Frontend, etc."
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="isMandatory"
                        checked={formData.isMandatory}
                        onChange={handleCheckboxChange}
                        id="isMandatory"
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="isMandatory" className="text-sm font-medium">Mandatory Training (Requires Approval)</label>
                </div>

                <div className="pt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/trainings')}
                        className="flex-1 py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                        {isEdit ? 'Update Training' : 'Create Training'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTraining;
