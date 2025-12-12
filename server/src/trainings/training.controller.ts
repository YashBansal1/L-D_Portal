import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Trainings')
@Controller('trainings')
// force reload 2
export class TrainingController {
    constructor(private prisma: PrismaService) { }

    @Get()
    @ApiOperation({ summary: 'Get all trainings' })
    @ApiResponse({ status: 200, description: 'Return all trainings found' })
    async getTrainings() {
        // We need to return trainings with their tags formatted as array if we stored them as string
        const trainings = await this.prisma.training.findMany();
        return trainings.map(t => ({
            ...t,
            tags: t.tags ? t.tags.split(',') : []
        }));
    }

    @Post()
    @ApiOperation({ summary: 'Create a new training' })
    @ApiResponse({ status: 201, description: 'The training has been successfully created.' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Advanced React' },
                description: { type: 'string', example: 'Deep dive into patterns' },
                instructor: { type: 'string', example: 'Sarah Drasner' },
                startDate: { type: 'string', format: 'date-time' },
                endDate: { type: 'string', format: 'date-time' },
                durationHours: { type: 'number', example: 12 },
                type: { type: 'string', example: 'technical' },
                format: { type: 'string', example: 'online' },
                maxSeats: { type: 'number', example: 30 },
                tags: { type: 'array', items: { type: 'string' }, example: ['React', 'Frontend'] }
            }
        }
    })
    async createTraining(@Body() body: any) {
        const newTraining = await this.prisma.training.create({
            data: {
                title: body.title,
                description: body.description,
                instructor: body.instructor,
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
                durationHours: body.durationHours,
                type: body.type,
                format: body.format,
                maxSeats: body.maxSeats,
                isMandatory: body.isMandatory || false,
                status: 'upcoming',
                tags: Array.isArray(body.tags) ? body.tags.join(',') : body.tags
            }
        });

        return {
            ...newTraining,
            tags: newTraining.tags ? newTraining.tags.split(',') : []
        };
    }

    @Post(':id/enroll')
    @ApiOperation({ summary: 'Enroll a user in a training' })
    @ApiParam({ name: 'id', description: 'Training ID' })
    @ApiResponse({ status: 201, description: 'Enrollment successful' })
    @ApiResponse({ status: 404, description: 'Training not found' })
    @ApiResponse({ status: 409, description: 'User already enrolled' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', example: 'user-uuid' }
            }
        }
    })
    async enroll(@Param('id') id: string, @Body() body: { userId: string }) {
        const training = await this.prisma.training.findUnique({ where: { id } });
        if (!training) throw new NotFoundException('Training not found');

        const existingEnrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_trainingId: {
                    userId: body.userId,
                    trainingId: id
                }
            }
        });

        if (existingEnrollment) {
            throw new ConflictException('User already enrolled');
        }

        // Transaction to increment enrolled count and create enrollment
        const result = await this.prisma.$transaction(async (prisma) => {
            await prisma.training.update({
                where: { id },
                data: { enrolled: { increment: 1 } }
            });

            return prisma.enrollment.create({
                data: {
                    userId: body.userId,
                    trainingId: id,
                    status: 'enrolled',
                    progress: 0
                }
            });
        });

        return result;
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get trainings for a specific user' })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User trainings retrieved' })
    async getUserTrainings(@Param('userId') userId: string) {
        const enrollments = await this.prisma.enrollment.findMany({
            where: { userId },
            include: { training: true }
        });

        return enrollments.map(e => ({
            id: e.training.id,
            trainingId: e.training.id,
            title: e.training.title,
            description: e.training.description,
            instructor: e.training.instructor,
            startDate: e.training.startDate,
            endDate: e.training.endDate,
            durationHours: e.training.durationHours,
            type: e.training.type,
            format: e.training.format,
            maxSeats: e.training.maxSeats,
            enrolled: e.training.enrolled,
            isMandatory: e.training.isMandatory || false,
            tags: e.training.tags ? e.training.tags.split(',') : [],
            progress: e.progress,
            attendance: e.attendance,
            completionStatus: e.status,
            status: e.status
        }));
    }

    @Post(':id/complete')
    @ApiOperation({ summary: 'Mark a training as completed' })
    @ApiParam({ name: 'id', description: 'Training ID' })
    @ApiResponse({ status: 201, description: 'Training marked as completed' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', example: 'user-uuid' }
            }
        }
    })
    async completeTraining(@Param('id') id: string, @Body() body: { userId: string }) {
        const enrollment = await this.prisma.enrollment.update({
            where: {
                userId_trainingId: {
                    userId: body.userId,
                    trainingId: id
                }
            },
            data: {
                status: 'completed',
                progress: 100,
                completedAt: new Date()
            },
            include: {
                training: true
            }
        });

        // Award Badges
        const badge = await this.prisma.badge.create({
            data: {
                name: 'Course Champion',
                icon: 'award',
                description: `Successfully completed ${enrollment.training.title}`,
                userId: body.userId
            }
        });

        // Update Skills
        if (enrollment.training.tags) {
            const trainingTags = enrollment.training.tags.split(',').map(t => t.trim()).filter(t => t);

            const userProfile = await this.prisma.profile.findUnique({
                where: { userId: body.userId }
            });

            if (userProfile) {
                const currentSkills = userProfile.skills ? userProfile.skills.split(',').map(s => s.trim()) : [];
                const newSkills = [...new Set([...currentSkills, ...trainingTags])]; // Unique skills

                await this.prisma.profile.update({
                    where: { userId: body.userId },
                    data: {
                        skills: newSkills.join(',')
                    }
                });
            } else {
                // Should exist, but handle just in case or create? Profile usually created on registration.
                await this.prisma.profile.create({
                    data: {
                        userId: body.userId,
                        skills: trainingTags.join(','),
                        totalLearningHours: 0
                    }
                });
            }
        }

        return {
            enrollment,
            badges: [badge]
        };
    }
    @Put(':id')
    @ApiOperation({ summary: 'Update a training' })
    @ApiParam({ name: 'id', description: 'Training ID' })
    @ApiResponse({ status: 200, description: 'Training updated' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Updated Title' },
                startDate: { type: 'string' },
                endDate: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } }
            }
        }
    })
    async updateTraining(@Param('id') id: string, @Body() body: any) {
        const { id: _, ...data } = body;
        if (data.startDate) data.startDate = new Date(data.startDate);
        if (data.endDate) data.endDate = new Date(data.endDate);
        if (data.tags && Array.isArray(data.tags)) data.tags = data.tags.join(',');

        return this.prisma.training.update({
            where: { id },
            data
        });
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a training' })
    @ApiParam({ name: 'id', description: 'Training ID' })
    @ApiResponse({ status: 200, description: 'Training deleted' })
    async deleteTraining(@Param('id') id: string) {
        return this.prisma.$transaction(async (prisma) => {
            await prisma.enrollment.deleteMany({
                where: { trainingId: id }
            });
            return prisma.training.delete({
                where: { id }
            });
        });
    }

    @Post(':id/assign')
    @ApiOperation({ summary: 'Assign training to specific users' })
    @ApiParam({ name: 'id', description: 'Training ID' })
    @ApiResponse({ status: 201, description: 'Users assigned' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userIds: { type: 'array', items: { type: 'string' } }
            }
        }
    })
    async assignTraining(@Param('id') id: string, @Body() body: { userIds: string[] }) {
        const { userIds } = body;

        const operations = userIds.map(userId => {
            return this.prisma.enrollment.upsert({
                where: { userId_trainingId: { userId, trainingId: id } },
                update: {},
                create: { userId, trainingId: id, status: 'assigned', progress: 0 }
            });
        });

        await this.prisma.$transaction(operations);

        const count = await this.prisma.enrollment.count({ where: { trainingId: id } });
        await this.prisma.training.update({ where: { id }, data: { enrolled: count } });

        return { message: 'Assignments processed' };
    }
}
