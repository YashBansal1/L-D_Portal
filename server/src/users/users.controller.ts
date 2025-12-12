import { Controller, Get, Param, NotFoundException, Patch, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private prisma: PrismaService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Return all users' })
    async getAllUsers() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                department: true,
                isActive: true,
                profile: true
            }
        });
        return users;
    }

    @Get('profile/:id')
    @ApiOperation({ summary: 'Get user profile' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Return user profile' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserProfile(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                profile: true,
                badges: true
            }
        });

        if (!user) throw new NotFoundException('User not found');

        // Exclude password from response for security
        const { password, ...userWithoutPassword } = user;

        return {
            ...userWithoutPassword,
            skills: user.profile?.skills ? user.profile.skills.split(',') : [],
            certifications: [], // Placeholder
            badges: user.badges || [],
            totalLearningHours: user.profile?.totalLearningHours || 0,
            bio: user.profile?.bio || '',
            avatar: user.profile?.avatar || ''
        };
    }

    @Get('team/:managerId')
    @ApiOperation({ summary: 'Get team members for a manager' })
    @ApiParam({ name: 'managerId', description: 'Manager User ID' })
    @ApiResponse({ status: 200, description: 'Return team members' })
    async getTeam(@Param('managerId') managerId: string) {
        // Logic: Find users where managerId matches? 
        // Schema doesn't have managerId on User yet based on previous steps?
        // Let's assume we need to filter by department or just return all for demo if manager logic isn't in DB.
        // Checking seed.ts, we didn't explicitly link managers.
        // But for "Integration" prompt, we should probably add filtered logic.
        // For now, let's return all users in the same department as the manager, excluding the manager.

        const manager = await this.prisma.user.findUnique({ where: { id: managerId } });
        if (!manager) throw new NotFoundException('Manager not found');

        const team = await this.prisma.user.findMany({
            where: {
                department: manager.department,
                NOT: { id: managerId },
                role: 'EMPLOYEE'
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                department: true,
                profile: true
            }
        });

        return team.map(u => ({
            ...u,
            progress: 0 // Mock progress for dashboard view until we aggregate Enrollments
        }));
    }

    @Patch(':id/access')
    @ApiOperation({ summary: 'Toggle user access (Revoke/Restore)' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User access updated' })
    async toggleUserAccess(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('User not found');

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
            select: {
                id: true,
                email: true,
                isActive: true
            }
        });

        return updatedUser;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update user details' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    async updateUser(
        @Param('id') id: string,
        @Body() data: { name?: string; role?: string; department?: string }
    ) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('User not found');

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                name: data.name,
                role: data.role,
                department: data.department
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                department: true,
                isActive: true
            }
        });

        return updatedUser;
    }
}
