import type { User } from '../types';

/* Mocks Removed */

export const AuthService = {
    login: async (email: string, password?: string, isQuickLogin?: boolean): Promise<User> => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, isQuickLogin })
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        return response.json();
    },

    logout: async (): Promise<void> => {
        // In a real app, call logout endpoint
        return Promise.resolve();
    },

    register: async (userData: any): Promise<User> => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Registration failed');
        }

        return response.json();
    },

    getCurrentUser: (): User | null => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    }
};
