import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../types';
import { AuthService } from '../services/authService';

const initialState: AuthState = {
    user: AuthService.getCurrentUser(),
    isAuthenticated: !!AuthService.getCurrentUser(),
    isLoading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (email: string, { rejectWithValue }) => {
        try {
            const user = await AuthService.login(email);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    await AuthService.logout();
    localStorage.removeItem('user');
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export default authSlice.reducer;
