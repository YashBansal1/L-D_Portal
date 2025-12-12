import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../types';
import { UserService } from '../services/userService';

// Need to update types to include User if not already exported or redefine here if partial
interface UserState {
    users: User[]; // Re-using User type
    departments: string[];
    isLoading: boolean;
}

const initialState: UserState = {
    users: [],
    departments: [],
    isLoading: false,
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
    return await UserService.getAllUsers();
});

export const fetchDepartments = createAsyncThunk('users/fetchDepartments', async () => {
    return await UserService.getDepartments();
});

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.departments = action.payload;
            });
    },
});

export default userSlice.reducer;
