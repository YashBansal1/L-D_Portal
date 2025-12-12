export type Role = 'EMPLOYEE' | 'ADMIN' | 'SUPER_ADMIN' | 'MANAGER';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatarUrl?: string;
    department?: string;
    title?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// New Types for Training Module

export type TrainingStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type EnrollmentStatus = 'enrolled' | 'waitlisted' | 'completed' | 'dropped';

export interface Training {
    id: string;
    title: string;
    description: string;
    instructor: string;
    startDate: string;
    endDate: string;
    durationHours: number;
    type: 'technical' | 'soft-skills' | 'compliance';
    format: 'online' | 'offline' | 'hybrid';
    maxSeats: number;
    enrolled: number;
    isMandatory: boolean;
    department?: string[]; // Empty means open to all
    status: TrainingStatus;
    tags: string[];
}

export interface UserTrainingProgress {
    userId: string;
    trainingId: string;
    status: EnrollmentStatus;
    progress: number; // 0-100
    attendance: number; // 0-100
    certificateUrl?: string;
    enrolledAt: string;
    completedAt?: string;
}

export interface EmployeeProfile extends User {
    skills: string[];
    certifications: string[];
    totalLearningHours: number;
    badges: Badge[];
}

export interface Badge {
    id: string;
    name: 'Silver' | 'Gold' | 'Platinum';
    imageUrl: string;
    awardedAt: string;
    criteria: string;
}

export interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number; // Index of the correct option
}

export interface Quiz {
    id: string;
    trainingId: string;
    questions: Question[];
    passingScore: number; // e.g., 70%
}
