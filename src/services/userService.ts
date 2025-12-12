import type { EmployeeProfile } from '../types';
import { AuthService } from './authService';

export const MOCK_PROFILES: Record<string, Partial<EmployeeProfile>> = {
    '1': {
        skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
        certifications: ['AWS Certified Developer', 'React Advanced'],
        totalLearningHours: 32,
        badges: [
            {
                id: 'b1',
                name: 'Silver',
                imageUrl: 'https://cdn-icons-png.flaticon.com/512/3176/3176396.png', // Placeholder
                criteria: '25 Learning Hours',
                awardedAt: '2023-06-15'
            }
        ]
    }
};

export const UserService = {
    getProfile: async (userId: string): Promise<EmployeeProfile | null> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const user = AuthService.getCurrentUser(); // simplified for mock
                // In real app we'd fetch by ID. Here we assume the ID matches if it exists in mock.
                if (user && user.id === userId && MOCK_PROFILES[userId]) {
                    resolve({ ...user, ...MOCK_PROFILES[userId] } as EmployeeProfile);
                } else if (user && user.id === userId) {
                    // Default empty profile
                    resolve({
                        ...user,
                        skills: [],
                        certifications: [],
                        totalLearningHours: 0,
                        badges: []
                    } as EmployeeProfile);
                } else {
                    resolve(null);
                }
            }, 500);
        });
    },

    getAllUsers: async (): Promise<any[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                // Return all mock users
                resolve([
                    { id: '1', name: 'John Doe', email: 'employee@example.com', role: 'EMPLOYEE', department: 'Engineering', managerId: '6' },
                    { id: '2', name: 'Jane Admin', email: 'admin@example.com', role: 'ADMIN', department: 'HR' },
                    { id: '3', name: 'Super Admin', email: 'super@example.com', role: 'SUPER_ADMIN', department: 'Management' },
                    { id: '4', name: 'Alice Smith', email: 'alice@example.com', role: 'EMPLOYEE', department: 'Marketing', managerId: '6' },
                    { id: '5', name: 'Bob Jones', email: 'bob@example.com', role: 'EMPLOYEE', department: 'Engineering', managerId: '6' },
                    { id: '6', name: 'Mike Manager', email: 'manager@example.com', role: 'MANAGER', department: 'Engineering' },
                ]);
            }, 500);
        });
    },

    getMyTeam: async (managerId: string): Promise<any[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`Fetching team for manager: ${managerId}`);
                // Mock filtering for simplicity
                resolve([
                    { id: '1', name: 'John Doe', email: 'employee@example.com', role: 'EMPLOYEE', department: 'Engineering', progress: 75 },
                    { id: '4', name: 'Alice Smith', email: 'alice@example.com', role: 'EMPLOYEE', department: 'Marketing', progress: 40 },
                    { id: '5', name: 'Bob Jones', email: 'bob@example.com', role: 'EMPLOYEE', department: 'Engineering', progress: 90 },
                ]);
            }, 500);
        });
    },

    getDepartments: async (): Promise<string[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(['Engineering', 'HR', 'Marketing', 'Sales', 'Management']);
            }, 200);
        });
    }
};
