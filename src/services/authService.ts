import type { User } from '../types';

/*
const MOCK_USERS: User[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'employee@example.com',
        role: 'EMPLOYEE',
        department: 'Engineering',
        title: 'Software Engineer'
    },
    {
        id: '2',
        name: 'Jane Admin',
        email: 'admin@example.com',
        role: 'ADMIN',
        department: 'HR',
        title: 'L&D Manager'
    },
    {
        id: '3',
        name: 'Super Admin',
        email: 'super@example.com',
        role: 'SUPER_ADMIN',
        department: 'Management',
        title: 'Director'
    },
    {
        id: '4',
        name: 'Jane Smith',
        email: 'manager@example.com',
        role: 'MANAGER',
        department: 'Engineering',
        title: 'Engineering Manager'
    }
];
*/

export const AuthService = {
    login: async (email: string, password?: string): Promise<User> => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
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
