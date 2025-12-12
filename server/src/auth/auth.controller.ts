import { Controller, Post, Body, UnauthorizedException, ConflictException, HttpCode, HttpStatus } from '@nestjs/common';
import { JsonDbService } from '../database/json-db.service';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
    constructor(private dbService: JsonDbService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: { email: string; password?: string }) {
        const user = this.dbService.users.find(u => u.email === body.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // If user has a password set (newly registered), verify it
        if (user.password) {
            if (!body.password) {
                throw new UnauthorizedException('Password required');
            }
            const isMatch = await bcrypt.compare(body.password, user.password);
            if (!isMatch) {
                throw new UnauthorizedException('Invalid credentials');
            }
        }

        // In a real app, generate JWT here. For now return user object directly.
        // We will stick to the same shape the frontend expects.
        // removing password from response
        const { password, ...result } = user;
        return {
            ...result,
            token: 'mock-jwt-token'
        };
    }

    @Post('register')
    async register(@Body() body: any) {
        const existingUser = this.dbService.users.find(u => u.email === body.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            name: body.name,
            email: body.email,
            password: hashedPassword,
            role: body.role,
            department: body.department,
            profile: {
                bio: '',
                avatar: `https://ui-avatars.com/api/?name=${body.name}`,
                totalLearningHours: 0,
                completedTrainings: [],
                skills: [],
                badges: []
            }
        };

        this.dbService.data.users.push(newUser);
        await this.dbService.save();

        const { password, ...result } = newUser;
        return result;
    }
}
