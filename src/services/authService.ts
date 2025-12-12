import type { User } from '../types';

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

export const AuthService = {
    login: async (email: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = MOCK_USERS.find(u => u.email === email);
                if (user) {
                    resolve(user);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500); // Simulate network delay
        });
    },

    logout: async (): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 200);
        });
    },

    getCurrentUser: (): User | null => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    }
};
