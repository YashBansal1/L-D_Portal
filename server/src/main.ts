import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors(); // Allow frontend to call

    const config = new DocumentBuilder()
        .setTitle('L&D Portal API')
        .setDescription('The Learning & Development Portal API description')
        .setVersion('1.0')
        // .addBearerAuth() // Uncomment when JWT auth is fully standard
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(process.env.PORT || 3000);
    console.log(`Application is running on: http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
