import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TrainingModule } from './trainings/training.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [PrismaModule, AuthModule, TrainingModule, UsersModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
