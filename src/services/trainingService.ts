import type { Training, UserTrainingProgress } from '../types';
import { MOCK_PROFILES } from './userService';

const MOCK_TRAININGS: Training[] = [];
const MOCK_PROGRESS: UserTrainingProgress[] = [];

export const TrainingService = {
    getTrainings: async (): Promise<Training[]> => {
        const response = await fetch('/api/trainings');
        if (!response.ok) throw new Error('Failed to fetch trainings');
        return response.json();
    },

    getUserTrainings: async (userId: string): Promise<UserTrainingProgress[]> => {
        const response = await fetch(`/api/trainings/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user trainings');
        return response.json();
    },

    enroll: async (userId: string, trainingId: string): Promise<void> => {
        const response = await fetch(`/api/trainings/${trainingId}/enroll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        if (!response.ok) throw new Error('Failed to enroll');
    },

    createTraining: async (training: Omit<Training, 'id' | 'enrolled' | 'status'>): Promise<Training> => {
        const response = await fetch('/api/trainings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(training)
        });
        if (!response.ok) throw new Error('Failed to create training');
        return response.json();
    },

    assignTraining: async (trainingId: string, userIds: string[]): Promise<void> => {
        // Implement assignment endpoint on backend if needed, skipping for MVP or implement simple mock logic on backend
        console.warn('Assign API not implemented on backend yet');
        return Promise.resolve();
    },

    completeTraining: async (userId: string, trainingId: string): Promise<{ newBadges: string[] }> => {
        const response = await fetch(`/api/trainings/${trainingId}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        if (!response.ok) throw new Error('Failed to complete training');
        return response.json();
    },

    updateTraining: async (training: Training): Promise<Training> => {
        // API not implemented in basic backend
        console.warn('Update API not implemented');
        return Promise.resolve(training);
    },

    deleteTraining: async (trainingId: string): Promise<void> => {
        // API not implemented in basic backend
        console.warn('Delete API not implemented');
        return Promise.resolve();
    }
};
