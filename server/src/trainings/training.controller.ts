import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { JsonDbService } from '../database/json-db.service';

@Controller('trainings')
export class TrainingController {
    constructor(private dbService: JsonDbService) { }

    @Get()
    async getTrainings() {
        return this.dbService.trainings;
    }

    @Post()
    async create(@Body() training: any) {
        const newTraining = {
            ...training,
            id: Math.random().toString(36).substr(2, 9),
            enrolled: 0,
            status: 'upcoming'
        };
        this.dbService.trainings.push(newTraining);
        await this.dbService.save();
        return newTraining;
    }

    @Post(':id/enroll')
    async enroll(@Param('id') id: string, @Body('userId') userId: string) {
        const training = this.dbService.trainings.find(t => t.id === id);
        if (training) {
            training.enrolled += 1;
            // Also update user progress
            const enrollment = {
                userId,
                trainingId: id,
                status: 'enrolled',
                progress: 0,
                attendance: 0,
                enrolledAt: new Date().toISOString()
            };
            this.dbService.data.enrollments.push(enrollment);
            await this.dbService.save();
        }
        return { success: true };
    }

    @Get('user/:userId')
    async getUserTrainings(@Param('userId') userId: string) {
        return this.dbService.data.enrollments.filter(e => e.userId === userId);
    }

    @Post(':id/complete')
    async complete(@Param('id') id: string, @Body('userId') userId: string) {
        const enrollment = this.dbService.data.enrollments.find(e => e.userId === userId && e.trainingId === id);
        if (enrollment) {
            enrollment.status = 'completed';
            enrollment.progress = 100;
            enrollment.completedAt = new Date().toISOString();
            await this.dbService.save();
        }
        return { newBadges: ['Bronze Badge'] }; // Mock badge return
    }
}
