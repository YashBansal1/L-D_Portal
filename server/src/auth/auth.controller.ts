import { Controller, Post, Body, UnauthorizedException, ConflictException, HttpCode, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private prisma: PrismaService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'employee@example.com' },
                password: { type: 'string', example: 'password123' }
            }
        }
    })
    async login(@Body() body: { email: string; password?: string }) {
        const user = await this.prisma.user.findUnique({
            where: { email: body.email }
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Account access revoked');
        }

        // If user has a password set, verify it ONLY if password is provided
        // If no password provided, we allow "Quick Login" (Bypass) as requested
        if (user.password && body.password) {
            const isMatch = await bcrypt.compare(body.password, user.password);
            if (!isMatch) {
                throw new UnauthorizedException('Invalid credentials');
            }
        }

        const { password, ...result } = user;
        return {
            ...result,
            token: 'mock-jwt-token'
        };
    }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john@example.com' },
                password: { type: 'string', example: 'securePassword123' },
                role: { type: 'string', example: 'EMPLOYEE' },
                department: { type: 'string', example: 'IT' }
            }
        }
    })
    async register(@Body() body: any) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: body.email }
        });

        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hashedPassword,
                role: body.role,
                department: body.department,
                profile: {
                    create: {
                        avatar: `https://ui-avatars.com/api/?name=${body.name}`,
                        totalLearningHours: 0
                    }
                }
            }
        });

        const { password, ...result } = newUser;
        return {
            ...result,
            token: 'mock-jwt-token'
        };
    }
}
