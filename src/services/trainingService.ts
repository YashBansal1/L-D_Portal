import type { Training, UserTrainingProgress } from '../types';
import { MOCK_PROFILES } from './userService';

const MOCK_TRAININGS: Training[] = [
    {
        id: '1',
        title: 'Advanced React Patterns',
        description: 'Master advanced React concepts including HOCs, Render Props, and Custom Hooks.',
        instructor: 'Sarah Drasner',
        startDate: '2023-11-15T10:00:00Z',
        endDate: '2023-11-17T17:00:00Z',
        durationHours: 12,
        type: 'technical',
        format: 'online',
        maxSeats: 30,
        enrolled: 25,
        isMandatory: false,
        status: 'upcoming',
        tags: ['React', 'Frontend', 'JavaScript']
    },
    {
        id: '2',
        title: 'Information Security Awareness',
        description: 'Mandatory annual training on information security best practices.',
        instructor: 'Security Team',
        startDate: '2023-11-01T09:00:00Z',
        endDate: '2023-11-30T18:00:00Z',
        durationHours: 2,
        type: 'compliance',
        format: 'online',
        maxSeats: 1000,
        enrolled: 850,
        isMandatory: true,
        status: 'ongoing',
        tags: ['Security', 'Compliance']
    },
    {
        id: '3',
        title: 'Effective Communication',
        description: 'Improve your verbal and written communication skills.',
        instructor: 'Simon Sinek',
        startDate: '2023-12-05T14:00:00Z',
        endDate: '2023-12-05T16:00:00Z',
        durationHours: 2,
        type: 'soft-skills',
        format: 'offline',
        maxSeats: 15,
        enrolled: 10,
        isMandatory: false,
        status: 'upcoming',
        tags: ['Soft Skills', 'Communication']
    },
    {
        id: '4',
        title: 'Node.js Microservices',
        description: 'Building scalable microservices with Node.js and Docker.',
        instructor: 'Dan Abramov',
        startDate: '2023-10-10T09:00:00Z',
        endDate: '2023-10-12T17:00:00Z',
        durationHours: 18,
        type: 'technical',
        format: 'hybrid',
        maxSeats: 20,
        enrolled: 20,
        isMandatory: false,
        status: 'completed',
        tags: ['Backend', 'Node.js', 'Docker']
    }
];

const MOCK_PROGRESS: UserTrainingProgress[] = [
    {
        userId: '1', // Employee
        trainingId: '4', // Completed Node.js
        status: 'completed',
        progress: 100,
        attendance: 100,
        enrolledAt: '2023-10-01T09:00:00Z',
        completedAt: '2023-10-12T17:00:00Z'
    },
    {
        userId: '1',
        trainingId: '2', // Ongoing Security
        status: 'enrolled',
        progress: 45,
        attendance: 0, // Online self-paced
        enrolledAt: '2023-11-01T10:00:00Z'
    },
    {
        userId: '1',
        trainingId: '1', // React Basics (For Quiz Testing)
        status: 'enrolled',
        progress: 0,
        attendance: 0,
        enrolledAt: new Date().toISOString()
    }
];

export const TrainingService = {
    getTrainings: async (): Promise<Training[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_TRAININGS]), 500));
    },

    getUserTrainings: async (userId: string): Promise<UserTrainingProgress[]> => {
        return new Promise(resolve => setTimeout(() => {
            resolve(MOCK_PROGRESS.filter(p => p.userId === userId));
        }, 500));
    },

    enroll: async (userId: string, trainingId: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Enrolled user ${userId} to training ${trainingId}`);
                resolve();
            }, 500);
        });
    },

    createTraining: async (training: Omit<Training, 'id' | 'enrolled' | 'status'>): Promise<Training> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newTraining: Training = {
                    ...training,
                    id: Math.random().toString(36).substr(2, 9),
                    enrolled: 0,
                    status: 'upcoming'
                };
                MOCK_TRAININGS.push(newTraining);
                resolve(newTraining);
            }, 500);
        });
    },

    assignTraining: async (trainingId: string, userIds: string[]): Promise<void> => {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`Assigned training ${trainingId} to users: ${userIds.join(', ')}`);
                resolve();
            }, 500);
        });
    },

    completeTraining: async (userId: string, trainingId: string): Promise<{ newBadges: string[] }> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const training = MOCK_TRAININGS.find(t => t.id === trainingId);
                const progress = MOCK_PROGRESS.find(p => p.userId === userId && p.trainingId === trainingId);

                if (training) {
                    // 1. Update Progress
                    if (progress) {
                        progress.status = 'completed';
                        progress.progress = 100;
                        progress.attendance = 100;
                        progress.completedAt = new Date().toISOString();
                    } else {
                        MOCK_PROGRESS.push({
                            userId,
                            trainingId,
                            status: 'completed',
                            progress: 100,
                            attendance: 100,
                            enrolledAt: new Date().toISOString(),
                            completedAt: new Date().toISOString()
                        });
                    }

                    // 2. Update Profile & Check Badges (Mock Logic)
                    const profile = MOCK_PROFILES[userId];
                    if (profile) {
                        const oldHours = profile.totalLearningHours || 0;
                        const newHours = oldHours + training.durationHours;
                        profile.totalLearningHours = newHours;

                        const newBadges: string[] = [];

                        // Simple badge logic
                        if (oldHours < 25 && newHours >= 25) {
                            newBadges.push('Silver');
                            profile.badges?.push({ id: `b-${Date.now()}`, name: 'Silver', criteria: '25 Hours', imageUrl: '', awardedAt: new Date().toISOString() });
                        }
                        if (oldHours < 50 && newHours >= 50) {
                            newBadges.push('Gold');
                            profile.badges?.push({ id: `b-${Date.now()}`, name: 'Gold', criteria: '50 Hours', imageUrl: '', awardedAt: new Date().toISOString() });
                        }
                        if (oldHours < 100 && newHours >= 100) {
                            newBadges.push('Platinum');
                            profile.badges?.push({ id: `b-${Date.now()}`, name: 'Platinum', criteria: '100 Hours', imageUrl: '', awardedAt: new Date().toISOString() });
                        }

                        resolve({ newBadges });
                    } else {
                        resolve({ newBadges: [] });
                    }
                } else {
                    resolve({ newBadges: [] });
                }
            }, 500);
        });
    },

    updateTraining: async (training: Training): Promise<Training> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const index = MOCK_TRAININGS.findIndex(t => t.id === training.id);
                if (index !== -1) {
                    MOCK_TRAININGS[index] = training;
                    resolve(training);
                }
            }, 500);
        });
    },

    deleteTraining: async (trainingId: string): Promise<void> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const index = MOCK_TRAININGS.findIndex(t => t.id === trainingId);
                if (index !== -1) {
                    MOCK_TRAININGS.splice(index, 1);
                }
                resolve();
            }, 500);
        });
    }
};
