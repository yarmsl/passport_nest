import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const Swagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Passport')
    .setDescription('Документация passport')
    .setVersion('1.0.0')
    .addTag('seed-x-ceed')
    .addCookieAuth()
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/swagger', app, document);
};
