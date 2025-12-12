import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import trainingReducer from './trainingSlice';
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        trainings: trainingReducer,
        users: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
