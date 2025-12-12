import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

// Define DB Schema
export interface Data {
    users: any[];
    trainings: any[];
    enrollments: any[];
}

const defaultData: Data = { users: [], trainings: [], enrollments: [] };

@Injectable()
export class JsonDbService implements OnModuleInit {
    public data: Data = defaultData;
    private dbPath = path.join(process.cwd(), 'db.json');

    async onModuleInit() {
        try {
            const content = await fs.readFile(this.dbPath, 'utf-8');
            this.data = JSON.parse(content);
        } catch (error) {
            // File likely doesn't exist, start with defaults
            this.data = { ...defaultData };
            await this.seed();
        }
    }

    async seed() {
        if (this.data.users && this.data.users.length > 0) return;

        this.data.users = [
            { id: '1', name: 'John Doe', email: 'employee@example.com', role: 'EMPLOYEE', department: 'Engineering' },
            { id: '2', name: 'Jane Admin', email: 'admin@example.com', role: 'ADMIN', department: 'HR' },
            { id: '3', name: 'Super Admin', email: 'super@example.com', role: 'SUPER_ADMIN', department: 'Management' },
            { id: '4', name: 'Jane Smith', email: 'manager@example.com', role: 'MANAGER', department: 'Engineering' },
        ];
        this.data.trainings = [
            {
                id: '1',
                title: 'Advanced React Patterns',
                description: 'Master advanced React concepts including HOCs, Render Props, and Custom Hooks.',
                instructor: 'Sarah Drasner',
                startDate: '2023-11-15T10:00:00Z',
                endDate: '2023-11-17T17:00:00Z',
                durationHours: 12,
                type: 'technical',
                format: 'online',
                maxSeats: 30,
                enrolled: 25,
                isMandatory: false,
                status: 'upcoming',
                tags: ['React', 'Frontend', 'JavaScript']
            }
        ];
        await this.save();
        console.log('Database seeded!');
    }

    get users() { return this.data.users; }
    get trainings() { return this.data.trainings; }

    async save() {
        await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
    }
}
