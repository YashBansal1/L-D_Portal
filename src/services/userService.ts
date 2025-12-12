import type { EmployeeProfile } from '../types';

export const UserService = {
    getProfile: async (userId: string): Promise<EmployeeProfile | null> => {
        const response = await fetch(`/api/users/profile/${userId}`);
        if (!response.ok) return null; // Or throw
        return response.json();
    },

    getAllUsers: async (): Promise<any[]> => {
        const response = await fetch('/api/users');
        if (!response.ok) return [];
        return response.json();
    },

    getMyTeam: async (managerId: string): Promise<any[]> => {
        const response = await fetch(`/api/users/team/${managerId}`);
        if (!response.ok) return [];
        return response.json();
    },

    getDepartments: async (): Promise<string[]> => {
        // Hardcoded for now as per previous implementation plan or fetch from new endpoint if created. 
        // For MVP integration, keeping hardcoded list is fine or we can add an endpoint.
        // Let's keep it simple as backend doesn't have Department model yet.
        return ['Engineering', 'HR', 'Marketing', 'Sales', 'Management'];
    }
};
