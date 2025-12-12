import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { TrainingModule } from './trainings/training.module';

@Module({
    imports: [DatabaseModule, AuthModule, TrainingModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
