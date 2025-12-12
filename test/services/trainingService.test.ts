import { describe, it, expect } from 'vitest';
import { TrainingService } from '../../src/services/trainingService';

describe('TrainingService', () => {
    it('should fetch all trainings', async () => {
        const trainings = await TrainingService.getTrainings();
        expect(Array.isArray(trainings)).toBe(true);
        expect(trainings.length).toBeGreaterThan(0);
    });

    it('should create a new training', async () => {
        const newTraining = {
            id: 'test-1',
            title: 'Test Training',
            description: 'Test Description',
            instructor: 'Test Instructor',
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            durationHours: 10,
            type: 'technical' as const,
            format: 'online' as const,
            maxSeats: 20,
            enrolled: 0,
            isMandatory: false,
            status: 'upcoming' as const,
            tags: ['test']
        };

        const createdPromise = TrainingService.createTraining(newTraining);
        await expect(createdPromise).resolves.toEqual(expect.objectContaining({ title: 'Test Training' }));
    });
});
