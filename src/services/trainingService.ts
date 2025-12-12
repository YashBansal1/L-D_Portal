import type { Training, UserTrainingProgress } from '../types';

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
        const response = await fetch(`/api/trainings/${trainingId}/assign`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userIds })
        });
        if (!response.ok) throw new Error('Failed to assign training');
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
        const response = await fetch(`/api/trainings/${training.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(training)
        });
        if (!response.ok) throw new Error('Failed to update training');
        return response.json();
    },

    deleteTraining: async (trainingId: string): Promise<void> => {
        const response = await fetch(`/api/trainings/${trainingId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete training');
    }
};
