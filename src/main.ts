import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CORS_ORIGIN, PORT } from './configuration/env.conf';
import { Swagger } from './configuration/swagger.conf';

async function start() {
  const app = await NestFactory.create(AppModule);
  Swagger(app);
  app.setGlobalPrefix('/api');
  app.enableCors({ optionsSuccessStatus: 200, origin: CORS_ORIGIN });
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
start();
