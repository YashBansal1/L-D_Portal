import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Training, UserTrainingProgress } from '../types';
import { TrainingService } from '../services/trainingService';

interface TrainingState {
    list: Training[];
    userProgress: UserTrainingProgress[];
    isLoading: boolean;
    error: string | null;
}

const initialState: TrainingState = {
    list: [],
    userProgress: [],
    isLoading: false,
    error: null,
};

export const fetchTrainings = createAsyncThunk(
    'trainings/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await TrainingService.getTrainings();
        } catch (error) {
            return rejectWithValue('Failed to fetch trainings');
        }
    }
);

export const fetchUserProgress = createAsyncThunk(
    'trainings/fetchUserProgress',
    async (userId: string, { rejectWithValue }) => {
        try {
            return await TrainingService.getUserTrainings(userId);
        } catch (error) {
            return rejectWithValue('Failed to fetch user progress');
        }
    }
);

export const enrollInTraining = createAsyncThunk(
    'trainings/enroll',
    async ({ userId, trainingId }: { userId: string; trainingId: string }, { rejectWithValue, dispatch }) => {
        try {
            await TrainingService.enroll(userId, trainingId);
            // Refresh user progress to reflect new enrollment
            dispatch(fetchUserProgress(userId));
            return trainingId;
        } catch (error) {
            return rejectWithValue('Failed to enroll');
        }
    }
);

export const createTraining = createAsyncThunk(
    'trainings/create',
    async (training: Omit<Training, 'id' | 'enrolled' | 'status'>, { rejectWithValue }) => {
        try {
            return await TrainingService.createTraining(training);
        } catch (error) {
            return rejectWithValue('Failed to create training');
        }
    }
);

export const assignTraining = createAsyncThunk(
    'trainings/assign',
    async ({ trainingId, userIds }: { trainingId: string; userIds: string[] }, { rejectWithValue }) => {
        try {
            await TrainingService.assignTraining(trainingId, userIds);
            return { trainingId, count: userIds.length };
        } catch (error) {
            return rejectWithValue('Failed to assign training');
        }
    }
);

export const completeTraining = createAsyncThunk(
    'trainings/complete',
    async ({ userId, trainingId }: { userId: string; trainingId: string }, { rejectWithValue, dispatch }) => {
        try {
            const result = await TrainingService.completeTraining(userId, trainingId);
            // Refresh user progress
            dispatch(fetchUserProgress(userId));
            // In a real app we might verify if profile needs refresh, but here we should
            return { trainingId, newBadges: result.newBadges };
        } catch (error) {
            return rejectWithValue('Failed to complete training');
        }
    }
);

export const updateTraining = createAsyncThunk(
    'trainings/update',
    async (training: Training, { rejectWithValue }) => {
        try {
            return await TrainingService.updateTraining(training);
        } catch (error) {
            return rejectWithValue('Failed to update training');
        }
    }
);

export const deleteTraining = createAsyncThunk(
    'trainings/delete',
    async (trainingId: string, { rejectWithValue }) => {
        try {
            await TrainingService.deleteTraining(trainingId);
            return trainingId;
        } catch (error) {
            return rejectWithValue('Failed to delete training');
        }
    }
);

const trainingSlice = createSlice({
    name: 'trainings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrainings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchTrainings.fulfilled, (state, action: PayloadAction<Training[]>) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(fetchUserProgress.fulfilled, (state, action: PayloadAction<UserTrainingProgress[]>) => {
                state.userProgress = action.payload;
            })
            .addCase(enrollInTraining.fulfilled, () => {
                // Toast or notification could be handled here or in UI
            })
            .addCase(createTraining.fulfilled, (state, action: PayloadAction<Training>) => {
                state.list.push(action.payload);
            })
            .addCase(assignTraining.fulfilled, (state, action) => {
                const training = state.list.find(t => t.id === action.payload.trainingId);
                if (training) {
                    training.enrolled += action.payload.count;
                }
            })
            .addCase(completeTraining.fulfilled, () => {
                // Handle badging notification locally or via middleware
            })
            .addCase(updateTraining.fulfilled, (state, action: PayloadAction<Training>) => {
                const index = state.list.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteTraining.fulfilled, (state, action: PayloadAction<string>) => {
                state.list = state.list.filter(t => t.id !== action.payload);
            });
    },
});

export default trainingSlice.reducer;
