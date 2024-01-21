import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();//habilitar CORS

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // await app.listen(3000);//el puerto va a cambiar dependiendo de donde despleguemos
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
