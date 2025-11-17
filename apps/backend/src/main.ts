import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';

const developerDocumentation = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Backend documentation')
    .setDescription(
      'This API serves the endpoints required for all the functionalities of the application.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory());
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para tu frontend
  app.enableCors({
    origin: 'http://localhost:4000', // permite solo tu frontend
    credentials: true, // si usas cookies o auth headers
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (process.env.NODE_ENV !== 'production') {
    developerDocumentation(app);
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('❌ Error during bootstrap:', err);
  process.exit(1);
});
