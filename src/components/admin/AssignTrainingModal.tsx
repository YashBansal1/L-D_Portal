import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { assignTraining } from '../../store/trainingSlice';
import { fetchUsers, fetchDepartments } from '../../store/userSlice';
import { X, Users, CheckCircle } from 'lucide-react';
import type { Training } from '../../types';

interface AssignTrainingModalProps {
    training: Training;
    onClose: () => void;
}

const AssignTrainingModal: React.FC<AssignTrainingModalProps> = ({ training, onClose }) => {
    const dispatch = useAppDispatch();
    const { users, departments } = useAppSelector(state => state.users);
    const [assignType, setAssignType] = useState<'all' | 'department' | 'users'>('users');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchDepartments());
    }, [dispatch]);

    // Filter users to only show employees (not admins, super admins, or managers)
    const employeesOnly = users.filter(u => u.role === 'EMPLOYEE');

    // Handle "Select All" logic when type is 'all'
    const getUserIdsToAssign = () => {
        if (assignType === 'all') {
            return employeesOnly.map(u => u.id);
        } else if (assignType === 'department') {
            return employeesOnly.filter(u => u.department === selectedDepartment).map(u => u.id);
        } else {
            return selectedUsers;
        }
    };

    const handleAssign = async () => {
        const userIds = getUserIdsToAssign();
        if (userIds.length === 0) return;

        setIsSubmitting(true);
        await dispatch(assignTraining({ trainingId: training.id, userIds }));
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(onClose, 1500); // Close after success message
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold">Assign Training</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center py-8 text-green-600">
                            <CheckCircle size={48} className="mb-4" />
                            <p className="text-xl font-semibold">Assignment Successful!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Training</p>
                                <p className="font-semibold text-lg">{training.title}</p>
                            </div>

                            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                                <button
                                    onClick={() => setAssignType('users')}
                                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${assignType === 'users' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Select Users
                                </button>
                                <button
                                    onClick={() => setAssignType('department')}
                                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${assignType === 'department' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Department
                                </button>
                                <button
                                    onClick={() => setAssignType('all')}
                                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${assignType === 'all' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    All Employees
                                </button>
                            </div>

                            {assignType === 'users' && (
                                <div className="space-y-2 max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-2">
                                    {employeesOnly.map(user => (
                                        <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer" onClick={() => toggleUserSelection(user.id)}>
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedUsers.includes(user.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                                                {selectedUsers.includes(user.id) && <CheckCircle size={14} className="text-white" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-slate-500">{user.department}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {assignType === 'department' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Department</label>
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent"
                                    >
                                        <option value="">-- Select --</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {assignType === 'all' && (
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center gap-3 text-indigo-800 dark:text-indigo-300">
                                    <Users size={24} />
                                    <p className="text-sm">This will assign the training to all <strong>{employeesOnly.length}</strong> employees in the system.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {!isSuccess && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">
                            Cancel
                        </button>
                        <button
                            onClick={handleAssign}
                            disabled={isSubmitting || (assignType === 'users' && selectedUsers.length === 0) || (assignType === 'department' && !selectedDepartment)}
                            className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignTrainingModal;
